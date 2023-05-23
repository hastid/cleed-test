import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express, { Express, Request, Response, NextFunction } from "express";

import uploadRoute from "./routes/upload";
import { CustomError } from "./constants/interfaces";

// Env config
dotenv.config();

const app: Express = express();

// Enable CORS
app.use(cors());

// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes

// upload route
app.use("/api", uploadRoute);
// uploads images paths
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send("Internal Server Error");
  }
});

// Define the port
const port = process.env.PORT || 4343;

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
