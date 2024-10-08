import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getUsersAdminProfile = async (token: any) => {
  try {
    const res = await HTTP.get(`/get-admins`, {
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

const useGetAdmin = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  // const userId = userInfo?.data?.id;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_ADMIN_PROFILE],
    queryFn: () => getUsersAdminProfile(token),
  });
  return {
    userAdminResponse: data?.data,
    token,
    isLoadingAdmin: isLoading,
  };
};

export default useGetAdmin;
