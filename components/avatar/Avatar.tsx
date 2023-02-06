import React from "react";

export const Avatar = ({
  imageUrl,
  setDropDownOpen,
}: {
  imageUrl: string;
  setDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      onClick={() => setDropDownOpen((prev) => !prev)}
      className="cursor-pointer"
    >
      <div className="w-8 h-8 border-2 border-white shadow-md rounded-full overflow-hidden">
        <img
          src={imageUrl ? imageUrl : "/assets/profile-blank.png"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
