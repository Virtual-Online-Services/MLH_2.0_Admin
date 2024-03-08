import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useGetSportActivty from "../../react-query/api-hooks/useGetSportActivty";
import moment from "moment";

const formatCreatedAt = (createdAt: any) => {
  return moment(createdAt).format("MMM Do YYYY | hh:mm:ss a");
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "username", type: "string", headerName: "USER", width: 150 },
  {
    field: "operator",
    headerName: "OPERATOR",
    width: 100,
  },
  {
    field: "reference",
    headerName: "REFERENCE",
    width: 200,
  },
  {
    field: "created_at",
    headerName: "DATE",
    width: 250,
    renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
  },
];

const SportActivity = () => {
  const { userSportActivity, isLoadingSportActivity } = useGetSportActivty([]);
  //   console.log(userSportActivity?.operator);

  // Add operator field to each row
  const augmentedData = userSportActivity?.data?.map((row: any) => ({
    ...row,
    operator: userSportActivity?.operator,
  }));

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
              <h4 className="mb-0">Sport Activity </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Sport Activity</li>
              </ol>
            </div>

            <div>
              <p className="mt-3">{userSportActivity?.data?.length} Records</p>
              {isLoadingSportActivity ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userSportActivity?.data?.length === 0 ? (
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
                    slug="sport-activity"
                    columns={columns}
                    rows={augmentedData}
                  />
                </>
              )}

              <br />
              <br />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SportActivity;
