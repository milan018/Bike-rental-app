import { BikeType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  numberOfDays: number;
  bike: BikeType;
  numberofHours: number;
  rentalType: "daily" | "hourly";
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,

  numberOfDays,
  numberofHours,
  rentalType,
  bike,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${bike.name}, ${bike.city}, ${bike.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold"> {checkIn.toLocaleString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold"> {checkOut.toLocaleString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Rental period:
        <div className="font-bold">
          {rentalType === "daily"
            ? `${numberOfDays} days`
            : `${numberofHours} hours`}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
