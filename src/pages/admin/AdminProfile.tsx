import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import useGetAdmin from "../../react-query/api-hooks/useGetAdmin";
import { Button, Spinner } from "react-bootstrap";
import HTTP from "../../utils/httpClient";

import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
const AdminProfile = () => {
  const [editedDetails, setEditedDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;

  const { userAdminResponse, isLoadingAdmin } = useGetAdmin([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await HTTP.post(
        `/update-admin/${userAdminResponse.data.id}`,
        editedDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile Updated Successfully");
      // Invalidate the query cache for admin details
      queryClient.invalidateQueries("GET_ADMIN_DETAILS");
    } catch (error) {
      console.error("Error editing admin:", error);
      // Handle error
      toast.error("An error occurred while updating the admin details.");
    } finally {
      setIsLoading(false);
    }
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
              <h4 className="mb-0">Profile </h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Profile</li>
              </ol>
            </div>

            <div>
              {isLoadingAdmin ? (
                <div className="spinner text-center mt-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                  />
                </div>
              ) : userAdminResponse?.data?.length === 0 ? (
                <div className="d-flex justify-content-center text-center p-5">
                  <div className="hidden-xs hidden-sm mx-auto">
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      No Record Found
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="container-fluid mt-5">
                    <table width="50%">
                      <tbody>
                        <tr>
                          <td>
                            <form onSubmit={handleSubmit}>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="username"
                                  placeholder="Username"
                                  className="form-control mb-4"
                                  value="admin"
                                  disabled
                                />
                              </div>

                              <div className="form-group">
                                <input
                                  type="text"
                                  name="name"
                                  placeholder="Name"
                                  className="form-control mb-4"
                                  required=""
                                  value={
                                    editedDetails.name ||
                                    userAdminResponse?.data?.name
                                  }
                                  onChange={handleChange}
                                />
                              </div>

                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  "Save"
                                )}
                              </Button>
                            </form>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <br />
                  </div>
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

export default AdminProfile;
