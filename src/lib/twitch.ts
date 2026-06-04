import { getPreviousSample, saveMetricSample } from "@/lib/data/metrics-repository";
import { TwitchMetricSample } from "@/lib/types";

const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API_URL = "https://api.twitch.tv/helix";

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
};

type TwitchStream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
};

type TwitchChattersResponse = {
  total: number;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

const tokenCache = globalThis as typeof globalThis & {
  miguelTwitchAppToken?: CachedToken;
};

export async function getTwitchStatus() {
  const login = getBroadcasterLogin();
  const appToken = await getAppAccessToken();
  const stream = await fetchLiveStream(login, appToken);
  const user = await fetchTwitchUser(login, appToken);
  const chatters = user ? await fetchChatters(user.id) : null;

  return {
    broadcasterLogin: login,
    user,
    stream,
    chatters,
    streamStatus: stream ? "online" as const : "offline" as const
  };
}

export async function pollTwitchAndSaveSample(): Promise<TwitchMetricSample> {
  const status = await getTwitchStatus();
  const previous = await getPreviousSample();
  const currentViewers = status.stream?.viewer_count ?? 0;
  const previousViewers = previous?.viewerCount ?? 0;

  const sample: TwitchMetricSample = {
    id: crypto.randomUUID(),
    sampledAt: new Date().toISOString(),
    broadcasterLogin: status.broadcasterLogin,
    streamStatus: status.streamStatus,
    viewerCount: currentViewers,
    chatters: status.chatters,
    // Twitch does not expose exact page enter/leave events.
    // These estimates are only the positive difference between adjacent viewer samples.
    enteredEstimate: Math.max(currentViewers - previousViewers, 0),
    leftEstimate: Math.max(previousViewers - currentViewers, 0),
    title: status.stream?.title ?? null,
    gameName: status.stream?.game_name ?? null,
    startedAt: status.stream?.started_at ?? null
  };

  return saveMetricSample(sample);
}

async function getAppAccessToken() {
  const clientId = requiredEnv("TWITCH_CLIENT_ID");
  const clientSecret = requiredEnv("TWITCH_CLIENT_SECRET");
  const cached = tokenCache.miguelTwitchAppToken;

  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const response = await fetch(TWITCH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials"
    })
  });

  if (!response.ok) {
    throw new Error(`Twitch token request failed with ${response.status}`);
  }

  const token = (await response.json()) as TwitchTokenResponse;
  tokenCache.miguelTwitchAppToken = {
    accessToken: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000
  };

  return token.access_token;
}

async function fetchLiveStream(login: string, appToken: string): Promise<TwitchStream | null> {
  const params = new URLSearchParams({ user_login: login });
  const response = await twitchFetch(`/streams?${params}`, appToken);
  const payload = (await response.json()) as { data: TwitchStream[] };

  return payload.data[0] ?? null;
}

async function fetchTwitchUser(login: string, appToken: string): Promise<TwitchUser | null> {
  const params = new URLSearchParams({ login });
  const response = await twitchFetch(`/users?${params}`, appToken);
  const payload = (await response.json()) as { data: TwitchUser[] };

  return payload.data[0] ?? null;
}

async function fetchChatters(broadcasterId: string): Promise<number | null> {
  const token = process.env.TWITCH_CHAT_ACCESS_TOKEN;
  const moderatorId = process.env.TWITCH_MODERATOR_USER_ID ?? broadcasterId;

  if (!token) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      broadcaster_id: broadcasterId,
      moderator_id: moderatorId,
      first: "1"
    });
    const response = await fetch(`${TWITCH_API_URL}/chat/chatters?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": requiredEnv("TWITCH_CLIENT_ID")
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as TwitchChattersResponse;
    return payload.total;
  } catch {
    return null;
  }
}

async function twitchFetch(path: string, appToken: string) {
  const response = await fetch(`${TWITCH_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${appToken}`,
      "Client-Id": requiredEnv("TWITCH_CLIENT_ID")
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Twitch API request failed with ${response.status}`);
  }

  return response;
}

function getBroadcasterLogin() {
  return process.env.TWITCH_BROADCASTER_LOGIN ?? "itsmiguelofficial";
}

function requiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
