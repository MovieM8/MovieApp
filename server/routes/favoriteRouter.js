import { Router } from "express";
import { createFavorite, listFavorites, deleteFavorite, getSharelink, saveSharelink, deleteSharelink, getFavoritesBySharelink  } from "../controllers/FavoriteController.js";
import { auth } from "../helper/auth.js";

const router = Router();

router.post("/", auth, createFavorite);
router.get("/", auth, listFavorites);
router.delete("/:movieid", auth, deleteFavorite);

router.get("/favoritelink", auth, getSharelink);
router.post("/favoritelink/add", auth, saveSharelink);
router.delete("/favoritelink/delete", auth, deleteSharelink);
router.get("/sharelink/:sharelink", getFavoritesBySharelink);

export default router; 