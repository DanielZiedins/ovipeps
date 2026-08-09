import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { attributeOrder, createCommission } from "@/lib/affiliate";
import { generateOrderNumber } from "@/lib/utils";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  email: string;
  shippingAddress: ShippingAddress;
  items: CreateOrderItem[];
  discountCode?: string | null;
  affiliateCode?: string | null;
  referralCode?: string | null;
  userId?: string | null;
}

const FLAT_SHIPPING_RATE = 15;

async function getShippingThreshold() {
  const setting = await db.siteSetting.findUnique({
    where: { key: "shipping_threshold" },
  });
  return Number(setting?.value ?? 300);
}

async function calculateDiscount(
  code: string | null | undefined,
  subtotal: number
) {
  if (!code?.trim()) {
    return { discountAmount: 0, discountCode: null as string | null };
  }

  const discount = await db.discountCode.findFirst({
    where: {
      code: code.trim().toUpperCase(),
      active: true,
    },
  });

  if (!discount) {
    throw new Error("Invalid discount code");
  }

  const now = new Date();
  if (discount.startsAt && discount.startsAt > now) {
    throw new Error("Discount code is not yet active");
  }
  if (discount.expiresAt && discount.expiresAt < now) {
    throw new Error("Discount code has expired");
  }
  if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
    throw new Error("Discount code has reached its usage limit");
  }
  if (discount.minOrderAmount && subtotal < discount.minOrderAmount) {
    throw new Error(
      `Minimum order amount of $${discount.minOrderAmount.toFixed(2)} required for this code`
    );
  }

  let discountAmount = 0;
  if (discount.type === "PERCENTAGE") {
    discountAmount = Math.round(subtotal * (discount.value / 100) * 100) / 100;
  } else {
    discountAmount = Math.min(subtotal, discount.value);
  }

  return { discountAmount, discountCode: discount.code };
}

export async function createOrder(input: CreateOrderInput) {
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }

  const variantIds = input.items.map((item) => item.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

  let subtotal = 0;
  const orderItems = input.items.map((item) => {
    const variant = variantMap.get(item.variantId);
    if (!variant) {
      throw new Error(`Product variant not found: ${item.variantId}`);
    }
    if (variant.productId !== item.productId) {
      throw new Error("Product and variant mismatch");
    }
    if (!variant.inStock || variant.stockQuantity < item.quantity) {
      throw new Error(`${variant.product.name} — ${variant.name} is out of stock`);
    }

    const unitPrice = variant.price;
    const totalPrice = Math.round(unitPrice * item.quantity * 100) / 100;
    subtotal += totalPrice;

    return {
      productId: variant.productId,
      variantId: variant.id,
      productName: variant.product.name,
      variantName: variant.name,
      sku: variant.sku,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    };
  });

  const { discountAmount, discountCode } = await calculateDiscount(
    input.discountCode,
    subtotal
  );

  const shippingThreshold = await getShippingThreshold();
  const shippingAmount =
    subtotal - discountAmount >= shippingThreshold ? 0 : FLAT_SHIPPING_RATE;
  const taxAmount = 0;
  const total =
    Math.round((subtotal - discountAmount + shippingAmount + taxAmount) * 100) /
    100;

  const orderNumber = generateOrderNumber();

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId ?? undefined,
        email: input.email.trim().toLowerCase(),
        status: "AWAITING_PAYMENT",
        paymentMethod: "INTERAC_E_TRANSFER",
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        total,
        discountCode: discountCode ?? undefined,
        affiliateCode: input.affiliateCode?.trim().toUpperCase() || undefined,
        referralCode: input.referralCode?.trim() || undefined,
        shippingAddress: input.shippingAddress as unknown as Prisma.InputJsonValue,
        items: {
          create: orderItems,
        },
        payments: {
          create: {
            amount: total,
            method: "INTERAC_E_TRANSFER",
            status: "PENDING",
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    if (discountCode) {
      await tx.discountCode.update({
        where: { code: discountCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  const affiliateCode = input.affiliateCode ?? input.referralCode;
  if (affiliateCode) {
    await attributeOrder(order.id, affiliateCode);
  }

  return order;
}

export async function getOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updatePaymentReference(
  orderNumber: string,
  paymentReference: string
) {
  const order = await db.order.findUnique({
    where: { orderNumber },
  });

  if (!order) return null;

  return db.order.update({
    where: { id: order.id },
    data: { paymentReference: paymentReference.trim() },
    include: {
      items: true,
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function confirmPayment(
  orderId: string,
  options: { confirmedBy?: string; paymentReference?: string } = {}
) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "AWAITING_PAYMENT") {
    throw new Error("Order is not awaiting payment");
  }

  const pendingPayment = order.payments.find((payment) => payment.status === "PENDING");
  if (!pendingPayment) {
    throw new Error("No pending payment found for this order");
  }

  const now = new Date();

  const updatedOrder = await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: pendingPayment.id },
      data: {
        status: "CONFIRMED",
        confirmedAt: now,
        confirmedBy: options.confirmedBy,
        reference: options.paymentReference ?? order.paymentReference ?? undefined,
      },
    });

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAYMENT_RECEIVED",
        paidAt: now,
        paymentReference:
          options.paymentReference ?? order.paymentReference ?? undefined,
      },
      include: {
        items: true,
        payments: true,
      },
    });
  });

  await createCommission(orderId);

  return updatedOrder;
}
