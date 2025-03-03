import { useFormContext } from "react-hook-form";
import { manufaturersTypes } from "../../config/Bike-options-config";
import { BikeFormData } from "./ManageBikeForm";

const ManufacturerstypesSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BikeFormData>();

  const typeWatch = watch("manufacturers");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Type</h2>
      <div className="grid grid-cols-5 gap-2">
        {manufaturersTypes.map((manufacturers) => (
          <label
            className={
              typeWatch === manufacturers
                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={manufacturers}
              {...register("manufacturers", {
                required: "This field is required",
              })}
              className="hidden"
            />
            <span>{manufacturers}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default ManufacturerstypesSection;
