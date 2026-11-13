/* アクセス解析（Google アナリティクス 4）
   config.js の gaMeasurementId が空のときは、何も読み込まず、何も送信しません。 */
(function () {
  const id = (window.PCR_CONFIG && window.PCR_CONFIG.gaMeasurementId || '').trim();
  window.PCR_TRACK = function () {};
  window.PCR_EVENT = function () {};
  if (!/^G-[A-Z0-9]+$/.test(id)) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });   // ページの切り替えは下の PCR_TRACK で送る

  /* 「#/build?b=...」のようなURLを「/pc-recipe/build」の形にして送る（構成の中身などの ? 以降は送らない） */
  function pagePath() {
    const h = (location.hash.replace(/^#/, '') || '/').split('?')[0];
    return location.pathname.replace(/\/$/, '') + (h === '/' ? '/' : h);
  }
  let last = '';
  window.PCR_TRACK = function () {
    const p = pagePath();
    if (p === last) return;
    last = p;
    gtag('event', 'page_view', { page_location: location.origin + p, page_path: p, page_title: document.title });
  };
  window.PCR_EVENT = function (name, params) { gtag('event', name, params || {}); };

  /* ショップ・メーカーへのリンクのクリック数（どの店へのリンクかだけを送ります） */
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a[rel~="sponsored"]');
    if (!a) return;
    let host = '';
    try { host = new URL(a.href).hostname; } catch (err) { /* 無視 */ }
    gtag('event', 'shop_link_click', { link_domain: host, link_text: (a.textContent || '').trim().slice(0, 40), page_path: pagePath() });
  }, true);
})();
