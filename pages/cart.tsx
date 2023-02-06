import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import React, { useContext, useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import prisma from "../lib/prisma";
import { authOptions } from "./api/auth/[...nextauth]";
import { BsTrash } from "react-icons/bs";
import CustomButton from "../components/CustomButton/CustomButton";
import { useRouter } from "next/router";
import { CartContext } from "../context/CartContext";
import NotFound from "../components/NotFound";
import axiosClient from "../config/axiosClient";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import Meta from "../components/Meta";

const Cart = ({ items }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { decreaseCart, cartCount, getItems } = useContext(CartContext);
  const { data: sessions }: any = useSession();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

  const refreshData = () => {
    router.push(router.asPath);
  };

  const handleDelete = async (id: number) => {
    try {
      const isDeleted = await axiosClient.delete("users/cart", {
        data: { id },
      });
      if (isDeleted) {
        refreshData();
        getItems();
        decreaseCart(id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const total = () =>
    items.reduce((acc: any, item: CartItems) => acc + item.total, 0);

  const subTotal = () =>
    items.reduce(
      (acc: any, item: CartItems) => acc + item.total * item.quantity,
      0
    );

  const totalQuantity = () =>
    items.reduce((acc: any, item: CartItems) => acc + item.quantity, 0);

  const createCheckoutSession = async (items: Products) => {
    const stripe = await stripePromise;

    setLoading(true);
    try {
      const checkoutSession = await axiosClient.post("create-stripe-session", {
        items,
        userId: sessions.user.id,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <Meta title="Cart" />
      <div className="w-full md:max-w-[1140px] mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row gap-10 flex-1 mt-7">
          {cartCount.length < 1 ? (
            <NotFound>Cart is empty</NotFound>
          ) : (
            <>
              <div className="border-gray-200 w-full h-fit max-h-[420px] border scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto overflow-y-scroll">
                <table className="w-full leading-normal">
                  <thead className="sticky top-0 shadow-sm bg-white text-xs font-semibold tracking-wider text-left px-5 py-3 hover:cursor-pointer uppercase">
                    <tr className="border-b border-gray">
                      <th
                        scope="col"
                        className="py-3 px-3 text-left text-xs font-poppins font-semibold uppercase tracking-wider"
                      >
                        Products
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-3 text-left text-xs font-poppins font-semibold uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-3 text-left text-xs font-poppins font-semibold uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: CartItems) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-100 hover:cursor-pointer"
                      >
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-900 text-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-20">
                              <img
                                src={item.Products.productImg}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-gray-900 text-sm font-poppins">
                                {item.Products.name}
                              </p>
                              <div className="flex items-center gap-1 pt-1">
                                <p className="text-xs text-gray-400 font-poppins font-medium">
                                  Size:
                                </p>
                                <p className="text-xs text-gray-400 font-poppins font-medium uppercase">
                                  {item.size}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-900 text-sm">
                          <span className="text-sm font-poppins">
                            {parseInt(item.Products.price).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: "USD",
                              }
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-900 text-sm">
                          <p className="text-gray-900 text-sm font-poppins whitespace-no-wrap">
                            {item.quantity}
                          </p>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-900 text-sm">
                          <span className="text-sm font-poppins">
                            ${item.total.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200 text-gray-900 text-sm">
                          <BsTrash
                            size={18}
                            className="text-rose-500"
                            onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-full md:w-[50%] bg-[#F9FAFC] h-fit rounded-md px-5">
                <h2 className="text-xl font-poppins font-medium pt-3">
                  Order summary
                </h2>
                <div className="flex items-center justify-between pb-4 pt-4">
                  <span className="text-[#5A5D67] text-sm font-poppins">
                    Subtotal({totalQuantity()})
                  </span>
                  <span className="text-sm font-poppins font-medium">
                    {total().toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t-2 pt-4">
                  <span className="font-poppins font-medium">Order total</span>
                  <span className="font-poppins font-medium">
                    {subTotal().toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
                <div onClick={() => createCheckoutSession(items)}>
                  <CustomButton style="bg-[#1C2534] w-full text-white py-2 rounded-md my-7">
                    {loading ? "Processing..." : "Checkout"}
                  </CustomButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: any = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    const items = await prisma.cartItems.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      include: {
        Products: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      props: {
        items,
      },
    };
  }
};
