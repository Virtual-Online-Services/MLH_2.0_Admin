import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsersBonus = async (token: any) => {
  try {
    const res = await HTTP.get(`/get-lotto-bonus`, {
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

const useGetLottoBonus = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_LOTTO_BONUS],
    queryFn: () => getUsersBonus(token),
  });

  return {
    userLottoBonus: data?.data?.data,
    token,
    isLoadingLottoBonus: isLoading,
  };
};

export default useGetLottoBonus;
