import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetLottoGames from "../../react-query/api-hooks/useGetLottoGames";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link, useNavigate } from "react-router-dom";
import GameLotto from "../../components/LottoModal/GameLotto";

const Games = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleGame = () => {
    handleOpen();
  };
  const { userLottoGame, isLoadingLottoGame } = useGetLottoGames([]);
  const navigate = useNavigate();
  // const generateUniqueId = () => {
  //   return "_" + Math.random().toString(36).substr(2, 9);
  // };

  useEffect(() => {
    if (userLottoGame && userLottoGame.data) {
      const gamesWithIds = userLottoGame.data.map((game, index) => ({
        ...game,
        id: index + 1,
      }));

      // Create a new object with updated data array
      const updatedUserLottoGame = {
        ...userLottoGame,
        data: gamesWithIds,
      };

      // Update userLottoGame with the new object
      userLottoGame.data = updatedUserLottoGame;
    }
  }, [userLottoGame]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
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
      field: "game_datetime", // Assume this is the field containing datetime
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

  const handleViewDatetime = (row) => {
    navigate(`/game-datetime/${row.id}`);
  };

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
                <li className="breadcrumb-item active">Games</li>
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
              {/* <DataTable slug="users" columns={columns} rows={formattedData} /> */}
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
                    slug="game"
                    columns={columns}
                    rows={userLottoGame?.data}
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
          <GameLotto handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default Games;
