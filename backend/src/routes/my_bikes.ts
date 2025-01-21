import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Bike, { BikeType } from "../models/Bike";
import verifyToken from "../middleware/auth";
const router = express.Router();
const storage = multer.memoryStorage();
import { body } from "express-validator";
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

//api/my_bikes
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),

    body("type").notEmpty().withMessage("Bike type is required"),
    body("pricePerDay")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per day is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newBike: BikeType = req.body;

      //upload the images to cloudinary
      const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      newBike.imageUrls = imageUrls;
      newBike.lastUpdated = new Date();
      newBike.userId = req.userId;
      //if upload was successful ,add the URLS to the new hotel
      //save the new hotel in our database
      const bike = new Bike(newBike);
      await bike.save();
      //return a 201 status
      res.status(201).send(bike);
    } catch (e) {
      console.log("Error creating a bike:", e);
      res.status(500).send({ message: "something went wrong" });
    }
  }
);
export default router;
