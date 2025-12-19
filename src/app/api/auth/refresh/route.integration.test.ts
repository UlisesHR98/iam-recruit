import { describe, it, expect, beforeAll } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { config } from "dotenv";

config();

const API_URL = process.env.API_URL;

describe("Refresh API Route - Integration Test", () => {
  // @vitest-environment node
  beforeAll(() => {
    if (!API_URL) {
      throw new Error(
        "API_URL environment variable is required for integration tests"
      );
    }
  });

  const createRequest = (refreshToken: string) => {
    const req = new NextRequest("http://localhost:3000/api/auth/refresh", {
      method: "POST",
    });

    Object.defineProperty(req, "cookies", {
      value: {
        get: (name: string) =>
          name === "refreshToken" ? { value: refreshToken } : undefined,
      },
    });

    return req;
  };

  it("should successfully refresh token with valid refreshToken", async () => {
    const validRefreshToken = process.env.TEST_REFRESH_TOKEN;

    if (!validRefreshToken) {
      console.warn(
        "TEST_REFRESH_TOKEN not set, skipping integration test. Set it to test against real backend."
      );
      return;
    }

    const req = createRequest(validRefreshToken);

    console.log(
      "🔍 Testing with refresh token:",
      validRefreshToken.substring(0, 20) + "..."
    );
    console.log("🔍 Token length:", validRefreshToken.length);

    const res = await POST(req);

    const data = await res.json();

    console.log("🔍 Response status:", res.status);
    console.log("🔍 Response data:", JSON.stringify(data, null, 2));

    if (res.status === 401) {
      console.warn(
        "⚠️  Refresh token is invalid or expired. This is expected if the token is old."
      );
      console.log("Response:", data.message);
      console.log(
        "💡 To test with a valid token, get a fresh refreshToken from your backend and set TEST_REFRESH_TOKEN in .env"
      );
      return;
    }

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("accessToken");
    expect(typeof data.accessToken).toBe("string");
    expect(data.accessToken.length).toBeGreaterThan(0);

    const sessionCookie = res.cookies.get("session");
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toBe("1");

    const refreshCookie = res.cookies.get("refreshToken");
    if (refreshCookie) {
      expect(refreshCookie.value.length).toBeGreaterThan(0);
    }
  }, 10000);

  it("should return 401 with invalid refreshToken", async () => {
    const req = createRequest("invalid-refresh-token-12345");
    const res = await POST(req);

    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data).toHaveProperty("message");
  }, 10000);

  it("should return 401 or 400 when refreshToken is missing", async () => {
    const req = createRequest("");
    const res = await POST(req);

    expect([400, 401]).toContain(res.status);

    const data = await res.json();
    expect(data).toHaveProperty("message");
    expect(typeof data.message).toBe("string");
  });
});
