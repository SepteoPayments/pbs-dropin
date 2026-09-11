import type {
  CreateSessionLineItem,
  CreateSessionRequest,
  SessionFormValues,
} from "../types";
import { majorAmountToCents } from "../utils/amount";
import { resolveSessionLineItems } from "../utils/lineItems";

export interface FormToSessionRequestOptions {
  lineItems?: CreateSessionLineItem[];
}

export function formToSessionRequest(
  form: SessionFormValues,
  options?: FormToSessionRequestOptions,
): CreateSessionRequest {
  const amountValue = majorAmountToCents(form.amount);
  if (amountValue === null) {
    throw new Error("Invalid amount");
  }

  const capture: CreateSessionRequest["capture"] = { mode: form.captureMode };
  if (form.captureMode === "DELAYED") {
    capture.delayHours = Number.parseInt(form.captureDelayHours, 10);
  }

  const tokenization = form.tokenizationEnabled
    ? {
        shopperReference: form.shopperReference.trim(),
        recurringModel: form.recurringModel,
        consentMode: form.consentMode,
      }
    : null;

  const request: CreateSessionRequest = {
    amount: {
      value: amountValue,
      currency: form.currency.trim().toUpperCase(),
    },
    reference: form.reference.trim(),
    publicStoreId: form.publicStoreId.trim(),
    returnUrl: form.returnUrl.trim(),
    capture,
    tokenization,
    moto: form.moto,
    preAuth: form.preAuth && form.captureMode === "MANUAL",
  };

  const country = form.shopperCountryCode.trim().toUpperCase();
  if (country.length > 0) {
    request.shopperCountryCode = country;
  }

  const lineItems = resolveSessionLineItems(options?.lineItems);
  if (lineItems) {
    request.lineItems = lineItems;
  }

  return request;
}
