import { NextResponse } from "next/server";
import { getMetricsSnapshot } from "@/lib/data/metrics-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const metrics = await getMetricsSnapshot();
  return NextResponse.json(metrics);
}
