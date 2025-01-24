import "./users.scss";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetAdmin from "../../react-query/api-hooks/useGetAdmin";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SingleUser from "../../components/SingleUser/SingleUser";
// import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";

import HTTP from "../../utils/httpClient";
interface User {
  id: number;
  username: string;
  status: number;
}

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [userDetails, setUserDetails] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [isExportAvailable, setIsExportAvailable] = useState(false); // New state variable

  const configHeaders = {
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    setIsLoading(true);
    HTTP.get(`/admin-get-users?page=${currentPage}`, {
      ...configHeaders,
    })
      .then((response: any) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        // console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchDataTransact = (page: any) => {
    setCurrentPage(page);
  };

  const renderPaginationLabel = (label: any) => {
    switch (label) {
      case "&laquo; Previous":
        return "Previous";
      case "Next &raquo;":
        return "Next";
      default:
        return label;
    }
  };

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

    if (!searchUserInput || !selectedStatusInput) {
      toast.error("Search input or status input not found");
      return;
    }

    const searchUser = searchUserInput?.value.trim();
    const selectedStatus = selectedStatusInput?.value;
    let queryParams = "";

    if (searchUser !== "") {
      queryParams += `&search=${searchUser}`;
    }

    if (selectedStatus !== "") {
      queryParams += `&status=${selectedStatus}`;
    }

    if (showDateRangePicker) {
      const startDate = moment(dateRange[0].startDate).format("YYYY-MM-DD");
      const endDate = moment(dateRange[0].endDate).format("YYYY-MM-DD");
      queryParams += `&start_date=${startDate}&end_date=${endDate}`;
    }

    // Reset current page to 1 when filtering
    setCurrentPage(1);

    setIsLoading(true);
    HTTP.get(`/admin-get-users?page=${currentPage}${queryParams}`, {
      ...configHeaders,
    })
      .then((response: any) => {
        const filteredData = response.data.data;

        setFilteredTransactions(filteredData || []);

        // Check if filtered data is available and update the export availability state
        if (filteredData && filteredData.length > 0) {
          setIsExportAvailable(true);
          toast.success(`Found ${filteredData.length} records`);
        } else {
          setIsExportAvailable(false);
          toast.error("No records found");
        }

        if (!searchUser && !selectedStatus && !showDateRangePicker) {
          setFilteredTransactions(null);
          setIsExportAvailable(false);
        }
      })
      .catch((error: any) => {
        toast.error("Failed to filter users");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusText = (status: any) => {
    return status === 1 ? "Active" : "Inactive";
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
    } catch (error: any) {}
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

      toast.success("User blocked successfully");

      fetchData();
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
      toast.success("User unblocked successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleExport = () => {
    const dataToExport = filteredTransactions || users?.data;

    if (!dataToExport || dataToExport.length === 0) {
      toast.error("No data available for export.");
      return;
    }
    const totalWallet = dataToExport.reduce(
      (acc: number, record: any) => acc + parseFloat(record?.wallet || 0),
      0
    );
    const totalWinWallet = dataToExport.reduce(
      (acc: number, record: any) => acc + parseFloat(record?.wwallet || 0),
      0
    );

    // Prepare the data for the worksheet
    const formattedData = dataToExport.map((record: any) => ({
      "User ID": record?.id,
      Username: record?.username,
      Name: record?.name,
      "Email/Phone Number": record?.email || record?.tell,
      "User Type": record?.type,
      Wallet: `${record?.wallet}`,
      "Win Wallet": `${record?.wwallet}`,
      Status: getStatusText(record?.status),
      "Signup Date": moment
        .utc(record?.date || record?.created_at, "YYYY-MM-DD HH:mm:ss")
        .local()
        .format("Do MMM YYYY | h:mm:ssA"),
      "Total Money Funded": totalWallet,
      "Total Winnings": totalWinWallet,
    }));

    // Create a new workbook and add a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate an Excel file and trigger download
    XLSX.writeFile(workbook, "filtered_users.xlsx");
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);
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
                {isLoading ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : users?.data?.length === 0 ? (
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
                                    className="form-select"
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
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn btn-primary w-100 mt-3"
                                  onClick={handleFilter}
                                >
                                  Filter
                                </button>
                                &nbsp;&nbsp;&nbsp;
                                {isExportAvailable && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary w-100 mt-3"
                                    onClick={handleExport}
                                  >
                                    Export
                                  </button>
                                )}
                              </div>
                            </tbody>
                          </table>
                        </form>
                      </div>
                    </div>
                    <p className="mt-4">{users?.total} Records</p>

                    <div>
                      <div className="table-responsive card shadow">
                        <table className="table table-express app__transaction-web table-hover mt-4">
                          <tbody>
                            <tr>
                              <th className="fw-bolder">USER ID</th>
                              <th className="fw-bolder">USERNAME</th>
                              <th className="fw-bolder">NAME</th>
                              <th className="fw-bolder">EMAIL/PHONE NUMBER</th>
                              <th className="fw-bolder">USER TYPE</th>
                              <th className="fw-bolder">WALLET</th>
                              <th className="fw-bolder">WIN WALLET</th>
                              <th className="fw-bolder">STATUS</th>
                              <th className="fw-bolder">SIGNUP DATE</th>
                              <th className="fw-bolder">MODIFY</th>
                            </tr>
                          </tbody>

                          <tbody>
                            <>
                              {(filteredTransactions || users?.data)
                                ?.sort(
                                  (a: any, b: any) =>
                                    new Date(b?.created_at) -
                                    new Date(a?.created_at)
                                )
                                .map((record: any, index: any) => {
                                  const formattedDate = moment
                                    .utc(
                                      record?.date || record?.created_at,
                                      "YYYY-MM-DD HH:mm:ss"
                                    )
                                    .local()
                                    .format("Do MMM YYYY | h:mm:ssA");

                                  return (
                                    <tr key={index}>
                                      <td
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleEdit(record?.id)}
                                      >
                                        {record?.id}
                                      </td>
                                      <td
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleEdit(record?.id)}
                                      >
                                        {record?.username}
                                      </td>
                                      <td>{record?.name}</td>
                                      <td>{record?.email || record?.tell}</td>
                                      <td>{record?.type}</td>
                                      <td>₦{record?.wallet}</td>
                                      <td>₦{record?.wwallet}</td>
                                      <td>{getStatusText(record?.status)}</td>
                                      <td>{formattedDate}</td>
                                      <td>
                                        {" "}
                                        <div className="d-flex">
                                          <button
                                            className={`btn btn-${
                                              record?.status === 1
                                                ? "danger"
                                                : "success"
                                            }`}
                                            onClick={() =>
                                              record?.status === 1
                                                ? handleBlockUser(record?.id)
                                                : handleUnblockUser(record?.id)
                                            }
                                          >
                                            {record?.status === 1
                                              ? "Block"
                                              : "Unblock"}
                                          </button>
                                          &nbsp; &nbsp;
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </>
                          </tbody>
                        </table>

                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            {users?.links?.map((link: any, index: any) => {
                              return (
                                <>
                                  <div key={index}>
                                    <li
                                      className={`page-item ${
                                        link?.active ? "active" : ""
                                      }`}
                                    >
                                      <a
                                        className="page-link"
                                        href={link?.url}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          fetchDataTransact(link?.label);
                                        }}
                                      >
                                        {renderPaginationLabel(link?.label)}
                                      </a>
                                    </li>
                                  </div>
                                </>
                              );
                            })}
                          </ul>
                        </nav>
                      </div>
                    </div>
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
