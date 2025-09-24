import { pool } from '../helper/db.js';

const selectUserByEmail = async (email) => {
    return await pool.query('SELECT * FROM users WHERE email = $1', [email]);
};

const insertUser = async (email, hashedPassword, username) => {
    return await pool.query(
        'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
        [email, hashedPassword, username]
    );
};

const deleteUser = async (email) => {
    //return await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Find user id
        const userRes = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            throw new Error('User not found');
        }
        const userId = userRes.rows[0].id;

        // 2. Delete dependent rows
        await client.query('DELETE FROM sharedfavorites WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM group_members WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM movie_groups WHERE groupowner = $1', [userId]);
        await client.query('DELETE FROM favorites WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM reviews WHERE user_id = $1', [userId]);
        
        // 3. Delete the user
        const deleteRes = await client.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId]
        );

        await client.query('COMMIT');
        return deleteRes.rows[0]; // return deleted user info
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }

};


export { selectUserByEmail, insertUser, deleteUser };