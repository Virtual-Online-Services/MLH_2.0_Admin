import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetAllUserTransactions from "../../react-query/api-hooks/useGetAllUserTransactions";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SingleUser from "../../components/SingleUser/SingleUser";

const AllTransactions = () => {
  const { userTransactions, isLoadingTransaction } = useGetAllUserTransactions(
    []
  );
  const [userDetails, setUserDetails] = useState(null);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleDateRangeChange = (ranges: any) => {
    setDateRange([ranges.selection]);
  };
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const toggleDateRangePicker = () => {
    setShowDateRangePicker((prevState) => !prevState);
  };
  const handleFilter = () => {
    const filtered = userTransactions?.data?.data?.filter(
      (transaction: any) => {
        const createdAt = new Date(transaction.created_at);
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        return createdAt >= startDate && createdAt <= endDate;
      }
    );
    setFilteredTransactions(filtered);
    if (filtered && filtered.length > 0) {
      toast.success(`${filtered.length} record(s) found!`);
    } else {
      toast.error("No records found");
    }
  };

  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };

  const handleEdit = async (id: number) => {
    try {
      const endpoint = `https://api.mylottohub.com/v1/admin/get-user/${id}`;
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
      setUserDetails(data);
    } catch (error: any) {
      // toast.error(error.error);
      // Display error message or handle error appropriately
    }
  };
  const columns: GridColDef[] = [
    {
      field: "user",
      type: "string",
      headerName: "USER ID",
      width: 150,
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
      field: "username",
      type: "string",
      headerName: "USERNAME",
      width: 200,
    },

    {
      field: "customer_tell",
      headerName: "PHONE",
      width: 150,
      type: "string",
    },
    {
      field: "ref",
      headerName: "TICKET ID",
      width: 250,
      type: "string",
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
      width: 350,
      type: "string",
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 130,
      type: "string",
      valueGetter: (params) => `₦${params.value}`,
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
      valueGetter: (params) => `₦${params.value}`,
    },
    {
      field: "created_at",
      headerName: "DATE",
      width: 200,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },
  ];

  return (
    <>
      <div>
        <div className="main">
          <Navbar />
          <div className="container__flex">
            <div className="menuContainer">
              <Menu />
            </div>
            <div className="container">
              <div className="page-title mb-4">
                <h4 className="mb-0"> Transactions </h4>
                <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                  <li className="breadcrumb-item mt-3">
                    <Link to="/home" className="default-color">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active mt-3">Transaction</li>
                </ol>
              </div>

              <div>
                {isLoadingTransaction ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : userTransactions?.data?.length === 0 ? (
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
                    <div
                      className="card mb-5"
                      style={{ borderColor: "#337ab7" }}
                    >
                      <div
                        className="card-heading text-left text-white p-3"
                        style={{ background: "#337ab7" }}
                      >
                        Filter
                      </div>
                      <div className="card-body">
                        <form method="post" action="">
                          <table cellPadding="5" width="100%">
                            <tbody>
                              <tr>
                                <td width="30%">
                                  <input
                                    type="text"
                                    name="user"
                                    placeholder="User ID"
                                    className="form-control"
                                  />
                                </td>
                                &nbsp;
                                <td width="30%">
                                  <div
                                    onClick={toggleDateRangePicker}
                                    className="mt-1"
                                  >
                                    <p
                                      style={{ cursor: "pointer" }}
                                      className="text-center btn btn-light mt-3"
                                    >
                                      {showDateRangePicker
                                        ? "Hide Date Range"
                                        : "Select Date Range"}
                                    </p>
                                  </div>
                                  {showDateRangePicker && (
                                    <DateRangePicker
                                      onChange={handleDateRangeChange}
                                      moveRangeOnFirstSelection={false}
                                      ranges={dateRange}
                                    />
                                  )}
                                  {showDateRangePicker ? (
                                    <>
                                      <button
                                        type="button"
                                        className="btn btn-primary w-100 mt-3"
                                        onClick={handleFilter}
                                      >
                                        Filter
                                      </button>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </td>
                                &nbsp;
                                {/* <td></td> */}
                                {/* <td>
                                  <button onClick={handleFilter}>Filter</button>
                                </td> */}
                              </tr>
                            </tbody>
                          </table>
                        </form>
                      </div>
                    </div>
                    <p className="mt-4">
                      {userTransactions?.data?.data?.length} Records
                    </p>

                    <DataTable
                      slug="transactions"
                      columns={columns}
                      rows={
                        filteredTransactions || userTransactions?.data?.data
                      }
                    />
                  </>
                )}

                <br />
                <br />
              </div>
            </div>
          </div>
          <SingleUser
            userDetails={userDetails}
            setUserDetails={setUserDetails}
          />

          <Footer />
        </div>
      </div>
    </>
  );
};

export default AllTransactions;
