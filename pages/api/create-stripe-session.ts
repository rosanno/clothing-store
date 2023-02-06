import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { items, userId } = req.body;

    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
      },
    });

    const line_items = items.map((item: CartItems) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.Products.name,
            images: [item.Products.productImg],
            description: item.Products.description,
            metadata: {
              id: item.Products.id,
            },
          },
          unit_amount: parseInt(item.Products.price) * 100,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "PH", "JP"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    res.status(200).json({ id: session.id });
  }
}
