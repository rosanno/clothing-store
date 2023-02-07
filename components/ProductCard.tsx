import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import Link from "next/link";
import axiosClient from "../config/axiosClient";
import { useSession } from "next-auth/react";

const ProductCard = (props: Products) => {
  const router = useRouter();
  const ratings = 4.0;
  const { data: sessions, status }: any = useSession();
  const [loading, setLoading] = useState(false);

  const handleFovorites = async (productId: string) => {
    try {
      setLoading(true);
      if (status !== "unauthenticated") {
        console.log(status);
        await axiosClient.post("users/favorite", { productId });
        router.push(router.asPath);
      } else {
        router.push("/login");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      setLoading(true);
      const res = await axiosClient.delete("users/favorite", {
        data: { productId },
      });

      setLoading(false);
      if (res.status === 200) {
        router.push(router.asPath);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col">
      <Link href={`/details/${props.id}`} className="block">
        <div className="w-full h-[340px] overflow-hidden">
          <img
            src={props.productImg}
            alt=""
            className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
          />
        </div>
      </Link>
      <div className="flex justify-between py-4">
        <div className="w-[140px]">
          <h2 className="text-sm text-gray-500 font-poppins font-normal truncate">
            {props.name}
          </h2>
          <span className="text-sm text-gray-500 font-poppins font-normal pt-3 block">
            ${parseFloat(props.price).toLocaleString()}
          </span>
        </div>
        <div>
          {props.favorites?.isFavorite &&
          sessions?.user.id === props.favorites.userId ? (
            <button
              disabled={loading ? true : false}
              onClick={() => handleRemoveFavorite(props.id)}
            >
              <AiFillHeart size={20} className="text-rose-400" />
            </button>
          ) : (
            <button
              disabled={loading ? true : false}
              onClick={() => handleFovorites(props.id)}
            >
              <AiOutlineHeart
                size={20}
                className="text-gray-400 hover:text-rose-400"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
