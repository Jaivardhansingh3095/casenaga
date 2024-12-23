"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { razorpay } from "@/lib/razorpay";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export async function createChekoutSession({ configId }: { configId: string }) {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) throw new Error("No such configuration found");

  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) throw new Error("You need to be logged in!");

  const { finish, material } = configuration;

  let price = BASE_PRICE;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findUnique({
    where: {
      orderId: {
        userId: user.id,
        configurationId: configuration.id,
      },
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    order = await db.order.create({
      data: {
        amount: price,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const product = await razorpay.items.create({
    name: "Casenaga Custom iPhone Case",
    description: "custom iPhone case",
    amount: price * 100,
    currency: "INR",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/razorpay/createOrder`,
    {
      method: "POST",
      body: JSON.stringify({ amount: price }),
    }
  );

  const data = await response.json();

  return { orderId: data.orderId, price };
}
