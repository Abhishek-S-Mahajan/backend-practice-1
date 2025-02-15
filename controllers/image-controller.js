import Image from "../model/image.js";
import { uploadToCloudinary } from "../helpers/cloudinary-helper.js";
import fs from "fs";
import cloudinary from "../config/cloudinary-config.js";
import { query } from "express";

export const uploadImage = async (req, res) => {
    try {

        // check if file is missing in request obj
        if (!req.file) {
            return res.status(400).json({
                isSuccess: false,
                message: "File is missing! Please upload an image"
            });
        }

        // upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        // store the image url and publicId along with the uploaded userId in the database in Images collection
        const newUploadedImage = await Image.create({
            url, publicId,
            uploadedBy: req.userInfo.userId
        });

        res.status(201).json({
            isSuccess: true,
            message: "Image Upload Successful",
            data: newUploadedImage
        });

        //delete the file from local storage
        fs.unlinkSync(req.file.path);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occured! Cannot upload the file please try again..."
        });

    }
}



export const fetchImages = async (req, res) => {
    try {

        const page = parseInt(req, query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        // skip the images displayed on first page and then render the next ones, to avoid duplication
        const skip = (page - 1) * limit;

        // default sort by date
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // use Math.ceil in case we get odd number of images
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);


        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const images = await Image.find({}).sort(sortObject).skip(skip).limit(limit);

        if (images) {
            return res.status(200).json({
                isSuccess: true,
                page: `${page} of ${totalPages}`,
                message: "Images Fetched Successful!",
                data: images
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occured! Cannot fetch the files please try again..."
        });
    }
}



export const deleteImage = async (req, res) => {
    try {

        const currentImageId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(currentImageId);

        if (!image) {
            return res.status(404).json({
                isSuccess: false,
                message: "An error occured! Image not found..."
            });
        }

        // check if this image is uploaded by the same user trying to delete it now
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                isSuccess: false,
                message: "An error occured! You are not the owner of the image (only owners can delete the image)..."
            });
        }

        // delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete the image from mongodb
        await Image.findByIdAndDelete(currentImageId);

        res.status(200).json({
            isSuccess: true,
            message: "Image deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occured! Cannot delete the files please try again..."
        });
    }
}
