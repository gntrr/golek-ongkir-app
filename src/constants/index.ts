export const API_BASE_URL = process.env.API_BASE_URL || '';
if (!API_BASE_URL) {
	// eslint-disable-next-line no-console
	console.warn('[Backend] Missing API_BASE_URL. Set it in .env (e.g., https://your-api.example.com)');
}
