import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsersReferred = async (userId, token) => {
  try {
    const res = await HTTP.get(`/agent/referral/${userId}`, {
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
const useGetReferral = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?.data?.id;
  const token = userInfo?.token;

  const { data, isLoading } = useQuery(
    [queryKeys.GET_USER_REFERRED, userId],
    () => getUsersReferred(userId, token)
  );
  return {
    userReferred: data?.data,
    token,
    isLoadingUserReferred: isLoading,
  };
};

export default useGetReferral;
