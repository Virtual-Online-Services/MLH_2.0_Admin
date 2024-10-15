import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetAllRequestWithdrawAgent from "../../react-query/api-hooks/useGetAllRequestWithdrawAgent";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import BModal from "../../components/BModal/BModal";
import WithdrawModal from "./WithdrawModal";
import AgentUser from "../../components/agent/AgentUser";

const ListWithdraw = () => {
  const { userWithdrawDetails, isLoadingUserWithdraw } =
    useGetAllRequestWithdrawAgent([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  // const [isProcessing, setIsProcessing] = useState(null);
  // const [isCancel, setIsCancel] = useState(null);
  // const queryClient = useQueryClient();
  const token = userInfo?.token?.accessToken;
  const [agentDetails, setAgentDetails] = useState(null);
  const handleWithdraw = () => {
    handleOpen();
  };
  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };
  const handleEdit = async (id: number) => {
    try {
      const endpoint = `https://api.mylottohub.com/v1/get-agent/${id}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(endpoint, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          toast.error("User does not Exist");
          // Display or handle the error here
        } else {
          throw new Error(errorData.error || "Network response was not ok");
        }
      }

      const data = await response.json();
      setAgentDetails(data);
    } catch (error: any) {
      // toast.error(error.error);
      // Display error message or handle error appropriately
    }
  };

  const columns: GridColDef[] = [
    {
      field: "user",
      type: "string",
      headerName: "ID",
      width: 130,
      renderCell: (params) => (
        <a
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(params.row.user)}
        >
          {params.value}
        </a>
      ),
    },
    {
      field: "amount",
      type: "string",
      headerName: "AMOUNT",
      width: 150,
      valueGetter: (params) => `₦${params.value}`,
    },

    {
      field: "account",
      type: "string",
      headerName: "PHONE NUMBER",
      width: 200,
    },

    {
      field: "ref",
      headerName: "REFERENCE",
      width: 200,
      type: "string",
    },
    {
      field: "payout_reference",
      headerName: "PAYMENT REFERENCE",
      width: 230,
      type: "string",
      renderCell: (params) => (
        <span>{params.value ? params.value : "Unpaid"}</span>
      ),
    },
    {
      field: "payout_date",
      headerName: "PAYMENT DATE",
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },

    {
      field: "created_at",
      headerName: "DATE",
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },

    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      type: "string",
    },
  ];

  return (
    <div>
      <div>
        <div className="main">
          <Navbar />
          <div className="container__flex">
            <div className="menuContainer">
              <Menu />
            </div>
            <div className="container">
              <div className="page-title mb-4">
                <h4 className="mb-0">Withdrawals </h4>
                <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                  <li className="breadcrumb-item mt-3">
                    <Link to="/home" className="default-color">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active mt-3">Withdrawals</li>
                </ol>
              </div>

              <div>
                {isLoadingUserWithdraw ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : userWithdrawDetails?.data?.length === 0 ? (
                  <div className="d-flex justify-content-center text-center p-5">
                    <div className="hidden-xs hidden-sm mx-auto">
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        No Record Found
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-4">
                      {userWithdrawDetails?.data?.length} Records
                    </p>
                    <div className="d-flex">
                      <i
                        className="fa fa-plus mb-3 fw-bolder text-uppercase"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleWithdraw()}
                      >
                        {" "}
                        <span className="fw-bolder">Payout for Agency</span>
                      </i>
                    </div>
                    <DataTable
                      slug="withdraw-agent"
                      columns={columns}
                      // rows={userWithdrawDetails?.data}
                      rows={userWithdrawDetails?.data}
                    />
                  </>
                )}

                <br />
                <br />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <AgentUser
        agentDetails={agentDetails}
        setAgentDetails={setAgentDetails}
      />

      <BModal
        backdrop="static"
        keyboard={false}
        show={isOpen}
        onHide={handleClose}
        size="md"
      >
        <WithdrawModal handleClose={handleClose} />
      </BModal>
    </div>
  );
};

export default ListWithdraw;
