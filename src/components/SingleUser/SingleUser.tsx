import { Modal, Button, Spinner } from "react-bootstrap";
// import { useState } from "react";
// import HTTP from "../../utils/httpClient";
// import { useSelector } from "react-redux";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
const SingleUser = ({ userDetails, setUserDetails }) => {
  //   const [editedDetails, setEditedDetails] = useState({});
  //   const [isLoading, setIsLoading] = useState(false);
  //   const userInfo = useSelector((state) => state.auth.userInfo);
  //   const token = userInfo?.token?.accessToken;

  //   const handleChange = (e: any) => {
  //     const { name, value } = e.target;
  //     setEditedDetails((prevDetails) => ({
  //       ...prevDetails,
  //       [name]: value,
  //     }));
  //   };
  //   const queryClient = useQueryClient();
  //   const handleSubmit = async (e: any) => {
  //     e.preventDefault();
  //     setIsLoading(true);
  //     try {
  //       const response = await HTTP.post(
  //         `/operator/${operatorDetails.data.id}`,
  //         editedDetails,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Accept: "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       toast.success(response.data.status);
  //       setOperatorDetails(response.data);
  //       setOperatorDetails(null);
  //       if (response.data.status) {
  //         // Invalidate the query cache htmlFor adverts data
  //         queryClient.invalidateQueries("GET_LOTTO_OPERATOR");
  //       }
  //     } catch (error) {
  //       console.error("Error editing operator:", error);
  //       // Handle error
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Blocked";
      case 3:
        return "Not Verified";
      case 0:
        return "Inactive";
      default:
        return "Unknown Status";
    }
  };

  return (
    <div>
      <Modal
        show={userDetails !== null}
        onHide={() => setUserDetails(null)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            User Information
          </Modal.Title>

          <button className="btn btn-primary">Reset Password</button>
        </Modal.Header>
        <Modal.Body>
          {userDetails && (
            <>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected="true"
                  >
                    Details
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="transactions-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#transactions-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="transactions-tab-pane"
                    aria-selected="false"
                  >
                    Transactions
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="transfer-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#transfer-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="transfer-tab-pane"
                    aria-selected="false"
                  >
                    Transfer
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home-tab-pane"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <div>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">User ID:</span>
                        <span className="text-dark">
                          {userDetails?.data?.id}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Name:</span>
                        <span className="text-dark">
                          {userDetails?.data?.name}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Username: </span>
                        <span className="text-dark">
                          {userDetails?.data?.username}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Phone:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.tell}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Email:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.email}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">State:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.state}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Date of birth:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.dob}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Gender:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.gender}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">User Type:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.type}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.wallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Winning Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.wwallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Bonus Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.bwallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Status:</span>{" "}
                        <span className="text-dark">
                          <span>
                            {getStatusText(userDetails?.data?.status)}
                          </span>
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Signup Date:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.date}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Referred By:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.ref}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Bank:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.bname}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Account Name:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.accname}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Account Number:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.accno}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="transfer-tab-pane"
                  role="tabpanel"
                  aria-labelledby="transfer-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <div className="mb-3">
                      <label className="form-label text-dark fa-1x">
                        Transfer to user wallet
                      </label>
                      <form className="row g-2 mt-1">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn btn-primary mb-3"
                          >
                            Transfer
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark fa-1x">
                        Transfer to user bonus wallet
                      </label>
                      <form className="row g-2 mt-1">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn btn-primary mb-3"
                          >
                            Transfer
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SingleUser;
