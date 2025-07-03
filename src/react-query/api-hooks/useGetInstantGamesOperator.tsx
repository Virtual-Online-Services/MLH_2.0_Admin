import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const useAllInstantOperator = async (token: any) => {
  try {
    const res = await HTTP.get(`/get-instantgame-operators`, {
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

const useGetInstantGamesOperator = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_INSTANT_GAME_OPERATOR],
    queryFn: () => useAllInstantOperator(token),
  });

  return {
    userInstantOperator: data?.data,
    token,
    isLoadingInstantOperator: isLoading,
  };
};

export default useGetInstantGamesOperator;
