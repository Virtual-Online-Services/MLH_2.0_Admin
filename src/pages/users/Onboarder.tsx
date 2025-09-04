import "./users.scss";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import HTTP from "../../utils/httpClient";
import SingleReferralUser from "../../components/SingleUser/SingleReferralUser";
interface User {
  id: number;
  username: string;
  status: number;
}

const Onboarder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const [userDetails, setUserDetails] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
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
    HTTP.get(`/get-onboarders?page=${currentPage}`, {
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

    if (!searchUserInput) {
      toast.error("Search input or status input not found");
      return;
    }

    const searchUser = searchUserInput?.value.trim();
    let queryParams = "";

    if (searchUser !== "") {
      queryParams += `&search=${searchUser}`;
    }

    if (showDateRangePicker) {
      const startDate = moment(dateRange[0].startDate).format("YYYY-MM-DD");
      const endDate = moment(dateRange[0].endDate).format("YYYY-MM-DD");
      queryParams += `&start_date=${startDate}&end_date=${endDate}`;
    }

    setCurrentPage(1);

    setIsLoading(true);
    HTTP.get(`/get-onboarders?page=${currentPage}${queryParams}`, {
      ...configHeaders,
    })
      .then((response: any) => {
        const filteredData = response.data.data;

        setFilteredTransactions(filteredData || []);

        if (filteredData && filteredData.length > 0) {
          setIsExportAvailable(true);
          toast.success(`Found ${filteredData.length} records`);
        } else {
          setIsExportAvailable(false);
          toast.error("No records found");
        }

        if (!searchUser && !showDateRangePicker) {
          setFilteredTransactions([]);
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
  const handleEdit = async (id: number) => {
    try {
      const endpoint = `https://api.mylottohub.com/v1/admin/referral/${id}`;
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

  const handleExport = () => {
    const dataToExport = filteredTransactions || users?.data;

    if (!dataToExport || dataToExport.length === 0) {
      toast.error("No data available for export.");
      return;
    }

    const formattedData = dataToExport.map((record: any) => ({
      "User ID": record?.id,
      Username: record?.username,
      Name: record?.name,
      "Email/Phone Number": [record?.email, record?.tell]
        .filter(Boolean)
        .join(" / "),
      "User Type": record?.type,
      Wallet: `${record?.ref_give}`,
      "Signup Date": moment
        .utc(record?.num_pos || record?.created_at, "YYYY-MM-DD HH:mm:ss")
        .local()
        .format("Do MMM YYYY | h:mm:ssA"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

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
                <h4 className="mb-0">Onboarder Users</h4>
                <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                  <li className="breadcrumb-item mt-3">
                    <Link to="/home" className="default-color">
                      Dashboard
                    </Link>
                  </li>
                  <li className="breadcrumb-item active mt-3">
                    Onboarder Users
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
                                &nbsp; &nbsp;
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
                              <th className="fw-bolder">STATE</th>
                              <th className="fw-bolder">LGA</th>
                              <th className="fw-bolder">EMAIL/PHONE NUMBER</th>
                              <th className="fw-bolder">REFERRAL BALANCE</th>
                              <th className="fw-bolder">SIGNUP DATE</th>
                            </tr>
                          </tbody>

                          <tbody>
                            <>
                              {(Array.isArray(filteredTransactions) &&
                              filteredTransactions.length > 0
                                ? filteredTransactions
                                : Array.isArray(users?.data)
                                ? users.data
                                : []
                              ).map((record, index) => (
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
                                  <td>{record?.state}</td>
                                  <td>{record?.lga}</td>
                                  <td>
                                    {[record?.email, record?.tell]
                                      .filter(Boolean)
                                      .join(" / ")}
                                  </td>
                                  <td>₦{record?.ref_give}</td>
                                  <td>
                                    {moment
                                      .utc(
                                        record?.created_at || record?.date,
                                        "YYYY-MM-DD HH:mm:ss"
                                      )
                                      .local()
                                      .format("Do MMM YYYY | h:mm:ssA")}
                                  </td>
                                </tr>
                              ))}
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
          <SingleReferralUser
            userDetails={userDetails}
            setUserDetails={setUserDetails}
          />

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Onboarder;
