import { Dashboard } from "@/components/dashboard";

export default function Home() {
  const instagramUrl = process.env.INSTAGRAM_PROFILE_URL ?? "https://www.instagram.com/itsmiguel.official/";

  return <Dashboard instagramUrl={instagramUrl} />;
}
