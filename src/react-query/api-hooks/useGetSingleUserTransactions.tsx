import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getSingleUserTransactions = async (userid, token) => {
  try {
    const res = await HTTP.get(`/get-usertransactions/${userid}`, {
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

const useGetSingleUserTransactions = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const userId = userInfo?.data?.id;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_SINGLE_TRANSACTION, userId],
    queryFn: () => getSingleUserTransactions(userId, token),
  });

  return {
    userSingleTransactions: data?.data,
    token,
    isLoadingSingleTransaction: isLoading,
  };
};

export default useGetSingleUserTransactions;
