
interface ReferralRecord {
  id: number;
  username: string;
  created_at: string | null;
  customUserID: number;
  funded: string;
}

interface ReferralData {
  status: string;
  target: number;
  times_hit_target: number;
  target_done: number;
  target_reached: boolean;
  onboarder_total_balance: number;
  onboarder_wallet_balance: number;
  data: {
    data: ReferralRecord[];
    total: number;
  };
}

interface Props {
  userDetails: ReferralData | null;
  setUserDetails: React.Dispatch<React.SetStateAction<ReferralData | null>>;
}
const SingleReferralUser = ({ userDetails, setUserDetails }) => {
  if (!userDetails) return null;

  const { target, times_hit_target, target_done, target_reached, onboarder_total_balance, onboarder_wallet_balance, data } =
    userDetails || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3>User Referrals</h3>
          <button className="close-btn" onClick={() => setUserDetails(null)}>
            ✖
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div><strong>Target:</strong> {target}</div>
          <div><strong>No of Targets Met:</strong> {times_hit_target}</div>
          <div><strong>Total Onboarded:</strong> {target_done}</div>
          <div><strong>Total Balance:</strong> {onboarder_total_balance}</div>
          <div><strong>Wallet Balance:</strong> {onboarder_wallet_balance}</div>
        </div>

        {/* Referrals Table */}
        <div className="table-responsive mt-3">
          <table className="table table-striped">
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Username</th>
                <th>Created At</th>
                <th>Custom User ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((ref:any) => (
                <tr key={ref.id}>
                  {/* <td>{ref.id}</td> */}
                  <td>{ref.username}</td>
                  <td>{ref.created_at ? new Date(ref.created_at).toLocaleString() : "N/A"}</td>
                  <td>{ref.customUserID}</td>
                  <td>{ref.funded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setUserDetails(null)}>
            Close
          </button>
        </div>
      </div>

      {/* Styles (basic) */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: #fff;
          border-radius: 10px;
          width: 90%;
          max-width: 900px;
          padding: 20px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header, .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default SingleReferralUser;
