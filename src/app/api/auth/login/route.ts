import { NextRequest, NextResponse } from "next/server";
import {
  checkCredentials,
  createSessionToken,
  isAuthConfigured,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and SESSION_SECRET in .env.local, then restart the dev server.",
      },
      { status: 503 }
    );
  }

  let username = "";
  let password = "";

  try {
    const body = await req.json();
    username = String(body.username || "");
    password = String(body.password || "");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { error: "Incorrect username or password" },
      { status: 401 }
    );
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
