import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsers = async (userId, token) => {
  try {
    const res = await HTTP.get(`/get-user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
};

const useGetProfileUser = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const userId = userInfo?.data?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.GET_USER_PROFILE, userId],
    queryFn: () => getUsers(userId, token),
    enabled: !!userId && !!token,
  });

  return {
    userProfileResponse: data?.data?.[0],
    token,
    isLoadingUserProfile: isLoading,
    error,
  };
};

export default useGetProfileUser;
