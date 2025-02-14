import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetAdvert from "../../react-query/api-hooks/useGetAdvert";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import AdvertModal from "../../components/AdvertModal/AdvertModal";

import { Link } from "react-router-dom";
import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator";

const Advert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const { userAdvertResponse, isLoadingAdvert } = useGetAdvert([]);

  const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator();
  const operatorMap = Array.isArray(userLottoOperator?.data)
    ? userLottoOperator.data.reduce((acc, operator) => {
        acc[operator.id] = operator.name;
        return acc;
      }, {})
    : {};

  const formatDate = (timestamp: any) => {
    return moment.unix(timestamp).format("Do MMM YYYY");
  };

  const formatTime = (timestamp: any) => {
    return timestamp ? moment.unix(timestamp).format("HH:mm:ss") : "";
  };

  const getStatus = (endTimestamp: any) => {
    const currentDate = moment();
    const endDate = moment.unix(endTimestamp);
    return endDate.isBefore(currentDate) ? "Inactive" : "Active";
  };

  // Modify userAdvertResponse.data to include the status field
  const formattedData =
    userAdvertResponse?.data.map((ad: any) => ({
      ...ad,
      status: getStatus(ad.end_date),
      operator_name: operatorMap[ad.operator_id] || "No chosen yet",
    })) || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "banner",
      headerName: "Banner",
      width: 100,
      renderCell: (params) => {
        return <img src={params?.row?.banner || "/noavatar.png"} alt="" />;
      },
    },
    {
      field: "name",
      type: "string",
      headerName: "Name",
      width: 150,
    },
    {
      field: "company",
      type: "string",
      headerName: "Company",
      width: 200,
    },
    {
      field: "link",
      type: "string",
      headerName: "Link",
      width: 200,
    },
    {
      field: "start_date",
      type: "string",
      headerName: "Start Date",
      width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "end_date",
      type: "string",
      headerName: "End Date",
      width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "page_web",
      type: "string",
      headerName: "Web Page",
      width: 200,
    },
    {
      field: "page_app",
      type: "string",
      headerName: "App Page",
      width: 200,
    },
    {
      field: "operator_id",
      type: "number",
      headerName: "Operator ID",
      width: 150,
      valueGetter: (params) => params.row.operator_name,
    },
    {
      field: "start_time",
      type: "string",
      headerName: "Start Time",
      width: 200,
      valueFormatter: (params) => formatTime(params.value),
    },
    {
      field: "end_time",
      type: "string",
      headerName: "End Time",
      width: 200,
      valueFormatter: (params) => formatTime(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      type: "string",
    },
  ];

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
              <h4 className="mb-0"> Advert </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Advert</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  onClick={() => handleAdvert()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"></i>{" "}
                </a>
              </p>
              <p>{formattedData?.length} Records</p>
              {isLoadingAdvert ? (
                <div className="spinner text-dark text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : formattedData?.length === 0 ? (
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
                  <DataTable
                    slug="advert"
                    columns={columns}
                    rows={formattedData}
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
          <AdvertModal handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default Advert;
