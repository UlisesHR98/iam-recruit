import { NextRequest, NextResponse } from "next/server";
import { translateError } from "@/shared/errors";

const API_URL = process.env.API_URL;

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const apiUrl = queryString
      ? `${API_URL}/applications?${queryString}`
      : `${API_URL}/applications`;

    let response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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

      response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        cache: "no-store",
      });

      data = await response.json();
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(
            data.detail,
            "Error al obtener las aplicaciones"
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
        maxAge: 60 * 60,
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

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const job_id = formData.get("job_id") as string;
    const file = formData.get("file") as File | null;

    if (!job_id || !file) {
      return NextResponse.json(
        { message: "job_id y file son requeridos" },
        { status: 400 }
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("job_id", job_id);
    uploadFormData.append("file", file);

    let response = await fetch(`${API_URL}/applications/evaluate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: uploadFormData,
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

      const retryFormData = new FormData();
      retryFormData.append("job_id", job_id);
      retryFormData.append("file", file);

      response = await fetch(`${API_URL}/applications/evaluate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: retryFormData,
        cache: "no-store",
      });

      data = await response.json();
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          message: translateError(data.detail, "Error al subir el documento"),
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
