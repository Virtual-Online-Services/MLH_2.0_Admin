import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ViewGame = ({ gameDetails, setGameDetails }) => {
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
        `/operator/${gameDetails.data.id}`,
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
      setGameDetails(response.data);
      setGameDetails(null);
      if (response.data.status) {
        // Invalidate the query cache for adverts data
        queryClient.invalidateQueries("GET_LOTTO_GAME");
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
        show={gameDetails !== null}
        onHide={() => setGameDetails(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">Edit Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {gameDetails && (
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
                  value={editedDetails.name || gameDetails.data.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="del" className="form-label fw-bolder text-dark">
                  Operator
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="operator"
                  name="operator"
                  value={editedDetails.operator || gameDetails.data.operator}
                  onChange={handleChange}
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

export default ViewGame;
