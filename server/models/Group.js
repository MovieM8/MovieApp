import { pool } from "../helper/db.js";

// Insert group
const createGroup = async (ownerId, groupname) => {
    const result = await pool.query(
        `INSERT INTO movie_groups (groupname, groupowner) 
     VALUES ($1, $2) 
     RETURNING id, groupname, groupowner`,
        [groupname, ownerId]
    );
    return result.rows[0];
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
        `SELECT g.id, g.groupname, g.groupowner, u.username AS owner
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
    const result = await pool.query(
        "DELETE FROM movie_groups WHERE id = $1 AND groupowner = $2 RETURNING *",
        [groupId, ownerId]
    );
    return result.rows[0];
};

// Join request
const requestToJoin = async (groupId, userId) => {
    const result = await pool.query(
        `INSERT INTO group_members (user_id, group_id, pending)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (user_id, group_id) DO NOTHING
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
};
