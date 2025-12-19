import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al obtener información del usuario"
          ),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
