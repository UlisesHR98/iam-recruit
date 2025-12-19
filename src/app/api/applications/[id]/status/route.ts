import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    let accessToken = authHeader.replace("Bearer ", "");

    if (!API_URL) {
      return NextResponse.json(
        { message: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { message: "El campo status es requerido" },
        { status: 400 }
      );
    }

    let response = await fetch(`${API_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: body.status }),
      cache: "no-store",
    });

    let data = await response.json();
    let newRefreshToken: string | undefined;

    if (response.status === 401) {
      const refreshToken = request.cookies.get("refreshToken");

      if (!refreshToken) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
      }

      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken.value,
        }),
        cache: "no-store",
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        const nextResponse = NextResponse.json(
          { message: "No autorizado" },
          { status: 401 }
        );
        nextResponse.cookies.delete("refreshToken");
        return nextResponse;
      }

      const newAccessToken = refreshData.access_token;
      newRefreshToken = refreshData.refresh_token;

      response = await fetch(`${API_URL}/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify({ status: body.status }),
        cache: "no-store",
      });

      data = await response.json();
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al actualizar el estatus de la aplicación"
          ),
        },
        { status: response.status }
      );
    }

    const finalResponse = NextResponse.json(data, { status: response.status });

    if (newRefreshToken) {
      finalResponse.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return finalResponse;
  } catch (error) {
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}


