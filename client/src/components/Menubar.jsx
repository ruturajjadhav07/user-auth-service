import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Menubar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img src={assets.shield} alt="logo" width={32} height={32} />
          <span className="fw-bold fs-4 test-dark">Authentify</span>
        </div>

        {/* login btn */}
        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login
          <i className="bi bi-arrow-right ms-2"></i>
        </div>
      </nav>
    </div>
  );
};

export default Menubar;
