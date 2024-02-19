import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getInfo = async (token) => {
  try {
    const res = await HTTP.get(`/dashboard`, {
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

const useGetDashBoardInfo = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  //   console.log(token);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_DASHBOARD_INFO],
    queryFn: () => getInfo(token),
  });
  return {
    dashboardData: data?.data,
    isLoadingData: isLoading,
  };
};

export default useGetDashBoardInfo;
