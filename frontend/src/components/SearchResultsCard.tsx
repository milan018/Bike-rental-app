import { Link } from "react-router-dom";
import { BikeType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";
type Props = {
  bike: BikeType;
};

const SearchResultsCard = ({ bike }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={bike.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: bike.starRating }).map(() => (
                <AiFillStar className="fill-yellow-400" />
              ))}
            </span>
            <span className="ml-1 text-sm">{bike.type}</span>
            <span className="ml-1  font-bold text-sm">
              {bike.manufacturers}
            </span>
          </div>
          <Link
            to={`/detail/${bike._id}`}
            className="text-2xl font-bold cursor-pointer"
          >
            {bike.name}
          </Link>
        </div>

        <div>
          <div className="line-clamp-4">{bike.description}</div>
        </div>

        <div className="grid grid-cols-[2fr_1fr] items-end whitespace-nowrap">
          <div className="flex gap-1 items-center flex-wrap">
            {bike.facilities.slice(0, 3).map((facility) => (
              <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {bike.facilities.length > 3 &&
                `+${bike.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col items-end text-right gap-1">
            <span className="font-bold">Rs{bike.pricePerDay} per Day</span>
            <Link
              to={`/detail/${bike._id}`}
              className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
