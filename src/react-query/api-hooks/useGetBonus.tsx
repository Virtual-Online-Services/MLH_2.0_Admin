import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsersBonus = async (token) => {
  try {
    const res = await HTTP.get(`/get-operator-bonus`, {
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

const useBonusUser = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_BONUS],
    queryFn: () => getUsersBonus(token),
  });

  return {
    userBonus: data?.data?.data,
    token,
    isLoadingBonus: isLoading,
  };
};

export default useBonusUser;
