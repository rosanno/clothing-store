import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import Meta from "../components/Meta";
import RatingModal from "../components/Modal/RatingModal";
import prisma from "../lib/prisma";
import { authOptions } from "./api/auth/[...nextauth]";

interface Order {
  Products: Products;
  size: string;
  quantity: number;
}

const Order = ({ orders, userId, review }) => {
  const [openModal, setOpenModal] = useState(false);
  const [productId, setProductId] = useState(0);

  const onOpenModal = (productId: number) => {
    setProductId(productId);
    setOpenModal(true);
  };

  return (
    <MainLayout>
      <Meta title="Orders" />
      <div className="bg-gray-100 h-screen overflow-hidden">
        <div className="w-full md:max-w-[1140px] mx-auto  px-5 py-10 mt-10">
          <h1 className="text-2xl font-poppins font-semibold">Orders</h1>
          <div className="mt-5">
            {orders[0].products.map((order: Order) => (
              <div key={order.Products.id} className="py-2">
                <div className="flex justify-between w-full bg-white shadow-sm rounded-md py-5 px-10">
                  <div className="flex w-[250px] gap-4">
                    <div className="w-[50px]">
                      <img
                        src={order.Products.productImg}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-poppins font-medium">
                        {order.Products.name}
                      </p>
                      <span className="text-sm capitalize text-gray-400 font-poppins">
                        Size:{order.size}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-poppins">
                      {parseFloat(order.Products.price).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-poppins text-gray-500">
                      Qty: {order.quantity}
                    </span>
                  </div>
                  <div>
                    {review[0].Products.id === order.Products.id ? (
                      <span className="p-1 px-7 rounded-full block cursor-default"></span>
                    ) : (
                      <button
                        onClick={() => onOpenModal(parseInt(order.Products.id))}
                        className="text-xs font-poppins ring-1 ring-orange-300 bg-orange-400/10 text-orange-500 p-1 px-3 rounded-full block"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RatingModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        productId={productId}
        userId={userId}
      />
    </MainLayout>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessions: Sessions = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let orders;

  if (!sessions) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    orders = await prisma.orders.findMany({
      where: {
        userId: sessions.user.id,
      },
    });

    const review = await prisma.review.findMany({
      where: {
        userId: sessions.user.id,
      },
      include: {
        Products: true,
      },
    });

    console.log(review);

    return {
      props: {
        orders,
        userId: sessions.user.id,
        review,
      },
    };
  }
};
