import { pool } from "../helper/db.js";

// Insert screening time if not exists
const insertScreenTimeIfNotExists = async (screen) => {
    const { showid, theatreid, theatre, auditorium, starttime, movie, tmdbid } = screen;

    const existing = await pool.query(
        "SELECT * FROM screen_times WHERE showid = $1",
        [showid]
    );
    if (existing.rows.length > 0) {
        return existing.rows[0];
    } else {

        const client = await pool.connect();
        try {
            const result = await client.query(
                `INSERT INTO screen_times (showid, theatreid, theatre, auditorium, starttime, movie, tmdbid)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (showid) DO NOTHING
             RETURNING *`,
                [showid, theatreid, theatre, auditorium, starttime, movie, tmdbid]
            );
            return result.rows[0];
        } finally {
            client.release();
        }
    }
};

// Add screening time to a group
const addScreenTimeToGroup = async (userId, groupId, screen) => {
    const client = await pool.connect();
    try {
        // Check if user is approved member
        const memberCheck = await client.query(
            `SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2 AND pending = FALSE`,
            [userId, groupId]
        );
        if (memberCheck.rows.length === 0) throw new Error("User not authorized or pending member");

        // Insert screen time if not exists
        const existingScreen = await insertScreenTimeIfNotExists(screen);

        // If insertScreenTimeIfNotExists returned null (because of ON CONFLICT), fetch the existing row
        if (!existingScreen) {
            const { showid } = screen;
            const result = await pool.query(
                `SELECT * FROM screen_times WHERE showid = $1`,
                [showid]
            );
            if (result.rows.length === 0) {
                throw new Error("Failed to find or insert screening time");
            }
            existingScreen = result.rows[0];
        }

        // Link screen time to group
        const result = await client.query(
            `INSERT INTO group_times (group_id, screentimeid)
             VALUES ($1, $2)
             ON CONFLICT (group_id, screentimeid) DO NOTHING
             RETURNING *`,
            [groupId, existingScreen ? existingScreen.id : null]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Remove screening time from a group (unlink only)
const removeScreenTimeFromGroup = async (userId, groupTimeId) => {
    const client = await pool.connect();
    try {
        // Verify user belongs to the group
        const verify = await client.query(
            `SELECT gt.id
             FROM group_times gt
             JOIN group_members gm ON gm.group_id = gt.group_id
             WHERE gt.id = $1 AND gm.user_id = $2 AND gm.pending = FALSE`,
            [groupTimeId, userId]
        );
        if (verify.rows.length === 0) throw new Error("User not authorized or pending member");

        const result = await client.query(
            "DELETE FROM group_times WHERE id = $1 RETURNING *",
            [groupTimeId]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Get all screening times for a group
const getScreenTimesByGroup = async (groupId) => {
    const result = await pool.query(
        `SELECT gt.id AS group_time_id, st.*
         FROM group_times gt
         JOIN screen_times st ON gt.screentimeid = st.id
         WHERE gt.group_id = $1
         ORDER BY st.starttime ASC`,
        [groupId]
    );
    return result.rows;
};

export {
    insertScreenTimeIfNotExists,
    addScreenTimeToGroup,
    removeScreenTimeFromGroup,
    getScreenTimesByGroup
};
