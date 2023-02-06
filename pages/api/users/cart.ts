import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Sessions = await unstable_getServerSession(
    req,
    res,
    authOptions
  );
  if (!session) {
    res.status(401).json({ error: "Unauthorized Access!" });
    return;
  }

  if (req.method === "POST") {
    const { productId, userId, quantity, size, price } = req.body;
    const foundProduct = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        cart: {
          where: {
            Products: {
              id: parseInt(productId),
            },
          },
        },
      },
    });

    const itemFound = foundProduct.cart.findIndex(
      (item) => item.productsId === parseInt(productId)
    );

    if (itemFound === -1) {
      await prisma.cartItems.create({
        data: {
          productsId: parseInt(productId),
          userId: userId,
          quantity: quantity,
          size: size,
          total: parseInt(price) * quantity,
        },
      });

      res.status(201).json({ msg: "Added to bag!" });
      return;
    } else {
      const total: number = price * quantity;

      const products = await prisma.cartItems.findMany({
        where: {
          userId,
        },
      });

      const foundIndex = products.findIndex(
        (product) => product.productsId === parseInt(productId)
      );

      const qty = products[foundIndex].quantity + quantity;

      await prisma.cartItems.updateMany({
        where: {
          user: {
            id: session.user.id,
          },
        },
        data: {
          quantity: qty,
          total: Math.floor(total),
        },
      });

      res.status(201).json({ msg: "Added to bag" });
      return;
    }
  }

  if (req.method === "DELETE") {
    const deleteItem = await prisma.cartItems.delete({
      where: {
        id: req.body.id,
      },
    });

    if (deleteItem) res.send(200);
  }

  if (req.method === "GET") {
    const cartItem = await prisma.cartItems.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      include: {
        Products: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(cartItem);
    return;
  }
}
