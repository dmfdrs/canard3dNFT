import { NextResponse } from "next/server";
import { getTwitchStatus } from "@/lib/twitch";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await getTwitchStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load Twitch status",
        streamStatus: "unknown"
      },
      { status: 503 }
    );
  }
}
