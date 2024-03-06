import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import UploadCode from "../../components/sports/UploadCode";
import useGetSportCode from "../../react-query/api-hooks/useGetSportCode";
import moment from "moment";
import { Spinner } from "react-bootstrap";

const SportCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };

  const { userSportCode, isLoadingCode } = useGetSportCode();
  const formatCreatedAt = (createdAt: any) => {
    return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "ID",
      width: 120,
    },
    {
      field: "code",
      type: "string",
      headerName: "CODE",
      width: 250,
    },
    {
      field: "stake",
      headerName: "STAKE",
      width: 200,
      type: "string",
    },

    {
      field: "created_at",
      headerName: "DATE",
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
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
              <h4 className="mb-0">Sport Codes </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Sport codes</li>
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
              <div className="mt-5">
                {isLoadingCode ? (
                  <div className="spinner text-center mt-5">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </div>
                ) : userSportCode?.data?.length === 0 ? (
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
                    <p className="mt-4">
                      {userSportCode?.data?.length} Records
                    </p>
                    <DataTable
                      slug="sport-code"
                      columns={columns}
                      rows={userSportCode?.data}
                    />
                  </>
                )}
              </div>
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
          <UploadCode handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default SportCode;
