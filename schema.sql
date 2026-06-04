create table if not exists twitch_metric_samples (
  id text primary key,
  sampled_at timestamptz not null,
  broadcaster_login text not null,
  stream_status text not null check (stream_status in ('online', 'offline', 'unknown')),
  viewer_count integer not null default 0,
  chatters integer,
  entered_estimate integer not null default 0,
  left_estimate integer not null default 0,
  title text,
  game_name text,
  started_at timestamptz
);

create index if not exists twitch_metric_samples_sampled_at_idx
  on twitch_metric_samples (sampled_at desc);
