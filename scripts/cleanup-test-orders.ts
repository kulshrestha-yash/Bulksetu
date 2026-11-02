// Remove smoke-test orders created during verification (keeps the 3 seeded demo orders).
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const testOrders = await db.order.findMany({
    where: { orderNo: { in: ["BS-2026-00004", "BS-2026-00005"] } },
    select: { id: true, orderNo: true },
  });
  for (const o of testOrders) {
    await db.order.delete({ where: { id: o.id } });
    console.log("deleted", o.orderNo);
  }
  const remaining = await db.order.findMany({ select: { orderNo: true, status: true } });
  console.log("remaining orders:", JSON.stringify(remaining));
}

main().finally(() => db.$disconnect());
