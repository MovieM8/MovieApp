import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter.js';
import favoriteRouter from "./routes/favoriteRouter.js";
import reviewRouter from "./routes/reviewRouter.js";


const port = process.env.port; 

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded bodies

app.use('/user', userRouter); // Use the userRouter for /user routes
app.use("/favorites", favoriteRouter); // Use the favoriteRouter for /favorites routes
app.use("/reviews", reviewRouter); // Use the reviewRouter for /reviews routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error in request:", err);
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


if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;