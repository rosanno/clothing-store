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
      user: process.env.NEXT_PUBLIC_GMAIL_ADDRESS,
      pass: process.env.NEXT_PUBLIC_GMAIL_APP_PASSWORD,
    },
  });

  console.log(process.env.NEXT_PUBLIC_GMAIL_ADDRESS);
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
            <a style="text-decoration: none; color: white; border-radius: 5px; width: fit-content; background:#1C2534; display:block; padding: 10px" href="${process.env.NEXT_PUBLIC_BASE_URL}/user/verify/${userId}/${response.verificationCode}">Verify Email</a>
          </p>`,
  };

  transport.sendMail(message, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("mail send");
    }
  });
};
