import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BModal from "../BModal/BModal";
import ViewLottoModal from "../LottoModal/ViewLottoModal";
import { useState } from "react";

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
  const token = userInfo?.token?.accessToken;

  const mutation = useMutation({
    mutationFn: (id: number) => {
      let endpoint: string;
      // Construct endpoint based on the slug
      if (props.slug === "advert") {
        endpoint = `/delete/advert/${id}`;
      } else if (props.slug === "operator") {
        endpoint = `/delete/operator/${id}`;
      } else {
        // Handle other slugs if needed
        endpoint = ""; // Set default endpoint or handle error
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
  const handleEdit = async (id: number) => {
    try {
      let endpoint: string;
      if (props.slug === "operator") {
        endpoint = `/get-operator/${id}`;
        const response = await HTTP.post(
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
        setOperatorDetails(response.data); // Set operator details
      }
    } catch (error) {
      console.error("Error fetching operator details:", error);
      // Handle error
    }
  };
  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.slug === "operator" && (
            <div className="edit" onClick={() => handleEdit(params.row.id)}>
              <img src="/view.svg" alt="" />
            </div>
          )}
          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="/delete.svg" alt="" />
          </div>
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
              pageSize: 10,
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
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
      {/* <BModal
        // backdrop="static"
        keyboard={false}
        show={isOpen}
        onHide={handleClose}
        size="md"
      > */}
      <ViewLottoModal
        operatorDetails={operatorDetails}
        setOperatorDetails={setOperatorDetails}
      />
      {/* </BModal> */}
    </div>
  );
};

export default DataTable;
