import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetResults from "../../react-query/api-hooks/useGetResults";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import moment from "moment";
// import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator";
import AddResult from "../../components/results/AddResult";

const formatDate = (timestamp: any) => {
  return moment(timestamp).format("Do MMM YYYY");
};

const columns: GridColDef[] = [
  // { field: "id", headerName: "ID", width: 90 },

  {
    field: "operator",
    type: "string",
    headerName: "OPERATOR",
    width: 300,
  },
  {
    field: "game",
    type: "string",
    headerName: "GAME",
    width: 300,
  },
  {
    field: "winning_number",
    type: "string",
    headerName: "WINNING NUMBER",
    width: 300,
  },
  {
    field: "machine_number",
    type: "string",
    headerName: "MACHINE NUMBER",
    width: 300,
  },
  {
    field: "created_at",
    type: "string",
    headerName: "DATETIME",
    width: 300,
    valueFormatter: (params) => formatDate(params.value),
  },
];

const generateUniqueId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

const AllResults = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleGame = () => {
    handleOpen();
  };

  const operatorIds = [26, 27, 28, 42, 45, 57];
  const { userResults, isLoadingResults } = useGetResults(operatorIds);

  const [flattenedResults, setFlattenedResults] = useState([]);

  useEffect(() => {
    if (userResults && userResults.length > 0) {
      // Flatten the array of results and add unique id to each row
      const flattened = userResults.reduce((acc, curr) => {
        const dataWithIds = curr.data.map((row) => ({
          id: generateUniqueId(),
          ...row,
        }));
        return acc.concat(dataWithIds);
      }, []);
      setFlattenedResults(flattened);
    }
  }, [userResults]);

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
              <h4 className="mb-0"> Results </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Results</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  onClick={() => handleGame()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"></i>{" "}
                </a>
              </p>
              {/* <DataTable slug="users" columns={columns} rows={formattedData} /> */}
              {isLoadingResults ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userResults?.data?.length === 0 ? (
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
                  {/* <div className="card mb-5" style={{ borderColor: "#337ab7" }}>
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
                                <select
                                  name="operator"
                                  className="form-select"
                                  value={selectedOperator}
                                  onChange={handleOperatorChange}
                                >
                                  <option value="">Select Operator</option>

                                  {isLoadingLottoOperator ? (
                                    <option value="" disabled>
                                      Loading...
                                    </option>
                                  ) : userLottoOperator?.data?.length === 0 ? (
                                    <option value="">No Operators Found</option>
                                  ) : (
                                    userLottoOperator?.data?.map(
                                      (operator: any) => (
                                        <option
                                          key={operator.id}
                                          value={operator.id}
                                        >
                                          {operator.name}
                                        </option>
                                      )
                                    )
                                  )}
                                </select>
                              </td>
                              &nbsp;
                              <td>
                                <select
                                  name="game"
                                  className="form-select"
                                  value={selectedGame}
                                  onChange={handleGameChange}
                                >
                                  <option value="">Select Game</option>
                                  {gameOptions}
                                </select>
                              </td>
                              <td width="40%">
                                <button
                                  type="button"
                                  className="btn btn-primary w-50"
                                  // onClick={handleFilter}
                                >
                                  Filter
                                </button>
                              </td>
                              &nbsp; &nbsp;
                            </tr>
                          </tbody>
                        </table>
                      </form>
                    </div>
                  </div> */}
                  <p>{flattenedResults?.length} Records</p>

                  {/* <DataTable
                    slug="results"
                    columns={columns}
                    rows={userResults?.data}
                  /> */}
                  <DataTable
                    slug="results"
                    columns={columns}
                    rows={flattenedResults}
                    getRowId={(row) => row.date}
                  />
                </>
              )}

              <br />
              <br />
            </div>
          </div>
        </div>
        <Footer />
        <BModal
          backdrop="static"
          keyboard={false}
          show={isOpen}
          onHide={handleClose}
          size="md"
        >
          <AddResult handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default AllResults;
