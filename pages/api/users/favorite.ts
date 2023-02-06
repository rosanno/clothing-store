import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
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

  if (req.method === "POST") {
    await prisma.favorites.create({
      data: {
        productsId: parseInt(req.body.productId),
        userId: sessions.user.id,
        isFavorite: true,
      },
    });

    res.status(201).json({ msg: "Added to fovorite" });
    return;
  }

  if (req.method === "DELETE") {
    const removeFavorite = await prisma.favorites.delete({
      where: {
        productsId: req.body.productId,
      },
    });

    if (removeFavorite) {
      res.send(200);
      return;
    }
  }

  if (req.method === "GET") {
    const favorite = await prisma.favorites.findMany({
      where: {
        user: {
          id: sessions.user.id,
        },
      },
      include: {
        products: true,
      },
    });

    res.status(200).json(favorite);
    return;
  }
}
