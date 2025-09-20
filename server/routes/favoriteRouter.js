import { Router } from "express";
import { createFavorite, listFavorites, deleteFavorite } from "../controllers/FavoriteController.js";
import { auth } from "../helper/auth.js";

const router = Router();

router.post("/", auth, createFavorite);
router.get("/", auth, listFavorites);
router.delete("/:movieid", auth, deleteFavorite);

export default router;