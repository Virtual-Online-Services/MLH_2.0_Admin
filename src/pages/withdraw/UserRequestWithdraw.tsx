import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetAllRequestWithdraw from "../../react-query/api-hooks/useGetAllRequestWithdraw";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { useSelector } from "react-redux";
import { useState } from "react";
import SingleUser from "../../components/SingleUser/SingleUser";

const UserRequestWithdraw = () => {
  const { userWithdrawDetails, isLoadingUserWithdraw } =
    useGetAllRequestWithdraw([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [userDetails, setUserDetails] = useState(null);
  const token = userInfo?.token?.accessToken;
  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };

  //   const handleEdit = async (id: number) => {
  //     try {
  //       const endpoint = `https://sandbox.mylottohub.com/v1/admin/get-user/${id}`;
  //       const requestOptions = {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Accept: "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       };

  //       try {
  //         const response = await fetch(endpoint, requestOptions);
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         const data = await response.json();
  //         setUserDetails(data);
  //       } catch (error) {
  //         console.error("There was a problem with the fetch request:", error);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching game details:", error);
  //       // Handle error
  //     }
  //   };

  const handleEdit = async (id: number) => {
    try {
      const endpoint = `https://sandbox.mylottohub.com/v1/admin/get-user/${id}`;
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
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error: any) {
      console.error(
        "There was a problem with the fetch request:",
        error.message
      );
      // Display error message or handle error appropriately
    }
  };

  const columns: GridColDef[] = [
    {
      field: "username",
      type: "string",
      headerName: "USER",
      width: 130,
      renderCell: (params) => (
        <a
          //   to={`/user-profile/${params.row.id}`}
          className="text-primary"
          onClick={() => handleEdit(params.row.id)}
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
    },
    {
      field: "bname",
      type: "string",
      headerName: "BANK NAME",
      width: 200,
    },
    {
      field: "ano",
      type: "string",
      headerName: "ACC NO",
      width: 200,
    },
    {
      field: "aname",
      headerName: "ACC NAME",
      width: 250,
      type: "string",
    },
    {
      field: "pbalance",
      headerName: "PREV BALANCE",
      width: 150,
      type: "string",
    },
    {
      field: "bamount",
      headerName: "BALANCE",
      width: 150,
      type: "string",
    },

    {
      field: "date",
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

    {
      field: "withdraw_action",
      headerName: "ACTION",
      width: 550,
      renderCell: (params) => (
        <div className="d-flex">
          {params.row.status === "Pending" && (
            <>
              <button
                className="btn btn-success"
                // onClick={() => handleViewDatetime(params.row)}
              >
                Pay with Monnify
              </button>
              &nbsp; &nbsp;
              <button
                className="btn btn-primary"
                // onClick={() => handleViewDatetime(params.row)}
              >
                Pay With Opay
              </button>
              &nbsp; &nbsp;
              <button
                className="btn btn-danger"
                // onClick={() => handleViewDatetime(params.row)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ),
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
                    <DataTable
                      slug="withdraw"
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
      <SingleUser userDetails={userDetails} setUserDetails={setUserDetails} />
    </div>
  );
};

export default UserRequestWithdraw;