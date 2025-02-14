export type BikeType = {
  _id: string; // Use lowercase `string`
  userId: string;
  name: string;
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
};
export type BikeSearchResponse = {
  data: BikeType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
