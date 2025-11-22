import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetLink from "./apiLink";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpMatched, setOtpMatched] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [receivedOtp, setReceivedOtp] = useState("");
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(`${GetLink()}/forgotpass/${email}`);
      // Send OTP to the provided email address
      const response = await fetch(`${GetLink()}/forgotpass/${email}`);

      if (response.ok) {
        // Set the state to indicate that OTP has been sent
        setOtpSent(true);

        // Get the OTP from the response
        const data = await response.json();
        const receivedOtp = data.otp;

        // Set the OTP in the state
        setReceivedOtp(receivedOtp);
      } else {
        toast.error("Email not registered", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error, please try again", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp == receivedOtp) {
      setOtpMatched(true);
    } else {
      setRemainingAttempts((prevAttempts) => prevAttempts - 1);

      if (remainingAttempts > 1) {
        toast.error(
          `Incorrect OTP, You have ${remainingAttempts - 1} attempt(s) left.`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error("Incorrect OTP. No more attempts left.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setEmail("");
        setOtp("");
        setNewPassword("");
        setOtpSent(false);
        setOtpMatched(false);
        navigate("/signin");
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${GetLink()}/forgotpassReset/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password reset, please login again", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setEmail("");
        setOtp("");
        setNewPassword("");
        setOtpSent(false);
        setOtpMatched(false);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div id="app">
        <section className="section">
          <div className="container mt-5">
            <div className="row">
              <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="text-center">Password Reset</h3>
                  </div>
                  <div className="card-body">
                    {otpMatched ? (
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                          <label htmlFor="newPassword">New Password:</label>
                          <input
                            type="password"
                            id="newPassword"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                        >
                          Set New Password
                        </button>
                        <div className="mt-4 text-muted text-center">
                          <Link to="/signin">Login</Link>
                        </div>
                      </form>
                    ) : otpSent ? (
                      <form onSubmit={handleOtpSubmit} className="otp-form">
                        <div className="form-group">
                          <label htmlFor="otp">OTP:</label>
                          <input
                            type="text"
                            id="otp"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Submit OTP
                        </button>
                        <div className="mt-4 text-muted text-center">
                          <Link to="/signin">Login</Link>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                          <label htmlFor="email">Email:</label>
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn btn-primary btn-lg btn-block"
                          type="submit"
                        >
                          Send OTP
                        </button>
                        <div className="mt-4 text-muted text-center">
                          <Link to="/signin">Login</Link>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
