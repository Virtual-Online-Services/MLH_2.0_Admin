// import { useQuery } from "@tanstack/react-query";
// import queryKeys from "../constants";
// import { HTTP } from "../../utils";
// import { useSelector } from "react-redux";

// const getResultForOperator = async (token, operatorId) => {
//   try {
//     const res = await HTTP.get(`/get-results`, {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       params: { operator_id: 28 },
//     });
//     return res;
//   } catch (error) {
//     return error;
//   }
// };

// const useGetResults = (operatorId) => {
//   const userInfo = useSelector((state) => state.auth.userInfo);
//   const token = userInfo?.token?.accessToken;

//   const { data, isLoading } = useQuery({
//     queryKey: [queryKeys.GET_RESULT, operatorId],
//     queryFn: () => getResultForOperator(token, operatorId),
//   });

//   return {
//     userResults: data?.data,
//     token,
//     isLoadingResults: isLoading,
//   };
// };

// export default useGetResults;

import { useQuery } from "@tanstack/react-query";
import queryKeys from "../constants";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";

const getResultForOperator = async (token, operatorId) => {
  try {
    const res = await HTTP.get(`/get-results`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { operator_id: operatorId },
    });
    return res;
  } catch (error) {
    return error;
  }
};

const useGetResults = (operatorIds) => {
  // Modify to accept an array of operatorIds
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.GET_RESULT, operatorIds], // Pass operatorIds array as part of the query key
    queryFn: () =>
      Promise.all(
        operatorIds.map((operatorId) => getResultForOperator(token, operatorId))
      ), // Fetch results for each operatorId
  });

  return {
    userResults: data?.map((result) => result?.data), // Map over results to extract data for each operator
    token,
    isLoadingResults: isLoading,
  };
};

export default useGetResults;
