import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetAdmin from "../../react-query/api-hooks/useGetAdmin";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import AddAdmin from "../../components/admin/AddAdmin";
import { useSelector } from "react-redux";

const RegisterAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { userAdminResponse, isLoadingAdmin } = useGetAdmin([]);
  const adminName = userInfo?.data?.name;
  const columns: GridColDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "No",
      width: 300,
    },
    {
      field: "name",
      type: "string",
      headerName: "Name",
      width: 300,
    },
    {
      field: "username",
      type: "string",
      headerName: "Username",
      width: 300,
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
              <h4 className="mb-0"> Admin </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Admin</li>
              </ol>
            </div>

            <div>
              {adminName === "Super Admin" && (
                <>
                  <a
                    onClick={() => handleAdvert()}
                    className="btn btn-primary mt-4"
                  >
                    <i className="fa fa-plus-circle"></i>{" "}
                  </a>
                </>
              )}
              {adminName === "Super Admin" && (
                <>
                  <p>{userAdminResponse?.data?.length} Records</p>
                </>
              )}

              {isLoadingAdmin ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userAdminResponse?.data?.length === 0 ? (
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
              ) : adminName === "Super Admin" ? (
                <DataTable
                  slug="admin_register"
                  columns={columns}
                  rows={userAdminResponse?.data}
                  getRowId={(row) => row.id}
                />
              ) : (
                <div className="alert alert-danger text-center mt-4">
                  You don't have the permission to view this content.
                </div>
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
          size="lg"
        >
          <AddAdmin handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default RegisterAdmin;
