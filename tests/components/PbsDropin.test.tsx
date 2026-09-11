import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PbsDropin } from "../../src/components/PbsDropin";
import { dropinTestProps } from "../helpers/dropinProps";

vi.mock("@adyen/adyen-web/auto", () => {
  class DropinMock {
    mount = vi.fn().mockReturnThis();
    unmount = vi.fn();
  }
  return {
    AdyenCheckout: vi.fn().mockResolvedValue({}),
    Dropin: DropinMock,
  };
});

vi.mock("@adyen/adyen-web/styles/adyen.css", () => ({}));

describe("PbsDropin", () => {
  it("renders the session form fields with French labels", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.queryByLabelText(/jeton/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/identifiant de boutique/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/url de retour/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /créer la session/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("pbs-locale")).toBeInTheDocument();
    expect(screen.getByTestId("pbs-currency")).toHaveTextContent(/EUR/);
    expect(screen.getByTestId("pbs-country")).toHaveValue("");
    expect(screen.getByTestId("pbs-country")).toHaveAttribute(
      "placeholder",
      "Saisissez au moins 2 caractères pour rechercher un pays",
    );
    expect(screen.getByRole("radio", { name: /immédiat/i })).toBeChecked();
    expect(screen.queryByLabelText("Scénario")).not.toBeInTheDocument();
  });

  it("never shows access token, store id or return URL fields", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.queryByLabelText(/jeton/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/identifiant de boutique/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/url de retour/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("pbs-submit-session")).toBeEnabled();
  });

  it("disables submit when a required prop is empty", () => {
    render(<PbsDropin {...dropinTestProps({ accessToken: "  " })} />);
    expect(screen.getByTestId("pbs-submit-session")).toBeDisabled();
  });

  it("hides the language selector when a single locale is provided", () => {
    render(
      <PbsDropin
        {...dropinTestProps({ locale: "en-US", locales: ["en-US"] })}
      />,
    );
    expect(screen.queryByTestId("pbs-locale")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create session/i }),
    ).toBeInTheDocument();
  });

  it("keeps the language selector when several locales are available", () => {
    render(<PbsDropin {...dropinTestProps({ locale: "fr-FR" })} />);
    expect(screen.getByTestId("pbs-locale")).toBeInTheDocument();
  });

  it("switches form labels when the shopper picks another language", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    await user.click(screen.getByTestId("pbs-locale"));
    await user.click(screen.getByRole("option", { name: "English" }));
    expect(
      screen.getByRole("button", { name: /create session/i }),
    ).toBeInTheDocument();
  });

  it("filters the world country list after two typed characters", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    const countryInput = screen.getByTestId("pbs-country");
    await user.click(countryInput);
    await user.type(countryInput, "fr");
    const franceOption = await screen.findByRole("option", { name: /france/i });
    expect(franceOption).toBeInTheDocument();
    await user.click(franceOption);
    expect(countryInput).toHaveValue("France");
    await user.click(countryInput);
    await user.clear(countryInput);
    await user.type(countryInput, "br");
    expect(
      await screen.findByRole("option", { name: /brésil|brazil/i }),
    ).toBeInTheDocument();
  });

  it("does not list countries before two characters are typed", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    const countryInput = screen.getByTestId("pbs-country");
    await user.click(countryInput);
    await user.type(countryInput, "f");
    expect(
      screen.queryByRole("listbox", { name: /pays de l/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/saisissez au moins 2 caractères/i),
    ).not.toBeInTheDocument();
  });

  it("lets the user pick a capture mode", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.getByRole("radio", { name: /immédiat/i })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: /manuel/i }));
    expect(screen.getByRole("radio", { name: /manuel/i })).toBeChecked();
    expect(screen.queryByLabelText(/délai en heures/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /différé/i }));
    expect(screen.getByLabelText(/délai en heures/i)).toBeInTheDocument();
    expect(
      within(screen.getByTestId("pbs-provider-reference-row")).getByLabelText(
        /délai en heures/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows the pre-auth hint in a hover tooltip next to capture mode", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(document.querySelector(".pbs-dropin__hint")).toBeNull();
    const help = screen.getByTestId("pbs-capture-mode-help");
    expect(help).toHaveAccessibleName("Aide sur le mode de capture");
    expect(help).toHaveAccessibleDescription(
      /n’est documentée qu’avec la capture manuelle/i,
    );
  });

  it("lets the user enable pre-auth, moto and tokenization independently", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    expect(
      screen.getByRole("checkbox", { name: /pré-autorisation/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /moto/i })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /tokenisation/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("checkbox", { name: /klarna \/ bnpl/i }),
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("checkbox", { name: /pré-autorisation/i }),
    );
    await user.click(screen.getByRole("checkbox", { name: /moto/i }));
    expect(
      screen.getByRole("checkbox", { name: /pré-autorisation/i }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: /manuel/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /moto/i })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /tokenisation/i }),
    ).not.toBeChecked();
    await user.click(screen.getByRole("radio", { name: /immédiat/i }));
    expect(
      screen.getByRole("checkbox", { name: /pré-autorisation/i }),
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /immédiat/i })).toBeChecked();
  });

  it("shows a visible checkbox next to each session flag label", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.getByRole("group", { name: /options/i })).toBeInTheDocument();
    const labels = [/pré-autorisation/i, /paiement moto/i, /tokenisation/i];
    for (const name of labels) {
      const checkbox = screen.getByRole("checkbox", { name });
      expect(checkbox).toBeVisible();
      expect(checkbox).toHaveAttribute("type", "checkbox");
      expect(getComputedStyle(checkbox).opacity).not.toBe("0");
    }
    expect(
      screen.queryByRole("checkbox", { name: /klarna \/ bnpl/i }),
    ).not.toBeInTheDocument();
  });

  it("never shows a Klarna / BNPL checkbox, with or without lineItems", () => {
    const { rerender } = render(<PbsDropin {...dropinTestProps()} />);
    expect(
      screen.queryByRole("checkbox", { name: /klarna \/ bnpl/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("pbs-country")).toBeInTheDocument();
    rerender(
      <PbsDropin
        {...dropinTestProps({
          lineItems: [
            { description: "Massage", quantity: 1, amountIncludingTax: 1000 },
          ],
        })}
      />,
    );
    expect(
      screen.queryByRole("checkbox", { name: /klarna \/ bnpl/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /tokenisation/i }),
    ).toBeInTheDocument();
  });

  it("uses EUR only when no currencies prop is passed", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.getByTestId("pbs-currency")).toHaveTextContent(/EUR/);
    await user.click(screen.getByTestId("pbs-currency"));
    expect(screen.getByRole("option", { name: /EUR/ })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /GBP/ }),
    ).not.toBeInTheDocument();
  });

  it("uses the currencies prop as the select options", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps({ currencies: ["EUR", "GBP"] })} />);
    await user.click(screen.getByTestId("pbs-currency"));
    expect(screen.getByRole("option", { name: /GBP/ })).toBeInTheDocument();
  });

  it("hides API URL and Adyen client key when those props are provided", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.queryByLabelText(/url de l/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/clé client adyen/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/jeton/i)).not.toBeInTheDocument();
  });

  it("shows capture mode as three radios", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.getByRole("radio", { name: "Immédiat" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Différé" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Manuel" })).toBeInTheDocument();
  });

  it("shows shopper reference and recurring model when tokenization is enabled", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    expect(
      screen.queryByLabelText(/référence acheteur/i),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: /tokenisation/i }));
    expect(screen.getByLabelText(/référence acheteur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/modèle de récurrence/i)).toBeInTheDocument();
    expect(screen.getByTestId("pbs-consent-mode")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /demander le consentement/i }),
    ).toBeChecked();
    const consentMode = screen.getByTestId("pbs-consent-mode");
    const shopperReference = screen.getByLabelText(/référence acheteur/i);
    expect(
      consentMode.compareDocumentPosition(shopperReference) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(consentMode).toHaveClass("pbs-dropin__radios--two");
    await user.click(screen.getByRole("checkbox", { name: /tokenisation/i }));
    expect(
      screen.queryByLabelText(/référence acheteur/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/modèle de récurrence/i),
    ).not.toBeInTheDocument();
  });

  it("hides consent radios when consentMode is passed as a prop", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps({ consentMode: "FORCED" })} />);
    await user.click(screen.getByRole("checkbox", { name: /tokenisation/i }));
    expect(screen.getByLabelText(/référence acheteur/i)).toBeInTheDocument();
    expect(screen.queryByTestId("pbs-consent-mode")).not.toBeInTheDocument();
  });

  it("marks amount, currency, reference, provider and shopper country as required", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(
      document.querySelectorAll(".pbs-dropin__label--required").length,
    ).toBeGreaterThanOrEqual(5);
    expect(screen.getByLabelText(/prestataire/i)).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText(/^référence$/i)).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByLabelText(/montant/i)).toHaveAttribute(
      "aria-required",
      "true",
    );
    expect(screen.getByTestId("pbs-country")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("shows Stripe as unavailable when selected", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps()} />);
    await user.selectOptions(screen.getByLabelText("Prestataire"), "stripe");
    expect(screen.getByRole("status")).toHaveTextContent(
      /stripe n’est pas disponible/i,
    );
    expect(screen.getByTestId("pbs-submit-session")).toBeDisabled();
  });

  it("defaults to azur and hides the theme switcher", () => {
    render(<PbsDropin {...dropinTestProps()} />);
    expect(screen.getByTestId("pbs-dropin")).toHaveAttribute(
      "data-theme",
      "azur",
    );
    expect(screen.queryByTestId("pbs-themes")).not.toBeInTheDocument();
  });

  it("shows the four theme options when showThemeSwitcher is true", () => {
    render(<PbsDropin {...dropinTestProps({ showThemeSwitcher: true })} />);
    expect(screen.getByTestId("pbs-dropin")).toHaveAttribute(
      "data-theme",
      "azur",
    );
    expect(screen.getByTestId("pbs-themes")).toBeInTheDocument();
    expect(screen.getByTestId("pbs-theme-azur")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("pbs-theme-blanc")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("pbs-theme-bleu")).toBeInTheDocument();
    expect(screen.getByTestId("pbs-theme-ether")).toBeInTheDocument();
  });

  it("switches the data-theme when another theme is clicked", async () => {
    const user = userEvent.setup();
    render(<PbsDropin {...dropinTestProps({ showThemeSwitcher: true })} />);
    await user.click(screen.getByTestId("pbs-theme-ether"));
    expect(screen.getByTestId("pbs-dropin")).toHaveAttribute(
      "data-theme",
      "ether",
    );
    expect(screen.getByTestId("pbs-theme-ether")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("pbs-theme-blanc")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("hides the theme switcher when showThemeSwitcher is false", () => {
    render(<PbsDropin {...dropinTestProps({ showThemeSwitcher: false })} />);
    expect(screen.queryByTestId("pbs-themes")).not.toBeInTheDocument();
    expect(screen.getByTestId("pbs-dropin")).toHaveAttribute(
      "data-theme",
      "azur",
    );
  });

  it("starts on the requested defaultTheme", () => {
    render(
      <PbsDropin
        {...dropinTestProps({
          showThemeSwitcher: true,
          defaultTheme: "blanc",
        })}
      />,
    );
    expect(screen.getByTestId("pbs-dropin")).toHaveAttribute(
      "data-theme",
      "blanc",
    );
    expect(screen.getByTestId("pbs-theme-blanc")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
