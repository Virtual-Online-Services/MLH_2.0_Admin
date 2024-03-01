import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import BModal from "../../components/BModal/BModal";
import { Link } from "react-router-dom";
import MessageAllUser from "../../components/message/MessageAllUser";
import MessageSingleUser from "../../components/message/MessageSingleUser";

const SingleUserMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleGame = () => {
    handleOpen();
  };
  //   const [selectedOperator, setSelectedOperator] = useState("");
  //   const [selectedGame, setSelectedGame] = useState("");
  //   const { userResults, isLoadingResults } = useGetResults([]);
  //   const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator([]);

  //   const handleOperatorChange = (event: any) => {
  //     setSelectedOperator(event.target.value);
  //     // Clear the selected game when operator changes
  //     setSelectedGame("");
  //   };

  //   const handleGameChange = (event: any) => {
  //     setSelectedGame(event.target.value);
  //   };

  //   const filteredResults = userResults?.data?.filter(
  //     (result: any) => result.operator === selectedOperator
  //   );

  //   const gameOptions = filteredResults?.map((result: any) => (
  //     <option key={result.id} value={result.game}>
  //       {result.game}
  //     </option>
  //   ));

  //   const formatDate = (timestamp: any) => {
  //     return moment(timestamp).format("Do MMM YYYY");
  //   };

  //   const columns: GridColDef[] = [
  //     // { field: "id", headerName: "ID", width: 90 },

  //     {
  //       field: "operator",
  //       type: "string",
  //       headerName: "OPERATOR",
  //       width: 300,
  //     },
  //     {
  //       field: "game",
  //       type: "string",
  //       headerName: "GAME",
  //       width: 300,
  //     },
  //     {
  //       field: "winning_number",
  //       type: "string",
  //       headerName: "WINNING NUMBER",
  //       width: 300,
  //     },
  //     {
  //       field: "machine_number",
  //       type: "string",
  //       headerName: "MACHINE NUMBER",
  //       width: 300,
  //     },
  //     {
  //       field: "created_at",
  //       type: "string",
  //       headerName: "DATETIME",
  //       width: 300,
  //       valueFormatter: (params) => formatDate(params.value),
  //     },
  //   ];

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
              <h4 className="mb-0"> Send Message </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Send Message</li>
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
              {/* {isLoadingResults ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userResults?.data?.length === 0 ? (
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
                  {/*
                  <DataTable
                    slug="all-messages"
                    columns={columns}
                    rows={userResults?.data}
                  />
                </>
              )} */}

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
          <MessageSingleUser handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default SingleUserMessage;
