import { Modal } from "react-bootstrap";

const ViewLottoModal = ({ operatorDetails, setOperatorDetails }) => {
  return (
    <div>
      <Modal
        show={operatorDetails !== null}
        onHide={() => setOperatorDetails(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Operator Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {operatorDetails && (
            <>
              <p>Name: {operatorDetails?.data?.name}</p>
              <p>
                Logo:{" "}
                <img
                  src={`https://sandbox.mylottohub.com/assets/images/operator/${operatorDetails?.data?.logo} `}
                  alt="Logo"
                  className="img-fluid"
                />
              </p>
              <p>Del: {operatorDetails?.data?.del}</p>
              <p>Play: {operatorDetails?.data?.play}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewLottoModal;
