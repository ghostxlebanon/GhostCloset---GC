import { readFile, writeFile } from "node:fs/promises";

const pagePath = new URL("../app/page.tsx", import.meta.url);
let source = await readFile(pagePath, "utf8");
let changed = false;

function replaceOnce(label, original, replacement) {
  if (source.includes(replacement)) return;
  if (!source.includes(original)) throw new Error(`Ghost Closet hardening failed: ${label} target not found.`);
  source = source.replace(original, replacement);
  changed = true;
}

replaceOnce(
  "campaign statement",
  '<p className="campaign-copy">Some people wear clothes.<span>OTHERS WEAR PRESENCE.</span></p>',
  '<p className="campaign-copy">Some people wear clothes.<span>WE WEAR PRESENCE.</span></p>',
);

replaceOnce(
  "Specter Gloves gallery",
  '    gallery: [asset("/products/specter-gloves.png"), asset("/editorial/ghost-duo-field.png")],',
  '    gallery: [],',
);

replaceOnce(
  "Specter Gloves note",
  '    note: "Glossy black leather",',
  '    note: "Glossy black leather only",',
);

replaceOnce(
  "announcement",
  '        <span>DROP 001 IS LIVE</span><span>FREE DELIVERY OVER €150</span><span>14-DAY RETURNS</span>',
  '        <span>DROP 001 PREVIEW</span><span>SECURE OFFICIAL-STORE CHECKOUT</span><span>NO CARD DATA COLLECTED HERE</span>',
);

replaceOnce(
  "delivery service card",
  '<button onClick={() => openInfo("shipping")}><span>01</span><strong>TRACKED DELIVERY</strong><p>Delivery estimates and tracking with every order.</p><em>READ MORE ↗</em></button>',
  '<button onClick={() => openInfo("shipping")}><span>01</span><strong>RETAILER DELIVERY</strong><p>Live delivery cost and tracking appear at the official seller checkout.</p><em>READ MORE ↗</em></button>',
);

replaceOnce(
  "returns service card",
  '<button onClick={() => openInfo("returns")}><span>02</span><strong>14-DAY RETURNS</strong><p>Simple returns on unworn items in original condition.</p><em>READ MORE ↗</em></button>',
  '<button onClick={() => openInfo("returns")}><span>02</span><strong>RETAILER RETURNS</strong><p>Returns follow the official seller’s published policy.</p><em>READ MORE ↗</em></button>',
);

replaceOnce(
  "security service card",
  '<button onClick={() => openInfo("contact")}><span>03</span><strong>SUPPORT</strong><p>Questions about sizing, delivery or an existing order.</p><em>CONTACT ↗</em></button>',
  '<button onClick={() => openInfo("terms")}><span>03</span><strong>SECURE BY DESIGN</strong><p>Ghost Closet never asks for card details on this static storefront.</p><em>SECURITY ↗</em></button>',
);

replaceOnce(
  "cart checkout copy",
  '<p>Taxes and delivery calculated at checkout.</p><button className="primary-button" onClick={startCheckout}>CHECKOUT →</button>',
  '<p>Final price, stock, tax, delivery and returns are confirmed by the official seller.</p><button className="primary-button" onClick={startCheckout}>SECURE PURCHASE OPTIONS →</button>',
);

replaceOnce(
  "external-link protection",
  'target="_blank" rel="noreferrer">OFFICIAL PRODUCT SOURCE ↗</a>',
  'target="_blank" rel="noopener noreferrer sponsored">OFFICIAL PRODUCT SOURCE ↗</a>',
);

replaceOnce(
  "shipping information",
  'Every order receives tracked delivery. Exact cost and estimated delivery window are calculated at checkout after you enter your destination.',
  'Available products are purchased on the linked official seller website. That seller confirms destination availability, delivery cost, taxes, tracking and the final delivery estimate before payment.',
);

replaceOnce(
  "returns information",
  'Eligible items can be returned within 14 days of delivery. Products must be unworn, unwashed and returned with original packaging and tags.',
  'Returns, exchanges, refunds and warranty support are handled by the official seller that receives payment. Review that seller’s policy before ordering.',
);

replaceOnce(
  "legal statement",
  'Ghost Closet is currently a storefront demonstration. Live payment, final supplier details, tax information, privacy policy and legally reviewed sales terms must be connected before commercial launch.',
  'Ghost Closet is currently a static editorial and affiliate-style storefront. Payment and delivery details are handled off-site by linked sellers. Ghost Closet does not collect card numbers, expiry dates, CVC codes or checkout addresses.',
);

replaceOnce(
  "legal payment status",
  '<div><span>PAYMENTS</span><strong>NOT YET CAPTURED</strong></div>',
  '<div><span>PAYMENTS</span><strong>HANDLED OFF-SITE</strong></div>',
);

if (!source.includes("SECURE PURCHASE ROUTER")) {
  const checkoutPattern = /\n      \{checkoutOpen && <div className="checkout-modal"[\s\S]*?\n      <\/div>\}\n    <\/main>/;
  if (!checkoutPattern.test(source)) throw new Error("Ghost Closet hardening failed: checkout block not found.");

  const secureCheckout = `
      {checkoutOpen && <div className="checkout-modal purchase-router" role="dialog" aria-modal="true" aria-label="Secure purchase options">
        <header><strong>GHOST CLOSET</strong><span>SECURE PURCHASE ROUTER</span><button onClick={() => setCheckoutOpen(false)}>CLOSE ×</button></header>
        <div className="checkout-main">
          <div className="checkout-form">
            <p className="eyebrow">SECURITY FIRST</p><h2>CHOOSE THE OFFICIAL SELLER.</h2>
            <div className="demo-notice secure-notice">NO CARD FIELDS — GHOST CLOSET DOES NOT COLLECT PAYMENT OR DELIVERY DATA</div>
            <p className="secure-copy">Available products open on the linked official seller website. Concept pieces remain preview-only until production, fulfillment and legally reviewed sales terms are ready.</p>
            <div className="secure-purchase-list">{cart.map((line) => <div className="secure-purchase-line" key={\`${"${line.product.id}"}-${"${line.size}"}\`}><img src={line.product.image} alt="" /><span><strong>{line.product.name}</strong><small>{line.size} / QTY {line.quantity}</small></span>{line.product.sourceUrl ? <a href={line.product.sourceUrl} target="_blank" rel="noopener noreferrer sponsored">OPEN OFFICIAL STORE ↗</a> : <em>DROP PREVIEW — NOT FOR SALE</em>}</div>)}</div>
            <button className="back-button" onClick={() => { setCheckoutOpen(false); setCartOpen(true); }}>← BACK TO BAG</button>
          </div>
        </div>
        <aside className="checkout-summary"><p className="eyebrow">PURCHASE REFERENCE</p>{cart.map((line) => <div key={\`${"${line.product.id}"}-${"${line.size}"}\`}><img src={line.product.image} alt="" /><span><strong>{line.product.name}</strong><small>{line.size} / QTY {line.quantity}</small></span><strong>{money.format(line.product.price * line.quantity)}</strong></div>)}<dl><dt>DISPLAYED TOTAL</dt><dd>{money.format(subtotal)}</dd><dt>PAYMENT</dt><dd>OFF-SITE</dd><dt>CARD DATA</dt><dd>NOT COLLECTED</dd></dl></aside>
      </div>}
    </main>`;

  source = source.replace(checkoutPattern, `\n${secureCheckout}`);
  changed = true;
}

if (changed) {
  await writeFile(pagePath, source);
  console.log("Ghost Closet storefront hardened.");
} else {
  console.log("Ghost Closet storefront already hardened.");
}
