import React from "react";
import { BsLinkedin } from "react-icons/bs";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex items-center justify-between bg-[#1C2534] py-6 px-5">
      <span className="text-sm text-gray-400 font-semibold">
        &#169; 2023 - <span className="font-dancingscript">Clothing</span>
      </span>
      <div className="flex items-center gap-5">
        <BsLinkedin size={20} className="text-white" />
        <AiFillFacebook size={25} className="text-white" />
        <FaGithubSquare size={25} className="text-white" />
        <AiFillInstagram size={30} className="text-white" />
        <AiFillTwitterSquare size={25} className="text-white" />
      </div>
    </div>
  );
};

export default Footer;
