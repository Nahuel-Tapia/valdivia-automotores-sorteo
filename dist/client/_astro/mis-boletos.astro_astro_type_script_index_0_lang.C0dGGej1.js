import{f as p}from"./cart.BJdYqzkZ.js";function o(){const r=document.getElementById("lookup-form"),l=document.getElementById("lookup-query"),t=document.getElementById("btn-lookup"),d=document.getElementById("results-section"),a=document.getElementById("results-container");r?.addEventListener("submit",async i=>{i.preventDefault();const n=l?.value.trim();if(n){t&&(t.disabled=!0,t.textContent="Buscando...");try{const s=await(await fetch(`/api/tickets/lookup?query=${encodeURIComponent(n)}`)).json();if(!s.success){alert(s.error||"No se pudo realizar la búsqueda.");return}if(d?.classList.remove("hidden"),s.orders.length===0){a.innerHTML=`
            <div class="card p-8 text-center space-y-3">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 class="font-display text-lg font-700 text-navy">No se encontraron boletos</h3>
              <p class="text-xs text-navy/60 max-w-md mx-auto">
                No encontramos compras registradas con el DNI o Email <strong>"${n}"</strong>. Verificá los datos ingresados o realizá tu compra en la sección de participar.
              </p>
            </div>
          `;return}a.innerHTML=s.orders.map(e=>`
          <div class="card p-6 space-y-4 mb-4 border-l-4 ${e.status==="approved"?"border-l-emerald-500":"border-l-amber-500"}">
            <div class="flex items-center justify-between border-b border-navy/10 pb-3">
              <div>
                <span class="text-xs font-700 text-brand uppercase">Orden #${e.id}</span>
                <h3 class="font-display text-lg font-800 text-navy">${e.buyerName}</h3>
              </div>
              <span class="rounded-full px-3 py-1 text-xs font-800 ${e.status==="approved"?"bg-emerald-100 text-emerald-800":"bg-amber-100 text-amber-800"}">
                ${e.status==="approved"?"✅ COMPRA CONFIRMADA":"⏳ PAGO PENDIENTE"}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span class="text-navy/50 block font-600">DNI</span>
                <strong class="text-navy font-700">${e.buyerDni}</strong>
              </div>
              <div>
                <span class="text-navy/50 block font-600">Total Abonado</span>
                <strong class="text-brand font-800">${p(e.totalAmount)}</strong>
              </div>
              <div>
                <span class="text-navy/50 block font-600">Cantidad</span>
                <strong class="text-navy font-700">${e.ticketCount} boletos</strong>
              </div>
            </div>

            <div class="border-t border-navy/10 pt-3">
              <span class="text-xs font-700 uppercase tracking-wider text-navy/60 block mb-2">
                🎟️ Tus Números de la Suerte Asignados:
              </span>
              <div class="flex flex-wrap gap-2">
                ${e.tickets.length>0?e.tickets.map(c=>`
                      <span class="rounded-xl bg-navy text-gold px-3 py-1.5 font-display text-sm font-800 shadow-sm border border-navy/20">
                        #${c}
                      </span>
                    `).join(""):'<span class="text-xs text-navy/40">Los números serán asignados al confirmarse el pago.</span>'}
              </div>
            </div>
          </div>
        `).join("")}catch{alert("Error de conexión al consultar boletos.")}finally{t&&(t.disabled=!1,t.textContent="Buscar Mis Boletos")}}})}o();document.addEventListener("astro:page-load",o);
