import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetAllBank } from "../../react-query";
import { useState, useEffect, ChangeEvent } from "react";
import { HTTP } from "../../utils";
import { useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  bank_name: string;
  ticketID: string;
  account_no: string;
  account_name?: string;
  paymentGateway?: string;
}

interface WithdrawModalProps {
  handleClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ handleClose }) => {
  const [accountName, setAccountName] = useState("");
  const [accountNameOpay, setAccountNameOpay] = useState("");
  const [accountNameLastOpay, setAccountNameLastOpay] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [fetchingAccountName, setFetchingAccountName] = useState(false);
  const [loading, setLoading] = useState(false);

  const { allBanks, isLoadingBank } = useGetAllBank();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const queryClient = useQueryClient();

  // Validation Schema
  const schema = yup.object().shape({
    bank_name: yup.string().required("Bank Name is required"),
    ticketID: yup.string().required("Ticket ID is required"),
    account_no: yup
      .string()
      .min(10, "Account Number must be at least 10 characters")
      .max(10, "Account Number cannot exceed 10 characters")
      .required("Account Number is required"),
    account_name: yup.string().required("Account Name is required"),
    paymentGateway: yup.string().required("Payment Gateway is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitWithdraw: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    const selectedBank = allBanks.find(
      (bank_name: any) => bank_name.name === data.bank_name
    );
    const payload = { ...data, bank: selectedBank?.id };

    try {
      const response = await HTTP.post("/payout-admin-agent-user", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response) {
        toast.success(response?.data?.message);
        handleClose();
        queryClient.invalidateQueries("GET_ALL_AGENT_WITHDRAW");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountName = async () => {
    setFetchingAccountName(true);
    try {
      const selectedBank = watch("bank_name");
      const response = await HTTP.post(
        "/admin/resolve-bank-account",
        { bank_name: selectedBank, account_no: watch("account_no") },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "Success") {
        const { account_name, firstName, lastName } =
          response?.data?.data?.data;
        setAccountName(account_name || "");
        setAccountNameOpay(firstName || "");
        setAccountNameLastOpay(lastName || "");
        setValue("account_name", `${firstName} ${lastName}`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    } finally {
      setFetchingAccountName(false);
    }
  };

  const bankName = watch("bank_name");
  const accountNo = watch("account_no");

  useEffect(() => {
    if (!accountNo) {
      setAccountName("");
      setAccountNameOpay("");
      setAccountNameLastOpay("");
      setValue("account_name", "");
    } else if (bankName && accountNo.length === 10) {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(fetchAccountName, 1000));
    }
  }, [bankName, accountNo]);

  return (
    <div className="withdraw-modal">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmitWithdraw)}>
          <h3 className="mb-3">User Details</h3>

          {/* Ticket ID */}
          <div>
            <input
              type="tel"
              className="form-control mb-2"
              placeholder="Ticket ID"
              {...register("ticketID")}
            />
            {errors.ticketID && (
              <p className="text-danger">{errors.ticketID.message}</p>
            )}
          </div>

          {/* Select Bank */}
          <div className="mt-4 mb-2">
            <select className="form-control" {...register("bank_name")}>
              <option value="" disabled>
                Select Bank
              </option>
              {allBanks.map((bank: any) => (
                <option key={bank.id} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bank_name && (
              <p className="text-danger">{errors.bank_name.message}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="mt-4 mb-2">
            <input
              type="tel"
              className="form-control"
              placeholder="Account Number"
              {...register("account_no")}
            />
            {errors.account_no && (
              <p className="text-danger">{errors.account_no.message}</p>
            )}
          </div>

          {/* Account Name (Resolved) */}
          <div className="mt-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Account Name"
              value={
                accountName ||
                `${accountNameOpay} ${accountNameLastOpay}`.trim()
              }
              disabled
            />
            {fetchingAccountName && (
              <Spinner animation="border" variant="primary" />
            )}
          </div>

          {/* Payment Gateway */}
          <div className="mt-4 mb-2">
            <select
              className="form-control"
              {...register("paymentGateway")}
              defaultValue=""
            >
              <option value="" disabled>
                Select Payment Gateway
              </option>
              <option value="monnify">Monnify</option>
              <option value="opay">Opay</option>
            </select>
            {errors.paymentGateway && (
              <p className="text-danger">{errors.paymentGateway.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-block btn-lg text-white mt-3"
            style={{ background: "#27AAE1" }}
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" variant="light" size="sm" />{" "}
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
