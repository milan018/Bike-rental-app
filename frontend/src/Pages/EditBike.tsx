import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageBikeForm from "../Forms/ManageBikeForms/ManageBikeForm";
import { useAppContext } from "../contexts/AppContext";

const EditBike = () => {
  const { bikeId } = useParams();
  const { showToast } = useAppContext();

  const { data: bike } = useQuery(
    "fetchMyBikeById",
    () => apiClient.fetchMyBikeById(bikeId || ""),
    {
      enabled: !!bikeId,
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyBikeById, {
    onSuccess: () => {
      showToast({ message: "Bike Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Bike", type: "ERROR" });
    },
  });

  const handleSave = (bikeFormData: FormData) => {
    mutate(bikeFormData);
  };

  return (
    <ManageBikeForm bike={bike} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditBike;
