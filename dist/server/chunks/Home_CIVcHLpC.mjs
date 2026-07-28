import { c as createComponent, r as renderComponent, m as maybeRenderHead, a as renderTemplate, b as createAstro } from './astro/server_DaRN7h1c.mjs';
import 'piccolore';
import { $ as $$ } from './Layout_LZPCddmC.mjs';

const $$Astro = createAstro();
const $$Home = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Home;
  return renderTemplate`${renderComponent($$result, "Layout", $$, { "iconName": "house", ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path> <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path> ` })}`;
}, "C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/lucide-astro/dist/Home.astro", void 0);

export { $$Home as $ };
