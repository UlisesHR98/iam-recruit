import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "");
    const { jobId } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/jobs/${jobId}/email-forwarding/test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al enviar el correo de prueba"
          ),
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Correo de prueba enviado" },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
