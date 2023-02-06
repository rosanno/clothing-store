import { useRouter } from "next/router";
import React from "react";
import { ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div
      className={`px-10 ${
        router.pathname === "/signup" ? "pb-10 pt-4" : "pt-16"
      }`}
    >
      <Link href="/">
        <BsArrowLeft size={20} />
      </Link>
      <div className="flex flex-col md:flex-row-reverse w-full gap-10 md:max-w-4xl mx-auto">
        {children}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
