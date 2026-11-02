// BulkSetu API smoke test — walks the full 10/90 buyer journey.
const BASE = "http://localhost:3000";
let cookie = "";

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...(opts.headers || {}),
    },
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {}
  return { status: res.status, body };
}

function check(name: string, cond: boolean, extra = "") {
  console.log(`${cond ? "PASS" : "FAIL"} · ${name}${extra ? " — " + extra : ""}`);
  if (!cond) process.exitCode = 1;
}

async function main() {
  // catalog
  const products = await api("/api/products?pageSize=48");
  check("products list", products.status === 200 && (products.body as any).products.length === 20, `${(products.body as any).products?.length} products`);

  const one = await api("/api/products/one?slug=basmati-rice-premium-long-grain");
  check("product detail", one.status === 200 && (one.body as any).product.priceSlabs.length === 3);

  const cats = await api("/api/categories");
  check("categories", cats.status === 200 && (cats.body as any).categories.length === 6, `${(cats.body as any).categories?.length} live categories`);

  // auth
  const demo = await api("/api/auth", { method: "POST", body: JSON.stringify({ action: "demo" }) });
  check("demo login", demo.status === 200 && (demo.body as any).user.businessName === "Gupta Traders & Co.");

  const orders0 = await api("/api/orders");
  check("seeded orders visible", orders0.status === 200 && (orders0.body as any).orders.length === 3, `${(orders0.body as any).orders?.length} orders`);

  // create order: basmati 500kg (₹60 → ₹30,000) + sugar 1,000kg (₹38 → ₹38,000) = ₹68,000, free freight
  const created = await api("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      items: [
        { slug: "basmati-rice-premium-long-grain", qty: 500 },
        { slug: "sugar-s30-refined", qty: 1000 },
      ],
      address: { businessName: "Smoke Test Traders", gstin: "07AAACG2145K1Z6", line1: "1 Test Lane", city: "Delhi", state: "Delhi", pincode: "110001", phone: "+91 90000 00000" },
      deliverySpeed: "Standard",
    }),
  });
  const order = (created.body as any).order;
  check("order created", created.status === 201 && order.total === 68000, `total ${order?.total}`);
  check("advance is 10%", order.advanceAmount === 6800 && order.balanceAmount === 61200);

  // balance before delivery must be blocked
  const earlyBalance = await api("/api/orders/pay", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo, kind: "balance", method: "UPI" }) });
  check("90% locked before delivery", earlyBalance.status === 409);

  // pay advance
  const adv = await api("/api/orders/pay", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo, kind: "advance", method: "UPI" }) });
  check("10% advance paid", adv.status === 200 && (adv.body as any).order.advancePaid === true, `ref ${(adv.body as any).payment?.reference}`);

  // walk timeline to DELIVERED
  for (const expected of ["CONFIRMED", "DISPATCHED", "IN_TRANSIT", "DELIVERED"]) {
    const step = await api("/api/orders/advance", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo }) });
    check(`timeline → ${expected}`, step.status === 200 && (step.body as any).order.status === expected);
  }

  // try advancing past delivery without paying → must be blocked
  const blocked = await api("/api/orders/advance", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo }) });
  check("COMPLETED blocked until 90% paid", blocked.status === 409);

  // pay balance → COMPLETED
  const bal = await api("/api/orders/pay", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo, kind: "balance", method: "Card" }) });
  check("90% balance paid → COMPLETED", bal.status === 200 && (bal.body as any).order.status === "COMPLETED" && (bal.body as any).order.balancePaid === true);

  // double-pay must fail
  const again = await api("/api/orders/pay", { method: "POST", body: JSON.stringify({ orderNo: order.orderNo, kind: "balance", method: "UPI" }) });
  check("double-pay blocked", again.status === 409);

  // guest cannot list orders
  cookie = "";
  const guest = await api("/api/orders");
  check("guest orders blocked", guest.status === 401);

  // register new buyer
  const reg = await api("/api/auth", {
    method: "POST",
    body: JSON.stringify({ action: "register", businessName: "New Biz", ownerName: "Test Owner", email: `smoke${Date.now()}@test.in`, password: "password123", buyerType: "Retailer / Kirana" }),
  });
  check("register", reg.status === 200 && (reg.body as any).user.businessName === "New Biz");

  console.log("\nSmoke test finished.");
}

main();
