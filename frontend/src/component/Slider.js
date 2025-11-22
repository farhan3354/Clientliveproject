import React, { useState } from "react";

const Slider = () => {
  const [lowerValue, setLowerValue] = useState(1);
  const [upperValue, setUpperValue] = useState(5);

  const handleSubmit = () => {
    // Send the lower and upper values to the API as a POST request
    const data = { lowerValue, upperValue };
    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      // Handle the response from the API
    });
  };

  return (
    <div>
      <input
        type="range"
        min={1}
        max={5}
        value={lowerValue}
        onChange={(e) => setLowerValue(e.target.value)}
      />
      <input
        type="range"
        min={lowerValue + 1}
        max={5}
        value={upperValue}
        onChange={(e) => setUpperValue(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Slider;
