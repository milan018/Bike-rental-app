import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import InfoForm from "../Forms/information/inform";

const Detail = () => {
  const { bikeId } = useParams();

  const { data: bike } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchBikeById(bikeId || ""),
    {
      enabled: !!bikeId,
    }
  );

  if (!bike) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="flex">
          {Array.from({ length: bike.starRating }).map(() => (
            <AiFillStar className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{bike.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {bike.imageUrls.map((image) => (
          <div className="h-[300px]">
            <img
              src={image}
              alt={bike.name}
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {bike.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{bike.description}</div>
        <div className="h-fit">
          <InfoForm pricePerDay={bike.pricePerDay} bikeId={bike._id} />
        </div>
      </div>
    </div>
  );
};

export default Detail;
