import React, { useState } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/EmailMba.css";
import GetLink from "../apiLink";
export default function EmailMba() {
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    const inputText = event.target.value;

    // Replace **word** with <strong>word</strong> for bold formatting
    const boldFormattedText = inputText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Replace new lines with <br> for line breaks
    const lineBreakFormattedText = boldFormattedText.replace(/\n/g, "<br>");

    setEmailMessage(lineBreakFormattedText);
  };

  const handleClearClick = () => {
    confirmAlert({
      title: "Confirm Clear",
      message: "Are you sure you want to clear the email message?",
      buttons: [
        {
          label: "Yes",
          onClick: () => setEmailMessage(""),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleSend = () => {
    setLoading(true);

    axios
      .post(GetLink() + "/sendMailtomba", {
        message: emailMessage,
      })
      .then((response) => {
        setLoading(false);
        toast.success(response.data);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("An error occurred while sending the email.");
      });
  };

  return (
    <div className="main-content">
      <ToastContainer></ToastContainer>
      <div className="email-container">
        <h2 className="email-subject">Compose Your Email</h2>
        <textarea
          className="email-input"
          placeholder="Type your email"
          value={emailMessage}
          onChange={handleInputChange}
        />
        <button
          disabled={loading}
          className={`send-button ${loading ? "disabled" : ""}`}
          onClick={handleSend}
        >
          Send Email
        </button>
        <button
          disabled={loading}
          className="send-button2"
          onClick={handleClearClick}
        >
          Clear
        </button>
        <p></p>
        <h2 className="email-subject">View on Email</h2>
        <div
          className="email-message"
          dangerouslySetInnerHTML={{ __html: emailMessage }}
        />
      </div>
    </div>
  );
}
