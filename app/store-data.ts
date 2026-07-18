export type Category = "all" | "headwear" | "clothing" | "accessories" | "footwear";
export type GhostLine = "all" | "male" | "female";
export type PriceTier = "all" | "under" | "premium";
export type SortMode = "featured" | "low" | "high";
export type InfoPage = "shipping" | "returns" | "faq" | "contact" | "terms" | "privacy" | "cookies" | null;

export type Product = {
  id: string;
  name: string;
  code: string;
  note: string;
  category: Exclude<Category, "all">;
  line: Exclude<GhostLine, "all"> | "unisex";
  price: number;
  image: string;
  gallery?: string[];
  sizes: string[];
  tone: string;
  description: string;
  details: string[];
  badge?: string;
  sourceUrl?: string;
};

export type CartLine = { product: Product; size: string; quantity: number };
export type StoredCartLine = { productId: string; size: string; quantity: number };

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;
export const CART_KEY = "ghost-closet-cart-v2";
export const LEGACY_CART_KEY = "ghost-closet-cart";
export const FAVORITES_KEY = "ghost-closet-favorites";
export const MAX_QUANTITY = 20;

export const products: Product[] = [
  {
    id: "shadow-cap", name: "SHADOW CAP", code: "GC-001", note: "Washed cotton / one size",
    category: "headwear", line: "unisex", price: 20, image: asset("/products/ghost-cap.png"),
    sizes: ["ONE SIZE"], tone: "#d2d1cc",
    description: "A low-profile six-panel cap with a soft washed finish and clean, unbranded construction.",
    details: ["100% cotton", "Adjustable back", "Curved peak"], badge: "NEW",
  },
  {
    id: "void-hoodie", name: "VOID HOODIE", code: "GC-002", note: "Heavyweight washed jersey",
    category: "clothing", line: "unisex", price: 68, image: asset("/products/ghost-hoodie.png"),
    sizes: ["XS", "S", "M", "L", "XL"], tone: "#cac9c4",
    description: "An oversized heavyweight hoodie cut with dropped shoulders and a deep mineral-black wash.",
    details: ["460 GSM jersey", "Oversized fit", "Garment washed"], badge: "BESTSELLER",
  },
  {
    id: "ghost-cassock", name: "GHOST CASSOCK", code: "GC-003", note: "Movement-ready stretch cassock",
    category: "clothing", line: "male", price: 148, image: asset("/products/male-ghost-cassock.png"),
    gallery: [asset("/products/ghost-cassock-detail.png"), asset("/editorial/ghost-male-field.png"), asset("/editorial/ghost-duo-field.png")],
    sizes: ["S", "M", "L", "XL"], tone: "#c5c4bf",
    description: "A fitted floor-length black cassock engineered for free movement, with an attached hood, articulated sleeves and clean athletic lines.",
    details: ["Four-way stretch shell", "Underarm gussets", "Two-way front closure", "Twin movement vents"], badge: "LIMITED",
  },
  {
    id: "signal-cargo", name: "SIGNAL CARGO", code: "GC-004", note: "Technical straight-leg trouser",
    category: "clothing", line: "male", price: 88, image: asset("/products/ghost-pants.png"),
    sizes: ["28", "30", "32", "34", "36"], tone: "#cecdc8",
    description: "A precise technical cargo with a straight leg, articulated pockets and adjustable hems.",
    details: ["Technical cotton blend", "Six pockets", "Adjustable hem"],
  },
  {
    id: "relic-chain", name: "RELIC CHAIN", code: "GC-005", note: "Oxidized silver finish",
    category: "accessories", line: "unisex", price: 46, image: asset("/products/ghost-necklace.png"),
    sizes: ["55 CM", "65 CM"], tone: "#d0d0cc",
    description: "A weighty oxidized chain finished with a sculpted relic pendant and darkened metal texture.",
    details: ["Stainless steel", "Oxidized finish", "Lobster clasp"],
  },
  {
    id: "veil-coat-dress", name: "VEIL COAT-DRESS", code: "GC-006", note: "Flowing performance silhouette",
    category: "clothing", line: "female", price: 138, image: asset("/products/female-ghost-coat.png"),
    gallery: [asset("/editorial/ghost-duo-field.png"), asset("/products/eclipse-veil.png")],
    sizes: ["XS", "S", "M", "L", "XL"], tone: "#c9c8c3",
    description: "A floor-length black coat-dress with a shaped waist, fluid skirt and split bell sleeves built over fitted inner cuffs.",
    details: ["Stretch jacquard shell", "Fitted inner sleeves", "Full movement skirt", "Invisible side pockets"], badge: "NEW",
  },
  {
    id: "shadow-mask", name: "SHADOW MASK", code: "GC-007", note: "Full-face stretch covering",
    category: "accessories", line: "unisex", price: 28, image: asset("/products/shadow-mask.png"),
    gallery: [asset("/editorial/ghost-male-field.png"), asset("/editorial/ghost-duo-field.png")],
    sizes: ["S/M", "L/XL"], tone: "#cac9c4",
    description: "A close-fitting matte-black face covering with clean eye openings and bonded seams for a seamless ghost silhouette.",
    details: ["Breathable stretch jersey", "Bonded low-profile seams", "Finished eye openings"],
  },
  {
    id: "specter-gloves", name: "SPECTER GLOVES", code: "GC-008", note: "Glossy black leather only",
    category: "accessories", line: "unisex", price: 42, image: asset("/products/specter-gloves-leather.png"),
    sizes: ["S", "M", "L", "XL"], tone: "#c8c7c2",
    description: "Close-fitting glossy black leather gloves cut for movement, grip and a polished continuation of the all-black uniform.",
    details: ["Supple black leather", "Controlled high-shine finish", "Close articulated fit"],
  },
  {
    id: "eclipse-veil", name: "ECLIPSE VEIL", code: "GC-009", note: "Hair-covering draped veil",
    category: "headwear", line: "female", price: 36, image: asset("/products/eclipse-veil.png"),
    gallery: [asset("/editorial/ghost-duo-field.png"), asset("/products/female-ghost-coat.png")],
    sizes: ["ONE SIZE"], tone: "#cfcec9",
    description: "A lightweight black draped veil that fully covers the hair, finished with a narrow ivory inner band around the face.",
    details: ["Lightweight matte weave", "Secure inner cap", "Full hair coverage"],
  },
  {
    id: "vans-old-skool", name: "VANS OLD SKOOL", code: "VN000D3HY28", note: "Black / suede & canvas",
    category: "footwear", line: "unisex", price: 85, image: asset("/products/vans-old-skool.jpg"),
    sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44"], tone: "#e8e4e1",
    description: "The original Vans Old Skool in black with the signature white Sidestripe and classic low-top construction.",
    details: ["Official style VN000D3HY28", "Suede and canvas upper", "Reinforced toe cap", "Signature waffle outsole"],
    badge: "ICON", sourceUrl: "https://www.vans.com/de-de/p/old-skool-schuhe-VN000D3HY28",
  },
  {
    id: "vans-sk8-hi", name: "VANS SKATE SK8-HI", code: "VN0A5FCCBKA", note: "Black / suede & canvas high-top",
    category: "footwear", line: "unisex", price: 95, image: asset("/products/vans-sk8-hi.jpg"),
    gallery: [asset("/products/vans-sk8-hi-alt1.jpg"), asset("/products/vans-sk8-hi-alt2.jpg")],
    sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44"], tone: "#e8e4e1",
    description: "The black Vans Skate Sk8-Hi: a high-top suede-and-canvas silhouette reinforced for skate performance and everyday wear.",
    details: ["Official style VN0A5FCCBKA", "Suede and canvas upper", "DURACAP reinforcement", "POPCUSH cushioning", "SICKSTICK rubber grip"],
    badge: "HIGH-TOP", sourceUrl: "https://www.vans.com/de-de/p/skate-sk8-hi-schuhe-VN0A5FCCBKA",
  },
];

export const productById = new Map(products.map((product) => [product.id, product]));
export const validProductIds = new Set(products.map((product) => product.id));

export const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const infoTitles: Record<Exclude<InfoPage, null>, string> = {
  shipping: "SHIPPING",
  returns: "RETURNS",
  faq: "FREQUENTLY ASKED",
  contact: "CONTACT",
  terms: "TERMS",
  privacy: "PRIVACY",
  cookies: "COOKIES",
};
