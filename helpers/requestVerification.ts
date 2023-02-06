import prisma from "../lib/prisma";
import nodemailer from "nodemailer";
import { verificationCode } from "./generateVerificationCode";

export const requestNewVerification = async (
  name: string,
  userId: string,
  email: string
) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "msy40953@gmail.com",
      pass: "hizjchtgvyzxblda",
    },
  });
  const hashCode = await verificationCode(name);

  const findVerificationCode = await prisma.userVerification.findMany({
    where: {
      userId: userId,
    },
  });

  if (findVerificationCode) {
    await prisma.userVerification.deleteMany({});
  }

  const response = await prisma.userVerification.create({
    data: {
      userId: userId,
      expiresAt: new Date(Date.now() + 600000),
      verificationCode: hashCode,
    },
  });

  const message = {
    from: process.env.NEXT_PUBLIC_GMAIL_ADDRESS,
    to: email,
    subject: "Verify your email address",
    html: `<p>Verify your email address to complete registration.</p><p>This link will <b>expires in 24 hours</b></p><p>
            <a href="http://localhost:3000/user/verify/${userId}/${response.verificationCode}">Verify Email</a>
          </p>`,
  };

  await new Promise((resolve, reject) => {
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        resolve(info);
      }
    });
  });
};
