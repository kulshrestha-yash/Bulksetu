// ─────────────────────────────────────────────────────────────────────────────
// BulkSetu seed catalog — built from the client's 20-item staples list,
// priced with B2B quantity slabs following the wireframe model:
//   base slab (at MOQ) → mid slab → best slab (largest qty)
// All figures are illustrative starting data — edit freely or from an admin UI.
// ─────────────────────────────────────────────────────────────────────────────

export interface Slab {
  minQty: number;
  price: number;
}

export interface SeedProduct {
  slug: string;
  name: string;
  grade?: string;
  category: string;
  packSize: string;
  unit: string;
  moq: number;
  basePrice: number; // price shown on cards (best popular slab)
  priceSlabs: Slab[];
  supplierName: string;
  supplierCity: string;
  supplierState: string;
  supplierType: string;
  supplierYears: number;
  supplierRating: number;
  rating: number;
  reviews: number;
  stockKg: number;
  hsn: string;
  description: string;
  imageHint: string;
  featured?: boolean;
}

export const DEPARTMENTS: { name: string; count: number; live?: boolean }[] = [
  { name: "Food & Beverage", count: 12542, live: true },
  { name: "FMCG & Daily Needs", count: 8765, live: true },
  { name: "Agriculture & Agro", count: 8234 },
  { name: "Packaging Materials", count: 4876 },
  { name: "Industrial Supplies", count: 8976 },
  { name: "Construction Materials", count: 7654 },
  { name: "Electronics & Electrical", count: 5432 },
  { name: "Textiles & Apparel", count: 3210 },
  { name: "Home & Office", count: 2980 },
  { name: "Beauty & Personal Care", count: 2450 },
  { name: "Pharma & Healthcare", count: 1890 },
  { name: "Automotive", count: 1520 },
  { name: "Electrical Equipment", count: 1310 },
  { name: "Machinery & Machine Parts", count: 980 },
  { name: "Metals & Minerals", count: 870 },
  { name: "Pulp, Paper & Stationery", count: 640 },
  { name: "Plastics & Rubber", count: 520 },
];

export const CATEGORY_BLURBS: Record<string, string> = {
  "Rice & Grains": "Basmati, non-basmati & millets in bulk packs",
  "Pulses & Dal": "Toor, chana, moong, urad & rajma — machine cleaned",
  "Edible Oils & Ghee": "Refined oils, mustard, sunflower & pure ghee",
  "Spices & Masala": "Whole spices, powders & blended masalas",
  "Sugar & Salt": "S-30 sugar, jaggery & free-flow iodised salt",
  "Flour & Maida": "Wheat atta, maida, sooji & besan flours",
};

// icon letter for the category tile placeholder
export const CATEGORY_ICONS: Record<string, string> = {
  "Rice & Grains": "R",
  "Pulses & Dal": "P",
  "Edible Oils & Ghee": "O",
  "Spices & Masala": "S",
  "Sugar & Salt": "G",
  "Flour & Maida": "F",
};

