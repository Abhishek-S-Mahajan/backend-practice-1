import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import imageUploadMiddleware from "../middleware/image-upload-middleware.js";
import { uploadImage, fetchImages, deleteImage } from "../controllers/image-controller.js";



const router = Router();

// upload image endpoint
router.post("/upload",
    authMiddleware,
    imageUploadMiddleware.single("image"),
    uploadImage
);



// get all the images endpoint
router.get("/all", fetchImages);



// delete the image endpoint
router.delete("/:id", authMiddleware, deleteImage);



export default router;