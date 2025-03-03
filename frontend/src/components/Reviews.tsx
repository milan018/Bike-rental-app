import { useEffect, useState } from "react";
import { IReview } from "../types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
interface ReviewsProps {
  bikeId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ bikeId }) => {
  const [reviews, setReviews] = useState<IReview[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reviews/${bikeId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [bikeId]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="p-3 border-b">
            <strong>{review.user.name}</strong> ⭐{review.rating}
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
