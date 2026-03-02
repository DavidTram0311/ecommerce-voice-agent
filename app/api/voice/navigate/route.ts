import { NextRequest, NextResponse } from "next/server";

// Valid navigation paths for the voice agent
const VALID_PATHS = [
  "/",
  "/shop",
  "/cart",
  "/checkout",
  "/checkout/information",
  "/checkout/shipping",
  "/checkout/payment",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, query } = body;

    // Validate input
    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page is required",
        },
        { status: 400 }
      );
    }

    // Build navigation URL
    let navigationPath = page;

    // Handle special cases
    if (page === "shop" && query) {
      navigationPath = `/shop?q=${encodeURIComponent(query)}`;
    } else if (page.startsWith("/shop/") || page.startsWith("/product/")) {
      navigationPath = page;
    } else if (!page.startsWith("/")) {
      navigationPath = `/${page}`;
    }

    return NextResponse.json({
      success: true,
      navigationPath,
      message: `Navigate to ${navigationPath}`,
    });
  } catch (error) {
    console.error("Error processing navigation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process navigation",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available navigation paths
  return NextResponse.json({
    success: true,
    paths: VALID_PATHS,
  });
}
