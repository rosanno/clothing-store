import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import Meta from "../components/Meta";
import { AiFillCheckCircle } from "react-icons/ai";
import Link from "next/link";

const Success = () => {
  return (
    <MainLayout>
      <Meta title="Checkout success" />
      <div className="flex flex-col items-center space-y-5 mt-48">
        <AiFillCheckCircle size={60} className="text-green-600" />
        <h1 className="text-4xl text-green-800 font-poppins font-semibold">
          Thank you for your order!
        </h1>
        <Link
          href="/Shop"
          className="bg-green-700 hover:bg-green-800 transition-all duration-500 text-white font-poppins rounded-md px-4 py-2"
        >
          Shop more
        </Link>
      </div>
    </MainLayout>
  );
};

export default Success;
