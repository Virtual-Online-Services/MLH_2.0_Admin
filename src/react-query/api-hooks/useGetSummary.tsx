import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getInfo = async (token: any) => {
  try {
    const res = await HTTP.get(`/admin-dashboard-summary`, {
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

const useGetSummary = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  //   console.log(token);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_TOTAL_SUMMARY],
    queryFn: () => getInfo(token),
  });
  return {
    dashboardSummaryData: data?.data,
    isLoadingSummaryData: isLoading,
  };
};

export default useGetSummary;
