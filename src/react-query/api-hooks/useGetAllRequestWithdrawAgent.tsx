import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllWithdraw = async (token) => {
  try {
    const res = await HTTP.get(`/get-agentwithdraws`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

const useGetAllRequestWithdrawAgent = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_AGENT_WITHDRAW],
    queryFn: () => getAllWithdraw(token),
  });

  return {
    userWithdrawDetails: data?.data?.data,
    token,
    isLoadingUserWithdraw: isLoading,
  };
};

export default useGetAllRequestWithdrawAgent;
