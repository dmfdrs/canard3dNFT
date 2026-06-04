export type InstagramInsightSnapshot = {
  profileUrl: string;
  impressions: number | null;
  reach: number | null;
  followers: number | null;
};

export async function getInstagramInsightsPlaceholder(): Promise<InstagramInsightSnapshot> {
  return {
    profileUrl: process.env.INSTAGRAM_PROFILE_URL ?? "https://www.instagram.com/itsmiguel.official/",
    impressions: null,
    reach: null,
    followers: null
  };
}

// Instagram Graph API integration belongs here when a business/creator account
// and access token are configured. This app intentionally does not scrape Instagram.
