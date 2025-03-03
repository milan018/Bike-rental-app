import express, { Request, Response } from "express";
import Bike from "../models/Bike";
import { BikeSearchResponse, BookingType } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerDayAsc":
        sortOptions = { pricePerDay: 1 };
        break;
      case "pricePerDayDesc":
        sortOptions = { pricePerDay: -1 };
        break;
    }
    const pagesize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pagesize;
    const bikes = await Bike.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pagesize);
    const total = await Bike.countDocuments(query);
    const response: BikeSearchResponse = {
      data: bikes,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pagesize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/", async (req: Request, res: Response) => {
  try {
    const bikes = await Bike.find().sort("-lastUpdated");
    res.json(bikes);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching bikes" });
  }
});
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Bike ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const bike = await Bike.findById(id);
      res.json(bike);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching Bike" });
    }
  }
);
router.post(
  "/:bikeId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfDays } = req.body;
    const bikeId = req.params.bikeId;

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(400).json({ message: "Bike not found" });
    }

    const totalCost = bike.pricePerDay * numberOfDays;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "gbp",
      metadata: {
        bikeId,
        userId: req.userId,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
  }
);

router.post(
  "/:bikeId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "payment intent not found" });
      }

      if (
        paymentIntent.metadata.bikeId !== req.params.bikeId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
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
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);
// 1. Create Payment Intent
/*router.post(
  "/:bikeId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfDays } = req.body;
    const bikeId = req.params.bikeId;

    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(400).json({ message: "bike not found" });
    }

    const totalCost = bike.pricePerDay * numberOfDays;

    const paymentData = {
      amt: totalCost.toString(),
      pdc: "0",
      psc: "0",
      txAmt: "0",
      tAmt: totalCost.toString(),
      pid: `${bikeId}-${req.userId}-${Date.now()}`,
      scd: process.env.ESEWA_MERCHANT_CODE || "",
      su: process.env.ESEWA_CALLBACK_URL || "",
      fu: process.env.ESEWA_FAILURE_URL || "",
    };

    const paymentUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?${new URLSearchParams(
      paymentData
    ).toString()}`;

    res.json({ paymentUrl, totalCost });
  }
);
router.post(
  "/:bikeId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { amt, refId, pid } = req.body;

      // Update the verification URL to use query parameters
      const verificationUrl = `${process.env.ESEWA_VERIFICATION_URL}?amt=${amt}&pdc=0&psc=0&txAmt=0&tAmt=${amt}&pid=${pid}&scd=${process.env.ESEWA_MERCHANT_CODE}&su=${process.env.ESEWA_CALLBACK_URL}&fu=${process.env.ESEWA_FAILURE_URL}`;

      // Use axios.get since it's now a GET request
      const response = await axios.get<string>(verificationUrl, {
        headers: {
          Accept: "application/xml", // Important for receiving XML response
        },
      });

      if (!response.data.includes("<response_code>Success</response_code>")) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      // Save the booking if payment is verified
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
        return res.status(400).json({ message: "Bike not found" });
      }

      await bike.save();
      res.status(200).send({ message: "Booking confirmed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

/*
// 2. Create Booking (after payment verification)
router.post(
  "/:bikeId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { amt, refId, pid } = req.body;

      // Verify Payment with eSewa
      const verificationUrl = "https://rc.esewa.com.np/api/epay/transrec/ ";
      const verificationData = new URLSearchParams({
        amt,
        rid: refId,
        pid,
        scd: process.env.ESEWA_MERCHANT_CODE as string,
      }).toString();

      const response = await axios.post<string>(
        verificationUrl,
        verificationData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/xml", // Important for receiving XML response
          },
        }
      );

      if (!response.data.includes("<response_code>Success</response_code>")) {
        return res.status(400).json({ message: "Payment verification failed" });
      }

      // Save the booking if payment is verified
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
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);*/ /*
interface PaymentData {
  amount: any;
  failure_url: string;
  product_delivery_charge: string;
  product_service_charge: string;
  product_code: string;
  signed_field_names: string;
  success_url: string;
  tax_amount: string;
  total_amount: any;
  transaction_uuid: any;
  signature?: string; // Add signature as an optional field
}

import { generateHmacSha256Hash, safeStringify } from "./utils";
import Transaction from "../models/Payment";

router.post("/payment-intent", async (req, res) => {
  try {
    const { amount, productId } = req.body;

    let paymentData: PaymentData = {
      amount,
      failure_url: process.env.FAILURE_URL || "",
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: process.env.MERCHANT_CODE || "",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: process.env.SUCCESS_URL || "",
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: productId,
    };

    const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
    const signature = generateHmacSha256Hash(
      data,
      process.env.SECRET_KEY || ""
    );
    paymentData = { ...paymentData, signature };

    const payment = await axios.post(process.env.ESEWAPAYMENT_URL || "", null, {
      params: paymentData,
    });

    const reqPayment = JSON.parse(safeStringify(payment));

    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount,
      });
      await transaction.save();
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
});
router.post("/payment-status", async (req, res) => {
  try {
    const { product_id }: { product_id: string } = req.body; // Extract data from request body

    // Find the transaction by its id
    const transaction = await Transaction.findOne({ product_id });
    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    console.log("Transaction Found:", transaction);

    const paymentData = {
      product_code: process.env.MERCHANT_CODE || "",
      total_amount: transaction.amount,
      transaction_uuid: transaction.product_id,
    };

    const response = await axios.get(
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL || "",
      {
        params: paymentData,
      }
    );

    const paymentStatusCheck = JSON.parse(safeStringify(response));
    if (paymentStatusCheck.status === 200) {
      // Update the transaction status
      transaction.status = paymentStatusCheck.data.status;
      await transaction.save();
      return res
        .status(200)
        .json({ message: "Transaction status updated successfully" });
    }
  } catch (error: unknown) {
    console.error("Error updating transaction status:", error);
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
    return res.status(500).json({ message: "An unknown error occurred" });
  }
});*/

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }
  if (queryParams.manufacturers) {
    constructedQuery.manufacturers = {
      // <-- Corrected field name
      $in: Array.isArray(queryParams.manufacturers)
        ? queryParams.manufacturers
        : [queryParams.manufacturers],
    };
  }
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerDay = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};
export default router;
