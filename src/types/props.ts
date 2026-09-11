import type { ThemeName } from "../themes/pbsThemes";
import type { CreateSessionLineItem, CreateSessionResponse } from "./session";
import type { AdyenEnvironment, ConsentMode } from "./enums";

export interface PbsDropinCallbacks {
  onSessionCreated?: (session: CreateSessionResponse) => void;
  onPaymentCompleted?: (result: { resultCode: string }) => void;
  onError?: (error: Error) => void;
}

export interface PbsDropinProps extends PbsDropinCallbacks {
  /** Bearer used to create the public session. The drop-in never shows this field. */
  accessToken: string;
  /** Public store id sent in the session body. The drop-in never shows this field. */
  publicStoreId: string;
  /** Return URL sent in the session body. The drop-in never shows this field. */
  returnUrl: string;
  /** If provided, the API base URL field is hidden and this value is used. */
  apiBaseUrl?: string;
  /** If provided, the Adyen client-key field is hidden and this value is used. */
  adyenClientKey?: string;
  adyenEnvironment?: AdyenEnvironment;
  /**
   * Languages offered in the compact selector (BCP 47, e.g. fr-FR).
   * One language hides the selector and freezes the drop-in.
   */
  locales?: string[];
  /**
   * Language at launch (form + Adyen `locale`). Defaults to fr-FR when present in `locales`.
   */
  locale?: string;
  /**
   * Currencies offered in the select. Empty / omitted → EUR only.
   */
  currencies?: string[];
  /** Optional Adyen Web `translations` overrides for the Drop-in UI. */
  adyenTranslations?: {
    [locale: string]: {
      [translationKey: string]: string;
    };
  };
  /**
   * Basket lines sent on session create. Adyen only returns Klarna / BNPL when
   * `lineItems` and `shopperCountryCode` are present. A PMS should pass the real
   * basket; the drop-in never shows a Klarna checkbox.
   */
  lineItems?: CreateSessionLineItem[];
  /**
   * Tokenization consent sent on session create (`ASK_FOR_CONSENT` | `FORCED`).
   * When omitted, the test form chooses; `ASK_FOR_CONSENT` shows a checkbox in the Drop-in.
   */
  consentMode?: ConsentMode;
  /** Temporary theme switcher for team review. Defaults to false (Azur only). */
  showThemeSwitcher?: boolean;
  /** Theme applied on first render. Defaults to azur. */
  defaultTheme?: ThemeName;
}