export const SEED_PRODUCTS: SeedProduct[] = [
  // ── Rice & Grains ──────────────────────────────────────────────────────────
  {
    slug: "basmati-rice-premium-long-grain",
    name: "Basmati Rice — Premium Long Grain",
    grade: "India Gate Classic · equivalent grade",
    category: "Rice & Grains",
    packSize: "25 kg PP bag",
    unit: "kg",
    moq: 100,
    basePrice: 60,
    priceSlabs: [
      { minQty: 100, price: 64 },
      { minQty: 500, price: 60 },
      { minQty: 1000, price: 57 },
    ],
    supplierName: "Shree Grain Mills Pvt. Ltd.",
    supplierCity: "Karnal",
    supplierState: "Haryana",
    supplierType: "Manufacturer",
    supplierYears: 8,
    supplierRating: 4.5,
    rating: 4.6,
    reviews: 312,
    stockKg: 40000,
    hsn: "10063020",
    description:
      "Aged premium long-grain basmati with extra-long slender grains and natural aroma. Sortex cleaned, 2x polished. Ideal for retailers, caterers and repackers. GST invoice and FSSAI papers available with every dispatch.",
    imageHint: "Basmati Rice — 25 kg bag product photo",
    featured: true,
  },
  {
    slug: "non-basmati-rice-sona-masoori",
    name: "Non-Basmati Rice — Sona Masoori",
    grade: "Steam · Sortex Clean",
    category: "Rice & Grains",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 500,
    basePrice: 42,
    priceSlabs: [
      { minQty: 500, price: 42 },
      { minQty: 1000, price: 40.5 },
      { minQty: 2000, price: 39 },
    ],
    supplierName: "Krishna Agro Traders",
    supplierCity: "Warangal",
    supplierState: "Telangana",
    supplierType: "Miller & Wholesaler",
    supplierYears: 6,
    supplierRating: 4.3,
    rating: 4.4,
    reviews: 189,
    stockKg: 120000,
    hsn: "10063090",
    description:
      "Lightweight everyday rice popular across South India. Steam processed, sortex cleaned, low starch. Bulk export-grade packing with moisture below 13%.",
    imageHint: "Sona Masoori Rice — 50 kg bag product photo",
    featured: true,
  },

  // ── Pulses & Dal ───────────────────────────────────────────────────────────
  {
    slug: "arhar-toor-dal-unpolished",
    name: "Arhar / Toor Dal — Unpolished",
    grade: "Machine Cleaned · Grade A",
    category: "Pulses & Dal",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 200,
    basePrice: 110,
    priceSlabs: [
      { minQty: 200, price: 110 },
      { minQty: 500, price: 108 },
      { minQty: 1000, price: 105 },
    ],
    supplierName: "Laxmi Pulses Pvt. Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 11,
    supplierRating: 4.6,
    rating: 4.5,
    reviews: 264,
    stockKg: 60000,
    hsn: "07136000",
    description:
      "Unpolished toor dal with high protein content — no oil coating, natural shine retained. Machine cleaned twice, sorted for uniform grain size. Lab-tested lots with quality certificate.",
    imageHint: "Arhar / Toor Dal — 50 kg bag product photo",
    featured: true,
  },
  {
    slug: "urad-dal-machine-cleaned",
    name: "Urad Dal — Machine Cleaned",
    grade: "Golum · Sortex",
    category: "Pulses & Dal",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 200,
    basePrice: 98,
    priceSlabs: [
      { minQty: 200, price: 98 },
      { minQty: 500, price: 95 },
      { minQty: 1000, price: 92 },
    ],
    supplierName: "Laxmi Pulses Pvt. Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 11,
    supplierRating: 4.6,
    rating: 4.4,
    reviews: 143,
    stockKg: 45000,
    hsn: "07135000",
    description:
      "Premium golum urad dal, ideal for papad units, hotels and dal mills. Uniform bold grains, sortex cleaned, free from admixture.",
    imageHint: "Urad Dal — 50 kg bag product photo",
  },
  {
    slug: "chana-dal-machine-cleaned",
    name: "Chana Dal — Machine Cleaned",
    grade: "Bold · 8 mm",
    category: "Pulses & Dal",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 200,
    basePrice: 88,
    priceSlabs: [
      { minQty: 200, price: 88 },
      { minQty: 500, price: 86 },
      { minQty: 1000, price: 84 },
    ],
    supplierName: "Laxmi Pulses Pvt. Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 11,
    supplierRating: 4.6,
    rating: 4.5,
    reviews: 198,
    stockKg: 70000,
    hsn: "07136000",
    description:
      "Bold-grade chana dal, double machine cleaned. Consistent grain size for sweet shops, flour mills and repackers.",
    imageHint: "Chana Dal — 50 kg bag product photo",
    featured: true,
  },
  {
    slug: "moong-dal-yellow-split",
    name: "Moong Dal — Yellow Split",
    grade: "Sortex Clean",
    category: "Pulses & Dal",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 200,
    basePrice: 105,
    priceSlabs: [
      { minQty: 200, price: 105 },
      { minQty: 500, price: 102 },
      { minQty: 1000, price: 99 },
    ],
    supplierName: "Rajdhani Dal Mills",
    supplierCity: "Jaipur",
    supplierState: "Rajasthan",
    supplierType: "Wholesaler",
    supplierYears: 7,
    supplierRating: 4.4,
    rating: 4.3,
    reviews: 96,
    stockKg: 30000,
    hsn: "07134000",
    description:
      "Bright yellow split moong, polished-free, sortex cleaned. Popular for dals, khichdi mixes and packaged-food brands.",
    imageHint: "Moong Dal — 50 kg bag product photo",
  },
  {
    slug: "rajma-chitra-beans",
    name: "Rajma — Chitra Beans",
    grade: "Jumbo · Hand Picked",
    category: "Pulses & Dal",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 100,
    basePrice: 140,
    priceSlabs: [
      { minQty: 100, price: 140 },
      { minQty: 500, price: 135 },
      { minQty: 1000, price: 131 },
    ],
    supplierName: "Himalayan Agro Exports",
    supplierCity: "Shimla",
    supplierState: "Himachal Pradesh",
    supplierType: "Distributor",
    supplierYears: 5,
    supplierRating: 4.2,
    rating: 4.4,
    reviews: 87,
    stockKg: 18000,
    hsn: "07089000",
    description:
      "Chitra rajma from Himachal highlands — small, quick-cooking beans with thin skin. Hand-picked and graded, minimal broken percentage.",
    imageHint: "Rajma Chitra — 50 kg bag product photo",
  },

  // ── Edible Oils & Ghee ─────────────────────────────────────────────────────
  {
    slug: "mustard-oil-kachi-ghani",
    name: "Mustard Oil — Kachi Ghani",
    grade: "FSSAI · Agmark Graded",
    category: "Edible Oils & Ghee",
    packSize: "5 L jar",
    unit: "jar",
    moq: 40,
    basePrice: 690,
    priceSlabs: [
      { minQty: 40, price: 690 },
      { minQty: 100, price: 670 },
      { minQty: 200, price: 655 },
    ],
    supplierName: "Sarson Mills Pvt. Ltd.",
    supplierCity: "Alwar",
    supplierState: "Rajasthan",
    supplierType: "Manufacturer",
    supplierYears: 9,
    supplierRating: 4.5,
    rating: 4.6,
    reviews: 221,
    stockKg: 12000, // jars × 5 L
    hsn: "15149010",
    description:
      "Traditional cold-pressed (kachi ghani) mustard oil with strong pungency and natural sharpness. Food-grade PET jars, tamper-proof caps, batch coded.",
    imageHint: "Mustard Oil Kachi Ghani — 5 L jar product photo",
    featured: true,
  },
  {
    slug: "soyabean-refined-oil",
    name: "Soyabean Refined Oil",
    grade: "Refined · Vitamin A & D",
    category: "Edible Oils & Ghee",
    packSize: "15 L tin",
    unit: "tin",
    moq: 20,
    basePrice: 1980,
    priceSlabs: [
      { minQty: 20, price: 1980 },
      { minQty: 50, price: 1930 },
      { minQty: 100, price: 1890 },
    ],
    supplierName: "Goldfeed Oils Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 14,
    supplierRating: 4.7,
    rating: 4.5,
    reviews: 176,
    stockKg: 6000, // tins × 15 L
    hsn: "15079000",
    description:
      "Light, neutral-tasting refined soyabean oil fortified with vitamins A & D. Multi-layer tins for long shelf life. Ideal for restaurants, canteens and repackers.",
    imageHint: "Soyabean Refined Oil — 15 L tin product photo",
    featured: true,
  },
  {
    slug: "sunflower-refined-oil",
    name: "Sunflower Refined Oil",
    grade: "Refined · Light & Healthy",
    category: "Edible Oils & Ghee",
    packSize: "15 L tin",
    unit: "tin",
    moq: 20,
    basePrice: 1520,
    priceSlabs: [
      { minQty: 20, price: 1520 },
      { minQty: 50, price: 1485 },
      { minQty: 100, price: 1450 },
    ],
    supplierName: "Goldfeed Oils Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 14,
    supplierRating: 4.7,
    rating: 4.4,
    reviews: 132,
    stockKg: 4500,
    hsn: "15121110",
    description:
      "Refined sunflower oil, light in taste and rich in vitamin E. Low absorption while frying — preferred by QSR chains and sweet shops.",
    imageHint: "Sunflower Refined Oil — 15 L tin product photo",
  },
  {
    slug: "cow-ghee-danedar",
    name: "Cow Ghee — Danedar",
    grade: "A2 · Bilona Method",
    category: "Edible Oils & Ghee",
    packSize: "15 kg tin",
    unit: "kg",
    moq: 50,
    basePrice: 485,
    priceSlabs: [
      { minQty: 50, price: 485 },
      { minQty: 200, price: 472 },
      { minQty: 500, price: 465 },
    ],
    supplierName: "Gau Shakti Dairy Foods",
    supplierCity: "Karnal",
    supplierState: "Haryana",
    supplierType: "Manufacturer",
    supplierYears: 6,
    supplierRating: 4.6,
    rating: 4.7,
    reviews: 289,
    stockKg: 9000,
    hsn: "04059020",
    description:
      "Granular danedar cow ghee made by the traditional bilona method — golden aroma, rich texture. Packed in food-grade tins; lab reports shared with every lot.",
    imageHint: "Cow Ghee Danedar — 15 kg tin product photo",
    featured: true,
  },

  // ── Spices & Masala ────────────────────────────────────────────────────────
  {
    slug: "turmeric-powder-salem",
    name: "Turmeric Powder — Salem",
    grade: "Salem · 4–5% Curcumin",
    category: "Spices & Masala",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 100,
    basePrice: 185,
    priceSlabs: [
      { minQty: 100, price: 185 },
      { minQty: 500, price: 178 },
      { minQty: 1000, price: 172 },
    ],
    supplierName: "Salem Spices Exporters",
    supplierCity: "Erode",
    supplierState: "Tamil Nadu",
    supplierType: "Manufacturer & Exporter",
    supplierYears: 12,
    supplierRating: 4.8,
    rating: 4.6,
    reviews: 341,
    stockKg: 25000,
    hsn: "09103020",
    description:
      "High-curcumin Salem turmeric, steam sterilised and fine-milled (80–100 mesh). Bright natural colour without artificial dyes. Export documentation available.",
    imageHint: "Turmeric Powder — 50 kg bag product photo",
    featured: true,
  },
  {
    slug: "red-chilli-powder-guntur",
    name: "Red Chilli Powder — Guntur",
    grade: "Guntur Sannam · 80–90 SHU ×1k",
    category: "Spices & Masala",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 100,
    basePrice: 260,
    priceSlabs: [
      { minQty: 100, price: 260 },
      { minQty: 500, price: 252 },
      { minQty: 1000, price: 245 },
    ],
    supplierName: "Guntur Spice Works",
    supplierCity: "Guntur",
    supplierState: "Andhra Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 10,
    supplierRating: 4.5,
    rating: 4.5,
    reviews: 208,
    stockKg: 20000,
    hsn: "09042110",
    description:
      "Fiery Guntur sannam chilli powder with deep red colour and consistent pungency. Aflatoxin-tested, free from Sudan dyes and artificial colour.",
    imageHint: "Red Chilli Powder — 50 kg bag product photo",
  },
  {
    slug: "garam-masala-blended",
    name: "Garam Masala — Blended",
    grade: "12-Spice Roasted Blend",
    category: "Spices & Masala",
    packSize: "25 kg carton",
    unit: "kg",
    moq: 100,
    basePrice: 420,
    priceSlabs: [
      { minQty: 100, price: 420 },
      { minQty: 300, price: 408 },
      { minQty: 500, price: 398 },
    ],
    supplierName: "Massewalas Foods Pvt. Ltd.",
    supplierCity: "Delhi",
    supplierState: "Delhi NCR",
    supplierType: "Manufacturer",
    supplierYears: 15,
    supplierRating: 4.6,
    rating: 4.6,
    reviews: 254,
    stockKg: 8000,
    hsn: "09109100",
    description:
      "Signature 12-spice roasted garam masala — coriander, cumin, black cardamom, clove, cassia and more. Recipe standardised for repeat bulk orders; private labelling possible.",
    imageHint: "Garam Masala — 25 kg carton product photo",
    featured: true,
  },
  {
    slug: "jeera-cumin-seeds",
    name: "Jeera — Cumin Seeds",
    grade: "Singapore Quality · 99% Pure",
    category: "Spices & Masala",
    packSize: "40 kg PP bag",
    unit: "kg",
    moq: 50,
    basePrice: 360,
    priceSlabs: [
      { minQty: 50, price: 360 },
      { minQty: 200, price: 350 },
      { minQty: 500, price: 342 },
    ],
    supplierName: "Unjha Spice Mandi Co.",
    supplierCity: "Unjha",
    supplierState: "Gujarat",
    supplierType: "Wholesaler & Exporter",
    supplierYears: 18,
    supplierRating: 4.7,
    rating: 4.5,
    reviews: 176,
    stockKg: 14000,
    hsn: "09093120",
    description:
      "Bold Unjha cumin seeds, 99% purity, naturally aromatic. Machine cleaned and graded for spice houses, masala mills and export houses.",
    imageHint: "Jeera / Cumin Seeds — 40 kg bag product photo",
  },
  {
    slug: "iodised-salt-free-flow",
    name: "Iodised Salt — Free Flow",
    grade: "Food Grade · IS 7224",
    category: "Sugar & Salt",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 1000,
    basePrice: 11,
    priceSlabs: [
      { minQty: 1000, price: 11 },
      { minQty: 3000, price: 10.2 },
      { minQty: 5000, price: 9.5 },
    ],
    supplierName: "Sagar Salts Ltd.",
    supplierCity: "Kandla",
    supplierState: "Gujarat",
    supplierType: "Manufacturer",
    supplierYears: 20,
    supplierRating: 4.4,
    rating: 4.3,
    reviews: 412,
    stockKg: 500000,
    hsn: "25010020",
    description:
      "Free-flow vacuum-evaporated iodised salt with anti-caking agent. Uniform crystal size for packing lines; bulk full-truck dispatches daily.",
    imageHint: "Iodised Salt — 50 kg bag product photo",
  },

  // ── Sugar & Salt ───────────────────────────────────────────────────────────
  {
    slug: "sugar-s30-refined",
    name: "Sugar — S-30 Refined",
    grade: "S-30 · Mill Grade",
    category: "Sugar & Salt",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 1000,
    basePrice: 38,
    priceSlabs: [
      { minQty: 1000, price: 38 },
      { minQty: 3000, price: 36.5 },
      { minQty: 5000, price: 35.5 },
    ],
    supplierName: "Deccan Sugar Mills Ltd.",
    supplierCity: "Kolhapur",
    supplierState: "Maharashtra",
    supplierType: "Manufacturer",
    supplierYears: 22,
    supplierRating: 4.5,
    rating: 4.4,
    reviews: 167,
    stockKg: 300000,
    hsn: "17019910",
    description:
      "Bright white S-30 refined sugar, ICUMSA below 100. Standard mill packing, sweet shops, beverage units and wholesale repacking.",
    imageHint: "S-30 Refined Sugar — 50 kg bag product photo",
  },

  // ── Flour & Maida ──────────────────────────────────────────────────────────
  {
    slug: "wheat-atta-chakki-fresh",
    name: "Wheat Atta — Chakki Fresh",
    grade: "Chakki Attta · Sharbati Blend",
    category: "Flour & Maida",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 500,
    basePrice: 32,
    priceSlabs: [
      { minQty: 500, price: 32 },
      { minQty: 1000, price: 31 },
      { minQty: 2000, price: 30 },
    ],
    supplierName: "Annapurna Mills Pvt. Ltd.",
    supplierCity: "Bhopal",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 16,
    supplierRating: 4.6,
    rating: 4.5,
    reviews: 298,
    stockKg: 150000,
    hsn: "11010000",
    description:
      "Stone-ground chakki atta from select sharbati wheat — soft rotis with retained freshness. Bran percentage standardised for bakery and retail packing.",
    imageHint: "Wheat Atta — 50 kg bag product photo",
    featured: true,
  },
  {
    slug: "maida-refined-flour",
    name: "Maida — Refined Flour",
    grade: "Bakery Grade · Fine Milled",
    category: "Flour & Maida",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 500,
    basePrice: 34,
    priceSlabs: [
      { minQty: 500, price: 34 },
      { minQty: 1000, price: 33 },
      { minQty: 2000, price: 32 },
    ],
    supplierName: "Annapurna Mills Pvt. Ltd.",
    supplierCity: "Bhopal",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 16,
    supplierRating: 4.6,
    rating: 4.4,
    reviews: 154,
    stockKg: 90000,
    hsn: "11010000",
    description:
      "Fine-milled bakery maida with consistent gluten strength for breads, biscuits, namkeen and sweet shops. Uniform whiteness across lots.",
    imageHint: "Maida Refined Flour — 50 kg bag product photo",
  },
  {
    slug: "besan-gram-flour",
    name: "Besan — Gram Flour",
    grade: "100% Chana · Fine",
    category: "Flour & Maida",
    packSize: "50 kg PP bag",
    unit: "kg",
    moq: 250,
    basePrice: 95,
    priceSlabs: [
      { minQty: 250, price: 95 },
      { minQty: 500, price: 92 },
      { minQty: 1000, price: 89 },
    ],
    supplierName: "Laxmi Pulses Pvt. Ltd.",
    supplierCity: "Indore",
    supplierState: "Madhya Pradesh",
    supplierType: "Manufacturer",
    supplierYears: 11,
    supplierRating: 4.6,
    rating: 4.5,
    reviews: 121,
    stockKg: 40000,
    hsn: "11061000",
    description:
      "Pure chana besan, stone-milled fine grade — smooth batter for snacks, sweets and namkeen production. No mixing with other flours.",
    imageHint: "Besan Gram Flour — 50 kg bag product photo",
  },
];

