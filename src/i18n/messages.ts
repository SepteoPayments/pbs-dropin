import { uiLanguageFromLocale, type PbsUiLanguage } from "../constants/locales";

export interface PbsMessages {
  sessionEyebrow: string;
  sessionTitle: string;
  themeSwitcher: string;
  accessToken: string;
  apiBaseUrl: string;
  adyenClientKey: string;
  provider: string;
  locale: string;
  publicStoreId: string;
  amount: string;
  currency: string;
  reference: string;
  shopperCountry: string;
  countrySearchPlaceholder: string;
  returnUrl: string;
  captureMode: string;
  captureImmediate: string;
  captureDelayed: string;
  captureManual: string;
  delayHours: string;
  sessionOptions: string;
  preAuth: string;
  moto: string;
  tokenization: string;
  shopperReference: string;
  recurringModel: string;
  recurringSubscription: string;
  recurringCardOnFile: string;
  recurringUnscheduled: string;
  consentMode: string;
  consentAsk: string;
  consentForced: string;
  preAuthForcesManual: string;
  captureModeHelp: string;
  createSession: string;
  creatingSession: string;
  newSession: string;
  stripeUnavailable: string;
  paymentCompleted: (resultCode: string) => string;
  paymentFailed: (resultCode: string) => string;
  fixFormErrors: string;
  sessionCreationFailed: string;
  adyenClientKeyRequired: string;
  adyenMountFailed: string;
  accessTokenRequired: string;
  apiBaseUrlRequired: string;
  publicStoreIdRequired: string;
  amountRequired: string;
  amountInvalid: string;
  currencyRequired: string;
  providerRequired: string;
  referenceRequired: string;
  returnUrlRequired: string;
  delayHoursRequired: string;
  shopperReferenceRequired: string;
  recurringModelRequired: string;
  shopperCountryRequired: string;
}

const FR: PbsMessages = {
  sessionEyebrow: "Paiement",
  sessionTitle: "Formulaire de paiement",
  themeSwitcher: "Thème de couleur",
  accessToken: "Jeton d’accès",
  apiBaseUrl: "URL de l’API",
  adyenClientKey: "Clé client Adyen",
  provider: "Prestataire",
  locale: "Langue",
  publicStoreId: "Identifiant de boutique",
  amount: "Montant",
  currency: "Devise",
  reference: "Référence",
  shopperCountry: "Pays de l’acheteur",
  countrySearchPlaceholder:
    "Saisissez au moins 2 caractères pour rechercher un pays",
  returnUrl: "URL de retour",
  captureMode: "Mode de capture",
  captureImmediate: "Immédiat",
  captureDelayed: "Différé",
  captureManual: "Manuel",
  delayHours: "Délai en heures",
  sessionOptions: "Options",
  preAuth: "Pré-autorisation",
  moto: "Paiement MOTO",
  tokenization: "Tokenisation",
  shopperReference: "Référence acheteur",
  recurringModel: "Modèle de récurrence",
  recurringSubscription: "Abonnement",
  recurringCardOnFile: "Carte enregistrée",
  recurringUnscheduled: "Paiement non planifié",
  consentMode: "Consentement tokenisation",
  consentAsk: "Demander le consentement",
  consentForced: "Imposé",
  preAuthForcesManual:
    "La pré-autorisation n’est documentée qu’avec la capture manuelle. Cocher la pré-autorisation bascule la capture en Manuel ; Immédiat ou Différé décoche la pré-autorisation.",
  captureModeHelp: "Aide sur le mode de capture",
  createSession: "Créer la session",
  creatingSession: "Création de la session…",
  newSession: "Nouvelle session",
  stripeUnavailable:
    "Stripe n’est pas disponible dans cette version. Sélectionnez Adyen pour créer une session.",
  paymentCompleted: (resultCode) => `Paiement ${resultCode}`,
  paymentFailed: (resultCode) => `Paiement échoué: ${resultCode}`,
  fixFormErrors: "Veuillez corriger les erreurs du formulaire",
  sessionCreationFailed: "La création de session a échoué",
  adyenClientKeyRequired:
    "La clé client Adyen est requise pour monter le drop-in",
  adyenMountFailed: "Le drop-in Adyen n’a pas pu être monté",
  accessTokenRequired: "Le jeton d’accès est requis",
  apiBaseUrlRequired: "L’URL de l’API est requise (champ ou prop)",
  publicStoreIdRequired: "L’identifiant de boutique est requis",
  amountRequired: "Le montant est requis",
  amountInvalid: "Le montant doit être un nombre positif",
  currencyRequired: "La devise est requise",
  providerRequired: "Le prestataire est requis",
  referenceRequired: "La référence est requise",
  returnUrlRequired: "L’URL de retour est requise",
  delayHoursRequired:
    "Le délai en heures est requis lorsque le mode de capture est différé",
  shopperReferenceRequired:
    "La référence acheteur est requise lorsque la tokenisation est activée",
  recurringModelRequired:
    "Le modèle de récurrence est requis lorsque la tokenisation est activée",
  shopperCountryRequired: "Le pays de l’acheteur est requis",
};

