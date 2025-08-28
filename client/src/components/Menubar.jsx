import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useRef, useState } from "react";
import AppContext from "../context/AppContext";

const Menubar = () => {
  const navigate = useNavigate();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { userData } = useContext(AppContext);

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
                  >
                    Verify Email
                  </div>
                )}
                <div
                  className="dropdown-item py-1 px-2 text-danger"
                  style={{ cursor: "pointer" }}
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
