export type Zone = "local" | "interstate" | "international";
export type Category = "standard" | "fragile" | "perishable";

interface PricingInput {
  weightKg: number;
  zone: Zone;
  category: Category;
}

interface PricingResult {
  baseRate: number;
  weightCharge: number;
  categorySurcharge: number;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
}

const ZONE_BASE_RATES: Record<Zone, number> = {
  local: 1500,
  interstate: 3500,
  international: 12000,
};

const ZONE_WEIGHT_RATES: Record<Zone, number> = {
  local: 200,
  interstate: 450,
  international: 1800,
};

const CATEGORY_SURCHARGES: Record<Category, number> = {
  standard: 0,
  fragile: 500,
  perishable: 800,
};

const TAX_RATE = 0.075;

export function calculatePricing({
  weightKg,
  zone,
  category,
}: PricingInput): PricingResult {
  const baseRate = ZONE_BASE_RATES[zone];
  const weightCharge = Math.ceil(weightKg) * ZONE_WEIGHT_RATES[zone];
  const categorySurcharge = CATEGORY_SURCHARGES[category];

  const subtotal = baseRate + weightCharge + categorySurcharge;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return {
    baseRate,
    weightCharge,
    categorySurcharge,
    subtotal,
    tax,
    total,
    currency: "NGN",
  };
}

export function formatCurrency(amountKobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amountKobo / 100);
}

export function toKobo(naira: number): number {
  return Math.round(naira * 100);
}
