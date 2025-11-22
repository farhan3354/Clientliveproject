import React from "react";
import CountUp from "react-countup";

const CountUpComponent = ({ end }) => {
  // Function to format the number with a "K" for thousands
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num + "+";
  };

  return (
    <CountUp
      className="countup"
      end={end}
      formattingFn={formatNumber} // Pass the formatting function to CountUp
    />
  );
};

export default CountUpComponent;
