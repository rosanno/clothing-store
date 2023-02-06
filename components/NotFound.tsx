import React from "react";

const NotFound = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-5xl text-gray-400 uppercase font-poppins font-medium flex justify-center mt-36 w-full">
      <h2>{children}</h2>
    </div>
  );
};

export default NotFound;
