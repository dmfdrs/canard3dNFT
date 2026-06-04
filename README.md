# Miguel Stream Monitor

Miguel Stream Monitor is a free full-stack Next.js dashboard for the `itsmiguelofficial` Twitch brand and `itsmiguel.official` Instagram profile.

It uses Twitch Helix for live stream metrics, Recharts for the dashboard chart, Tailwind CSS for the neon esports UI, and a repository-style data layer that is ready to replace with Supabase or PostgreSQL storage.

## Features

- Dark esports dashboard with purple neon panels and responsive mobile layout
- Twitch and Instagram profile buttons with icons
- Live viewers, chatters, estimated entered, estimated left, peak viewers, and stream status cards
- Line chart for viewers, chatters, and estimated visitors over time
- Activity feed for viewer changes, estimates, and online/offline status
- Twitch API routes:
  - `GET /api/twitch/status`
  - `GET /api/twitch/metrics`
  - `POST /api/twitch/poll`
- Instagram Graph API placeholder module with no scraping
- Clear estimate labels: the app never claims exact page enter or leave tracking

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Fill in Twitch app credentials:

```bash
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
TWITCH_BROADCASTER_LOGIN=itsmiguelofficial
INSTAGRAM_PROFILE_URL=https://www.instagram.com/itsmiguel.official/
```

4. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Twitch Notes

The dashboard polls `POST /api/twitch/poll` every 30 seconds while the page is open. That endpoint calls Twitch Helix, records the latest viewer count, computes enter/leave estimates from the previous sample, and stores the sample in the repository.

Chatters are optional because Twitch requires a user access token with the `moderator:read:chatters` scope for `/helix/chat/chatters`. If `TWITCH_CHAT_ACCESS_TOKEN` and a moderator id are not configured, the app leaves chatters as unavailable instead of faking the number.

## Data Layer

The default repository is in-memory so the app works locally without paid services. To make it durable, create the table in `schema.sql` on Supabase or PostgreSQL and replace the repository functions in `src/lib/data/metrics-repository.ts` with database calls.

In-memory data resets when the dev server restarts and may not persist in serverless deployments.

## Instagram

`src/lib/instagram.ts` intentionally contains only a placeholder for future Instagram Graph API insights. The app links to the Instagram profile and does not scrape Instagram.
