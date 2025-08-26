import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div
      className="text-center d-flex flex-column align-items-center justify-content-center py-5 px-3"
      style={{ minHeight: "80vh" }}
    >
      <img src={assets.shield} alt="header" width={120} className="mb-4" />

      <h5 className="fw-semibold">
        Hey Dev's{" "}
        <span role="img" aria-label="wave">
          {" "}
          👋{" "}
        </span>
      </h5>

      <h1 className="fw-bold display-5 mb-3"> Welcome to Authentify</h1>

      <p className="text-muted fs-5 mb-4" style={{ maxWidth: "500px" }}>
        Lets start a quick tour and you can set your authentication
      </p>

      <button className="btn btn-outline-dark rounded-pill px-4 py-2">
        Get Started
      </button>
    </div>
  );
};

export default Header;
