import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import Navbar from "../../components/navbar/Navbar";
import Menu from "../../components/menu/Menu";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetAllAgentTransactions from "../../react-query/api-hooks/useGetAllAgentTransactions";
import Footer from "../../components/footer/Footer";
import moment from "moment";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import { useState } from "react";
import { toast } from "react-toastify";

const ListTransaction = () => {
  const { agentTransactions, isLoadingAgentTransaction } =
    useGetAllAgentTransactions([]);

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
    const filtered = agentTransactions?.data.filter((transaction: any) => {
      const createdAt = new Date(transaction.created_at);
      const startDate = dateRange[0].startDate;
      const endDate = dateRange[0].endDate;
      return createdAt >= startDate && createdAt <= endDate;
    });
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
  const columns: GridColDef[] = [
    {
      field: "user",
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
      field: "customer_tell",
      headerName: "PHONE",
      width: 150,
      type: "string",
    },
    {
      field: "ref",
      headerName: "TICKET ID",
      width: 450,
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
      width: 750,
      type: "string",
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 130,
      type: "string",
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
    },
    {
      field: "created_at",
      headerName: "SIGNUP DATE",
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
                {isLoadingAgentTransaction ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : agentTransactions?.data?.length === 0 ? (
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
                      {agentTransactions?.data?.length} Records
                    </p>

                    <DataTable
                      slug="agent-transactions"
                      columns={columns}
                      rows={filteredTransactions || agentTransactions?.data}
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

export default ListTransaction;
