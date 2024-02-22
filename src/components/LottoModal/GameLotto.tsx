import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  day: yup.string().required("This is a required field"),
  operator: yup.string().required("This is a required field"),
});

const GameLotto = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const [isLoading, setIsLoading] = useState(false);
  const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator([]);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };
  const queryClient = useQueryClient();

  const submitForm = (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("day", data.day);
    formData.append("operator", data.operator);

    HTTP.post("/add-game", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();
        if (response.data.message) {
          // Invalidate the query cache for adverts data
          queryClient.invalidateQueries("GET_LOTTO_GAME");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          toast.error(error.response);
        } else {
          toast.error("An error occurred.");
        }
      });
  };

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Upload Game Details</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Game Name"
                  {...register("name", {
                    required: "Required",
                  })}
                />
                {errors.name && (
                  <p className="text-danger text-capitalize">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <select
                  className="form-select mb-2 p-3"
                  {...register("day", {
                    required: "Required",
                  })}
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                {errors.day && (
                  <p className="text-danger text-capitalize">
                    {errors.day.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <select
                  className="form-select mb-2 p-3"
                  {...register("operator", {
                    required: "Required",
                  })}
                >
                  <option value="">Select Operator</option>
                  {isLoadingLottoOperator ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    userLottoOperator?.data?.map((operator: any) => (
                      <option key={operator.id} value={operator.id}>
                        {operator?.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.operator && (
                  <p className="text-danger text-capitalize">
                    {errors.operator.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-100 p-3"
                style={{ background: "#27AAE1" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  " Proceed"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLotto;
