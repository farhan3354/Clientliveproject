import React, { useState } from "react";
import GetLink from "../apiLink";
import { ToastContainer, toast } from "react-toastify";
const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handlePasswordChange = () => {
    // Validate the inputs
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage("New password cannot be the same as the old password");
      return;
    }
    setLoading(true);
    fetch(`${GetLink()}/passwordChange/null`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response

          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setErrorMessage("");
          setLoading(false);
          toast.success("Password changed");
        } else {
          setErrorMessage("Current password is incorrect");
          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error(error);
      });
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
      {errorMessage && (
        <div className="error" style={{ color: "red" }}>
          {errorMessage}
        </div>
      )}
      <button disabled={loading} onClick={handlePasswordChange}>
        Change Password
      </button>
    </div>
  );
};

export default PasswordChange;