const EN: PbsMessages = {
  sessionEyebrow: "Payment",
  sessionTitle: "Payment form",
  themeSwitcher: "Colour theme",
  accessToken: "Access token",
  apiBaseUrl: "API URL",
  adyenClientKey: "Adyen client key",
  provider: "Provider",
  locale: "Language",
  publicStoreId: "Store identifier",
  amount: "Amount",
  currency: "Currency",
  reference: "Reference",
  shopperCountry: "Shopper country",
  countrySearchPlaceholder:
    "Type at least 2 characters to search for a country",
  returnUrl: "Return URL",
  captureMode: "Capture mode",
  captureImmediate: "Immediate",
  captureDelayed: "Delayed",
  captureManual: "Manual",
  delayHours: "Delay in hours",
  sessionOptions: "Options",
  preAuth: "Pre-authorisation",
  moto: "MOTO payment",
  tokenization: "Tokenization",
  shopperReference: "Shopper reference",
  recurringModel: "Recurring model",
  recurringSubscription: "Subscription",
  recurringCardOnFile: "Card on file",
  recurringUnscheduled: "Unscheduled payment",
  consentMode: "Tokenization consent",
  consentAsk: "Ask for consent",
  consentForced: "Forced",
  preAuthForcesManual:
    "Pre-authorisation is only documented with manual capture. Ticking pre-authorisation switches capture to Manual; Immediate or Delayed clears pre-authorisation.",
  captureModeHelp: "Help about capture mode",
  createSession: "Create session",
  creatingSession: "Creating session…",
  newSession: "New session",
  stripeUnavailable:
    "Stripe is not available in this version. Select Adyen to create a session.",
  paymentCompleted: (resultCode) => `Payment ${resultCode}`,
  paymentFailed: (resultCode) => `Payment failed: ${resultCode}`,
  fixFormErrors: "Please fix the form errors",
  sessionCreationFailed: "Session creation failed",
  adyenClientKeyRequired: "Adyen client key is required to mount the drop-in",
  adyenMountFailed: "Adyen drop-in failed to mount",
  accessTokenRequired: "Access token is required",
  apiBaseUrlRequired: "API URL is required (field or prop)",
  publicStoreIdRequired: "Store identifier is required",
  amountRequired: "Amount is required",
  amountInvalid: "Amount must be a positive number",
  currencyRequired: "Currency is required",
  providerRequired: "Provider is required",
  referenceRequired: "Reference is required",
  returnUrlRequired: "Return URL is required",
  delayHoursRequired: "Delay in hours is required when capture mode is delayed",
  shopperReferenceRequired:
    "Shopper reference is required when tokenization is enabled",
  recurringModelRequired:
    "Recurring model is required when tokenization is enabled",
  shopperCountryRequired: "Shopper country is required",
};

const ES: PbsMessages = {
  sessionEyebrow: "Pago",
  sessionTitle: "Formulario de pago",
  themeSwitcher: "Tema de color",
  accessToken: "Token de acceso",
  apiBaseUrl: "URL de la API",
  adyenClientKey: "Clave de cliente Adyen",
  provider: "Proveedor",
  locale: "Idioma",
  publicStoreId: "Identificador de tienda",
  amount: "Importe",
  currency: "Divisa",
  reference: "Referencia",
  shopperCountry: "País del comprador",
  countrySearchPlaceholder: "Escriba al menos 2 caracteres para buscar un país",
  returnUrl: "URL de retorno",
  captureMode: "Modo de captura",
  captureImmediate: "Inmediato",
  captureDelayed: "Diferido",
  captureManual: "Manual",
  delayHours: "Plazo en horas",
  sessionOptions: "Opciones",
  preAuth: "Preautorización",
  moto: "Pago MOTO",
  tokenization: "Tokenización",
  shopperReference: "Referencia del comprador",
  recurringModel: "Modelo de recurrencia",
  recurringSubscription: "Suscripción",
  recurringCardOnFile: "Tarjeta registrada",
  recurringUnscheduled: "Pago no programado",
  consentMode: "Consentimiento de tokenización",
  consentAsk: "Pedir consentimiento",
  consentForced: "Impuesto",
  preAuthForcesManual:
    "La preautorización solo está documentada con captura manual. Marcar la preautorización pasa la captura a Manual; Inmediato o Diferido desmarca la preautorización.",
  captureModeHelp: "Ayuda sobre el modo de captura",
  createSession: "Crear la sesión",
  creatingSession: "Creando la sesión…",
  newSession: "Nueva sesión",
  stripeUnavailable:
    "Stripe no está disponible en esta versión. Seleccione Adyen para crear una sesión.",
  paymentCompleted: (resultCode) => `Pago ${resultCode}`,
  paymentFailed: (resultCode) => `Pago fallido: ${resultCode}`,
  fixFormErrors: "Corrija los errores del formulario",
  sessionCreationFailed: "La creación de la sesión ha fallado",
  adyenClientKeyRequired:
    "La clave de cliente de Adyen es necesaria para montar el drop-in",
  adyenMountFailed: "No se ha podido montar el drop-in de Adyen",
  accessTokenRequired: "El token de acceso es obligatorio",
  apiBaseUrlRequired: "La URL de la API es obligatoria (campo o prop)",
  publicStoreIdRequired: "El identificador de tienda es obligatorio",
  amountRequired: "El importe es obligatorio",
  amountInvalid: "El importe debe ser un número positivo",
  currencyRequired: "La divisa es obligatoria",
  providerRequired: "El proveedor es obligatorio",
  referenceRequired: "La referencia es obligatoria",
  returnUrlRequired: "La URL de retorno es obligatoria",
  delayHoursRequired:
    "El plazo en horas es obligatorio cuando el modo de captura es diferido",
  shopperReferenceRequired:
    "La referencia del comprador es obligatoria cuando la tokenización está activada",
  recurringModelRequired:
    "El modelo de recurrencia es obligatorio cuando la tokenización está activada",
  shopperCountryRequired: "El país del comprador es obligatorio",
};

const BY_LANGUAGE: Record<PbsUiLanguage, PbsMessages> = {
  fr: FR,
  en: EN,
  es: ES,
};

export function getPbsMessages(locale: string): PbsMessages {
  return BY_LANGUAGE[uiLanguageFromLocale(locale)];
}
