import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import prisma from "../lib/prisma";
import { authOptions } from "./api/auth/[...nextauth]";
import { BsFillTrashFill } from "react-icons/bs";
import axiosClient from "../config/axiosClient";
import { useRouter } from "next/router";
import NotFound from "../components/NotFound";
import Meta from "../components/Meta";

interface Favorites {
  id: number;
  productsId: string;
  userId: string;
  isFavorite: boolean;
  products: Products;
}

interface Products {
  id: number;
  name: string;
  description: string;
  price: string;
  productImg: string;
  color: Color[];
  size: Size[];
}

interface Size {
  size: string;
}

interface Color {
  color: string;
}

const Favorite = ({ favorites }) => {
  const router = useRouter();

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const res = await axiosClient.delete("users/favorite", {
        data: { productId },
      });

      if (res.status === 200) {
        router.push(router.asPath);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <Meta title="Favorite" />
      <div className="w-full md:max-w-[1140px] mx-auto px-5 py-10 mt-10">
        <h1 className="text-2xl font-poppins font-semibold">Wish List</h1>
        {favorites.length !== 0 ? (
          <div className="mt-6">
            {favorites.map((favorite: Favorites) => (
              <div
                key={favorite.id}
                className="py-4 border-t hover:bg-gray-100 flex justify-between items-center"
              >
                <Link
                  href={`details/${favorite.productsId}`}
                  className="flex-1"
                >
                  <div className="flex gap-4">
                    <div className="w-24">
                      <img
                        src={favorite.products.productImg}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-base md:text-lg text-gray-400 font-poppins">
                        {favorite.products.name}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <p className="text-sm text-gray-400 font-poppins font-normal">
                          Size:
                        </p>
                        <div className="flex items-center gap-1">
                          {favorite.products.size.map((s) => (
                            <p
                              key={s.size}
                              className="text-xs text-gray-400 font-poppins font-normal"
                            >
                              {s.size}
                            </p>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 font-poppins font-medium pt-2 mt-auto">
                        {parseInt(favorite.products.price).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
                <div
                  className="px-10 cursor-pointer"
                  onClick={() => handleRemoveFavorite(favorite.productsId)}
                >
                  <BsFillTrashFill size={20} className="text-rose-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NotFound>WISH LIST IS EMPTY</NotFound>
        )}
      </div>
    </MainLayout>
  );
};

export default Favorite;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessions: Sessions = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!sessions) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const favorites = await prisma.favorites.findMany({
      where: {
        user: {
          id: sessions.user.id,
        },
      },
      include: {
        products: {
          include: {
            color: true,
            size: true,
          },
        },
      },
    });

    return {
      props: {
        favorites,
      },
    };
  }
};
