import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Menubar = () => {
  const navigate = useNavigate();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { userData, backendURL, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  useEffect(() => {
    // for drop down menu
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendURL + "/logout");
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.withCredentials = true;
      const response = await axios.post(backendURL + "/send-otp");
      if (response.status === 200) {
        navigate("/email-verify");
        toast.success("OTP has send successfully");
      } else {
        toast.error("Unable to send OTP");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img src={assets.shield} alt="logo" width={32} height={32} />
          <span className="fw-bold fs-4 test-dark">Authentify</span>
        </div>

        {userData ? (
          <div className="position-relative" ref={dropDownRef}>
            {/* show username initial */}
            <div
              className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "40px",
                height: "40px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setDropDownOpen((prev) => !prev)}
            >
              {userData.name[0].toUpperCase()}
            </div>

            {/* dropdown for verify and logout  */}
            {dropDownOpen && (
              <div
                className="position-absolute shadow bg-white rounded p-2"
                style={{ top: "50px", right: "0", zIndex: 100 }}
              >
                {!userData.isAccountVerified && (
                  <div
                    className="dropdown-item py-1 px-2"
                    style={{ cursor: "pointer" }}
                    onClick={sendVerificationOtp}
                  >
                    Verify Email
                  </div>
                )}
                <div
                  className="dropdown-item py-1 px-2 text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          //  login btn
          <div
            className="btn btn-outline-dark rounded-pill px-3"
            onClick={() => navigate("/login")}
          >
            Login
            <i className="bi bi-arrow-right ms-2"></i>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Menubar;
