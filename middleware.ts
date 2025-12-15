import { NextRequest, NextResponse } from "next/server";

const publicAuthPages = ["/auth/login", "/auth/register"];
const validRoutes = [
  "/dashboard",
  "/dashboard/product-create",
  "/dashboard/feedback-form",
  "/dashboard/incomplete-form-feedback",
  "/dashboard/reward",
  ...publicAuthPages,
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!sessionToken;
  const isPublicPage = publicAuthPages.includes(pathname);
  const isValidRoute = validRoutes.includes(pathname);

  // Not authenticated → redirect all protected routes to login
  if (!isAuthenticated && !isPublicPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Authenticated and visiting login/register → redirect to dashboard
  if (isAuthenticated && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Authenticated but route does not exist → redirect to dashboard
  if (isAuthenticated && !isValidRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
