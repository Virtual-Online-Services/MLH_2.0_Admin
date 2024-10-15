import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import useGetSportsForecast from "../../react-query/api-hooks/useGetSportsForecast";
import { Spinner } from "react-bootstrap";
import UploadForecasters from "../../components/sports/UploadForecasters";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", type: "string", headerName: "Name", width: 200 },
  {
    field: "games_predicted",
    type: "string",
    headerName: "Total Game Predicted",
    width: 250,
  },
  { field: "win", type: "string", headerName: "Total Game Won", width: 250 },
  //   {
  //     field: "logo",
  //     headerName: "Logo",
  //     width: 200,
  //     renderCell: (params) => {
  //       return <img src={params?.row?.logo || "/noavatar.png"} alt="" />;
  //     },
  //   },
];

const SportForecasters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const { userSportForecast, isLoadingSportForecast } = useGetSportsForecast(
    []
  );

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
              <h4 className="mb-0">Sport Forecasters </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Sport Forecasters</li>
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

              <p>{userSportForecast?.length} Records</p>
              {isLoadingSportForecast ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userSportForecast?.length === 0 ? (
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
                    slug="sport-forecast"
                    columns={columns}
                    rows={userSportForecast}
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
          <UploadForecasters handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default SportForecasters;
