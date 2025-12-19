import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/iniciar-sesion", "/registrarse"];
const privateRoutes = ["/vacantes"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken");
  const hasValidAuth = !!refreshToken;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  if (isPrivateRoute && !hasValidAuth) {
    const loginUrl = new URL("/iniciar-sesion", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && hasValidAuth) {
    return NextResponse.redirect(new URL("/vacantes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
