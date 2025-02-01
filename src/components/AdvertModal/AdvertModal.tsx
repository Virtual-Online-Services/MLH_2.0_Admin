import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";
import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator.js";

const schema = yup.object().shape({
  // name: yup.string().required("This is a required field"),
  // company: yup.string().required("This is a required field"),
  // link: yup.string().required("This is a required field"),
  // banner: yup.mixed().required("This is a required field"),
  // start_date: yup.date().required("This is a required field"),
  // end_date: yup
  //   .date()
  //   .required("This is a required field")
  //   .min(yup.ref("start_date"), "End date must be after start date"),
  // // .min(new Date(), "End date cannot be in the past"),
  name: yup.string().required("This is a required field"),
  company: yup.string().required("This is a required field"),
  link: yup.string().required("This is a required field"),
  banner: yup.mixed().required("This is a required field"),
  start_date: yup.date().required("This is a required field"),
  end_date: yup
    .date()
    .required("This is a required field")
    .min(yup.ref("start_date"), "End date must be after start date"),
  page_web: yup.string().required("This is a required field"),
  page_app: yup.string().required("This is a required field"),
  operator_id: yup.string().required("This is a required field"),
  start_time: yup.string().required("This is a required field"),
  end_time: yup.string().required("This is a required field"),
});

const AdvertModal = ({ handleClose }) => {
  const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
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

  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const [isLoading, setIsLoading] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  };

  const queryClient = useQueryClient();

  const submitForm = (data: any) => {
    setIsLoading(true);

    const formData = new FormData();
    // formData.append("name", data.name);
    // formData.append("company", data.company);
    // formData.append("link", data.link);

    // formData.append("start_date", data.start_date.toISOString());
    // formData.append("end_date", data.end_date.toISOString());
    formData.append("banner", data.banner[0]);

    Object.keys(data).forEach((key) => {
      if (key === "start_date" || key === "end_date") {
        formData.append(key, new Date(data[key]).toISOString());
      } else if (key !== "banner") {
        formData.append(key, data[key]);
      }
    });
    HTTP.post("/add-advert", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();

        if (response.data.message) {
          queryClient.invalidateQueries("GET_USER_ADVERT");
        }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const bannerError = error.response.data.errors.banner[0];
          toast.error(bannerError);
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
              <strong className="text-dark">Upload Advert Banner</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <select
                className="form-control mb-2 p-3"
                {...register("page_web")}
              >
                <option value="">Select Web Page</option>
                <option value="Home or Lotto">Home or Lotto</option>
                <option value="Results">Results</option>
                <option value="Timetable">Timetable</option>
                <option value="Tutorials">Tutorials</option>
              </select>
              {errors.page_web && (
                <p className="text-danger">{errors.page_web.message}</p>
              )}

              <select
                className="form-control mb-2 p-3"
                {...register("page_app")}
              >
                <option value="">Select App Page</option>
                <option value="Home or Lotto">Home or Lotto</option>
                <option value="Results">Results</option>
                <option value="Timetable">Timetable</option>
                <option value="Tutorials">Tutorials</option>
              </select>
              {errors.page_app && (
                <p className="text-danger">{errors.page_app.message}</p>
              )}

              <select
                className="form-control mb-2 p-3"
                {...register("operator_id")}
              >
                <option value="">Select Operator</option>
                {userLottoOperator?.data
                  ?.filter((operator: any) => operator.del !== "Y")
                  .map((operator: any) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.name}
                    </option>
                  ))}
              </select>

              {errors.operator_id && (
                <p className="text-danger">{errors.operator_id.message}</p>
              )}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Name"
                  //   name="name"
                  {...register("name", {
                    required: "Required",
                  })}
                />
                {errors.name && (
                  <p className="text-danger text-capitalize">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Company Name"
                  {...register("company", {
                    required: "Required",
                  })}
                />
                {errors.company && (
                  <p className="text-danger text-capitalize">
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="URL"
                  {...register("link", {
                    required: "Required",
                  })}
                />
                {errors.link && (
                  <p className="text-danger text-capitalize">
                    {errors.link.message}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control mb-2 p-3"
                  placeholder="Banner Image"
                  {...register("banner", {
                    required: "Required",
                  })}
                  accept=".jpeg, .png, .jpg, .gif"
                />
                {errors.banner && (
                  <p className="text-danger text-capitalize">
                    {errors.banner.message}
                  </p>
                )}
              </div>
              <label htmlFor="start_time" className="mb-2">
                Start Time
              </label>
              <input
                id="start_time"
                type="time"
                className="form-control mb-2 p-3"
                placeholder="Start Time"
                {...register("start_time")}
              />
              {errors.start_time && (
                <p className="text-danger">{errors.start_time.message}</p>
              )}

              <label htmlFor="end_time" className="mb-2">
                End Time
              </label>
              <input
                id="end_time"
                type="time"
                className="form-control mb-2 p-3"
                placeholder="End Time"
                {...register("end_time")}
              />
              {errors.end_time && (
                <p className="text-danger">{errors.end_time.message}</p>
              )}

              <div className="mb-3 w-100">
                <label htmlFor="start_date" className="mt-3 mb-2">
                  Start Date
                </label>
                <input
                  id="start_date"
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="Start Date"
                  min={getCurrentDate()}
                  {...register("start_date", {
                    required: "Required",
                    validate: {
                      notPast: (value) => value && !isPastDate(value),
                    },
                  })}
                />
                {errors.start_date && (
                  <p className="text-danger text-capitalize">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="end_date" className="mt-3 mb-2">
                  End Date
                </label>
                <input
                  id="end_date"
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="End Date"
                  min={getCurrentDate()}
                  {...register("end_date", {
                    required: "Required",
                    validate: {
                      notPast: (value) => value && !isPastDate(value),
                    },
                  })}
                />
                {errors.end_date && (
                  <p className="text-danger text-capitalize">
                    {errors.end_date.message}
                  </p>
                )}
              </div>

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
                  " Proceed"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertModal;
