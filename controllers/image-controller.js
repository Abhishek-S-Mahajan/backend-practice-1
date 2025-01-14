import Image from "../model/image.js";
import { uploadToCloudinary } from "../helpers/cloudinary-helper.js";
import fs from "fs";

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
        const images = await Image.find({});

        if (images) {
            return res.status(200).json({
                isSuccess: true,
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
