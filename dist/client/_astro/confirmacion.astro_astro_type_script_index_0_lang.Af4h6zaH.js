import{r as s,c}from"./cart.BaWbBNev.js";function l(){const e=s(),t=new URLSearchParams(window.location.search),r=t.get("external_reference")||t.get("orderId")||e?.orderId;if(!r){document.getElementById("confirmation-content")?.classList.add("hidden"),document.getElementById("no-order")?.classList.remove("hidden");return}const n=document.getElementById("order-id-title"),d=document.getElementById("buyer-name"),o=document.getElementById("buyer-email"),i=document.getElementById("tickets-grid");n&&(n.textContent=`Orden #${r}`),e?.buyer&&(d&&(d.textContent=e.buyer.name),o&&(o.textContent=e.buyer.email)),e?.ticketsList&&Array.isArray(e.ticketsList)&&i&&(i.innerHTML=e.ticketsList.map(a=>`
        <span class="rounded-xl bg-navy text-gold px-3 py-1.5 font-display text-sm font-800 shadow-sm border border-navy/20">
          #${a}
        </span>
      `).join("")),c()}l();
