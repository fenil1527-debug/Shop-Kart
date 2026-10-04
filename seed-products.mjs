// seed-products.mjs
// Seeds sample products via POST /products API.
// Usage: node seed-products.mjs   (backend must be running on port 8000)

const BASE = "http://localhost:8000";

const PRODUCTS = [
  // ─── Electronics ───
  {
    name: "Noise Cancelling Headphones",
    description: "Wireless over-ear headphones with active noise cancellation, 30-hour battery life, and premium comfort cushions.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    stock: 25,
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches, N-key rollover, and detachable USB-C cable.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80&auto=format&fit=crop",
    stock: 10,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with 4000 DPI optical sensor, silent clicks, and 18-month battery.",
    price: 899,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    stock: 40,
  },
  // ─── Fashion ───
  {
    name: "Classic Leather Jacket",
    description: "Genuine lambskin leather jacket with quilted lining, zippered pockets, and a tailored fit.",
    price: 7499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop",
    stock: 8,
  },
  {
    name: "Running Sneakers",
    description: "Lightweight mesh running shoes with responsive cushioning and breathable upper.",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop",
    stock: 15,
  },
  {
    name: "Aviator Sunglasses",
    description: "UV400 polarized aviator sunglasses with gold metal frame and gradient lenses.",
    price: 1299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop",
    stock: 30,
  },
  // ─── Home & Living ───
  {
    name: "Minimalist Desk Lamp",
    description: "LED desk lamp with adjustable brightness, color temperature control, and USB charging port.",
    price: 1899,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&q=80&auto=format&fit=crop",
    stock: 20,
  },
  {
    name: "Scented Candle Set",
    description: "Set of 3 soy wax candles — lavender, vanilla, and sandalwood. Burns up to 45 hours each.",
    price: 799,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80&auto=format&fit=crop",
    stock: 50,
  },
  {
    name: "Velvet Throw Pillow",
    description: "Soft velvet cushion cover with invisible zipper, 18×18 inches, machine washable.",
    price: 599,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80&auto=format&fit=crop",
    stock: 35,
  },
  // ─── Beauty ───
  {
    name: "Vitamin C Face Serum",
    description: "Brightening face serum with 20% Vitamin C, hyaluronic acid, and niacinamide. 30ml.",
    price: 649,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80&auto=format&fit=crop",
    stock: 60,
  },
  {
    name: "Luxury Lip Balm",
    description: "Organic lip balm with shea butter, coconut oil, and vitamin E. SPF 15 protection.",
    price: 299,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80&auto=format&fit=crop",
    stock: 100,
  },
  {
    name: "Hair Care Gift Box",
    description: "Premium gift box with shampoo, conditioner, hair mask, and argan oil serum.",
    price: 1999,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54571e263?w=600&q=80&auto=format&fit=crop",
    stock: 12,
  },
];

async function seed() {
  console.log(`\n🌱  Seeding ${PRODUCTS.length} products → ${BASE}/products\n`);

  let created = 0;
  let failed = 0;

  for (const product of PRODUCTS) {
    try {
      const res = await fetch(`${BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`  ✅  ${product.name} (₹${product.price})`);
        created++;
      } else {
        console.log(`  ❌  ${product.name}: ${data.message}`);
        failed++;
      }
    } catch (err) {
      console.log(`  ❌  ${product.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊  Done — ${created} created, ${failed} failed\n`);
}

seed();
