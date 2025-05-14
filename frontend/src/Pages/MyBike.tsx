import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiMoney, BiStar } from "react-icons/bi";
import { MdSportsMotorsports } from "react-icons/md";
const MyBikes = () => {
  const { data: BikeData } = useQuery("fetchMyBikes", apiClient.fetchMyBikes, {
    onError: () => {},
  });

  if (!BikeData) {
    return <span>No Bikes found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Bikes</h1>
        <Link
          to="/add-bike"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Bike
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {BikeData.map((Bike) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{Bike.name}</h2>
            <div className="whitespace-pre-line">{Bike.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {Bike.city}, {Bike.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {Bike.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <MdSportsMotorsports className="mr-1" />
                {Bike.manufacturers}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />
                Rs{Bike.pricePerDay} per Day
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />
                Rs{Bike.pricePerHour} per Hour
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {Bike.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-bike/${Bike._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBikes;
