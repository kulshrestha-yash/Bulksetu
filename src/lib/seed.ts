import { db } from "@/lib/db";
import { SEED_PRODUCTS, DEMO_USER, SEED_ORDERS } from "@/lib/catalog-data";
import { slabPriceFor } from "@/lib/format";
import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

let seedPromise: Promise<void> | null = null;

/** Lazy idempotent seeding — runs once per server lifetime. */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = doSeed().catch((e) => {
      seedPromise = null; // allow retry on next request
      throw e;
    });
  }
  return seedPromise;
}

async function doSeed(): Promise<void> {
  const productCount = await db.product.count();
  if (productCount === 0) {
    await db.product.createMany({
      data: SEED_PRODUCTS.map((p) => ({
        slug: p.slug,
        name: p.name,
        grade: p.grade ?? null,
        category: p.category,
        department: "Food & Beverage",
        packSize: p.packSize,
        unit: p.unit,
        moq: p.moq,
        basePrice: p.basePrice,
        priceSlabs: JSON.stringify(p.priceSlabs),
        supplierName: p.supplierName,
        supplierCity: p.supplierCity,
        supplierState: p.supplierState,
        supplierType: p.supplierType,
        supplierYears: p.supplierYears,
        supplierRating: p.supplierRating,
        rating: p.rating,
        reviews: p.reviews,
        stockKg: p.stockKg,
        hsn: p.hsn,
        description: p.description,
        imageHint: p.imageHint,
        featured: p.featured ?? false,
      })),
    });
  }

  // demo buyer account
  let demo = await db.user.findUnique({ where: { email: DEMO_USER.email } });
  if (!demo) {
    demo = await db.user.create({
      data: {
        email: DEMO_USER.email,
        passwordHash: hashPassword(DEMO_USER.password),
        businessName: DEMO_USER.businessName,
        ownerName: DEMO_USER.ownerName,
        mobile: DEMO_USER.mobile,
        gstin: DEMO_USER.gstin,
        buyerType: DEMO_USER.buyerType,
        isDemo: true,
      },
    });
  }

  // demo orders (mirror the wireframe journey)
  if ((await db.order.count({ where: { userId: demo.id } })) === 0) {
    for (const so of SEED_ORDERS) {
      const items = [] as Array<Record<string, unknown>>;
      let subtotal = 0;
      for (const it of so.items) {
        const prod = await db.product.findUnique({ where: { slug: it.slug } });
        if (!prod) continue;
        const slabs = JSON.parse(prod.priceSlabs) as { minQty: number; price: number }[];
        const price = slabPriceFor(slabs, it.qty);
        const amount = Math.round(price * it.qty);
        subtotal += amount;
        items.push({
          productId: prod.id,
          slug: prod.slug,
          name: prod.name,
          packSize: prod.packSize,
          unit: prod.unit,
          qty: it.qty,
          slabPrice: price,
          amount,
          hsn: prod.hsn,
          supplierName: prod.supplierName,
          imageHint: prod.imageHint,
        });
      }
      const total = subtotal + so.deliveryFee;
      await db.order.create({
        data: {
          orderNo: so.orderNo,
          userId: demo.id,
          items: JSON.stringify(items),
          subtotal,
          deliveryFee: so.deliveryFee,
          total,
          advanceAmount: Math.round(total * 0.1),
          balanceAmount: total - Math.round(total * 0.1),
          advancePaid: so.advancePaid,
          balancePaid: so.balancePaid,
          advanceMethod: so.advanceMethod ?? null,
          balanceMethod: so.balanceMethod ?? null,
          advanceRef: so.advanceRef ?? null,
          balanceRef: so.balanceRef ?? null,
          status: so.status,
          address: JSON.stringify({
            businessName: DEMO_USER.businessName,
            gstin: DEMO_USER.gstin,
            line1: "Shop 14–16, Grain Market, Khari Baoli",
            city: "Old Delhi",
            state: "Delhi",
            pincode: "110006",
            phone: DEMO_USER.mobile,
            landmark: "Fatehpuri Masjid gate",
          }),
          deliverySpeed: so.deliverySpeed,
          poNumber: so.poNumber ?? null,
          etaFrom: so.etaFrom ?? null,
          etaTo: so.etaTo ?? null,
          deliveredAt: so.deliveredAt ? new Date(so.deliveredAt) : null,
          events: JSON.stringify(so.events),
          createdAt: new Date(so.createdAt),
        },
      });
    }
  }
}
