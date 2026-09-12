import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Shell from "../../components/layout/Shell";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import UploadOperator from "../../components/sports/UploadOperator";
import useGetSportsOperator from "../../react-query/api-hooks/useGetSportsOperator";
import { Spinner } from "react-bootstrap";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", type: "string", headerName: "Operator", width: 150 },
  {
    field: "logo",
    headerName: "Logo",
    width: 200,
    renderCell: (params) => {
      return <img src={params?.row?.logo || "/noavatar.png"} alt="" />;
    },
  },
];

const SportOperators = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  const { userSportOperator, isLoadingSportOperator } = useGetSportsOperator(
    []
  );

  return (
    <Shell>
          <div className="container">
            <div className="page-title">
              <h4 className="mb-0">Sport Operators </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Sport Operators</li>
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

              <p>{userSportOperator?.data?.length} Records</p>
              {isLoadingSportOperator ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userSportOperator?.data?.length === 0 ? (
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
                    slug="sport-operator"
                    columns={columns}
                    rows={userSportOperator?.data}
                  />
                </>
              )}

              <br />
              <br />
            </div>
          </div>
        <BModal
          backdrop="static"
          keyboard={false}
          show={isOpen}
          onHide={handleClose}
          size="md"
        >
          <UploadOperator handleClose={handleClose} />
        </BModal>
    </Shell>
  );
};

export default SportOperators;
