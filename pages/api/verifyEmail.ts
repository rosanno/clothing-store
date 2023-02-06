import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId, verificationToken } = req.query;

    const userToken = await prisma.userVerification.findUnique({
      where: {
        userId: userId.toString(),
      },
    });

    if (userToken?.verificationCode === verificationToken) {
      const verifiedUser = await prisma.user.update({
        where: {
          id: userId.toString(),
        },
        data: {
          emailVerified: new Date(),
        },
      });

      if (verifiedUser) {
        await prisma.userVerification.deleteMany({
          where: {
            verificationCode: verificationToken,
          },
        });
      }
    }

    res.send(200);
  }
}
