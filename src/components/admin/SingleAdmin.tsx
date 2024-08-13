import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const SingleAdmin = ({ adminDetails, setAdminDetails }) => {
  const [editedDetails, setEditedDetails] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPermissions((prevPermissions) => {
      if (checked) {
        return [...new Set([...prevPermissions, value])]; // Add value only if it's not already in the array
      } else {
        return prevPermissions.filter((perm) => perm !== value); // Remove value if unchecked
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await HTTP.post(
        `/update-admin/${adminDetails.data.id}`,
        {
          ...editedDetails,
          perm: selectedPermissions, // Ensure unique permissions are sent
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.status);
      setAdminDetails(null);

      queryClient.invalidateQueries("GET_ADMIN_DETAILS");
    } catch (error) {
      console.error("Error editing admin:", error);
      // Handle error
      toast.error("An error occurred while updating the admin details.");
    } finally {
      setIsLoading(false);
    }
  };

  const permissions = [
    { value: "advert", label: "Adverts" },
    { value: "operator", label: "Operators" },
    { value: "game", label: "Games" },
    { value: "result", label: "Results" },
    { value: "product", label: "Products" },
    { value: "user", label: "Users" },
    { value: "user_action", label: "User action" },
    { value: "transaction", label: "Transactions" },
    { value: "wwallet", label: "Withdrawals" },
    { value: "message", label: "Message" },
    { value: "operator", label: "Sport" },
    { value: "game", label: "Instant Games" },
    { value: "game", label: "Casino Games" },
    { value: "forecast", label: "Pro-Forecast" },
  ];

  return (
    <div>
      <Modal
        show={adminDetails !== null}
        onHide={() => setAdminDetails(null)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">Edit Admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {adminDetails && (
            <form onSubmit={handleSubmit}>
              <div className="p-3 mb-5 mt-3">
                <div>
                  <p>
                    <label className="fw-bolder text-dark">Name:</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control mb-3"
                      value={editedDetails?.name || adminDetails?.data.name}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <label className="fw-bolder text-dark mb-3">
                      Username:
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-control mb-3"
                      value={
                        editedDetails?.username || adminDetails?.data?.username
                      }
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <label className="fw-bolder text-dark mb-3">Email:</label>
                    <input
                      type="text"
                      name="email"
                      className="form-control mb-3"
                      value={editedDetails?.email || adminDetails?.data?.email}
                      onChange={handleChange}
                    />
                  </p>

                  <div
                    className="card mb-5"
                    style={{
                      borderColor: "#337ab7",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      className="card-heading text-left text-white p-3"
                      style={{ background: "#337ab7", width: "100%" }}
                    >
                      Permissions
                    </div>
                    {permissions.map((permission, index) => (
                      <div
                        key={permission.value + index}
                        className="col-3 p-2"
                        style={{ flex: "0 0 25%" }}
                      >
                        <div className="checkbox ">
                          <label>
                            <input
                              type="checkbox"
                              name="perm[]"
                              value={permission.value}
                              checked={selectedPermissions.includes(
                                permission.value
                              )}
                              onChange={handlePermissionChange}
                            />
                            {permission.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Add other editable fields here */}
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Save"}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SingleAdmin;
