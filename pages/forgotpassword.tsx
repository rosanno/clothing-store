import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axiosClient from "../config/axiosClient";

interface Inputs {
  email: string;
}

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await axiosClient.post("users/forgot-password", data);

      if (res.status === 200) {
        toast.success("Check you email we send a link to reset your password", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[450px] mx-auto pt-36">
      <div className="mt-10">
        <h1 className="text-2xl font-poppins font-medium">Forgot Password</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="flex flex-col">
          <label className="text-sm font-poppins font-medium mb-2 text-gray-500">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required." })}
            placeholder="Enter your email"
            className={`ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
              errors.email && "border border-rose-600"
            }`}
          />
        </div>
        <button
          type="submit"
          className="bg-[#1C2534] w-full text-white py-2 rounded-md mt-6 font-poppins"
        >
          Send Reset Code
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
