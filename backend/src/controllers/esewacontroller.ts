/*import { Request, Response } from "express";
import crypto from "crypto";
import * as dotenv from "dotenv";
import Bike from "../models/Bike";

dotenv.config();

// Define the type for the payload
interface EsewaPayload {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature?: string; // Optional property for the signature
}

export const initiateEsewaPayment = async (req: Request, res: Response) => {
  const { numberOfDays, transactionId } = req.body;
  const bikeId = req.params.bikeId;

  const bike = await Bike.findById(bikeId);
  if (!bike) {
    return res.status(400).json({ message: "Bike not found" });
  }
  const amount = bike.pricePerDay * numberOfDays;
  const payload: EsewaPayload = {
    amount: amount,
    tax_amount: 0,
    total_amount: amount,
    transaction_uuid: transactionId,
    product_code: process.env.ESEWA_MERCHANT_ID || "EPAYTEST", // Use environment variable
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: `${process.env.FRONTEND_URL}/success`, // Use environment variable
    failure_url: `${process.env.FRONTEND_URL}/failure`, // Use environment variable
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  // Generate signature
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "SECRET_KEY is missing! Set it in the environment variables."
    );
  }
  const signatureData = `total_amount=${payload.total_amount},transaction_uuid=${payload.transaction_uuid},product_code=${payload.product_code}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureData)
    .digest("base64");

  // Add the signature to the payload
  payload.signature = signature;

  console.log("Generated Payload:", payload);

  res.status(200).json({ url: process.env.ESEWA_PAYMENT_URL, payload });
};
/*
export const esewaPaymentSuccess = async (req: Request, res: Response) => {
  const { transaction_uuid, total_amount } = req.query;

  try {
    // Verify payment with eSewa
    const verificationResponse = await axios.get(
      `${process.env.ESEWA_TRANSACTION_STATUS_URL}?product_code=${process.env.ESEWA_MERCHANT_ID}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
    );

    const data = verificationResponse.data as { status: string }; // Type assertion

    if (data.status === "COMPLETE") {
      // Update your database with the payment status
      res.status(200).json({ message: "Payment successful" });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
    const newBooking = {
      ...req.body,
      userId: req.userId,
    };

    const bike = await Bike.findOneAndUpdate(
      { _id: req.params.bikeId },
      {
        $push: { bookings: newBooking },
      }
    );

    if (!bike) {
      return res.status(400).json({ message: "bike not found" });
    }

    await bike.save();
    res.status(200).send({ message: "Booking confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Payment verification failed", error });
  }
};
export const esewaPaymentSuccess = async (req: Request, res: Response) => {
  const { transaction_uuid, total_amount } = req.query;
  const { bikeId } = req.params;

  try {
    // Verify payment with eSewa
    const verificationResponse = await axios.get(
      `${process.env.ESEWA_TRANSACTION_STATUS_URL}?product_code=${process.env.ESEWA_MERCHANT_ID}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
    );

    const data = verificationResponse.data as { status: string };

    if (data.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Find bike and update booking
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    const newBooking = {
      ...req.body,
      userId: req.userId, // Ensure req.userId is populated in authentication middleware
    };

    bike.bookings.push(newBooking);

    await bike.save();

    res.status(200).json({ message: "Payment successful, Booking confirmed" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Payment verification failed", error: error.message });
  }
};
export const esewaPaymentFailure = async (req: Request, res: Response) => {
  res.status(400).json({ message: "Payment failed" });
};*/
