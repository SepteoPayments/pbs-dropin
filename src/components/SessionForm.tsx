import type { ChangeEvent } from "react";
import type { ConsentMode, RecurringModel, SessionFormValues } from "../types";
import type { PbsMessages } from "../i18n/messages";
import type { SessionFormErrors } from "../validation/validateSessionForm";
import { CaptureModeRadios } from "./CaptureModeRadios";
import { ConsentModeRadios } from "./ConsentModeRadios";
import { CountrySelect } from "./CountrySelect";
import { CurrencySelect } from "./CurrencySelect";
import { FieldLabel } from "./FieldLabel";
import { LanguageSelector } from "./LanguageSelector";
import { ProviderSelect } from "./ProviderSelect";
import { SessionFlagsCheckboxes } from "./SessionFlagsCheckboxes";

interface SessionFormProps {
  form: SessionFormValues;
  errors: SessionFormErrors;
  messages: PbsMessages;
  availableLocales: string[];
  showLanguageSelector: boolean;
  currencyOptions: string[];
  apiBaseUrlPropProvided: boolean;
  adyenClientKeyPropProvided: boolean;
  showIncludeLineItems: boolean;
  showConsentMode: boolean;
  disabled: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  onFieldChange: <K extends keyof SessionFormValues>(
    key: K,
    value: SessionFormValues[K],
  ) => void;
  onSubmit: () => void;
  onResetSession?: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="pbs-dropin__error">{message}</span>;
}

