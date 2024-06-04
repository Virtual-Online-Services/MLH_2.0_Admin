import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import moment from "moment";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HTTP from "../../utils/httpClient";
import { toast } from "react-toastify";
import useGetAllBank from "../../react-query/api-hooks/useGetAllBank";

const AgentUser = ({ agentDetails, setAgentDetails }) => {
  const [userTransaction, setUserTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentBonus, setAgentBonus] = useState([]);
  const { allBanks } = useGetAllBank();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [bankName, setBankName] = useState(agentDetails?.data?.bname || "");
  const [accountNo, setAccountNo] = useState(agentDetails?.data?.accno || "");
  const [loadingBank, setLoadingBank] = useState(false);

  const handleBankNameChange = (e: any) => {
    setBankName(e.target.value);
  };

  const handleAccountNoChange = (e: any) => {
    setAccountNo(e.target.value);
  };

  const handleSubmitBankDetails = async (e: any) => {
    e.preventDefault();
    setLoadingBank(true);

    try {
      const response = await HTTP.post(
        `/edit-bank-details/${agentDetails.data.id}`,
        {
          bank_name: bankName,
          account_no: accountNo,
          user_type: "Agent",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        toast.success("Bank details updated successfully");
      }
    } catch (error: any) {
      toast.error(error.response.data.error || "Error updating bank details");
    } finally {
      setLoadingBank(false);
    }
  };

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

  const onSubmitTransfer = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    const amountTransfer = e.target.amountTransfer.value;
    const amountRef = e.target.amountRef.value;

    try {
      const response = await HTTP.post(
        "/agent-transferagent",
        {
          amount: amountTransfer,
          id: agentDetails?.data?.id,
          posting: "wallet",
          ref: amountRef,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        toast.success("Funds transferred successfully");
      }
    } catch (error) {
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal
        show={agentDetails !== null}
        onHide={() => setAgentDetails(null)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            {/* Agent User Information */}
            {agentDetails?.data?.first_name} {agentDetails?.data?.last_name}{" "}
            Information
          </Modal.Title>
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
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="bank-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#bank-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="bank-tab-pane"
                    aria-selected="false"
                  >
                    Edit User Bank Details
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
                          {agentDetails?.data?.first_name}{" "}
                          {agentDetails?.data?.last_name}
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
                          Deposit Wallet Balance:
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
                      <form
                        onSubmit={onSubmitTransfer}
                        className="row g-2 mt-1"
                      >
                        <small className="text-dark">
                          The Reference Field is optionally{" "}
                        </small>
                        <div className="col-auto d-flex">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                            id="amountTransfer"
                            name="amountTransfer"
                            required
                          />
                          &nbsp;&nbsp;&nbsp;
                          <input
                            type="text"
                            className="form-control"
                            id="amountRef"
                            name="amountRef"
                            placeholder="Reference Number"
                          />
                        </div>
                        <div className="col-auto">
                          <Button
                            type="submit"
                            className="btn btn-primary mb-3 h-100"
                            disabled={loading}
                          >
                            {loading ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              " Transfer"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="bank-tab-pane"
                  role="tabpanel"
                  aria-labelledby="bank-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <form
                      onSubmit={handleSubmitBankDetails}
                      className="row g-2 mt-1 w-50"
                    >
                      <div className="form-group mb-3">
                        <select
                          name="bank"
                          required=""
                          className="form-control"
                          value={bankName}
                          onChange={handleBankNameChange}
                        >
                          <option value="" disabled>
                            Select Bank
                          </option>
                          {allBanks.map((bank) => (
                            <option key={bank.id} value={bank.name}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="col-auto">
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Account Number"
                            value={accountNo}
                            onChange={handleAccountNoChange}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <button type="submit" className="btn btn-primary">
                          {loadingBank ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            "Update"
                          )}
                        </button>
                      </div>
                    </form>
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