// ── Demo buyer + demo orders (mirror wireframe screens 10–13) ────────────────
export const DEMO_USER = {
  email: "orders@guptatraders.in",
  password: "bulksetu",
  businessName: "Gupta Traders & Co.",
  ownerName: "Ramesh Gupta",
  mobile: "+91 98111 22334",
  gstin: "07AAACG2145K1Z6",
  buyerType: "Wholesaler",
  isDemo: true,
};

export interface SeedEvent {
  status: string;
  title: string;
  detail: string;
  at: string;
}

export interface SeedOrder {
  orderNo: string;
  status: string;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
  advancePaid: boolean;
  balancePaid: boolean;
  advanceMethod?: string;
  balanceMethod?: string;
  advanceRef?: string;
  balanceRef?: string;
  deliverySpeed: string;
  poNumber?: string;
  etaFrom?: string;
  etaTo?: string;
  deliveredAt?: string;
  items: { slug: string; qty: number }[];
  events: SeedEvent[];
}

export const SEED_ORDERS: SeedOrder[] = [
  {
    orderNo: "BS-2026-00847",
    status: "DELIVERED",
    createdAt: "2026-10-26T10:42:00+05:30",
    subtotal: 70500,
    deliveryFee: 0,
    advancePaid: true,
    balancePaid: false,
    advanceMethod: "UPI",
    advanceRef: "R-4410",
    deliverySpeed: "Standard",
    poNumber: "PO-2291",
    etaFrom: "2026-11-03",
    etaTo: "2026-11-05",
    deliveredAt: "2026-10-31T09:20:00+05:30",
    items: [
      { slug: "basmati-rice-premium-long-grain", qty: 500 },
      { slug: "arhar-toor-dal-unpolished", qty: 200 },
      { slug: "turmeric-powder-salem", qty: 100 },
    ],
    events: [
      { status: "PLACED", title: "Order placed — 10% advance paid", detail: "₹7,050 via UPI · receipt #R-4410 sent on email", at: "2026-10-26T10:42:00+05:30" },
      { status: "CONFIRMED", title: "Supplier confirmed", detail: "Shree Grain Mills Pvt. Ltd. · packing started", at: "2026-10-26T18:15:00+05:30" },
      { status: "DISPATCHED", title: "Packed & dispatched", detail: "26 packages · LR-8842 · e-way bill attached", at: "2026-10-28T11:05:00+05:30" },
      { status: "IN_TRANSIT", title: "Out for delivery", detail: "Vehicle DL-01-GX-4412 · driver +91 99100 55221", at: "2026-10-31T07:05:00+05:30" },
      { status: "DELIVERED", title: "Delivered — accepted by buyer", detail: "Signed: R. Gupta · Qty verified: 26/26 · No damage reported", at: "2026-10-31T09:20:00+05:30" },
    ],
  },
  {
    orderNo: "BS-2026-00612",
    status: "IN_TRANSIT",
    createdAt: "2026-10-29T15:10:00+05:30",
    subtotal: 23760,
    deliveryFee: 0,
    advancePaid: true,
    balancePaid: false,
    advanceMethod: "Card",
    advanceRef: "R-4389",
    deliverySpeed: "Standard",
    etaFrom: "2026-11-02",
    etaTo: "2026-11-03",
    items: [{ slug: "soyabean-refined-oil", qty: 12 }],
    events: [
      { status: "PLACED", title: "Order placed — 10% advance paid", detail: "₹2,376 via Card · receipt #R-4389 sent on email", at: "2026-10-29T15:10:00+05:30" },
      { status: "CONFIRMED", title: "Supplier confirmed", detail: "Goldfeed Oils Ltd. · Gau Shakti Dairy Foods", at: "2026-10-29T19:40:00+05:30" },
      { status: "DISPATCHED", title: "Packed & dispatched", detail: "14 packages · LR-9017 · e-way bill attached", at: "2026-10-30T09:55:00+05:30" },
      { status: "IN_TRANSIT", title: "In transit", detail: "Hub: Indore → Delhi · ETA 02–03 Nov", at: "2026-10-30T17:20:00+05:30" },
    ],
  },
  {
    orderNo: "BS-2026-00358",
    status: "COMPLETED",
    createdAt: "2026-09-02T12:22:00+05:30",
    subtotal: 18900,
    deliveryFee: 0,
    advancePaid: true,
    balancePaid: true,
    advanceMethod: "Netbanking",
    balanceMethod: "UPI",
    advanceRef: "R-3902",
    balanceRef: "R-3955",
    deliverySpeed: "Standard",
    etaFrom: "2026-09-05",
    etaTo: "2026-09-07",
    deliveredAt: "2026-09-06T14:05:00+05:30",
    items: [{ slug: "wheat-atta-chakki-fresh", qty: 500 }],
    events: [
      { status: "PLACED", title: "Order placed — 10% advance paid", detail: "₹1,890 via Netbanking · receipt #R-3902", at: "2026-09-02T12:22:00+05:30" },
      { status: "CONFIRMED", title: "Supplier confirmed", detail: "Annapurna Mills Pvt. Ltd.", at: "2026-09-02T16:00:00+05:30" },
      { status: "DISPATCHED", title: "Packed & dispatched", detail: "10 packages · LR-7088", at: "2026-09-04T10:30:00+05:30" },
      { status: "DELIVERED", title: "Delivered — accepted by buyer", detail: "Signed: R. Gupta · Qty verified: 10/10", at: "2026-09-06T14:05:00+05:30" },
      { status: "COMPLETED", title: "90% balance paid — order complete", detail: "₹17,010 via UPI · invoice BS/26/00358 issued", at: "2026-09-06T18:30:00+05:30" },
    ],
  },
];
