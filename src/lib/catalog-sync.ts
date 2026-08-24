import { db } from "@/lib/db";

let syncPromise: Promise<void> | null = null;

async function syncCatalog() {
  const legacyMots = await db.product.findUnique({
    where: { slug: "mots-c" },
    include: { variants: true },
  });

  const isLegacyCjc = legacyMots?.name.toLowerCase().includes("cjc");

  if (legacyMots && isLegacyCjc) {
    await db.product.update({
      where: { id: legacyMots.id },
      data: {
        name: "CJC/Ipamorelin",
        slug: "cjc-ipamorelin",
        imageUrl: "/images/products/cjc-ipamorelin.jpg",
      },
    });
    await db.productVariant.updateMany({
      where: { productId: legacyMots.id, sku: "MOTSC-10MG" },
      data: { sku: "CJCIPA-10MG" },
    });
    await db.productVariant.updateMany({
      where: { productId: legacyMots.id, sku: "MOTSC-40MG" },
      data: { sku: "CJCIPA-40MG" },
    });
  }

  const ghk = await db.product.upsert({
    where: { slug: "ghk-cu" },
    update: {
      name: "GHK-Cu",
      shortDescription: "Copper peptide research compound",
      researchCategory: "Peptide Research",
      featured: true,
      isNew: true,
      published: true,
      imageUrl: "/images/products/ghk-cu.jpg",
    },
    create: {
      name: "GHK-Cu",
      slug: "ghk-cu",
      shortDescription: "Copper peptide research compound",
      researchCategory: "Peptide Research",
      featured: true,
      isNew: true,
      published: true,
      imageUrl: "/images/products/ghk-cu.jpg",
    },
  });
  await db.productVariant.upsert({
    where: { sku: "GHKCU-50MG" },
    update: { productId: ghk.id, name: "50mg", price: 50, concentration: "50mg", size: "50mg", isDefault: true },
    create: { productId: ghk.id, name: "50mg", sku: "GHKCU-50MG", price: 50, concentration: "50mg", size: "50mg", stockQuantity: 8, inStock: true, isDefault: true },
  });

  const mots = await db.product.upsert({
    where: { slug: "mots-c" },
    update: {
      name: "MOTS-C",
      shortDescription: "Mitochondrial peptide research compound",
      researchCategory: "Metabolic Research",
      featured: true,
      isNew: true,
      published: true,
      imageUrl: "/images/products/mots-c.jpg",
    },
    create: {
      name: "MOTS-C",
      slug: "mots-c",
      shortDescription: "Mitochondrial peptide research compound",
      researchCategory: "Metabolic Research",
      featured: true,
      isNew: true,
      published: true,
      imageUrl: "/images/products/mots-c.jpg",
    },
  });
  await db.productVariant.upsert({
    where: { sku: "MOTSC-10MG" },
    update: { productId: mots.id, name: "10mg", price: 45, concentration: "10mg", size: "10mg", isDefault: true },
    create: { productId: mots.id, name: "10mg", sku: "MOTSC-10MG", price: 45, concentration: "10mg", size: "10mg", stockQuantity: 10, inStock: true, isDefault: true },
  });
}

export function syncAvailableProducts() {
  syncPromise ??= syncCatalog().catch((error) => {
    syncPromise = null;
    throw error;
  });
  return syncPromise;
}
