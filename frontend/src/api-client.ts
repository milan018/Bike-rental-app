import { RegisterFormData } from "./Pages/Register";
import { SignInFormData } from "./Pages/SignIn";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import {
  BikeSearchResponse,
  BikeType,
  UserType,
  PaymentIntentResponse,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./Forms/BookingForm/BookingForm";
export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};
export const addMyBike = async (BikeFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-bikes`, {
    method: "POST",
    credentials: "include",
    body: BikeFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add Bike");
  }

  return response.json();
};
export const fetchMyBikes = async (): Promise<BikeType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bikes`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Bike");
  }
  return response.json();
};
// DELETE bike by ID
export const deleteMyBikeById = async (bikeId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-bikes/${bikeId}`, {
    method: "DELETE",
    credentials: "include", // if you're using cookies for auth
  });

  if (!response.ok) {
    throw new Error("Failed to delete bike");
  }

  return response.json();
};
export const fetchMyBikeById = async (bikeId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/my-bikes/${bikeId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching bikes");
  }
  return response.json();
};
export const updateMyBikeById = async (bikeFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-bikes/${bikeFormData.get("bikeId")}`,
    {
      method: "PUT",
      body: bikeFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Bike");
  }

  return response.json();
};

export type SearchParams = {
  name?: string;
  checkIn?: string;
  checkOut?: string;

  page?: string;
  facilities?: string[];
  types?: string[];
  manufacturers?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};
export const searchBikes = async (
  searchParams: SearchParams
): Promise<BikeSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("name", searchParams.name || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");

  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.manufacturers?.forEach(
    (manufacturer) => queryParams.append("manufacturers", manufacturer) // Corrected typo here
  );
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/bikes/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching bikess");
  }

  return response.json();
};
export const fetchBikes = async (): Promise<BikeType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/bikes`);
  if (!response.ok) {
    throw new Error("Error fetching bikes");
  }
  return response.json();
};
export const fetchBikeById = async (bikeId: string): Promise<BikeType> => {
  const response = await fetch(`${API_BASE_URL}/api/bikes/${bikeId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};
/*export const createEsewaPayment = async (
  bikeId: string,
  numberOfDays: string
): Promise<{ paymentUrl: string; totalCost: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/bikes/${bikeId}/bookings/initiate`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfDays }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error creating eSewa payment");
  }

  return response.json();
};
*/ export const createPaymentIntent = async (
  bikeId: string,
  numberOfDays: string,
  numberOfHours: string,
  rentalType: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/bikes/${bikeId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfDays, numberOfHours, rentalType }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createBikeBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/bikes/${formData.bikeId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    // Handle specific error types
    if (errorData.errorType === "UNAVAILABLE") {
      throw new Error("Bike is not available");
    }

    throw new Error(errorData.message || "Error booking bike");
  }
};
export const fetchMyBookings = async (): Promise<BikeType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};
export const cancelBooking = async (bikeId: string, bookingId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-bookings/${bikeId}/${bookingId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to cancel booking");
  }

  return response.json();
};
