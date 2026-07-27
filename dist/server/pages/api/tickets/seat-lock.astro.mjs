import { t as toggleSeatLock } from '../../../chunks/tickets_DnGCFJIk.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const { number, sessionId } = await request.json();
    if (!number || !sessionId) {
      return new Response(
        JSON.stringify({ error: "Número y ID de sesión requeridos." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const res = await toggleSeatLock(String(number), String(sessionId));
    if (!res.success) {
      return new Response(
        JSON.stringify({ error: res.error }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify(res),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error en seat-lock API:", error);
    return new Response(
      JSON.stringify({ error: "Error procesando reserva de boleto." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
