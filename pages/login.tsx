import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import AuthLayout from "../components/Layout/AuthLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import Meta from "../components/Meta";

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const status = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/",
    });

    if (status.status === 401) {
      toast.error(status.error, {
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

    if (status.ok) router.push(status.url);
  };

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
        <div className="mt-10 text-center">
          <h1 className="text-3xl font-poppins font-medium">Welcome back</h1>
          <p className="text-lg text-gray-400 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
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
          <div className="flex flex-col">
            <label className="text-sm font-poppins font-medium mb-2 mt-5 text-gray-500">
              Password
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
          </div>
          <div className="float-right pt-1">
            <Link
              href="/forgotpassword"
              className="text-sm underline text-blue-600 font-poppins"
            >
              Forgot password
            </Link>
          </div>
          <button
            type="submit"
            className="bg-[#1C2534] w-full text-white py-2 rounded-md mt-6 font-poppins"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6">
          <button
            className="flex items-center justify-center gap-4 w-full ring-1 ring-gray-300 rounded-md py-2 font-poppins font-medium text-gray-500 hover:bg-gray-100 transition-all duration-300"
            onClick={() =>
              signIn("google", { callbackUrl: "http://localhost:3000" })
            }
          >
            <img src="/assets/google.svg" alt="" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          don't have an account yet?{" "}
          <Link href={"/signup"}>
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;

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
