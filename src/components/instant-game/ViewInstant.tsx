import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ViewInstant = ({ instantDetails, setInstantDetails }) => {
  const [editedDetails, setEditedDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const queryClient = useQueryClient();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await HTTP.post(
        `/instantgame/${instantDetails.data.id}`,
        editedDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.status);
      setInstantDetails(response.data);
      setInstantDetails(null);
      if (response.data.status) {
        queryClient.invalidateQueries("GET_INSTANT_OPERATOR");
      }
    } catch (error) {
      console.error("Error editing operator:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal
        show={instantDetails !== null}
        onHide={() => setInstantDetails(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            Edit Instant Operator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {instantDetails && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="form-label fw-bolder text-dark"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={editedDetails.name || instantDetails.data.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="form-label fw-bolder text-dark"
                >
                  Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="link"
                  name="link"
                  value={editedDetails.link || instantDetails.data.link}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  className="form-control mb-2 p-3"
                  id="logo"
                  name="logo"
                />
              </div>

              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Spinner animation="border" size="lg" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewInstant;
