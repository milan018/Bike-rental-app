import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
interface AddReviewProps {
  bikeId: string;
}

const AddReview: React.FC<AddReviewProps> = ({ bikeId }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/api/reviews/${bikeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rating, comment }),
    });

    if (response.ok) {
      alert("Review submitted successfully");
      setRating(5);
      setComment("");
    } else {
      alert("Error submitting review");
    }
  };

  return (
    <form onSubmit={submitReview} className="mt-4 p-4 border rounded-lg">
      <label className="block text-sm font-medium">Rating:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full p-2 border rounded-md"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium mt-2">Comment:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full p-2 border rounded-md"
        required
      />

      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Submit Review
      </button>
    </form>
  );
};

export default AddReview;
