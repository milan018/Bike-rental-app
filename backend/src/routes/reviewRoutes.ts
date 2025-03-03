import express from "express";
import {
  addReview,
  getReviews,
  deleteReview,
} from "../controllers/reviewController";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.post("/:bikeId", verifyToken, addReview);
router.get("/:bikeId", getReviews);
router.delete("/:reviewId", verifyToken, deleteReview);

export default router;
