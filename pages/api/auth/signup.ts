import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";
import { requestNewVerification } from "../../../helpers/requestVerification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, phone, email, password } = req.body;

    const checkEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!checkEmail) {
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          phone,
          email,
          password: hashPassword,
        },
      });

      requestNewVerification(user.name, user.id, user.email);

      res.status(201).json({
        user,
        msg: "We send you an email to verify your account",
      });
    } else {
      res.status(409).json({ msg: "Email is already registerd" });
    }
  }
}
