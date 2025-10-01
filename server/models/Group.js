import { pool } from "../helper/db.js";

// Insert group
const createGroup = async (ownerId, groupname) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Insert group
        const groupResult = await client.query(
            `INSERT INTO movie_groups (groupname, groupowner)
       VALUES ($1, $2)
       RETURNING id, groupname, groupowner`,
            [groupname, ownerId]
        );

        const group = groupResult.rows[0];

        // Add owner to group_members as approved member
        await client.query(
            `INSERT INTO group_members (user_id, group_id, pending)
       VALUES ($1, $2, FALSE)`,
            [ownerId, group.id]
        );

        await client.query("COMMIT");
        return group;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

// List all groups (public)
const getAllGroups = async () => {
    const result = await pool.query(
        `SELECT g.id, g.groupname, u.username AS owner
     FROM movie_groups g
     JOIN users u ON g.groupowner = u.id
     ORDER BY g.groupname`
    );
    return result.rows;
};

// Get single group (only members can see details)
const getGroupById = async (groupId, userId) => {
    const result = await pool.query(
        `SELECT g.id, g.groupname, g.groupowner, g.movieid, u.username AS owner
     FROM movie_groups g
     JOIN users u ON g.groupowner = u.id
     WHERE g.id = $1
     AND EXISTS (
       SELECT 1 FROM group_members m 
       WHERE m.group_id = g.id AND m.user_id = $2 AND m.pending = FALSE
     )`,
        [groupId, userId]
    );
    return result.rows[0];
};

// Delete group (only owner)
const removeGroup = async (groupId, ownerId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Remove related group_times first
        await client.query(
            "DELETE FROM group_times WHERE group_id = $1",
            [groupId]
        );

        // Remove related group_members
        await client.query(
            "DELETE FROM group_members WHERE group_id = $1",
            [groupId]
        );

        // Remove related group_chats
        await client.query(
            "DELETE FROM group_chat WHERE group_id = $1",
            [groupId]
        );

        // Finally delete the group (only if owner matches)
        const result = await client.query(
            "DELETE FROM movie_groups WHERE id = $1 AND groupowner = $2 RETURNING *",
            [groupId, ownerId]
        );

        await client.query("COMMIT");
        return result.rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

// Join request
const requestToJoin = async (groupId, userId) => {
    /*const result = await pool.query(
        `INSERT INTO group_members (user_id, group_id, pending)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (user_id, group_id) DO NOTHING
     RETURNING *`,
        [userId, groupId]
    );*/

    /*const result = await pool.query(
        `INSERT INTO group_members (user_id, group_id, pending)
     VALUES ($1, $2, TRUE) RETURNING *`,
        [userId, groupId]
    );*/
    const result = await pool.query(
        `INSERT INTO group_members (user_id, group_id, pending)
        VALUES ($1, $2, TRUE)
        ON CONFLICT (user_id, group_id)
        DO UPDATE SET pending = group_members.pending
        RETURNING *`,
        [userId, groupId]
    );

    return result.rows[0];
};

// Approve/Reject member
const updateMembership = async (groupId, userId, approve) => {
    if (approve) {
        const result = await pool.query(
            "UPDATE group_members SET pending = FALSE WHERE group_id = $1 AND user_id = $2 RETURNING *",
            [groupId, userId]
        );
        return result.rows[0];
    } else {
        const result = await pool.query(
            "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *",
            [groupId, userId]
        );
        return result.rows[0];
    }
};

// Remove member (by owner) or leave (by self)
const removeMember = async (groupId, userId) => {
    const result = await pool.query(
        "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *",
        [groupId, userId]
    );
    return result.rows[0];
};

// Add movie to group
const addMovieToGroup = async (groupId, tmdbid, movie) => {
    await pool.query(
        "INSERT INTO movies (tmdbid, movie) VALUES ($1, $2) ON CONFLICT (tmdbid) DO NOTHING",
        [tmdbid, movie]
    );
    const result = await pool.query(
        `UPDATE movie_groups SET movieid = $1, groupmovie = $2 WHERE id = $3 RETURNING *`,
        [tmdbid, movie, groupId]
    );
    return result.rows[0];
};

// Add screening time to group
const addScreeningToGroup = async (groupId, screenTimeId) => {
    const result = await pool.query(
        `INSERT INTO group_times (group_id, screentimeid) VALUES ($1, $2)
     RETURNING *`,
        [groupId, screenTimeId]
    );
    return result.rows[0];
};

// Get all pending join requests for a group (with usernames)
const getPendingRequests = async (groupId) => {
    const result = await pool.query(
        `SELECT gm.id, gm.user_id, u.username, u.email
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     WHERE gm.group_id = $1 AND gm.pending = TRUE
     ORDER BY u.username ASC`,
        [groupId]
    );
    return result.rows;
};

// Get membership status
const getUserMembershipStatus = async (groupId, userId) => {
    const result = await pool.query(
        `SELECT pending FROM group_members WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
    );
    if (result.rows.length === 0) return "none";
    return result.rows[0].pending ? "pending" : "member";
};

// Get all members of a group with roles
const getAllGroupMembers = async (groupId) => {
    const result = await pool.query(
        `SELECT 
        gm.group_id,
        gm.user_id,
        u.username,
        CASE 
            WHEN gm.user_id = g.groupowner THEN 'owner'
            WHEN gm.pending = TRUE THEN 'pending'
            ELSE 'member'
        END AS role
     FROM group_members gm
     JOIN users u ON gm.user_id = u.id
     JOIN movie_groups g ON gm.group_id = g.id
     WHERE gm.group_id = $1
     ORDER BY role ASC, u.username ASC`,
        [groupId]
    );
    return result.rows;
};

// Get all groups where a user is a member (pending = false or true)
const getGroupsByUser = async (userId) => {
    const result = await pool.query(
        `SELECT g.id, g.groupname, g.groupowner, u.username AS owner, gm.pending
     FROM group_members gm
     JOIN movie_groups g ON gm.group_id = g.id
     JOIN users u ON g.groupowner = u.id
     WHERE gm.user_id = $1
     ORDER BY g.groupname ASC`,
        [userId]
    );
    return result.rows;
};

export {
    createGroup,
    getAllGroups,
    getGroupById,
    removeGroup,
    requestToJoin,
    updateMembership,
    removeMember,
    addMovieToGroup,
    addScreeningToGroup,
    getPendingRequests,
    getUserMembershipStatus,
    getAllGroupMembers,
    getGroupsByUser,
};
