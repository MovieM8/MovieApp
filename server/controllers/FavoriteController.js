import { addFavorite, getFavoritesByUser, removeFavorite } from "../models/Favorite.js";
import { ApiError } from "../helper/ApiError.js";

const createFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { tmdbid, movie, sharelink } = req.body;

        if (!tmdbid || !movie) {
            return next(new ApiError("tmdbid and movie are required", 400));
        }

        const favorite = await addFavorite(userId, tmdbid, movie, sharelink);
        res.status(201).json(favorite);
    } catch (err) {
        next(err);
    }
};

const listFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const favorites = await getFavoritesByUser(userId);
        res.status(200).json(favorites);
    } catch (err) {
        next(err);
    }
};

const deleteFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { movieid } = req.params;

        const deleted = await removeFavorite(userId, movieid);
        if (!deleted) {
            return next(new ApiError("Favorite not found", 404));
        }

        res.status(200).json({ message: "Favorite removed", deleted });
    } catch (err) {
        next(err);
    }
};

export { createFavorite, listFavorites, deleteFavorite };