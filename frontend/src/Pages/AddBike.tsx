import ManageBikeForm from "../Forms/ManageBikeForms/ManageBikeForm";
import { useMutation } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
const AddBike = () => {
  const { showToast } = useAppContext();

  const { mutate, isLoading } = useMutation(apiClient.addMyBike, {
    onSuccess: () => {
      showToast({ message: "Bike Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Bike", type: "ERROR" });
    },
  });
  const handleSave = (BikeFormData: FormData) => {
    mutate(BikeFormData);
  };

  return <ManageBikeForm onSave={handleSave} isLoading={isLoading} />;
};
export default AddBike;
