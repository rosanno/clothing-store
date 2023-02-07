import Link from "next/link";
import React, { useState, useEffect } from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import Meta from "../components/Meta";
import axiosClient from "../config/axiosClient";
import { Oval } from "react-loader-spinner";

interface Inputs {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Signup = () => {
  const router = useRouter();
  const [passwordValidationMessage, setPasswordValidationMessage] =
    useState("");
  const [matchMessage, setMatchMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const password = useWatch({
    control,
    name: "password",
  });
  const confirmPassword = useWatch({ control, name: "confirm_password" });
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (password === confirmPassword) {
        const res = await axiosClient.post("auth/signup", data, {
          headers: {
            Accecpt: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (res.status === 201) {
          localStorage.setItem("email", res.data.user.email);
          localStorage.setItem("userId", res.data.user.id);
          router.push("/verify");
        }
      } else {
        setMatchMessage("Passwords do not match.");
      }
    } catch (err) {
      toast.error(err.response.data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const validateMatch = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setMatchMessage("Passwords do not match.");
    } else {
      setMatchMessage("");
    }
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordValidationMessage(
        "Password must contain at least 8 characters, including one letter, number, and special character."
      );
    } else {
      setPasswordValidationMessage("");
    }
  };

  useEffect(() => {
    if (password) {
      validatePassword(password);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      validateMatch(password, confirmPassword);
    }
  }, [confirmPassword]);

  useEffect(() => {
    const firstError: any = Object.keys(errors).reduce((field, a) => {
      return !!errors[field] ? field : a;
    }, null);

    if (firstError) {
      setFocus(firstError);
    }
  }, [errors, setFocus]);

  return (
    <AuthLayout>
      <Meta title="Login" />
      <div className="flex flex-col items-center w-full">
        <div className="relative w-full">
          <div className="flex justify-center md:items-center md:h-[440px]">
            <img
              src="/assets/circle.svg"
              alt=""
              className="w-20 h-20 md:w-40 md:h-40"
            />
          </div>
          <div className="absolute top-10 md:top-56 h-full w-full bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20"></div>
        </div>
      </div>
      <div className="w-full">
        <div className="mt-10">
          <h1 className="text-3xl font-poppins font-semibold">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 text-gray-500">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required." })}
              className={`ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
                errors.name && "border border-rose-600"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
              Phone#
            </label>
            <Controller
              defaultValue=""
              name="phone"
              control={control}
              rules={{ required: "Phone is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={`ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
                    errors.phone && "border border-rose-600"
                  }`}
                />
              )}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
              Email
            </label>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <input
                  type="email"
                  {...field}
                  className={`ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
                    errors.email && "border border-rose-600"
                  }`}
                />
              )}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
              Password
            </label>
            <div className="relative">
              <Controller
                defaultValue=""
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className={`w-full ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
                      errors.password && "border border-rose-600"
                    }`}
                  />
                )}
              />
              {!showPassword ? (
                <BiHide
                  size={20}
                  className="absolute top-[10px] right-2 cursor-pointer text-gray-400 z-10"
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <BiShowAlt
                  size={20}
                  className="absolute top-[10px] right-2 cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(false)}
                />
              )}
            </div>
            {passwordValidationMessage && (
              <span className="text-xs font-poppins text-red-500 pt-2">
                {passwordValidationMessage}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
              Confirm Password
            </label>
            <Controller
              defaultValue=""
              name="confirm_password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <input
                  type="password"
                  {...field}
                  className={`ring-1 ring-gray-300 rounded-md py-2 px-3 outline-none ${
                    errors.password && "border border-rose-600"
                  }`}
                />
              )}
            />
            {matchMessage && (
              <p className="text-xs font-poppins text-red-500 pt-2">
                {matchMessage}
              </p>
            )}
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Oval
                height={25}
                width={25}
                color="#9387d4"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#28b1ec"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : (
            <span className="block py-1">Sign up</span>
          )}
        </form>
        <p className="text-gray-400 text-sm mt-2">
          Have an account?{" "}
          <Link href={"/login"}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
