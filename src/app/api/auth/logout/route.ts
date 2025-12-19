import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken");

    if (refreshToken) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken.value,
          }),
        });
      } catch {}
    }

    const nextResponse = NextResponse.json(
      { message: "Sesión cerrada exitosamente" },
      { status: 200 }
    );

    nextResponse.cookies.delete("refreshToken");

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
