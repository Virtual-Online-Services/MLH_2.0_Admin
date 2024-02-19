// import {  useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import "../../assets/scss/login.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup.object().shape({
  user_details: yup.string().required("This is a required Field"),
  password: yup.string().min(5).max(15).required(),
});

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitForm = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));

      // Save the token.
      dispatch(
        setCredentials({
          token: res.token,
          data: res.data,
        })
      );

      toast.success(res.message);
      navigate("/home");
    } catch (err) {
      if (err?.data?.error) {
        toast.error(err.data.error);
      } else {
        toast.error("An error occurred during Login.");
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 mx-auto app__register">
          <h1 className="mb-4">ADMIN LOGIN</h1>

          <form onSubmit={handleSubmit(submitForm)}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-4 p-3"
                placeholder="Username"
                name="usrname"
                {...register("user_details", {
                  required: "Required",
                })}
              />
              {errors.user_details && (
                <p className="text-danger text-capitalize">
                  {errors.user_details.message}
                </p>
              )}
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-2 p-3"
                placeholder="Password"
                name="password"
                {...register("password", {
                  required: "Required",
                })}
              />
              <div
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{ right: "10px", cursor: "pointer" }}
              >
                <p
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    color: "#6E9A8D",
                    marginLeft: "-30px",
                    marginTop: "10px",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </p>
              </div>
            </div>

            {errors.password && (
              <p className="text-danger text-capitalize">
                {errors.password.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-100 p-3 mb-5"
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
                " Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
