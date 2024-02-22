import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./users.scss";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetUsers from "../../react-query/api-hooks/useGetUsers";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { toast } from "react-toastify";

const Users = () => {
  const { userDetails, isLoadingUser } = useGetUsers([]);

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
    const searchUserInput = document.getElementById("searchUser");
    const selectedStatusInput = document.getElementById("status");

    // Check if the input elements are found
    if (!searchUserInput || !selectedStatusInput) {
      toast.error("Search input or status input not found");
      return;
    }

    const searchUser = searchUserInput.value.toLowerCase(); // Convert to lowercase
    const selectedStatus = selectedStatusInput.value;

    const filtered = userDetails?.data.filter((record: any) => {
      // Default filter conditions
      let isMatchingSearch = true;
      let isMatchingStatus = true;
      let isWithinDateRange = true;

      // Filtering by search user
      if (searchUser !== "") {
        isMatchingSearch = Object.values(record).some((value: any) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchUser);
          }
          return false; // Ignore non-string values
        });
      }

      // Filtering by status
      if (selectedStatus !== "") {
        isMatchingStatus =
          selectedStatus === "" || selectedStatus === record.status.toString();
      }

      // Filtering by date range only if the date range picker is shown
      if (showDateRangePicker) {
        const createdAt = new Date(record.created_at);
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        isWithinDateRange = createdAt >= startDate && createdAt <= endDate;
      }

      return isMatchingSearch && isMatchingStatus && isWithinDateRange;
    });

    setFilteredTransactions(filtered);

    if (filtered && filtered.length > 0) {
      toast.success(`${filtered.length} record(s) found`);
    } else {
      toast.error("No records found");
    }
  };

  const getStatusText = (status: any) => {
    return status === 1 ? "Active" : "Inactive";
  };
  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "USER ID",
      width: 80,
    },
    {
      field: "username",
      type: "string",
      headerName: "USERNAME",
      width: 150,
    },
    {
      field: "name",
      type: "string",
      headerName: "NAME",
      width: 200,
    },
    {
      field: "email",
      type: "string",
      headerName: "EMAIL",
      width: 200,
    },
    {
      field: "tell",
      headerName: "PHONE",
      width: 200,
      type: "string",
    },
    {
      field: "state",
      headerName: "STATE",
      width: 100,
      type: "string",
    },
    {
      field: "dob",
      headerName: "DOB",
      width: 150,
      type: "string",
    },
    {
      field: "gender",
      headerName: "GENDER",
      width: 100,
      type: "string",
    },
    {
      field: "type",
      headerName: "USER TYPE",
      width: 100,
      type: "string",
    },
    {
      field: "wallet",
      headerName: "WALLET",
      width: 130,
      type: "string",
    },
    {
      field: "wwallet",
      headerName: "WIN WALLET",
      width: 130,
      type: "string",
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 80,
      type: "string",
      renderCell: (params) => <span>{getStatusText(params.value)}</span>,
    },
    {
      field: "created_at",
      headerName: "SIGNUP DATE",
      width: 200,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },
    {
      field: "ref",
      headerName: "REFERRED BY",
      width: 150,
      type: "string",
    },

    {
      field: "user_action",
      headerName: "MODIFY",
      width: 200,
      renderCell: (params) => (
        <div className="d-flex">
          <button
            className="btn btn-danger"
            // onClick={() => handleViewDatetime(params.row)}
          >
            Block
          </button>
          &nbsp; &nbsp;
          <button
            className="btn btn-primary"
            // onClick={() => handleViewDatetime(params.row)}
          >
            Bank
          </button>
        </div>
      ),
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
                <h4 className="mb-0"> Users </h4>
                <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                  <li className="breadcrumb-item mt-3">
                    <Link to="/home" className="default-color">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active mt-3">User</li>
                </ol>
              </div>

              <div>
                {isLoadingUser ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : userDetails?.data?.length === 0 ? (
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
                                    id="searchUser"
                                    placeholder="Search User"
                                    className="form-control"
                                  />
                                </td>
                                &nbsp;
                                <td>
                                  <select
                                    name="status"
                                    className="form-control"
                                    id="status"
                                  >
                                    <option value="">Select User Status</option>
                                    <option value="1">Active</option>
                                    <option value="2">Blocked</option>
                                    <option value="0">Inactive</option>
                                    <option value="3">Not Verified</option>
                                  </select>
                                </td>
                                &nbsp;
                                <td width="30%">
                                  <div
                                    onClick={toggleDateRangePicker}
                                    className="mt-1"
                                  >
                                    <p
                                      style={{ cursor: "pointer" }}
                                      className="text-center btn btn-light mt-2"
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
                                </td>
                                &nbsp;
                              </tr>
                              <>
                                <button
                                  type="button"
                                  className="btn btn-primary w-100 mt-3"
                                  onClick={handleFilter}
                                >
                                  Filter
                                </button>
                              </>
                            </tbody>
                          </table>
                        </form>
                      </div>
                    </div>
                    <p className="mt-4">{userDetails?.data?.length} Records</p>
                    <DataTable
                      slug="users"
                      columns={columns}
                      // rows={userDetails?.data}
                      rows={filteredTransactions || userDetails?.data}
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
    </>
  );
};

export default Users;
