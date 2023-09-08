import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import cors from "cors";
import { MONGODB_URI, ORIGIN, PORT } from "./constants.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAliveInitialDelay: 300000,
  };
  
  mongoose.connect(MONGODB_URI, mongooseOptions).then(
    () => {
      console.log("Connected to MongoDB");
    },
    (err) => {
      console.log("Error connecting to MongoDB: ", err);
    }
  );
  
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  const app = express();
app.set("view engine", "handlebars");
const corsOptions = {
  origin: [ORIGIN],
  credentials: true,
};

app.use(cookieParser());
app.use(helmet());

app.get("/", (req, res) => {
    res.send("Hello boi!");
  });
  
  app.use(express.json());
  
  app.use("/api/auth", cors(corsOptions), authRoutes);
  app.use("/api/post", cors(corsOptions), postRoutes);
  
  console.log(`Listening on port ${PORT}`);
  console.log("Testing for CI/CD")
  
  app.listen(PORT, () => {
    console.log("To the moon.");
  });