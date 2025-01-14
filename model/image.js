import { Schema, model } from "mongoose";

const imageSchema = new Schema({
    url: {
        type: String,
        required: [true, "url cannot be blank"]
    },
    publicId: {
        type: String,
        required: [true, "publicId cannot be blank"]
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "uploadedBy cannot be blank"]
    }
}, { timestamps: true });

const Image = model("Image", imageSchema);

export default Image;