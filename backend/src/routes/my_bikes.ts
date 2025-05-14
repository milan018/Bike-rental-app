import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Bike from "../models/Bike";
import verifyToken from "../middleware/auth";
const router = express.Router();
const storage = multer.memoryStorage();
import { body } from "express-validator";
import { BikeType } from "../shared/types";
import adminAuth from "../middleware/adminAuth";
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
  adminAuth,
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
    body("pricePerHour")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per Hour is required and must be a number"),
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
      const imageUrls = await uploadImages(imageFiles);
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
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const bikes = await Bike.find({ userId: req.userId });
    res.json(bikes);
  } catch (error) {
    res.json(500).json({ message: "Error fetching Bikes" });
  }
});
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const bike = await Bike.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bikes" });
  }
});
router.put(
  "/:bikeId",
  verifyToken,
  adminAuth,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedbike: BikeType = { ...req.body, lastUpdated: new Date() };

      const bike = await Bike.findOneAndUpdate(
        {
          _id: req.params.bikeId,
          userId: req.userId,
        },
        updatedbike,
        { new: true }
      );

      // ✅ Fix: Check if bike is null before accessing properties
      if (!bike) {
        return res.status(404).json({ message: "Bike not found" });
      }

      const files = req.files as Express.Multer.File[];

      const updatedImageUrls = await uploadImages(files);
      bike.imageUrls = [...updatedImageUrls, ...(updatedbike.imageUrls || [])];
      await bike.save(); // Ensure changes are saved

      res.status(201).json(bike);
    } catch (error) {
      console.error("Error updating bike:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default router;
