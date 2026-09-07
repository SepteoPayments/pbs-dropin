import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PbsDropin } from '../src/index'

const rootElement = document.getElementById('root')
if (!rootElement) {
	throw new Error('Root element #root is missing')
}

createRoot(rootElement).render(
	<StrictMode>
		<main style={{ padding: '24px' }}>
			<h1>pbs-dropin playground</h1>
			<p>Collez un access_token Postman, renseignez publicStoreId, puis créez la session.</p>
			<PbsDropin />
		</main>
	</StrictMode>
)
