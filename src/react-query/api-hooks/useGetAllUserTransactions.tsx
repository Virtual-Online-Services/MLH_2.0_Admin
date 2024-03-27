import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllUserTransactions = async (token) => {
  try {
    const res = await HTTP.get(`/user-get-transactions`, {
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

const useGetAllUserTransactions = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_TRANSACTION],
    queryFn: () => getAllUserTransactions(token),
  });

  return {
    userTransactions: data?.data,
    token,
    isLoadingTransaction: isLoading,
  };
};

export default useGetAllUserTransactions;
