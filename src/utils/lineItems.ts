import type { CreateSessionLineItem, SessionFormValues } from '../types'
import { majorAmountToCents } from './amount'

export const DEFAULT_LINE_ITEM_ID = 'SKU-1'
export const DEFAULT_LINE_ITEM_DESCRIPTION =
	'Article de test (requis pour afficher Klarna/BNPL)'

export function hasProvidedLineItems(lineItems: CreateSessionLineItem[] | undefined): boolean {
	return Array.isArray(lineItems) && lineItems.length > 0
}

export function buildDefaultLineItems(amountIncludingTax: number): CreateSessionLineItem[] {
	return [
		{
			id: DEFAULT_LINE_ITEM_ID,
			description: DEFAULT_LINE_ITEM_DESCRIPTION,
			quantity: 1,
			amountIncludingTax,
		},
	]
}

export function resolveSessionLineItems(
	form: SessionFormValues,
	lineItemsFromProps?: CreateSessionLineItem[]
): CreateSessionLineItem[] | undefined {
	if (hasProvidedLineItems(lineItemsFromProps)) {
		return lineItemsFromProps
	}

	if (!form.includeLineItems) {
		return undefined
	}

	const amountValue = majorAmountToCents(form.amount)
	if (amountValue === null) {
		return undefined
	}

	return buildDefaultLineItems(amountValue)
}
