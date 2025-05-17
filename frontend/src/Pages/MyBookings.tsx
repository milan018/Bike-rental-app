/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useQueryClient } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const queryClient = useQueryClient();

  const { data: bikes } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (!bikes || bikes.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {bikes.map((bike) => (
        <div
          key={bike._id}
          className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5"
        >
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={bike.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {bike.name}
              <div className="text-xs font-normal">
                {bike.city}, {bike.country}
              </div>
            </div>
            {bike.bookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between"
              >
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toDateString()} -{" "}
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={async () => {
                    const confirmCancel = window.confirm(
                      "Do you want to cancel this booking?"
                    );
                    if (!confirmCancel) return;

                    try {
                      await apiClient.cancelBooking(bike._id, booking._id);
                      queryClient.invalidateQueries("fetchMyBookings");
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                      alert(error.message || "Failed to cancel booking");
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
