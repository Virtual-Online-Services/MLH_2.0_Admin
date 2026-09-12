import { useState } from "react";
import { Link } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";
import moment from "moment";
import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import BModal from "../../components/BModal/BModal";
import CreateCampaign from "../../components/campaign/CreateCampaign";
import useGetCampaigns from "../../react-query/api-hooks/useGetCampaigns";

const formatDate = (timestamp: any) => {
  if (!timestamp) return "-";
  const parsed = moment(timestamp);
  return parsed.isValid() ? parsed.format("Do MMM YYYY, h:mm a") : "-";
};

const formatSegment = (segmentDefinition: any) => {
  if (!segmentDefinition) return "-";
  const segment = segmentDefinition.segment ?? "-";
  if (segmentDefinition.days) {
    return `${segment} (${segmentDefinition.days} days)`;
  }
  return segment;
};

const Campaigns = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const { campaignsResponse, isLoadingCampaigns } = useGetCampaigns();

  const campaigns = campaignsResponse?.data ?? [];

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
              <h4 className="mb-0"> Campaigns </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Campaigns</li>
              </ol>
            </div>

            <div>
              <p>
                <a
                  onClick={() => handleOpen()}
                  className="btn btn-primary mt-4"
                >
                  <i className="fa fa-plus-circle"></i>{" "}
                </a>
              </p>

              {isLoadingCampaigns ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : campaigns.length === 0 ? (
                <div className="d-flex justify-content-center text-center p-5">
                  <div className="hidden-xs hidden-sm mx-auto">
                    <div className="alert alert-danger text-center" role="alert">
                      No Record Found
                    </div>
                  </div>
                </div>
              ) : (
                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Segment</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Admin</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign: any) => (
                      <tr key={campaign.id}>
                        <td>
                          <Link to={`/cvm-campaign/${campaign.id}`}>
                            {campaign.name}
                          </Link>
                        </td>
                        <td>{formatSegment(campaign.segment_definition)}</td>
                        <td>{campaign.channel}</td>
                        <td>{campaign.status}</td>
                        <td>
                          {campaign.admin?.name ??
                            campaign.admin?.username ??
                            campaign.admin_id}
                        </td>
                        <td>{formatDate(campaign.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <br />
              <br />
            </div>
          </div>
        </div>
        <Footer />
        <BModal
          backdrop="static"
          keyboard={false}
          show={isOpen}
          onHide={handleClose}
          size="md"
        >
          <CreateCampaign handleClose={handleClose} />
        </BModal>
      </div>
    </div>
  );
};

export default Campaigns;
