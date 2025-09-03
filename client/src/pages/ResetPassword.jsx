import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);

  axios.defaults.withCredentials = true;

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only allow numeric input
    e.target.value = value;
    if (value && index < 5) {
      inputRef.current[index + 1].focus(); // Move focus to next input if current is filled
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus(); // Move focus to previous input if Backspace pressed and current is empty
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).split(""); // Get first 6 digits
    paste.forEach((digit, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = digit;
      }
    });
    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus(); // Move focus to the next input
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/send-reset-otp?email=${email}`
      );
      if (response.status == 200) {
        toast.success("Password reset otp sent successfully");
        setIsEmailSent(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    const otp = inputRef.current.map((input) => input.value).join("");
    if (otp.length != 6) {
      toast.error("Please enter all 6 digit of otp");
      return;
    }

    setOtp(otp);
    setIsOtpSubmitted(true);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendURL + "/reset-password", {
        email,
        otp,
        newPassword,
      });

      if (response.status == 200) {
        toast.success("Password reset succesfully");
        navigate("/login");
      } else {
        toast.error("Something went wrong try again.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(90deg, #fbc2eb,#a18cd1)",
        border: "none",
      }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={assets.shield} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authentify</span>
      </Link>

      {/* card */}
      {!isEmailSent && (
        <div
          className="rounded-4 p-5 border text-center bg-white"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h4 className="mb-2">Reset Password</h4>
          <p className="mb-4"> Enter your Registered Email address</p>
          <form onSubmit={onSubmitEmail}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 ps-4">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="Enter Email Address"
                style={{ height: "50px" }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? "loading" : "Submit"}
            </button>
          </form>
        </div>
      )}
      {/* otp */}
      {!isOtpSubmitted && isEmailSent && (
        <div
          className="p-4 rounded-4 shadow bg-white"
          style={{ width: "400px" }}
        >
          <h4 className="text-center fw-bold mb-2">Email Verify OTP</h4>
          <p className="text-center text-dark-50 mb-4">
            Enter 6-digit OTP sent to your email
          </p>
          <div className="d-flex justify-content-between gap-2 mb-4 text-center text-white-50 mb-2">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="form-control text-center fs-4 otp-input"
                ref={(el) => (inputRef.current[index] = el)} // Ref to hold each OTP input
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </div>
          <button
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
            onClick={handleVerify}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </div>
      )}

      {/* password form */}
      {isOtpSubmitted && isEmailSent && (
        <div
          className="rounded-4 p-5 text-center bg-white "
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h4>New Password</h4>
          <p className="mb-4">Enter New Password below</p>
          <form onSubmit={handlePassword}>
            <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
              <span className="input-group-text bg-transparent border-0 p-4">
                <i className="bi bi-person-fill-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                placeholder="******"
                style={{ height: "50px" }}
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "loading" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
