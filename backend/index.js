import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import {register} from "./controllers/UserController.js";
import {createPost} from "./controllers/postController.js";
import { verifyToken } from "./middleware/auth.js";

// configrations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet);
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// file storage
const storage = multer.diskStorage({
    destination: function(req, res, cb) {
        cb(null, 'public/assets');
    },
    filename: function(req, res, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

// routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// mongoose setUp
const PORT  = process.env.PORT || 5000;
mongoose
.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, console.log(`Server running on: ${PORT}`));
})
.catch ((err) => console.log(`${err} did not connect`));