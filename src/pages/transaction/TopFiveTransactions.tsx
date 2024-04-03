import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
// import useGetAdvert from "../../react-query/api-hooks/useGetAdvert";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import BModal from "../../components/BModal/BModal";
import AdvertModal from "../../components/AdvertModal/AdvertModal";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo";

const TopFiveTransactions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const handleAdvert = () => {
    handleOpen();
  };
  //   const { userAdvertResponse, isLoadingAdvert } = useGetAdvert([]);
  const { dashboardData, isLoadingData } = useGetDashBoardInfo();
  //   console.log(dashboardData?.transaction);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "username",
      headerName: "NAME",
      width: 100,
    },
    {
      field: "username",
      type: "string",
      headerName: "USERNAME",
      width: 150,
    },
    {
      field: "type",
      type: "string",
      headerName: "TYPE",
      width: 150,
    },
    {
      field: "description",
      type: "string",
      headerName: "DESCRIPTION",
      width: 150,
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 150,
      type: "string",
      valueGetter: (params) => `₦${params.value}`,
    },
    {
      field: "channel",
      headerName: "CHANNEL",
      width: 150,
      type: "string",
    },
    {
      field: "abalance",
      headerName: "CURRENT BALANCE",
      width: 150,
      type: "string",
      valueGetter: (params) => `₦${params.value}`,
    },
    {
      field: "date",
      type: "string",
      headerName: "DATE",
      width: 200,
    },
  ];

  return (
    <div>
      <div className="container">
        <div>
          <p>{dashboardData?.transaction?.length} Records</p>
          {isLoadingData ? (
            <div className="spinner text-dark text-center mt-5">
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />
            </div>
          ) : dashboardData?.transaction?.length === 0 ? (
            <div className="d-flex justify-content-center text-center p-5">
              <div className="hidden-xs hidden-sm mx-auto">
                <div className="alert alert-danger text-center" role="alert">
                  No Record Found
                </div>
              </div>
            </div>
          ) : (
            <>
              <DataTable
                slug="top_five_transaction"
                columns={columns}
                rows={dashboardData?.transaction}
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
        <AdvertModal />
      </BModal>
    </div>
  );
};

export default TopFiveTransactions;
