import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const users = [
    { name: "Store Admin", email: "admin@novacart.com", password: "admin123", role: Role.ADMIN },
    { name: "Alex Johnson", email: "user@novacart.com", password: "user123", role: Role.USER },
    { name: "Jane Smith", email: "jane@novacart.com", password: "jane123", role: Role.USER },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role, password: hashedPassword },
      create: {
        name: u.name,
        email: u.email,
        role: u.role,
        password: hashedPassword,
      },
    });
    console.log(`User created: ${u.email}`);
  }

  const products = [
    {
      name: "Aura Wireless Headphones",
      description:
        "Over-ear wireless headphones with active noise cancellation, 30-hour battery life and plush memory-foam ear cushions. Perfect for focused work or long commutes.",
      price: 6999,
      category: "Electronics",
      stock: 15,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Pulse Smartwatch",
      description:
        "Track your heart rate, steps, sleep and workouts with a bright always-on display. Water resistant and works with both iOS and Android.",
      price: 15999,
      category: "Electronics",
      stock: 8,
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Capture Instant Camera",
      description:
        "A retro-style instant camera that prints pocket-size photos in seconds. Includes a selfie mirror and a built-in flash for low-light shots.",
      price: 11999,
      category: "Electronics",
      stock: 6,
      image:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Cloud Soft Cotton T-Shirt",
      description:
        "A breathable 100% organic cotton tee with a relaxed fit. Soft enough to wear every day and strong enough to survive the wash.",
      price: 1499,
      category: "Clothing",
      stock: 50,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Edge Running Sneakers",
      description:
        "Lightweight running shoes with responsive cushioning and a breathable knit upper. Designed to take your daily miles in stride.",
      price: 5999,
      category: "Clothing",
      stock: 12,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Canvas Everyday Backpack",
      description:
        "A tough canvas backpack with a padded 15-inch laptop sleeve, multiple pockets and a water-repellent finish.",
      price: 3999,
      category: "Accessories",
      stock: 20,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Metro Aviator Sunglasses",
      description:
        "Classic aviator sunglasses with UV400 protection and a slim metal frame. A timeless look that goes with everything.",
      price: 3299,
      category: "Accessories",
      stock: 25,
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Loom Leather Crossbody Bag",
      description:
        "Handcrafted full-grain leather crossbody bag with a roomy main compartment and an adjustable strap.",
      price: 5499,
      category: "Accessories",
      stock: 10,
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Brew Ceramic Mug (350ml)",
      description:
        "A thick-walled ceramic mug that keeps your coffee hot longer. Smooth matte finish and dishwasher safe.",
      price: 1249,
      category: "Home & Kitchen",
      stock: 40,
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Amber Eau de Parfum (50ml)",
      description:
        "A warm blend of amber, vanilla and sandalwood. A long-lasting fragrance bottled in an elegant glass flask.",
      price: 3799,
      category: "Beauty & Care",
      stock: 18,
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
    console.log(`Product created: ${p.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });