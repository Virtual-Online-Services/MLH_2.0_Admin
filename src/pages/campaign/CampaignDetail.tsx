import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import useGetCampaign from "../../react-query/api-hooks/useGetCampaign";
import HTTP from "../../utils/httpClient";
import queryKeys from "../../react-query/constants";

const CampaignDetail = () => {
  const { id } = useParams();

  const { campaignResponse, isLoadingCampaign, isError, isNotFound } =
    useGetCampaign(id);

  const token = useSelector(
    (state: any) => state.auth.userInfo?.token?.accessToken
  );

  const queryClient = useQueryClient();

  const [isLaunching, setIsLaunching] = useState(false);

  // The backend show response is shaped as
  // { status, data: { ...campaign fields }, metrics: { ... } }
  const campaign = campaignResponse?.data;
  const metrics = campaignResponse?.metrics;

  const status: string | undefined = metrics?.status ?? campaign?.status;

  const segmentDefinition = campaign?.segment_definition;

  const formatDate = (value: any) => {
    if (!value) return "-";
    const m = moment(value);
    return m.isValid() ? m.format("Do MMM YYYY, h:mm a") : "-";
  };

  const formatSegment = (definition: any) => {
    if (!definition) return "-";
    const segment = definition.segment ?? "-";
    if (definition.segment === "dormant_since_days") {
      return `${segment} (${definition.days} days)`;
    }
    return segment;
  };

  // Metrics fall back to fields on the campaign object when the metrics
  // block is absent.
  const recipientsResolved =
    metrics?.recipients_resolved ?? campaign?.recipients_resolved ?? 0;
  const sentCount = metrics?.sent_count ?? campaign?.sent_count ?? 0;
  const failedCount = metrics?.failed_count ?? campaign?.failed_count ?? 0;
  const skippedCount = metrics?.skipped_count ?? campaign?.skipped_count ?? 0;

  const canLaunch = status === "draft" || status === "scheduled";

  const launchLabel = () => {
    if (isLaunching) return "Launching...";
    if (status === "sending") return "Already launched";
    if (status === "completed") return "Completed";
    if (status === "failed") return "Failed";
    return "Launch Campaign";
  };

  const handleLaunch = () => {
    if (!canLaunch || isLaunching) return;

    setIsLaunching(true);

    HTTP.post(
      `/admin/campaigns/${id}/launch`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then(() => {
        toast.success("Campaign launched successfully");
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_CAMPAIGN, id],
        });
      })
      .catch((error: any) => {
        if (error?.response?.status === 409) {
          toast.error("Campaign has already been launched or is sending");
          // Refresh status so the UI reflects the current server state.
          queryClient.invalidateQueries({
            queryKey: [queryKeys.GET_CAMPAIGN, id],
          });
        } else if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred while launching the campaign.");
        }
      })
      .finally(() => {
        setIsLaunching(false);
      });
  };

  return (
    <div>
      <div className="main">
        <Navbar />
        <div className="container__flex">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="container">
            <div className="page-title">
              <h4 className="mb-0"> Campaign Detail </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/cvm-campaigns" className="default-color">
                    Campaigns
                  </Link>
                </li>
                <li className="breadcrumb-item active">Detail</li>
              </ol>
            </div>

            <div className="mt-4">
              {isLoadingCampaign ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : isNotFound ? (
                <div className="d-flex justify-content-center text-center p-5">
                  <div className="hidden-xs hidden-sm mx-auto">
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      Campaign not found
                    </div>
                  </div>
                </div>
              ) : isError ? (
                <div className="d-flex justify-content-center text-center p-5">
                  <div className="hidden-xs hidden-sm mx-auto">
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      Something went wrong while loading this campaign. Please
                      try again.
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Campaign definition */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-3">
                        {campaign?.name ?? "-"}
                      </h5>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <strong>Segment:</strong>{" "}
                          {formatSegment(segmentDefinition)}
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Channel:</strong>{" "}
                          {campaign?.channel ?? "-"}
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Status:</strong> {status ?? "-"}
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Scheduled at:</strong>{" "}
                          {campaign?.scheduled_at
                            ? formatDate(campaign.scheduled_at)
                            : "Not scheduled (send now)"}
                        </div>
                        <div className="col-md-12 mb-3">
                          <strong>Deep link:</strong>{" "}
                          {campaign?.deep_link ?? "-"}
                        </div>
                        <div className="col-md-12 mb-3">
                          <strong>Message template:</strong>
                          <div
                            className="mt-1 p-2 bg-light rounded"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {campaign?.message_template ?? "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics panel */}
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title mb-3">Metrics</h5>
                      <div className="row text-center">
                        <div className="col-6 col-md mb-3">
                          <div className="h3 mb-0">{recipientsResolved}</div>
                          <small className="text-muted">
                            Recipients resolved
                          </small>
                        </div>
                        <div className="col-6 col-md mb-3">
                          <div className="h3 mb-0">{sentCount}</div>
                          <small className="text-muted">Sent</small>
                        </div>
                        <div className="col-6 col-md mb-3">
                          <div className="h3 mb-0">{failedCount}</div>
                          <small className="text-muted">Failed</small>
                        </div>
                        <div className="col-6 col-md mb-3">
                          <div className="h3 mb-0">{skippedCount}</div>
                          <small className="text-muted">Skipped</small>
                        </div>
                        <div className="col-6 col-md mb-3">
                          <div className="h3 mb-0">{status ?? "-"}</div>
                          <small className="text-muted">Status</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch action */}
                  <div className="mb-5">
                    <Button
                      type="button"
                      onClick={handleLaunch}
                      disabled={!canLaunch || isLaunching}
                      style={{ background: "#27AAE1" }}
                      className="p-3"
                    >
                      {isLaunching ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        launchLabel()
                      )}
                    </Button>
                  </div>

                  <br />
                  <br />
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CampaignDetail;
