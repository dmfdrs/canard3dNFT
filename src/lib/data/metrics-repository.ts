import { ActivityEvent, MetricsSnapshot, TwitchMetricSample } from "@/lib/types";

type Store = {
  samples: TwitchMetricSample[];
  activity: ActivityEvent[];
  previousStatus: TwitchMetricSample["streamStatus"] | null;
};

const globalStore = globalThis as typeof globalThis & {
  miguelStreamMonitorStore?: Store;
};

const store =
  globalStore.miguelStreamMonitorStore ??
  (globalStore.miguelStreamMonitorStore = {
    samples: [],
    activity: [],
    previousStatus: null
  });

const MAX_SAMPLES = 240;
const MAX_ACTIVITY = 80;

export async function getMetricsSnapshot(): Promise<MetricsSnapshot> {
  const samples = [...store.samples].sort((a, b) => a.sampledAt.localeCompare(b.sampledAt));
  const latest = samples.at(-1) ?? null;
  const peakViewers = samples.reduce((peak, sample) => Math.max(peak, sample.viewerCount), 0);

  return {
    latest,
    peakViewers,
    samples,
    activity: [...store.activity]
  };
}

export async function getPreviousSample(): Promise<TwitchMetricSample | null> {
  return store.samples.at(-1) ?? null;
}

export async function saveMetricSample(sample: TwitchMetricSample): Promise<TwitchMetricSample> {
  const previous = await getPreviousSample();
  store.samples.push(sample);
  store.samples = store.samples.slice(-MAX_SAMPLES);
  recordActivity(sample, previous);
  store.previousStatus = sample.streamStatus;
  return sample;
}

function recordActivity(sample: TwitchMetricSample, previous: TwitchMetricSample | null) {
  const events: ActivityEvent[] = [];

  if (!previous || previous.viewerCount !== sample.viewerCount) {
    const delta = sample.viewerCount - (previous?.viewerCount ?? 0);
    events.push({
      id: `${sample.id}-viewer-change`,
      createdAt: sample.sampledAt,
      type: "viewer_change",
      label: "Viewer count changed",
      detail: `${formatSigned(delta)} live viewers`
    });
  }

  if (sample.enteredEstimate > 0) {
    events.push({
      id: `${sample.id}-entered`,
      createdAt: sample.sampledAt,
      type: "entered_estimate",
      label: "Estimated entered",
      detail: `${sample.enteredEstimate} estimated visitor${sample.enteredEstimate === 1 ? "" : "s"}`
    });
  }

  if (sample.leftEstimate > 0) {
    events.push({
      id: `${sample.id}-left`,
      createdAt: sample.sampledAt,
      type: "left_estimate",
      label: "Estimated left",
      detail: `${sample.leftEstimate} estimated visitor${sample.leftEstimate === 1 ? "" : "s"}`
    });
  }

  if (previous && previous.streamStatus !== sample.streamStatus) {
    events.push({
      id: `${sample.id}-status`,
      createdAt: sample.sampledAt,
      type: "stream_status",
      label: `Stream went ${sample.streamStatus}`,
      detail: sample.title ?? "Twitch stream status changed"
    });
  }

  store.activity = [...events.reverse(), ...store.activity].slice(0, MAX_ACTIVITY);
}

function formatSigned(value: number) {
  if (value > 0) {
    return `+${value}`;
  }

  return `${value}`;
}
