import React from "react";
import { useTrail, animated, useSpring, easings } from "@react-spring/web";
import CustomButton from "../CustomButton/CustomButton";
import Link from "next/link";

const Hero = () => {
  const springs = useSpring({
    config: {
      mass: 5,
      friction: 120,
      tension: 120,
      easing: easings.steps(5),
    },
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <div className="w-full h-[85vh] relative">
      <animated.img
        src="assets/banner-1.jpg"
        alt=""
        className="w-full h-full object-cover"
        style={{
          ...springs,
        }}
      />
      <div className="w-full md:max-w-[1240px] mx-auto">
        <animated.div
          className="absolute top-[35%] md:top-[30%] px-5 z-[2]"
          style={{ ...springs }}
        >
          <h1 className="text-3xl md:text-5xl text-white capitalize font-poppins font-semibold">
            find your new favorite
          </h1>
          <h1 className="text-3xl md:text-5xl md:mt-2 text-white capitalize font-poppins font-semibold">
            collection at spring
          </h1>
          <h1 className="text-3xl md:text-5xl md:mt-2 text-white capitalize font-poppins font-semibold">
            sale 2023
          </h1>
          <Link href="/Shop">
            <CustomButton style="bg-[#1C2534] capitalize text-white px-6 py-2 mt-7 text-sm">
              shop now
            </CustomButton>
          </Link>
        </animated.div>
      </div>

      <div className="absolute w-full h-full top-0 bg-black/20" />
    </div>
  );
};

export default Hero;
