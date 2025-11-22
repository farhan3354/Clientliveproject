import React, { useState, useEffect } from "react";
import GetLink from "../apiLink";
const UserProfile = ({ id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [emailError, setEmailError] = useState("");

  const handleEditClick = () => {
    if (isEditing) setIsEditing(false);
    else setIsEditing(true);
  };

  useEffect(() => {
    // Fetch the user data based on the provided ID
    const userId = id;

    fetch(`${GetLink()}/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setEditedUser(data);
      })
      .catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
  }, []);

  const handleSaveClick = () => {
    const userId = id;

    // Validate email format
    if (!validateEmail(editedUser.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Make a request to update the user profile
    fetch(`${GetLink()}/edituser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedUser),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          setUser(editedUser);

          setIsEditing(false);
        } else {
          // Handle error response
          console.error("Failed to update user profile");
        }
      })
      .catch((error) => {
        // Handle network error
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    if (e.target.name === "phoneNumber") {
      // Remove non-digit characters from the phone number
      const formattedPhoneNumber = e.target.value.replace(/[^\d()+]/g, "");
      setEditedUser({ ...editedUser, [e.target.name]: formattedPhoneNumber });
    } else {
      setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?\d+([\s-]?\d+)*$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content edit-page">
      <div className="page_head">
        <h2>User Profile</h2>
        <button className="edit_btn" onClick={handleEditClick}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <div className="edit_form">
          <div className="form_elem">
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form_elem">
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={editedUser.city}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={editedUser.state}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form_elem">
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={editedUser.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div></div>
          </div>

          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="user_info">
          <div className="comon_dv">
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
          </div>
          <div className="comon_dv">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phoneNumber}
            </p>
          </div>
          <div className="comon_dv">
            <p>
              <strong>City:</strong> {user.city}
            </p>
            <p>
              <strong>State:</strong> {user.state}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
