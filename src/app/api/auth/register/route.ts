import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(data.detail, "Error al registrar usuario"),
        },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(
      { accessToken: data.access_token || data.accessToken },
      { status: response.status }
    );

    const refreshTokenValue = data.refresh_token;
    if (refreshTokenValue) {
      nextResponse.cookies.set("refreshToken", refreshTokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      nextResponse.cookies.set("auth-success", "true", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 10,
      });
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
