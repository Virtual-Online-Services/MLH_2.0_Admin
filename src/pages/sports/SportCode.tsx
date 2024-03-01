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

const sports = [
  {
    id: 1,
    name: "Transfer market",
    operator: "Betwinner",
    link: "https://prmbw.com/bonus-100-01/?id=19BF&lang=en&p=/user/registration/",
  },
  {
    id: 2,
    name: "Transfer market",
    operator: "bet9ja",
    link: "https://wlbet9ja.adsrv.eacdn.com/C.ashx?btag=a_151504b_879c_&affid=8304&siteid=151504&adid=879&c=",
  },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", type: "string", headerName: "Name", width: 150 },
  { field: "operator", type: "string", headerName: "Operator", width: 150 },
  { field: "link", type: "string", headerName: "Link", width: 800 },
  //   {
  //     field: "logo",
  //     headerName: "Logo",
  //     width: 200,
  //     renderCell: () => <img src="/easy.png" alt="" />,
  //   },
];

const SportCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };

  const { userSportCode, isLoadingCode } = useGetSportCode();

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
                <li className="breadcrumb-item active">Sport Affiliates</li>
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
                <DataTable
                  slug="sports-affilates"
                  rows={sports}
                  columns={columns}
                />
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
