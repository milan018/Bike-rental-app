import { BikeTypes } from "../config/Bike-options-config";

type Props = {
  selectedBikeTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const BikeTypesFilter = ({ selectedBikeTypes, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Bike Type</h4>
      {BikeTypes.map((bikeType) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={bikeType}
            checked={selectedBikeTypes.includes(bikeType)}
            onChange={onChange}
          />
          <span>{bikeType}</span>
        </label>
      ))}
    </div>
  );
};

export default BikeTypesFilter;
