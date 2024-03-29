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
  del: yup.string().required("This is a required field"),
  play: yup.string().required("This is a required field"),
  logo: yup.mixed().required("This is a required field"),
});

const LottoModal = ({ handleClose }) => {
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

  const submitForm = (data) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("del", data.del);
    formData.append("play", data.play);
    formData.append("logo", data.logo[0]);

    HTTP.post("/add-operator", formData, config)
      .then((response) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();
        if (response.data.message) {
          queryClient.invalidateQueries("GET_LOTTO_OPERATOR");
        }
      })
      .catch((error) => {
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
              <strong className="text-dark">Upload Operator Details</strong>
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
                <select
                  className="form-select mb-2 p-3"
                  {...register("play", {
                    required: "Required",
                  })}
                >
                  <option value="">Enable Play</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
                {errors.play && (
                  <p className="text-danger text-capitalize">
                    {errors.play.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <select
                  className="form-select mb-2 p-3"
                  {...register("del", {
                    required: "Required",
                  })}
                >
                  <option value="">Temporary Delete</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
                {errors.del && (
                  <p className="text-danger text-capitalize">
                    {errors.del.message}
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

export default LottoModal;
