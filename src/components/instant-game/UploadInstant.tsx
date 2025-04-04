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
  link: yup.string().required("This is a required field"),
  logo: yup.mixed().required("This is a required field"),
});

const UploadInstant = ({ handleClose }) => {
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
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };
  const queryClient = useQueryClient();

  const submitForm = async (data: any) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("link", data.link);

      if (data.logo && data.logo.length > 0) {
        formData.append("logo", data.logo[0]);
      }

      const response = await HTTP.post(
        "/add-instantgame-operator",
        formData,
        config
      );

      setIsLoading(false);
      toast.success(response.data.message);
      handleClose();

      if (response.data.message) {
        queryClient.invalidateQueries("GET_INSTANT_OPERATOR");
      }
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.data && error.response.data.errors) {
        const bannerError = error.response.data.errors.logo[0];
        toast.error(bannerError);
      } else {
        toast.error("An error occurred.");
      }
    }
  };

  return (
    <div>
      <div>
        <div className="container">
          <span>
            <strong className="text-dark">
              Upload Instant Operator Details
            </strong>
          </span>
          <br />

          <form className="mt-4" onSubmit={handleSubmit(submitForm)}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2 p-3"
                placeholder="Name"
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
              <input
                type="text"
                className="form-control mb-2 p-3"
                placeholder="Link"
                {...register("link", {
                  required: "Required",
                })}
              />
              {errors.link && (
                <p className="text-danger text-capitalize">
                  {errors.link.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <input
                type="file"
                className="form-control mb-2 p-3"
                {...register("logo", {
                  required: "Required",
                })}
                name="logo"
              />
              {errors.logo && (
                <p className="text-danger text-capitalize">
                  {errors.logo.message}
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
  );
};

export default UploadInstant;
