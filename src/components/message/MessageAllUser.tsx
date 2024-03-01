import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import HTTP from "../../utils/httpClient";
import { useQueryClient } from "@tanstack/react-query";

const schema = yup.object().shape({
  subject: yup.string().required("This is a required field"),
  content: yup.string().required("This is a required field"),
});

const MessageAllUser = ({ handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const submitForm = (data: any) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("content", data.content);
    formData.append("type", "Users");

    HTTP.post("/send-bulk-email", formData, config)
      .then((response: any) => {
        setIsLoading(false);
        toast.success("Message sent successfully");
        handleClose();
        // if (response.data.message) {
        //   // Invalidate the query cache for adverts data
        //   queryClient.invalidateQueries("GET_ADMIN_PROFILE");
        // }
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const bannerError = error.response.data.errors.logo[0];
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
              <strong className="text-dark">Message All Users</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit(submitForm)}
            >
              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Subject</label>
                <div>
                  <input
                    className="form-control"
                    type="text"
                    {...register("subject", {
                      required: "Required",
                    })}
                    name="subject"
                  />
                  {errors.subject && (
                    <p className="text-danger text-capitalize">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
                <br />
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Message</label>
                <div>
                  {/* <input
                    className="form-control"
                    type="text"
                    value="content"
                    {...register("content", {
                      required: "Required",
                    })}
                  />
                  {errors.content && (
                    <p className="text-danger text-capitalize">
                      {errors.content.message}
                    </p>
                  )} */}
                  <textarea
                    className="form-control"
                    name="content"
                    placeholder="Message"
                    {...register("content", {
                      required: "Required",
                    })}
                  ></textarea>
                  {errors.content && (
                    <p className="text-danger text-capitalize">
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <br />
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
                  "Send"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageAllUser;
