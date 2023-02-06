import React from "react";
import { TailSpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="absolute bg-black/10 backdrop-blur-sm w-full h-screen flex justify-center items-center overflow-hidden z-50">
      <TailSpin
        height="80"
        width="80"
        color="#1C2534"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
