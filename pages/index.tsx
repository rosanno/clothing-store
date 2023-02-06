import React from "react";
import Hero from "../components/Hero/Hero";
import { GetServerSideProps } from "next";
import { ImTruck } from "react-icons/im";
import { GrMoney } from "react-icons/gr";
import { IoHeadset } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import Card from "../components/Card/Card";
import Product from "../components/Product/Product";
import { Collections } from "../data/data";
import Subscribe from "../components/Subscribe";
import MainLayout from "../components/Layout/MainLayout";
import Animated from "../components/Animated/Animated";
import prisma from "../lib/prisma";
import Link from "next/link";
import Meta from "../components/Meta";

const Home = ({ products }: Props) => {
  return (
    <MainLayout>
      <Meta title="Home" />
      <Hero />
      <div className="w-full md:max-w-[1240px] mx-auto px-5 mt-20 md:mt-28">
        <Animated>
          <h1 className="text-2xl md:text-3xl py-10 font-poppins font-semibold">
            Collections
          </h1>
          <div className="space-y-5 md:space-y-0 md:gap-4 flex flex-col items-center md:flex-row">
            <Link href={{ pathname: "Shop", query: { category: "women" } }}>
              <Card
                imgSrc="assets/model-1.jpg"
                styles="w-full rounded-lg"
                headingFontSize="text-base md:text-xl"
                subHeadingFontSize="text-sm"
                heading="Woman's Clothing Catalog"
                subHeading="We have the latest and most complete catalog of clothes for woman"
              />
            </Link>

            <Link href={{ pathname: "Shop", query: { category: "men" } }}>
              <Card
                imgSrc="assets/model-2.jpg"
                styles="w-full rounded-lg"
                headingFontSize="text-base md:text-xl"
                subHeadingFontSize="text-sm"
                heading="Men's Clothing Catalog"
                subHeading="We have the latest and most complete catalog of clothes for men"
              />
            </Link>
          </div>
        </Animated>

        <Animated>
          <div className="flex flex-wrap justify-between gap-5 md:gap-0 mt-20 md:mt-28">
            <div className="flex items-center gap-3">
              <ImTruck size={25} />
              <div>
                <h3 className="text-sm md:text-base font-semibold">
                  Free Shipping
                </h3>
                <h4 className="text-xs md:text-sm text-slate-500">
                  Free delivery for all order
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GrMoney size={25} />
              <div>
                <h3 className="text-sm md:text-base font-semibold">
                  Money Guarantee
                </h3>
                <h4 className="text-xs md:text-sm text-slate-500">
                  30 days money back
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IoHeadset size={25} />
              <div>
                <h3 className="text-sm md:text-base font-semibold">
                  24/7 Support
                </h3>
                <h4 className="text-xs md:text-sm text-slate-500">
                  Friendly 24/7 support
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdOutlinePayment size={25} />
              <div>
                <h3 className="text-sm md:text-base font-semibold">
                  Secure Paymnet
                </h3>
                <h4 className="text-xs md:text-sm text-slate-500">
                  All cards accepted
                </h4>
              </div>
            </div>
          </div>
        </Animated>

        <Animated>
          <div className="mt-20 md:mt-28">
            <h1 className="text-center py-6 text-3xl md:text-4xl font-bold">
              Our Product
            </h1>
            <Product products={[...products.slice(0, 8)]} />
          </div>
        </Animated>
      </div>

      <div className="mt-20 md:mt-28">
        <Animated>
          <div className="w-full md:max-w-[1240px] mx-auto px-5 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold">
              Outfit of the day <br /> collections
            </h1>
            <Link
              href="/Shop"
              className="bg-[#1C2534] capitalize text-white px-6 py-2 text-sm"
            >
              see more
            </Link>
          </div>

          <div className="grid md:grid-flow-col gap-4 pt-10">
            {Collections.map(
              ({ id, imgSrc, heading, subHeading, category }) => (
                <Link
                  href={{
                    pathname: "Shop",
                    query: { category: category },
                  }}
                  key={id}
                >
                  <Card
                    styles="aspect-[3/4]"
                    headingFontSize="text-3xl md:text-4xl"
                    subHeadingFontSize="text-base md:text-lg"
                    imgSrc={imgSrc}
                    heading={heading}
                    subHeading={subHeading}
                  />
                </Link>
              )
            )}
          </div>
        </Animated>

        <Subscribe />
      </div>
    </MainLayout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await prisma.products.findMany({
    include: {
      favorites: {
        select: {
          isFavorite: true,
          userId: true,
        },
      },
    },
  });

  return {
    props: {
      products,
    },
  };
};
