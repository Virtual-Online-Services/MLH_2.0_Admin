import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllGames = async (token) => {
  try {
    const res = await HTTP.get(`/get-games`, {
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

const useGetLottoGames = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_LOTTO_GAMES],
    queryFn: () => getAllGames(token),
  });

  return {
    userLottoGame: data?.data,
    token,
    isLoadingLottoGame: isLoading,
  };
};

export default useGetLottoGames;
