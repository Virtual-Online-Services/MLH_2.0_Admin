import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  del: yup.string().required("This is a required field"),
  play: yup.string().required("This is a required field"),
  logo: yup.mixed().required("This is a required field"),
});

const LottoModal = () => {
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

  const mutation = useMutation({
    mutationFn: (formData) => {
      return HTTP.post(`/add-operator`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
  const submitForm = async (data) => {
    setIsLoading(true);
    try {
      await mutation.mutateAsync(data);
      console.log(data);

      toast.success("Operator added successfully");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const bannerError = error.response.data.errors.logo[0];
        toast.error(bannerError);
      } else {
        toast.error("An error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
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
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="P"
                  {...register("play", {
                    required: "Required",
                  })}
                />
                {errors.play && (
                  <p className="text-danger text-capitalize">
                    {errors.play.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="N"
                  {...register("del", {
                    required: "Required",
                  })}
                />
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
                  accept=".jpeg, .png, .jpg, .gif"
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
                    size="sm"
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
