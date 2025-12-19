import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const nextResponse = NextResponse.json(
        {
          message: translateError(data.detail, "Error al refrescar el token"),
        },
        { status: response.status }
      );

      if (response.status === 401) {
        nextResponse.cookies.delete("refreshToken");
      }

      return nextResponse;
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
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
