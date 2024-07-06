import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HTTP from "../../utils/httpClient";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { Button, Modal, Spinner } from "react-bootstrap";
import SingleUser from "../../components/SingleUser/SingleUser";
import moment from "moment";
import { FaEye } from "react-icons/fa";
// import moment from "moment";

const PlayHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(26);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  useEffect(() => {
    if (selectedOperator) {
      setIsLoading(true);
      HTTP.get(
        `/play-history-operator/${selectedOperator}?page=${currentPage}`,
        config
      )
        .then((response) => {
          setIsLoading(false);
          if (response && response.data) {
            setHistory(response.data.data || []);
          } else {
            toast.error("Failed to fetch play history");
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error("An error occurred while fetching play history");
        });
    }
  }, [selectedOperator, token, currentPage]);

  const handleFilter = () => {
    const searchUserInput = document.getElementById("searchUser");

    if (!searchUserInput) {
      toast.error("Search input not found");
      return;
    }

    const searchUser = searchUserInput.value.trim();

    setCurrentPage(1);

    setIsLoading(true);
    HTTP.get(
      `/play-history-operator/${selectedOperator}?search=${searchUser}&page=${currentPage}`,
      config
    )
      .then((response) => {
        const filteredData = response.data.data || [];

        setFilteredTransactions(filteredData);
        const numberOfRecords = filteredData.length;
        if (numberOfRecords) {
          toast.success(`Found ${numberOfRecords} records`);
        }

        if (!searchUser) {
          setFilteredTransactions(null);
        }
      })
      .catch(() => {
        toast.error("An error occurred while fetching play history");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchDataTransact = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationLabel = (label) => {
    switch (label) {
      case "&laquo; Previous":
        return "Previous";
      case "Next &raquo;":
        return "Next";
      default:
        return label;
    }
  };
  const operatorMap = {
    "26": "5/90 Games",
    "28": "Wesco",
    "43": "Green lotto",
    "27": "Baba Ijebu",
    "45": "Lottomania",
    "57": "Set Lotto",
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
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
  };

  const transactionsToRender = filteredTransactions?.data || history?.data;

  return (
    <div>
      <div className="main">
        <Navbar />
        <div className="container__flex">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="container">
            <div className="page-title">
              <h4 className="mb-0">Play History</h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Play Games</li>
              </ol>
            </div>

            <div>
              <div className="mb-3">
                <select
                  className="form-control w-25 mb-2 mt-4"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                >
                  <option value="">Select Operator</option>
                  <option value="26">5/90 Games</option>
                  <option value="28">Wesco</option>
                  <option value="43">Green lotto</option>
                  <option value="27">Baba Ijebu</option>
                  <option value="45">Lottomania</option>
                  <option value="57">Set Lotto</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="spinner text-dark text-center mt-5">
                <Spinner
                  as="span"
                  animation="border"
                  size="lg"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            ) : history?.length === 0 ? (
              <div className="d-flex justify-content-center text-center p-5">
                <div className="hidden-xs hidden-sm mx-auto">
                  <div className="alert alert-danger text-center" role="alert">
                    No Record Found
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="card mb-5" style={{ borderColor: "#337ab7" }}>
                  <div className="card-body">
                    <form method="post" action="">
                      <table cellPadding="5" width="40%">
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
                <p className="mt-4">{history?.total} Records</p>
                <div className="table-responsive card shadow">
                  <table className="table table-express app__transaction-web table-hover mt-4">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Operator</th>
                        <th>Stake</th>
                        <th>Game</th>
                        <th>Ticket Id</th>
                        <th>Game Type</th>
                        <th>Draw Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsToRender.map((item: any, index: any) => {
                        return (
                          <tr key={index}>
                            <td
                              className="text-primary"
                              onClick={() => handleEdit(item?.user)}
                              style={{ cursor: "pointer" }}
                            >
                              {item?.user}
                            </td>
                            <td>{item?.username}</td>

                            <td>{operatorMap[selectedOperator]}</td>
                            <td>₦{item?.amount}</td>
                            <td>
                              {selectedOperator == "26" ||
                              selectedOperator == "45"
                                ? item?.GameName
                                : selectedOperator == "28" ||
                                  selectedOperator == "43"
                                ? item?.drawname
                                : selectedOperator == "57"
                                ? item?.drawAlias
                                : ""}
                            </td>
                            <td>
                              {selectedOperator == "26" ||
                              selectedOperator == "45"
                                ? item?.TSN
                                : selectedOperator == "28" ||
                                  selectedOperator == "43"
                                ? item?.TikcetId
                                : selectedOperator == "57"
                                ? item?.wagerID
                                : ""}
                            </td>
                            <td>{item?.mgametype}</td>
                            <td>
                              {" "}
                              {selectedOperator == "26" ||
                              selectedOperator == "45"
                                ? moment(item?.DrawTime).format(
                                    "DD MMM, YYYY h:mma"
                                  )
                                : selectedOperator == "28" ||
                                  selectedOperator == "43"
                                ? moment(item?.drawdate).format(
                                    "DD MMM, YYYY h:mma"
                                  )
                                : selectedOperator == "57"
                                ? moment(item?.drawDate).format(
                                    "DD MMM, YYYY h:mma"
                                  )
                                : ""}
                            </td>
                            <td>{item?.status}</td>
                            <td>
                              <Button
                                variant="light"
                                onClick={() => handleViewTransaction(item)}
                              >
                                <FaEye />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      {history?.links?.map((link: any, index: any) => {
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
              </>
            )}
          </div>
        </div>
        <SingleUser userDetails={userDetails} setUserDetails={setUserDetails} />
        {selectedTransaction && (
          <Modal size="md" centered show={true} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{operatorMap[selectedOperator]} Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>User ID: {selectedTransaction?.user}</p>
              <p>Username: {selectedTransaction?.username}</p>
              <p>Operator: {operatorMap[selectedOperator]}</p>
              <p>Stake: ₦{selectedTransaction?.amount}</p>
              <p>Number Played: {selectedTransaction?.num}</p>
              <p>Lines: {selectedTransaction?.line}</p>
              <p>
                Game:{" "}
                {selectedOperator == "26" || selectedOperator == "45"
                  ? selectedTransaction?.GameName
                  : selectedOperator == "28" || selectedOperator == "43"
                  ? selectedTransaction?.drawname
                  : selectedOperator == "57"
                  ? selectedTransaction?.drawAlias
                  : ""}
              </p>
              <p>
                Ticket Id:{" "}
                {selectedOperator == "26" || selectedOperator == "45"
                  ? selectedTransaction?.TSN
                  : selectedOperator == "28" || selectedOperator == "43"
                  ? selectedTransaction?.TikcetId
                  : selectedOperator == "57"
                  ? selectedTransaction?.wagerID
                  : ""}
              </p>
              <p>Game Type: {selectedTransaction?.mgametype}</p>
              <p>
                Draw Date:{" "}
                {selectedOperator == "26" || selectedOperator == "45"
                  ? moment(selectedTransaction?.DrawTime).format(
                      "DD MMM, YYYY h:mma"
                    )
                  : selectedOperator == "28" || selectedOperator == "43"
                  ? moment(selectedTransaction?.drawdate).format(
                      "DD MMM, YYYY h:mma"
                    )
                  : selectedOperator == "57"
                  ? moment(selectedTransaction?.drawDate).format(
                      "DD MMM, YYYY h:mma"
                    )
                  : ""}
              </p>
              <p>Status: {selectedTransaction?.status}</p>
            </Modal.Body>
          </Modal>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default PlayHistory;
