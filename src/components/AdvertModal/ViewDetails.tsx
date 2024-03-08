import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ViewDetails = ({ advert, setAdvert }) => {
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
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };
  const isPastDate = (dateString: any) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate < currentDate;
  };

  const queryClient = useQueryClient();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await HTTP.post(
        `/advert/${advert.data.id}`,
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
      setAdvert(response.data);
      setAdvert(null);
      if (response.data.status) {
        queryClient.invalidateQueries("GET_USER_ADVERT");
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
      <Modal show={advert !== null} onHide={() => setAdvert(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">Edit Advert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {advert && (
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
                  value={editedDetails.name || advert.data.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="company"
                  className="form-label fw-bolder text-dark"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="company"
                  name="company"
                  value={editedDetails.company || advert.data.company}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="company"
                  className="form-label fw-bolder text-dark"
                >
                  URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="link"
                  name="link"
                  value={editedDetails.link || advert.data.link}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 w-100">
                <input
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="Start Date"
                  min={getCurrentDate()}
                  value={editedDetails.start_date || advert.data.start_date}
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="End Date"
                  min={getCurrentDate()}
                  value={editedDetails.end_date || advert.data.end_date}
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

export default ViewDetails;
