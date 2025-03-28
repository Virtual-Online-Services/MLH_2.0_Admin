import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useQueryClient } from "@tanstack/react-query";
import useGetInstantGamesOperator from "../../react-query/api-hooks/useGetInstantGamesOperator";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  link: yup.string().required("This is a required field"),
  operator: yup.string().required("This is a required field"),
  logo: yup.string().required("This is a required field"),
});

const InstantGameLotto = ({ handleClose }) => {
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
  const { userInstantOperator, isLoadingInstantOperator } =
    useGetInstantGamesOperator([]);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };
  const queryClient = useQueryClient();

  const submitForm = (data: any) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("link", data.link);
    formData.append("operator", data.operator);
    if (data.logo && data.logo.length > 0) {
      formData.append("logo", data.logo[0]);
    }

    HTTP.post("/add-instantgame", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();
        if (response.data.message) {
          queryClient.invalidateQueries("GET_INSTANT_OPERATOR");
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

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Upload Instant Game Details</strong>
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
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Link Url"
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
                <select
                  className="form-select mb-2 p-3"
                  {...register("operator", {
                    required: "Required",
                  })}
                >
                  <option value="">Select Operator</option>
                  {isLoadingInstantOperator ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    userInstantOperator?.data?.map((operator: any) => (
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
    </div>
  );
};

export default InstantGameLotto;
