import { Modal } from "react-bootstrap";

// Define interfaces
interface UserDetails {
  id: number;
  order_id: string;
  odds: number;
  username: string;
  user: number;
  amount: number;
  reference: string;
  code: string;
  created_at: string;
  updated_at: string;
  bonusmoney: number;
  winmoney: number;
  status: number | null;
}

interface SportsDetails {
  status: string;
  code: string;
  code_used: number;
  data: UserDetails[];
}

interface ViewSportsBetProps {
  sportsDetails: SportsDetails | null;
  setSportDetails: React.Dispatch<React.SetStateAction<SportsDetails | null>>;
}

const ViewSportsBet: React.FC<ViewSportsBetProps> = ({
  sportsDetails,
  setSportDetails,
}) => {
  return (
    <div>
      <Modal
        show={sportsDetails !== null}
        onHide={() => setSportDetails(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            {sportsDetails?.code} Code Breakdown
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sportsDetails && (
            <div>
              <div className="mb-3 text-center">
                <label
                  htmlFor="name"
                  className="form-label fw-bolder text-dark fs-5"
                >
                  {sportsDetails.code_used === 0
                    ? "No user has played this bet."
                    : `${sportsDetails.code_used} code(s) have been played`}
                </label>
              </div>
              {sportsDetails.code_used > 0 && (
                <div className="user-details">
                  <h4 className="fw-bold text-dark mb-4">
                    Players Information:
                  </h4>
                  <div className="row">
                    {sportsDetails.data.map((user) => (
                      <div key={user.id} className="col-md-6  mb-3">
                        <div className="card shadow-sm h-100">
                          <div className="card-body">
                            <p>
                              {" "}
                              <strong> Name:</strong> {user?.username}
                            </p>
                            <p>
                              <strong>Order ID:</strong> {user?.order_id}
                            </p>{" "}
                            <p>
                              {" "}
                              <strong>Amount:</strong> ₦{user?.amount}
                            </p>{" "}
                            <p>
                              <strong>Reference:</strong> {user?.reference}
                            </p>{" "}
                            <p>
                              <strong>Created At:</strong>{" "}
                              {new Date(user?.created_at).toLocaleString()}{" "}
                              <br />
                            </p>{" "}
                            <p>
                              <strong>Status:</strong>{" "}
                              {user?.status === 1
                                ? "Won"
                                : user?.status === 0
                                ? "Lost"
                                : "Pending"}
                            </p>{" "}
                            <p>
                              <strong>Winning Money:</strong> ₦{user?.winmoney}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewSportsBet;
