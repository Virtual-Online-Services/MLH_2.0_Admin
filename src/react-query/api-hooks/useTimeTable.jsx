import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getTimetable = async (token) => {
  try {
    const res = await HTTP.get(`/mylotto_get_timetable`, {
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

const useTimeTable = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token;

  const { data, isLoading } = useQuery([queryKeys.GET_USER_PROFILE], () =>
    getTimetable(token)
  );
  return {
    operatorTimetable: data?.data,
    isLoadingTimetable: isLoading,
  };
};

export default useTimeTable;
