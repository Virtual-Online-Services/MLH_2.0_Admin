import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import HTTP from "../../utils/httpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AgentUser from "../../components/agent/AgentUser";

interface User {
  id: number;
  username: string;
  status: number;
}

const ListTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [agentDetails, setAgentDetails] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showExportButton, setShowExportButton] = useState(false);

  const configHeaders = {
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = () => {
    setIsLoading(true);
    HTTP.get(`/get-agenttransactions?page=${currentPage}`, {
      ...configHeaders,
    })
      .then((response: any) => {
        setTransactions(response.data.data);
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
    const selectedDateRange = document.getElementById("searchDateRange");

    if (!searchUserInput || !selectedStatusInput || !selectedDateRange) {
      toast.error("Search input or status input not found");
      return;
    }

    const searchUser = searchUserInput?.value.trim();
    const selectedStatus = selectedStatusInput?.value;
    const selectedDate = selectedDateRange?.value;
    let queryParams = "";

    if (searchUser !== "") {
      queryParams += `&search=${searchUser}`;
    } else if (selectedStatus !== "") {
      queryParams += `&search=${selectedStatus}`;
    } else if (selectedDate !== "") {
      const startDate = moment(dateRange[0].startDate).format("YYYY-MM-DD");
      const endDate = moment(dateRange[0].endDate).format("YYYY-MM-DD");
      queryParams += `&start_date=${startDate}&end_date=${endDate}`;
      // queryParams += `&search=${selectedDate}`;
    }

    // Reset current page to 1 when filtering
    setCurrentPage(1);

    setIsLoading(true);
    HTTP.get(`/get-agenttransactions?page=${currentPage}${queryParams}`, {
      ...configHeaders,
    })
      .then((response: any) => {
        const filteredData = response.data.data;

        setFilteredTransactions(filteredData || []);
        // Display toast with the number of records found
        // const numberOfRecords = filteredData ? filteredData.length : 0;
        if (response) {
          toast.success(`Found ${response.data.data.total} records`);
        }

        // if (!searchUser && !selectedStatus && !showDateRangePicker) {
        //   setFilteredTransactions(null);
        // }
        if (!searchUser && !selectedStatus && !showDateRangePicker) {
          setFilteredTransactions(null);
          setShowExportButton(false);
        } else {
          setShowExportButton(true);
        }
      })
      .catch((error: any) => {
        // Handle error
        setFilteredTransactions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    } catch (error: any) {}
  };

  const exportToExcel = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the search user input element
    const searchUserInput = document.getElementById(
      "searchUser"
    ) as HTMLInputElement | null;

    // Get the selected status input element
    const selectedStatusInput = document.getElementById(
      "status"
    ) as HTMLSelectElement | null;

    if (!searchUserInput || !selectedStatusInput) {
      toast.error("Search input or status input not found");
      return;
    }

    const searchUser = searchUserInput.value.trim();
    const selectedStatus = selectedStatusInput.value;

    let queryParams = [];

    // Construct the query parameters
    if (searchUser !== "") {
      queryParams.push(`search=${encodeURIComponent(searchUser)}`);
    }

    if (selectedStatus !== "") {
      queryParams.push(`status=${encodeURIComponent(selectedStatus)}`);
    }

    if (dateRange && dateRange[0]) {
      const startDate = moment(dateRange[0].startDate).format("YYYY-MM-DD");
      const endDate = moment(dateRange[0].endDate).format("YYYY-MM-DD");
      queryParams.push(`start_date=${startDate}`);
      queryParams.push(`end_date=${endDate}`);
    }

    // If no filters are applied, prevent export and show error
    if (queryParams.length === 0) {
      toast.error("Please enter at least one filter to export.");
      return;
    }

    const queryString = queryParams.join("&");
    const exportUrl = `https://api.mylottohub.com/v1/admin/export-user-get-transactions?${queryString}`;

    try {
      // Open the request in a new tab
      window.open(exportUrl, "_blank");
      toast.success("Exported Successfully");
    } catch (error: any) {
      toast.error(error.message || "Error exporting transactions.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const transactionData = filteredTransactions?.data || transactions?.data;
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
                <h4 className="mb-0">Agent Transactions </h4>
                <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                  <li className="breadcrumb-item mt-3">
                    <Link to="/home" className="default-color">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active mt-3">
                    Agent Transaction
                  </li>
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
                ) : transactions?.data?.length === 0 ? (
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
                        {/* <form method="post" action="">
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
                                        ? "Hide"
                                        : "Select Date Range"}
                                    </p>
                                  </div>
                                  {/* {showDateRangePicker && (
                                    <DateRangePicker
                                      onChange={handleDateRangeChange}
                                      moveRangeOnFirstSelection={false}
                                      ranges={dateRange}
                                    />
                                  )} 
                                  <span id="searchDateRange">
                                    {showDateRangePicker && (
                                      <DateRangePicker
                                        onChange={handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRange}
                                      />
                                    )}
                                  </span>
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
                        </form> */}
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
                                        ? "Hide"
                                        : "Select Date Range"}
                                    </p>
                                  </div>

                                  <span id="searchDateRange">
                                    {showDateRangePicker && (
                                      <DateRangePicker
                                        onChange={handleDateRangeChange}
                                        moveRangeOnFirstSelection={false}
                                        ranges={dateRange}
                                      />
                                    )}
                                  </span>
                                </td>
                                &nbsp; &nbsp;
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleFilter}
                                  >
                                    Filter
                                  </button>
                                </td>
                                &nbsp;
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={exportToExcel}
                                    style={{
                                      display: showExportButton
                                        ? "block"
                                        : "none",
                                    }}
                                  >
                                    Export
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </form>
                      </div>
                    </div>
                    <p className="mt-4">{transactions?.total} Records</p>

                    <div>
                      <div className="table-responsive card shadow">
                        <table className="table table-express app__transaction-web table-hover mt-4">
                          <tbody>
                            <tr>
                              <th className="fw-bolder">USER ID</th>
                              <th className="fw-bolder">USERNAME</th>
                              <th className="fw-bolder">TICKET ID</th>
                              <th className="fw-bolder">TYPE</th>
                              <th className="fw-bolder">DESCRIPTION</th>
                              <th className="fw-bolder">AMOUNT</th>
                              <th className="fw-bolder">CHANNEL</th>
                              <th className="fw-bolder">CURRENT BALANCE</th>
                              <th className="fw-bolder">DATE</th>
                            </tr>
                          </tbody>

                          <tbody>
                            <>
                              {transactionData
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
                                        onClick={() => handleEdit(record?.user)}
                                      >
                                        {record?.user}
                                      </td>
                                      <td
                                        className="text-primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleEdit(record?.user)}
                                      >
                                        {record?.username}
                                      </td>
                                      <td>{record?.ref}</td>
                                      <td>{record?.type}</td>
                                      <td>{record?.description}</td>
                                      <td>₦{record?.amount}</td>
                                      <td>{record?.channel}</td>
                                      <td>₦{record?.abalance}</td>
                                      <td>{formattedDate}</td>
                                    </tr>
                                  );
                                })}
                            </>
                          </tbody>
                        </table>

                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            {transactions?.links?.map(
                              (link: any, index: any) => {
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
                              }
                            )}
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
          <AgentUser
            agentDetails={agentDetails}
            setAgentDetails={setAgentDetails}
          />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ListTransaction;
