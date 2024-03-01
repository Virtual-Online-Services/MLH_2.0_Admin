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
    return error;
  }
};

const useGetProfileUser = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?.data?.id;
  const token = userInfo?.token;

  const { data, isLoading } = useQuery(
    [queryKeys.GET_USER_PROFILE, userId],
    () => getUsers(userId, token)
  );

  return {
    userProfileResponse: data?.data?.[0],
    token,
    isLoadingUserProfile: isLoading,
  };
};

export default useGetProfileUser;
