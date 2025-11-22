import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import GetLink from "../apiLink";
import { Toast } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const PasswordChange = ({ id }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChange = () => {
    // Validate the inputs
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }

    if (newPassword === confirmPassword && newPassword === currentPassword) {
      setErrorMessage("New password cannot be same as old password");
      return;
    }

    const userId = id;

    fetch(`${GetLink()}/passwordChange/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          toast.success("Password Changed");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrorMessage("");
        } else {
          // Handle error response
          setErrorMessage("Current password is wrong");
        }
      })
      .catch((error) => {
        // Handle network error
        console.error(error);
      });
  };

  async function getmailstatusfunc() {
    const userId = id;
    const res = await axios.get(`${GetLink()}/getmailstatus/${userId}`);
    return res.data.mailNotification;
  }

  const [emailStatus, setEmailStatus] = useState("");

  useEffect(() => {
    getmailstatusfunc().then((data) => {
      if (data) setEmailStatus("Enable");
      else setEmailStatus("Disable");
    });
  }, []);

  const toggleStaus = async () => {
    const userId = id;
    const res = await axios.get(`${GetLink()}/toggleMailStatus/${userId}`);
    if (res.data === "Done")
      setEmailStatus((prev) => {
        if (prev === "Enable") return "Disable";
        else return "Enable";
      });
    toast.success("Mail status updated", emailStatus);
  };

  return (
    <div className="changePassword">
      <ToastContainer></ToastContainer>
      <h2>Password Change</h2>
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button onClick={handlePasswordChange}>Change Password</button>
      <h3 style={{ marginTop: "20px" }}>Report Through Mail</h3>
      <p>
        Current Status:{emailStatus === "Enable" ? " Enable" : " Disable"}
        <button onClick={toggleStaus} style={{ marginTop: "10px" }}>
          {emailStatus === "Enable" ? "Disable" : "Enable"}
        </button>
      </p>
    </div>
  );
};

export default PasswordChange;
