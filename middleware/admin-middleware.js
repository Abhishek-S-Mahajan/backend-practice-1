
export const isAdminMiddleware = (req, res, next) => {
    if (req.userInfo.role !== "admin") {
        return res.status(403).json({
            isSuccess: false,
            message: "Access Denied! Admin rights required..."
        });
    }
    next();
}