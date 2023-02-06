import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const { resetToken, userId, password } = req.body;

    const resetPasswordToken = await prisma.userVerification.findUnique({
      where: {
        userId,
      },
    });

    if (!resetPasswordToken)
      return res.status(404).json({ error: "Invalid token" });

    // console.log(
    //   resetToken.toString(),
    //   " - ",
    //   resetPasswordToken.verificationCode
    // );

    // const isValid = await bcrypt.compare(
    //   resetToken,
    //   resetPasswordToken.verificationCode
    // );

    // if (!isValid) return res.status(404).json({ error: "Invalid token" });

    if (new Date(Date.now()) > resetPasswordToken.expiresAt)
      return res.status(404).json({ error: "Expire token" });

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword,
      },
    });

    await prisma.userVerification.delete({
      where: {
        userId,
      },
    });

    res
      .status(200)
      .json({ msg: "Password reset successfully", redirect: "/login" });
  }
}
