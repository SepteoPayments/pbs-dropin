import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PbsDropin } from '../src/index'

const rootElement = document.getElementById('root')
if (!rootElement) {
	throw new Error('Root element #root is missing')
}

function Playground() {
	const [accessToken, setAccessToken] = useState('')
	const [publicStoreId, setPublicStoreId] = useState('')
	const [returnUrl, setReturnUrl] = useState('https://exemple.fr/retour')

	return (
		<main style={{ padding: '24px' }}>
			<h1>pbs-dropin playground</h1>
			<p>Collez un access_token Postman, renseignez publicStoreId, puis créez la session.</p>
			<label>
				Jeton d’accès
				<textarea value={accessToken} onChange={event => setAccessToken(event.target.value)} />
			</label>
			<label>
				Identifiant de boutique
				<input value={publicStoreId} onChange={event => setPublicStoreId(event.target.value)} />
			</label>
			<label>
				URL de retour
				<input value={returnUrl} onChange={event => setReturnUrl(event.target.value)} />
			</label>
			<PbsDropin accessToken={accessToken} publicStoreId={publicStoreId} returnUrl={returnUrl} />
		</main>
	)
}

createRoot(rootElement).render(
	<StrictMode>
		<Playground />
	</StrictMode>
)
