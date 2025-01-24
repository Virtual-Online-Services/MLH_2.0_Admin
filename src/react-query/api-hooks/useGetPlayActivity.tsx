import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getInfo = async (token) => {
  try {
    const res = await HTTP.get(`/admin-get-playoperatoractivity`, {
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

const useGetPlayActivity = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  //   console.log(token);

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_ACTIVITY],
    queryFn: () => getInfo(token),
  });
  return {
    dashboardData: data?.data,
    isLoadingData: isLoading,
  };
};

export default useGetPlayActivity;
