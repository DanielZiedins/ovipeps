import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      variants: { orderBy: { sortOrder: "asc" } },
      coaDocuments: { select: { id: true, published: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          Products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.length} products in catalog
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Variants</th>
              <th className="px-4 py-3 font-medium">Price Range</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const prices = product.variants.map((v) => v.price);
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const maxPrice = prices.length ? Math.max(...prices) : 0;
              const inStockCount = product.variants.filter((v) => v.inStock).length;
              const publishedCoas = product.coaDocuments.filter((c) => c.published).length;

              return (
                <tr
                  key={product.id}
                  className="border-b border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.researchCategory ?? product.category}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {product.variants.length} ({inStockCount} in stock)
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {minPrice === maxPrice
                      ? formatCurrency(minPrice)
                      : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge>Draft</Badge>
                      )}
                      {product.featured && <Badge variant="coa">Featured</Badge>}
                      {product.isNew && <Badge variant="research">New</Badge>}
                      {publishedCoas > 0 && (
                        <Badge variant="coa">{publishedCoas} COA</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
