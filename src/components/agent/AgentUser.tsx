import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HTTP from "../../utils/httpClient";

const AgentUser = ({ agentDetails, setAgentDetails }) => {
  const [userTransaction, setUserTransaction] = useState([]);
  const [agentBonus, setAgentBonus] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  useEffect(() => {
    const fetchData = async () => {
      if (!agentDetails || !agentDetails.data || !agentDetails.data.id) {
        return;
      }

      const endpoint = `/get-agenttransactions/${agentDetails.data.id}`;
      try {
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserTransaction(response.data.data);
      } catch (error) {
        console.error("Error fetching user transactions:");
      }
    };

    fetchData();
  }, [agentDetails?.data?.id, token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!agentDetails || !agentDetails.data || !agentDetails.data.id) {
        return;
      }

      const endpoint = `/get-agentwallets/${agentDetails.data.id}`;
      try {
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAgentBonus(response.data);
      } catch (error) {
        console.error("Error fetching user transactions:");
      }
    };

    fetchData();
  }, [agentDetails?.data?.id, token]);

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

  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };
  const columns: GridColDef[] = [
    {
      field: "ref",
      type: "string",
      headerName: "REFERENCE",
      width: 250,
    },
    {
      field: "type",
      headerName: "TYPE",
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      width: 750,
      type: "string",
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 130,
      type: "string",
    },
    {
      field: "channel",
      headerName: "CHANNEL",
      width: 180,
      type: "string",
    },
    {
      field: "abalance",
      headerName: "CURRENT BALANCE",
      width: 150,
      type: "string",
    },
    {
      field: "created_at",
      headerName: "DATE",
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },
  ];

  return (
    <div>
      <Modal
        show={agentDetails !== null}
        onHide={() => setAgentDetails(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            User Information
          </Modal.Title>

          <button className="btn btn-primary">Reset Password</button>
        </Modal.Header>
        <Modal.Body>
          {agentDetails && (
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
                          {agentDetails?.data?.id}
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
                          {agentDetails?.data?.name}
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
                          {agentDetails?.data?.username}
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
                          {agentDetails?.data?.tell}
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
                          {agentDetails?.data?.email}
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
                          {agentDetails?.data?.state}
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
                          {agentDetails?.data?.dob}
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
                          {agentDetails?.data?.gender}
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
                          {agentDetails?.data?.type}
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
                          ₦{agentDetails?.data?.wallet}
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
                          ₦{agentDetails?.data?.wwallet}
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
                          Green Lotto Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{agentBonus?.green_lotto_bonus_wallet}
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
                          Set Lotto Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{agentBonus?.lotto_nigeria_bonus_wallet}
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
                          Lotto Mania Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{agentBonus?.lottomania_bonus_wallet}
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
                          5/90 Mania Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          {agentBonus
                            ? `₦${agentBonus["590_bonus_wallet"]}`
                            : ""}
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
                            {getStatusText(agentDetails?.data?.status)}
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
                          {agentDetails?.data?.date}
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
                          {agentDetails?.data?.ref}
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
                          {agentDetails?.data?.bname}
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
                          {agentDetails?.data?.accname}
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
                          {agentDetails?.data?.accno}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="transactions-tab-pane"
                  role="tabpanel"
                  aria-labelledby="transactions-tab-pane"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <DataTable
                      slug="single-transactions"
                      columns={columns}
                      rows={userTransaction}
                    />
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

export default AgentUser;
