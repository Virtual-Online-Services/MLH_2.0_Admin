import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ViewResult = ({ resultsDetails, setResultsDetails }) => {
  const [editedDetails, setEditedDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await HTTP.post(
        `/result/${resultsDetails.data.id}`,
        editedDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.status);
      setResultsDetails(null);
      // Invalidate the query cache for admin details
      queryClient.invalidateQueries("GET_RESULT");
    } catch (error) {
      toast.error("An error occurred while updating the results details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal
        show={resultsDetails !== null}
        onHide={() => setResultsDetails(null)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">Edit Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resultsDetails && (
            <form onSubmit={handleSubmit}>
              <div className="mt-4 mb-4">
                <select
                  name="operator"
                  className="form-select"
                  //   value={selectedOperator}
                  //   onChange={handleOperatorChange}
                  onChange={handleChange}
                >
                  <option
                    value={
                      editedDetails.operator || resultsDetails.data.operator
                    }
                  >
                    {" "}
                    {editedDetails.operator || resultsDetails.data.operator}
                  </option>
                </select>
              </div>

              <div className="mt-4 mb-4">
                <select
                  name="game"
                  className="form-select"
                  //   value={selectedGame}
                  //   onChange={handleGameChange}
                  onChange={handleChange}
                >
                  <option
                    value={editedDetails.game || resultsDetails.data.game}
                  >
                    {" "}
                    {editedDetails.game || resultsDetails.data.game}
                  </option>
                  {/* {gameOptions} */}
                </select>
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
                            value={
                              editedDetails.winning_num1 ||
                              resultsDetails.data.winning_num1
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num2"
                            name="wn2"
                            value={
                              editedDetails.winning_num2 ||
                              resultsDetails.data.winning_num2
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num3"
                            name="wn3"
                            value={
                              editedDetails.winning_num3 ||
                              resultsDetails.data.winning_num3
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num4"
                            name="wn4"
                            value={
                              editedDetails.winning_num4 ||
                              resultsDetails.data.winning_num4
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num5"
                            name="wn5"
                            value={
                              editedDetails.winning_num5 ||
                              resultsDetails.data.winning_num5
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Num6"
                            name="wn6"
                            value={
                              editedDetails.winning_num6 ||
                              resultsDetails.data.winning_num6
                            }
                            onChange={handleChange}
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
                            name="mn1"
                            value={
                              editedDetails.machine_num1 ||
                              resultsDetails.data.machine_num1
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num2"
                            name="mn2"
                            value={
                              editedDetails.machine_num2 ||
                              resultsDetails.data.machine_num2
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num3"
                            name="mn3"
                            value={
                              editedDetails.machine_num3 ||
                              resultsDetails.data.machine_num3
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num4"
                            name="mn4"
                            value={
                              editedDetails.machine_num4 ||
                              resultsDetails.data.machine_num4
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            required=""
                            placeholder="Num5"
                            name="mn5"
                            value={
                              editedDetails.machine_num5 ||
                              resultsDetails.data.machine_num5
                            }
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Num6"
                            name="mn6"
                            value={
                              editedDetails.machine_num6 ||
                              resultsDetails.data.machine_num6
                            }
                            onChange={handleChange}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label for="dtp_input1" className="control-label text-dark">
                  DateTime(
                  <span className="text-danger">
                    {editedDetails.date || resultsDetails.data.date}
                    {/* 2024-02-26
                    22:00:01 */}
                  </span>
                  )
                </label>
                <div
                  className="input-group date form_datetime"
                  data-date-format="yyyy-mm-dd hh:ii:ss"
                  data-link-field="dtp_input1"
                  onChange={handleChange}
                >
                  <input
                    className="form-control"
                    type="datetime-local"
                    value=""
                    name="datetime"
                  />
                  <span className="input-group-addon">
                    <span className="glyphicon glyphicon-remove"></span>
                  </span>
                  <span className="input-group-addon">
                    <span className="glyphicon glyphicon-th"></span>
                  </span>
                </div>
                <input type="hidden" id="dtp_input1" value="" />
                <br />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Save"}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewResult;
