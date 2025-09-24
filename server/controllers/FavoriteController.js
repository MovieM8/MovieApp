import { addFavorite, getFavoritesByUser, removeFavorite, getFavoriteShare, upsertFavoriteShare, removeFavoriteShare, getSharedFavorites } from "../models/Favorite.js";
import { ApiError } from "../helper/ApiError.js";

const createFavorite = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));
        const { tmdbid, movie } = req.body;

        if (!tmdbid || !movie) {
            return next(new ApiError("tmdbid and movie are required", 400));
        }

        try {
            // Prevent duplicates
            const existing = await getFavoritesByUser(userId);
            if (existing.some((f) => f.movieid === tmdbid)) {
                return res.status(200).json({ message: "Already in favorites" });
            }
        } catch (err) {
            next(err);
        }

        const favorite = await addFavorite(userId, tmdbid, movie);
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

// Get user's sharelink
const getSharelink = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const share = await getFavoriteShare(userId);
        if (!share) {
            return res.status(404).json({ message: "No sharelink found" });
        }

        res.status(200).json(share);
    } catch (err) {
        next(err);
    }
};

// Add or update user's sharelink
const saveSharelink = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const { sharelink } = req.body;
        if (!sharelink) return next(new ApiError("sharelink is required", 400));

        const saved = await upsertFavoriteShare(userId, sharelink);
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// Delete user's sharelink
const deleteSharelink = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(new ApiError("User not authenticated", 401));

        const deleted = await removeFavoriteShare(userId);
        if (!deleted) {
            return next(new ApiError("Sharelink not found", 404));
        }

        res.status(200).json({ message: "Sharelink removed", deleted });
    } catch (err) {
        next(err);
    }
};

// Get favorite movies for a sharelink (public)
const getFavoritesBySharelink = async (req, res, next) => {
    try {
        const shlink = req.params.sharelink
        if (!shlink) return next(new ApiError("Sharelink is required", 400));

        const shared = await getSharedFavorites(shlink);
        if (!shared || shared.length === 0) {
            return res.status(404).json({ message: "No favorites found for this sharelink" });
        }

        res.status(200).json(shared);
    } catch (err) {
        next(err);
    }
};



export { createFavorite, listFavorites, deleteFavorite, getSharelink, saveSharelink, deleteSharelink, getFavoritesBySharelink };