import Head from "next/head";
import React from "react";

const Meta = ({ title }: { title: string }) => {
  const pageTitle = `Clothing - ${title}`;
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{pageTitle}</title>
    </Head>
  );
};

export default Meta;
