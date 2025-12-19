import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { id } = await context.params;

    const response = await fetch(`${API_URL}/candidates/${id}`, {
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
            "Error al obtener la información del candidato"
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${API_URL}/candidates/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al actualizar el candidato"
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
