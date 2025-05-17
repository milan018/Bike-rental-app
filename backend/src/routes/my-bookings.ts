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
// DELETE /api/my-bookings/:bikeId/:bookingId
router.delete(
  "/:bikeId/:bookingId",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { bikeId, bookingId } = req.params;
      const userId = req.userId;

      // Find the bike and ensure the booking exists for this user
      const bike = await Bike.findOne({
        _id: bikeId,
        bookings: { $elemMatch: { _id: bookingId, userId: userId } },
      });

      if (!bike) {
        return res
          .status(404)
          .json({ message: "Booking not found or unauthorized" });
      }

      // Remove the booking
      await Bike.updateOne(
        { _id: bikeId },
        { $pull: { bookings: { _id: bookingId, userId: userId } } }
      );

      res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unable to cancel booking" });
    }
  }
);

export default router;
