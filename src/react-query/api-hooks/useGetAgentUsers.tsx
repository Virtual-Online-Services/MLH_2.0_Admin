import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllUsers = async (token) => {
  try {
    const res = await HTTP.get(`/get-agents`, {
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

const useGetAgentUsers = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_USERS_AGENT],
    queryFn: () => getAllUsers(token),
  });

  return {
    userAgentDetails: data?.data,
    token,
    isLoadingAgentUser: isLoading,
  };
};

export default useGetAgentUsers;
