import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const useAllSportsActivity = async (token) => {
  try {
    const res = await HTTP.get(`/play-sport-history-operator/1`, {
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

const useGetSportActivty = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_SPORT_ACTIVITY],
    queryFn: () => useAllSportsActivity(token),
  });

  return {
    userSportActivity: data?.data,
    token,
    isLoadingSportActivity: isLoading,
  };
};

export default useGetSportActivty;
