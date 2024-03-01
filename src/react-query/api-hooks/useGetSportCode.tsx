import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllCode = async (token) => {
  try {
    const res = await HTTP.get(`/get-sports-bet`, {
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

const useGetSportCode = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_SPORT_CODE],
    queryFn: () => getAllCode(token),
  });

  return {
    userSportCode: data?.data,
    token,
    isLoadingCode: isLoading,
  };
};

export default useGetSportCode;
