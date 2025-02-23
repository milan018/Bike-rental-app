import { useQuery } from "react-query";
import * as apiClient from "../api-client";

import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import BookingForm from "../Forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const search = useSearchContext();
  const { bikeId } = useParams();
  const { stripePromise } = useAppContext();
  const [numberOfDays, setNumberOfDays] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const days =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfDays(Math.ceil(days));
    }
  }, [search.checkIn, search.checkOut]);
  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(bikeId as string, numberOfDays.toString()),
    {
      enabled: !!bikeId && numberOfDays > 0,
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
        bike={bike}
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
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
