import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const errorUrl = new URL(next, requestUrl.origin);
      errorUrl.searchParams.set("auth_message", "Sign-in could not be completed.");
      return NextResponse.redirect(errorUrl);
    }
  }

  const redirectUrl = new URL(next, requestUrl.origin);
  redirectUrl.searchParams.set("auth_message", "Sign-in complete.");

  return NextResponse.redirect(redirectUrl);
}
