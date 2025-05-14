import { useQuery } from "react-query";
import * as apiClient from "../api-client";

import { useSearchContext } from "../contexts/SearchContext";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import BookingForm from "../Forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const search = useSearchContext();
  const { rentalType: contextRentalType } = useSearchContext();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const rentalTypeFromQuery = params.get("type") as "hourly" | "daily";
  const rentalTypeFromContext = contextRentalType as "hourly" | "daily";
  const { bikeId } = useParams();
  const { stripePromise } = useAppContext();
  const [rentalType] = useState<"daily" | "hourly">(
    rentalTypeFromQuery || rentalTypeFromContext || "daily"
  );
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [numberOfHours, setNumberOfHours] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const timeDifference = Math.abs(
        search.checkOut.getTime() - search.checkIn.getTime()
      );

      if (rentalType === "daily") {
        const days = timeDifference / (1000 * 60 * 60 * 24);
        setNumberOfDays(Math.ceil(days));
        setNumberOfHours(0);
      } else {
        const hours = timeDifference / (1000 * 60 * 60);
        setNumberOfHours(Math.ceil(hours));
        setNumberOfDays(0);
      }
    }
  }, [search.checkIn, search.checkOut, rentalType]);
  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        bikeId as string,
        numberOfDays.toString(),
        numberOfHours.toString(),
        rentalType as string
      ),
    {
      enabled: !!bikeId && (numberOfDays > 0 || numberOfHours > 0),
    }
  );

  const { data: bike } = useQuery(
    "fetchBikeByID",
    () => apiClient.fetchBikeById(bikeId as string),
    {
      enabled: !!bikeId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!bike) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        numberOfDays={numberOfDays}
        numberofHours={numberOfHours}
        bike={bike}
        rentalType={rentalType}
      />
      {currentUser && paymentIntentData && paymentIntentData.clientSecret && (
        <Elements
          key={paymentIntentData.clientSecret} // forces remount if clientSecret changes
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
            rentalType={rentalType}
            numberOfDays={numberOfDays}
            numberOfHours={numberOfHours}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
