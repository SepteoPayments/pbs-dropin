import type { CreateSessionLineItem } from "../types";

export function hasProvidedLineItems(
  lineItems: CreateSessionLineItem[] | undefined,
): boolean {
  return Array.isArray(lineItems) && lineItems.length > 0;
}

export function resolveSessionLineItems(
  lineItemsFromProps?: CreateSessionLineItem[],
): CreateSessionLineItem[] | undefined {
  if (hasProvidedLineItems(lineItemsFromProps)) {
    return lineItemsFromProps;
  }

  return undefined;
}
