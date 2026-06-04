import { NextResponse } from "next/server";
import { pollTwitchAndSaveSample } from "@/lib/twitch";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const sample = await pollTwitchAndSaveSample();
    return NextResponse.json({ sample });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to poll Twitch"
      },
      { status: 503 }
    );
  }
}
