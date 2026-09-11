import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePbsDropinFlow } from "../../src/hooks/usePbsDropinFlow";
import { dropinTestProps } from "../helpers/dropinProps";

const createSessionMock = vi.fn();

vi.mock("../../src/api/createSession", () => ({
  createSession: (...args: unknown[]) => createSessionMock(...args),
}));

async function submitWithCountry(result: {
  current: {
    updateField: (key: "shopperCountryCode", value: string) => void;
    submit: () => Promise<void>;
  };
}) {
  act(() => {
    result.current.updateField("shopperCountryCode", "FR");
  });
  await act(async () => {
    await result.current.submit();
  });
}

describe("usePbsDropinFlow", () => {
  beforeEach(() => {
    createSessionMock.mockReset();
  });

  it("uses the accessToken prop to create the session", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ accessToken: "prop-token" })),
    );

    await submitWithCountry(result);

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({ accessToken: "prop-token" }),
      );
    });
    expect(result.current.status).toBe("ready");
  });

  it("exposes API errors", async () => {
    createSessionMock.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    await submitWithCountry(result);

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });
    expect(result.current.submitError).toBe("boom");
  });

  it("uses the publicStoreId and returnUrl props in the session body", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const { result } = renderHook(() =>
      usePbsDropinFlow(
        dropinTestProps({
          publicStoreId: "store-prop",
          returnUrl: "https://app.example/return",
        }),
      ),
    );

    await submitWithCountry(result);

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            publicStoreId: "store-prop",
            returnUrl: "https://app.example/return",
          }),
        }),
      );
    });
  });

  it("freezes a single locale and hides the selector", () => {
    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ locales: ["es-ES"] })),
    );
    expect(result.current.locale).toBe("es-ES");
    expect(result.current.showLanguageSelector).toBe(false);
  });

  it("falls back to EUR only when currencies are omitted", () => {
    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ currencies: undefined })),
    );
    expect(result.current.currencyOptions).toEqual(["EUR"]);
    expect(result.current.form.currency).toBe("EUR");
  });

  it("uses the locale prop as the Adyen locale by default", () => {
    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ locale: "en-US" })),
    );
    expect(result.current.locale).toBe("en-US");
    expect(result.current.form.locale).toBe("en-US");
  });

  it("lets the language field override the locale prop", () => {
    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ locale: "en-US" })),
    );

    act(() => {
      result.current.updateField("locale", "es-ES");
    });

    expect(result.current.locale).toBe("es-ES");
  });

  it("does not send lineItems when the prop is omitted", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    act(() => {
      result.current.updateField("shopperCountryCode", "FR");
      result.current.updateField("amount", "10");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalled();
    });
    const body = createSessionMock.mock.calls[0]?.[0]?.body as {
      lineItems?: unknown;
    };
    expect(body.lineItems).toBeUndefined();
  });

  it("sends the lineItems prop on session create", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const lineItems = [
      {
        id: "ROOM-1",
        description: "Massage 60 min",
        quantity: 1,
        amountIncludingTax: 10000,
      },
    ];
    const { result } = renderHook(() =>
      usePbsDropinFlow(dropinTestProps({ lineItems })),
    );

    act(() => {
      result.current.updateField("shopperCountryCode", "FR");
    });

    await act(async () => {
      await result.current.submit();
    });

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ lineItems }),
        }),
      );
    });
  });

  it("sends preAuth, moto and tokenization flags matching the public session contract", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    act(() => {
      result.current.updateField("preAuth", true);
      result.current.updateField("moto", true);
      result.current.updateField("tokenizationEnabled", true);
      result.current.updateField("shopperReference", "client-42");
      result.current.updateField("recurringModel", "SUBSCRIPTION");
    });
    await submitWithCountry(result);

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            preAuth: true,
            moto: true,
            tokenization: {
              shopperReference: "client-42",
              recurringModel: "SUBSCRIPTION",
              consentMode: "ASK_FOR_CONSENT",
            },
            capture: { mode: "MANUAL" },
          }),
        }),
      );
    });
  });

  it("sends tokenization null when tokenization is unchecked", async () => {
    createSessionMock.mockResolvedValue({
      sessionRequestId: "req",
      status: "CREATED",
      publicSessionId: "pub",
      clientSession: { id: "id", sessionData: "data" },
      expiresAt: "2030-01-01T00:00:00Z",
    });

    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    act(() => {
      result.current.updateField("tokenizationEnabled", true);
      result.current.updateField("shopperReference", "client-42");
      result.current.updateField("tokenizationEnabled", false);
    });
    await submitWithCountry(result);

    await waitFor(() => {
      expect(createSessionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            tokenization: null,
            preAuth: false,
            moto: false,
          }),
        }),
      );
    });
  });

  it("blocks submit without a shopper country", async () => {
    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    await act(async () => {
      await result.current.submit();
    });

    expect(createSessionMock).not.toHaveBeenCalled();
    expect(result.current.errors.shopperCountryCode).toBeDefined();
    expect(result.current.status).toBe("error");
  });

  it("forces MANUAL capture when preAuth is enabled and clears preAuth on IMMEDIATE", () => {
    const { result } = renderHook(() => usePbsDropinFlow(dropinTestProps()));

    act(() => {
      result.current.updateField("preAuth", true);
    });
    expect(result.current.form.captureMode).toBe("MANUAL");
    expect(result.current.form.preAuth).toBe(true);

    act(() => {
      result.current.updateField("captureMode", "IMMEDIATE");
    });
    expect(result.current.form.preAuth).toBe(false);
    expect(result.current.form.captureMode).toBe("IMMEDIATE");
  });
});
