import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetLottoGames from "../../react-query/api-hooks/useGetLottoGames";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import { Link, useParams } from "react-router-dom";
// import GameLotto from "../../components/LottoModal/GameLotto";

const GameDateTime = () => {
  const [game, setGame] = useState(null);
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  //   const handleGame = () => {
  //     handleOpen();
  //   };
  const { userLottoGame, isLoadingLottoGame } = useGetLottoGames([]);
  const rowsWithIds = userLottoGame?.data?.map((row: any, index: any) => ({
    ...row,
    id: index,
  }));

  useEffect(() => {
    if (rowsWithIds) {
      const selectedGame = rowsWithIds?.find(
        (game: any) => game.id === parseInt(id)
      );
      //   console.log("Selected game:", selectedGame);

      setGame(selectedGame);
    }
  }, [rowsWithIds, id]);

  //   console.log(game);

  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      type: "string",
      headerName: "GAME NAME",
      width: 300,
    },
    {
      field: "day",
      type: "string",
      headerName: "GAME DAY",
      width: 300,
    },
    {
      field: "start_time",
      type: "string",
      headerName: "START TIME",
      width: 300,
    },
    {
      field: "end_time",
      type: "string",
      headerName: "END TIME",
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
              <h4 className="mb-0"> Game DateTime </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Game DateTime</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  //   onClick={() => handleGame()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"></i>{" "}
                </a>
              </p>
              <p>1 Record</p>
              {userLottoGame?.data?.name}
              {isLoadingLottoGame ? (
                <div className="spinner text-dark text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : !game ? (
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
                    slug="games_date_time"
                    columns={columns}
                    rows={[game]}
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
          {/* <GameLotto handleClose={handleClose} /> */}
          <p>Hi</p>
        </BModal>
      </div>
    </div>
  );
};

export default GameDateTime;
