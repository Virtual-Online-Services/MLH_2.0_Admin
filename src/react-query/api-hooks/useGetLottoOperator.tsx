import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsersReferred = async (token) => {
  try {
    const res = await HTTP.get(`/get-operators`, {
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

const useGetLottoOperator = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_LOTTO_OPERATOR],
    queryFn: () => getUsersReferred(token),
  });

  return {
    userLottoOperator: data?.data,
    token,
    isLoadingLottoOperator: isLoading,
  };
};

export default useGetLottoOperator;
