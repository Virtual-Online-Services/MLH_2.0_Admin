import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const useAllSportsOperator = async (token) => {
  try {
    const res = await HTTP.get(`/get-sport-operators`, {
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

const useGetSportsOperator = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_SPORT_OPERATOR],
    queryFn: () => useAllSportsOperator(token),
  });

  return {
    userSportOperator: data?.data,
    token,
    isLoadingSportOperator: isLoading,
  };
};

export default useGetSportsOperator;
