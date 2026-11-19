/* ============================================================
   パーツの詳しいページ（#/part/cpu/xxx・#/part/gpu/xxx）と一覧（#/part）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG, PI = PCR_PARTINFO;
  const $ = U.$, esc = U.esc, yen = U.yen;
  const perf = (k, p) => k === 'cpu' ? p.gs : p.score;

  function listPage(el, q) {
    const st = { k: q.get('k') === 'gpu' ? 'gpu' : 'cpu', sort: 'perf', all: false, q: '' };
    el.innerHTML = '<h1>パーツの一覧</h1><p class="muted">CPU・グラフィックボードの性能・価格・コスパを一覧で見られます。名前を押すと、くわしいページが開きます。</p>' +
      '<div class="tabs" role="tablist"><button type="button" data-k="cpu">🧠 CPU</button><button type="button" data-k="gpu">🎮 グラボ</button></div>' +
      '<div class="card flat"><div class="row"><input type="search" id="pl-q" placeholder="名前で探す（例: 9800X3D）" aria-label="名前で探す" style="flex:1;min-width:180px">' +
      '<select id="pl-s" style="width:auto" aria-label="並び順"><option value="perf">性能が高い順</option><option value="price">安い順</option><option value="value">コスパ順</option></select></div>' +
      '<label class="chip sp"><input type="checkbox" id="pl-all"><span>中古・旧世代・価格未確認も表示</span></label></div><div id="pl" class="sp"></div>';
    function draw() {
      $$('.tabs button', el).forEach(b => b.classList.toggle('on', b.dataset.k === st.k));
      // 検索中は、中古・旧世代なども含めて探す（見つからない、を防ぐ）
      let l = D[st.k].filter(p => p.id !== 'none' && (st.all || st.q || D.suggestable(p)) && (!st.q || U.matchQ(st.q, p.name + ' ' + (p.q || '') + ' ' + (p.b || ''))));
      const val = p => perf(st.k, p) / p.price;
      l.sort((a, b) => st.sort === 'price' ? a.price - b.price : st.sort === 'value' ? val(b) - val(a) : perf(st.k, b) - perf(st.k, a));
      const max = Math.max(...l.map(p => perf(st.k, p)), 1);
      $('#pl', el).innerHTML = '<p class="muted">' + l.length + '件</p><div class="tbl-wrap"><table class="t pl-t"><thead><tr><th>名前</th><th>' + (st.k === 'cpu' ? 'ゲーム性能' : '性能') + '</th><th>価格</th><th>1万円あたり</th></tr></thead><tbody>' +
        l.map(p => '<tr><td><a href="#/part/' + st.k + '/' + esc(p.id) + '"><b>' + esc(p.name) + '</b></a>' + (p.used ? ' <span class="badge warn">中古</span>' : p.legacy ? ' <span class="badge warn">旧世代</span>' : p.priceUnverified ? ' <span class="badge warn">未確認</span>' : '') + '</td>' +
          '<td><div class="pp-bar sm"><i style="width:' + Math.round(perf(st.k, p) / max * 100) + '%"></i></div>' + perf(st.k, p) + '</td><td>' + yen(p.price) + '</td><td>' + (val(p) * 10000).toFixed(1) + '</td></tr>').join('') + '</tbody></table></div>';
      history.replaceState(null, '', '#/part?k=' + st.k);
    }
    el.addEventListener('click', e => { const b = e.target.closest('.tabs button'); if (b) { st.k = b.dataset.k; draw(); } });
    $('#pl-q', el).addEventListener('input', e => { st.q = e.target.value.trim(); draw(); });
    $('#pl-s', el).addEventListener('change', e => { st.sort = e.target.value; draw(); });
    $('#pl-all', el).addEventListener('change', e => { st.all = e.target.checked; draw(); });
    draw();
  }
  const $$ = U.$$;

  U.route('/part', 'パーツの一覧・くわしい情報', function (el, q) {
    const seg = location.hash.replace(/^#/, '').split('?')[0].split('/');   // ['', 'part', 'cpu', 'id']
    const k = seg[2], id = decodeURIComponent(seg[3] || '');
    if ((k !== 'cpu' && k !== 'gpu') || !D.by[k][id]) { listPage(el, q); return; }
    const p = D.by[k][id];
    document.title = p.name + 'の性能・価格・ゲームのfps | ' + CFG.siteName;
    el.innerHTML = '<p class="muted" style="font-size:.85rem"><a href="#/part?k=' + k + '">パーツの一覧</a> › ' + esc(p.name) + '</p>' +
      PI.html(k, p, { base: '', shopLinks: U.links(p.q) });
    U.tipify(el);
  }, '/vs');
})();
