import { describe, expect, it } from "vitest";
import { dropinTestProps } from "../helpers/dropinProps";
import { formToSessionRequest } from "../../src/mappers/formToSessionRequest";
import { createDefaultSessionForm } from "../../src/utils/defaultForm";
import type { SessionFormValues } from "../../src/types";

function form(overrides: Partial<SessionFormValues> = {}): SessionFormValues {
  return {
    ...createDefaultSessionForm(dropinTestProps()),
    ...overrides,
  };
}

describe("formToSessionRequest", () => {
  it("maps major units to cents in the session payload", () => {
    const request = formToSessionRequest(
      form({ amount: "100", captureMode: "MANUAL" }),
    );
    expect(request.amount).toEqual({ value: 10000, currency: "EUR" });
    expect(request.capture).toEqual({ mode: "MANUAL" });
    expect(request.tokenization).toBeNull();
    expect(request.moto).toBe(false);
    expect(request.preAuth).toBe(false);
    expect(request.publicStoreId).toBe("store-1");
    expect(request.reference).toBe("test-session-001");
  });

  it("adds delayHours when capture is DELAYED", () => {
    const request = formToSessionRequest(
      form({ captureMode: "DELAYED", captureDelayHours: "48" }),
    );
    expect(request.capture).toEqual({ mode: "DELAYED", delayHours: 48 });
  });

  it("maps tokenization when enabled", () => {
    const request = formToSessionRequest(
      form({
        tokenizationEnabled: true,
        shopperReference: "shopper-42",
        recurringModel: "SUBSCRIPTION",
      }),
    );
    expect(request.tokenization).toEqual({
      shopperReference: "shopper-42",
      recurringModel: "SUBSCRIPTION",
      consentMode: "ASK_FOR_CONSENT",
    });
    expect(request.moto).toBe(false);
    expect(request.preAuth).toBe(false);
  });

  it("sends consentMode on tokenization", () => {
    const request = formToSessionRequest(
      form({
        tokenizationEnabled: true,
        shopperReference: "shopper-42",
        consentMode: "FORCED",
      }),
    );
    expect(request.tokenization).toEqual({
      shopperReference: "shopper-42",
      recurringModel: "CARD_ON_FILE",
      consentMode: "FORCED",
    });
  });

  it("sends tokenization null when the checkbox is off", () => {
    const request = formToSessionRequest(
      form({
        tokenizationEnabled: false,
        shopperReference: "shopper-42",
        recurringModel: "SUBSCRIPTION",
      }),
    );
    expect(request.tokenization).toBeNull();
  });

  it("maps preAuth only with MANUAL capture", () => {
    const ignored = formToSessionRequest(form({ preAuth: true, moto: false }));
    expect(ignored.preAuth).toBe(false);
    expect(ignored.capture).toEqual({ mode: "IMMEDIATE" });

    const preAuth = formToSessionRequest(
      form({ preAuth: true, moto: false, captureMode: "MANUAL" }),
    );
    expect(preAuth.preAuth).toBe(true);
    expect(preAuth.moto).toBe(false);
    expect(preAuth.capture).toEqual({ mode: "MANUAL" });
    expect(preAuth.tokenization).toBeNull();

    const moto = formToSessionRequest(form({ preAuth: false, moto: true }));
    expect(moto.preAuth).toBe(false);
    expect(moto.moto).toBe(true);
    expect(moto.tokenization).toBeNull();
  });

  it("omits empty shopperCountryCode", () => {
    const request = formToSessionRequest(form({ shopperCountryCode: "  " }));
    expect(request.shopperCountryCode).toBeUndefined();
  });

  it("omits locale from the public session payload", () => {
    const request = formToSessionRequest(form({ locale: "en-US" }));
    expect(request).not.toHaveProperty("locale");
    expect(request).not.toHaveProperty("shopperLocale");
  });

  it("omits lineItems by default", () => {
    const request = formToSessionRequest(form());
    expect(request.lineItems).toBeUndefined();
  });

  it("uses lineItems from options when provided", () => {
    const request = formToSessionRequest(
      form({ amount: "10", shopperCountryCode: "FR" }),
      {
        lineItems: [
          {
            id: "ROOM-1",
            description: "Massage 60 min",
            quantity: 1,
            amountIncludingTax: 10000,
          },
        ],
      },
    );
    expect(request.lineItems).toEqual([
      {
        id: "ROOM-1",
        description: "Massage 60 min",
        quantity: 1,
        amountIncludingTax: 10000,
      },
    ]);
    expect(request.shopperCountryCode).toBe("FR");
  });
});
