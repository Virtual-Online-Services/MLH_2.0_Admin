import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getBank = async (token) => {
  try {
    const res = await HTTP.get(`/bank-accounts`, {
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

const useGetAllBank = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.GET_USER_BANK,
    queryFn: () => getBank(token),
  });

  return {
    allBanks: data?.data?.data,
    isLoadingBank: isLoading,
  };
};

export default useGetAllBank;
