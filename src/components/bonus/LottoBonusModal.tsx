import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";

const schema = yup.object().shape({
  bonus_type: yup.string().required("This is a required field"),
  operator: yup.string(),
  stake: yup.string(),
  percentage: yup.string(),
  duration: yup.string(),
  start_date: yup.string(),
  end_date: yup.string(),
  wallet: yup.string(),
  game: yup.string(),
  bonus_amount: yup.string(),
});

const LottoBonusModal = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const [isLoading, setIsLoading] = useState(false);
  const [bonusTypes, setBonusTypes] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const queryClient = useQueryClient();
  const selectedBonusType = watch("bonus_type");
  const selectedOperator = watch("operator");

  useEffect(() => {
    HTTP.get("/get-lotto-bonus-types", config)
      .then((response: any) => {
        if (response.data.status === "successful") {
          setBonusTypes(response.data.data);
        } else {
          toast.error("Failed to fetch bonus types");
        }
      })
      .catch(() => {
        toast.error("An error occurred while fetching bonus types");
      });
  }, [token]);

  useEffect(() => {
    if (selectedOperator) {
      fetchTimetable();
    }
  }, [selectedOperator]);

  const fetchTimetable = () => {
    setIsLoading(true);
    HTTP.get(`/mylotto_get_timetable`, config)
      .then((response: any) => {
        setIsLoading(false);
        const timetableData = response.data.data;
        setTimetable(timetableData);
        filterTimetable(timetableData);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("An error occurred while fetching timetable");
      });
  };

  const filterTimetable = (timetableData: any) => {
    const filtered = timetableData.filter(
      (item: any) => item.operator === Number(selectedOperator)
    );
    const uniqueGames = removeDuplicates(filtered);
    setFilteredGames(uniqueGames);
  };

  const removeDuplicates = (games: any) => {
    const uniqueGames = [];
    const gameNames = new Set();

    games.forEach((game) => {
      if (!gameNames.has(game.name)) {
        gameNames.add(game.name);
        uniqueGames.push(game);
      }
    });

    return uniqueGames;
  };

  const submitForm = (data) => {
    setIsLoading(true);

    const payload = {};

    const appendString = (key, value) => {
      if (value) {
        payload[key] = String(value);
      }
    };

    if (data.bonus_type === "1" || data.bonus_type === "2") {
      appendString("bonus_type", data.bonus_type);
      appendString("operator", data.operator);
      appendString("stake", data.stake);
      appendString("duration", data.duration);
      appendString("percentage", data.percentage);
      appendString("wallet", data.wallet);
      appendString("game", data.game);
    }

    if (data.bonus_type === "3" || data.bonus_type === "4") {
      appendString("bonus_type", data.bonus_type);
      appendString("bonus_amount", data.bonus_amount);
      appendString("duration", data.duration);
      appendString("percentage", data.percentage);
      appendString("wallet", data.wallet);
      appendString("stake", data.stake);
    }

    if (data.bonus_type === "5") {
      appendString("bonus_type", data.bonus_type);
      appendString("bonus_amount", data.bonus_amount);
      appendString("start_date", data.start_date);
      appendString("end_date", data.end_date);
      appendString("percentage", data.percentage);
      appendString("stake", data.stake);
    }

    HTTP.post("/lotto-bonus", JSON.stringify(payload), config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success("Lotto Bonus updated successfully");
        handleClose();

        if (response.data.status) {
          queryClient.invalidateQueries("GET_LOTTO_BONUS");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An error occurred.");
        }
      });
  };

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Upload Lotto Bonus</strong>
            </span>
            <br />

            <form className="mt-4" onSubmit={handleSubmit(submitForm)}>
              <div className="mb-3">
                <select
                  className="form-control mb-2 p-3"
                  {...register("bonus_type", {
                    required: "Required",
                  })}
                >
                  <option value="">Select Bonus Type</option>
                  {bonusTypes.map((bonus) => (
                    <option key={bonus?.id} value={bonus.id}>
                      {bonus?.name}
                    </option>
                  ))}
                </select>
                {errors.bonus_type && (
                  <p className="text-danger text-capitalize">
                    {errors.bonus_type.message}
                  </p>
                )}
              </div>
              {(selectedBonusType === "1" || selectedBonusType === "2") && (
                <>
                  <div className="mb-3">
                    <select
                      className="form-control mb-2 p-3"
                      {...register("operator", {
                        required: "Required",
                      })}
                    >
                      <option value="">Select Operator</option>
                      <option value="26">5/90 Games</option>
                      <option value="28">Wesco</option>
                      <option value="43">Green lotto</option>
                      <option value="27">Baba Ijebu</option>
                      <option value="45">Lottomania</option>
                      <option value="57">Set Lotto</option>
                      <option value="42">Golden Chance</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Stake"
                      {...register("stake")}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Percentage"
                      {...register("percentage")}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-control mb-2 p-3"
                      {...register("duration")}
                    >
                      <option value="">Select Duration</option>
                      <option value="24hrs">24hrs</option>
                      <option value="48hrs">48hrs</option>
                      <option value="1 week">1 week</option>
                      <option value="1 month">1 month</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Wallet"
                      {...register("wallet")}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-control mb-2 p-3"
                      {...register("game")}
                    >
                      <option value="">Select Game</option>
                      {filteredGames.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {(selectedBonusType === "3" || selectedBonusType === "4") && (
                <>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Stake"
                      {...register("stake")}
                    />
                    {errors.stake && (
                      <p className="text-danger text-capitalize">
                        {errors.stake.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Percentage"
                      {...register("percentage")}
                    />
                  </div>

                  <div className="mb-3">
                    <select
                      className="form-control mb-2 p-3"
                      {...register("duration")}
                    >
                      <option value="">Select Duration</option>
                      <option value="24hrs">24hrs</option>
                      <option value="48hrs">48hrs</option>
                      <option value="1 week">1 week</option>
                      <option value="1 month">1 month</option>
                    </select>
                    {errors.duration && (
                      <p className="text-danger text-capitalize">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Wallet"
                      {...register("wallet")}
                    />
                    {errors.wallet && (
                      <p className="text-danger text-capitalize">
                        {errors.wallet.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Bonus Amount"
                      {...register("bonus_amount")}
                    />
                    {errors.bonus_amount && (
                      <p className="text-danger text-capitalize">
                        {errors.bonus_amount.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {(selectedBonusType === "5" || selectedBonusType === "6") && (
                <>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Stake"
                      {...register("stake")}
                    />
                    {errors.stake && (
                      <p className="text-danger text-capitalize">
                        {errors.stake.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Percentage"
                      {...register("percentage")}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-dark">Start Date</label>
                    <input
                      type="datetime-local"
                      className="form-control mb-2 p-3"
                      {...register("start_date")}
                    />
                    {errors.start_date && (
                      <p className="text-danger text-capitalize">
                        {errors.start_date.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="text-dark">End Date</label>
                    <input
                      type="datetime-local"
                      className="form-control mb-2 p-3"
                      {...register("end_date")}
                    />
                    {errors.end_date && (
                      <p className="text-danger text-capitalize">
                        {errors.end_date.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-3">
                    <input
                      type="number"
                      min={1}
                      className="form-control mb-2 p-3"
                      placeholder="Bonus Amount"
                      {...register("bonus_amount")}
                    />
                    {errors.bonus_amount && (
                      <p className="text-danger text-capitalize">
                        {errors.bonus_amount.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-100 p-3"
                style={{ background: "#27AAE1" }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  " Submit"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LottoBonusModal;
