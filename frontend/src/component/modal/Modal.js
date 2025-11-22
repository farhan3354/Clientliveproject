import React, { useEffect, useState } from "react";
// import { useQuery } from "react-query";
import CustomModal from "./compo";
import img1 from "./7265607.jpg";
import { useSpring, animated } from "react-spring";
import UserDash from "../mbaUsers/dashboard";
import { useQuery } from "react-query";
const Appp = ({ Points, loggingFuc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonBgColor, setButtonBgColor] = useState("white");
  const [points, setpoints] = useState("Counting...");
  const closeModal = () => {
    setIsOpen(false);
  };

  const { data, loading, error } = useQuery("pointsdata", async () => {
    const currentUrl = window.location.href;
    const userIdFromUrl = currentUrl.split("/").pop();
    const response = await fetch(
      `https://mastery.masterybrandambassador.com/get24hourspoints/${userIdFromUrl}`
    );
    const data = await response.json();

    return data;
  });

  useEffect(() => {
    setIsOpen(true);

    if (data) setpoints(data.points);
    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  }, [data]);

  const animationProps = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 200, friction: 12 },
  });

  return (
    <div id="app">
      <UserDash isLoggedIn={loggingFuc}></UserDash>
      <div className="main-content">
        <CustomModal isOpen={isOpen} onRequestClose={closeModal}>
          <animated.div style={animationProps}>
            {/* Your celebration animation content */}
            <img
              src={img1}
              alt="Celebration Animation"
              style={{ width: "1000px", height: "490px" }}
            />
          </animated.div>
          <h2 style={{ fontFamily: "Cursive", textAlign: "center" }}>
            You have got {points} Points in the last 24 hours
          </h2>
          <button
            onClick={closeModal}
            style={{
              display: "block",
              margin: "0 auto",
              border: "2px solid grey",
              padding: "4px 30px",
              background: buttonBgColor,
              color: "black",
              borderRadius: "5px",
            }}
            onMouseEnter={() => {
              setButtonBgColor("green");
            }}
            onMouseLeave={() => {
              setButtonBgColor("white");
            }}
          >
            Close
          </button>
        </CustomModal>
      </div>
    </div>
  );
};

export default Appp;
