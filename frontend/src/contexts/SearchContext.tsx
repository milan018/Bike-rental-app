import React, { useContext, useState } from "react";

type RentalType = "hourly" | "daily";

type SearchContext = {
  destination: string;
  rentalType: RentalType;
  checkIn: Date;
  checkOut: Date;
  bikeId: string;
  saveSearchValues: (
    destination: string,
    rentalType: RentalType,
    checkIn: Date,
    checkOut: Date,
    bikeId?: string
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [rentalType, setRentalType] = useState<RentalType>(
    () => (sessionStorage.getItem("rentalType") as RentalType) || "daily"
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  const [bikeId, setBikeId] = useState<string>(
    () => sessionStorage.getItem("bikeId") || ""
  );

  const saveSearchValues = (
    destination: string,
    rentalType: RentalType,
    checkIn: Date,
    checkOut: Date,
    bikeId?: string
  ) => {
    setDestination(destination);
    setRentalType(rentalType);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    if (bikeId) setBikeId(bikeId);

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("rentalType", rentalType);
    sessionStorage.setItem("checkIn", checkIn.toISOString());
    sessionStorage.setItem("checkOut", checkOut.toISOString());
    if (bikeId) sessionStorage.setItem("bikeId", bikeId);
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        rentalType,
        checkIn,
        checkOut,
        bikeId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext;
};
