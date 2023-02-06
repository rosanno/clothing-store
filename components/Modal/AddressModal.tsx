import React from "react";
import ModalLayout from "./ModalLayout";
import { AiFillHome } from "react-icons/ai";
import { BiError } from "react-icons/bi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { useForm, SubmitHandler } from "react-hook-form";
import axiosClient from "../../config/axiosClient";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";

type Inputs = {
  house: string;
  province: string;
  city: string;
  village: string;
  label: string;
};

const AddressModal = ({
  openModal,
  setOpenModal,
  userId,
  address,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: string;
  address?: any;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: address,
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!address) {
      try {
        const newData = { ...data, userId };
        const res = await axiosClient.post("users/address", { data: newData });
        if (res.status === 201) {
          reset();
          toast.success(res.data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setOpenModal(false);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await axiosClient.patch("users/address", { data });

        if (res.status === 200) {
          toast.success(res.data.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          router.push(router.asPath);
          setOpenModal(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <ModalLayout openModal={openModal} setOpenModal={setOpenModal}>
      <div className="py-7">
        <h1 className="text-base font-poppins font-semibold">
          Add New Shipping / Billing Address
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} action="" className="mt-3">
        <div className="flex flex-col">
          <label className="text-xs text-[#1B2F3F] pb-2 font-poppins font-medium">
            House/Unit/Flr #, Bldg Name, Blk or Lot #
          </label>
          <input
            type="text"
            name="house"
            {...register("house", { required: "Field is required" })}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
          {errors.house && (
            <p className="flex items-center gap-1 text-sm text-rose-500 mt-2">
              <BiError size={18} />
              {errors.house.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs text-[#1B2F3F] pb-2 font-poppins font-medium">
            Province
          </label>
          <input
            type="text"
            name="province"
            {...register("province", { required: "Field is required" })}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
          {errors.province && (
            <p className="flex items-center gap-1 text-sm text-rose-500 mt-2">
              <BiError size={18} />
              {errors.province.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs text-[#1B2F3F] pb-2 font-poppins font-medium">
            City/Municipality
          </label>
          <input
            type="text"
            name="city"
            {...register("city", { required: "Field is required" })}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
          {errors.city && (
            <p className="flex items-center gap-1 text-sm text-rose-500 mt-2">
              <BiError size={18} />
              {errors.city.message}
            </p>
          )}
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs text-[#1B2F3F] pb-2 font-poppins font-medium">
            Village
          </label>
          <input
            type="text"
            name="village"
            {...register("village", { required: "Field is required" })}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
          {errors.village && (
            <p className="flex items-center gap-1 text-sm text-rose-500 mt-2">
              <BiError size={18} />
              {errors.village.message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-8">
          <label className="pointer">
            <input
              type="radio"
              className="peer sr-only"
              name="label"
              value="office"
              {...register("label")}
            />
            <div className="flex items-center gap-3 cursor-pointer bg-gray-300/20 transition-all shadow-md ring-1 ring-sky-500 peer-checked:ring-cyan-500 rounded-md py-3 px-4 text-gray-500 peer-checked:text-sky-600">
              <BsFillBriefcaseFill size={16} />
              <span className="text-sm uppercase font-poppins font-medium">
                Office
              </span>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              className="peer sr-only"
              name="label"
              value="home"
              {...register("label")}
            />
            <div className="flex items-center gap-3 bg-gray-300/20 transition-all shadow-md ring-1 ring-sky-500 peer-checked:ring-cyan-500 rounded-md py-3 px-4 text-gray-500 peer-checked:text-sky-600">
              <AiFillHome size={16} />
              <span className="text-sm uppercase font-poppins font-medium">
                Home
              </span>
            </div>
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="bg-[#1B2F3F] text-white text-sm font-poppins px-4 py-2 my-10 float-right hover:bg-[#254763] rounded-md transition-all duration-300"
          >
            {address ? "update" : "save"}
          </button>
          <button
            onClick={() => setOpenModal(false)}
            className="bg-[#1B2F3F] mr-2 text-white text-sm font-poppins px-4 py-2 my-10 float-right hover:bg-[#254763] rounded-md transition-all duration-300"
          >
            cancel
          </button>
        </div>
        <ToastContainer />
      </form>
    </ModalLayout>
  );
};

export default AddressModal;
