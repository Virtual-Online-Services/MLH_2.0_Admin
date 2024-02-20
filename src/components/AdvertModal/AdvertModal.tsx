import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  company: yup.string().required("This is a required field"),
  link: yup.string().required("This is a required field"),
  banner: yup.mixed().required("This is a required field"),
  start_date: yup.date().required("This is a required field"),
  end_date: yup
    .date()
    .required("This is a required field")
    .min(yup.ref("start_date"), "End date must be after start date"),
  // .min(new Date(), "End date cannot be in the past"),
});

const AdvertModal = ({ handleClose }) => {
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
    formData.append("name", data.name);
    formData.append("company", data.company);
    formData.append("link", data.link);

    formData.append("start_date", data.start_date.toISOString());
    formData.append("end_date", data.end_date.toISOString());
    formData.append("banner", data.banner[0]);

    HTTP.post("/add-advert", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success(response.data.message);
        handleClose();

        if (response.data.message) {
          // Invalidate the query cache for adverts data
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
              <div className="mb-3 w-100">
                <input
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="Start Date"
                  min={getCurrentDate()} // Function to get current date in "YYYY-MM-DD" format
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
                <input
                  type="date"
                  className="form-control mb-2 p-3"
                  placeholder="End Date"
                  min={getCurrentDate()} // Function to get current date in "YYYY-MM-DD" format
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
                    size="sm"
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
