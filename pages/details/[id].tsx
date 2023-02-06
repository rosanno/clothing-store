import React, { useState, useContext } from "react";
import CustomButton from "../../components/CustomButton/CustomButton";
import MainLayout from "../../components/Layout/MainLayout";
import { GrFormSubtract } from "react-icons/gr";
import { MdAdd } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";

import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import axiosClient from "../../config/axiosClient";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import RatingIcon from "../../components/Rating/RatingIcon";
import Meta from "../../components/Meta";
import Rated from "../../components/Rating/Rated";

TimeAgo.addDefaultLocale(en);

interface Props {
  product: Products;
}

interface Session {
  expires: string;
  user: User;
}

const ProductDetails = ({ product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const router = useRouter();
  const { id } = useRouter().query;
  const { data: sessions, status }: any = useSession();
  const { getItems } = useContext(CartContext);
  const timeAgo = new TimeAgo("en-US");

  const handleFovorites = async () => {
    try {
      if (status !== "unauthenticated") {
        await axiosClient.post("users/favorite", { productId: id });
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (sessions) {
        const itemData = {
          productId: id,
          userId: sessions.user.id,
          quantity,
          size,
          price: parseFloat(product.price),
        };
        const item = await axiosClient.post("users/cart", itemData);

        if (item.status === 201) {
          getItems();
          toast.success(item.data.msg, {
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
      } else {
        router.replace("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <Meta title={`${product?.name}`} />
      <div className="flex flex-col w-full h-full md:max-w-[1240px] mx-auto px-5 pt-20 pb-28">
        <div className="md:flex justify-center gap-16">
          <div className="w-full md:w-[380px]">
            <img
              src={`${product?.productImg}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full max-w-[690px] mt-6 md:mt-0">
            <h1 className="text-2xl text-[#3ca298] md:text-3xl font-poppins font-semibold pb-2">
              {product?.name}
            </h1>
            <div className="pb-5">
              <p className="text-sm text-gray-400 font-poppins">
                Review{" "}
                <span className="text-xs">({product?.review.length})</span>
              </p>
            </div>
            <span className="text-lg font-poppins">
              ${parseFloat(product?.price).toLocaleString()}
            </span>
            <div className="mt-4">
              <h2 className="text-base text-gray-500 font-medium font-poppins pb-3">
                Description
              </h2>
              <p className="font-poppins text-sm leading-6 text-gray-500">
                {product?.description}
              </p>
            </div>
            <div className="mt-10">
              <h2 className="pb-3 font-poppins text-sm text-gray-500">
                Choose Size:
              </h2>
              <div className="flex items-center gap-5">
                {product?.size.map((s) => (
                  <div
                    key={s.id}
                    className={`border w-10 px-2 py-1 ring-gray-100 ring-1 rounded-md text-xs uppercase text-center font-poppins font-medium cursor-pointer ${
                      s.size === size && "bg-[#1D2C3B] text-white"
                    } transition-all duration-300`}
                    onClick={() => setSize(s.size)}
                  >
                    {s.size}
                  </div>
                ))}
              </div>
              <div>
                <h2 className="pt-5 pb-2 font-poppins text-sm text-gray-500">
                  Colors:
                </h2>
                <div>
                  <select className="text-xs font-poppins outline-none ring-1 ring-gray-300 rounded-md p-1">
                    {product?.color.map((c) => (
                      <option key={c.id} value={`${c.color}`}>
                        {c?.color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="pb-3 mt-7 font-poppins text-sm">Quantity</h2>
              <div className="flex items-center gap-2 border rounded-md w-fit ring-gray-400 ring-1 overflow-hidden">
                <button
                  className="px-4 py-3 hover:bg-gray-200"
                  onClick={() => setQuantity((prev) => prev - 1)}
                  disabled={quantity <= 1 ? true : false}
                >
                  <GrFormSubtract size={11} />
                </button>
                <span>{quantity}</span>
                <button
                  className="px-4 py-3 hover:bg-gray-200"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <MdAdd size={11} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-16 md:mt-auto">
              <button
                className="bg-[#1D2C3B] rounded-md px-3"
                onClick={handleFovorites}
              >
                <AiOutlineHeart size={20} className="text-white" />
              </button>
              <div className="w-full" onClick={handleAddToCart}>
                <CustomButton style="bg-[#1D2C3B] w-full max-w-[260px] text-white py-2 rounded-md capitalize">
                  add to Bag
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:max-w-[1240px] mx-auto px-5 pt-20 pb-28">
        <div className="border-b py-2">
          <h1 className="text-xl font-poppins">Ratings & Reviews</h1>
        </div>
        {product?.review.length !== 0 ? (
          <div className="px-2 mt-3">
            {product?.review.map((review) => (
              <div
                key={review.id}
                className="flex items-center py-5 border-b last:border-b-0"
              >
                <div className="flex flex-1 gap-2">
                  <div className="w-10 h-10">
                    <img
                      src={review.user.image}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 font-poppins">
                        {review.user.name}
                      </p>
                      <span className="text-xs text-gray-500 font-poppins">
                        {timeAgo.format(new Date(review.createdAt))}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 py-1">
                      <Rated count={5} rating={review.rating} />
                    </div>
                    <p className="text-xs mt-1 font-poppins">{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center mt-20">
            <h1 className="text-4xl text-gray-400 font-poppins font-semibold">
              No Reviews
            </h1>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetails;

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await prisma.products.findMany();

  const paths = products.map((product) => {
    return {
      params: { id: product.id.toString() },
    };
  });

  return {
    paths, // can also be true or 'blocking'
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params }: any = context;
  const productDetails = await prisma.products.findUnique({
    where: {
      id: parseInt(params?.id),
    },
    include: {
      size: true,
      color: true,
      review: {
        include: {
          user: true,
        },
      },
    },
  });

  return {
    props: {
      product: productDetails,
    },
    revalidate: 1,
  };
};
