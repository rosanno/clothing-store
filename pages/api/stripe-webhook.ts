//@ts-ignore
//@ts-nocheck
import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import prisma from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret: string;

endpointSecret =
  "whsec_0cb5fd45cf18ac56fc43c483f6d41aadb0360fff0af510c5ba07d9f3492714fd";
// whsec_0cb5fd45cf18ac56fc43c483f6d41aadb0360fff0af510c5ba07d9f3492714fd

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const createOrder = async (customer: any, data: any) => {
  const Items = await prisma.cartItems.findMany({
    where: {
      userId: customer.metadata.userId,
    },
    select: {
      id: true,
      quantity: true,
      size: true,
      color: true,
      total: true,
      userId: true,
      createdAt: true,
      Products: true,
    },
  });

  const newOrder = await prisma.orders.create({
    data: {
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: Items,
      subtotal: data.amount_subtotal,
      total: data.amount_total,
      shipping: data.customer_details,
      payment_status: data.payment_status,
    },
  });

  if (newOrder) {
    await prisma.cartItems.deleteMany({});
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          buf.toString(),
          sig,
          endpointSecret
        );
        console.log("Webhook verified.");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
          // console.log("data:", data);
          // console.log("customer", customer);
        })
        .catch((err) => console.log(err.message));
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send(200);
  }
};

export default cors(handler as any);
