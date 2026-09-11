import type {
  CaptureMode,
  ConsentMode,
  PaymentProvider,
  RecurringModel,
} from "./enums";

export interface SessionFormValues {
  accessToken: string;
  apiBaseUrl: string;
  adyenClientKey: string;
  provider: PaymentProvider;
  publicStoreId: string;
  amount: string;
  currency: string;
  reference: string;
  returnUrl: string;
  shopperCountryCode: string;
  locale: string;
  captureMode: CaptureMode;
  captureDelayHours: string;
  preAuth: boolean;
  moto: boolean;
  tokenizationEnabled: boolean;
  shopperReference: string;
  recurringModel: RecurringModel;
  consentMode: ConsentMode;
}
