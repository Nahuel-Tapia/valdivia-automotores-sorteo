import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$ } from './Layout_LZPCddmC.mjs';

const $$Astro = createAstro();
const $$Search = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Search;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "search", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<circle cx="11" cy="11" r="8"></circle> <path d="m21 21-4.3-4.3"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Search.astro", void 0);

export { $$Search as $ };
