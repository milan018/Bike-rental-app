import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Bike from "../models/Bike";
import { BikeType } from "../shared/types";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const bikes = await Bike.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });
    const results = bikes.map((bike) => {
      const userBookings = bike.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      /* const results = bikes.map((bike) => {
      const userBookings = bikes.bookings.filter(
        (booking) => booking.userId === req.userId
      );*/

      const bikeWithUserBookings: BikeType = {
        ...bike.toObject(),
        bookings: userBookings,
      };

      return bikeWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;
