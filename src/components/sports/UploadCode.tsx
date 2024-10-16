import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import useGetSportsForecast from "../../react-query/api-hooks/useGetSportsForecast";

const schema = yup.object().shape({
  code: yup.string().required("This is a required field"),
});

const UploadCode = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const { userSportForecast, isLoadingSportForecast } = useGetSportsForecast(
    []
  );
  const [selectedForecasterId, setSelectedForecasterId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [datetime, setDatetime] = useState("");
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
    formData.append("code", data.code);
    formData.append("date", datetime);
    formData.append("id", selectedForecasterId);

    HTTP.post("/add-sports-bet", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();
        if (response.data.message) {
          queryClient.invalidateQueries("GET_SPORT_CODE");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const bannerError = error.response.data.errors.logo[0];
          toast.error(bannerError);
        } else {
          toast.error("An error occurred.");
        }
      });
  };

  const handleChange = (e: any) => {
    const selectedDatetime = new Date(e.target.value);

    const timezoneOffset = selectedDatetime.getTimezoneOffset() * 60000;

    const localDatetime = new Date(selectedDatetime.getTime() - timezoneOffset);

    const formattedDatetime = localDatetime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    setDatetime(formattedDatetime);
  };

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Upload Betting Code</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="mb-3">
                {isLoadingSportForecast ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <div className="mb-3">
                    <select
                      name="status"
                      className="form-select"
                      id="status"
                      value={selectedForecasterId}
                      onChange={(e) => setSelectedForecasterId(e.target.value)}
                    >
                      <option value="">Select Forecaster</option>
                      {/* Ensure userSportForecast is an array */}
                      {Array.isArray(userSportForecast) &&
                        userSportForecast.map((forecaster) => (
                          <option key={forecaster.id} value={forecaster.id}>
                            {forecaster.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Enter Code"
                  {...register("code", {
                    required: "Required",
                  })}
                />
                {errors.code && (
                  <p className="text-danger text-capitalize">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="datetime-local"
                  className="form-control mb-2 p-3"
                  value={datetime}
                  onChange={handleChange}
                />
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
                  " Upload"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCode;
