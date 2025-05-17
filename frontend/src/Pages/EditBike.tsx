import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageBikeForm from "../Forms/ManageBikeForms/ManageBikeForm";
import { useAppContext } from "../contexts/AppContext";

const EditBike = () => {
  const { bikeId } = useParams();
  const { showToast } = useAppContext();
  const navigate = useNavigate();
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
  const deleteMutation = useMutation(
    () => apiClient.deleteMyBikeById(bikeId!),
    {
      onSuccess: () => {
        showToast({ message: "Bike Deleted", type: "SUCCESS" });
        navigate("/my-bikes"); // ⬅️ Navigate to bike list page after deletion
      },
      onError: () => {
        showToast({ message: "Error Deleting Bike", type: "ERROR" });
      },
    }
  );

  const handleSave = (bikeFormData: FormData) => {
    mutate(bikeFormData);
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      deleteMutation.mutate();
    }
  };
  return (
    <>
      <ManageBikeForm bike={bike} onSave={handleSave} isLoading={isLoading} />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 font-bold hover:bg-red-500 text-xl rounded"
        >
          Delete Bike
        </button>
      </div>
    </>
  );
};

export default EditBike;
