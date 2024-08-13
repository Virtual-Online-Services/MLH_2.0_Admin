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
  email: yup.string().required("This is a required field"),
  username: yup.string().required("This is a required field"),
  password: yup.mixed().required("This is a required field"),
  perm: yup.mixed().required("This is a required field"),
});

const AddAdmin = ({ handleClose }) => {
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
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    // Append permissions as an array
    data.perm.forEach((permission: any) => {
      formData.append("perm[]", permission);
    });

    HTTP.post("/register-admin", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();
        if (response.data.message) {
          queryClient.invalidateQueries("GET_ADMIN_PROFILE");
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
  const permissions = [
    { value: "advert", label: "Adverts" },
    { value: "operator", label: "Operators" },
    { value: "game", label: "Games" },
    { value: "result", label: "Results" },
    { value: "product", label: "Products" },
    { value: "user", label: "Users" },
    { value: "user_action", label: "User action" },
    { value: "transaction", label: "Transactions" },
    { value: "wwallet", label: "Withdrawals" },
    { value: "pin", label: "Pins" },
    { value: "message", label: "Message" },
    { value: "sport", label: "Sport" },
    { value: "instantgame", label: "Instant Game" },
    { value: "casinogame", label: "Casino Game" },
    { value: "forecast", label: "Pro-Forecast" },
  ];

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Create Admin</strong>
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
                  type="email"
                  className="form-control mb-2 p-3"
                  placeholder="Email"
                  {...register("email", {
                    required: "Required",
                  })}
                  name="email"
                />
                {errors.email && (
                  <p className="text-danger text-capitalize">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Username"
                  {...register("username", {
                    required: "Required",
                  })}
                  name="username"
                />
                {errors.username && (
                  <p className="text-danger text-capitalize">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control mb-2 p-3"
                  {...register("password", {
                    required: "Required",
                  })}
                  name="password"
                />
                {errors.password && (
                  <p className="text-danger text-capitalize">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div
                className="card mb-5"
                style={{
                  borderColor: "#337ab7",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="card-heading text-left text-white p-3"
                  style={{ background: "#337ab7", width: "100%" }}
                >
                  Permissions
                </div>
                {permissions.map((permission, index) => (
                  <div
                    key={permission.value}
                    className="col-3 p-2"
                    style={{ flex: "0 0 25%" }}
                  >
                    <div className="checkbox ">
                      <label>
                        <input
                          type="checkbox"
                          value={permission.value}
                          name="perm[]"
                          {...register("perm[]", {
                            required: "Required",
                          })}
                        />
                        {permission.label}
                      </label>
                    </div>
                  </div>
                ))}
                {errors.perm && (
                  <p className="text-danger text-capitalize">
                    {errors.perm.message}
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
                  "Add"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
