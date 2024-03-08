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
  operator: yup.string().required("This is a required field"),
  game: yup.string().required("This is a required field"),
  username: yup.string().required("This is a required field"),
  password: yup.mixed().required("This is a required field"),
  perm: yup.mixed().required("This is a required field"),
});

const AddResult = ({ handleClose }) => {
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
              <strong className="text-dark">Upload Results</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="mb-3">
                <select
                  name="operator"
                  className="form-select"
                  //   value={selectedOperator}
                  //   onChange={handleOperatorChange}
                >
                  <option value="">Select Operator</option>

                  {isLoadingLottoOperator ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : userLottoOperator?.data?.length === 0 ? (
                    <option value="">No Operators Found</option>
                  ) : (
                    userLottoOperator?.data?.map((operator: any) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name}
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
                <select
                  name="game"
                  className="form-select"
                  //   value={selectedGame}
                  //   onChange={handleGameChange}
                >
                  <option value="">Select Game</option>
                  {/* {gameOptions} */}
                </select>
                {errors.game && (
                  <p className="text-danger text-capitalize">
                    {errors.game.message}
                  </p>
                )}
              </div>

              <div className="mt-4 mb-4">
                <div className="form-group">
                  <strong className="text-dark">Winning Numbers:</strong>
                  <table cellPadding="5">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num1"
                            name="wn1"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num2"
                            name="wn2"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num3"
                            name="wn3"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num4"
                            name="wn4"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num5"
                            name="wn5"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Num6"
                            name="wn6"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <div className="form-group">
                  <strong className="text-dark">Machine Numbers:</strong>
                  <table cellPadding="5">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num1"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num2"
                            name="mn2"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num3"
                            name="mn3"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num4"
                            name="mn4"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num5"
                            name="mn5"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Num6"
                            name="mn6"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">DateTime()</label>
                <div
                  className="input-group date form_datetime"
                  data-date-format="yyyy-mm-dd hh:ii:ss"
                  data-link-field="dtp_input1"
                >
                  <input
                    className="form-control"
                    type="text"
                    value=""
                    readOnly=""
                    name="datetime"
                  />
                </div>
                <br />
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

export default AddResult;
