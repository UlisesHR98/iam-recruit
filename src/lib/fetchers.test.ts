import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAuthStore } from "@/stores/auth-store";

const mockEnsureValidToken = vi.fn();
const mockRefreshAccessToken = vi.fn();

vi.mock("@/lib/refresh-token", () => ({
  ensureValidToken: () => mockEnsureValidToken(),
  refreshAccessToken: () => mockRefreshAccessToken(),
}));

const { fetcher } = await import("./fetchers");

const initialState = useAuthStore.getState();

global.fetch = vi.fn();

describe("Fetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState(initialState, true);
    useAuthStore.setState({ accessToken: null });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("throws UNAUTHORIZED when ensureValidToken returns null", async () => {
    mockEnsureValidToken.mockResolvedValue(null);

    await expect(fetcher("/test")).rejects.toThrow("UNAUTHORIZED");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("sends request with valid token from ensureValidToken", async () => {
    mockEnsureValidToken.mockResolvedValue("valid-token");
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: "test" }),
    });

    const result = await fetcher("/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: { Authorization: "Bearer valid-token" },
      })
    );
    expect(result).toEqual({ data: "test" });
  });

  it("retries with refreshAccessToken on 401 response", async () => {
    mockEnsureValidToken.mockResolvedValue("expired-token");
    mockRefreshAccessToken.mockResolvedValue("new-token");

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

    const result = await fetcher("/test");

    expect(result).toEqual({ success: true });
    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("clears auth and throws UNAUTHORIZED when refresh fails on 401", async () => {
    mockEnsureValidToken.mockResolvedValue("expired-token");
    mockRefreshAccessToken.mockResolvedValue(null);

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(fetcher("/test")).rejects.toThrow("UNAUTHORIZED");
    expect(useAuthStore.getState().accessToken).toBe(null);
  });

  it("clears auth and throws UNAUTHORIZED when retry also returns 401", async () => {
    mockEnsureValidToken.mockResolvedValue("expired-token");
    mockRefreshAccessToken.mockResolvedValue("new-token");

    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

    await expect(fetcher("/test")).rejects.toThrow("UNAUTHORIZED");
    expect(useAuthStore.getState().accessToken).toBe(null);
  });

  it("throws API_ERROR on non-401 error response", async () => {
    mockEnsureValidToken.mockResolvedValue("valid-token");

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetcher("/test")).rejects.toThrow("API_ERROR");
  });
});
