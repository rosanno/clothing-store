import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import AuthLayout from "../../components/Layout/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import axiosClient from "../../config/axiosClient";

interface Inputs {
  confirm_password: string;
  password: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const query: any = router.query;
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
  const [passwordValidationMessage, setPasswordValidationMessage] =
    useState("");
  const [matchMessage, setMatchMessage] = useState("");

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

  const verificationToken = () => {
    const token = query.resetCode
      .slice(1)
      .map((el: string, index: number) =>
        index === query.resetCode.slice(1).length - 1 ? el : el + "/"
      )
      .join("");

    return token;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (password !== data.confirm_password) {
        setMatchMessage("Passwords do not match.");
      } else {
        const res = await axiosClient.patch("users/reset-password", {
          password: data.password,
          resetToken: verificationToken(),
          userId: query.resetCode[0],
        });

        if (res.status === 200) {
          router.push(res.data.redirect);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (password) {
      validatePassword(password);
    }
  }, [password]);

  return (
    <div className="w-[450px] mx-auto pt-28">
      <div className="mt-10">
        <h1 className="text-3xl font-poppins font-medium">Reset Password</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="flex flex-col">
          <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
            New Password
          </label>
          <Controller
            defaultValue=""
            name="password"
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
        <button
          type="submit"
          className="bg-[#1C2534] w-full text-white py-2 rounded-md mt-6 font-poppins"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

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
