import mongoose from "mongoose";
export type BikeType = {
  _id: String;
  userId: String;
  name: String;
  city: String;
  country: String;
  description: String;
  type: String;
  color: String;
  Mileage: Number;
  pricePerDay: Number;
  Fuel_Type: String;
  Weight_Cpacity: Number;
  Facilities: String[];
  starRating: number;
  imageUrls: String[];
  lastUpdated: Date;
};
const bikeSchema = new mongoose.Schema<BikeType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },

  pricePerDay: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  Facilities: [{ type: String, required: true }],
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});
const Bike = mongoose.model<BikeType>("Bike", bikeSchema);
export default Bike;
