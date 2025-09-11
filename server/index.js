import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';

const port = process.env.port

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use('/user', userRouter); // Use the userRouter for /user routes

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: {
            message: err.message,
            status: statusCode
        }
    });
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});