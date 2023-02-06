import React from "react";

const CustomButton = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: string;
}) => {
  return (
    <button
      className={`${style} hover:bg-[#131922] transition-all duration-300`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
