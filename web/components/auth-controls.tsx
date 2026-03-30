"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { getPublicAppUrl } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthControlsProps = {
  isAuthenticated: boolean;
  userEmail?: string;
  initialMessage?: string;
};

export function AuthControls({
  isAuthenticated,
  userEmail,
  initialMessage,
}: AuthControlsProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMagicLinkSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("");

    const supabase = createSupabaseBrowserClient();
    const appUrl = getPublicAppUrl() ?? window.location.origin;
    const redirectTo = new URL("/auth/callback", appUrl);
    redirectTo.searchParams.set("next", "/");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo.toString(),
      },
    });

    setIsSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Magic link sent. Finish sign-in from your email, then return here.");
    setEmail("");
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setStatus("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();

    setIsSubmitting(false);

    if (error) {
      setStatus(error.message);
      return;
    }

    router.refresh();
  }

  if (isAuthenticated) {
    return (
      <div className="auth-card">
        <div className="auth-card__meta">
          <span className="auth-card__label">Signed in</span>
          <strong>{userEmail ?? "Supabase user"}</strong>
        </div>
        <button
          className="button button--secondary"
          onClick={handleSignOut}
          type="button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing out..." : "Sign out"}
        </button>
        {status ? <p className="auth-card__status">{status}</p> : null}
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleMagicLinkSignIn}>
      <div className="auth-card__meta">
        <label className="auth-card__label" htmlFor="email">
          Email magic link
        </label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="party@arcanum.app"
          required
        />
      </div>
      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending link..." : "Send sign-in link"}
      </button>
      <p className="auth-card__status">
        {status || "Authentication stays intentionally minimal in M0: sign in, detect session, sign out."}
      </p>
    </form>
  );
}
