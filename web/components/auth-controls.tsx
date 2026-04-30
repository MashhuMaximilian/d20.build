"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { getPublicAppUrl } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthControlsProps = {
  isAuthenticated: boolean;
  userEmail?: string;
  initialMessage?: string;
  variant?: "card" | "inline";
};

export function AuthControls({
  isAuthenticated,
  userEmail,
  initialMessage,
  variant = "card",
}: AuthControlsProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(initialMessage ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function buildRedirectTo() {
    const appUrl = getPublicAppUrl() ?? window.location.origin;
    const redirectTo = new URL("/auth/callback", appUrl);
    redirectTo.searchParams.set("next", "/");
    return redirectTo.toString();
  }

  async function handleGoogleSignIn() {
    setIsSubmitting(true);
    setStatus("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildRedirectTo(),
      },
    });

    if (error) {
      setIsSubmitting(false);
      setStatus(error.message);
      return;
    }
  }

  async function handleMagicLinkSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("");

    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: buildRedirectTo(),
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
      <div className={variant === "inline" ? "auth-inline" : "auth-card"}>
        <div className="auth-card__meta">
          <span className="auth-card__label">
            {variant === "inline" ? "Account" : "Signed in"}
          </span>
          <strong>{userEmail ?? "Supabase user"}</strong>
        </div>
        <button
          className={variant === "inline" ? "button button--secondary button--compact" : "button button--secondary"}
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

  if (variant === "inline") {
    return (
      <div className="auth-inline auth-inline--anonymous">
        <div className="auth-card__meta">
          <span className="auth-card__label">Account</span>
          <strong>Anonymous</strong>
        </div>
        <button
          className="button button--compact"
          type="button"
          disabled={isSubmitting}
          onClick={handleGoogleSignIn}
        >
          {isSubmitting ? "Redirecting..." : "Sign in"}
        </button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="auth-card__meta">
        <span className="auth-card__label">Google OAuth</span>
        <p className="auth-card__status">
          Recommended for development. It avoids Supabase&apos;s built-in magic-link
          email limits.
        </p>
      </div>
      <button className="button" type="button" disabled={isSubmitting} onClick={handleGoogleSignIn}>
        {isSubmitting ? "Redirecting..." : "Continue with Google"}
      </button>
      <div className="auth-card__divider" aria-hidden="true">
        <span>or</span>
      </div>
      <form className="auth-card__email" onSubmit={handleMagicLinkSignIn}>
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
            placeholder="you@d20.build"
            required
          />
        </div>
        <button className="button button--secondary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending link..." : "Use email instead"}
        </button>
      </form>
      <p className="auth-card__status">
        {status ||
          "Authentication stays intentionally minimal in M0: sign in, detect session, sign out."}
      </p>
    </div>
  );
}
