import { NextRequest, NextResponse } from "next/server";
import { getCollections } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const collections = await getCollections();
    return NextResponse.json({
      success: true,
      collections,
      count: collections.length,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch collections",
      },
      { status: 500 }
    );
  }
}
