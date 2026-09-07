export type PaymentProvider = 'adyen' | 'stripe'

export type CaptureMode = 'IMMEDIATE' | 'DELAYED' | 'MANUAL'

export type RecurringModel = 'SUBSCRIPTION' | 'CARD_ON_FILE' | 'UNSCHEDULED'

export type AdyenEnvironment = 'test' | 'live'
