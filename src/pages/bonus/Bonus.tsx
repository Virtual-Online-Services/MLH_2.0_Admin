import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetBonus from "../../react-query/api-hooks/useGetBonus";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link, useNavigate } from "react-router-dom";
import BonusModal from "../../components/bonus/BonusModal";

const Bonus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const navigate = useNavigate();
  const { userBonus, isLoadingBonus } = useGetBonus([]);

  const columns: GridColDef[] = [
    {
      field: "gh_bonus",
      headerName: "Ghana Games",
      width: 150,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: "lm_bonus",
      headerName: "LottoMania",
      width: 150,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: "gl_bonus",
      headerName: "Green Lotto",
      width: 200,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: "sl_bonus",
      headerName: "Set Lotto",
      width: 200,
      valueFormatter: (params) => `${params.value}%`,
    },

    {
      field: "we_bonus",
      headerName: "Wesco",
      width: 150,
      valueFormatter: (params) => `${params.value}%`,
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
              <h4 className="mb-0"> Bonus </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Operator Bonus</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  onClick={() => handleAdvert()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"> Update Operator Bonus</i>
                </a>{" "}
                <span
                  onClick={() => navigate("/lotto-bonus")}
                  className="btn btn-primary mt-4 ml-5"
                >
                  <i className="fa fa-eye"> View Lotto Bonus</i>{" "}
                </span>
              </p>
              <p>{userBonus?.length} Records</p>
              {isLoadingBonus ? (
                <div className="spinner text-dark text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userBonus?.length === 0 ? (
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
                    slug="single-transactions"
                    columns={columns}
                    rows={userBonus}
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
          <BonusModal handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default Bonus;
