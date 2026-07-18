"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "all" | "headwear" | "clothing" | "accessories" | "footwear";
type GhostLine = "all" | "male" | "female";
type PriceTier = "all" | "under" | "premium";
type SortMode = "featured" | "low" | "high";
type InfoPage = "shipping" | "returns" | "faq" | "contact" | "terms" | null;

type Product = {
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

type CartLine = { product: Product; size: string; quantity: number };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;

const products: Product[] = [
  {
    id: "shadow-cap",
    name: "SHADOW CAP",
    code: "GC-001",
    note: "Washed cotton / one size",
    category: "headwear",
    line: "unisex",
    price: 20,
    image: asset("/products/ghost-cap.png"),
    sizes: ["ONE SIZE"],
    tone: "#d2d1cc",
    description: "A low-profile six-panel cap with a soft washed finish and clean, unbranded construction.",
    details: ["100% cotton", "Adjustable back", "Curved peak"],
    badge: "NEW",
  },
  {
    id: "void-hoodie",
    name: "VOID HOODIE",
    code: "GC-002",
    note: "Heavyweight washed jersey",
    category: "clothing",
    line: "unisex",
    price: 68,
    image: asset("/products/ghost-hoodie.png"),
    sizes: ["XS", "S", "M", "L", "XL"],
    tone: "#cac9c4",
    description: "An oversized heavyweight hoodie cut with dropped shoulders and a deep mineral-black wash.",
    details: ["460 GSM jersey", "Oversized fit", "Garment washed"],
    badge: "BESTSELLER",
  },
  {
    id: "ghost-cassock",
    name: "GHOST CASSOCK",
    code: "GC-003",
    note: "Movement-ready stretch cassock",
    category: "clothing",
    line: "male",
    price: 148,
    image: asset("/products/male-ghost-cassock.png"),
    gallery: [asset("/products/ghost-cassock-detail.png"), asset("/editorial/ghost-male-field.png"), asset("/editorial/ghost-duo-field.png")],
    sizes: ["S", "M", "L", "XL"],
    tone: "#c5c4bf",
    description: "A fitted floor-length black cassock engineered for free movement, with an attached hood, articulated sleeves and clean athletic lines.",
    details: ["Four-way stretch shell", "Underarm gussets", "Two-way front closure", "Twin movement vents"],
    badge: "LIMITED",
  },
  {
    id: "signal-cargo",
    name: "SIGNAL CARGO",
    code: "GC-004",
    note: "Technical straight-leg trouser",
    category: "clothing",
    line: "male",
    price: 88,
    image: asset("/products/ghost-pants.png"),
    sizes: ["28", "30", "32", "34", "36"],
    tone: "#cecdc8",
    description: "A precise technical cargo with a straight leg, articulated pockets and adjustable hems.",
    details: ["Technical cotton blend", "Six pockets", "Adjustable hem"],
  },
  {
    id: "relic-chain",
    name: "RELIC CHAIN",
    code: "GC-005",
    note: "Oxidized silver finish",
    category: "accessories",
    line: "unisex",
    price: 46,
    image: asset("/products/ghost-necklace.png"),
    sizes: ["55 CM", "65 CM"],
    tone: "#d0d0cc",
    description: "A weighty oxidized chain finished with a sculpted relic pendant and darkened metal texture.",
    details: ["Stainless steel", "Oxidized finish", "Lobster clasp"],
  },
  {
    id: "veil-coat-dress",
    name: "VEIL COAT-DRESS",
    code: "GC-006",
    note: "Flowing performance silhouette",
    category: "clothing",
    line: "female",
    price: 138,
    image: asset("/products/female-ghost-coat.png"),
    gallery: [asset("/editorial/ghost-duo-field.png"), asset("/products/eclipse-veil.png")],
    sizes: ["XS", "S", "M", "L", "XL"],
    tone: "#c9c8c3",
    description: "A floor-length black coat-dress with a shaped waist, fluid skirt and split bell sleeves built over fitted inner cuffs.",
    details: ["Stretch jacquard shell", "Fitted inner sleeves", "Full movement skirt", "Invisible side pockets"],
    badge: "NEW",
  },
  {
    id: "shadow-mask",
    name: "SHADOW MASK",
    code: "GC-007",
    note: "Full-face stretch covering",
    category: "accessories",
    line: "unisex",
    price: 28,
    image: asset("/products/shadow-mask.png"),
    gallery: [asset("/editorial/ghost-male-field.png"), asset("/editorial/ghost-duo-field.png")],
    sizes: ["S/M", "L/XL"],
    tone: "#cac9c4",
    description: "A close-fitting matte-black face covering with clean eye openings and bonded seams for a seamless ghost silhouette.",
    details: ["Breathable stretch jersey", "Bonded low-profile seams", "Finished eye openings"],
  },
  {
    id: "specter-gloves",
    name: "SPECTER GLOVES",
    code: "GC-008",
    note: "Glossy black leather",
    category: "accessories",
    line: "unisex",
    price: 42,
    image: asset("/products/specter-gloves-leather.png"),
    gallery: [asset("/products/specter-gloves.png"), asset("/editorial/ghost-duo-field.png")],
    sizes: ["S", "M", "L", "XL"],
    tone: "#c8c7c2",
    description: "Close-fitting glossy black leather gloves cut for movement, grip and a polished continuation of the all-black uniform.",
    details: ["Supple black leather", "Controlled high-shine finish", "Close articulated fit"],
  },
  {
    id: "eclipse-veil",
    name: "ECLIPSE VEIL",
    code: "GC-009",
    note: "Hair-covering draped veil",
    category: "headwear",
    line: "female",
    price: 36,
    image: asset("/products/eclipse-veil.png"),
    gallery: [asset("/editorial/ghost-duo-field.png"), asset("/products/female-ghost-coat.png")],
    sizes: ["ONE SIZE"],
    tone: "#cfcec9",
    description: "A lightweight black draped veil that fully covers the hair, finished with a narrow ivory inner band around the face.",
    details: ["Lightweight matte weave", "Secure inner cap", "Full hair coverage"],
  },
  {
    id: "vans-old-skool",
    name: "VANS OLD SKOOL",
    code: "VN000D3HY28",
    note: "Black / suede & canvas",
    category: "footwear",
    line: "unisex",
    price: 85,
    image: asset("/products/vans-old-skool.jpg"),
    sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44"],
    tone: "#e8e4e1",
    description: "The original Vans Old Skool in black with the signature white Sidestripe and classic low-top construction.",
    details: ["Official style VN000D3HY28", "Suede and canvas upper", "Reinforced toe cap", "Signature waffle outsole"],
    badge: "ICON",
    sourceUrl: "https://www.vans.com/de-de/p/old-skool-schuhe-VN000D3HY28",
  },
  {
    id: "vans-sk8-hi",
    name: "VANS SKATE SK8-HI",
    code: "VN0A5FCCBKA",
    note: "Black / suede & canvas high-top",
    category: "footwear",
    line: "unisex",
    price: 95,
    image: asset("/products/vans-sk8-hi.jpg"),
    gallery: [asset("/products/vans-sk8-hi-alt1.jpg"), asset("/products/vans-sk8-hi-alt2.jpg")],
    sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44"],
    tone: "#e8e4e1",
    description: "The black Vans Skate Sk8-Hi: a high-top suede-and-canvas silhouette reinforced for skate performance and everyday wear.",
    details: ["Official style VN0A5FCCBKA", "Suede and canvas upper", "DURACAP reinforcement", "POPCUSH cushioning", "SICKSTICK rubber grip"],
    badge: "HIGH-TOP",
    sourceUrl: "https://www.vans.com/de-de/p/skate-sk8-hi-schuhe-VN0A5FCCBKA",
  },
];

const money = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const infoTitles: Record<Exclude<InfoPage, null>, string> = {
  shipping: "SHIPPING",
  returns: "RETURNS",
  faq: "FREQUENTLY ASKED",
  contact: "CONTACT",
  terms: "TERMS",
};

export default function Home() {
  const [category, setCategory] = useState<Category>("all");
  const [ghostLine, setGhostLine] = useState<GhostLine>("all");
  const [priceTier, setPriceTier] = useState<PriceTier>("all");
  const [sort, setSort] = useState<SortMode>("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const [productImageIndex, setProductImageIndex] = useState(0);
  const [size, setSize] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [infoPage, setInfoPage] = useState<InfoPage>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 420);
    try {
      const storedCart = window.localStorage.getItem("ghost-closet-cart");
      const storedFavorites = window.localStorage.getItem("ghost-closet-favorites");
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    } catch {
      // Keep the storefront usable if browser storage is unavailable.
    }
    setCartLoaded(true);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    window.localStorage.setItem("ghost-closet-cart", JSON.stringify(cart));
    window.localStorage.setItem("ghost-closet-favorites", JSON.stringify(favorites));
  }, [cart, favorites, cartLoaded]);

  const modalOpen = Boolean(!lightsOn || selected || cartOpen || menuOpen || searchOpen || infoPage || checkoutOpen);
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const lineMatch = ghostLine === "all" || product.line === ghostLine || product.line === "unisex";
      const priceMatch = priceTier === "all" || (priceTier === "under" ? product.price < 100 : product.price >= 100);
      return categoryMatch && lineMatch && priceMatch;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (ghostLine !== "all") return Number(b.line === ghostLine) - Number(a.line === ghostLine);
      return 0;
    });
  }, [category, ghostLine, priceTier, sort]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => `${product.name} ${product.note} ${product.category} ${product.line}`.toLowerCase().includes(normalized));
  }, [query]);

  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const selectedImages = selected ? [selected.image, ...(selected.gallery ?? [])] : [];

  function scrollToShop() {
    window.setTimeout(() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  function selectCategory(next: Category) {
    setCategory(next);
    if (next === "all") setGhostLine("all");
    closePanels();
    scrollToShop();
  }

  function selectGhostLine(next: GhostLine) {
    setGhostLine(next);
    setCategory("all");
    setPriceTier("all");
    closePanels();
    scrollToShop();
  }

  function openProduct(product: Product) {
    closePanels();
    setSelected(product);
    setProductImageIndex(0);
    setSize(product.sizes[0]);
  }

  function addToCart(product: Product) {
    const chosenSize = size || product.sizes[0];
    setCart((current) => {
      const index = current.findIndex((line) => line.product.id === product.id && line.size === chosenSize);
      if (index < 0) return [...current, { product, size: chosenSize, quantity: 1 }];
      return current.map((line, lineIndex) => lineIndex === index ? { ...line, quantity: line.quantity + 1 } : line);
    });
    setSelected(null);
    setCartOpen(true);
  }

  function updateQuantity(index: number, delta: number) {
    setCart((current) => current
      .map((line, lineIndex) => lineIndex === index ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function closePanels() {
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
    setInfoPage(null);
  }

  function openInfo(page: Exclude<InfoPage, null>) {
    closePanels();
    setInfoPage(page);
  }

  function startCheckout() {
    setCartOpen(false);
    setCheckoutStep(1);
    setCheckoutOpen(true);
  }

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
  }

  return (
    <main className={`${ready ? "site is-ready" : "site"} ${lightsOn ? "lights-on" : "lights-off"}`}>
      <div className="loader" aria-hidden="true"><span>GC</span></div>

      <div className={lightsOn ? "closet-entry is-lit" : "closet-entry"} role="dialog" aria-modal={!lightsOn} aria-labelledby="light-prompt-title" aria-hidden={lightsOn}>
        <div className="closet-doors" aria-hidden="true"><span /><span /></div>
        <div className="entry-glow" aria-hidden="true" />
        <div className="light-prompt">
          <p>GHOST CLOSET / LIGHT SYSTEM</p>
          <h2 id="light-prompt-title">IT’S DARK<br />IN HERE.</h2>
          <span className="prompt-copy">Switch on the neon to enter the closet.</span>
          <button onClick={() => setLightsOn(true)} autoFocus={!lightsOn}>
            <span className="switch-track" aria-hidden="true"><span /></span>
            TURN NEON LIGHTS ON
          </button>
        </div>
        <span className="entry-status">SYSTEM OFFLINE <i /> 00:00</span>
      </div>

      <div className="announcement">
        <span>DROP 001 IS LIVE</span><span>FREE DELIVERY OVER €150</span><span>14-DAY RETURNS</span>
      </div>

      <header className="topbar">
        <button className="brand" onClick={() => selectCategory("all")} aria-label="Ghost Closet home">
          GHOST<span>CLOSET</span>
        </button>
        <nav className="desktop-nav" aria-label="Shop collections">
          <button className={ghostLine === "all" && category === "all" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("all")}>SHOP ALL</button>
          <button className={ghostLine === "male" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("male")}>MALE GHOSTS</button>
          <button className={ghostLine === "female" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("female")}>FEMALE GHOSTS</button>
          <button className={category === "accessories" ? "nav-link active" : "nav-link"} onClick={() => selectCategory("accessories")}>ACCESSORIES</button>
        </nav>
        <div className="header-actions">
          <button className="light-toggle" onClick={() => setLightsOn(false)} aria-label="Turn neon lights off">
            <span aria-hidden="true" /> LIGHTS ON
          </button>
          <button className="text-action search-action" onClick={() => setSearchOpen(true)}>SEARCH</button>
          <button className="text-action menu-button" onClick={() => setMenuOpen(true)}>MENU</button>
          <button className="cart-button" onClick={() => setCartOpen(true)}>BAG [{String(itemCount).padStart(2, "0")}]</button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker reveal">GHOST CLOSET / DROP 001</p>
          <h1 id="hero-title"><span className="reveal">ENTER THE</span><span className="reveal delayed">CLOSET.</span></h1>
        </div>
        <div className="hero-object reveal delayed-more" aria-hidden="true">
          <span className="object-ring" />
          <img src={asset("/editorial/ghost-duo-cutout.png")} alt="" />
        </div>
        <div className="hero-bottom reveal delayed-more">
          <p>DARK ESSENTIALS.<br />ZERO DISTRACTIONS.</p>
          <button onClick={scrollToShop}>SHOP THE DROP ↓</button>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div>GHOST CLOSET — DARK ESSENTIALS — DROP 001 — GHOST CLOSET — DARK ESSENTIALS — DROP 001 —</div></div>

      <section className="ghost-lines" aria-labelledby="ghost-lines-title">
        <div className="ghost-lines-heading">
          <div><p className="eyebrow">TWO UNIFORMS / ONE CLOSET</p><h2 id="ghost-lines-title">CHOOSE YOUR GHOST.</h2></div>
          <p>LONG BLACK LAYERS.<br />BUILT TO MOVE.</p>
        </div>
        <div className="ghost-line-grid">
          <button onClick={() => selectGhostLine("male")} aria-label="Shop Male Ghosts">
            <img src={asset("/products/male-ghost-cassock.png")} alt="Male model wearing the Ghost Cassock" />
            <span><small>01 / UNIFORM</small><strong>MALE GHOSTS</strong><em>SHOP THE LINE ↗</em></span>
          </button>
          <button onClick={() => selectGhostLine("female")} aria-label="Shop Female Ghosts">
            <img src={asset("/products/female-ghost-coat.png")} alt="Female model wearing the Veil Coat-Dress" />
            <span><small>02 / UNIFORM</small><strong>FEMALE GHOSTS</strong><em>SHOP THE LINE ↗</em></span>
          </button>
        </div>
      </section>

      <section id="shop" className="collection" aria-labelledby="collection-title">
        <div className="shop-intro">
          <div><p className="eyebrow">THE COLLECTION</p><h2 id="collection-title">DROP 001</h2></div>
          <p>ELEVEN PIECES. TWO UNIFORMS.<br />BUILT ENTIRELY IN BLACK.</p>
        </div>

        <div className="ghost-line-tabs" aria-label="Ghost collection filter">
          {(["all", "male", "female"] as GhostLine[]).map((item) => (
            <button key={item} className={ghostLine === item ? "active" : ""} onClick={() => setGhostLine(item)}>
              {item === "all" ? "ALL GHOSTS" : `${item.toUpperCase()} GHOSTS`}
            </button>
          ))}
        </div>

        <div className="filter-bar">
          <div className="filter-group" aria-label="Category filter">
            {(["all", "headwear", "clothing", "accessories", "footwear"] as Category[]).map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="filter-tools">
            <div className="price-toggle">
              <button className={priceTier === "all" ? "active" : ""} onClick={() => setPriceTier("all")}>ALL PRICES</button>
              <button className={priceTier === "under" ? "active" : ""} onClick={() => setPriceTier("under")}>UNDER €100</button>
              <button className={priceTier === "premium" ? "active" : ""} onClick={() => setPriceTier("premium")}>€100+</button>
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Sort products">
              <option value="featured">FEATURED</option><option value="low">PRICE LOW–HIGH</option><option value="high">PRICE HIGH–LOW</option>
            </select>
          </div>
        </div>

        <div className="collection-count">{String(visibleProducts.length).padStart(2, "0")} RESULTS</div>
        {visibleProducts.length ? (
          <div className="product-grid" key={`${ghostLine}-${category}-${priceTier}-${sort}`}>
            {visibleProducts.map((product, index) => (
              <article className="product-card" key={product.id} style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}>
                <div className="product-visual">
                  <button className="product-image" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
                    <img src={product.image} alt={product.name} />
                    <span className="quick-view">QUICK VIEW ↗</span>
                  </button>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button className={favorites.includes(product.id) ? "favorite active" : "favorite"} onClick={() => toggleFavorite(product.id)} aria-label={`Save ${product.name}`}>♡</button>
                </div>
                <button className="product-meta" onClick={() => openProduct(product)}>
                  <span><strong>{product.name}</strong><small>{product.code} / {product.note}</small></span><strong>{money.format(product.price)}</strong>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results"><p>NO PIECES MATCH THIS FILTER.</p><button onClick={() => { setGhostLine("all"); setCategory("all"); setPriceTier("all"); }}>RESET FILTERS</button></div>
        )}
      </section>

      <section className="price-categories" aria-label="Shop by price">
        <button onClick={() => { setPriceTier("under"); scrollToShop(); }}><span>01</span><small>ESSENTIALS</small><strong>UNDER €100</strong><em>SHOP NOW ↗</em></button>
        <button onClick={() => { setPriceTier("premium"); scrollToShop(); }}><span>02</span><small>STATEMENT PIECES</small><strong>€100+</strong><em>SHOP NOW ↗</em></button>
      </section>

      <section className="campaign">
        <p className="eyebrow">GHOST CLOSET / UNIFORMS 01 + 02</p>
        <p className="campaign-copy">You can’t touch what you can’t see.<span> You’re a ghost now.</span></p>
        <button onClick={() => selectCategory("clothing")}>SHOP CLOTHING →</button>
      </section>

      <section className="service-grid">
        <button onClick={() => openInfo("shipping")}><span>01</span><strong>TRACKED DELIVERY</strong><p>Delivery estimates and tracking with every order.</p><em>READ MORE ↗</em></button>
        <button onClick={() => openInfo("returns")}><span>02</span><strong>14-DAY RETURNS</strong><p>Simple returns on unworn items in original condition.</p><em>READ MORE ↗</em></button>
        <button onClick={() => openInfo("contact")}><span>03</span><strong>SUPPORT</strong><p>Questions about sizing, delivery or an existing order.</p><em>CONTACT ↗</em></button>
      </section>

      <section className="newsletter">
        <div><p className="eyebrow">PRIVATE ACCESS</p><h2>{subscribed ? "YOU'RE ON THE LIST." : "ENTER BEFORE THE NEXT DROP."}</h2></div>
        {!subscribed && <form onSubmit={subscribe}><label htmlFor="newsletter-email">EMAIL ADDRESS</label><div><input id="newsletter-email" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="NAME@EMAIL.COM" /><button type="submit">JOIN →</button></div><small>DROP ALERTS ONLY. NO NOISE.</small></form>}
      </section>

      <footer>
        <div className="footer-top">
          <div><strong>SHOP</strong><button onClick={() => selectGhostLine("all")}>SHOP ALL</button><button onClick={() => selectGhostLine("male")}>MALE GHOSTS</button><button onClick={() => selectGhostLine("female")}>FEMALE GHOSTS</button><button onClick={() => selectCategory("accessories")}>ACCESSORIES</button></div>
          <div><strong>HELP</strong><button onClick={() => openInfo("shipping")}>SHIPPING</button><button onClick={() => openInfo("returns")}>RETURNS</button><button onClick={() => openInfo("faq")}>FAQ</button><button onClick={() => openInfo("contact")}>CONTACT</button></div>
          <div><strong>LEGAL</strong><button onClick={() => openInfo("terms")}>TERMS</button><button onClick={() => openInfo("terms")}>PRIVACY</button><button onClick={() => openInfo("terms")}>COOKIES</button></div>
          <p>GHOST CLOSET<br />BERLIN / WORLDWIDE</p>
        </div>
        <div className="footer-brand">GHOST CLOSET</div>
        <div className="footer-bottom"><span>© 2026 GHOST CLOSET</span><span>ALL PRICES EUR</span><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>BACK TO TOP ↑</button></div>
      </footer>

      {(menuOpen || cartOpen || searchOpen || infoPage) && <div className="overlay visible" onClick={closePanels} />}

      <aside className={menuOpen ? "side-panel menu-panel open" : "side-panel menu-panel"} aria-hidden={!menuOpen}>
        <button className="panel-close" onClick={closePanels}>CLOSE ×</button><p className="eyebrow">MENU</p>
        {(["all", "headwear", "clothing", "accessories", "footwear"] as Category[]).map((item, index) => <button className="menu-link" key={item} onClick={() => selectCategory(item)}><span>0{index + 1}</span>{item === "all" ? "SHOP ALL" : item.toUpperCase()}</button>)}
        <button className="menu-link" onClick={() => selectGhostLine("male")}><span>06</span>MALE GHOSTS</button>
        <button className="menu-link" onClick={() => selectGhostLine("female")}><span>07</span>FEMALE GHOSTS</button>
        <div className="menu-footer"><button onClick={() => openInfo("faq")}>FAQ</button><button onClick={() => openInfo("contact")}>CONTACT</button></div>
      </aside>

      <aside className={searchOpen ? "side-panel search-panel open" : "side-panel search-panel"} aria-hidden={!searchOpen}>
        <div className="panel-heading"><h2>SEARCH</h2><button className="panel-close" onClick={closePanels}>CLOSE ×</button></div>
        <label className="search-input"><span>SEARCH THE CLOSET</span><input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="TYPE HERE..." /></label>
        <div className="search-results"><p>{searchResults.length} RESULTS</p>{searchResults.map((product) => <button key={product.id} onClick={() => openProduct(product)}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.note}</small></span><strong>{money.format(product.price)}</strong></button>)}</div>
      </aside>

      <aside className={cartOpen ? "side-panel cart-panel open" : "side-panel cart-panel"} aria-hidden={!cartOpen}>
        <div className="panel-heading"><h2>YOUR BAG [{String(itemCount).padStart(2, "0")}]</h2><button className="panel-close" onClick={closePanels}>CLOSE ×</button></div>
        {cart.length === 0 ? <div className="empty-cart"><p>YOUR BAG IS EMPTY.</p><button onClick={closePanels}>RETURN TO SHOP</button></div> : <><div className="cart-lines">{cart.map((line, index) => <div className="cart-line" key={`${line.product.id}-${line.size}`}><img src={line.product.image} alt="" /><div><strong>{line.product.name}</strong><span>{line.size}</span><div className="quantity"><button onClick={() => updateQuantity(index, -1)}>−</button><span>{line.quantity}</span><button onClick={() => updateQuantity(index, 1)}>+</button></div></div><strong>{money.format(line.product.price * line.quantity)}</strong></div>)}</div><div className="cart-total"><div><span>SUBTOTAL</span><strong>{money.format(subtotal)}</strong></div><p>Taxes and delivery calculated at checkout.</p><button className="primary-button" onClick={startCheckout}>CHECKOUT →</button><button className="continue-button" onClick={closePanels}>CONTINUE SHOPPING</button></div></>}
      </aside>

      <aside className={infoPage ? "side-panel info-panel open" : "side-panel info-panel"} aria-hidden={!infoPage}>
        <button className="panel-close" onClick={closePanels}>CLOSE ×</button>{infoPage && <InfoContent page={infoPage} />}
      </aside>

      {selected && <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
        <button className="modal-close" onClick={() => setSelected(null)}>CLOSE ×</button>
        <div className="modal-image" style={{ background: selected.tone }}>
          <span>{selected.code}</span>
          <div className="modal-image-stage"><img key={selectedImages[productImageIndex]} src={selectedImages[productImageIndex] ?? selected.image} alt={`${selected.name} view ${productImageIndex + 1}`} /></div>
          {selectedImages.length > 1 && <div className="modal-thumbnails" aria-label={`${selected.name} image gallery`}>
            {selectedImages.map((image, index) => <button key={`${image}-${index}`} className={productImageIndex === index ? "active" : ""} onClick={() => setProductImageIndex(index)} aria-label={`View image ${index + 1} of ${selectedImages.length}`}><img src={image} alt="" /></button>)}
          </div>}
        </div>
        <div className="modal-info"><p className="eyebrow">GHOST CLOSET / {selected.category}</p><div className="product-title-row"><h2>{selected.name}</h2><button className={favorites.includes(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)}>♡</button></div><p className="modal-price">{money.format(selected.price)}</p><p className="description">{selected.description}</p><fieldset><legend>SELECT SIZE</legend><div className="size-row">{selected.sizes.map((item) => <button key={item} className={size === item ? "selected" : ""} onClick={() => setSize(item)}>{item}</button>)}</div></fieldset><button className="primary-button" onClick={() => addToCart(selected)}>ADD TO BAG — {money.format(selected.price)}</button><details open><summary>DETAILS</summary><ul>{selected.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>{selected.sourceUrl && <a className="source-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">OFFICIAL PRODUCT SOURCE ↗</a>}</details><details><summary>DELIVERY + RETURNS</summary><p>Tracked delivery. Return eligible items within 14 days of receipt.</p></details></div>
      </div>}

      {checkoutOpen && <div className="checkout-modal" role="dialog" aria-modal="true" aria-label="Checkout">
        <header><strong>GHOST CLOSET</strong><span>SECURE CHECKOUT</span><button onClick={() => setCheckoutOpen(false)}>CLOSE ×</button></header>
        <div className="checkout-main">
          {checkoutStep === 1 && <div className="checkout-form"><p className="eyebrow">STEP 01 / 02</p><h2>DELIVERY</h2><label>EMAIL<input type="email" placeholder="EMAIL ADDRESS" /></label><div className="field-pair"><label>FIRST NAME<input placeholder="FIRST NAME" /></label><label>LAST NAME<input placeholder="LAST NAME" /></label></div><label>ADDRESS<input placeholder="STREET AND NUMBER" /></label><div className="field-pair"><label>CITY<input placeholder="CITY" /></label><label>POSTCODE<input placeholder="POSTCODE" /></label></div><label>COUNTRY<select defaultValue="DE"><option value="DE">GERMANY</option><option value="US">UNITED STATES</option><option value="LB">LEBANON</option><option value="GB">UNITED KINGDOM</option></select></label><button className="primary-button" onClick={() => setCheckoutStep(2)}>CONTINUE TO PAYMENT →</button></div>}
          {checkoutStep === 2 && <div className="checkout-form"><p className="eyebrow">STEP 02 / 02</p><h2>PAYMENT</h2><div className="demo-notice">DEMO CHECKOUT — NO PAYMENT WILL BE CAPTURED</div><label>CARD NUMBER<input placeholder="0000 0000 0000 0000" inputMode="numeric" /></label><div className="field-pair"><label>EXPIRY<input placeholder="MM / YY" /></label><label>CVC<input placeholder="CVC" /></label></div><label className="check-label"><input type="checkbox" /> BILLING ADDRESS IS THE SAME</label><button className="primary-button" onClick={() => setCheckoutStep(3)}>PLACE DEMO ORDER — {money.format(subtotal)}</button><button className="back-button" onClick={() => setCheckoutStep(1)}>← BACK TO DELIVERY</button></div>}
          {checkoutStep === 3 && <div className="order-success"><span>✓</span><p className="eyebrow">DEMO ORDER COMPLETE</p><h2>THE ORDER FLOW WORKS.</h2><p>No payment was captured. Connect a payment provider and fulfillment system before accepting live orders.</p><button className="primary-button" onClick={() => { setCheckoutOpen(false); setCheckoutStep(1); }}>RETURN TO STORE</button></div>}
        </div>
        <aside className="checkout-summary"><p className="eyebrow">ORDER SUMMARY</p>{cart.map((line) => <div key={`${line.product.id}-${line.size}`}><img src={line.product.image} alt="" /><span><strong>{line.product.name}</strong><small>{line.size} / QTY {line.quantity}</small></span><strong>{money.format(line.product.price * line.quantity)}</strong></div>)}<dl><dt>SUBTOTAL</dt><dd>{money.format(subtotal)}</dd><dt>DELIVERY</dt><dd>CALCULATED</dd><dt>TOTAL</dt><dd>{money.format(subtotal)}</dd></dl></aside>
      </div>}
    </main>
  );
}

function InfoContent({ page }: { page: Exclude<InfoPage, null> }) {
  return <div className="info-content"><p className="eyebrow">GHOST CLOSET / HELP</p><h2>{infoTitles[page]}</h2>{page === "shipping" && <><p>Every order receives tracked delivery. Exact cost and estimated delivery window are calculated at checkout after you enter your destination.</p><div className="info-rows"><div><span>GERMANY</span><strong>2–4 BUSINESS DAYS</strong></div><div><span>EUROPE</span><strong>3–7 BUSINESS DAYS</strong></div><div><span>INTERNATIONAL</span><strong>7–14 BUSINESS DAYS</strong></div></div></>}{page === "returns" && <><p>Eligible items can be returned within 14 days of delivery. Products must be unworn, unwashed and returned with original packaging and tags.</p><div className="info-rows"><div><span>01</span><strong>REQUEST A RETURN</strong></div><div><span>02</span><strong>PACK THE ITEM</strong></div><div><span>03</span><strong>TRACK THE PARCEL</strong></div></div></>}{page === "faq" && <div className="faq-list"><details open><summary>HOW DO I CHOOSE A SIZE?</summary><p>Use the fit notes on each product page. A full measurement chart will be added for every live supplier product.</p></details><details><summary>CAN I CHANGE MY ORDER?</summary><p>Contact support immediately. Changes are possible only before fulfillment begins.</p></details><details><summary>HOW DO I TRACK DELIVERY?</summary><p>A tracking link is sent by email as soon as the order leaves the fulfillment location.</p></details><details><summary>DO YOU SHIP WORLDWIDE?</summary><p>International availability and rates depend on the product and destination.</p></details></div>}{page === "contact" && <><p>For product, sizing, delivery or order questions, contact Ghost Closet support.</p><a className="contact-link" href="mailto:store@ghostcloset.com">STORE@GHOSTCLOSET.COM ↗</a><p className="small-copy">RESPONSE TARGET: 1–2 BUSINESS DAYS<br />MONDAY–FRIDAY</p></>}{page === "terms" && <><p>Ghost Closet is currently a storefront demonstration. Live payment, final supplier details, tax information, privacy policy and legally reviewed sales terms must be connected before commercial launch.</p><div className="info-rows"><div><span>STATUS</span><strong>DEMONSTRATION</strong></div><div><span>PAYMENTS</span><strong>NOT YET CAPTURED</strong></div><div><span>LAST UPDATED</span><strong>JULY 2026</strong></div></div></>}</div>;
}
