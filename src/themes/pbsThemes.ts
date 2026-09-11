export type ThemeName = "blanc" | "bleu" | "azur" | "ether";

export interface ThemeVars {
  "--c-bg": string;
  "--c-surface": string;
  "--c-form-bg": string;
  "--c-surface2": string;
  "--c-seg-active": string;
  "--c-border": string;
  "--c-input-border": string;
  "--c-bfocus": string;
  "--c-text": string;
  "--c-muted": string;
  "--c-accent": string;
  "--c-atext": string;
  "--c-accent-pill": string;
  "--c-accent-pill-text": string;
  "--c-btn": string;
  "--c-btnhov": string;
  "--c-btn-glow": string;
  "--c-card-shadow": string;
  "--c-ibg": string;
  "--c-ring": string;
  "--c-blur": string;
  "--c-menu": string;
  "--c-input-shadow"?: string;
  "--c-accent-bar"?: string;
  "--c-accent-bar-h"?: string;
}

export interface ThemeDef {
  label: string;
  swatch: string;
  vars: ThemeVars;
}

const LIGHT_CARD_SHADOW =
  "0 1px 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.07)";

const LIGHT_INPUT_SHADOW =
  "inset 0 2px 4px rgba(0,0,0,0.09), inset 0 1px 2px rgba(0,0,0,0.06)";

const LIGHT_ACCENT_BAR_H = "4px";

const THEME_BLANC: ThemeDef = {
  label: "Blanc",
  swatch: "#6366f1",
  vars: {
    "--c-bg":
      "radial-gradient(ellipse at 50% 0%, #e6e6f0 0%, #ebebf3 40%, #eeeef6 100%)",
    "--c-surface": "linear-gradient(170deg, #ffffff 0%, #fafafd 100%)",
    "--c-form-bg": "#ffffff",
    "--c-surface2": "#e8e8f2",
    "--c-seg-active": "#ffffff",
    "--c-border": "#e2e2ec",
    "--c-input-border": "#dcdce8",
    "--c-bfocus": "#6366f1",
    "--c-text": "#18181b",
    "--c-muted": "#6b6b7a",
    "--c-accent": "#6366f1",
    "--c-atext": "#ffffff",
    "--c-accent-pill": "#eef2ff",
    "--c-accent-pill-text": "#4f46e5",
    "--c-btn": "#6366f1",
    "--c-btnhov": "#4f46e5",
    "--c-btn-glow": "rgba(99,102,241,0.32)",
    "--c-card-shadow": LIGHT_CARD_SHADOW,
    "--c-ibg": "#f7f7fc",
    "--c-ring": "rgba(99,102,241,0.18)",
    "--c-blur": "0px",
    "--c-menu": "#ffffff",
    "--c-input-shadow": LIGHT_INPUT_SHADOW,
    "--c-accent-bar":
      "linear-gradient(90deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%)",
    "--c-accent-bar-h": LIGHT_ACCENT_BAR_H,
  },
};

const THEME_BLEU: ThemeDef = {
  label: "Bleu",
  swatch: "#f97316",
  vars: {
    "--c-bg":
      "radial-gradient(ellipse at 50% 0%, #d8e8f8 0%, #deeef8 40%, #e4f0fa 100%)",
    "--c-surface": "linear-gradient(170deg, #ffffff 0%, #fafdff 100%)",
    "--c-form-bg": "#ffffff",
    "--c-surface2": "#e4f0fa",
    "--c-seg-active": "#ffffff",
    "--c-border": "#daeaf6",
    "--c-input-border": "#cce0f2",
    "--c-bfocus": "#f97316",
    "--c-text": "#18181b",
    "--c-muted": "#5a6e88",
    "--c-accent": "#f97316",
    "--c-atext": "#ffffff",
    "--c-accent-pill": "#fff4ec",
    "--c-accent-pill-text": "#c2410c",
    "--c-btn": "#6366f1",
    "--c-btnhov": "#4f46e5",
    "--c-btn-glow": "rgba(99,102,241,0.3)",
    "--c-card-shadow": LIGHT_CARD_SHADOW,
    "--c-ibg": "#f6fbff",
    "--c-ring": "rgba(249,115,22,0.22)",
    "--c-blur": "0px",
    "--c-menu": "#ffffff",
    "--c-input-shadow":
      "inset 0 2px 4px rgba(0,40,100,0.05), inset 0 1px 2px rgba(0,40,100,0.03)",
    "--c-accent-bar":
      "linear-gradient(90deg, #3b82f6 0%, #6366f1 40%, #f97316 100%)",
    "--c-accent-bar-h": LIGHT_ACCENT_BAR_H,
  },
};

