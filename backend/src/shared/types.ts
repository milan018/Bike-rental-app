export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
};
export type BikeType = {
  _id: string; // Use lowercase `string`
  userId: string;
  name: string;
  manufacturers: string;
  city: string;
  country: string;
  description: string;
  type: string;
  color: string;
  Mileage: number;
  pricePerDay: number;
  Fuel_Type: string;
  Weight_Cpacity: number;
  facilities: string[];
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
};
export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};
export type BikeSearchResponse = {
  data: BikeType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};
