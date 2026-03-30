import { redirect } from "next/navigation";

import { AuthControls } from "@/components/auth-controls";
import { RouteShell } from "@/components/route-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type HomePageProps = {
  searchParams?: Promise<{
    auth_message?: string;
    code?: string;
    next?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;

  if (params?.code) {
    const callbackParams = new URLSearchParams({
      code: params.code,
      next: params.next || "/",
    });

    redirect(`/auth/callback?${callbackParams.toString()}`);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = Boolean(user);

  return (
    <div className="stack">
      <RouteShell
        route="/"
        title={isAuthenticated ? "Welcome back to Arcanum" : "Auth-aware landing shell"}
        description={
          isAuthenticated
            ? "The M0 landing page can now detect an authenticated Supabase session and keep the rest of the product surface stable while broader account and persistence work stays deferred."
            : "This entry point now distinguishes anonymous and authenticated states, offers a minimal sign-in path, and keeps the rest of the M0 product surface intentionally light."
        }
        bullets={
          isAuthenticated
            ? [
                `Signed in as ${user?.email ?? "a Supabase user"}.`,
                "Characters, builder, and settings routes remain scoped as placeholders for later milestones.",
                "Full account management and save flows are still intentionally deferred.",
              ]
            : [
                "Shared navigation links the initial product routes.",
                "A basic email-link sign-in path is available without introducing a separate auth IA.",
                "Anonymous drafts and broader persistence behavior remain out of scope for this slice.",
              ]
        }
      />
      <section className="landing-panel">
        <div className="landing-panel__copy">
          <span className="route-shell__tag">M0.6</span>
          <h2 className="landing-panel__title">Authentication foundation</h2>
          <p className="landing-panel__text">
            Supabase auth is now wired far enough to establish a session,
            detect signed-in versus anonymous visitors, and cleanly return from
            the technical callback route.
          </p>
        </div>
        <AuthControls
          isAuthenticated={isAuthenticated}
          userEmail={user?.email}
          initialMessage={params?.auth_message}
        />
      </section>
    </div>
  );
}
