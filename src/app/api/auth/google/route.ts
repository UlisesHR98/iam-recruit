import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Token de Google es requerido" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    const setCookieHeader = response.headers.get("set-cookie");

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al iniciar sesión con Google"
          ),
        },
        { status: response.status }
      );
    }

    const nextResponse = NextResponse.json(
      {
        accessToken: data.access_token || data.accessToken,
        isNewAccount: data.is_new_account || false,
      },
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

    if (setCookieHeader) {
      const cookies = setCookieHeader.split(/,(?=\w+=)/);
      for (const cookie of cookies) {
        const parts = cookie.trim().split(";");
        const [nameValue] = parts;
        const [name, ...valueParts] = nameValue.split("=");
        const value = valueParts.join("=");

        if (name === "refreshToken" && !refreshTokenValue) {
          nextResponse.cookies.set("refreshToken", value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      }
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
