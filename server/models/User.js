import { pool } from '../helper/db.js';

const selectUserByEmail = async (email) => {
    return await pool.query('SELECT * FROM users WHERE email = $1', [email]);
};

const insertUser = async (email, hashedPassword) => {
    return await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword]
    );
};

export { selectUserByEmail, insertUser };