import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HTTP from "../../utils/httpClient";

const SingleUser = ({ userDetails, setUserDetails }) => {
  const [userTransaction, setUserTransaction] = useState([]);
  const [userBonus, setUserBonus] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.data || !userDetails.data.id) {
        return;
      }

      const endpoint = `/get-usertransactions/${userDetails.data.id}`;
      try {
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserTransaction(response.data.data);
      } catch (error) {
        console.error("Error fetching user transactions:");
      }
    };

    fetchData();
  }, [userDetails?.data?.id, token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userDetails || !userDetails.data || !userDetails.data.id) {
        return;
      }

      const endpoint = `/get-userwallets/${userDetails.data.id}`;
      try {
        const response = await HTTP.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserBonus(response.data);
      } catch (error) {
        console.error("Error fetching user transactions:");
      }
    };

    fetchData();
  }, [userDetails?.data?.id, token]);

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return "Active";
      case 2:
        return "Blocked";
      case 3:
        return "Not Verified";
      case 0:
        return "Inactive";
      default:
        return "Unknown Status";
    }
  };

  const formatCreatedAt = (createdAt: any) => {
    // return moment(createdAt).format("MMM Do YYYY|hh:mm:ss a");
    return moment(createdAt, "YYYYMMDDHHmmss").format(
      "Do MMM YYYY (hh:mm:ss a)"
    );
  };
  const columns: GridColDef[] = [
    {
      field: "ref",
      type: "string",
      headerName: "REFERENCE",
      width: 250,
    },
    {
      field: "type",
      headerName: "TYPE",
      width: 200,
      type: "string",
    },
    {
      field: "description",
      headerName: "DESCRIPTION",
      width: 450,
      type: "string",
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 130,
      type: "string",
    },
    {
      field: "channel",
      headerName: "CHANNEL",
      width: 180,
      type: "string",
    },
    {
      field: "abalance",
      headerName: "CURRENT BALANCE",
      width: 150,
      type: "string",
    },
    {
      field: "date",
      headerName: "DATE",
      width: 250,
      type: "string",
      renderCell: (params) => <span>{formatCreatedAt(params.value)}</span>,
    },
  ];

  return (
    <div>
      <Modal
        show={userDetails !== null}
        onHide={() => setUserDetails(null)}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bolder text-dark">
            User Information
          </Modal.Title>

          <button className="btn btn-primary">Reset Password</button>
        </Modal.Header>
        <Modal.Body>
          {userDetails && (
            <>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected="true"
                  >
                    Details
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="transactions-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#transactions-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="transactions-tab-pane"
                    aria-selected="false"
                  >
                    Transactions
                  </button>
                </li>

                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="transfer-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#transfer-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="transfer-tab-pane"
                    aria-selected="false"
                  >
                    Transfer
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="bank-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#bank-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="bank-tab-pane"
                    aria-selected="false"
                  >
                    Edit User Bank Details
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home-tab-pane"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <div>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">User ID:</span>
                        <span className="text-dark">
                          {userDetails?.data?.id}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Name:</span>
                        <span className="text-dark">
                          {userDetails?.data?.name}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Username: </span>
                        <span className="text-dark">
                          {userDetails?.data?.username}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Phone:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.tell}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Email:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.email}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">State:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.state}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Date of birth:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.dob}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Gender:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.gender}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">User Type:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.type}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.wallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Winning Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.wwallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      {/* <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Bonus Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userDetails?.data?.bwallet}
                        </span>
                      </p> */}
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Green Lotto Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userBonus?.green_lotto_bonus_wallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Set Lotto Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userBonus?.lotto_nigeria_bonus_wallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Lotto Mania Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          ₦{userBonus?.lottomania_bonus_wallet}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          5/90 Mania Wallet Balance:
                        </span>{" "}
                        <span className="text-dark">
                          {userBonus ? `₦${userBonus["590_bonus_wallet"]}` : ""}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Status:</span>{" "}
                        <span className="text-dark">
                          <span>
                            {getStatusText(userDetails?.data?.status)}
                          </span>
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Signup Date:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.date}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Referred By:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.ref}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">Bank:</span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.bname}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Account Name:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.accname}
                        </span>
                      </p>
                      <hr style={{ backgroundColor: "black" }} />
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="fw-bolder text-dark">
                          Account Number:
                        </span>{" "}
                        <span className="text-dark">
                          {userDetails?.data?.accno}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="transactions-tab-pane"
                  role="tabpanel"
                  aria-labelledby="transactions-tab-pane"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <DataTable
                      slug="single-transactions"
                      columns={columns}
                      rows={userTransaction}
                    />
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="transfer-tab-pane"
                  role="tabpanel"
                  aria-labelledby="transfer-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <div className="mb-3">
                      <label className="form-label text-dark fa-1x">
                        Transfer to user wallet
                      </label>
                      <form className="row g-2 mt-1">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn btn-primary mb-3"
                          >
                            Transfer
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-dark fa-1x">
                        Transfer to user bonus wallet
                      </label>
                      <form className="row g-2 mt-1">
                        <div className="col-auto">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                          />
                        </div>
                        <div className="col-auto">
                          <button
                            type="submit"
                            className="btn btn-primary mb-3"
                          >
                            Transfer
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show"
                  id="bank-tab-pane"
                  role="tabpanel"
                  aria-labelledby="bank-tab"
                  tabIndex="0"
                >
                  <div
                    className="p-3 mb-5 mt-3"
                    // style={{ background: "#f5f7f8" }}
                  >
                    <form className="row g-2 mt-1 w-50">
                      <div className="form-group mb-3">
                        <select name="bank" required="" class="form-control">
                          <option value="" selected="selected">
                            Select Bank
                          </option>
                          <option value="24">
                            9mobile 9Payment Service Bank
                          </option>
                          <option value="25">Abbey Mortgage Bank</option>
                          <option value="26">Above Only MFB</option>
                          <option value="27">Abulesoro MFB</option>
                          <option value="1">Access Bank</option>
                          <option value="28">Accion Microfinance Bank</option>
                          <option value="29">
                            Ahmadu Bello University Microfinance Bank
                          </option>
                          <option value="30">Airtel Smartcash PSB</option>
                          <option value="31">AKU Microfinance Bank</option>
                          <option value="32">ALAT by WEMA</option>
                          <option value="33">Amegy Microfinance Bank</option>
                          <option value="34">Amju Unique MFB</option>
                          <option value="35">
                            AMPERSAND MICROFINANCE BANK
                          </option>
                          <option value="36">Aramoko MFB</option>
                          <option value="37">ASO Savings and Loans</option>
                          <option value="38">Astrapolaris MFB LTD</option>
                          <option value="39">Bainescredit MFB</option>
                          <option value="40">
                            Banc Corp Microfinance Bank
                          </option>
                          <option value="41">Bowen Microfinance Bank</option>
                          <option value="42">
                            Branch International Financial Services Limited
                          </option>
                          <option value="43">Carbon</option>
                          <option value="44">CASHCONNECT MFB</option>
                          <option value="45">CEMCS Microfinance Bank</option>
                          <option value="46">
                            Chanelle Microfinance Bank Limited
                          </option>
                          <option value="47">Chikum Microfinance bank</option>
                          <option value="2">Citibank</option>
                          <option value="48">Consumer Microfinance Bank</option>
                          <option value="49">Corestep MFB</option>
                          <option value="50">Coronation Merchant Bank</option>
                          <option value="51">County Finance Limited</option>
                          <option value="52">Crescent MFB</option>
                          <option value="3">Diamond Bank</option>
                          <option value="53">Dot Microfinance Bank</option>
                          <option value="5">Ecobank Nigeria</option>
                          <option value="54">Ekimogun MFB</option>
                          <option value="55">Ekondo Microfinance Bank</option>
                          <option value="56">Eyowo</option>
                          <option value="57">
                            Fairmoney Microfinance Bank
                          </option>
                          <option value="6">Fidelity Bank Nigeria</option>
                          <option value="58">Firmus MFB</option>
                          <option value="7">First Bank of Nigeria</option>
                          <option value="8">First City Monument Bank</option>
                          <option value="59">
                            FirstTrust Mortgage Bank Nigeria
                          </option>
                          <option value="60">FLOURISH MFB</option>
                          <option value="61">FSDH Merchant Bank Limited</option>
                          <option value="62">Gateway Mortgage Bank LTD</option>
                          <option value="63">Globus Bank</option>
                          <option value="64">GoMoney</option>
                          <option value="65">Goodnews Microfinance Bank</option>
                          <option value="66">Greenwich Merchant Bank</option>
                          <option value="9">Guaranty Trust Bank</option>
                          <option value="67">Hackman Microfinance Bank</option>
                          <option value="68">Hasal Microfinance Bank</option>
                          <option value="10">Heritage Bank Plc</option>
                          <option value="69">HopePSB</option>
                          <option value="70">Ibile Microfinance Bank</option>
                          <option value="71">Ikoyi Osun MFB</option>
                          <option value="72">
                            Ilaro Poly Microfinance Bank
                          </option>
                          <option value="73">Imowo MFB</option>
                          <option value="74">Infinity MFB</option>
                          <option value="11">Jaiz Bank</option>
                          <option value="75">Kadpoly MFB</option>
                          <option value="12">Keystone Bank Limited</option>
                          <option value="76">Kredi Money MFB LTD</option>
                          <option value="77">Kuda Bank</option>
                          <option value="78">
                            Lagos Building Investment Company Plc.
                          </option>
                          <option value="79">Links MFB</option>
                          <option value="80">Living Trust Mortgage Bank</option>
                          <option value="81">Lotus Bank</option>
                          <option value="82">Mayfair MFB</option>
                          <option value="83">Mint MFB</option>
                          <option value="84">Moniepoint MFB</option>
                          <option value="85">MTN Momo PSB</option>
                          <option value="86">
                            OPay Digital Services Limited (OPay)
                          </option>
                          <option value="87">Optimus Bank Limited</option>
                          <option value="88">Paga</option>
                          <option value="89">PalmPay</option>
                          <option value="90">Parallex Bank</option>
                          <option value="91">Parkway - ReadyCash</option>
                          <option value="92">Peace Microfinance Bank</option>
                          <option value="93">Personal Trust MFB</option>
                          <option value="94">
                            Petra Mircofinance Bank Plc
                          </option>
                          <option value="95">Platinum Mortgage Bank</option>
                          <option value="14">Polaris Bank</option>
                          <option value="96">Polyunwana MFB</option>
                          <option value="97">PremiumTrust Bank</option>
                          <option value="13">Providus Bank Plc</option>
                          <option value="98">QuickFund MFB</option>
                          <option value="99">Rand Merchant Bank</option>
                          <option value="100">Refuge Mortgage Bank</option>
                          <option value="101">
                            Rephidim Microfinance Bank
                          </option>
                          <option value="102">
                            Rigo Microfinance Bank Limited
                          </option>
                          <option value="103">
                            ROCKSHIELD MICROFINANCE BANK
                          </option>
                          <option value="104">Rubies MFB</option>
                          <option value="105">Safe Haven MFB</option>
                          <option value="106">
                            Safe Haven Microfinance Bank Limited
                          </option>
                          <option value="107">SAGE GREY FINANCE LIMITED</option>
                          <option value="108">Shield MFB</option>
                          <option value="109">Solid Allianze MFB</option>
                          <option value="110">Solid Rock MFB</option>
                          <option value="111">Sparkle Microfinance Bank</option>
                          <option value="15">
                            Stanbic IBTC Bank Nigeria Limited
                          </option>
                          <option value="16">Standard Chartered Bank</option>
                          <option value="112">Stellas MFB</option>
                          <option value="17">Sterling Bank</option>
                          <option value="18">
                            Suntrust Bank Nigeria Limited
                          </option>
                          <option value="113">Supreme MFB</option>
                          <option value="114">TAJ Bank</option>
                          <option value="115">Tanadi Microfinance Bank</option>
                          <option value="116">Tangerine Money</option>
                          <option value="117">TCF MFB</option>
                          <option value="118">Titan Bank</option>
                          <option value="119">Titan Paystack</option>
                          <option value="120">
                            U&amp;C Microfinance Bank Ltd (U AND C MFB)
                          </option>
                          <option value="121">Uhuru MFB</option>
                          <option value="122">
                            Unaab Microfinance Bank Limited
                          </option>
                          <option value="123">Unical MFB</option>
                          <option value="124">Unilag Microfinance Bank</option>
                          <option value="19">Union Bank of Nigeria</option>
                          <option value="20">United Bank for Africa</option>
                          <option value="21">Unity Bank Plc</option>
                          <option value="125">
                            VFD Microfinance Bank Limited
                          </option>
                          <option value="126">Waya Microfinance Bank</option>
                          <option value="22">Wema Bank</option>
                          <option value="23">Zenith Bank</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="col-auto mb-2">
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="   Account Number"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="col-auto">
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="  Account Name"
                          />
                        </div>
                        <button className="btn btn-primary mt-3">Save</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SingleUser;
