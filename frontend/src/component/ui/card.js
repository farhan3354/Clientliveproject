import React from "react";

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children }) => {
  return <div className="text-xl font-semibold mb-4">{children}</div>;
};

const CardContent = ({ children }) => {
  return <div>{children}</div>;
};

export { Card, CardHeader, CardContent };
