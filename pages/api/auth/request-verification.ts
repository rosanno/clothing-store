import { NextApiRequest, NextApiResponse } from "next";
import { requestNewVerification } from "../../../helpers/requestVerification";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    const user = await prisma.user.findUnique({
      where: {
        id: userId.toString(),
      },
    });

    console.log(user);

    requestNewVerification(user.name, userId.toString(), user.email);

    res.status(200).json({ msg: "Verification email has been send." });
  }
}
