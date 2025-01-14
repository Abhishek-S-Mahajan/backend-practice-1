import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import imageUploadMiddleware from "../middleware/image-upload-middleware.js";
import { uploadImage, fetchImages } from "../controllers/image-controller.js";



const router = Router();

// upload image endpoint
router.post("/upload",
    authMiddleware,
    imageUploadMiddleware.single("image"),
    uploadImage
);



// get all the images endpoint
router.get("/all", fetchImages);



export default router;