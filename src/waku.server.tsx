import { fsRouter } from 'waku';
import adapter from 'waku/adapters/cloudflare';

/**
 * The Cloudflare adapter is what turns the router into a Worker with a `fetch()` —
 * exporting the bare router leaves the runtime with nothing to call.
 */
export default adapter(fsRouter(import.meta.glob('./pages/**/*.{tsx,ts}')));
