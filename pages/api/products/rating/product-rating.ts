import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Sessions = await unstable_getServerSession(
    req,
    res,
    authOptions
  );

  if (!session) return res.status(401).json({ error: "Unauthorized Access." });

  if (req.method === "POST") {
    const data = req.body;
    await prisma.review.create({
      data,
    });

    res.send(200);
  }
}
