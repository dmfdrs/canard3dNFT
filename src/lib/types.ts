export type StreamStatus = "online" | "offline" | "unknown";

export type TwitchMetricSample = {
  id: string;
  sampledAt: string;
  broadcasterLogin: string;
  streamStatus: StreamStatus;
  viewerCount: number;
  chatters: number | null;
  enteredEstimate: number;
  leftEstimate: number;
  title: string | null;
  gameName: string | null;
  startedAt: string | null;
};

export type ActivityEvent = {
  id: string;
  createdAt: string;
  type: "viewer_change" | "entered_estimate" | "left_estimate" | "stream_status";
  label: string;
  detail: string;
};

export type MetricsSnapshot = {
  latest: TwitchMetricSample | null;
  peakViewers: number;
  samples: TwitchMetricSample[];
  activity: ActivityEvent[];
};
