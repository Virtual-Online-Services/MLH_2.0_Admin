import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetInstantGames from "../../react-query/api-hooks/useGetInstantGames";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link, useNavigate } from "react-router-dom";
import InstantGameLotto from "../../components/instant-game/InstantGameLotto";

const InstantGames = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleGame = () => {
    handleOpen();
  };
  const { userLottoGame, isLoadingLottoGame } = useGetInstantGames([]);
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      type: "string",
      headerName: "NAME",
      width: 300,
    },
    {
      field: "operator",
      type: "string",
      headerName: "OPERATOR",
      width: 300,
    },
    {
      field: "game_datetime",
      headerName: "GAME DATETIME",
      width: 300,
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => handleViewDatetime(params.row)}
        >
          View Datetime
        </button>
      ),
    },
  ];

  const handleViewDatetime = (row: any) => {
    navigate(`/game-datetime/${row.id}`);
  };

  const rowsWithIds = userLottoGame?.data;

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
              <h4 className="mb-0"> Games </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Instant Games</li>
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
              <p>{userLottoGame?.data?.length} Records</p>
              {isLoadingLottoGame ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userLottoGame?.data?.length === 0 ? (
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
                    slug="instant-game-operator"
                    columns={columns}
                    rows={rowsWithIds}
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
          <InstantGameLotto handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default InstantGames;
