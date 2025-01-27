import { RegisterFormData } from "./Pages/Register";
import { SignInFormData } from "./Pages/SignIn";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { BikeType } from "../../backend/src/shared/types";

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
