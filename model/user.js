import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username cannot be blank"],
        unique: [true, "username already exists! please try with a different username"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email cannot be blank"],
        unique: [true, "user already exists with this email! please try with a different email"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password cannot be blank"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, { timestamps: true });

const User = model('User', userSchema);

export default User;