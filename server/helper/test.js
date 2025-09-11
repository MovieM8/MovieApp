import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';

const __dirname = import.meta.dirname;

const initializeTestDb = () => {
    const sql =fs.readFileSync(path.resolve(__dirname, '../createdb.sql'),'utf8');

    pool.query(sql, (err) => {
        if (err) {
            console.error('Error initializing test database', err);
        } else {
            console.log('Test database initialized successfully');
        }
    });
}

const insertTestUser = (user) => {
    return new Promise((resolve, reject) => {
        hash(user.password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password', err);
                return reject(err);
            }
            pool.query('INSERT INTO account (email, password) VALUES ($1, $2)',
                [user.email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting test user: ', err);
                        return reject(err);
                    } else {
                        console.log('Test user inserted successfully');
                        resolve();
                    }
                });
        });
    });
}

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY);
}

export { initializeTestDb, insertTestUser, getToken };