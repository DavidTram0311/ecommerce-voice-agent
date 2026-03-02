import { NextRequest, NextResponse } from "next/server";
import { getProducts, getProduct, getCollectionProducts } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const handle = searchParams.get("handle");
    const collection = searchParams.get("collection");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get specific product by handle
    if (handle) {
      const product = await getProduct(handle);
      return NextResponse.json({
        success: true,
        product,
      });
    }

    // Get products by collection
    if (collection) {
      const products = await getCollectionProducts({
        collection,
        limit,
      });
      return NextResponse.json({
        success: true,
        products,
        count: products.length,
      });
    }

    // Search products by query
    const products = await getProducts({ query: query || undefined });
    return NextResponse.json({
      success: true,
      products: products.slice(0, limit),
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}
