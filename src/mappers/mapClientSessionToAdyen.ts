import type { AdyenSessionConfig, CreateSessionResponse } from '../types'
import { parseClientSession } from './parseClientSession'

export function mapClientSessionToAdyen(response: CreateSessionResponse): AdyenSessionConfig {
	return parseClientSession(response.clientSession)
}
