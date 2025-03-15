import { NextResponse, type NextRequest } from "next/server";
import {
  getUserFromSession,
  updateUserSessionData,
} from "./auth/core/user-session";

const privateRoutes = ["/private"];
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const response = await middlewareAuth(request);

  return response;
}

async function middlewareAuth(request: NextRequest) {
  const user = await getUserFromSession(request.cookies);

  let response: NextResponse | null = null;

  if (privateRoutes.includes(request.nextUrl.pathname)) {
    if (user == null) {
      response = NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (adminRoutes.includes(request.nextUrl.pathname)) {
    if (user == null) {
      response = NextResponse.redirect(new URL("/sign-in", request.url));
    }
    if (user?.role !== "admin") {
      response = NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!response) {
    response = NextResponse.next();
  }

  if (user) {
    await updateUserSessionData(
      user,
      {
        set: (key, value, options) => {
          response?.cookies.set({ ...options, name: key, value });
        },
        get: (key) => request.cookies.get(key),
      },
      true
    );
  }

  console.log("middleware", user);

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
