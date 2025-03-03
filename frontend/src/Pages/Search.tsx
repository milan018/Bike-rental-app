import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import BikeTypesFilter from "../components/BikeTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import ManuFactureTypesFilter from "../components/ManuFactureTypesFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedBikeTypes, setSelectedBikeTypes] = useState<string[]>([]);
  const [selectedManufactureTypes, setSelectedManufactureTypes] = useState<
    string[]
  >([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),

    page: page.toString(),
    stars: selectedStars,
    types: selectedBikeTypes,
    manufacturers: selectedManufactureTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: bikeData } = useQuery(["searchBikes", searchParams], () =>
    apiClient.searchBikes(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleBikeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const bikeType = event.target.value;

    setSelectedBikeTypes((prevBikeTypes) =>
      event.target.checked
        ? [...prevBikeTypes, bikeType]
        : prevBikeTypes.filter((bike) => bike !== bikeType)
    );
  };
  const handleManufactureTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const manufacturerType = event.target.value;
    setSelectedManufactureTypes((prevManufactureTypes) =>
      event.target.checked
        ? [...prevManufactureTypes, manufacturerType]
        : prevManufactureTypes.filter((type) => type !== manufacturerType)
    );
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <BikeTypesFilter
            selectedBikeTypes={selectedBikeTypes}
            onChange={handleBikeTypeChange}
          />
          <ManuFactureTypesFilter
            selectedManufactureTypes={selectedManufactureTypes}
            onChange={handleManufactureTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilityChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {bikeData?.pagination.total} Bikes found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerDayAsc">Price Per Day (low to high)</option>
            <option value="pricePerDayDesc">Price Per Day (high to low)</option>
          </select>
        </div>
        {bikeData?.data.map((bike) => (
          <SearchResultsCard bike={bike} />
        ))}
        <div>
          <Pagination
            page={bikeData?.pagination.page || 1}
            pages={bikeData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
