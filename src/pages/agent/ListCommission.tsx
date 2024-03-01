import { Link } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import DataTable from "../../components/dataTable/DataTable"; // Assuming DataTable is correctly defined

const commission = [
  { id: 1, operator: "5/90 Games", commission: "10%" },
  { id: 2, operator: "Green lotto", commission: "10%" },
  { id: 3, operator: "Lottomania", commission: "10%" },
  { id: 4, operator: "Set Lotto", commission: "10%" },
  { id: 5, operator: "Wesco", commission: "10%" },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "operator", type: "string", headerName: "Operator", width: 150 },
  { field: "commission", type: "string", headerName: "Commission", width: 200 },
  {
    field: "modify",
    type: "string",
    headerName: "Modify",
    width: 200,
    renderCell: () => <button className="btn btn-primary">Modify</button>,
  },
];

const ListCommission = () => {
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
              <h4 className="mb-0"> Agency Commission </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Agency Commission</li>
              </ol>
            </div>
            <div className="mt-5">
              <DataTable
                slug="agent-commission"
                rows={commission}
                columns={columns}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ListCommission;
