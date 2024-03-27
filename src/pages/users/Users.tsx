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
import { useSelector } from "react-redux";
import SingleUser from "../../components/SingleUser/SingleUser";
import { useQueryClient } from "@tanstack/react-query";

import HTTP from "../../utils/httpClient";

const Users = () => {
  const { userAllDetails, isLoadingUser } = useGetUsers([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [userDetails, setUserDetails] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const queryClient = useQueryClient();

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

    const filtered = userAllDetails?.data.filter((record: any) => {
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
          return false;
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

  const handleBlockUser = async (id: number) => {
    try {
      await HTTP.post(
        `/user-blockuser/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails((prevState) => {
        if (prevState && prevState.id === id) {
          return { ...prevState, status: 2 };
        }
        return prevState;
      });
      toast.success("User blocked successfully");
      queryClient.invalidateQueries("GET_ALL_USERS");
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (id: number) => {
    try {
      await HTTP.post(
        `/user-unblockuser/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails((prevState) => {
        if (prevState && prevState.id === id) {
          return { ...prevState, status: 1 };
        }
        return prevState;
      });
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries("GET_ALL_USERS");
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };
  console.log(userAllDetails);

  const columns: GridColDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "USER ID",
      width: 80,
      renderCell: (params) => (
        <a className="text-primary" onClick={() => handleEdit(params.row.id)}>
          {params.value}
        </a>
      ),
    },
    {
      field: "username",
      type: "string",
      headerName: "USERNAME",
      width: 150,
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
      field: "type",
      headerName: "USER TYPE",
      width: 180,
      type: "string",
    },
    {
      field: "wallet",
      headerName: "WALLET",
      width: 130,
      type: "string",
      valueGetter: (params) => `₦${params.value}`,
    },
    {
      field: "wwallet",
      headerName: "WIN WALLET",
      width: 130,
      type: "string",
      valueGetter: (params) => `₦${params.value}`,
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
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },
    // {
    //   field: "ref",
    //   headerName: "REFERRED BY",
    //   width: 200,
    //   type: "string",
    // },

    {
      field: "user_action",
      headerName: "MODIFY",
      width: 200,
      renderCell: (params) => (
        <div className="d-flex">
          <button
            className={`btn btn-${
              params.row.status === 1 ? "danger" : "success"
            }`}
            onClick={() =>
              params.row.status === 1
                ? handleBlockUser(params.row.id)
                : handleUnblockUser(params.row.id)
            }
          >
            {params.row.status === 1 ? "Block" : "Unblock"}
          </button>
          &nbsp; &nbsp;
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
                ) : userAllDetails?.data?.length === 0 ? (
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
                    <p className="mt-4">
                      {userAllDetails?.data?.total} Records
                    </p>
                    <DataTable
                      slug="users"
                      columns={columns}
                      // rows={userDetails?.data}
                      rows={filteredTransactions || userAllDetails?.data?.data}
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

export default Users;
