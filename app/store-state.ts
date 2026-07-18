import {
  MAX_QUANTITY,
  productById,
  validProductIds,
  type CartLine,
  type StoredCartLine,
} from "./store-data";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeQuantity(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(parsed)));
}

export function normalizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const merged = new Map<string, CartLine>();
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const legacyProduct = isRecord(entry.product) ? entry.product : null;
    const id = typeof entry.productId === "string"
      ? entry.productId
      : typeof legacyProduct?.id === "string"
        ? legacyProduct.id
        : "";
    const product = productById.get(id);
    if (!product) continue;

    const size = typeof entry.size === "string" && product.sizes.includes(entry.size)
      ? entry.size
      : product.sizes[0];
    const quantity = normalizeQuantity(entry.quantity);
    const key = `${product.id}:${size}`;
    const current = merged.get(key);
    merged.set(key, {
      product,
      size,
      quantity: Math.min(MAX_QUANTITY, (current?.quantity ?? 0) + quantity),
    });
  }
  return [...merged.values()];
}

export function normalizeFavorites(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && validProductIds.has(id)))];
}

export function serializeCart(cart: CartLine[]): StoredCartLine[] {
  return cart.map(({ product, size, quantity }) => ({ productId: product.id, size, quantity }));
}
