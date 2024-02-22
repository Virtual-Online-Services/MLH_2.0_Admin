import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getAllUsers = async (token) => {
  try {
    const res = await HTTP.get(`/admin/get-users`, {
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

const useGetUsers = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ALL_USERS],
    queryFn: () => getAllUsers(token),
  });

  return {
    userDetails: data?.data,
    token,
    isLoadingUser: isLoading,
  };
};

export default useGetUsers;
