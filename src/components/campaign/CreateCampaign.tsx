import { Button, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import HTTP from "../../utils/httpClient";
import queryKeys from "../../react-query/constants";

const schema = yup.object().shape({
  name: yup.string().required("This is a required field"),
  segment: yup
    .string()
    .oneOf(
      ["never_deposited", "dormant_since_days", "deposited_never_played"],
      "Select a valid segment"
    )
    .required("This is a required field"),
  days: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )
    .when("segment", {
      is: "dormant_since_days",
      then: (s) =>
        s
          .typeError("Days must be a number")
          .required("This is a required field")
          .min(1, "Days must be at least 1"),
      otherwise: (s) => s.notRequired(),
    }),
  channel: yup
    .string()
    .oneOf(["sms", "email", "both"], "Select a valid channel")
    .required("This is a required field"),
  message_template: yup.string().required("This is a required field"),
  deep_link: yup
    .string()
    .url("Enter a valid URL")
    .required("This is a required field"),
  scheduled_at: yup
    .string()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )
    .notRequired()
    .test(
      "is-future",
      "Schedule must be in the future",
      (value) => !value || new Date(value).getTime() > Date.now()
    ),
});

const CreateCampaign = ({ handleClose }: { handleClose: () => void }) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userInfo = useSelector(
    (state: any) => state.auth.userInfo
  );
  const token = userInfo?.token?.accessToken;

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const selectedSegment = watch("segment");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const submitForm = (data: any) => {
    setIsLoading(true);

    const segment_definition: { segment: string; days?: number } = {
      segment: data.segment,
    };
    if (data.segment === "dormant_since_days") {
      segment_definition.days = Number(data.days);
    }

    const payload: any = {
      name: data.name,
      segment_definition,
      channel: data.channel,
      message_template: data.message_template,
      deep_link: data.deep_link,
    };
    if (data.scheduled_at) {
      payload.scheduled_at = data.scheduled_at;
    }

    HTTP.post("/admin/campaigns", payload, config)
      .then(() => {
        setIsLoading(false);
        toast.success("Campaign created successfully");
        handleClose();
        queryClient.invalidateQueries({ queryKey: [queryKeys.GET_CAMPAIGNS] });
      })
      .catch((error: any) => {
        setIsLoading(false);

        if (
          error.response &&
          error.response.status === 422 &&
          error.response.data &&
          error.response.data.details
        ) {
          const details = error.response.data.details;
          Object.keys(details).forEach((field) => {
            const messages = details[field];
            const message = Array.isArray(messages) ? messages[0] : messages;
            toast.error(message);

            // Map backend field errors back onto the form where possible.
            // The backend nests days under segment_definition.days.
            const formField =
              field === "segment_definition.days"
                ? "days"
                : field === "segment_definition.segment"
                ? "segment"
                : field;

            setError(formField as any, { type: "server", message });
          });
        } else if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
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
              <strong className="text-dark">Create Campaign</strong>
            </span>
            <br />

            <form className="mt-4" onSubmit={handleSubmit(submitForm)}>
              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Name</label>
                <div>
                  <input
                    className="form-control"
                    type="text"
                    {...register("name")}
                    name="name"
                  />
                  {errors.name && (
                    <p className="text-danger text-capitalize">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Segment</label>
                <div>
                  <select className="form-control" {...register("segment")}>
                    <option value="">Select a segment</option>
                    <option value="never_deposited">Never deposited</option>
                    <option value="dormant_since_days">
                      Dormant since days
                    </option>
                    <option value="deposited_never_played">
                      Deposited never played
                    </option>
                  </select>
                  {errors.segment && (
                    <p className="text-danger text-capitalize">
                      {errors.segment.message}
                    </p>
                  )}
                </div>
              </div>

              {selectedSegment === "dormant_since_days" && (
                <div className="form-group mt-4 mb-4">
                  <label className="control-label text-dark">Days</label>
                  <div>
                    <input
                      className="form-control"
                      type="number"
                      min={1}
                      {...register("days")}
                      name="days"
                    />
                    {errors.days && (
                      <p className="text-danger text-capitalize">
                        {errors.days.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Channel</label>
                <div>
                  <select className="form-control" {...register("channel")}>
                    <option value="">Select a channel</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="both">Both</option>
                  </select>
                  {errors.channel && (
                    <p className="text-danger text-capitalize">
                      {errors.channel.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">
                  Message Template
                </label>
                <div>
                  <textarea
                    className="form-control"
                    placeholder="Message"
                    {...register("message_template")}
                    name="message_template"
                  ></textarea>
                  <small className="text-muted">
                    Supported placeholders: {"{name}"} and {"{username}"}
                  </small>
                  {errors.message_template && (
                    <p className="text-danger text-capitalize">
                      {errors.message_template.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">Deep Link</label>
                <div>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="https://"
                    {...register("deep_link")}
                    name="deep_link"
                  />
                  {errors.deep_link && (
                    <p className="text-danger text-capitalize">
                      {errors.deep_link.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <label className="control-label text-dark">
                  Schedule (optional)
                </label>
                <div>
                  <input
                    className="form-control"
                    type="datetime-local"
                    {...register("scheduled_at")}
                    name="scheduled_at"
                  />
                  {errors.scheduled_at && (
                    <p className="text-danger text-capitalize">
                      {errors.scheduled_at.message}
                    </p>
                  )}
                </div>
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
                  "Create Campaign"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
