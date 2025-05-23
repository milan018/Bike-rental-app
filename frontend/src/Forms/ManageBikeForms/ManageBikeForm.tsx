import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import ImagesSection from "./ImageSection";
import { BikeType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";
import ManufacturerstypesSection from "./Manufacturerstypes";

export type BikeFormData = {
  name: string;
  manufacturers: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerDay: number;
  pricePerHour: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  mileage: number;
  Fuel_type: string;
};
type Props = {
  bike?: BikeType;
  onSave: (BikeFormData: FormData) => void;
  isLoading: boolean;
};

const ManageBikeForm = ({ onSave, isLoading, bike }: Props) => {
  const formMethods = useForm<BikeFormData>();
  const { handleSubmit, reset } = formMethods;
  useEffect(() => {
    reset(bike);
  }, [bike, reset]);
  const onSubmit = handleSubmit((formDataJson: BikeFormData) => {
    const formData = new FormData();
    if (bike) {
      formData.append("bikeId", bike._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("manufacturers", formDataJson.manufacturers);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerDay", formDataJson.pricePerDay.toString());
    formData.append("pricePerHour", formDataJson.pricePerHour.toString());
    formData.append("starRating", formDataJson.starRating.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }
    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });
    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      {" "}
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <ManufacturerstypesSection />
        <FacilitiesSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};
export default ManageBikeForm;
