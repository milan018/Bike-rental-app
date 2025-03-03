import mongoose from "mongoose";
import { BikeType, BookingType } from "../shared/types";
const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  userId: { type: String, required: true },
  totalCost: { type: Number, required: true },
});

// Define the BikeType interface

// Define the Mongoose schema
const bikeSchema = new mongoose.Schema<BikeType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturers: { type: String, required: true },
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
  bookings: [bookingSchema],
});

// Create the Mongoose model
const Bike = mongoose.model<BikeType>("Bike", bikeSchema);
export default Bike;
