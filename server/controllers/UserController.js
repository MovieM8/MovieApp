import { selectUserByEmail, insertUser, deleteUser } from "../models/User.js";
import { ApiError } from "../helper/ApiError.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const signUp = async (req, res, next) => {
    const { user } = req.body;
    if (!user || !user.email || !user.password || !user.username) {
        return next(new ApiError("Email, username and password are required", 400));
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(user.password)) {
        return alert("Password must be at least 8 characters long, contain at least one uppercase letter and one number") //next(
        //new ApiError(
        //    "Password must be at least 8 characters long, contain at least one uppercase letter and one number",
        //    400

        //)
        //);
    }

    try {
        const existing = await selectUserByEmail(user.email);
        if (existing.rows.length > 0) {
            return next(new ApiError("User already exists", 409));
        }
        hash(user.password, 10, async (err, hashedPassword) => {
            if (err) return next(err);
            try {
                const result = await insertUser(user.email, hashedPassword, user.username);
                res.status(201).json({ id: result.rows[0].id, email: user.email, username: user.username });
            } catch (error) {
                return next(error);
            }
        });
    } catch (error) {
        return next(error);
    }
};

const signIn = async (req, res, next) => {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
        return next(new ApiError("Email and password are required", 400));
    }
    try {
        const result = await selectUserByEmail(user.email);
        if (result.rows.length === 0) {
            return next(new ApiError("User not found", 404));
        }
        const dbUser = result.rows[0];
        compare(user.password, dbUser.password, (err, isMatch) => {
            if (err) return next(err);
            if (!isMatch) {
                return next(new ApiError("Invalid password", 401));
            }
            const token = jwt.sign({id: dbUser.id, user: dbUser.email }, process.env.JWT_SECRET_KEY);
            res.status(200).json({
                id: dbUser.id,
                username: dbUser.username,
                email: dbUser.email,
                token
            });
        });
    } catch (error) {
        return next(error);
    }
};

// deleting a user account
const deleteAccount = async (req, res, next) => {
    const { user } = req.body;
    const result = await selectUserByEmail(user.email);
    try {
        const email = user.email;
        if (!email) return next(new ApiError("Unauthorized", 401));

        const result = await deleteUser(user.email);
        if (result.rowCount === 0) {
            return next(new ApiError("User not found", 404));
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return next(error);
    }

};

export { signUp, signIn, deleteAccount };