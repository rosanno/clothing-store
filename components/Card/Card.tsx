import React from "react";
import { BsArrowRight } from "react-icons/bs";

const Card = ({
  imgSrc,
  styles,
  heading,
  subHeading,
  headingFontSize,
  subHeadingFontSize,
}: {
  imgSrc: string;
  styles: string;
  heading: string;
  subHeading: string;
  headingFontSize?: string;
  subHeadingFontSize?: string;
}) => {
  return (
    <div className={`${styles} relative overflow-hidden`}>
      <img
        src={imgSrc}
        alt=""
        className="w-full h-full object-cover filter brightness-75 hover:scale-110 transition-all duration-300 cursor-pointer"
      />

      <div className="absolute bottom-8 px-3 cursor-pointer">
        <h2 className={`text-white ${headingFontSize} font-semibold`}>
          {heading}
        </h2>
        <p className={`text-white ${subHeadingFontSize} mt-2`}>{subHeading}</p>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-white text-sm">View Catalog</span>
          <BsArrowRight size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default Card;
