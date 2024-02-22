import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import LottoModal from "../../components/LottoModal/LottoModal";

const Operators = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator([]);

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      type: "string",
      headerName: "Name",
      width: 300,
    },
    {
      field: "logo",
      headerName: "Logo",
      width: 300,
      renderCell: (params) => {
        return <img src={params?.row?.logo || "/noavatar.png"} alt="" />;
      },
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
              <h4 className="mb-0"> Operators </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Operators</li>
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
              <p>{userLottoOperator?.data?.length} Records</p>
              {/* <DataTable slug="users" columns={columns} rows={formattedData} /> */}
              {isLoadingLottoOperator ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userLottoOperator?.data?.length === 0 ? (
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
                    slug="operator"
                    columns={columns}
                    rows={userLottoOperator?.data}
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
          <LottoModal handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default Operators;
