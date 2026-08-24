import { db } from "@/lib/db";

let syncPromise: Promise<void> | null = null;

async function syncCatalog() {
  await Promise.all([
    db.siteSetting.upsert({
      where: { key: "etransfer_email" },
      update: { value: "ovipeps@gmail.com" },
      create: { key: "etransfer_email", value: "ovipeps@gmail.com" },
    }),
    db.siteSetting.upsert({
      where: { key: "etransfer_instructions" },
      update: {
        value:
          "Please send your Interac e-Transfer to ovipeps@gmail.com. Include your order number in the message field. Orders are processed once payment is confirmed.",
      },
      create: {
        key: "etransfer_instructions",
        value:
          "Please send your Interac e-Transfer to ovipeps@gmail.com. Include your order number in the message field. Orders are processed once payment is confirmed.",
      },
    }),
    db.siteSetting.upsert({
      where: { key: "support_email" },
      update: { value: "ovipeps@gmail.com" },
      create: { key: "support_email", value: "ovipeps@gmail.com" },
    }),
  ]);

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

  const glp3 = await db.product.findUnique({
    where: { slug: "glp-3" },
    include: { variants: true },
  });

  if (glp3) {
    const fiveMg = glp3.variants.find((variant) => variant.sku === "GLP3-5MG");
    const tenMg = glp3.variants.find((variant) => variant.sku === "GLP3-10MG");
    const transferredStock =
      fiveMg && tenMg && fiveMg.stockQuantity > 0 && tenMg.stockQuantity === 0
        ? Math.min(fiveMg.stockQuantity, 4)
        : null;

    await db.$transaction([
      db.productVariant.updateMany({
        where: { productId: glp3.id, sku: "GLP3-5MG" },
        data: {
          price: 0,
          stockQuantity: 0,
          inStock: false,
          isDefault: false,
        },
      }),
      db.productVariant.updateMany({
        where: { productId: glp3.id, sku: "GLP3-10MG" },
        data: {
          price: 80,
          ...(transferredStock !== null
            ? {
                stockQuantity: transferredStock,
                inStock: transferredStock > 0,
              }
            : {}),
          isDefault: true,
        },
      }),
    ]);
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
