import { useQuery, useQueryClient } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../pages/slices/authSlice";

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

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    [queryKeys.GET_USER_PROFILE, userId],
    () => getUsers(userId, token),
    {
      onSuccess: (response) => {
        const expiration = response.data?.[1];

        // Compare the current time with the expiration time
        const currentTime = new Date().getTime() / 1000; // Convert to seconds
        if (expiration && expiration > currentTime) {
          // Dispatch logout action to clear the token in Redux store
          dispatch(logout());

          // Clear the token in React Query
          queryClient.setQueryData([queryKeys.GET_USER_PROFILE, userId], null);
        }
      },
      initialData: userId
        ? queryClient.getQueryData([queryKeys.GET_USER_PROFILE, userId])
        : null,
    }
  );

  return {
    userProfileResponse: data?.data?.[0],
    token,
    isLoadingUserProfile: isLoading,
  };
};

export default useGetProfileUser;
