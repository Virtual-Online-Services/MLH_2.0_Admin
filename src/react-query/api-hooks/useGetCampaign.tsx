import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getCampaign = async (id: any, token: any) => {
  try {
    const res = await HTTP.get(`/admin/campaigns/${id}`, {
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

const useGetCampaign = (id: any) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.GET_CAMPAIGN, id],
    queryFn: () => getCampaign(id, token),
    enabled: !!id,
  });

  // The shared HTTP fetcher returns the error object on catch rather than
  // throwing, so derive a not-found flag from the response status (404) as
  // well as react-query's own isError. The page consumes isNotFound to render
  // its not-found state.
  const status = data?.status ?? data?.response?.status;
  const isNotFound = status === 404;

  return {
    campaignResponse: data?.data,
    token,
    isLoadingCampaign: isLoading,
    isError: isError || isNotFound,
    isNotFound,
  };
};

export default useGetCampaign;