export function SessionForm({
  form,
  errors,
  messages,
  availableLocales,
  showLanguageSelector,
  currencyOptions,
  apiBaseUrlPropProvided,
  adyenClientKeyPropProvided,
  showIncludeLineItems,
  showConsentMode,
  disabled,
  canSubmit,
  isSubmitting,
  onFieldChange,
  onSubmit,
  onResetSession,
}: SessionFormProps) {
  const handleText =
    (key: keyof SessionFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFieldChange(key, event.target.value as SessionFormValues[typeof key]);
    };

  return (
    <form
      className="pbs-dropin__section"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="pbs-dropin__section-header">
        <h2 className="pbs-dropin__title">{messages.sessionTitle}</h2>
        {showLanguageSelector && (
          <LanguageSelector
            locale={form.locale}
            locales={availableLocales}
            label={messages.locale}
            disabled={disabled}
            onChange={(nextLocale) => onFieldChange("locale", nextLocale)}
          />
        )}
      </div>

      <div className="pbs-dropin__grid">
        <CaptureModeRadios
          value={form.captureMode}
          label={messages.captureMode}
          immediateLabel={messages.captureImmediate}
          delayedLabel={messages.captureDelayed}
          manualLabel={messages.captureManual}
          hint={messages.preAuthForcesManual}
          disabled={disabled}
          onChange={(mode) => onFieldChange("captureMode", mode)}
        />

        {form.captureMode === "DELAYED" && (
          <div
            className="pbs-dropin__field pbs-dropin__field--full"
            data-testid="pbs-delay-hours-field"
          >
            <FieldLabel htmlFor="pbs-delay-hours" required>
              {messages.delayHours}
            </FieldLabel>
            <input
              id="pbs-delay-hours"
              className="pbs-dropin__input"
              value={form.captureDelayHours}
              onChange={handleText("captureDelayHours")}
              inputMode="numeric"
              disabled={disabled}
              aria-required
            />
            <FieldError message={errors.captureDelayHours} />
          </div>
        )}

        <div
          className="pbs-dropin__row"
          data-testid="pbs-provider-reference-row"
        >
          <ProviderSelect
            value={form.provider}
            onChange={(value) => onFieldChange("provider", value)}
            label={messages.provider}
            disabled={disabled}
            required
            error={errors.provider}
          />

          <div className="pbs-dropin__field">
            <FieldLabel htmlFor="pbs-reference" required>
              {messages.reference}
            </FieldLabel>
            <input
              id="pbs-reference"
              className="pbs-dropin__input"
              value={form.reference}
              onChange={handleText("reference")}
              disabled={disabled}
              aria-required
            />
            <FieldError message={errors.reference} />
          </div>
        </div>

        <SessionFlagsCheckboxes
          preAuth={form.preAuth}
          moto={form.moto}
          tokenizationEnabled={form.tokenizationEnabled}
          includeLineItems={form.includeLineItems}
          preAuthLabel={messages.preAuth}
          motoLabel={messages.moto}
          tokenizationLabel={messages.tokenization}
          klarnaBnplLabel={messages.klarnaBnpl}
          showIncludeLineItems={showIncludeLineItems}
          disabled={disabled}
          onChange={(key, value) => onFieldChange(key, value)}
        />

        {form.tokenizationEnabled && (
          <>
            {showConsentMode && (
              <ConsentModeRadios
                value={form.consentMode}
                label={messages.consentMode}
                askLabel={messages.consentAsk}
                forcedLabel={messages.consentForced}
                disabled={disabled}
                onChange={(mode: ConsentMode) =>
                  onFieldChange("consentMode", mode)
                }
              />
            )}
            <div className="pbs-dropin__tokenization">
              <div className="pbs-dropin__field">
                <FieldLabel htmlFor="pbs-shopper-ref" required>
                  {messages.shopperReference}
                </FieldLabel>
                <input
                  id="pbs-shopper-ref"
                  className="pbs-dropin__input"
                  value={form.shopperReference}
                  onChange={handleText("shopperReference")}
                  disabled={disabled}
                  aria-required
                />
                <FieldError message={errors.shopperReference} />
              </div>
              <div className="pbs-dropin__field">
                <FieldLabel htmlFor="pbs-recurring-model" required>
                  {messages.recurringModel}
                </FieldLabel>
                <select
                  id="pbs-recurring-model"
                  className="pbs-dropin__select"
                  value={form.recurringModel}
                  onChange={(event) =>
                    onFieldChange(
                      "recurringModel",
                      event.target.value as RecurringModel,
                    )
                  }
                  disabled={disabled}
                  aria-required
                >
                  <option value="SUBSCRIPTION">
                    {messages.recurringSubscription}
                  </option>
                  <option value="CARD_ON_FILE">
                    {messages.recurringCardOnFile}
                  </option>
                  <option value="UNSCHEDULED">
                    {messages.recurringUnscheduled}
                  </option>
                </select>
                <FieldError message={errors.recurringModel} />
              </div>
            </div>
          </>
        )}

        <div className="pbs-dropin__row" data-testid="pbs-amount-currency-row">
          <div className="pbs-dropin__field">
            <FieldLabel htmlFor="pbs-amount" required>
              {messages.amount}
            </FieldLabel>
            <input
              id="pbs-amount"
              className="pbs-dropin__input"
              value={form.amount}
              onChange={handleText("amount")}
              inputMode="decimal"
              disabled={disabled}
              aria-required
            />
            <FieldError message={errors.amount} />
          </div>

          <CurrencySelect
            value={form.currency}
            options={currencyOptions}
            locale={form.locale}
            label={messages.currency}
            disabled={disabled}
            required
            error={errors.currency}
            onChange={(currency) => onFieldChange("currency", currency)}
          />
        </div>

        <CountrySelect
          value={form.shopperCountryCode}
          locale={form.locale}
          label={messages.shopperCountry}
          placeholder={messages.countrySearchPlaceholder}
          disabled={disabled}
          required
          error={errors.shopperCountryCode}
          onChange={(countryCode) =>
            onFieldChange("shopperCountryCode", countryCode)
          }
        />

        {!apiBaseUrlPropProvided && (
          <div className="pbs-dropin__field pbs-dropin__field--full">
            <label className="pbs-dropin__label" htmlFor="pbs-api-base-url">
              {messages.apiBaseUrl}
            </label>
            <input
              id="pbs-api-base-url"
              className="pbs-dropin__input"
              value={form.apiBaseUrl}
              onChange={handleText("apiBaseUrl")}
              disabled={disabled}
            />
            <FieldError message={errors.apiBaseUrl} />
          </div>
        )}

        {!adyenClientKeyPropProvided && (
          <div className="pbs-dropin__field pbs-dropin__field--full">
            <label className="pbs-dropin__label" htmlFor="pbs-adyen-client-key">
              {messages.adyenClientKey}
            </label>
            <input
              id="pbs-adyen-client-key"
              className="pbs-dropin__input"
              value={form.adyenClientKey}
              onChange={handleText("adyenClientKey")}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      <div className="pbs-dropin__actions">
        <button
          type="submit"
          className="pbs-dropin__button"
          data-testid="pbs-submit-session"
          disabled={!canSubmit || disabled}
        >
          {isSubmitting ? messages.creatingSession : messages.createSession}
        </button>
        {onResetSession && (
          <button
            type="button"
            className="pbs-dropin__button pbs-dropin__button--secondary"
            data-testid="pbs-reset-session"
            onClick={onResetSession}
          >
            {messages.newSession}
          </button>
        )}
      </div>
    </form>
  );
}
