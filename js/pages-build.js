/* ============================================================
   自作ビルダー / BTOシミュレーター（共通パネル込み）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };
  const WIFI = { yes: 'あり', no: 'なし', varies: 'モデルにより' };
  const ORDER = ['cpu', 'mb', 'mem', 'gpu', 'ssd', 'case', 'cooler', 'psu', 'os'];

  function specLine(k, p) {
    return specBase(k, p) + (p.priceUnverified ? ' / 価格は未確認の目安（在庫が少ない・販売終了の可能性あり）' : '') +
      (p.used ? ' / 中古（価格はドスパラの中古の目安。状態や保証はお店ごとに確認）' : '') + (p.real ? ' / 実際の商品（ドスパラ ' + (p.checked || '') + ' の価格）' : '');
  }
  function specBase(k, p) {
    switch (k) {
      case 'cpu': return esc(p.b) + ' / ' + esc(p.core) + ' / 最大消費電力 約' + p.pw + 'W / ソケット ' + p.sock + (p.plus ? ' / 2026年3月発売の新型' : '') + (p.legacy ? ' / 旧世代・中古中心' : '') + (['7000', '5000', '12', '13', '14'].indexOf(p.fam) >= 0 ? ' / 前の世代' : '') + (p.igpu === false ? ' / 内蔵グラフィックスなし' : '') + ' / ゲーム性能の目安 ' + p.gs;
      case 'gpu': return p.id === 'none' ? 'CPU内蔵グラフィックスで表示します（事務・学習向け）' : 'VRAM ' + p.vram + 'GB / 消費電力 ' + p.tgp + 'W / 長さ 約' + p.len + 'mm / 電源端子 ' + p.conn + ' / 推奨電源 ' + p.rec + 'W' + (p.older ? ' / 前の世代（在庫により販売終了の場合あり）' : '');
      case 'mb': return p.chip + ' / ' + p.form + ' / ' + p.sock + ' / ' + p.mem + ' / M.2は Gen' + p.m2g + 'まで / Wi-Fi: ' + WIFI[p.wifi];
      case 'mem': return p.type + ' / 合計 ' + p.cap + 'GB（2枚組）';
      case 'ssd': return p.type + (p.gen ? ' / PCIe Gen' + p.gen : '') + ' / ' + p.cap + 'TB';
      case 'case': return p.size + 'サイズ / 静音性: ' + p.noise + ' / 入るGPU 〜' + p.gpuMax + 'mm / 空冷クーラー 〜' + p.coolerMax + 'mm / 対応マザボ ' + p.form.join('・');
      case 'cooler': return p.kind + ' / 冷却の目安 〜' + p.tdpMax + 'W / 音: ' + p.noise;
      case 'psu': return p.w + 'W / 80PLUS ' + p.grade + ' / ' + p.form + (p.atx3 ? ' / ATX 3.x' : '');
      default: return '';
    }
  }

  /* ---------- 操作パネル（解像度・ゲーム・電気代） ---------- */
  function controlsHtml(c) {
    const sel = D.games.filter(g => c.games.indexOf(g.id) >= 0).map(g => g.name.replace(/ \(.*\)$/, ''));
    return '<details class="card flat ctl"><summary><b>🎮 計算の条件を変える</b><span class="muted ctl-now">' + esc(RES[c.res] + ' ・ ' + (sel.length ? sel.slice(0, 3).join('・') + (sel.length > 3 ? ' ほか' + (sel.length - 3) + '本' : '') : 'ゲーム未選択')) + '</span></summary><div class="sp">' +
      '<label class="f">画面の解像度</label><div class="chips" id="c-res">' +
      [1080, 1440, 2160].map(r => '<label class="chip"><input type="radio" name="res" value="' + r + '"' + (c.res == r ? ' checked' : '') + '><span>' + RES[r] + (r == 1080 ? '(1920×1080)' : r == 1440 ? '(2560×1440)' : '(3840×2160)') + '</span></label>').join('') + '</div>' +
      '<label class="f sp">遊ぶゲーム（fpsの目安を出します）</label><div class="chips" id="c-games">' +
      D.games.map(g => '<label class="chip"><input type="checkbox" value="' + g.id + '"' + (c.games.indexOf(g.id) >= 0 ? ' checked' : '') + '><span>' + esc(g.name.replace(/ \(.*\)$/, '')) + '</span></label>').join('') + '</div>' +
      '<div class="row sp"><label class="chip"><input type="checkbox" id="c-stream"' + (c.stream ? ' checked' : '') + '><span>ゲーム配信もする</span></label>' +
      '<span class="muted">1日</span><input type="number" id="c-hours" min="0" max="24" step="0.5" value="' + c.hours + '" style="width:76px"><span class="muted">時間 ／ 電気代</span><input type="number" id="c-kwh" min="10" max="80" value="' + c.kwh + '" style="width:76px"><span class="muted">円/kWh</span></div></div></details>';
  }
  function readControls(root) {
    const res = +($('input[name=res]:checked', root) || { value: 1440 }).value;
    const games = $$('#c-games input:checked', root).map(i => i.value);
    return { res: res, games: games, stream: $('#c-stream', root).checked, hours: Math.max(0, +$('#c-hours', root).value || 0), kwh: Math.max(1, +$('#c-kwh', root).value || 31) };
  }

  /* ---------- チェック結果 ---------- */
  function chkHtml(items) {
    const mk = { ok: '✓', warn: '!', ng: '✕' };
    return items.map(c => '<div class="chk ' + c.lv + '"><span class="mk">' + mk[c.lv] + '</span><div><b>' + esc(c.title) + '</b>' + esc(c.msg) + '</div></div>').join('');
  }

  /* ---------- ワンランク変更シミュレーター ---------- */
  function simHtml(ids, ev, c) {
    const keys = [['gpu', 'グラフィックボード'], ['cpu', 'CPU'], ['mem', 'メモリ'], ['ssd', 'ストレージ']];
    const cell = (k, nb, dir) => {
      if (!nb) return '<td class="muted">—</td>';
      const ids2 = E.swap(ids, k, nb.id);
      const pwNow = ev.power;
      let extra = 0, note = '';
      let ev2 = E.evaluate(ids2, c);
      if (ev2.checks.some(x => x.title === '電源容量' && x.lv !== 'ok')) {
        ids2.psu = E.fitPsu(ids2); ev2 = E.evaluate(ids2, c);
        if (ids2.psu !== ids.psu) note = '<br><span class="muted">電源も変更（' + D.by.psu[ids2.psu].w + 'W）を含む</span>';
      }
      const dp = ev2.total - ev.total;
      const df = ev2.avgFps - ev.avgFps, pc = ev.avgFps ? df / ev.avgFps * 100 : 0;
      let perf;
      if (k === 'ssd') perf = '<span class="muted">fpsは変わらず。ロード時間の体感差は小さめ</span>';
      else if (Math.abs(df) < 0.5) perf = '<span class="muted">fpsの変化なし（今の構成で足りています）</span>';
      else perf = '<span class="' + (df > 0 ? 'pos' : 'neg') + '">平均 ' + (df > 0 ? '+' : '−') + Math.abs(Math.round(df)) + 'fps（' + (df > 0 ? '+' : '−') + Math.abs(Math.round(pc)) + '%）</span>';
      const bad = ev2.hasNg ? '<br><span class="neg">⚠ この組み合わせは他のパーツと合いません</span>' : '';
      return '<td><b>' + esc(nb.name) + '</b><br>' + (dp === 0 ? '同額' : '<span class="' + (dp > 0 ? 'neg' : 'pos') + '">' + U.sgn(dp) + '</span>') + ' / ' + perf + note + bad + '</td>';
    };
    return '<div class="tbl-wrap"><table class="t"><thead><tr><th>パーツ</th><th>ひとつ下げる</th><th>ひとつ上げる</th></tr></thead><tbody>' +
      keys.map(([k, lbl]) => { const n = E.neighbors(k, ids); return '<tr><td><b>' + lbl + '</b></td>' + cell(k, n.down) + cell(k, n.up) + '</tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="muted">fpsは計算モデルによる目安です。実際のゲームの結果とは差が出ます。</p>';
  }

  /* ---------- 右側のまとめパネル ---------- */
  function panelHtml(ev, ids, c, mode) {
    const ng = ev.checks.filter(x => x.lv === 'ng'), wr = ev.checks.filter(x => x.lv === 'warn'), ok = ev.checks.filter(x => x.lv === 'ok');
    const tips = ev.tips.filter(t => !ev.checks.some(x => x.title === t.title));
    const pw = ev.power, psu = ev.B.psu;
    const pwCls = psu.w < pw.need ? 'ng' : psu.w < pw.rec ? 'warn' : '';
    const pwPct = Math.min(100, pw.need / psu.w * 100);
    const maxF = 360;
    let h = '<div class="card"><div class="muted">合計金額（目安）</div><div class="total" data-yen>' + yen(ev.total) + '</div>' +
      '<div class="muted">' + (CFG.priceIsPlaceholder ? '※価格は仮の目安です。' : '※価格確認日 ' + esc(D.priceDate || CFG.dataDate) + ' 時点の目安です。') + '購入前に各店で確認してください。</div>' +
      '<div class="row sp">' + (ng.length ? '<span class="badge ng">要修正 ' + ng.length + '</span>' : '<span class="badge ok">互換性OK</span>') + (wr.length ? '<span class="badge warn">注意 ' + wr.length + '</span>' : '') + '</div></div>';

    h += '<div class="card sp"><h3>⚠ チェック結果</h3>' + (ng.length || wr.length ? chkHtml(ng.concat(wr)) : '<div class="chk ok"><span class="mk">✓</span><div><b>問題は見つかりませんでした</b>パーツ同士の組み合わせは合っています。</div></div>') +
      (tips.length ? '<h3 class="sp">この構成の注意ポイント</h3>' + chkHtml(tips.map(t => ({ lv: 'warn', title: t.title, msg: t.msg }))) : '') +
      '<details class="sp"><summary>問題なしの項目（' + ok.length + '件）</summary><div class="sp">' + chkHtml(ok) + '</div></details>' +
      '<p class="muted">パーツごとの寸法・対応CPUなどは、購入前に必ず製品ページで最終確認してください。</p></div>';

    h += '<div class="card sp"><h3>⚡ 電源とバランス</h3>' +
      '<div class="meter ' + pwCls + '"><i style="width:' + pwPct.toFixed(0) + '%"></i></div>' +
      '<p class="muted sp">最大消費電力の目安 <b>約' + pw.need + 'W</b> ／ 選んだ電源 <b>' + psu.w + 'W</b> ／ 推奨 <b>' + pw.rec + 'W以上</b></p>' +
      chkHtml([{ lv: ev.bottleneck.lv, title: 'CPUとGPUのバランス（ボトルネック）', msg: ev.bottleneck.msg }]) + '</div>';

    h += '<div class="card sp"><h3>🎮 fpsの目安（' + RES[c.res] + '）</h3>';
    if (!ev.fpsRows.length) h += '<p class="muted">上の「遊ぶゲーム」を選ぶと表示されます。</p>';
    ev.fpsRows.forEach(r => {
      const l = E.fpsLabel(r.fps);
      h += '<div class="fps-row"><span class="nm">' + esc(r.game.name) + '<br><span class="muted">' + r.limit + '性能で決まる' + (r.memPen ? '・メモリ不足の影響あり' : '') + '</span></span><div class="bar"><i style="width:' + Math.min(100, r.fps / maxF * 100).toFixed(0) + '%"></i></div><span><b>' + Math.round(r.fps) + '</b><br><span class="fl ' + l.c + '">' + l.t + '</span></span></div>';
    });
    h += '<p class="muted">※実測ではなく、性能の目安から計算したものです。設定やゲームの更新で変わります。計算方法は「このサイトについて」にあります。</p></div>';

    h += '<div class="card sp"><h3>💡 電気代の目安</h3><p>ゲーム中の消費電力 <b>約' + pw.load + 'W</b>。1日' + c.hours + '時間・30日・' + c.kwh + '円/kWhなら、<b>月 約' + yen(ev.monthly) + '</b>（年 約' + yen(ev.monthly * 12) + '）です。</p></div>';

    h += '<div class="card sp"><h3>🔁 パーツを替えたらどうなる？</h3>' + simHtml(ids, ev, c) + '</div>';
    return h;
  }

  /* ---------- 買い物リスト ---------- */
  function buyHtml(ev) {
    return '<div class="card sp" id="buylist"><h3>🛒 この構成のパーツを買う</h3><div>' +
      E.KEYS.filter(k => ev.B[k].q).map(k => '<div class="row" style="justify-content:space-between;margin-bottom:8px"><span>' + E.LABEL[k] + '：' + esc(ev.B[k].name) + '</span><span>' + U.links(ev.B[k].q) + '</span></div>').join('') +
      '<p class="muted">リンクは商品の検索結果ページです。同じ規格・型番かを確認してから購入してください。</p></div></div>';
  }

  function actionsHtml(mode) {
    return '<div class="card sp no-print"><h3>💾 保存・共有</h3>' +
      '<div class="row"><input type="text" id="s-name" placeholder="この構成の名前（例: 144fps狙い）" maxlength="30" style="flex:1;min-width:160px"><button class="btn" id="b-save">保存する</button></div>' +
      '<div class="row sp"><button class="btn sub sm" id="b-share">🔗 共有URLをコピー</button><button class="btn sub sm" id="b-copy">📋 テキストをコピー</button><button class="btn sub sm" id="b-dl">⬇ テキスト保存</button><button class="btn sub sm" id="b-img">🖼 画像で保存</button><button class="btn sub sm" id="b-qr">▦ QRコード</button><button class="btn sub sm" id="b-print">🖨 印刷・PDF</button><button class="btn sub sm" id="b-reset">↺ 最初に戻す</button></div>' +
      '<p class="muted sp">共有URLを送ると、相手にも同じ構成が開きます。PDFにするには、印刷画面で「PDFに保存」を選んでください。</p></div>';
  }

  /* ============================================================
     自作ビルダー
     ============================================================ */
  U.route('/build', '自作PCビルダー', function (el, q) {
    let ids = U.queryToIds(q, null);
    const has = E.KEYS.every(k => ids[k]);
    if (!has) ids = U.queryToIds(q, U.store.get('pcr.last.build', null) || U.defaultIds());
    let c = U.prefs();
    const flt = { size: '', noise: false, ssd: '', wifi: false, form: '' };

    el.innerHTML = '<h1>自作PC ビルダー</h1><p class="muted tipify">パーツを選ぶと、合わない組み合わせはすぐ警告が出ます。選択肢の ⚠ は「それに替えると他のパーツと合わなくなる」印です。</p>' +
      '<div class="steps no-print" id="bsteps" role="tablist">' + ['パーツを選ぶ', '結果', '買う・保存'].map((t, i) => '<button type="button" role="tab" data-go="' + (i + 1) + '"><b>' + (i + 1) + '</b>' + t + '</button>').join('') + '</div>' +
      '<div class="build stepped"><div data-step="1"><details class="card flat no-print" style="margin-bottom:12px"><summary><b>🔍 こだわり検索（絞り込み）</b></summary><div class="grid g2 sp">' +
      '<div><label class="f">ケースの大きさ</label><select id="f-size"><option value="">すべて</option><option>ミニ</option><option>ミドル</option><option>大型</option></select></div>' +
      '<div><label class="f">マザーボードのサイズ</label><select id="f-form"><option value="">すべて</option><option>ATX</option><option>mATX</option><option>ITX</option></select></div>' +
      '<div><label class="f">SSDの種類</label><select id="f-ssd"><option value="">すべて</option><option value="4">NVMe Gen4</option><option value="5">NVMe Gen5</option><option value="0">SATA</option></select></div>' +
      '<div><label class="chip"><input type="checkbox" id="f-noise"><span>静音重視のケース・クーラーだけ</span></label><br><label class="chip" style="margin-top:6px"><input type="checkbox" id="f-wifi"><span>Wi-Fi標準搭載のマザボだけ</span></label></div></div></details>' +
      '<div id="parts"></div><div class="row sp step-next"><button class="btn" type="button" data-go="2">結果を見る →</button></div></div>' +
      '<div class="sticky"><div data-step="2"><div id="ctl"></div><div id="sum" class="sp"></div><div class="row sp step-next"><button class="btn" type="button" data-go="3">買う・保存へ →</button></div></div>' +
      '<div data-step="3"><div id="buy"></div><div id="act"></div></div></div></div>';

    // スマホでは1ステップずつ表示する（パソコンでは全部並べて表示）
    function goStep(n, scroll) {
      $$('[data-step]', el).forEach(x => x.classList.toggle('cur', +x.dataset.step === n));
      $$('#bsteps button', el).forEach(b => { b.classList.toggle('on', +b.dataset.go === n); b.setAttribute('aria-selected', +b.dataset.go === n ? 'true' : 'false'); });
      if (scroll) $('#bsteps', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) goStep(+b.dataset.go, true); });
    goStep(1);
    const partsEl = $('#parts', el);
    partsEl.innerHTML = ORDER.map(k => '<div class="part" data-k="' + k + '"><div class="top"><span class="nm">' + E.LABEL[k] + '</span><button class="fav" title="お気に入りに追加" aria-label="お気に入り"></button></div><select aria-label="' + E.LABEL[k] + '"></select><div class="spec tipify"></div></div>').join('');
    $('#ctl', el).innerHTML = controlsHtml(c);
    $('#act', el).innerHTML = actionsHtml('build');

    function listFor(k) {
      let list = D[k].filter(p => {
        if (k === 'case') return (!flt.size || p.size === flt.size) && (!flt.noise || p.noise === '静音');
        if (k === 'cooler') return !flt.noise || p.noise === '静か';
        if (k === 'mb') return (!flt.form || p.form === flt.form) && (!flt.wifi || p.wifi === 'yes');
        if (k === 'ssd') return flt.ssd === '' || String(p.gen) === flt.ssd;
        return true;
      });
      if (!list.some(p => p.id === ids[k])) list.push(D.by[k][ids[k]]);
      return list;
    }
    function drawParts() {
      ORDER.forEach(k => {
        const box = $('.part[data-k=' + k + ']', partsEl), sel = $('select', box), cur = D.by[k][ids[k]];
        sel.innerHTML = U.optionsHtml(k, listFor(k), ids[k], p => {
          const bad = p.id !== ids[k] && E.evaluate(E.swap(ids, k, p.id), c).hasNg ? '⚠ ' : '';
          const d = p.price - cur.price;
          return bad + p.name + '　' + (p.id === ids[k] ? (p.price ? yen(p.price) : '0円') : d === 0 ? '±0' : U.sgn(d)) + (p.priceUnverified && p.id === ids[k] ? '（未確認）' : '');
        });
        $('.spec', box).textContent = specLine(k, cur);
        const top = $('.top .nm', box); const oldImg = $('.pimg', box); if (oldImg) oldImg.remove(); const ih = U.partImg(k, cur.id, 44); if (ih) top.insertAdjacentHTML('beforebegin', ih);

        const fav = $('.fav', box); const on = U.isFav(k, cur.id); fav.classList.toggle('on', on); fav.textContent = on ? '★' : '☆';
      });
      U.tipify(partsEl);
    }
    function drawSum() {
      const ev = E.evaluate(ids, c);
      $('#sum', el).innerHTML = panelHtml(ev, ids, c, 'build');
      $('#buy', el).innerHTML = buyHtml(ev);
      U.sumBar(ev, () => goStep(2, true));
      U.tipify($('#sum', el));
      history.replaceState(null, '', '#/build?' + U.idsToQuery(ids));
      U.store.set('pcr.last.build', ids);
      return ev;
    }
    function all() { drawParts(); drawSum(); }
    all();

    partsEl.addEventListener('change', e => {
      const box = e.target.closest('.part'); if (!box || e.target.tagName !== 'SELECT') return;
      const k = box.dataset.k, before = ids;
      ids = E.swap(ids, k, e.target.value);
      if (k === 'cpu' && before.mb !== ids.mb) U.toast('CPUに合わせてマザーボードも変更しました');
      if (k === 'case' && before.mb !== ids.mb) U.toast('ケースに合わせてマザーボードも変更しました');
      all();
    });
    partsEl.addEventListener('click', e => {
      const f = e.target.closest('.fav'); if (!f) return;
      const k = f.closest('.part').dataset.k; const on = U.toggleFav(k, ids[k]);
      U.toast(on ? 'お気に入りに追加しました（「保存」ページで見られます）' : 'お気に入りから外しました'); drawParts();
    });
    $('#ctl', el).addEventListener('change', () => { c = readControls($('#ctl', el)); U.setPrefs(c); all(); });
    ['f-size', 'f-form', 'f-ssd'].forEach(id => $('#' + id, el).addEventListener('change', e => { flt[id.slice(2)] = e.target.value; drawParts(); }));
    ['f-noise', 'f-wifi'].forEach(id => $('#' + id, el).addEventListener('change', e => { flt[id.slice(2)] = e.target.checked; drawParts(); }));

    $('#act', el).addEventListener('click', e => {
      const id = e.target.id; if (!id) return;
      if (id === 'b-save') {
        const n = $('#s-name', el).value.trim() || ('自作構成 ' + new Date().toLocaleDateString('ja-JP'));
        const r = U.saveBuild(n, ids, 'build'); U.toast(r.ok ? '保存しました（「保存」ページで見られます）' : r.msg);
      }
      if (id === 'b-share') U.copy(U.shareUrl('/build', ids));
      if (id === 'b-copy') U.copy(U.buildText(ids, c, '自作PC構成'));
      if (id === 'b-dl') U.download('pc-recipe-build.txt', U.buildText(ids, c, '自作PC構成'));
      if (id === 'b-img') U.downloadImage(ids, c, '自作PC構成', '/build', 'pc-recipe-build.png');
      if (id === 'b-qr') U.showQr(U.shortUrl('/build', ids));
      if (id === 'b-print') window.print();
      if (id === 'b-reset') { ids = U.defaultIds(); all(); U.toast('最初の構成に戻しました'); }
    });
  }, '/build');

  /* ============================================================
     BTOモード
     ============================================================ */
  U.route('/bto', 'BTOパソコン選び', function (el, q) {
    const base = { cpu: 'r7-9800x3d', gpu: 'rtx5070ti', mem: 'd5-32', ssd: 'g4-2' };
    const st = {
      cpu: D.by.cpu[q.get('cpu')] ? q.get('cpu') : base.cpu, gpu: D.by.gpu[q.get('gpu')] ? q.get('gpu') : base.gpu,
      mem: D.by.mem[q.get('mem')] ? q.get('mem') : base.mem, ssd: D.by.ssd[q.get('ssd')] ? q.get('ssd') : base.ssd,
      size: ['mini', 'compact', 'mid', 'large'].indexOf(q.get('size')) >= 0 ? q.get('size') : 'mid', quiet: q.get('quiet') === '1'
    };
    let c = U.prefs();
    const opts = (k, cur) => U.optionsHtml(k, D[k], cur, p => p.name);

    el.innerHTML = '<h1>BTOパソコン選び</h1><p class="muted tipify">ショップのカスタマイズ画面で選ぶ4つ（CPU・GPU・メモリ・SSD）を決めると、電源やケースの目安、fps、電気代までまとめて確認できます。</p>' +
      '<div class="steps no-print" id="bsteps" role="tablist">' + ['中身を選ぶ', '結果', 'ショップで選ぶ', '価格メモ'].map((t, i) => '<button type="button" role="tab" data-go="' + (i + 1) + '"><b>' + (i + 1) + '</b>' + t + '</button>').join('') + '</div>' +
      '<div class="build stepped" id="bwrap"><div><div class="card" data-step="1"><h2>1. 中身を選ぶ</h2><div class="grid g2" id="sel"></div>' +
      '<div class="grid g2 sp"><div><label class="f">大きさの好み</label><select id="b-size"><option value="mini">小型（Mini-ITX）</option><option value="compact">コンパクト（Micro-ATX）</option><option value="mid">標準（ミドルタワー）</option><option value="large">大型（フルタワー）</option></select></div>' +
      '<div style="align-self:end"><label class="chip"><input type="checkbox" id="b-quiet"><span>静音重視</span></label></div></div>' +
      '<div class="row sp step-next"><button class="btn" type="button" data-go="2">結果を見る →</button></div></div>' +
      '<div data-step="3"><div id="buyguide" class="sp"></div><div id="makers" class="sp"></div><div class="row sp step-next"><button class="btn sub" type="button" data-go="4">価格メモへ →</button></div></div><div id="memo" class="sp" data-step="4"></div></div>' +
      '<div class="sticky" data-step="2"><div id="ctl"></div><div id="sum" class="sp"></div><div id="act"></div><div class="row sp step-next"><button class="btn" type="button" data-go="3">ショップで選ぶときの目安へ →</button></div></div></div>';

    $('#sel', el).innerHTML = [['cpu', 'CPU'], ['gpu', 'グラフィックボード'], ['mem', 'メモリ'], ['ssd', 'ストレージ']].map(([k, l]) => '<div><label class="f">' + l + '</label><select data-k="' + k + '">' + opts(k, st[k]) + '</select></div>').join('');
    $('#b-size', el).value = st.size; $('#b-quiet', el).checked = st.quiet;
    // スマホでは1ステップずつ表示する（パソコンでは全部並べて表示）
    let step = 1;
    function goStep(n, scroll) {
      step = n;
      $$('[data-step]', el).forEach(x => x.classList.toggle('cur', +x.dataset.step === n));
      $$('#bsteps button', el).forEach(b => { b.classList.toggle('on', +b.dataset.go === n); b.setAttribute('aria-selected', +b.dataset.go === n ? 'true' : 'false'); });
      if (scroll) $('#bsteps', el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    el.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) goStep(+b.dataset.go, true); });
    goStep(1);
    $('#ctl', el).innerHTML = controlsHtml(c);
    $('#act', el).innerHTML = actionsHtml('bto');

    function ids() { return E.complete({ cpu: st.cpu, gpu: st.gpu, mem: st.mem, ssd: st.ssd }, { size: st.size, quiet: st.quiet }); }
    function guide(ev) {
      const B = ev.B;
      return '<div class="card"><h2>2. ショップで選ぶときの目安</h2><div class="tbl-wrap"><table class="t tipify"><tbody>' +
        '<tr><th>CPU</th><td>' + esc(B.cpu.name) + '</td></tr><tr><th>グラフィックボード</th><td>' + esc(B.gpu.name) + '</td></tr>' +
        '<tr><th>メモリ</th><td>' + esc(B.mem.name) + '</td></tr><tr><th>ストレージ</th><td>' + esc(B.ssd.name) + '</td></tr>' +
        '<tr><th>電源</th><td><b>' + ev.power.rec + 'W以上</b>（80PLUS Gold以上がおすすめ' + (B.gpu.conn === '12V-2x6' ? '。ATX 3.x対応だと12V-2x6が直接つながります' : '') + '）</td></tr>' +
        '<tr><th>マザーボード</th><td>' + esc(B.mb.chip) + ' クラス（' + B.mb.form + '）</td></tr>' +
        '<tr><th>CPUクーラー</th><td>' + esc(B.cooler.name) + ' 以上の冷却力</td></tr>' +
        '<tr><th>ケース</th><td>' + esc(B.case.name) + '（GPU 約' + B.gpu.len + 'mmが入ること）</td></tr></tbody></table></div>' +
        '<p class="muted">BTOでは電源・マザーボード・ケースは自動で決まることも多く、同じ型番でも中身が違う場合があります。商品ページの「仕様表」で確認しましょう。</p>' +
        '<div class="row"><a class="btn sub sm" href="#/build?' + U.idsToQuery(ev.ids) + '">この構成を自作で組むと…（自作ビルダーで開く）</a></div></div>';
    }
    function makersHtml() {
      return '<div class="card"><h2>3. BTOメーカーを比べる</h2><p class="muted">下の注意点を確認しながら、各社のページで同じ構成を探してみましょう。実際のモデルと価格は <a href="#/compare">BTOモデル比較</a> でも見られます。</p><div class="grid g3">' +
        D.makers.map(m => { const cf = CFG.affiliate.bto[m.key]; return '<div class="card flat"><h3>' + esc(cf.name) + '</h3><div class="muted">ブランド: ' + esc(m.brand) + '</div><p class="sp">' + esc(m.note) + '</p><b>確認するポイント</b><ul>' + m.check.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><span class="pr">PR</span><a class="btn sm" target="_blank" rel="sponsored noopener" href="' + esc(U.makerLink(m.key)) + '">' + esc(cf.name) + 'を見る</a>' + U.makerImp(m.key) + '</div>'; }).join('') +
        '</div><p class="muted sp">※各社の特徴は一般的な傾向です。保証・納期・価格は変わるため、必ず公式ページで確認してください。</p></div>';
    }
    function memoHtml() {
      const list = U.store.get('pcr.btoMemo.v1', []);
      const min = list.length ? Math.min.apply(null, list.map(x => x.price)) : 0;
      const sorted = list.map((x, i) => Object.assign({ i: i }, x)).sort((a, b) => a.price - b.price);
      return '<div class="card"><h2>4. 見つけた価格をメモして比べる</h2><p class="muted">各社で同じくらいの構成を見つけたら、価格などを入れてください。安い順に並べて、差額を出します（ブラウザ内に保存）。</p>' +
        '<div class="grid g3"><div><label class="f">メーカー</label><select id="m-maker">' + D.makers.map(m => '<option value="' + esc(CFG.affiliate.bto[m.key].name) + '">' + esc(CFG.affiliate.bto[m.key].name) + '</option>').join('') + '<option>その他</option></select></div>' +
        '<div><label class="f">モデル名</label><input type="text" id="m-model" maxlength="40"></div><div><label class="f">価格（税込）</label><input type="number" id="m-price" min="0" step="1000"></div>' +
        '<div><label class="f">保証（年）</label><input type="number" id="m-war" min="0" max="10" value="1"></div><div><label class="f">納期（日）</label><input type="number" id="m-days" min="0" max="120" value="5"></div><div style="align-self:end"><button class="btn" id="m-add">追加</button></div></div>' +
        (sorted.length ? '<div class="tbl-wrap sp"><table class="t"><thead><tr><th>メーカー</th><th>モデル</th><th>価格</th><th>最安との差</th><th>保証</th><th>納期</th><th></th></tr></thead><tbody>' +
          sorted.map(x => '<tr><td>' + esc(x.maker) + '</td><td>' + esc(x.model) + '</td><td><b>' + yen(x.price) + '</b>' + (x.price === min ? ' <span class="badge ok">最安</span>' : '') + '</td><td>' + (x.price === min ? '—' : '<span class="neg">' + U.sgn(x.price - min) + '</span>') + '</td><td>' + x.war + '年</td><td>' + x.days + '日</td><td><button class="btn sub sm" data-del="' + x.i + '">削除</button></td></tr>').join('') + '</tbody></table></div>' : '') + '</div>';
    }

    function draw() {
      const i = ids(), ev = E.evaluate(i, c);
      $('#sum', el).innerHTML = panelHtml(ev, i, c, 'bto');
      U.sumBar(ev, () => goStep(2, true));
      $('#buyguide', el).innerHTML = guide(ev);
      U.tipify($('#sum', el)); U.tipify($('#buyguide', el));
      history.replaceState(null, '', '#/bto?' + ['cpu', 'gpu', 'mem', 'ssd'].map(k => k + '=' + st[k]).join('&') + '&size=' + st.size + (st.quiet ? '&quiet=1' : ''));
    }
    $('#makers', el).innerHTML = makersHtml();
    $('#memo', el).innerHTML = memoHtml();
    draw();

    $('#sel', el).addEventListener('change', e => { st[e.target.dataset.k] = e.target.value; draw(); });
    $('#b-size', el).addEventListener('change', e => { st.size = e.target.value; draw(); });
    $('#b-quiet', el).addEventListener('change', e => { st.quiet = e.target.checked; draw(); });
    $('#ctl', el).addEventListener('change', () => { c = readControls($('#ctl', el)); U.setPrefs(c); draw(); });
    $('#memo', el).addEventListener('click', e => {
      const list = U.store.get('pcr.btoMemo.v1', []);
      if (e.target.id === 'm-add') {
        const price = +$('#m-price', el).value; if (!price) { U.toast('価格を入れてください'); return; }
        if (list.length >= 20) { U.toast('メモは20件までです'); return; }
        list.push({ maker: $('#m-maker', el).value, model: $('#m-model', el).value.trim() || '(名称なし)', price: price, war: +$('#m-war', el).value || 0, days: +$('#m-days', el).value || 0 });
        U.store.set('pcr.btoMemo.v1', list); $('#memo', el).innerHTML = memoHtml();
      }
      if (e.target.dataset.del != null) { list.splice(+e.target.dataset.del, 1); U.store.set('pcr.btoMemo.v1', list); $('#memo', el).innerHTML = memoHtml(); }
    });
    $('#act', el).addEventListener('click', e => {
      const id = e.target.id; if (!id) return; const i = ids();
      if (id === 'b-save') { const n = $('#s-name', el).value.trim() || ('BTO構成 ' + new Date().toLocaleDateString('ja-JP')); const r = U.saveBuild(n, i, 'bto'); U.toast(r.ok ? '保存しました（「保存」ページで見られます）' : r.msg); }
      if (id === 'b-share') U.copy(location.href);
      if (id === 'b-copy') U.copy(U.buildText(i, c, 'BTO構成'));
      if (id === 'b-dl') U.download('pc-recipe-bto.txt', U.buildText(i, c, 'BTO構成'));
      if (id === 'b-img') U.downloadImage(i, c, 'BTO構成', '/build', 'pc-recipe-bto.png');
      if (id === 'b-qr') U.showQr(U.shortUrl('/build', i));
      if (id === 'b-print') window.print();
      if (id === 'b-reset') { Object.assign(st, base, { size: 'mid', quiet: false }); $$('#sel select', el).forEach(s => { s.value = st[s.dataset.k]; }); $('#b-size', el).value = 'mid'; $('#b-quiet', el).checked = false; draw(); }
    });
  }, '/bto');
})();
