export function isProvidedProp(value: string | undefined): boolean {
	return Boolean(value?.trim())
}

export function resolveHybridValue(fieldValue: string, propValue: string | undefined): string {
	const trimmedField = fieldValue.trim()
	if (trimmedField.length > 0) {
		return trimmedField
	}
	return propValue?.trim() ?? ''
}
