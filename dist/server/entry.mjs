import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_-zymjRgf.mjs';
import { manifest } from './manifest_0zIqw5eq.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/admin/approve-order.astro.mjs');
const _page3 = () => import('./pages/api/admin/export.astro.mjs');
const _page4 = () => import('./pages/api/admin/login.astro.mjs');
const _page5 = () => import('./pages/api/admin/metrics.astro.mjs');
const _page6 = () => import('./pages/api/admin/order-details.astro.mjs');
const _page7 = () => import('./pages/api/admin/resend-email.astro.mjs');
const _page8 = () => import('./pages/api/checkout.astro.mjs');
const _page9 = () => import('./pages/api/simulate-payment.astro.mjs');
const _page10 = () => import('./pages/api/tickets/live-status.astro.mjs');
const _page11 = () => import('./pages/api/tickets/lookup.astro.mjs');
const _page12 = () => import('./pages/api/tickets/seat-lock.astro.mjs');
const _page13 = () => import('./pages/api/webhooks/mercadopago.astro.mjs');
const _page14 = () => import('./pages/checkout.astro.mjs');
const _page15 = () => import('./pages/confirmacion.astro.mjs');
const _page16 = () => import('./pages/mis-boletos.astro.mjs');
const _page17 = () => import('./pages/pago-pendiente.astro.mjs');
const _page18 = () => import('./pages/pago-rechazado.astro.mjs');
const _page19 = () => import('./pages/participar.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin/index.astro", _page1],
    ["src/pages/api/admin/approve-order.ts", _page2],
    ["src/pages/api/admin/export.ts", _page3],
    ["src/pages/api/admin/login.ts", _page4],
    ["src/pages/api/admin/metrics.ts", _page5],
    ["src/pages/api/admin/order-details.ts", _page6],
    ["src/pages/api/admin/resend-email.ts", _page7],
    ["src/pages/api/checkout.ts", _page8],
    ["src/pages/api/simulate-payment.ts", _page9],
    ["src/pages/api/tickets/live-status.ts", _page10],
    ["src/pages/api/tickets/lookup.ts", _page11],
    ["src/pages/api/tickets/seat-lock.ts", _page12],
    ["src/pages/api/webhooks/mercadopago.ts", _page13],
    ["src/pages/checkout.astro", _page14],
    ["src/pages/confirmacion.astro", _page15],
    ["src/pages/mis-boletos.astro", _page16],
    ["src/pages/pago-pendiente.astro", _page17],
    ["src/pages/pago-rechazado.astro", _page18],
    ["src/pages/participar.astro", _page19],
    ["src/pages/index.astro", _page20]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/dist/client/",
    "server": "file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/dist/server/",
    "host": true,
    "port": 3000,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
