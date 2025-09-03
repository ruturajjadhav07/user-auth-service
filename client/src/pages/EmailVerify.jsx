import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const inputRef = useRef([]); // Ref initialized as an array
  const [loading, setLoading] = useState(false);
  const { getUserData, isLoggedIn, userData, backendURL } =
    useContext(AppContext);
  const navigate = useNavigate();

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

  const handleVerify = async () => {
    const otp = inputRef.current.map((input) => input.value).join(""); // Join values of OTP inputs
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits of OTP ");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(backendURL + "/verify-otp", { otp });
      if (response.status === 200) {
        toast.success("OTP verified successfully");
        getUserData();
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // if user verified it should not navigate to email verification page
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div
      className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background: "linear-gradient(90deg, #fbc2eb,#a18cd1)",
        borderRadius: "none",
      }}
    >
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2"
        style={{ textDecoration: "none" }}
      >
        <img src={assets.shield} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">Authify</span>
      </Link>

      <div className="p-4 rounded-4 shadow bg-white" style={{ width: "400px" }}>
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
    </div>
  );
};

export default EmailVerify;
