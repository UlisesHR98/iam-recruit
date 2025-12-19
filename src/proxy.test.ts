import { describe, it, expect, vi, beforeEach } from "vitest";
import { proxy } from "./proxy";
import { NextRequest, NextResponse } from "next/server";

// Mock NextRequest and NextResponse
// We need to mock these because they are not available in the test environment (jsdom) in the same way Next.js provides them
// However, since we are using jsdom, we can try to use standard Request and response, but NextRequest adds properties.
// A simpler way is to construct a mock object or use a library, but let's try to mock the specific usage.

describe("Middleware (proxy)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (url: string, cookies: Record<string, string> = {}) => {
    const req = new NextRequest(new URL(url, "http://localhost:3000"));
    // Mock cookies.get
    Object.defineProperty(req, "cookies", {
      value: {
        get: (name: string) =>
          cookies[name] ? { value: cookies[name] } : undefined,
        getAll: () =>
          Object.entries(cookies).map(([name, value]) => ({ name, value })),
      },
    });
    return req;
  };

  it("allows access to public routes without session", () => {
    const req = createRequest("/iniciar-sesion");
    const res = proxy(req);
    // NextResponse.next() returns a response with status 200 (usually) or simply passes through.
    // In Next.js middleware testing, we often check if it's NOT a redirect.
    expect(res.status).not.toBe(307);
    expect(res.status).not.toBe(308);
  });

  it("redirects to /iniciar-sesion when accessing protected route without session", () => {
    const req = createRequest("/vacantes");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/iniciar-sesion");
    expect(location).toContain("redirect=%2Fvacantes");
  });

  it("allows access to protected route with session", () => {
    const req = createRequest("/vacantes", { session: "valid-session" });
    const res = proxy(req);

    expect(res.status).not.toBe(307);
  });

  it("redirects authenticated user away from public routes", () => {
    const req = createRequest("/iniciar-sesion", { session: "valid-session" });
    const res = proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/vacantes");
  });

  it("ignores API routes", () => {
    const req = createRequest("/api/some-endpoint");
    const res = proxy(req);

    expect(res.status).not.toBe(307);
  });

  it("allows access to non-protected, non-public routes (default)", () => {
    const req = createRequest("/some-other-page");
    const res = proxy(req);
    expect(res.status).not.toBe(307);
  });
});
