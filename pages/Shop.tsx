import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import Animated from "../components/Animated/Animated";
import MainLayout from "../components/Layout/MainLayout";
import Meta from "../components/Meta";
import NotFound from "../components/NotFound";
import Product from "../components/Product/Product";
import { Catigories } from "../data/data";
import prisma from "../lib/prisma";

const Shop = ({ products }: Props) => {
  const inputRef = useRef(null);
  const router = useRouter();

  const filterProducts = (array: any) => {
    if (!router.query.search) {
      return array.sort((a: Products, b: Products) => {
        switch (router.query.sort) {
          case "priceDesc":
            return parseInt(b.price) - parseInt(a.price);
          case "priceAsc":
            return parseInt(a.price) - parseInt(b.price);
          case "newest":
            if (new Date(a.createdAt) > new Date(b.createdAt)) {
              return -1;
            }
            if (new Date(a.createdAt) < new Date(b.createdAt)) {
              return 1;
            }
            return 0;
          case "name":
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          default:
            return array;
        }
      });
    } else {
      return array.filter((el: Products) =>
        el.name.toLowerCase().includes(router.query.search.toString())
      );
    }
  };

  const filtered = filterProducts(products);

  const onChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;

    router.push({
      pathname: "/Shop",
      query: { ...router.query, sort: target.value },
    });
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: "/Shop",
      query: { ...router.query, search: inputRef.current.value },
    });

    inputRef.current.value = "";
  };

  return (
    <MainLayout>
      <Meta title="Shop" />
      <div className="w-full md:max-w-[1240px] mx-auto px-5 mt-10">
        <form onSubmit={onSubmit} className="flex justify-center">
          <div className="space-x-3 w-full md:w-auto">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search items..."
              className="w-full md:w-[350px] py-2 px-3 border rounded-md font-poppins text-sm focus:outline-[#4d74b9]"
            />
            <button
              type="submit"
              className="bg-[#1C2534] text-white px-4 py-2 hidden md:inline-block rounded-md text-sm"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center md:justify-start flex-wrap gap-10 my-7 transition-all duration-500">
          {Catigories.map(({ id, category }) => (
            <div key={id}>
              {category ? (
                <Link
                  href={{
                    pathname: "Shop",
                    query: { category: category?.toLowerCase() },
                  }}
                >
                  <div
                    className={`text-xs font-poppins font-medium text-gray-500 ${
                      router.query.category === category.toLowerCase() &&
                      "border-b-2 border-black"
                    }`}
                  >
                    {category}
                  </div>
                </Link>
              ) : (
                <Link href="/Shop">
                  <div
                    className={`text-xs font-poppins font-medium text-gray-500 
                    }`}
                  >
                    All
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
        <div>
          <select
            onChange={onChange}
            className="px-2 py-1 text-xs rounded-md font-poppins border outline-none"
          >
            <option value="" disabled>
              Sort By
            </option>
            <option value="priceDesc">Highest Price ↑</option>
            <option value="priceAsc">Lowest Price ↓</option>
            <option value="name">A-Z</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        <div className="my-14 md:my-16">
          {products.length === 0 ? (
            <NotFound>No products found</NotFound>
          ) : (
            <Animated>
              <Product products={[...filtered]} />
            </Animated>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  let products = [];

  if (!query.category || (!query.sort && query.sort)) {
    products = await prisma.products.findMany({
      include: {
        favorites: {
          select: {
            isFavorite: true,
            userId: true,
          },
        },
      },
      orderBy: {
        price: "desc",
      },
    });
  } else {
    products = await prisma.products.findMany({
      where: {
        categories: {
          some: {
            category: query.category?.toString(),
          },
        },
      },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
        favorites: {
          select: {
            isFavorite: true,
            userId: true,
          },
        },
      },
    });
  }

  return {
    props: {
      products,
    },
  };
};
