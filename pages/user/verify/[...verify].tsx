import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import axiosClient from "../../../config/axiosClient";

const VerifyEmail = () => {
  const router = useRouter();
  const query: any = router.query;

  const verificationToken = () => {
    const token = query.verify
      .slice(1)
      .map((el: string, index: number) =>
        index === query.verify.slice(1).length - 1 ? el : el + "/"
      )
      .join("");

    return token;
  };

  const verifiedEmail = async () => {
    try {
      const res = await axiosClient.get("verifyEmail", {
        params: {
          userId: query?.verify[0],
          verificationToken: verificationToken(),
        },
      });

      if (res) {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    verifiedEmail();
  }, [router.isReady]);

  return <div>Verifying email...</div>;
};

export default VerifyEmail;
