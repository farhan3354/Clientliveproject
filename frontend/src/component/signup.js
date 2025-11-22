import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Getlink from "./apiLink";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function RegisterForm({ onLogin }) {
  const navigate = useNavigate();
  const query = useQuery();
  const referralCode = query.get("ref");

  const [loadingSignup, setLoadingSignup] = useState(false);
  const [isReferralValid, setIsReferralValid] = useState(true);
  const [referralErrorMessage, setReferralErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    agree: false,
    ref: referralCode || "",
  });

  useEffect(() => {
    const clearSession = async () => {
      try {
        await axios.get(Getlink() + "/api/destroy", { withCredentials: true });
      } catch (error) {
        console.error("Error clearing session:", error);
      }
    };

    clearSession();

    if (referralCode) {
      validateReferralCode(referralCode);
    }
  }, [referralCode]);

  const validateReferralCode = async (ref) => {
    try {
      const response = await fetch(Getlink() + `/validateReferral?ref=${ref}`);
      if (response.ok) {
        setIsReferralValid(true);
        setReferralErrorMessage("");
      } else {
        setIsReferralValid(false);
        const error = await response.json();
        setReferralErrorMessage(error.message || "Invalid referral code.");
      }
    } catch (error) {
      console.error("Error validating referral code:", error);
      setIsReferralValid(false);
      setReferralErrorMessage("Error validating referral code. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingSignup(true);
  
    if (!isReferralValid && formData.ref) {
      toast("Invalid referral code!", {
        position: "top-right",
        autoClose: 5000,
        className: "color_red",
      });
      setLoadingSignup(false);
      return;
    }
  
    if (formData.password !== formData.passwordConfirm) {
      toast("Password and Confirm Password do not match!", {
        position: "top-right",
        autoClose: 5000,
        className: "color_red",
      });
      setLoadingSignup(false);
      return;
    }
  
    // Route to `register/register` endpoint
    const route = Getlink() + "/register/register";
  
    fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Email already exists.") {
          toast("Email already exists! Try Signing in", {
            position: "top-right",
            autoClose: 5000,
            className: "color_red",
          });
          setLoadingSignup(false);
          return;
        }
  
        // Navigate to login page after successful registration
        toast("Registration successful! Please log in.", {
          position: "top-right",
          autoClose: 5000,
          className: "color_green",
        });
        setLoadingSignup(false);
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoadingSignup(false);
      });
  };

  return (
    <div id="app">
      <ToastContainer />
      <section className="section">
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-8 offset-xl-2">
              <div className="card card-primary">
                <div className="card-header">
                  <h4>Register</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          id="first_name"
                          type="text"
                          className="form-control"
                          name="first_name"
                          autoFocus
                          onChange={handleChange}
                          value={formData.first_name}
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          id="last_name"
                          type="text"
                          className="form-control"
                          name="last_name"
                          onChange={handleChange}
                          value={formData.last_name}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                      />
                    </div>
                    <div className="row">
                      <div className="form-group col-6">
                        <label htmlFor="password" className="d-block">
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          className="form-control"
                          name="password"
                          onChange={handleChange}
                          value={formData.password}
                        />
                      </div>
                      <div className="form-group col-6">
                        <label htmlFor="password2" className="d-block">
                          Password Confirmation
                        </label>
                        <input
                          id="password2"
                          type="password"
                          className="form-control"
                          name="passwordConfirm"
                          onChange={handleChange}
                          value={formData.passwordConfirm}
                        />
                      </div>
                    </div>

                    {formData.ref && (
                      <div className="form-group">
                        <label htmlFor="referralCode">Referral Code</label>
                        <input
                          id="referralCode"
                          type="text"
                          className="form-control"
                          name="ref"
                          value={formData.ref}
                          disabled
                        />
                        {!isReferralValid && (
                          <p style={{ color: "red" }}>
                            {referralErrorMessage || "Invalid referral code"}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg btn-block"
                        disabled={loadingSignup || (!isReferralValid && formData.ref)}
                      >
                        Register
                      </button>
                    </div>
                  </form>
                </div>
                <div className="mb-4 text-muted text-center">
                  Already Registered? <Link to="/signin">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterForm;