const THEME_AZUR: ThemeDef = {
  label: "Azur",
  swatch: "#3b82f6",
  vars: {
    "--c-bg":
      "radial-gradient(ellipse at 50% 0%, #dceef8 0%, #e4f2fa 40%, #eaf5fc 100%)",
    "--c-surface": "linear-gradient(170deg, #ffffff 0%, #fdfeff 100%)",
    "--c-form-bg": "#ffffff",
    "--c-surface2": "#e4f0fa",
    "--c-seg-active": "#ffffff",
    "--c-border": "#daeaf6",
    "--c-input-border": "#cce0f2",
    "--c-bfocus": "#f97316",
    "--c-text": "#18181b",
    "--c-muted": "#5a6e88",
    "--c-accent": "#3b82f6",
    "--c-atext": "#ffffff",
    "--c-accent-pill": "#eff6ff",
    "--c-accent-pill-text": "#1d4ed8",
    "--c-btn": "#6366f1",
    "--c-btnhov": "#4f46e5",
    "--c-btn-glow": "rgba(99,102,241,0.3)",
    "--c-card-shadow": LIGHT_CARD_SHADOW,
    "--c-ibg": "#f6fbff",
    "--c-ring": "rgba(249,115,22,0.2)",
    "--c-blur": "0px",
    "--c-menu": "#ffffff",
    "--c-input-shadow":
      "inset 0 2px 4px rgba(0,40,100,0.05), inset 0 1px 2px rgba(0,40,100,0.03)",
    "--c-accent-bar":
      "linear-gradient(90deg, #3b82f6 0%, #6366f1 40%, #f97316 100%)",
    "--c-accent-bar-h": LIGHT_ACCENT_BAR_H,
  },
};

const THEME_ETHER: ThemeDef = {
  label: "Éther",
  swatch: "#a5b4fc",
  vars: {
    "--c-bg": "transparent",
    "--c-surface": "rgba(255,255,255,0.16)",
    "--c-form-bg": "rgba(255,255,255,0.14)",
    "--c-surface2": "rgba(15,18,28,0.05)",
    "--c-seg-active": "rgba(255,255,255,0.62)",
    "--c-border": "rgba(255,255,255,0.42)",
    "--c-input-border": "rgba(15,18,28,0.08)",
    "--c-bfocus": "#6366f1",
    "--c-text": "#18181b",
    "--c-muted": "#5c5c6e",
    "--c-accent": "#6366f1",
    "--c-atext": "#ffffff",
    "--c-accent-pill": "rgba(99,102,241,0.16)",
    "--c-accent-pill-text": "#4338ca",
    "--c-btn": "#6366f1",
    "--c-btnhov": "#4f46e5",
    "--c-btn-glow": "transparent",
    "--c-card-shadow": "none",
    "--c-ibg": "rgba(15,18,28,0.05)",
    "--c-ring": "rgba(99,102,241,0.18)",
    "--c-blur": "40px",
    "--c-menu": "rgba(255,255,255,0.55)",
    "--c-accent-bar":
      "linear-gradient(90deg, #6366f1 0%, #7c3aed 50%, #a855f7 100%)",
    "--c-accent-bar-h": LIGHT_ACCENT_BAR_H,
  },
};

export const PBS_THEMES: Record<ThemeName, ThemeDef> = {
  blanc: THEME_BLANC,
  bleu: THEME_BLEU,
  azur: THEME_AZUR,
  ether: THEME_ETHER,
};

export const PBS_THEME_NAMES: ThemeName[] = ["blanc", "bleu", "azur", "ether"];

export const DEFAULT_PBS_THEME: ThemeName = "azur";

export function isPbsThemeName(value: string): value is ThemeName {
  return value in PBS_THEMES;
}
