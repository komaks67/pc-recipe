/* ============================================================
   第3弾: サイト内検索 / 価格の推移グラフ
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE;
  const $ = U.$, esc = U.esc, yen = U.yen;
  const strip = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const norm = t => String(t || '').toLowerCase().replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/　/g, ' ');

  /* ---------- 検索のもと ---------- */
  const PAGES = [
    ['/wizard', '診断ウィザード', '用途と予算でおすすめ構成を診断'], ['/best', '予算で最強構成', '予算内で性能が高い構成を探す'],
    ['/bto', 'BTOパソコン選び', 'BTOメーカーの比較・購入の目安'], ['/build', '自作PCビルダー', 'パーツを選んで互換性チェック'],
    ['/server', 'サーバー用PC診断', 'ARK・マイクラ・パルワールドなどのサーバー向けPC'], ['/mypc', '今のPCから診断', 'PCのパーツを読み取って買い替え候補と互換性を表示'], ['/upgrade', 'アップグレード診断', '今のPCのどこを替えるとよいか'], ['/games', 'ゲーム別fps', 'GPUごとのfpsの目安'],
    ['/compare', 'BTOモデル比較', 'BTOと自作の値段を比べる'], ['/buy', '購入ガイド', 'セール時期とチェックリスト'],
    ['/history', '価格の推移', 'パーツ価格のグラフ'], ['/guide', '読みもの・用語集', '初心者向けの記事'], ['/saved', '保存した構成', '保存・お気に入り・比較'], ['/about', 'このサイトについて', '免責・広告について']
  ];
  const CATS = [['cpu', 'CPU'], ['gpu', 'グラフィックボード'], ['mb', 'マザーボード'], ['mem', 'メモリ'], ['ssd', 'ストレージ'], ['psu', '電源'], ['case', 'ケース'], ['cooler', 'CPUクーラー']];
  let INDEX = null;
  function index() {
    if (INDEX) return INDEX;
    INDEX = [];
    PAGES.forEach(p => INDEX.push({ t: 'ページ', title: p[1], text: p[2], href: '#' + p[0], w: 3 }));
    D.articles.forEach(a => INDEX.push({ t: '読みもの', title: a.title, text: a.lead + ' ' + strip(a.html), href: '#/guide/' + a.id, w: 2 }));
    D.glossary.forEach(g => INDEX.push({ t: '用語', title: g[0], text: g[1], href: '#/guide/glossary', w: 2 }));
    CATS.forEach(c => D[c[0]].forEach(p => INDEX.push({ t: c[1], title: p.name, text: '', href: '#/history?k=' + c[0] + '&id=' + p.id, w: 1 })));
    INDEX.forEach(x => { x.nt = norm(x.title); x.nb = norm(x.text); });
    return INDEX;
  }
  function search(q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return index().map(x => {
      let s = 0;
      for (const w of words) {
        if (x.nt === w) s += 12; else if (x.nt.indexOf(w) >= 0) s += 8; else if (x.nb.indexOf(w) >= 0) s += 2; else return null;
      }
      return { x: x, s: s * x.w };
    }).filter(Boolean).sort((a, b) => b.s - a.s).map(r => r.x);
  }
  function snippet(x, q) {
    const w = norm(q).split(/\s+/)[0]; const i = x.nb.indexOf(w);
    if (!x.nb) return '';
    const from = Math.max(0, i - 20), t = x.text.replace(/\s+/g, ' ').slice(from, from + 90);
    return (from > 0 ? '…' : '') + t + '…';
  }

  U.route('/search', 'サイト内検索', function (el, q) {
    const term = q.get('q') || '';
    el.innerHTML = '<h1>サイト内検索</h1><form class="card row" id="sf2" role="search"><input type="search" id="sq2" placeholder="例: 電源 / DDR5 / RTX 5070" style="flex:1;min-width:180px"><button class="btn" type="submit">検索</button></form><div id="sr" class="sp"></div>';
    $('#sq2', el).value = term;
    $('#sf2', el).onsubmit = e => { e.preventDefault(); U.go('#/search?q=' + encodeURIComponent($('#sq2', el).value)); };
    const sr = $('#sr', el);
    if (!term.trim()) { sr.innerHTML = '<p class="muted">パーツ名・読みもの・用語・ページ名から探せます。</p>'; return; }
    const res = search(term);
    if (!res.length) { sr.innerHTML = '<div class="card"><p>「' + esc(term) + '」に合うものが見つかりませんでした。別の言葉で試してみてください。</p></div>'; return; }
    const shown = res.slice(0, 40);
    sr.innerHTML = '<p class="muted">' + res.length + '件' + (res.length > shown.length ? '（上位' + shown.length + '件を表示）' : '') + '</p><div class="grid">' +
      shown.map(x => '<a class="card card-link" href="' + esc(x.href) + '"><span class="badge ok">' + esc(x.t) + '</span> <b>' + esc(x.title) + '</b>' + (x.nb ? '<div class="muted sp">' + esc(snippet(x, term)) + '</div>' : '') + '</a>').join('') + '</div>';
  }, '');

  /* ---------- 価格の推移 ---------- */
  function chart(points) {
    const W = 640, H = 260, L = 64, R = 16, T = 16, B = 40;
    const vals = points.map(p => p[1]), min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    const lo = Math.floor((min - (max - min) * 0.1 - 1) / 1000) * 1000, hi = Math.ceil((max + (max - min) * 0.1 + 1) / 1000) * 1000;
    const t = d => new Date(d).getTime(), t0 = t(points[0][0]), t1 = t(points[points.length - 1][0]);
    const X = d => L + (t1 === t0 ? 0.5 : (t(d) - t0) / (t1 - t0)) * (W - L - R), Y = v => T + (1 - (v - lo) / (hi - lo || 1)) * (H - T - B);
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="価格の推移グラフ" style="width:100%;height:auto">';
    for (let i = 0; i <= 4; i++) {
      const v = lo + (hi - lo) * i / 4, y = Y(v);
      s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)"/><text x="' + (L - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + Math.round(v / 1000) + 'k</text>';
    }
    const path = points.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(' ');
    s += '<path d="' + path + '" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>';
    points.forEach(p => { s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="4" fill="var(--accent)"><title>' + esc(p[0]) + ' ' + yen(p[1]) + '</title></circle>'; });
    s += '<text x="' + L + '" y="' + (H - 12) + '" font-size="12" fill="var(--muted)">' + esc(points[0][0]) + '</text><text x="' + (W - R) + '" y="' + (H - 12) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + esc(points[points.length - 1][0]) + '</text></svg>';
    return s;
  }

  U.route('/history', '価格の推移', function (el, q) {
    const H = window.PCR_HISTORY || {};
    let k = CATS.some(c => c[0] === q.get('k')) ? q.get('k') : 'gpu';
    el.innerHTML = '<h1>価格の推移</h1><p class="muted tipify">パーツごとの価格の変化を見られます。<b>買い時の目安</b>は、記録した期間の中で今が安いか高いかを示すだけで、これからの値動きを予想するものではありません。</p>' +
      '<div class="card"><div class="grid g2"><div><label class="f">種類</label><select id="hk">' + CATS.map(c => '<option value="' + c[0] + '">' + c[1] + '</option>').join('') + '</select></div><div><label class="f">パーツ</label><select id="hi"></select></div></div></div><div id="hout" class="sp"></div>';
    const hk = $('#hk', el), hi = $('#hi', el);
    hk.value = k;
    function fill() { hi.innerHTML = D[hk.value].map(p => '<option value="' + p.id + '">' + esc(p.name) + (((H[hk.value] || {})[p.id] || []).length > 1 ? ' ●' : '') + '</option>').join(''); }
    fill(); if (D.by[k][q.get('id')]) hi.value = q.get('id'); else { const first = D[k].filter(p => p.price > 0)[0]; if (first) hi.value = first.id; }
    function draw() {
      const part = D.by[hk.value][hi.value], pts = ((H[hk.value] || {})[hi.value] || []).slice().sort((a, b) => a[0] < b[0] ? -1 : 1);
      let h = '<div class="card"><h2>' + esc(part.name) + '</h2>';
      if (pts.length < 2) {
        h += '<p>' + (pts.length ? '記録がまだ1回分しかありません（' + esc(pts[0][0]) + ' ' + yen(pts[0][1]) + '）。' : '価格の記録がまだありません。') + 'グラフは、2回以上記録されると表示されます。</p>' +
          '<p class="muted">価格を更新するたびに（<code>node tools/update-prices.mjs</code>）、その日の価格が自動で記録されます。使い方は README の「価格の更新手順」を見てください。</p>' +
          '<p class="sp">いまの表示価格: <b>' + yen(part.price) + '</b>' + (PCR_CONFIG.priceIsPlaceholder ? '（仮の目安）' : '') + '</p>';
      } else {
        const v = pts.map(p => p[1]), cur = v[v.length - 1], min = Math.min.apply(null, v), max = Math.max.apply(null, v), avg = v.reduce((a, b) => a + b, 0) / v.length;
        const pos = max === min ? 0.5 : (cur - min) / (max - min);
        const sig = pts.length < 4 ? ['warn', '記録が少ないため、判断はまだ難しいです'] : pos <= 0.2 ? ['ok', '記録した期間の中では、安い水準です'] : pos >= 0.8 ? ['ng', '記録した期間の中では、高い水準です'] : ['warn', '記録した期間の中では、ふつうの水準です'];
        h += '<div class="row" style="justify-content:space-between"><div class="total">' + yen(cur) + '</div><span class="badge ' + sig[0] + '">' + sig[1] + '</span></div>' + chart(pts) +
          '<div class="grid g3 sp"><div class="card flat"><div class="muted">最安</div><b>' + yen(min) + '</b></div><div class="card flat"><div class="muted">平均</div><b>' + yen(Math.round(avg)) + '</b></div><div class="card flat"><div class="muted">最高</div><b>' + yen(max) + '</b></div></div>' +
          '<p class="muted sp">記録 ' + pts.length + '回（' + esc(pts[0][0]) + ' 〜 ' + esc(pts[pts.length - 1][0]) + '）。いまの価格は、最安より ' + yen(cur - min) + ' 高い／最高より ' + yen(max - cur) + ' 安い位置です。</p>';
      }
      h += '<div class="row sp">' + U.links(part.q) + '</div></div>';
      $('#hout', el).innerHTML = h;
    }
    hk.onchange = () => { fill(); draw(); }; hi.onchange = draw; draw();
  }, '/tools');
})();
