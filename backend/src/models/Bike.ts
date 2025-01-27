import mongoose from "mongoose";
import { BikeType } from "../shared/types";

// Define the BikeType interface

// Define the Mongoose schema
const bikeSchema = new mongoose.Schema<BikeType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  color: { type: String, required: false },
  Mileage: { type: Number, required: false },
  pricePerDay: { type: Number, required: true },
  Fuel_Type: { type: String, required: false },
  Weight_Cpacity: { type: Number, required: false },
  facilities: [{ type: String, required: true }],
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true, default: Date.now },
});

// Create the Mongoose model
const Bike = mongoose.model<BikeType>("Bike", bikeSchema);
export default Bike;
