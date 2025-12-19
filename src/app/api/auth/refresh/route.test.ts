import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

vi.mock("@/shared/errors", () => ({
  translateError: (msg: string, defaultMsg: string) => defaultMsg,
}));

vi.stubEnv("API_URL", "http://api.backend.com");
vi.stubEnv("NODE_ENV", "development");

global.fetch = vi.fn();

describe("Refresh API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (cookies: Record<string, string> = {}) => {
    const req = new NextRequest("http://localhost:3000/api/auth/refresh", {
      method: "POST",
    });

    Object.defineProperty(req, "cookies", {
      value: {
        get: (name: string) =>
          cookies[name] ? { value: cookies[name] } : undefined,
      },
    });

    return req;
  };

  it("returns 401 when refreshToken cookie is missing", async () => {
    const req = createRequest({});
    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toBe("No refresh token found");
  });

  it("renews session cookie on successful refresh", async () => {
    const req = createRequest({ refreshToken: "valid-refresh-token" });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.accessToken).toBe("new-access-token");

    // Check if cookies are set
    // In Next.js NextResponse, we can check cookies on the response object
    const sessionCookie = res.cookies.get("session");
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBe("1");

    const refreshCookie = res.cookies.get("refreshToken");
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie?.value).toBe("new-refresh-token");
  });

  it("deletes refreshToken cookie on backend 401", async () => {
    const req = createRequest({ refreshToken: "invalid-refresh-token" });

    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid token" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(401);

    // Check if cookie is deleted
    // In Next.js, delete() sets value to empty string and maxAge to 0 (or expires in past)
    const refreshCookie = res.cookies.get("refreshToken");
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie?.value).toBe("");
    // Note: response.cookies.delete doesn't strictly set maxAge:0 in the returned object in all versions/mocks,
    // but checking value is empty is a good indicator, and we can check headers if needed.
    // However, standard Next.js behavior for delete is empty value.
    // Let's also check if the object has attributes indicating deletion if possible,
    // but usually value: '' is the observable effect on the response object.

    // Let's inspect the headers directly to be safe if cookies.get is ambiguous
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("refreshToken=;");
    // Next.js uses Expires for deletion in some environments/versions
    expect(setCookie).toMatch(/Expires=|Max-Age=0/);
  });

  it("returns error when backend fails with non-401", async () => {
    const req = createRequest({ refreshToken: "valid-token" });

    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ detail: "Server Error" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("handles exceptions gracefully", async () => {
    const req = createRequest({ refreshToken: "valid-token" });
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.message).toBe("Error al procesar la solicitud");
  });

  it("sends refresh_token in request body to backend", async () => {
    const refreshTokenValue = "test-refresh-token-123";
    const req = createRequest({ refreshToken: refreshTokenValue });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access-token",
        refresh_token: "new-refresh-token",
      }),
    });

    await POST(req);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshTokenValue,
        }),
      })
    );
  });

  it("handles backend response with accessToken field (alternative naming)", async () => {
    const req = createRequest({ refreshToken: "valid-token" });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        accessToken: "new-access-token-alt",
        refresh_token: "new-refresh-token",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.accessToken).toBe("new-access-token-alt");
  });

  it("does not set refreshToken cookie if backend does not return it", async () => {
    const req = createRequest({ refreshToken: "valid-token" });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: "new-access-token",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const sessionCookie = res.cookies.get("session");
    expect(sessionCookie?.value).toBe("1");

    const refreshCookie = res.cookies.get("refreshToken");
    expect(refreshCookie).toBeUndefined();
  });
});
