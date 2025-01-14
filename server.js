import express from "express";
import connectToDb from "./database/database-connect.js";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import imageRoutes from "./routes/image-routes.js";

const port = process.env.PORT || 3000;
const app = express();

//mongodb atlas connection
connectToDb();

//req.body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// enables resource to be shared b/w front-end and back-end on the same machine
// CORS-related issues
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization',);
    next();
});

// auth routes
app.use("/api/auth", authRoutes);

// user routes
app.use("/api/user", userRoutes);

// admin routes
app.use("/api/admin", adminRoutes);

// image routes
app.use("/api/image", imageRoutes);











// running the server
app.listen(port, () => console.log(`serving on port ${port}...`));