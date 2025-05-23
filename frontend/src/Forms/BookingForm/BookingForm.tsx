/* 

import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent?: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;

  checkIn: string;
  checkOut: string;
  bikeId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const { bikeId } = useParams();
  const { showToast } = useAppContext();
  const search = useSearchContext();

  // Mutation to create the room booking after payment is successful
   const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );*/

/*const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,

      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      bikeId: bikeId,
      //totalCost: paymentIntent?.totalCost,
      //paymentIntentId: paymentIntent?.paymentIntentId,
    },
  });

  return (
    <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
    </form>
  );
};

export default BookingForm;
/* <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        {paymentIntent ? (
          <div className="bg-blue-200 p-4 rounded-md">
            <div className="font-semibold text-lg">
              Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
            </div>
            <div className="text-xs">Includes taxes and charges</div>
          </div>
        ) : (
          <div>Loading payment details...</div>
        )}
      </div>*/

{
  /* Payment Section */
}
/*<div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>*/
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
  rentalType: "daily" | "hourly";
  numberOfDays: number;
  numberOfHours: number;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;

  checkIn: string;
  checkOut: string;
  bikeId: string;
  paymentIntentId: string;
  totalCost: number;
  rentalType: "daily" | "hourly";
  numberOfDays: number;
  numberOfHours: number;
};

const BookingForm = ({
  currentUser,
  paymentIntent,
  rentalType,
  numberOfDays,
  numberOfHours,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const search = useSearchContext();
  const { bikeId } = useParams();

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createBikeBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({
          message: "Booking  not available for selected dates",
          type: "ERROR",
        });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,

      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      bikeId: bikeId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
      rentalType,
      numberOfDays,
      numberOfHours,
    },
  });
  const navigate = useNavigate();
  // In your BookingForm component
  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) return;

    try {
      const result = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement) as StripeCardElement,
          },
        }
      );

      if (result.paymentIntent?.status === "succeeded") {
        try {
          await bookRoom({
            ...formData,
            paymentIntentId: result.paymentIntent.id,
          });
          navigate("/my-bookings");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // Handle specific error cases
          if (error.message.includes("no longer available")) {
            showToast({
              message:
                "Bike is no longer available. Please select different dates.",
              type: "ERROR",
            });
            navigate(`/bike/${bikeId}`);
          } else {
            showToast({
              message: /* error.message ||*/ "Bike is no longer available",
              type: "ERROR",
            });
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
      showToast({
        message:
          /*error.message || "Payment failed"*/ "Bike is no longer available",
        type: "ERROR",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: RS{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
