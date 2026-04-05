import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // SECURITY: app_metadata.role is the authoritative source of truth.
  // It can only be set by the service_role key (admin API), not by users.
  // We fall back to user_metadata.role for backward compat with accounts
  // created before the migration to app_metadata.
  const ALLOWED_ROLES = ["client", "dev"];
  const rawRole = user?.app_metadata?.role || user?.user_metadata?.role;
  const sanitizedRole = ALLOWED_ROLES.includes(rawRole) ? rawRole : null;

  // Protect dev routes
  if (pathname.startsWith("/dev") && (!user || sanitizedRole !== "dev")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect client routes
  if (pathname.startsWith("/client") && (!user || sanitizedRole !== "client")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const dest = sanitizedRole === "dev" ? "/dev/dashboard" : "/client/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/stripe/webhooks|api/content).*)",
  ],
};
