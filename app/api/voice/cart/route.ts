import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, merchandiseId, quantity } = body;

    // Validate input
    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Action is required",
        },
        { status: 400 }
      );
    }

    // Return instructions for client to update cart
    // The actual cart update happens client-side with localStorage
    return NextResponse.json({
      success: true,
      action,
      data: {
        merchandiseId,
        quantity: quantity || 1,
      },
      message: `Cart action ${action} queued`,
    });
  } catch (error) {
    console.error("Error processing cart action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process cart action",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Voice agent can query cart status
  // Since cart is client-side, this returns a message
  return NextResponse.json({
    success: true,
    message: "Cart is managed client-side. Use the cart UI to view items.",
  });
}
