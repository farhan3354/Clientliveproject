import React from "react";
import ReactLoading from "react-loading";

export default function LoadingSpinner() {
  const spinnerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  return (
    <div style={spinnerStyle}>
      <ReactLoading type="spin" color="#7a117a" height={100} width={50} />
      {/* <ReactLoading type="spokes" color="#7a117a" height={100} width={50} />
      <ReactLoading type="spinningBubbles" color="#7a117a" height={100} width={50} /> */}
    </div>
  );
}
