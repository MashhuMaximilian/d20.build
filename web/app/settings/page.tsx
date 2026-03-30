import { ContentSourcesSettings } from "@/components/content-sources-settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ContentSourcesSettings isAuthenticated={Boolean(user)} />;
}
