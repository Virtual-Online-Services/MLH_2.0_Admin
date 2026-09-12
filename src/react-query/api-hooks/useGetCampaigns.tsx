import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getCampaigns = async (token: any) => {
  try {
    const res = await HTTP.get(`/admin/campaigns`, {
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

const useGetCampaigns = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_CAMPAIGNS],
    queryFn: () => getCampaigns(token),
  });

  return {
    campaignsResponse: data?.data,
    token,
    isLoadingCampaigns: isLoading,
  };
};

export default useGetCampaigns;
