import { Router } from "express";
import { registerNewUser, loginExistingUser } from "../controllers/auth-controller.js";


const router = Router();

// register route
router.post("/register", registerNewUser);



// login route
router.post("/login", loginExistingUser);






export default router;