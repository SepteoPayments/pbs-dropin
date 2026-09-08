import type { PbsDropinProps } from '../../src/types'

export const DROPIN_TEST_PROPS: PbsDropinProps = {
	accessToken: 'token',
	publicStoreId: 'store-1',
	returnUrl: 'https://exemple.fr/retour',
	apiBaseUrl: 'https://example.test',
	adyenClientKey: 'test_key',
}

export function dropinTestProps(overrides: Partial<PbsDropinProps> = {}): PbsDropinProps {
	return {
		...DROPIN_TEST_PROPS,
		...overrides,
	}
}
