import "../styles/globals.css";
import { useState, useEffect } from "react";
import Router from "next/router";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Loader from "../components/Loader/Loader";
import { CartContextProvider } from "../context/CartContext";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <SessionProvider session={pageProps.session}>
      <CartContextProvider>
        {isLoading && <Loader />}
        <Component {...pageProps} />
      </CartContextProvider>
    </SessionProvider>
  );
}
