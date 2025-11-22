import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Getlink from "./apiLink";
function SignInForm({ onLogin }) {
  const navigate = useNavigate();
  const [loadingLogin, setloadingLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    password: localStorage.getItem("password"),
  });

  // Function to check the user's session and role
  const checkSession = () => {
    axios
      .get(Getlink() + "/api/check-session", {
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        const data = response.data;

        if (data.isLoggedIn) {
          if (data.role === "admin") navigate("/admindashboard");
          else if (data.role === "mba") navigate(`/mba`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  checkSession();

  const [error, seterror] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    localStorage.setItem(name, value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setloadingLogin(true);
    axios
      .post(Getlink() + "/signin", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials in the request
      })
      .then((response) => {
        const data = response.data;
        // Handle the response from the server
        if (data.role === "admin") {
          navigate("/admindashboard");
        } else if (data.role === "mba") {
          navigate(`/mba`);
        } else {
          seterror("Invalid email or password");
          setloadingLogin(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        seterror("Invalid email or password");
        setloadingLogin(false);
      });
  };

  return (
    <div id="app">
      <section className="section">
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <div className="card card-primary">
                <div className="card-header">
                  <h4>Sign In</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        name="email"
                        autoFocus
                        onChange={handleChange}
                        value={formData.email}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type="password"
                        className="form-control"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button
                        disabled={loadingLogin}
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                      >
                        {loadingLogin ? "Signing in" : "Sign In"}
                      </button>
                    </div>
                  </form>
                  <div style={{ color: "red" }}>{error}</div>
                </div>
                <div className="mb-4 text-muted text-center">
                  Don't have an account? <Link to="/register">Register</Link>
                </div>
                <div className="mb-4 text-muted text-center">
                  <Link to="/forgotpassword">Forgot Password?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignInForm;
