import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessions: Sessions = await unstable_getServerSession(
    req,
    res,
    authOptions
  );

  if (!sessions) {
    res.send(401);
    return;
  }

  if (req.method === "PATCH") {
    await prisma.user.update({
      where: {
        id: sessions.user.id,
      },
      data: req.body,
    });
    res.send(200);
  }
}
