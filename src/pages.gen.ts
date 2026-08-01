// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse, SearchCodecsForPages } from 'waku/router';

// prettier-ignore
import type { getConfig as File_DocsLangDocsIndex_getConfig } from './pages/(docs)/[lang]/docs/index';
// prettier-ignore
import type { getConfig as File_DocsLangExamplesIndex_getConfig } from './pages/(docs)/[lang]/examples/index';
// prettier-ignore
import type { getConfig as File_LegalLangLicensesIndex_getConfig } from './pages/(legal)/[lang]/licenses/index';
// prettier-ignore
import type { getConfig as File_LocaleLangIndex_getConfig } from './pages/(locale)/[lang]/index';
// prettier-ignore
import type { getConfig as File_RootIndex_getConfig } from './pages/(root)/index';

// prettier-ignore
type Page =
| ({ path: '/[lang]/docs' } & GetConfigResponse<typeof File_DocsLangDocsIndex_getConfig>)
| ({ path: '/[lang]/examples' } & GetConfigResponse<typeof File_DocsLangExamplesIndex_getConfig>)
| ({ path: '/[lang]/licenses' } & GetConfigResponse<typeof File_LegalLangLicensesIndex_getConfig>)
| ({ path: '/[lang]' } & GetConfigResponse<typeof File_LocaleLangIndex_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_RootIndex_getConfig>);

// prettier-ignore
type Layout =
| { path: '/[lang]/docs' }
| { path: '/[lang]/examples' }
| { path: '/[lang]/licenses' }
| { path: '/[lang]' }
| { path: '/' };

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
    layouts: Layout;
  }
  interface SearchCodecsConfig extends SearchCodecsForPages<Page> {}
}
