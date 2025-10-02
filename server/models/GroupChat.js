import { pool } from "../helper/db.js";

// Add a chat message (only non-pending members)
const addGroupMessage = async (userId, groupId, msg) => {
    const client = await pool.connect();
    try {
        // Verify user is approved member
        const memberCheck = await client.query(
            `SELECT 1 FROM group_members WHERE user_id = $1 AND group_id = $2 AND pending = FALSE`,
            [userId, groupId]
        );
        if (memberCheck.rows.length === 0) throw new Error("User not authorized or pending member");

        // Insert chat message
        const result = await client.query(
            `INSERT INTO group_chat (user_id, group_id, msg)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, groupId, msg]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Get all chat messages for a group (latest -> oldest)
const getGroupMessages = async (userId, groupId) => {
    const client = await pool.connect();
    try {
        // Verify membership
        const memberCheck = await client.query(
            `SELECT 1 FROM group_members WHERE user_id = $1 AND group_id = $2 AND pending = FALSE`,
            [userId, groupId]
        );
        if (memberCheck.rows.length === 0) throw new Error("User not authorized or pending member");

        const result = await client.query(
            `SELECT gc.id, gc.msg, gc.send_at, gc.user_id, u.username
             FROM group_chat gc
             JOIN users u ON gc.user_id = u.id
             WHERE gc.group_id = $1
             ORDER BY gc.send_at DESC`,
            [groupId]
        );
        return result.rows;
    } finally {
        client.release();
    }
};

// Delete a chat message (only author OR group owner)
const deleteGroupMessage = async (userId, messageId) => {
    const client = await pool.connect();
    try {
        // Get message + group info
        const msgCheck = await client.query(
            `SELECT gc.id, gc.user_id, mg.groupowner
             FROM group_chat gc
             JOIN movie_groups mg ON gc.group_id = mg.id
             WHERE gc.id = $1`,
            [messageId]
        );
        if (msgCheck.rows.length === 0) throw new Error("Message not found");

        const message = msgCheck.rows[0];
        if (message.user_id !== userId && message.groupowner !== userId) {
            throw new Error("Not authorized to delete this message");
        }

        const result = await client.query(
            `DELETE FROM group_chat WHERE id = $1 RETURNING *`,
            [messageId]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

export { addGroupMessage, getGroupMessages, deleteGroupMessage };
