import bcrypt from "bcrypt";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

//register
export const registerNewUser = async (req, res) => {
    try {

        // extract user info from the front-end
        const { username, email, password, role } = req.body;

        //check if the user already exists
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (checkExistingUser) {
            return res.status(400).json({
                isSuccess: false,
                message: "User already exists! Please try with a different email or username."
            });
        }

        // hash user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user with the info
        const newUser = await User.create({ username, email, password: hashedPassword, role: role || 'user' });

        if (!newUser) {
            return res.status(400).json({
                isSuccess: false,
                message: "User registration failed! Please try again.",
                data: newUser
            });
        }

        return res.status(201).json({
            isSuccess: true,
            message: `User registration successful! Welcome ${newUser.username}...`,
            data: newUser
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isSuccess: false,
            message: "An error occured! Something went wrong."
        })

    }
}



//login
export const loginExistingUser = async (req, res) => {
    try {

        // extract user info from the front-end
        const { username, password } = req.body;

        // check if the user exists with the given username
        const checkUser = await User.findOne({ username });

        // username is not found in the database
        if (!checkUser) {
            return res.status(400).json({
                isSuccess: false,
                message: "Invalid credentials! Please try again."
            });
        }

        // check if the password matches
        const checkPassword = await bcrypt.compare(password, checkUser.password);

        // password does not match
        if (!checkPassword) {
            return res.status(400).json({
                isSuccess: false,
                message: "Invalid credentials! Please try again."
            });
        }

        // create user token with some info stored and an expiration of 15 mins
        const accessToken = jwt.sign({
            userId: checkUser._id,
            username: checkUser.username,
            role: checkUser.role
        }, process.env.JWT_KEY, {
            expiresIn: "30m"
        });

        res.status(200).json({
            isSuccess: true,
            message: `Login Successful! Welcome back ${checkUser.username}...`,
            accessToken
        })




    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occured! Something went wrong."
        })

    }
}



//change password
export const changePassword = async (req, res) => {
    try {

        // get user id from "auth-middleware"
        const userID = req.userInfo.userId;

        // extract old password and new password from the request body
        const { oldPassword, newPassword } = req.body;

        // find the current logged-in user
        const currentUser = await User.findById(userID);

        if (!currentUser) {
            return res.status(400).json({
                isSuccess: false,
                message: "User not found! Please try again with different credentials."
            });
        }

        // check if the "oldPassword "matches with that of the "currentUser"
        const isPasswordMatch = await bcrypt.compare(oldPassword, currentUser.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                isSuccess: false,
                message: "Invalid Password! Please try again..."
            });
        }

        // hash the "newPassword"
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // update the "currentUser" password
        currentUser.password = hashedNewPassword;
        await currentUser.save();

        res.status(200).json({
            isSuccess: true,
            message: "Password updated successfully!"
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            isSuccess: false,
            message: "An error occured! Something went wrong."
        });
    }
}