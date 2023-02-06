import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sessions = await unstable_getServerSession(req, res, authOptions);

  if (!sessions) return res.status(401).json({ error: "Unauthorized access." });

  if (req.method === "POST") {
    const { data } = req.body;

    await prisma.address.create({
      data: {
        house: data.house,
        province: data.province,
        village: data.village,
        label: data.label,
        city: data.city,
        userId: data.userId,
      },
    });

    res.status(201).send({ msg: "Address added!" });
  }

  if (req.method === "PATCH") {
    console.log("update...");
    await prisma.address.update({
      where: {
        id: parseInt(req.body.data.id),
      },
      data: req.body.data,
    });

    res.status(200).json({ msg: "Address updated successfully" });
  }
}
