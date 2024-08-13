import Footer from "../../components/footer/Footer";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import HTTP from "../../utils/httpClient"; // Ensure this is properly configured
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const token = userInfo?.token?.accessToken;
  const userRole = userInfo?.data?.role; // Assuming role is available here
  const currentUserId = userInfo?.data?.id; // Assuming the user ID is available here

  // Fetch admins if the user is a super admin
  useEffect(() => {
    const fetchAdmins = async () => {
      // setIsLoadingAdmin(true);
      if (userRole === "A") {
        try {
          const response = await HTTP.get("/get-admins", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setAdmins(response.data);
        } catch (error) {
          console.error("Error fetching admins:", error);
          toast.error("Failed to fetch admin list.");
          // setIsLoadingAdmin(false);
        }
      }
    };

    fetchAdmins();
  }, [userRole, token]);

  // Handle input change
  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password field cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      const adminId = userRole === "A" ? selectedAdminId : currentUserId; // Super admin resets selected admin's password
      const response = await HTTP.post(
        `/admin/change-password/${adminId}`,
        { password }, // Sending password in payload
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password changed successfully.");
        // Clear the form
        setPassword("");
      } else {
        toast.error("Failed to change the password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing the password.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle admin selection
  const handleAdminSelection = (adminId, adminName) => {
    setSelectedAdminId(adminId);
    setSelectedAdminName(adminName); // Set selected admin's name
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
              <h4 className="mb-0">Password Reset</h4>
              <ol className="breadcrumb mb-0 pl-0 pt-1 pb-0">
                <li className="breadcrumb-item">
                  <Link to="/home" className="default-color">
                    Dashboard
                  </Link>
                </li>
                <li className="breadcrumb-item active">Password Reset</li>
              </ol>
            </div>

            <div>
              {userRole === "A" ? (
                <div className="container-fluid mt-5">
                  <h5>Admin List</h5>
                  {isLoading ? ( // Show spinner while loading
                    <div className="spinner text-center mt-5">
                      <Spinner
                        as="span"
                        animation="border"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                      />
                    </div>
                  ) : admins?.data?.length === 0 ? (
                    <p>No admins found.</p>
                  ) : (
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins?.data?.map((admin, index) => (
                          <tr key={admin.id}>
                            <td>{index + 1}</td>
                            <td>{admin.name}</td>
                            <td>{admin.username}</td>
                            <td>{admin.email}</td>
                            <td>
                              <Button
                                variant="primary"
                                // onClick={() => setSelectedAdminId(admin.id)}
                                onClick={() =>
                                  handleAdminSelection(admin.id, admin.name)
                                } // Set admin id and name
                              >
                                Reset Password
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {selectedAdminId && (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <input
                          type="password"
                          name="password"
                          placeholder={`New Password for ${selectedAdminName}`} // Dynamic placeholder
                          className="form-control mb-4 w-50"
                          value={password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                // Regular Admin View
                <div className="container-fluid mt-5">
                  <h5>Reset Your Password</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        className="form-control mb-4 w-50"
                        value={password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PasswordReset;
