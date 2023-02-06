import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosClient from "../config/axiosClient";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  const onRequest = async () => {
    try {
      const res = await axiosClient.get("auth/request-verification", {
        params: {
          userId: userId.toString(),
        },
      });

      toast.success(res.data.msg, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (email === null && userId === null) {
      router.push("/");
    }
  }, [email, userId]);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    setUserId(localStorage.getItem("userId"));
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100">
      <div className="w-full max-w-[570px] h-[320px] mx-auto mt-24 rounded-md bg-white shadow-md">
        <div className="w-full flex flex-col items-center pt-6">
          <h1 className="text-xl text-slate-600 font-poppins font-medium">
            Please verify your email
          </h1>
          <div className="py-10 px-10 text-center">
            <p className="text-sm font-poppins">
              You're almost there! We sent an email to <b>{email}</b> to verify
              your email address. The link will be expire in 24 hours.
            </p>
          </div>
          <div className="mt-10 text-center space-y-5">
            <p className="text-sm text-slate-600 font-poppins">
              Still can't find the email?
            </p>
            <button
              onClick={onRequest}
              className="bg-slate-700 hover:bg-slate-900 transition duration-500 text-white py-2 px-4 rounded-md text-sm"
            >
              Resend Email
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Verify;
