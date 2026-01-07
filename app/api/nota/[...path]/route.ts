/**
 * Next.js API Route Proxy for NOTA API
 * This proxy handles CORS issues by making server-side requests
 */

import { NextRequest, NextResponse } from "next/server";

const NOTA_BASE_URL =
  "https://hmwcdpm2zoz3qxqbsknzm6k5ie0arpgb.lambda-url.eu-north-1.on.aws";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const params = await context.params;
    const path = params.path.join("/");
    const body = await request.json();

    const url = `${NOTA_BASE_URL}/${path}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || response.statusText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("NOTA API proxy error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

