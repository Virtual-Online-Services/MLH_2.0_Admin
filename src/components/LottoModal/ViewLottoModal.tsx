import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const EditOperatorModal = ({ operatorDetails, setOperatorDetails }) => {
  const [editedDetails, setEditedDetails] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFileChange = (e:any) => {
    setLogoFile(e.target.files[0]);
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", editedDetails?.name || operatorDetails.data.name);
    formData.append("del", editedDetails?.del || operatorDetails.data.del);
    formData.append("play", editedDetails?.play || operatorDetails.data.play);
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const response = await HTTP.post(
        `/operator/${operatorDetails.data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.status);
      setOperatorDetails(response.data);
      setOperatorDetails(null);
      if (response.data.status) {
        queryClient.invalidateQueries("GET_LOTTO_OPERATOR");
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
        show={operatorDetails !== null}
        onHide={() => setOperatorDetails(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">Edit Operator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {operatorDetails && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-bolder text-dark">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={editedDetails.name || operatorDetails.data.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="del" className="form-label fw-bolder text-dark">
                  Temporary Delete
                </label>
                <select
                  className="form-select"
                  id="del"
                  name="del"
                  value={editedDetails.del || operatorDetails.data.del}
                  onChange={handleChange}
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="play" className="form-label fw-bolder text-dark">
                  Enable Play
                </label>
                <select
                  className="form-select"
                  id="play"
                  name="play"
                  value={editedDetails.play || operatorDetails.data.play}
                  onChange={handleChange}
                >
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="logo" className="form-label fw-bolder text-dark">
                  Logo
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="lg" /> : "Save Changes"}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditOperatorModal;
