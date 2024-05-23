import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";

const schema = yup.object().shape({
  gl_bonus: yup.string().required("This is a required field"),
  sl_bonus: yup.string().required("This is a required field"),
  lm_bonus: yup.string().required("This is a required field"),
  gh_bonus: yup.string().required("This is a required field"),
  we_bonus: yup.string().required("This is a required field"),
});

const BonusModal = ({ handleClose }) => {
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

  const submitForm = (data: any) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("gl_bonus", data.gl_bonus);
    formData.append("sl_bonus", data.sl_bonus);
    formData.append("lm_bonus", data.lm_bonus);
    formData.append("gh_bonus", data.gh_bonus);
    formData.append("we_bonus", data.we_bonus);

    HTTP.post("/operator-bonus", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success("Bonus updated successfully");
        handleClose();

        if (response.data.status) {
          queryClient.invalidateQueries("GET_BONUS");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (error) {
          toast.error(error.data.error);
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
              <strong className="text-dark">Update Operator Bonus</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="mb-3">
                <input
                  type="number"
                  min={0}
                  className="form-control mb-2 p-3"
                  placeholder="Update Green Lotto Bonus"
                  {...register("gl_bonus", {
                    required: "Required",
                  })}
                />
                {errors.gl_bonus && (
                  <p className="text-danger text-capitalize">
                    {errors.gl_bonus.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={0}
                  className="form-control mb-2 p-3"
                  placeholder="Update Set Lotto Bonus"
                  {...register("sl_bonus", {
                    required: "Required",
                  })}
                />
                {errors.sl_bonus && (
                  <p className="text-danger text-capitalize">
                    {errors.sl_bonus.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={0}
                  className="form-control mb-2 p-3"
                  placeholder="Update LottoMania Bonus"
                  {...register("lm_bonus", {
                    required: "Required",
                  })}
                />
                {errors.lm_bonus && (
                  <p className="text-danger text-capitalize">
                    {errors.lm_bonus.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={0}
                  placeholder="Update Ghana Games Bonus"
                  className="form-control mb-2 p-3"
                  {...register("gh_bonus", {
                    required: "Required",
                  })}
                />
                {errors.gh_bonus && (
                  <p className="text-danger text-capitalize">
                    {errors.gh_bonus.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  min={0}
                  placeholder="Update Wesco Bonus"
                  className="form-control mb-2 p-3"
                  {...register("we_bonus", {
                    required: "Required",
                  })}
                />
                {errors.we_bonus && (
                  <p className="text-danger text-capitalize">
                    {errors.we_bonus.message}
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
                  " Update"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusModal;
