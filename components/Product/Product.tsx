import { useRouter } from "next/router";
import React from "react";
import ProductCard from "../ProductCard";

const Product = (props: Props) => {
  const router = useRouter();

  return (
    <div
      className={`grid grid-cols-2 ${
        router.pathname === "/Shop"
          ? "md:grid-cols-4 lg:grid-cols-5"
          : "md:grid-cols-3 lg:grid-cols-4"
      } gap-6 pt-5`}
    >
      {props.products.map((product: Products) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default Product;
