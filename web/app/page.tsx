import { redirect } from "next/navigation";
import Link from "next/link";

import { AuthControls } from "@/components/auth-controls";
import { getBuiltInSrdBackgroundSummary } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClassSummary } from "@/lib/builtins/classes";
import { getBuiltInSrdRaceSummary } from "@/lib/builtins/races";
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

  const builtInRaces = getBuiltInSrdRaceSummary();
  const builtInClasses = getBuiltInSrdClassSummary();
  const builtInBackgrounds = getBuiltInSrdBackgroundSummary();
  const isAuthenticated = Boolean(user);

  return (
    <div className="home-shell">
      <section className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">Phase 1</span>
          <h2 className="hero__title">
            Build characters on the web, with the rules engine doing the real work.
          </h2>
          <p className="hero__text">
            The foundation is now live with SRD races, classes, and backgrounds
            flowing through one built-ins model. Next we keep replacing scaffolding
            with actual builder behavior instead of adding more placeholder surfaces.
          </p>
          <div className="hero__actions">
            <Link className="button" href="/builder/new">
              Open builder
            </Link>
            <Link className="button button--secondary" href="/characters">
              View characters
            </Link>
          </div>
        </div>

        <section className="auth-panel" id="sign-in">
          <div className="auth-panel__copy">
            <span className="route-shell__tag">Account</span>
            <h3 className="landing-panel__title">
              {isAuthenticated ? "You are signed in" : "Sign in to save characters"}
            </h3>
            <p className="landing-panel__text">
              {isAuthenticated
                ? `Signed in as ${user?.email ?? "a Supabase user"}. Cloud saves and character persistence can now layer onto this session path.`
                : "Use a magic link to authenticate. The link should return to the deployed d20.build app, not localhost."}
            </p>
          </div>
          <AuthControls
            isAuthenticated={isAuthenticated}
            userEmail={user?.email}
            initialMessage={params?.auth_message}
          />
        </section>
      </section>

      <section className="summary-grid" aria-label="Current SRD coverage">
        <article className="summary-card">
          <span className="summary-card__label">Races</span>
          <strong className="summary-card__value">{builtInRaces.raceCount}</strong>
          <p className="summary-card__text">
            {builtInRaces.names.join(", ")} plus {builtInRaces.subraceCount} subraces and{" "}
            {builtInRaces.traitCount} related traits.
          </p>
        </article>
        <article className="summary-card">
          <span className="summary-card__label">Classes</span>
          <strong className="summary-card__value">{builtInClasses.classCount}</strong>
          <p className="summary-card__text">
            {builtInClasses.names.join(", ")} with {builtInClasses.featureCount} class
            features and {builtInClasses.spellcastingFeatureCount} spellcasting entry point.
          </p>
        </article>
        <article className="summary-card">
          <span className="summary-card__label">Backgrounds</span>
          <strong className="summary-card__value">{builtInBackgrounds.backgroundCount}</strong>
          <p className="summary-card__text">
            {builtInBackgrounds.names.join(", ")} with {builtInBackgrounds.featureCount}{" "}
            background features and {builtInBackgrounds.choiceCount} choice nodes.
          </p>
        </article>
      </section>
    </div>
  );
}
