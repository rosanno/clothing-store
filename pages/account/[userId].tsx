import axios from "axios";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import Modal from "../../components/Modal/Modal";
import axiosClient from "../../config/axiosClient";
import prisma from "../../lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import { AiOutlinePlus } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import AddressModal from "../../components/Modal/AddressModal";
import Meta from "../../components/Meta";

const Account = ({ user }) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    image: user.image,
    phone: user.phone,
    email: user.email,
  });
  const [imgPreview, setImgPreview] = useState(formData.image);

  const onSave = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData();
    data.append("file", imgPreview);
    data.append("upload_preset", "qog3g1oe");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dwl14dsh7/image/upload",
      data
    );

    try {
      const res = await axiosClient.patch("users/user", {
        ...formData,
        image: response.data.url,
      });
      if (res.status === 200) {
        setOpenModal(false);
        router.push(router.asPath);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const imagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <MainLayout>
      <Meta title={`${user.name}`} />
      <div className="w-full md:max-w-[1140px] mx-auto px-5 mb-5 mt-16">
        <h1 className="text-2xl font-poppins font-medium">Manage My Account</h1>
        <div className="flex flex-col md:flex-row gap-5 mt-10 w-full">
          <div className="bg-white shadow-md border-t-2 border-cyan-500 rounded-sm px-4 pt-5 pb-14 w-full md:w-[420px] h-[210px]">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-poppins font-normal">
                Personal Profile
              </h2>
              <button
                onClick={() => setOpenModal(true)}
                className="text-cyan-600 hover:text-cyan-800 transition duration-200 font-poppins"
              >
                <BiEdit size={17} />
              </button>
            </div>
            <div className="mt-5">
              <p className="text-sm font-poppins">{formData.name}</p>
              <p className="text-sm font-poppins mt-2">{formData.email}</p>
            </div>
          </div>
          <div className="bg-white shadow-md border-t-2 border-cyan-500 rounded-sm px-4 pt-5 pb-14 w-full">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-poppins font-normal">Address</h2>
                <button
                  onClick={() => setEditModal(true)}
                  className="text-cyan-600 hover:text-cyan-800 transition duration-200 font-poppins"
                >
                  <BiEdit size={17} />
                </button>
              </div>
              <div
                className="bg-green-600 hover:bg-green-700 transition duration-300 p-[2px] cursor-pointer"
                onClick={() => setAddressModal(true)}
              >
                <AiOutlinePlus size={20} className="text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-500 font-poppins mt-5">
              DEFAULT SHIPPING ADDRESS
            </p>
            <p className="text-sm font-poppins font-bold mt-3">
              {formData.name}
            </p>
            <div className="mt-1">
              {user.address.map((add) => (
                <div key={add.id}>
                  <p className="text-xs font-poppins">{add.house}</p>
                  <p className="text-xs capitalize mt-1 font-poppins">
                    {add.province} - {add.city} - {add.village}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        formData={formData}
        openModal={openModal}
        setOpenModal={setOpenModal}
        imgPreview={imgPreview}
        imagePreview={imagePreview}
        onSave={onSave}
        onChange={onChange}
      />
      <AddressModal
        openModal={editModal}
        setOpenModal={setEditModal}
        address={user.address[0]}
      />
      <AddressModal
        openModal={addressModal}
        setOpenModal={setAddressModal}
        userId={user.id}
      />
    </MainLayout>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessions = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  const { userId } = context.query;

  if (!sessions) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId.toString(),
    },
    include: {
      address: true,
    },
  });

  return {
    props: {
      user,
    },
  };
};
