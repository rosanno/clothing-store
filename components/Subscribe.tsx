import React from "react";
import { Avatars } from "../data/data";
import Animated from "./Animated/Animated";
import CustomButton from "./CustomButton/CustomButton";

const Subscribe = () => {
  return (
    <div className="relative pb-5 flex flex-col items-center justify-center h-[550px] bg-gradient-to-r from-black/10 via-white to-black/10">
      <Animated>
        <div className="w-full md:max-w-[1240px] mx-auto px-4 md:px-5">
          <h2 className="text-[#1C2534] text-3xl md:text-4xl font-poppins font-semibold text-center relative z-10">
            Grow your brand and
          </h2>
          <h2 className="text-[#1C2534] text-3xl md:text-4xl md:pb-4 font-poppins font-semibold text-center relative z-10">
            increase engagement with us.
          </h2>
        </div>
        <div className="flex justify-center">
          <CustomButton style="bg-[#1C2534] capitalize text-white px-6 py-2 mt-4 text-sm">
            subscribe now
          </CustomButton>
        </div>
      </Animated>

      {/* {Avatars.map(({ id, imgSrc, styles, icons }) => (
        <div key={id}>
          {imgSrc ? (
            <img src={imgSrc} className={styles} />
          ) : (
            <div className={styles}>{icons}</div>
          )}
        </div>
      ))} */}
    </div>
  );
};

export default Subscribe;
