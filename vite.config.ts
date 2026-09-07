import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const externals = [
	'react',
	'react-dom',
	'react/jsx-runtime',
	'react/jsx-dev-runtime',
	'@adyen/adyen-web',
	'react-country-flag',
	'@sankyu/react-circle-flags',
]

function isExternal(id: string): boolean {
	return externals.some(pkg => id === pkg || id.startsWith(`${pkg}/`))
}

export default defineConfig(({ command }) => {
	if (command === 'serve') {
		return {
			plugins: [react()],
		}
	}

	return {
		plugins: [
			react(),
			{
				name: 'pbs-dropin-css-import',
				generateBundle(_options, bundle) {
					const chunk = bundle['index.js']
					if (chunk && chunk.type === 'chunk') {
						chunk.code = `import './pbs-dropin.css'\n${chunk.code}`
					}
				},
			},
		],
		build: {
			lib: {
				entry: 'src/index.ts',
				formats: ['es'],
				fileName: 'index',
				cssFileName: 'pbs-dropin',
			},
			rollupOptions: {
				external: isExternal,
			},
		},
	}
})
