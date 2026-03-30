import { ReactNode } from "react";

import { AuthControls } from "@/components/auth-controls";
import { PrimaryNav } from "@/components/primary-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SiteShellProps = {
  children: ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="site-shell">
      <div className="site-shell__inner">
        <header className="site-shell__header">
          <div className="site-shell__topbar">
            <div className="site-shell__brand">
              <span className="site-shell__eyebrow">d20.build</span>
              <h1 className="site-shell__title">Arcanum</h1>
              <p className="site-shell__subtitle">
                SRD-first D&amp;D 5e character builder for the web, with Aurora-style
                content imports coming in through the same rules-driven architecture.
              </p>
            </div>

            <div className="site-shell__actions">
              <PrimaryNav />
              <AuthControls
                isAuthenticated={Boolean(user)}
                userEmail={user?.email}
                variant="inline"
              />
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
