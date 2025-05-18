import Bike from "../models/Bike";

// Add this to your Bike model file
export async function isBikeAvailable(
  bikeId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const bike = await Bike.findById(bikeId);
  if (!bike) return false;

  return !bike.bookings.some((booking) => {
    const existingCheckIn = new Date(booking.checkIn);
    const existingCheckOut = new Date(booking.checkOut);

    return (
      (checkIn < existingCheckOut && checkOut > existingCheckIn) ||
      (existingCheckIn < checkOut && existingCheckOut > checkIn)
    );
  });
}
