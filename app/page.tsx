"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { InfoContent } from "./info-content";
import {
  BASE_PATH, CART_KEY, FAVORITES_KEY, LEGACY_CART_KEY, MAX_QUANTITY, asset, infoTitles, money, products,
  type CartLine, type Category, type GhostLine, type InfoPage, type PriceTier, type Product, type SortMode,
} from "./store-data";
import { normalizeCart, normalizeFavorites, serializeCart } from "./store-state";

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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 420);

    try {
      const storedCart = window.localStorage.getItem(CART_KEY) ?? window.localStorage.getItem(LEGACY_CART_KEY);
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedCart) setCart(normalizeCart(JSON.parse(storedCart)));
      if (storedFavorites) setFavorites(normalizeFavorites(JSON.parse(storedFavorites)));
    } catch {
      setCart([]);
      setFavorites([]);
    } finally {
      setCartLoaded(true);
    }

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cartLoaded) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(serializeCart(cart)));
      window.localStorage.removeItem(LEGACY_CART_KEY);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Storage can be blocked in private or restricted browsing modes.
    }
  }, [cart, favorites, cartLoaded]);

  const modalOpen = Boolean(selected || cartOpen || menuOpen || searchOpen || infoPage || checkoutOpen);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = modalOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [searchOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (selected) {
        setSelected(null);
        return;
      }
      if (checkoutOpen) {
        setCheckoutOpen(false);
        return;
      }
      closePanels();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected, checkoutOpen]);

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
    return products.filter((product) =>
      `${product.name} ${product.code} ${product.note} ${product.category} ${product.line}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const selectedImages = selected
    ? [...new Set([selected.image, ...(selected.gallery ?? [])])]
    : [];

  function scrollToShop() {
    window.setTimeout(() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }), 40);
  }

  function closePanels() {
    setCartOpen(false);
    setMenuOpen(false);
    setSearchOpen(false);
    setInfoPage(null);
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

  function selectPriceTier(next: PriceTier) {
    setPriceTier(next);
    setCategory("all");
    setGhostLine("all");
    closePanels();
    scrollToShop();
  }

  function openProduct(product: Product) {
    closePanels();
    setCheckoutOpen(false);
    setSelected(product);
    setProductImageIndex(0);
    setSize(product.sizes[0]);
  }

  function addToCart(product: Product) {
    const chosenSize = product.sizes.includes(size) ? size : product.sizes[0];
    setCart((current) => {
      const index = current.findIndex((line) => line.product.id === product.id && line.size === chosenSize);
      if (index < 0) return [...current, { product, size: chosenSize, quantity: 1 }];
      return current.map((line, lineIndex) =>
        lineIndex === index
          ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) }
          : line,
      );
    });
    setSelected(null);
    setCartOpen(true);
  }

  function updateQuantity(index: number, delta: number) {
    setCart((current) => current
      .map((line, lineIndex) =>
        lineIndex === index
          ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + delta) }
          : line,
      )
      .filter((line) => line.quantity > 0));
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  }

  function openInfo(page: Exclude<InfoPage, null>) {
    setSelected(null);
    setCheckoutOpen(false);
    closePanels();
    setInfoPage(page);
  }

  function startCheckout() {
    if (!cart.length) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
  }

  return (
    <main className={ready ? "site is-ready lights-on" : "site lights-off"}>
      <div className="loader" aria-hidden="true"><span>GC</span></div>

      <div className="announcement">
        <span>DROP 001 PREVIEW</span><span>SECURE OFFICIAL-STORE CHECKOUT</span><span>NO CARD DATA COLLECTED HERE</span>
      </div>

      <header className="topbar">
        <button type="button" className="brand" onClick={() => selectCategory("all")} aria-label="Ghost Closet home">
          GHOST<span>CLOSET</span>
        </button>
        <nav className="desktop-nav" aria-label="Shop collections">
          <button type="button" className={ghostLine === "all" && category === "all" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("all")}>SHOP ALL</button>
          <button type="button" className={ghostLine === "male" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("male")}>MALE GHOSTS</button>
          <button type="button" className={ghostLine === "female" ? "nav-link active" : "nav-link"} onClick={() => selectGhostLine("female")}>FEMALE GHOSTS</button>
          <button type="button" className={category === "accessories" ? "nav-link active" : "nav-link"} onClick={() => selectCategory("accessories")}>ACCESSORIES</button>
        </nav>
        <div className="header-actions">
          <a className="text-action story-action" href={`${BASE_PATH}/story/`}>STORY</a>
          <span className="light-toggle" aria-label="Neon lights are on"><span aria-hidden="true" /> LIGHTS ON</span>
          <button type="button" className="text-action search-action" onClick={() => setSearchOpen(true)} aria-expanded={searchOpen}>SEARCH</button>
          <button type="button" className="text-action menu-button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen}>MENU</button>
          <button type="button" className="cart-button" onClick={() => setCartOpen(true)} aria-expanded={cartOpen}>BAG [<span aria-live="polite">{String(itemCount).padStart(2, "0")}</span>]</button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker reveal">GHOST CLOSET / DROP 001</p>
          <h1 id="hero-title"><span className="reveal">ENTER THE</span><span className="reveal delayed">CLOSET.</span></h1>
        </div>
        <div className="hero-object reveal delayed-more" aria-hidden="true">
          <span className="object-ring" />
          <img src={asset("/editorial/ghost-duo-cutout.png")} alt="" decoding="async" fetchPriority="high" />
        </div>
        <div className="hero-bottom reveal delayed-more">
          <p>DARK ESSENTIALS.<br />ZERO DISTRACTIONS.</p>
          <button type="button" onClick={scrollToShop}>SHOP THE DROP ↓</button>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div>GHOST CLOSET — DARK ESSENTIALS — DROP 001 — GHOST CLOSET — DARK ESSENTIALS — DROP 001 —</div></div>

      <section className="ghost-lines" aria-labelledby="ghost-lines-title">
        <div className="ghost-lines-heading">
          <div><p className="eyebrow">TWO UNIFORMS / ONE CLOSET</p><h2 id="ghost-lines-title">CHOOSE YOUR GHOST.</h2></div>
          <p>LONG BLACK LAYERS.<br />BUILT TO MOVE.</p>
        </div>
        <div className="ghost-line-grid">
          <button type="button" onClick={() => selectGhostLine("male")} aria-label="Shop Male Ghosts">
            <img src={asset("/products/male-ghost-cassock.png")} alt="Male masked model wearing the Ghost Cassock" loading="lazy" decoding="async" />
            <span><small>01 / UNIFORM</small><strong>MALE GHOSTS</strong><em>SHOP THE LINE ↗</em></span>
          </button>
          <button type="button" onClick={() => selectGhostLine("female")} aria-label="Shop Female Ghosts">
            <img src={asset("/products/female-ghost-coat.png")} alt="Female masked model wearing the Veil Coat-Dress" loading="lazy" decoding="async" />
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
            <button type="button" key={item} className={ghostLine === item ? "active" : ""} onClick={() => selectGhostLine(item)}>
              {item === "all" ? "ALL GHOSTS" : `${item.toUpperCase()} GHOSTS`}
            </button>
          ))}
        </div>

        <div className="filter-bar">
          <div className="filter-group" aria-label="Category filter">
            {(["all", "headwear", "clothing", "accessories", "footwear"] as Category[]).map((item) => (
              <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="filter-tools">
            <div className="price-toggle" aria-label="Price filter">
              <button type="button" className={priceTier === "all" ? "active" : ""} onClick={() => setPriceTier("all")}>ALL PRICES</button>
              <button type="button" className={priceTier === "under" ? "active" : ""} onClick={() => setPriceTier("under")}>UNDER €100</button>
              <button type="button" className={priceTier === "premium" ? "active" : ""} onClick={() => setPriceTier("premium")}>€100+</button>
            </div>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Sort products">
              <option value="featured">FEATURED</option><option value="low">PRICE LOW–HIGH</option><option value="high">PRICE HIGH–LOW</option>
            </select>
          </div>
        </div>

        <div className="collection-count" aria-live="polite">{String(visibleProducts.length).padStart(2, "0")} RESULTS</div>
        {visibleProducts.length ? (
          <div className="product-grid" key={`${ghostLine}-${category}-${priceTier}-${sort}`}>
            {visibleProducts.map((product, index) => (
              <article className="product-card" key={product.id} style={{ "--delay": `${index * 55}ms` } as CSSProperties}>
                <div className="product-visual">
                  <button type="button" className="product-image" onClick={() => openProduct(product)} aria-label={`View ${product.name}`}>
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    <span className="quick-view">QUICK VIEW ↗</span>
                  </button>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <button type="button" className={favorites.includes(product.id) ? "favorite active" : "favorite"} onClick={() => toggleFavorite(product.id)} aria-label={`Save ${product.name}`} aria-pressed={favorites.includes(product.id)}>♡</button>
                </div>
                <button type="button" className="product-meta" onClick={() => openProduct(product)}>
                  <span><strong>{product.name}</strong><small>{product.code} / {product.note}</small></span><strong>{money.format(product.price)}</strong>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-results"><p>NO PIECES MATCH THIS FILTER.</p><button type="button" onClick={() => { setGhostLine("all"); setCategory("all"); setPriceTier("all"); }}>RESET FILTERS</button></div>
        )}
      </section>

      <section className="price-categories" aria-label="Shop by price">
        <button type="button" onClick={() => selectPriceTier("under")}><span>01</span><small>ESSENTIALS</small><strong>UNDER €100</strong><em>SHOP NOW ↗</em></button>
        <button type="button" onClick={() => selectPriceTier("premium")}><span>02</span><small>STATEMENT PIECES</small><strong>€100+</strong><em>SHOP NOW ↗</em></button>
      </section>

      <section className="campaign">
        <p className="eyebrow">GHOST CLOSET / UNIFORMS 01 + 02</p>
        <p className="campaign-copy">Some people wear clothes.<span>WE WEAR PRESENCE.</span></p>
        <button type="button" onClick={() => selectCategory("clothing")}>SHOP CLOTHING →</button>
      </section>

      <section className="service-grid">
        <button type="button" onClick={() => openInfo("shipping")}><span>01</span><strong>RETAILER DELIVERY</strong><p>Live delivery cost and tracking appear at the official seller checkout.</p><em>READ MORE ↗</em></button>
        <button type="button" onClick={() => openInfo("returns")}><span>02</span><strong>RETAILER RETURNS</strong><p>Returns follow the official seller’s published policy.</p><em>READ MORE ↗</em></button>
        <button type="button" onClick={() => openInfo("terms")}><span>03</span><strong>SECURE BY DESIGN</strong><p>Ghost Closet never asks for card details on this static storefront.</p><em>SECURITY ↗</em></button>
      </section>

      <section className="newsletter">
        <div><p className="eyebrow">PRIVATE ACCESS</p><h2 aria-live="polite">{subscribed ? "SIGNUP PREVIEW COMPLETE." : "ENTER BEFORE THE NEXT DROP."}</h2></div>
        {!subscribed ? (
          <form onSubmit={subscribe}>
            <label htmlFor="newsletter-email">EMAIL ADDRESS</label>
            <div><input id="newsletter-email" name="email" type="email" autoComplete="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="NAME@EMAIL.COM" /><button type="submit">JOIN →</button></div>
            <small>STATIC PREVIEW — NO EMAIL IS TRANSMITTED.</small>
          </form>
        ) : <p className="newsletter-status">NO EMAIL WAS SENT OR STORED. CONNECT A CONSENT-AWARE NEWSLETTER PROVIDER BEFORE LAUNCH.</p>}
      </section>

      <footer>
        <div className="footer-top">
          <div><strong>SHOP</strong><button type="button" onClick={() => selectGhostLine("all")}>SHOP ALL</button><button type="button" onClick={() => selectGhostLine("male")}>MALE GHOSTS</button><button type="button" onClick={() => selectGhostLine("female")}>FEMALE GHOSTS</button><button type="button" onClick={() => selectCategory("accessories")}>ACCESSORIES</button></div>
          <div><strong>HELP</strong><button type="button" onClick={() => openInfo("shipping")}>SHIPPING</button><button type="button" onClick={() => openInfo("returns")}>RETURNS</button><button type="button" onClick={() => openInfo("faq")}>FAQ</button><button type="button" onClick={() => openInfo("contact")}>CONTACT</button></div>
          <div><strong>LEGAL</strong><button type="button" onClick={() => openInfo("terms")}>TERMS</button><button type="button" onClick={() => openInfo("privacy")}>PRIVACY</button><button type="button" onClick={() => openInfo("cookies")}>COOKIES</button></div>
          <p>GHOST CLOSET<br />BERLIN / WORLDWIDE</p>
        </div>
        <div className="footer-brand">GHOST CLOSET</div>
        <div className="footer-bottom"><span>© 2026 GHOST CLOSET</span><span>ALL PRICES EUR</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>BACK TO TOP ↑</button></div>
      </footer>

      {(menuOpen || cartOpen || searchOpen || infoPage) && <div className="overlay visible" onClick={closePanels} aria-hidden="true" />}

      {menuOpen && <aside className="side-panel menu-panel open" role="dialog" aria-modal="true" aria-label="Store menu">
        <button type="button" className="panel-close" onClick={closePanels}>CLOSE ×</button><p className="eyebrow">MENU</p>
        {(["all", "headwear", "clothing", "accessories", "footwear"] as Category[]).map((item, index) => <button type="button" className="menu-link" key={item} onClick={() => selectCategory(item)}><span>0{index + 1}</span>{item === "all" ? "SHOP ALL" : item.toUpperCase()}</button>)}
        <button type="button" className="menu-link" onClick={() => selectGhostLine("male")}><span>06</span>MALE GHOSTS</button>
        <button type="button" className="menu-link" onClick={() => selectGhostLine("female")}><span>07</span>FEMALE GHOSTS</button>
        <div className="menu-footer"><a href={`${BASE_PATH}/story/`}>STORY</a><button type="button" onClick={() => openInfo("faq")}>FAQ</button><button type="button" onClick={() => openInfo("contact")}>CONTACT</button></div>
      </aside>}

      {searchOpen && <aside className="side-panel search-panel open" role="dialog" aria-modal="true" aria-label="Search products">
        <div className="panel-heading"><h2>SEARCH</h2><button type="button" className="panel-close" onClick={closePanels}>CLOSE ×</button></div>
        <label className="search-input"><span>SEARCH THE CLOSET</span><input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="TYPE HERE..." /></label>
        <div className="search-results"><p aria-live="polite">{searchResults.length} RESULTS</p>{searchResults.map((product) => <button type="button" key={product.id} onClick={() => openProduct(product)}><img src={product.image} alt="" loading="lazy" decoding="async" /><span><strong>{product.name}</strong><small>{product.note}</small></span><strong>{money.format(product.price)}</strong></button>)}</div>
      </aside>}

      {cartOpen && <aside className="side-panel cart-panel open" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <div className="panel-heading"><h2>YOUR BAG [{String(itemCount).padStart(2, "0")}]</h2><button type="button" className="panel-close" onClick={closePanels}>CLOSE ×</button></div>
        {cart.length === 0 ? <div className="empty-cart"><p>YOUR BAG IS EMPTY.</p><button type="button" onClick={closePanels}>RETURN TO SHOP</button></div> : <><div className="cart-lines">{cart.map((line, index) => <div className="cart-line" key={`${line.product.id}-${line.size}`}><img src={line.product.image} alt="" loading="lazy" decoding="async" /><div><strong>{line.product.name}</strong><span>{line.size}</span><div className="quantity"><button type="button" onClick={() => updateQuantity(index, -1)} aria-label={`Remove one ${line.product.name}`}>−</button><span>{line.quantity}</span><button type="button" onClick={() => updateQuantity(index, 1)} disabled={line.quantity >= MAX_QUANTITY} aria-label={`Add one ${line.product.name}`}>+</button></div></div><strong>{money.format(line.product.price * line.quantity)}</strong></div>)}</div><div className="cart-total"><div><span>REFERENCE SUBTOTAL</span><strong>{money.format(subtotal)}</strong></div><p>Final price, stock, tax, delivery and returns are confirmed by the official seller.</p><button type="button" className="primary-button" onClick={startCheckout}>SECURE PURCHASE OPTIONS →</button><button type="button" className="continue-button" onClick={closePanels}>CONTINUE SHOPPING</button></div></>}
      </aside>}

      {infoPage && <aside className="side-panel info-panel open" role="dialog" aria-modal="true" aria-label={infoTitles[infoPage]}>
        <button type="button" className="panel-close" onClick={closePanels}>CLOSE ×</button><InfoContent page={infoPage} />
      </aside>}

      {selected && <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name}>
        <button type="button" className="modal-close" onClick={() => setSelected(null)}>CLOSE ×</button>
        <div className="modal-image" style={{ background: selected.tone }}>
          <span>{selected.code}</span>
          <div className="modal-image-stage"><img key={selectedImages[productImageIndex]} src={selectedImages[productImageIndex] ?? selected.image} alt={`${selected.name} view ${productImageIndex + 1}`} decoding="async" /></div>
          {selectedImages.length > 1 && <div className="modal-thumbnails" aria-label={`${selected.name} image gallery`}>
            {selectedImages.map((image, index) => <button type="button" key={`${image}-${index}`} className={productImageIndex === index ? "active" : ""} onClick={() => setProductImageIndex(index)} aria-label={`View image ${index + 1} of ${selectedImages.length}`} aria-pressed={productImageIndex === index}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}
          </div>}
        </div>
        <div className="modal-info"><p className="eyebrow">GHOST CLOSET / {selected.category}</p><div className="product-title-row"><h2>{selected.name}</h2><button type="button" className={favorites.includes(selected.id) ? "active" : ""} onClick={() => toggleFavorite(selected.id)} aria-label={`Save ${selected.name}`} aria-pressed={favorites.includes(selected.id)}>♡</button></div><p className="modal-price">{money.format(selected.price)}</p><p className="description">{selected.description}</p><fieldset><legend>SELECT SIZE</legend><div className="size-row">{selected.sizes.map((item) => <button type="button" key={item} className={size === item ? "selected" : ""} onClick={() => setSize(item)} aria-pressed={size === item}>{item}</button>)}</div></fieldset><button type="button" className="primary-button" onClick={() => addToCart(selected)}>ADD TO BAG — {money.format(selected.price)}</button><details open><summary>DETAILS</summary><ul>{selected.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>{selected.sourceUrl && <a className="source-link" href={selected.sourceUrl} target="_blank" rel="noopener noreferrer sponsored">OFFICIAL PRODUCT SOURCE ↗</a>}</details><details><summary>DELIVERY + RETURNS</summary><p>The official seller confirms availability, delivery, taxes and returns before payment.</p></details></div>
      </div>}

      {checkoutOpen && <div className="checkout-modal purchase-router" role="dialog" aria-modal="true" aria-label="Secure purchase options">
        <header><strong>GHOST CLOSET</strong><span>SECURE PURCHASE ROUTER</span><button type="button" onClick={() => setCheckoutOpen(false)}>CLOSE ×</button></header>
        <div className="checkout-main">
          <div className="checkout-form">
            <p className="eyebrow">SECURITY FIRST</p><h2>CHOOSE THE OFFICIAL SELLER.</h2>
            <div className="demo-notice secure-notice">NO CARD FIELDS — GHOST CLOSET DOES NOT COLLECT PAYMENT OR DELIVERY DATA</div>
            <p className="secure-copy">Available products open on the linked official seller website. Concept pieces remain preview-only until production, fulfillment and legally reviewed sales terms are ready.</p>
            <div className="secure-purchase-list">{cart.map((line) => <div className="secure-purchase-line" key={`${line.product.id}-${line.size}`}><img src={line.product.image} alt="" loading="lazy" decoding="async" /><span><strong>{line.product.name}</strong><small>{line.size} / QTY {line.quantity}</small></span>{line.product.sourceUrl ? <a href={line.product.sourceUrl} target="_blank" rel="noopener noreferrer sponsored">OPEN OFFICIAL STORE ↗</a> : <em>DROP PREVIEW — NOT FOR SALE</em>}</div>)}</div>
            <button type="button" className="back-button" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}>← BACK TO BAG</button>
          </div>
        </div>
        <aside className="checkout-summary"><p className="eyebrow">PURCHASE REFERENCE</p>{cart.map((line) => <div key={`${line.product.id}-${line.size}`}><img src={line.product.image} alt="" loading="lazy" decoding="async" /><span><strong>{line.product.name}</strong><small>{line.size} / QTY {line.quantity}</small></span><strong>{money.format(line.product.price * line.quantity)}</strong></div>)}<dl><dt>DISPLAYED TOTAL</dt><dd>{money.format(subtotal)}</dd><dt>PAYMENT</dt><dd>OFF-SITE</dd><dt>CARD DATA</dt><dd>NOT COLLECTED</dd></dl></aside>
      </div>}
    </main>
  );
}
