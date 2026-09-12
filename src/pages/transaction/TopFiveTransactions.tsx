import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import { useState } from "react";
// import useGetAdvert from "../../react-query/api-hooks/useGetAdvert";
import BModal from "../../components/BModal/BModal";
import AdvertModal from "../../components/AdvertModal/AdvertModal";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo";
import { deriveViewState } from "../home/viewState";
import { WidgetStateView } from "../../components/widget-state";
import "./topFiveTransactions.scss";

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

  // Drive loading/empty/content through the shared view-state selector so the
  // table never renders blank or broken. Loading takes precedence; the
  // Empty_State only shows once loading has finished with no records
  // (Requirements 7.4, 7.5).
  const state = deriveViewState({
    isLoading: isLoadingData,
    isError: false,
    data: dashboardData?.transaction,
  });

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
    <div className="topFiveTransactions">
      <div className="container">
        <div>
          {/* Preserve the records-count display (Requirement 7.6). */}
          <p className="topFiveTransactions__count">
            {dashboardData?.transaction?.length} Records
          </p>

          {/* Loading_State / Empty_State are driven by deriveViewState; the
              @mui/x-data-grid DataTable is rendered unchanged as the content
              (Requirements 7.4, 7.5, 7.6). The scroll wrapper keeps every
              column readable on a Mobile_Viewport (Requirement 7.3). */}
          <WidgetStateView
            state={state}
            loadingLabel="Loading transactions"
            emptyMessage="No Record Found"
          >
            <div className="topFiveTransactions__scroll">
              <DataTable
                slug="top_five_transaction"
                columns={columns}
                rows={dashboardData?.transaction}
              />
            </div>
          </WidgetStateView>

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
