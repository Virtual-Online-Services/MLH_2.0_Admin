import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ViewLottoModal from "../LottoModal/ViewLottoModal";
import { useState } from "react";
import ViewGame from "../LottoModal/ViewGame";
import SingleUser from "../SingleUser/SingleUser";
import SingleAdmin from "../admin/SingleAdmin";
import ViewResult from "../results/ViewResult";
import AgentUser from "../agent/AgentUser";
import ViewInstant from "../instant-game/ViewInstant";
import ViewDetails from "../AdvertModal/ViewDetails";
import ViewSportDetails from "../sports/ViewSportDetails";
import ViewSportsBet from "../sports/ViewSportsBet";

interface Row {
  id: number;
}

type Props = {
  columns: GridColDef[];
  row: Row[];
  rows: object[];
  slug: string;
  setRows: React.Dispatch<React.SetStateAction<object[]>>;
};

const DataTable = (props: Props) => {
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [operatorDetails, setOperatorDetails] = useState(null);
  const [gameDetails, setGameDetails] = useState(null);
  const [sportsDetails, setSportDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [adminDetails, setAdminDetails] = useState(null);
  const [resultsDetails, setResultsDetails] = useState(null);
  const [instantDetails, setInstantDetails] = useState(null);
  const [advert, setAdvert] = useState(null);
  const [sport, setSport] = useState(null);
  const token = userInfo?.token?.accessToken;

  const mutation = useMutation({
    mutationFn: (id: number) => {
      let endpoint: string;
      // Construct endpoint based on the slug
      if (props.slug === "advert") {
        endpoint = `/delete/advert/${id}`;
      } else if (props.slug === "operator") {
        endpoint = `/delete/operator/${id}`;
      } else if (props.slug === "games") {
        endpoint = `/delete/game/${id}`;
      } else if (props.slug === "sport-operator") {
        endpoint = `/delete/sport-operator/${id}`;
      } else if (props.slug === "sport-code") {
        endpoint = `/delete-sports-code/${id}`;
      } else if (props.slug === "sport-forecast") {
        endpoint = `/delete-admin/${id}`;
      }
      return HTTP.post(
        endpoint,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (data, id: number) => {
      queryClient.invalidateQueries([`${id}`]);
      toast.success("Item Deleted Successfully");
      const updatedRows = props.row.filter((row) => row.id !== id);
      props.setRows(updatedRows);
    },
  });

  const handleDelete = (id: number) => {
    // Display confirmation toast with a button to proceed with deletion
    toast.warn(
      <>
        Are you sure you want to delete this item?
        <br />
        <button
          onClick={() => {
            onDeleteConfirmation(id);
            toast.dismiss(); // Close the toast
          }}
          className="btn btn-danger w-100 mt-4"
        >
          Delete
        </button>
      </>,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  };

  const onDeleteConfirmation = (id: number) => {
    // Perform deletion if confirmed
    mutation.mutate(id);
  };

  const handleSportCodeEdit = async (code: string) => {
    try {
      let endpoint: string;
      if (props.slug === "sport-code") {
        endpoint = `/get-sports-code`;
        const response = await HTTP.post(
          endpoint,
          {
            code,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSportDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching game details:", error);
      // Handle error
    }
  };
  const handleEdit = async (id: number) => {
    try {
      let endpoint: string;
      if (props.slug === "operator") {
        endpoint = `/get-operator/${id}`;
        const response = await HTTP.post(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setOperatorDetails(response.data); // Set operator details
      } else if (props.slug === "game") {
        endpoint = `/get-game/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setGameDetails(response.data);
      } else if (props.slug === "users") {
        endpoint = `/get-user/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(response.data);
      } else if (props.slug === "agent-users") {
        endpoint = `/get-user/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAgentDetails(response.data);
      } else if (props.slug === "admin_register") {
        endpoint = `/get-admin/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminDetails(response.data);
      } else if (props.slug === "results") {
        endpoint = `/get-result/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setResultsDetails(response.data);
      } else if (props.slug === "instant-operator") {
        endpoint = `/get-instantgame/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setInstantDetails(response.data);
      } else if (props.slug === "advert") {
        endpoint = `/get-advert/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAdvert(response.data);
      } else if (props.slug === "sport-operator") {
        endpoint = `/get-sport-operator/${id}`;
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setSport(response.data);
      }
      // else if (props.slug === "sport-forecast") {
      //   endpoint = `/user/proforcasters/${id}`;
      //   const response = await HTTP.get(endpoint, {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   });
      //   setSport(response.data);
      // }
    } catch (error) {
      console.error("Error fetching game details:", error);
      // Handle error
    }
  };
  const actionColumn: GridColDef = {
    field:
      props.slug === "withdraw" ||
      props.slug === "withdraw-agent" ||
      props.slug === "single-transactions" ||
      props.slug === "top_five_transaction" ||
      props.slug === "sport-activity" ||
      props.slug === "transactions" ||
      // props.slug === "sport-forecast" ||
      props.slug === "agent-commission"
        ? ""
        : "action",
    headerName:
      props.slug === "withdraw" ||
      props.slug === "withdraw-agent" ||
      props.slug === "single-transactions" ||
      props.slug === "top_five_transaction" ||
      props.slug === "sport-activity" ||
      props.slug === "transactions" ||
      // props.slug === "sport-forecast" ||
      props.slug === "agent-commission"
        ? ""
        : "Action",
    width:
      props.slug === "withdraw" ||
      props.slug === "withdraw-agent" ||
      props.slug === "single-transactions" ||
      props.slug === "top_five_transaction" ||
      props.slug === "sport-activity" ||
      props.slug === "transactions" ||
      props.slug === "agent-commission"
        ? 0
        : 200,

    renderCell: (params) => {
      return (
        <div className="action">
          {/* {(props.slug === "operator" ||
            props.slug === "game" ||
            props.slug === "advert" ||
            props.slug === "admin_register" ||
            props.slug === "results" ||
            props.slug === "agent-users" ||
            props.slug === "sports" ||
            props.slug === "sports-affilates" ||
            props.slug === "sport-operator" ||
            props.slug === "instant-operator" ||
            props.slug === "sport-code" ||
            props.slug === "users") && (
            <div className="edit" onClick={() => handleEdit(params.row.id)}>
              <img src="/view.svg" alt="" />
            </div>
          )} */}
          {(props.slug === "operator" ||
            props.slug === "game" ||
            props.slug === "advert" ||
            props.slug === "admin_register" ||
            props.slug === "results" ||
            props.slug === "agent-users" ||
            props.slug === "sports" ||
            props.slug === "sports-affilates" ||
            props.slug === "sport-operator" ||
            // props.slug === "sport-forecast" ||
            props.slug === "instant-operator" ||
            props.slug === "sport-code" ||
            props.slug === "users") && (
            <div
              className="edit"
              onClick={() => {
                if (props.slug === "sport-code") {
                  handleSportCodeEdit(params.row.code); // Call the new function with code
                } else {
                  handleEdit(params.row.id); // Call the original function with id
                }
              }}
            >
              <img src="/view.svg" alt="" />
            </div>
          )}

          {props.slug !== "withdraw" &&
            props.slug !== "withdraw-agent" &&
            props.slug !== "single-transactions" &&
            props.slug !== "users" &&
            props.slug !== "agent-commission" &&
            props.slug !== "top_five_transaction" &&
            // props.slug !== "sport-forecast" &&
            props.slug !== "sport-activity" &&
            props.slug !== "transactions" && (
              <div
                className="delete"
                onClick={() => handleDelete(params.row.id)}
              >
                <img src="/delete.svg" alt="" />
              </div>
            )}
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection={
          props.slug !== "users" &&
          props.slug !== "transactions" &&
          props.slug !== "single-transactions" &&
          props.slug !== "top_five_transaction" &&
          props.slug !== "results" &&
          props.slug !== "withdraw"
        }
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
      <ViewLottoModal
        operatorDetails={operatorDetails}
        setOperatorDetails={setOperatorDetails}
      />
      <ViewGame gameDetails={gameDetails} setGameDetails={setGameDetails} />
      <ViewSportsBet
        sportsDetails={sportsDetails}
        setSportDetails={setSportDetails}
      />
      <SingleUser userDetails={userDetails} setUserDetails={setUserDetails} />
      <AgentUser
        agentDetails={agentDetails}
        setAgentDetails={setAgentDetails}
      />
      <SingleAdmin
        adminDetails={adminDetails}
        setAdminDetails={setAdminDetails}
      />
      <ViewResult
        resultsDetails={resultsDetails}
        setResultsDetails={setResultsDetails}
      />
      <ViewInstant
        instantDetails={instantDetails}
        setInstantDetails={setInstantDetails}
      />
      <ViewDetails advert={advert} setAdvert={setAdvert} />
      <ViewSportDetails sport={sport} setSport={setSport} />

      {/* </BModal> */}
    </div>
  );
};

export default DataTable;
