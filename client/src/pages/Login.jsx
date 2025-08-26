import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, Links, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";

const Login = () => {
  const [isCreatedAccount, setIsCreatedAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendURL, setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  // submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      if (isCreatedAccount) {
        // make a call to register api
        const response = await axios.post(`${backendURL}/register`, {
          name,
          email,
          password,
        });
        if (response.status === 201) {
          navigate("/");
          getUserData(); //when logged in it will call getUserData and will make api call and retrive user details
          toast.success("Account created Successfully");
        } else {
          toast.error("Email already exists");
        }
      } else {
        // login api
        const response = await axios.post(`${backendURL}/login`, {
          email,
          password,
        });
        if (response.status == 200) {
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error("Email or Password is incorrect");
        }
      }
    } catch (err) {
      toast.error(err.response.data.message);
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
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "24px",
            textDecoration: "none",
          }}
        >
          <img src={assets.shield} alt="logo" height={32} width={32} />
          <span className="fw-bold fs-4 text-light">Authentify</span>
        </Link>
      </div>

      {/* login form */}

      <div className="card p-4 " style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">
          {isCreatedAccount ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={onSubmitHandler}>
          {isCreatedAccount && (
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                placeholder="Enter Full Name"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="form-control"
              placeholder="example@email.com"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="******"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/reset-password" className="text-decoration-none">
              {" "}
              Forgot Password
            </Link>
          </div>
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {/* {isCreatedAccount ? "Sign Up" : "Login"} */}
            {loading ? "Loading..." : isCreatedAccount ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            {isCreatedAccount ? (
              <>
                Already Have an account ?{" "}
                <span
                  onClick={() => setIsCreatedAccount(false)}
                  className="text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsCreatedAccount(true)}
                  className="text-decoration-underline"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  Sign Up{" "}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
