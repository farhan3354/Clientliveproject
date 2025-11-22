// ReferralProgram.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentLoaderCompo from "../contentloader";
import Getlink from "../apiLink";

const ReferralProgram = () => {
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferralLink = async () => {
      try {
        const response = await fetch(Getlink() + "/generateReferralLink", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setReferralLink(data.referralLink);
        } else if (response.status === 401) {
          navigate("/signin");
        } else {
          setError("Failed to fetch referral link.");
        }
      } catch (error) {
        setError("Error fetching referral link.");
      } finally {
        setLoading(false);
      }
    };

    fetchReferralLink();
  }, [navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast("✅ Referral Link Copied to Clipboard!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "color_green",
      });
    }).catch(() => {
      toast.error("Failed to copy link.");
    });
  };

  return (
    <div className="main-content">
      <ToastContainer />
      <h4 className="program_details_heading">🎉 Earn Rewards by Sharing!</h4>
      {loading && <ContentLoaderCompo />}
      {loading === false && error && <p>{error}</p>}
      {loading === false && !referralLink && (
        <div className="r_detail">No referral link available.</div>
      )}
      {loading === false && referralLink && (
        <div className="referral_details">
          <div className="e_detail">
            <h4 className="program_name" style={{ padding: "10px 8px 0 8px" }}>
              Share Your Referral Link 🔗
            </h4>
            <p style={{ padding: "10px 8px 0 8px", fontSize: "16px" }}>
              Share the link below with friends, and earn rewards when they engage!
            </p>
            <p className="program_link" style={{ padding: "10px 8px" }}>
              <span style={{ width: "60%" }}>
                {referralLink}
              </span>{" "}
              <span
                className="copy_link"
                onClick={handleCopyLink}
                style={{ cursor: "pointer" }}
              >
                <i className="fi fi-sr-copy-alt"></i> Copy Link
              </span>
            </p>
            <div
              className="points_clicks"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "15px",
                margin: "15px 0",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                🔥 How It Works:
              </p>
              <ul style={{ textAlign: "left", padding: "0 20px" }}>
                <li>
                  When your friend clicks on a program link, both of you earn <strong>25 points</strong>!
                </li>
                <li>
                  If they click on the second program link, you both get an additional <strong>25 points</strong>.
                </li>
                <li>🔄 Earn rewards every time they participate in program activities!</li>
              </ul>
              <p style={{ marginTop: "10px", fontSize: "14px" }}>
                🎯 The more they engage, the more points you both earn!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralProgram;
