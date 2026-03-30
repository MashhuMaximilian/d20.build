import Link from "next/link";
import { ReactNode } from "react";

import { AuthControls } from "@/components/auth-controls";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SiteShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/characters", label: "Characters" },
  { href: "/builder/new", label: "New Builder" },
  { href: "/settings", label: "Settings" },
];

export async function SiteShell({ children }: SiteShellProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="site-shell">
      <div className="site-shell__inner">
        <header className="site-shell__header">
          <div className="site-shell__brand">
            <span className="site-shell__eyebrow">Aurora Web Builder</span>
            <h1 className="site-shell__title">Arcanum</h1>
            <p className="site-shell__subtitle">
              Initial M0 scaffold for the web character builder. Routes,
              Supabase wiring, and a minimal auth entry path are in place so
              later milestones can layer in persistence and builder behavior.
            </p>
          </div>

          <div className="site-shell__actions">
            <nav className="site-shell__nav" aria-label="Primary">
              {navItems.map((item) => (
                <Link className="site-shell__navLink" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <AuthControls
              isAuthenticated={Boolean(user)}
              userEmail={user?.email}
            />
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
