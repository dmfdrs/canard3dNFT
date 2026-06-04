"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  FaBolt,
  FaEye,
  FaInstagram,
  FaTwitch,
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaWaveSquare
} from "react-icons/fa6";
import { MetricsSnapshot, TwitchMetricSample } from "@/lib/types";

const initialMetrics: MetricsSnapshot = {
  latest: null,
  peakViewers: 0,
  samples: [],
  activity: []
};

export function Dashboard({ instagramUrl }: { instagramUrl: string }) {
  const [metrics, setMetrics] = useState<MetricsSnapshot>(initialMetrics);
  const [loading, setLoading] = useState(true);
  const [lastPollError, setLastPollError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refreshMetrics() {
      try {
        const response = await fetch("/api/twitch/metrics", { cache: "no-store" });
        const data = (await response.json()) as MetricsSnapshot;
        if (!cancelled) {
          setMetrics(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    async function pollTwitch() {
      try {
        const response = await fetch("/api/twitch/poll", { method: "POST" });
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setLastPollError(data.error ?? "Twitch polling is not configured yet.");
          return;
        }
        setLastPollError(null);
        await refreshMetrics();
      } catch {
        setLastPollError("Twitch polling is not reachable right now.");
      }
    }

    refreshMetrics();
    pollTwitch();
    const metricsTimer = window.setInterval(refreshMetrics, 15_000);
    const pollTimer = window.setInterval(pollTwitch, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(metricsTimer);
      window.clearInterval(pollTimer);
    };
  }, []);

  const latest = metrics.latest;
  const chartData = useMemo(() => formatChartData(metrics.samples), [metrics.samples]);
  const estimatedVisitors = (latest?.enteredEstimate ?? 0) + (latest?.leftEstimate ?? 0);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="lightning-grid pointer-events-none absolute inset-x-0 top-0 h-96 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-plasma/20 blur-3xl" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="panel-border rounded-lg px-4 py-5 sm:px-6">
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
                <div className="absolute inset-0 rounded-full bg-plasma/30 blur-xl" />
                <Image
                  src="/assets/miguel-duck-logo.png"
                  alt="Miguel esports duck logo"
                  fill
                  sizes="(min-width: 640px) 112px, 96px"
                  className="relative object-contain animate-pulseGlow"
                  priority
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-pulse">Twitch + Instagram analytics</p>
                <h1 className="max-w-3xl text-4xl font-black uppercase leading-none text-white sm:text-6xl">
                  Miguel Stream Monitor
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-white/68 sm:text-base">
                  Live stream monitoring for itsmiguelofficial, with visitor movement clearly marked as estimates from viewer count changes.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a
                href="https://www.twitch.tv/itsmiguelofficial"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-plasma/60 bg-plasma/20 px-4 py-3 text-sm font-bold uppercase text-white shadow-neon transition hover:-translate-y-0.5 hover:bg-plasma/30"
              >
                <FaTwitch className="text-lg" />
                Twitch
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-danger/60 bg-danger/15 px-4 py-3 text-sm font-bold uppercase text-white shadow-neon transition hover:-translate-y-0.5 hover:bg-danger/25"
              >
                <FaInstagram className="text-lg" />
                Instagram
              </a>
            </div>
          </div>
        </header>

        {lastPollError ? (
          <div className="panel-border rounded-lg px-4 py-3 text-sm text-white/72">
            <span className="font-bold text-danger">Twitch connection:</span> {lastPollError}
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard icon={<FaEye />} label="Live viewers" value={latest?.viewerCount ?? 0} accent="text-plasma" />
          <MetricCard icon={<FaUsers />} label="Chatters" value={formatNullable(latest?.chatters)} accent="text-pulse" />
          <MetricCard icon={<FaUserPlus />} label="Estimated entered page" value={latest?.enteredEstimate ?? 0} accent="text-volt" />
          <MetricCard icon={<FaUserMinus />} label="Estimated left page" value={latest?.leftEstimate ?? 0} accent="text-danger" />
          <MetricCard icon={<FaWaveSquare />} label="Peak viewers" value={metrics.peakViewers} accent="text-pulse" />
          <MetricCard icon={<FaBolt />} label="Stream status" value={formatStatus(latest?.streamStatus)} accent={latest?.streamStatus === "online" ? "text-volt" : "text-white"} />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_.8fr]">
          <div className="panel-border min-h-[420px] rounded-lg p-4 sm:p-5">
            <div className="relative z-10 mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-black uppercase text-white">Live analytics over time</h2>
                <p className="text-sm text-white/55">Viewers, chatters, and estimated visitor movement</p>
              </div>
              <span className="w-fit rounded-md border border-volt/40 bg-volt/10 px-3 py-1 text-xs font-bold uppercase text-volt">
                {latest?.streamStatus === "online" ? "Live now" : "Awaiting stream"}
              </span>
            </div>

            <div className="relative z-10 h-[330px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ left: -20, right: 12, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewerFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(168,85,247,.16)" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis stroke="rgba(255,255,255,.45)" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(8, 4, 18, .96)",
                        border: "1px solid rgba(168, 85, 247, .45)",
                        borderRadius: "8px",
                        boxShadow: "0 0 24px rgba(168, 85, 247, .28)"
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="viewers" stroke="none" fill="url(#viewerFill)" />
                    <Line className="chart-glow" type="monotone" dataKey="viewers" stroke="#a855f7" strokeWidth={3} dot={false} name="Live viewers" />
                    <Line type="monotone" dataKey="chatters" stroke="#22d3ee" strokeWidth={2} dot={false} name="Chatters" />
                    <Line type="monotone" dataKey="estimatedVisitors" stroke="#b8ff5a" strokeWidth={2} dot={false} name="Estimated visitors" />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart loading={loading} />
              )}
            </div>
          </div>

          <aside className="panel-border rounded-lg p-4 sm:p-5">
            <div className="relative z-10 mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase">Activity feed</h2>
                <p className="text-sm text-white/55">Recent Twitch polling events</p>
              </div>
              <FaBolt className="text-xl text-plasma" />
            </div>

            <div className="relative z-10 flex flex-col gap-3">
              {metrics.activity.length > 0 ? (
                metrics.activity.slice(0, 8).map((event) => (
                  <div key={event.id} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">{event.label}</p>
                      <span className="text-[11px] uppercase text-white/38">{formatTime(event.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/58">{event.detail}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-sm text-white/58">
                  Activity appears after the first successful Twitch poll.
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <InfoPanel title="Estimate logic" value={`${estimatedVisitors} latest movement`} detail="Entered and left are computed from viewer count changes between samples." />
          <InfoPanel title="Twitch source" value="@itsmiguelofficial" detail="Powered by Twitch Helix stream and optional chatters endpoints." />
          <InfoPanel title="Instagram" value="@itsmiguel.official" detail="Profile link ready; Graph API insights module prepared without scraping." />
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="panel-border animate-card-float rounded-lg p-4">
      <div className="relative z-10 flex h-full min-h-28 flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-black uppercase text-white/58">{label}</p>
          <span className={`text-lg ${accent}`}>{icon}</span>
        </div>
        <p className={`text-3xl font-black uppercase leading-none ${accent}`}>{value}</p>
      </div>
    </div>
  );
}

function InfoPanel({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="panel-border rounded-lg p-4">
      <div className="relative z-10">
        <p className="text-xs font-black uppercase text-white/52">{title}</p>
        <p className="mt-2 text-2xl font-black text-white">{value}</p>
        <p className="mt-2 text-sm text-white/58">{detail}</p>
      </div>
    </div>
  );
}

function EmptyChart({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-full items-center justify-center rounded-md border border-dashed border-plasma/30 bg-black/20 text-center">
      <div>
        <p className="text-lg font-black uppercase text-white">{loading ? "Loading metrics" : "No Twitch samples yet"}</p>
        <p className="mt-2 max-w-sm text-sm text-white/55">Add Twitch credentials and keep the dashboard open to collect samples every 30 seconds.</p>
      </div>
    </div>
  );
}

function formatChartData(samples: TwitchMetricSample[]) {
  return samples.map((sample) => ({
    time: formatTime(sample.sampledAt),
    viewers: sample.viewerCount,
    chatters: sample.chatters ?? 0,
    estimatedVisitors: sample.enteredEstimate + sample.leftEstimate
  }));
}

function formatNullable(value: number | null | undefined) {
  return typeof value === "number" ? value : "N/A";
}

function formatStatus(status: TwitchMetricSample["streamStatus"] | undefined) {
  if (!status) {
    return "Unknown";
  }

  return status;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
