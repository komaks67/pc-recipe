/* ============================================================
   PC Recipe 共通UI（ルーター・保存・リンク・用語ツールチップ）
   ============================================================ */
window.PCR_UI = (function () {
  const D = PCR_DATA, CFG = PCR_CONFIG, E = PCR_ENGINE;
  const U = {};

  U.$ = (s, el) => (el || document).querySelector(s);
  U.$$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  U.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');
  U.sgn = n => (n > 0 ? '+' : n < 0 ? '−' : '±') + '¥' + Math.abs(Math.round(n)).toLocaleString('ja-JP');

  /* ---------- 保存（ブラウザ内） ---------- */
  U.store = {
    get: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  const MAX_SAVED = 20;
  U.prefs = function () {
    return Object.assign({ res: 1440, games: ['valorant', 'apex', 'palworld', 'cyberpunk'], hours: 3, kwh: CFG.electricityYenPerKwh, stream: false }, U.store.get('pcr.prefs.v1', {}));
  };
  U.setPrefs = function (p) { U.store.set('pcr.prefs.v1', Object.assign(U.prefs(), p)); };
  U.getSaved = () => U.store.get('pcr.saved.v1', []);
  U.saveBuild = function (name, ids, mode) {
    const list = U.getSaved();
    if (list.length >= MAX_SAVED) return { ok: false, msg: '保存できるのは' + MAX_SAVED + '件までです。古いものを削除してください。' };
    const ev = E.evaluate(ids, {});
    list.unshift({ id: 's' + Date.now().toString(36), name: name, ids: ids, mode: mode || 'build', total: ev.total, date: new Date().toISOString() });
    U.store.set('pcr.saved.v1', list);
    return { ok: true };
  };
  U.updateSaved = function (list) { U.store.set('pcr.saved.v1', list); };
  U.getFav = () => U.store.get('pcr.fav.v1', []);
  U.isFav = (k, id) => U.getFav().some(f => f.k === k && f.id === id);
  U.toggleFav = function (k, id) {
    let f = U.getFav();
    if (U.isFav(k, id)) f = f.filter(x => !(x.k === k && x.id === id)); else f.push({ k: k, id: id });
    U.store.set('pcr.fav.v1', f);
    return U.isFav(k, id);
  };

  /* ---------- 構成 <-> URL ---------- */
  U.idsToQuery = function (ids) {
    return E.KEYS.map(k => k + '=' + encodeURIComponent(ids[k])).join('&');
  };
  U.queryToIds = function (q, base) {
    const ids = Object.assign({}, base);
    const packed = (q.get('b') || '').split('.');
    if (packed.length === E.KEYS.length) E.KEYS.forEach((k, i) => { if (D.by[k][packed[i]]) ids[k] = packed[i]; });
    E.KEYS.forEach(k => { const v = q.get(k); if (v && D.by[k][v]) ids[k] = v; });
    return ids;
  };
  U.defaultIds = () => E.complete({ cpu: 'r7-9800x3d', gpu: 'rtx5070ti', mem: 'd5-32', ssd: 'g4-2' }, { size: 'mid' });
  U.shortUrl = (path, ids) => location.href.split('#')[0] + '#' + path + '?b=' + E.KEYS.map(k => ids[k]).join('.');
  U.shareUrl = (path, ids) => location.href.split('#')[0] + '#' + path + '?' + U.idsToQuery(ids);

  U.copy = function (text) {
    const done = () => U.toast('コピーしました');
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, () => U.fallbackCopy(text, done)); }
    else U.fallbackCopy(text, done);
  };
  U.fallbackCopy = function (text, done) {
    const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { U.toast('コピーできませんでした'); } t.remove();
  };
  U.download = function (name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain;charset=utf-8' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  let toastT;
  U.toast = function (msg) {
    const t = U.$('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
  };

  /* ---------- 構成のテキスト出力 ---------- */
  /* パーツ写真（js/images.js にあるときだけ表示。無ければ空） */
  U.partImg = function (k, id, size) {
    const m = (window.PCR_IMAGES || {})[k]; const im = m && m[id];
    if (!im || !im.u) return '';
    const n = size || 48;
    return '<img class="pimg" src="' + U.esc(im.u) + '" alt="" width="' + n + '" height="' + n + '" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">';
  };
  U.hasImages = function () { const m = window.PCR_IMAGES || {}; return Object.keys(m).some(k => Object.keys(m[k] || {}).length); };

  U.buildText = function (ids, ctx, name) {
    const ev = E.evaluate(ids, ctx);
    const L = [];
    L.push('【' + (name || 'PC Recipe 見積もり') + '】');
    L.push('作成日: ' + new Date().toLocaleDateString('ja-JP'));
    L.push('');
    E.KEYS.forEach(k => { const p = ev.B[k]; L.push(E.LABEL[k].padEnd(10, '　') + ' ' + p.name + '  ' + (p.price ? U.yen(p.price) : '-')); });
    L.push('');
    L.push('合計（目安）: ' + U.yen(ev.total) + (CFG.priceIsPlaceholder ? '  ※価格は仮の目安' : ''));
    L.push('電源の推奨: ' + ev.power.rec + 'W以上（選択: ' + ev.B.psu.w + 'W）');
    L.push('');
    L.push('■ fpsの目安（' + ({ 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' }[ctx.res]) + '・計算モデルによる目安であり実測ではありません）');
    ev.fpsRows.forEach(r => L.push('  ' + r.game.name + ': 約' + Math.round(r.fps) + 'fps'));
    L.push('');
    const bad = ev.checks.filter(c => c.lv !== 'ok');
    if (bad.length) { L.push('■ 注意点'); bad.forEach(c => L.push('  ・[' + (c.lv === 'ng' ? '要修正' : '注意') + '] ' + c.title + ': ' + c.msg)); }
    L.push('');
    L.push('作成: ' + CFG.siteName + '  ' + location.href.split('#')[0]);
    return L.join('\n');
  };

  /* ---------- 買えるお店のリンク（アフィリエイト対応） ---------- */
  U.amazonUrl = function (q) {
    let u = 'https://www.amazon.co.jp/s?k=' + encodeURIComponent(q);
    if (CFG.affiliate.amazonTag) u += '&tag=' + encodeURIComponent(CFG.affiliate.amazonTag);
    return u;
  };
  U.rakutenUrl = function (q) {
    const base = 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(q) + '/';
    return CFG.affiliate.rakutenId ? 'https://hb.afl.rakuten.co.jp/ichiba/' + CFG.affiliate.rakutenId + '/?pc=' + encodeURIComponent(base) : base;
  };
  U.links = function (q) {
    if (!q) return '';
    return '<span class="pr">PR</span>' +
      '<a class="btn sm sub" target="_blank" rel="sponsored noopener" href="' + U.esc(U.amazonUrl(q)) + '">Amazonで探す</a> ' +
      '<a class="btn sm sub" target="_blank" rel="sponsored noopener" href="' + U.esc(U.rakutenUrl(q)) + '">楽天で探す</a>';
  };
  U.makerLink = k => CFG.affiliate.bto[k].url;
  /* 広告リンクの表示回数を数える 1×1 の画像（A8.net の決まりで、リンクと一緒に置く） */
  U.makerImp = k => { const u = (CFG.affiliate.bto[k] || {}).imp; return u ? '<img src="' + U.esc(u) + '" width="1" height="1" alt="" style="border:0;position:absolute">' : ''; };
  U.makerIsAd = k => !!(CFG.affiliate.bto[k] || {}).imp;
  /* 機種のページへ飛ぶ広告リンク。A8.net の「テキスト生成」で発行される形と同じ（a8mat ＋ a8ejpredirect）。
     deepMat があり、飛び先が広告主の決めた範囲（deepAllow）の中のときだけ作る。ほかは null */
  U.makerDeepLink = (k, url) => {
    const c = CFG.affiliate.bto[k] || {};
    if (!c.deepMat || !c.deepAllow || !url || url.indexOf(c.deepAllow) !== 0) return null;
    return 'https://px.a8.net/svt/ejp?a8mat=' + c.deepMat + '&a8ejpredirect=' + encodeURIComponent(url);
  };
  U.makerDeepImp = k => { const u = (CFG.affiliate.bto[k] || {}).deepImp; return u ? '<img src="' + U.esc(u) + '" width="1" height="1" alt="" style="border:0;position:absolute">' : ''; };

  /* ---------- 用語ホバー ---------- */
  let termMap = null, termRe = null;
  function prepTerms() {
    termMap = {};
    D.glossary.forEach(g => { termMap[g[0]] = g[1]; });
    termRe = new RegExp('(' + D.glossary.map(g => g[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
  }
  U.tipify = function (root) {
    if (!termMap) prepTerms();
    U.$$('.tipify', root).concat(root.classList && root.classList.contains('tipify') ? [root] : []).forEach(box => {
      const done = {};
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, {
        acceptNode: n => (n.parentElement && n.parentElement.closest('a,button,select,option,textarea,input,.term,script,style,h1,h2,.fps-row .nm')) ? NodeFilter.FILTER_REJECT : (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
      });
      const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(n => {
        const text = n.nodeValue; termRe.lastIndex = 0;
        let m, last = 0, frag = null;
        while ((m = termRe.exec(text))) {
          if (done[m[1]]) continue;
          done[m[1]] = 1;
          frag = frag || document.createDocumentFragment();
          frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const s = document.createElement('span'); s.className = 'term'; s.tabIndex = 0; s.dataset.t = m[1]; s.textContent = m[1];
          frag.appendChild(s); last = m.index + m[1].length;
        }
        if (frag) { frag.appendChild(document.createTextNode(text.slice(last))); n.parentNode.replaceChild(frag, n); }
      });
    });
  };
  function initTip() {
    prepTerms();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
    const show = el => {
      const t = el.dataset.t; if (!termMap[t]) return;
      tip.innerHTML = '<b>' + U.esc(t) + '</b>' + U.esc(termMap[t]);
      const r = el.getBoundingClientRect();
      tip.classList.add('show');
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
      let y = r.bottom + 8; if (y + h > window.innerHeight - 8) y = r.top - h - 8;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    };
    const hide = () => tip.classList.remove('show');
    document.addEventListener('mouseover', e => { const t = e.target.closest && e.target.closest('.term'); if (t) show(t); });
    document.addEventListener('mouseout', e => { if (e.target.closest && e.target.closest('.term')) hide(); });
    document.addEventListener('focusin', e => { const t = e.target.closest && e.target.closest('.term'); if (t) show(t); });
    document.addEventListener('focusout', hide);
    document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('.term'); if (t) { tip.classList.contains('show') ? hide() : show(t); } else hide(); });
    window.addEventListener('scroll', hide, { passive: true });
  }

  /* ---------- テーマ ---------- */
  function initTheme() {
    const saved = U.store.get('pcr.theme', null);
    const dark = saved ? saved === 'dark' : window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const b = U.$('#theme'); const sync = () => { b.textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾'; b.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'ライトモードにする' : 'ダークモードにする'); };
    sync();
    b.addEventListener('click', () => { const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = n; U.store.set('pcr.theme', n); sync(); });
  }

  /* ---------- ルーター ---------- */
  const routes = {};
  U.route = (path, title, fn, navKey) => { routes[path] = { title: title, fn: fn, nav: navKey || path }; };
  U.go = h => { location.hash = h; };
  function parse() {
    const h = location.hash.replace(/^#/, '') || '/';
    const i = h.indexOf('?');
    return { path: i < 0 ? h : h.slice(0, i), q: new URLSearchParams(i < 0 ? '' : h.slice(i + 1)) };
  }
  function render() {
    const { path, q } = parse();
    let key = path, r = routes[key];
    let main = U.$('#app');
    { const fresh = main.cloneNode(false); main.parentNode.replaceChild(fresh, main); main = fresh; }   // 前のページのイベントを残さないため、毎回あたらしい箱にする
    let arg = null;
    if (!r) { // /guide/xxx など
      const seg = path.split('/');
      key = '/' + seg[1]; arg = seg[2]; r = routes[key];
    }
    if (!r) { key = '/404'; r = routes['/404']; }
    document.title = (r.title ? r.title + ' | ' : '') + CFG.siteName;
    U.$$('.nav a').forEach(a => a.classList.toggle('on', a.dataset.k === r.nav));
    U.$('#nav').classList.remove('open');
    main.style.animation = 'none'; void main.offsetWidth; main.style.animation = '';
    main.innerHTML = '';
    try { r.fn(main, q, arg); } catch (e) { console.error(e); main.innerHTML = '<div class="card"><h2>表示でエラーが起きました</h2><p>ページを読み込み直してください。</p></div>'; }
    U.tipify(main);
    if (window.PCR_TRACK) window.PCR_TRACK();
    if (!U.keepScroll) window.scrollTo(0, 0);
    U.keepScroll = false;
  }

  U.start = function () {
    const nav = [['/', 'ホーム'], ['/wizard', '診断'], ['/bto', 'BTO'], ['/build', '自作'], ['/best', '最強構成'], ['/tools', 'ツール'], ['/guide', '読みもの'], ['/saved', '保存']];
    U.$('#nav').innerHTML = nav.map(n => '<a href="#' + n[0] + '" data-k="' + n[0] + '">' + n[1] + '</a>').join('');
    U.$('#sf').addEventListener('submit', e => { e.preventDefault(); const v = U.$('#sq').value.trim(); if (v) { U.go('#/search?q=' + encodeURIComponent(v)); U.$('#sq').blur(); } });
    U.$('#menu').addEventListener('click', () => U.$('#nav').classList.toggle('open'));
    if (CFG.priceIsPlaceholder) U.$('#ribbon').hidden = false;
    initTheme(); initTip();
    window.addEventListener('hashchange', render);
    render();
  };
  return U;
})();
