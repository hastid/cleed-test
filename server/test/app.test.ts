import path from "path";
import request from "supertest";
import express, { Express, NextFunction, Request, Response } from "express";

import uploadRoute from "../routes/upload";
import { CustomError } from "../constants/interfaces";

describe("Server", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World");
    });

    app.use("/api", uploadRoute);

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof CustomError) {
        res.status(err.status).send(err.message);
      } else {
        res.status(500).send("Internal Server Error");
      }
    });
  });

  it('should return "File uploaded successfully" on POST /api/upload with valid image', async () => {
    // Request Server
    const response = await request(app)
      .post("/api/upload")
      .attach("file", "test/lib_test/image.jpeg");

    // Check the response status
    expect(response.status).toBe(200);
    // Check the response Message
    expect(response.body.message).toBe("File uploaded successfully");

    // Path of the uploaded image
    const imagePath = response.body.path;

    // GET request to retrieve the uploaded image
    const imageResponse = await request(app).get(imagePath);

    // Check the response status
    expect(imageResponse.status).toBe(200);
    // Check the header content-type
    expect(imageResponse.headers["content-type"]).toMatch(/^image\//i);
  });

  it('should return "Only image files are allowed" on POST /api/upload without an other type', async () => {
    // Request Server
    const response = await request(app)
      .post("/api/upload")
      .attach("file", "test/lib_test/pdf_type.pdf");

    // Check the response status
    expect(response.status).toBe(400);
    // Check the response Message
    expect(response.text).toBe("Only image files are allowed");
  });

  it('should return "No file uploaded" on POST /api/upload without an image', async () => {
    // Request Server
    const response = await request(app).post("/api/upload");

    // Check the response status
    expect(response.status).toBe(400);
    // Check the response Message
    expect(response.text).toBe("No file uploaded");
  });
});
