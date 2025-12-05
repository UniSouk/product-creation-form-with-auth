import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const publicAuthPages = ["/auth/login", "/auth/register"];

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicAuthPage = publicAuthPages.includes(pathname);

  // --- 1. If NOT logged in and visiting public pages (login/register) → allow
  if (!session && isPublicAuthPage) {
    return NextResponse.next();
  }

  // --- 2. If NOT logged in and trying to visit ANY protected route → redirect to /auth/register
  if (!session && !isPublicAuthPage) {
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  // --- 3. If LOGGED IN and visiting login/register → redirect to dashboard
  if (session && isPublicAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // --- 4. If LOGGED IN and accessing protected pages → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
