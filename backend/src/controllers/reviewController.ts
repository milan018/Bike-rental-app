import { Request, Response } from "express";
import Review from "../models/Review";
import Bike from "../models/Bike";
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
// Add a review
export const addReview = async (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  const { bikeId } = req.params;

  try {
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    const review = new Review({
      user: req.userId, // TypeScript now knows about req.user
      bike: bikeId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ bike: req.params.bikeId }).populate(
      "user",
      "name"
    );
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
