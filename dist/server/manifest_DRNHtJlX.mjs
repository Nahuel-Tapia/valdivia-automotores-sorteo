import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_DaRN7h1c.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_CUrTcIQJ.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/","cacheDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/.astro/","outDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/dist/","srcDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/","publicDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/public/","buildClientDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/dist/client/","buildServerDir":"file:///C:/Users/Docente/Documents/valdivia-automotores-sorteo/dist/server/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B_jvIAoY.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/approve-order","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/approve-order\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"approve-order","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/approve-order.ts","pathname":"/api/admin/approve-order","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/export","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/export\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"export","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/export.ts","pathname":"/api/admin/export","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/login.ts","pathname":"/api/admin/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin/metrics","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/metrics\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"metrics","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin/metrics.ts","pathname":"/api/admin/metrics","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/checkout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/checkout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/checkout.ts","pathname":"/api/checkout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/simulate-payment","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/simulate-payment\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"simulate-payment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/simulate-payment.ts","pathname":"/api/simulate-payment","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/tickets/live-status","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/tickets\\/live-status\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"tickets","dynamic":false,"spread":false}],[{"content":"live-status","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/tickets/live-status.ts","pathname":"/api/tickets/live-status","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/tickets/seat-lock","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/tickets\\/seat-lock\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"tickets","dynamic":false,"spread":false}],[{"content":"seat-lock","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/tickets/seat-lock.ts","pathname":"/api/tickets/seat-lock","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/webhooks/mercadopago","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/webhooks\\/mercadopago\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"webhooks","dynamic":false,"spread":false}],[{"content":"mercadopago","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/webhooks/mercadopago.ts","pathname":"/api/webhooks/mercadopago","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B_jvIAoY.css"},{"type":"inline","content":".input[data-astro-cid-ojox7d5b]{margin-top:.25rem;height:2.75rem;width:100%;border-radius:.75rem;border-width:1px;border-color:#1f2a5226;padding-left:.75rem;padding-right:.75rem;--tw-text-opacity: 1;color:rgb(31 42 82 / var(--tw-text-opacity, 1));transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.input[data-astro-cid-ojox7d5b]:focus{--tw-border-opacity: 1;border-color:rgb(31 143 214 / var(--tw-border-opacity, 1));outline:2px solid transparent;outline-offset:2px;--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);--tw-ring-color: rgb(31 143 214 / .2) }\n"}],"routeData":{"route":"/checkout","isIndex":false,"type":"page","pattern":"^\\/checkout\\/?$","segments":[[{"content":"checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/checkout.astro","pathname":"/checkout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B_jvIAoY.css"}],"routeData":{"route":"/confirmacion","isIndex":false,"type":"page","pattern":"^\\/confirmacion\\/?$","segments":[[{"content":"confirmacion","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/confirmacion.astro","pathname":"/confirmacion","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B_jvIAoY.css"}],"routeData":{"route":"/participar","isIndex":false,"type":"page","pattern":"^\\/participar\\/?$","segments":[[{"content":"participar","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/participar.astro","pathname":"/participar","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.B_jvIAoY.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/checkout.astro",{"propagation":"none","containsHead":true}],["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/confirmacion.astro",{"propagation":"none","containsHead":true}],["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/participar.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin/approve-order@_@ts":"pages/api/admin/approve-order.astro.mjs","\u0000@astro-page:src/pages/api/admin/export@_@ts":"pages/api/admin/export.astro.mjs","\u0000@astro-page:src/pages/api/admin/login@_@ts":"pages/api/admin/login.astro.mjs","\u0000@astro-page:src/pages/api/admin/metrics@_@ts":"pages/api/admin/metrics.astro.mjs","\u0000@astro-page:src/pages/api/checkout@_@ts":"pages/api/checkout.astro.mjs","\u0000@astro-page:src/pages/api/simulate-payment@_@ts":"pages/api/simulate-payment.astro.mjs","\u0000@astro-page:src/pages/api/tickets/live-status@_@ts":"pages/api/tickets/live-status.astro.mjs","\u0000@astro-page:src/pages/api/tickets/seat-lock@_@ts":"pages/api/tickets/seat-lock.astro.mjs","\u0000@astro-page:src/pages/api/webhooks/mercadopago@_@ts":"pages/api/webhooks/mercadopago.astro.mjs","\u0000@astro-page:src/pages/checkout@_@astro":"pages/checkout.astro.mjs","\u0000@astro-page:src/pages/confirmacion@_@astro":"pages/confirmacion.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/participar@_@astro":"pages/participar.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DRNHtJlX.mjs","C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_AQLDxQs5.mjs","C:/Users/Docente/Documents/valdivia-automotores-sorteo/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/components/Countdown.astro?astro&type=script&index=0&lang.ts":"_astro/Countdown.astro_astro_type_script_index_0_lang.D7bcbT57.js","C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BimSqMz4.js","C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/checkout.astro?astro&type=script&index=0&lang.ts":"_astro/checkout.astro_astro_type_script_index_0_lang.DTxvVOVZ.js","C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/confirmacion.astro?astro&type=script&index=0&lang.ts":"_astro/confirmacion.astro_astro_type_script_index_0_lang.D78-mIah.js","C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/pages/participar.astro?astro&type=script&index=0&lang.ts":"_astro/participar.astro_astro_type_script_index_0_lang.oBxOudt9.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/Docente/Documents/valdivia-automotores-sorteo/src/components/Countdown.astro?astro&type=script&index=0&lang.ts","function c(){document.querySelectorAll(\"[data-countdown]\").forEach(e=>{const d=new Date(e.dataset.target??\"\").getTime(),t={days:e.querySelector('[data-unit=\"days\"]'),hours:e.querySelector('[data-unit=\"hours\"]'),minutes:e.querySelector('[data-unit=\"minutes\"]'),seconds:e.querySelector('[data-unit=\"seconds\"]')},n=s=>String(Math.max(0,s)).padStart(2,\"0\"),a=()=>{const s=d-Date.now(),o=Math.max(0,Math.floor(s/1e3)),r=Math.floor(o/86400),u=Math.floor(o%86400/3600),i=Math.floor(o%3600/60),l=o%60;t.days&&(t.days.textContent=n(r)),t.hours&&(t.hours.textContent=n(u)),t.minutes&&(t.minutes.textContent=n(i)),t.seconds&&(t.seconds.textContent=n(l))};a(),setInterval(a,1e3)})}c();document.addEventListener(\"astro:page-load\",c);"]],"assets":["/_astro/logo-valdivia.DgiURDTx.png","/_astro/premio-sedan.CDwA57JQ.png","/_astro/premio-interior.DzVbYO3K.png","/_astro/index.B_jvIAoY.css","/apple-icon.png","/icon-dark-32x32.png","/icon-light-32x32.png","/icon.svg","/logo-valdivia.png","/placeholder-logo.png","/placeholder-logo.svg","/placeholder-user.jpg","/placeholder.jpg","/placeholder.svg","/premio-interior.png","/premio-sedan.png","/_astro/cart.BJdYqzkZ.js","/_astro/checkout.astro_astro_type_script_index_0_lang.DTxvVOVZ.js","/_astro/confirmacion.astro_astro_type_script_index_0_lang.D78-mIah.js","/_astro/index.astro_astro_type_script_index_0_lang.BimSqMz4.js","/_astro/participar.astro_astro_type_script_index_0_lang.oBxOudt9.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"XraJCdHz7XCPfUp8ZxKXxqoJukz/uwdC94kNvIquDuc=","sessionConfig":{"driver":"fs-lite","options":{"base":"C:\\Users\\Docente\\Documents\\valdivia-automotores-sorteo\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
