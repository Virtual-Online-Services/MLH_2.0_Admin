import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useQueryClient } from "@tanstack/react-query";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  logo: yup.mixed().required("This is a required field"),
});

const UploadForecasters = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const submitForm = (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo[0]); // ✅ actual file

    HTTP.post("/add-proforcaster", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        // ❌ DO NOT set Content-Type, browser will handle boundary
      },
    })
      .then((response) => {
        toast.success(response.data.message);
        handleClose();
        reset();
        queryClient.invalidateQueries("GET_SPORT_FORECAST");
      })
      .catch((error) => {
        const message =
          error.response?.data?.errors?.logo?.[0] ||
          error.response?.data?.message ||
          "An error occurred.";
        toast.error(message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container">
      <span>
        <strong className="text-dark">Upload Sport Forecaster Details</strong>
      </span>
      <br />

      <form className="mt-4" onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2 p-3"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-danger text-capitalize">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="file"
            className="form-control mb-2 p-3"
            {...register("logo")}
            name="logo"
          />
          {errors.logo && (
            <p className="text-danger text-capitalize">{errors.logo.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-100 p-3"
          style={{ background: "#27AAE1" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner as="span" animation="border" size="lg" />
          ) : (
            "Proceed"
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadForecasters;
