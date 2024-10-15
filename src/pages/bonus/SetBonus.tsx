import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetLottoBonus from "../../react-query/api-hooks/useGetLottoBonus";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import LottoBonusModal from "../../components/bonus/LottoBonusModal";
import moment from "moment";

const SetBonus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const { userLottoBonus, isLoadingLottoBonus } = useGetLottoBonus([]);
  const formatDate = (timestamp: any) => {
    return moment(timestamp).format("Do MMM YYYY");
  };
  const formatEndDate = (timestamp: any) => {
    return moment(timestamp).format("Do MMM YYYY");
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
    },
    {
      field: "type",
      headerName: "TYPE",
      width: 150,
      valueFormatter: (params) => {
        switch (params.value) {
          case 1:
            return "No cash Back";
          case 2:
            return "Super Bonus";
          case 3:
            return "Referral Bonus";
          case 4:
            return "Welcome Bonus";
          case 5:
            return "Deposit Bonus";
          default:
            return "-";
        }
      },
    },
    {
      field: "operator",
      headerName: "Operator",
      width: 150,
      valueFormatter: (params) => {
        switch (params.value) {
          case 26:
            return "5/90 Games";
          case 28:
            return "Wesco";
          case 43:
            return "Green lotto";
          case 27:
            return "Baba Ijebu";
          case 45:
            return "Lottomania";
          case 57:
            return "Set Lotto";
          default:
            return "-";
        }
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      valueFormatter: (params) => `₦${params.value} `,
    },
    {
      field: "percentage",
      headerName: "Percentage",
      width: 200,
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: "stake",
      headerName: "STAKE",
      width: 200,
      valueFormatter: (params) => `₦${params.value} `,
    },
    {
      field: "wallet",
      headerName: "WALLET",
      width: 200,
      valueFormatter: (params) => `₦${params.value} `,
    },
    {
      field: "start_date",
      headerName: "DATE CREATED",
      width: 200,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "end_date",
      headerName: "END DATE",
      width: 200,
      valueFormatter: (params) => formatEndDate(params.value),
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
                <li className="breadcrumb-item active">Lotto Bonus</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  onClick={() => handleAdvert()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"></i>
                </a>{" "}
              </p>
              <p>{userLottoBonus?.length} Records</p>
              {isLoadingLottoBonus ? (
                <div className="spinner text-dark text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userLottoBonus?.length === 0 ? (
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
                    rows={userLottoBonus}
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
          <LottoBonusModal handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default SetBonus;
