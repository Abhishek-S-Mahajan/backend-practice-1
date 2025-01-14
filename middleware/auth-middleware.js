import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {

    const token = req.headers["authorization"].split(" ")[1];
    // console.log(token);

    if (!token) {
        return res.status(401).json({
            isSuccess: false,
            message: "Access Denied! Please login to continue."
        });
    }

    // verify the token with the user database
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_KEY);
        // console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo;

        next();

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isSuccess: false,
            message: "Access Denied! Invalid Token..."
        });

    }

}
