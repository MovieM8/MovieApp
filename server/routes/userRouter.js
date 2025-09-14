
import { Router } from "express"
import { signUp, signIn, deleteAccount } from "../controllers/UserController.js";
import { auth } from "../helper/auth.js";

const router = Router()

router.post('/signup', signUp);
router.post('/signin', signIn);
router.delete('/delete', auth, deleteAccount);


export default router