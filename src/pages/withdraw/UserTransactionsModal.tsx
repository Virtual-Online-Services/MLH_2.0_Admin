import { Modal, Table } from "react-bootstrap";
import moment from "moment";
import React from "react";

// Define the shape of a transaction
interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  bonus_type: string;
  date: string;
  created_at: string;
  updated_at: string;
  initial_wallet_balance: number;
  wallet_balance: number;
}

// Define props for the component
interface UserTransactionsModalProps {
  show: boolean;
  onHide: () => void;
  transactions: Transaction[];
}

const UserTransactionsModal: React.FC<UserTransactionsModalProps> = ({
  show,
  onHide,
  transactions,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>User Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transactions?.length === 0 ? (
          <p className="text-center text-muted">No transactions found.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Amount (₦)</th>
                <th>Bonus Type</th>
                <th>Initial Balance</th>
                <th>Wallet Balance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.id}>
                  <td>{index + 1}</td>
                  <td>{tx.amount.toLocaleString()}</td>
                  <td>{tx.bonus_type}</td>
                  <td>₦{tx.initial_wallet_balance}</td>
                  <td>₦{tx.wallet_balance}</td>
                  <td>
                    {moment(tx.created_at).format("MMM Do YYYY, h:mm:ss a")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserTransactionsModal;
