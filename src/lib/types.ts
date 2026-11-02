// Shared types used by API routes, stores and views.

export interface Slab {
  minQty: number;
  price: number;
}

export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  grade: string | null;
  category: string;
  department: string;
  packSize: string;
  unit: string;
  moq: number;
  basePrice: number;
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
  description: string | null;
  imageHint: string | null;
  imageUrl: string | null;
  featured: boolean;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  packSize: string;
  unit: string;
  qty: number; // in product unit
  slabs: Slab[]; // price ladder snapshot — lets the cart recompute slabs as qty changes
  slabPrice: number; // applied unit price at this qty
  amount: number; // qty * slabPrice
  supplierName: string;
  imageHint: string | null;
  moq: number;
  hsn: string;
}

export interface AddressDTO {
  businessName: string;
  gstin: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  landmark?: string;
}

export interface OrderEventDTO {
  status: string;
  title: string;
  detail: string;
  at: string;
}

export interface OrderItemDTO {
  productId: string;
  slug: string;
  name: string;
  packSize: string;
  unit: string;
  qty: number;
  slabPrice: number;
  amount: number;
  hsn: string;
  supplierName: string;
  imageHint: string | null;
}

export type PayMethod = "UPI" | "Card" | "Netbanking" | "Wallet";

export interface OrderDTO {
  id: string;
  orderNo: string;
  items: OrderItemDTO[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  advanceAmount: number;
  balanceAmount: number;
  advancePaid: boolean;
  balancePaid: boolean;
  advanceMethod: string | null;
  balanceMethod: string | null;
  advanceRef: string | null;
  balanceRef: string | null;
  status: string;
  address: AddressDTO;
  deliverySpeed: string;
  poNumber: string | null;
  deliveryNote: string | null;
  etaFrom: string | null;
  etaTo: string | null;
  deliveredAt: string | null;
  events: OrderEventDTO[];
  createdAt: string;
}

export interface SessionUserDTO {
  id: string;
  email: string;
  businessName: string;
  ownerName: string;
  mobile: string | null;
  gstin: string | null;
  buyerType: string;
  isDemo: boolean;
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PLACED: "PLACED",
  CONFIRMED: "SUPPLIER CONFIRMED",
  DISPATCHED: "DISPATCHED",
  IN_TRANSIT: "IN TRANSIT",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// Order of the fulfilment timeline
export const STATUS_FLOW = ["PLACED", "CONFIRMED", "DISPATCHED", "IN_TRANSIT", "DELIVERED", "COMPLETED"];
