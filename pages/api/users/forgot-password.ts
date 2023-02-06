import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { verificationCode } from "../../../helpers/generateVerificationCode";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "msy40953@gmail.com",
      pass: "hizjchtgvyzxblda",
    },
  });

  if (req.method === "POST") {
    const { email } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return res.status(404).json({ msg: "User email not found!" });
    } else {
      const resetToken = await verificationCode(findUser.name);

      const foundToken = await prisma.userVerification.findMany({
        where: {
          user: {
            email,
          },
        },
      });

      if (foundToken) await prisma.userVerification.deleteMany({});

      const saveResetToken = await prisma.userVerification.create({
        data: {
          userId: findUser.id,
          expiresAt: new Date(Date.now() + 86400000),
          verificationCode: resetToken,
        },
      });

      if (saveResetToken) {
        const message = {
          from: process.env.NEXT_PUBLIC_GMAIL_ADDRESS,
          to: email,
          subject: "Reset password",
          html: `<p>Click the link to reset your password.</p><p>This link will <b>expires in 24 hours</b></p><p>
                        <a style="text-decoration: none; color: white; border-radius: 5px; width: fit-content; background:#1C2534; display:block; padding: 10px" href="http://localhost:3000/resetpassword/${findUser.id}/${resetToken}">Reset password</a>
                      </p>`,
        };

        transport.sendMail(message);

        return res.send(200);
      }
    }
  }
}
