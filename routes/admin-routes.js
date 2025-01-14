import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { isAdminMiddleware } from "../middleware/admin-middleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, isAdminMiddleware, (req, res) => {
    res.status(200).json({
        isSuccess: true,
        message: "Welcome to the admin dashboard page"
    });
});


export default router;