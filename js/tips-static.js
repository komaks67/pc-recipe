/* ============================================================
   静的ページ（guide/・fps/・parts/）用：用語の説明を出す
   点線の下線の言葉（<span class="term" data-t="用語" data-d="説明">）を
   押す・カーソルを合わせると、説明が出る。
   ============================================================ */
(function () {
  const tip = document.createElement('div');
  tip.className = 'tip'; tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const show = el => {
    tip.innerHTML = '<b>' + esc(el.dataset.t) + '</b>' + esc(el.dataset.d);
    const r = el.getBoundingClientRect();
    tip.classList.add('show');
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    let y = r.bottom + 8; if (y + h > window.innerHeight - 8) y = r.top - h - 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  };
  const hide = () => tip.classList.remove('show');
  const term = e => e.target.closest && e.target.closest('.term[data-d]');
  document.addEventListener('mouseover', e => { const t = term(e); if (t) show(t); });
  document.addEventListener('mouseout', e => { if (term(e)) hide(); });
  document.addEventListener('focusin', e => { const t = term(e); if (t) show(t); });
  document.addEventListener('focusout', hide);
  document.addEventListener('click', e => { const t = term(e); if (t) { tip.classList.contains('show') ? hide() : show(t); } else hide(); });
  window.addEventListener('scroll', hide, { passive: true });
})();
