import fs from "fs";
import path from "path";
import { pool } from "./db.js";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

const __dirname = import.meta.dirname;

const initializeTestDb = async () => {
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../createdb_test.sql"),
    "utf8"
  );

  try {
    await pool.query(sql);
    console.log("Test database initialized successfully");
  } catch (err) {
    console.error("Error initializing test database", err);
  }
};

const insertTestUser = (user) => {
  return new Promise((resolve, reject) => {
    hash(user.password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      pool.query(
        "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
        [user.email, hashedPassword, user.username],
        (err) => {
          if (err) return reject(err);
          console.log("Test user inserted successfully");
          resolve();
        }
      );
    });
  });
};

const getToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY);
};

export { initializeTestDb, insertTestUser, getToken };
