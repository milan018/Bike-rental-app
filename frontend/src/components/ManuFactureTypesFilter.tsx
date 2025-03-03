import { manufaturersTypes } from "../config/Bike-options-config";

type Props = {
  selectedManufactureTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ManufactureTypesFilter = ({
  selectedManufactureTypes,
  onChange,
}: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Manufacturer Types</h4>
      {manufaturersTypes.map((manufactureType) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded"
            value={manufactureType}
            checked={selectedManufactureTypes.includes(manufactureType)}
            onChange={onChange}
          />
          <span>{manufactureType}</span>
        </label>
      ))}
    </div>
  );
};

export default ManufactureTypesFilter;
