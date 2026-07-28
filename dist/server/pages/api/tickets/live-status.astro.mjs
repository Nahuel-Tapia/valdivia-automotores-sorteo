import { g as getLiveTicketStatuses } from '../../../chunks/tickets_B79piL2P.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId") || void 0;
    const statuses = await getLiveTicketStatuses(sessionId);
    return new Response(
      JSON.stringify({ success: true, statuses }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en live-status API:", error);
    return new Response(
      JSON.stringify({ error: "Error obteniendo estados en vivo." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
