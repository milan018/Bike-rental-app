/*import React, { useState } from "react";
import axios from "axios";

const Payment: React.FC = () => {
  const [numberOfDays, setNumberOfDays] = useState<number>(1);

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/esewa/:bikeId/bookings/initiate`,
        {
          numberOfDays,
          transactionId: `TXN_${Date.now()}`, // Generate a unique transaction ID
        }
      );

      // Create a form dynamically
      const form = document.createElement("form");
      form.method = "POST";
      form.action = response.data.url; // eSewa payment URL

      // Populate form with required payload
      Object.entries(response.data.payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit(); // Submit the form programmatically
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <div>
      <h1>Pay with eSewa</h1>
      <label>Number of Days:</label>
      <input
        type="number"
        value={numberOfDays}
        onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
        min="1"
        placeholder="Enter number of days"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
*/
