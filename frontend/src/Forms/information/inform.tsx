import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type Props = {
  bikeId: string;
  pricePerDay: number;
  pricePerHour: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  rentalType: "hourly" | "daily";
};

const InfoForm = ({ bikeId, pricePerDay, pricePerHour }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [rentalType, setRentalType] = useState<"hourly" | "daily">("daily");

  const { watch, handleSubmit, setValue } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      rentalType: "daily",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const calculatePrice = () => {
    if (!checkIn || !checkOut) return 0;

    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return rentalType === "hourly"
      ? diffHours * pricePerHour
      : diffDays * pricePerDay;
  };

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues("", rentalType, data.checkIn, data.checkOut);
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues("", rentalType, data.checkIn, data.checkOut);
    navigate(`/bike/${bikeId}/booking?type=${rentalType}`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">Price: Rs{calculatePrice()}</h3>
      <div>
        <label>
          <input
            type="radio"
            value="daily"
            checked={rentalType === "daily"}
            onChange={() => setRentalType("daily")}
          />
          Daily Rental
        </label>
        <label>
          <input
            type="radio"
            value="hourly"
            checked={rentalType === "hourly"}
            onChange={() => setRentalType("hourly")}
          />
          Hourly Rental
        </label>
      </div>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30} // Choose time in 30-minute intervals
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa" // Example: March 8, 2025 3:30 PM
              placeholderText="Check-in Date & Time"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn} // Ensure checkout is after check-in
              maxDate={maxDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Check-out Date & Time"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>

          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
