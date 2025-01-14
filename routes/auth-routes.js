import { Router } from "express";
import { registerNewUser, loginExistingUser, changePassword } from "../controllers/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";


const router = Router();

// register route
router.post("/register", registerNewUser);



// login route
router.post("/login", loginExistingUser);



// change password route
router.post("/change-password", authMiddleware, changePassword);






export default router;