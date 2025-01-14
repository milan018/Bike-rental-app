import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
const SignOUtButton = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const handleclick = () => {
    mutation.mutate();
  };
  return (
    <button
      onClick={handleclick}
      className="text-blue-600 px-3 font-bold hover:bg-gray-100"
    >
      Sign Out
    </button>
  );
};
export default SignOUtButton;
