import type { CaptureMode, ConsentMode, RecurringModel } from './enums'

export interface CreateSessionAmount {
	value: number
	currency: string
}

export interface CreateSessionCapture {
	mode: CaptureMode
	delayHours?: number
}

export interface CreateSessionTokenization {
	shopperReference: string
	recurringModel: RecurringModel
	consentMode?: ConsentMode
}

export interface CreateSessionLineItem {
	id?: string
	description: string
	quantity: number
	amountIncludingTax: number
}

export interface CreateSessionRequest {
	amount: CreateSessionAmount
	reference: string
	publicStoreId: string
	returnUrl: string
	shopperCountryCode?: string
	capture: CreateSessionCapture
	tokenization: CreateSessionTokenization | null
	moto: boolean
	preAuth: boolean
	lineItems?: CreateSessionLineItem[]
}

export interface ClientSession {
	id: string
	sessionData: string
}

export interface CreateSessionResponse {
	sessionRequestId: string
	status: string
	sessionId: string
	publicSessionId: string
	clientSession: ClientSession | string
	expiresAt: string
}

export interface AdyenSessionConfig {
	id: string
	sessionData: string
}
