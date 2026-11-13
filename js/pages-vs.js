/* ============================================================
   くらべる（グラボ同士／CPU同士／構成同士）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };
  const MAX = 4;
  const MARK = ['①', '②', '③', '④'];
  // 比べる対象の色（並べた順に固定。色覚の違いでも見分けられることを確認した4色）
  const SERIES = ['s1', 's2', 's3', 's4'];
  const BASE_CPU = 'r7-9800x3d', BASE_GPU = 'rtx5070ti';

  /* 選んだもの（この端末に保存） */
  const st = Object.assign({ tab: 'gpu', gpu: ['rtx5060', 'rx9060xt', 'rtx3060ti'], cpu: ['r5-7500f', 'r7-9800x3d', 'cu7-265k'], build: [], res: 1440, quality: 'high' }, U.store.get('pcr.vs.v1', {}));
  const save = () => U.store.set('pcr.vs.v1', { tab: st.tab, gpu: st.gpu, cpu: st.cpu, build: st.build, res: st.res, quality: st.quality });

  /* 構成の候補：保存した構成・前回の自作構成・BTOモデル */
  function buildSources() {
    const out = [];
    const last = U.store.get('pcr.last.build', null);
    if (last) out.push({ key: 'last', name: '前回の自作構成', ids: last, kind: '自作' });
    U.getSaved().forEach(s => out.push({ key: 'saved:' + s.id, name: s.name || '保存した構成', ids: s.ids, kind: s.mode === 'bto' ? 'BTOの目安' : '自作' }));
    (window.PCR_BTO_MODELS || []).forEach((m, i) => {
      if (!D.by.cpu[m.cpu] || !D.by.gpu[m.gpu]) return;
      const type = E.platformTypes(D.by.cpu[m.cpu].sock)[0];
      const mem = E.memFor(m.memGB >= 64 ? 64 : m.memGB >= 32 ? 32 : 16, type);
      const ssd = m.ssdTB >= 2 ? 'g4-2' : m.ssdTB >= 1 ? 'g4-1' : 'g4-500';
      out.push({ key: 'bto:' + i, name: (CFG.affiliate.bto[m.maker] || {}).name + ' ' + m.name, ids: E.complete({ cpu: m.cpu, gpu: m.gpu, mem: mem, ssd: ssd }, {}), kind: 'BTO', price: m.price, url: m.url, maker: m.maker });
    });
    return out;
  }

  /* fpsの横棒グラフ：ゲームごとに、選んだものを同じ順・同じ色で並べる */
  function fpsChart(items, fpsOf) {
    const p = U.prefs();
    const games = (p.games && p.games.length ? p.games : ['apex', 'cyberpunk']).slice(0, 4).map(id => D.by.games[id]).filter(Boolean);
    const rows = games.map(g => ({ g: g, v: items.map(it => fpsOf(it, g)) }));
    const max = Math.max(60, ...rows.map(r => Math.max(...r.v.map(x => x.fps))));
    return '<div class="vs-chart" role="img" aria-label="ゲームごとのfpsの比較">' + rows.map(r =>
      '<div class="vs-g"><div class="vs-gt">' + esc(r.g.name) + '</div>' + r.v.map((x, i) =>
        '<div class="vs-row"><span class="vs-mk ' + SERIES[i] + '">' + MARK[i] + '</span><div class="vs-bar"><i class="' + SERIES[i] + '" style="width:' + Math.max(2, x.fps / max * 100).toFixed(1) + '%"></i></div>' +
        '<span class="vs-v"><b>' + Math.round(x.fps) + '</b>fps' + (x.vramPen ? '<span class="neg">（VRAM不足ぎみ）</span>' : '') + '</span></div>').join('') + '</div>').join('') +
      '</div><p class="muted">fpsは計算モデルによる目安です（' + RES[st.res] + '・' + E.QUALITY[st.quality].t + '画質）。遊ぶゲームは、自作ビルダーの「計算の条件」で選んだものを使っています。</p>';
  }

  /* 比較表：行ごとに、いちばん良い値に ★ を付ける（better: 'hi' 大きいほど良い / 'lo' 小さいほど良い） */
  function table(items, rows) {
    return '<div class="tbl-wrap"><table class="t vs-t"><thead><tr><th></th>' + items.map((it, i) => '<th><span class="vs-mk ' + SERIES[i] + '">' + MARK[i] + '</span> ' + esc(it.label) + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map(r => {
        const vals = items.map(r.v);
        let best = -1;
        if (r.better && items.length > 1) {
          const nums = vals.map(v => typeof v === 'number' ? v : NaN);
          const ok = nums.filter(n => !isNaN(n));
          if (ok.length > 1 && Math.min(...ok) !== Math.max(...ok)) best = nums.indexOf(r.better === 'hi' ? Math.max(...ok) : Math.min(...ok));
        }
        return '<tr><th>' + r.t + '</th>' + vals.map((v, i) => '<td' + (i === best ? ' class="vs-best"' : '') + '>' + (r.f ? r.f(v, items[i]) : esc(v)) + (i === best ? ' <span class="vs-star" title="いちばん良い">★</span>' : '') + '</td>').join('') + '</tr>';
      }).join('') + '</tbody></table></div><p class="muted">★ は、その行でいちばん良いもの（安い・速い・省電力など）です。</p>';
  }

  /* CPUとグラボの相性（◎○△✕）。いちばん目のゲームで判定 */
  function aisho(cpu, gpu) {
    const p = U.prefs(), g = D.by.games[(p.games || [])[0]] || D.by.games.apex;
    const j = U.matchJudge(cpu, gpu, g, st.res, st.quality);
    return '<span class="m-key ' + j.c + '"><b>' + j.mk + '</b>' + j.t + '</span><br><span class="muted">' + esc(g.name) + 'で判定</span>';
  }

  /* 選ぶ欄（スロット） */
  function slots(kind, ids, list, label) {
    return '<div class="vs-slots">' + ids.map((id, i) => '<div class="vs-slot"><span class="vs-mk ' + SERIES[i] + '">' + MARK[i] + '</span><select data-kind="' + kind + '" data-i="' + i + '" aria-label="' + label + ' ' + (i + 1) + '">' +
      list(id) + '</select>' + (ids.length > 2 ? '<button type="button" class="icon-btn vs-x" data-del="' + i + '" aria-label="外す">✕</button>' : '') + '</div>').join('') +
      (ids.length < MAX ? '<button type="button" class="btn sub sm" data-add="' + kind + '">＋ 比べるものを追加</button>' : '') + '</div>';
  }

  U.route('/vs', 'くらべる（グラボ・CPU・構成）', function (el, q) {
    if (['gpu', 'cpu', 'build'].indexOf(q.get('t')) >= 0) st.tab = q.get('t');
    el.innerHTML = '<h1>くらべる</h1><p class="muted">グラボ同士・CPU同士・作った構成同士を、最大4つまで並べて比べられます。ほかにも <a href="#/compare">BTOモデル比較</a>・<a href="#/games">ゲーム別fps</a> があります。</p>' +
      '<a class="card card-link flat vs-match" href="#/match"><b>🧩 CPUとグラボの相性表（◎○△✕）</b><span class="muted">すべての組み合わせの相性を、表でまとめて見られます</span></a>' +
      '<div class="tabs vs-tabs no-print" role="tablist">' + [['gpu', '🎮 グラボ'], ['cpu', '🧠 CPU'], ['build', '🖥 構成']].map(t => '<button type="button" role="tab" data-tab="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="card flat no-print vs-cond"><div class="grid g2"><div><label class="f">画面の解像度</label><div class="chips">' + [1080, 1440, 2160].map(r => '<label class="chip"><input type="radio" name="vr" value="' + r + '"' + (st.res === r ? ' checked' : '') + '><span>' + RES[r] + '</span></label>').join('') + '</div></div>' +
      '<div><label class="f">画質</label>' + U.qualityChips('vq', st.quality) + '</div></div></div>' +
      '<div id="vs-body" class="sp"></div>';

    function draw() {
      $$('.vs-tabs button', el).forEach(b => { b.classList.toggle('on', b.dataset.tab === st.tab); b.setAttribute('aria-selected', b.dataset.tab === st.tab ? 'true' : 'false'); });
      save();
      history.replaceState(null, '', '#/vs?t=' + st.tab);
      const body = $('#vs-body', el);
      if (st.tab === 'gpu') body.innerHTML = gpuView();
      else if (st.tab === 'cpu') body.innerHTML = cpuView();
      else body.innerHTML = buildView();
      U.tipify(body);
    }

    /* ---------- グラボ ---------- */
    function gpuView() {
      st.gpu = st.gpu.filter(id => D.by.gpu[id] && id !== 'none');
      const items = st.gpu.map(id => ({ p: D.by.gpu[id], label: D.by.gpu[id].name }));
      const cpu = D.by.cpu[BASE_CPU];
      const fpsOf = (it, g) => E.fps(g, st.res, { cpu: cpu, gpu: it.p, mem: D.by.mem['d5-32'] }, { quality: st.quality });
      const p = U.prefs(), games = (p.games || []).map(id => D.by.games[id]).filter(Boolean);
      const avgF = it => games.length ? games.reduce((s, g) => s + fpsOf(it, g).fps, 0) / games.length : 0;
      return '<div class="card">' + slots('gpu', st.gpu, cur => U.optionsHtml('gpu', D.gpu.filter(g => g.id !== 'none'), cur, g => g.name + '　' + yen(g.price)), 'グラボ') + '</div>' +
        '<div class="card sp"><h2>ゲームごとのfps</h2><p class="muted">CPUは ' + esc(cpu.name) + '、メモリ32GBで計算しています。</p>' + fpsChart(items, fpsOf) + '</div>' +
        '<div class="card sp"><h2>くわしく比べる</h2>' + table(items, [
          { t: '価格', v: it => it.p.price, better: 'lo', f: (v, it) => yen(v) + (it.p.used ? '<br><span class="muted">中古</span>' : it.p.priceUnverified ? '<br><span class="muted">未確認</span>' : '') },
          { t: '性能の目安', v: it => it.p.score, better: 'hi', f: v => v + '<span class="muted">（RTX 5090 = 100）</span>' },
          { t: 'CPUとの相性<br><span class="muted">' + esc(cpu.name) + '</span>', v: it => it, f: (v, it) => aisho(cpu, it.p) },
          { t: '平均fps', v: it => Math.round(avgF(it)), better: 'hi', f: v => v + 'fps' },
          { t: '1fpsあたりの値段', v: it => avgF(it) ? Math.round(it.p.price / avgF(it)) : NaN, better: 'lo', f: v => isNaN(v) ? '—' : yen(v) },
          { t: 'VRAM', v: it => it.p.vram, better: 'hi', f: v => v + 'GB' },
          { t: '消費電力', v: it => it.p.tgp, better: 'lo', f: v => '約' + v + 'W' },
          { t: '推奨の電源', v: it => it.p.rec, better: 'lo', f: v => v + 'W以上' },
          { t: '長さ・厚み', v: it => it.p.len, better: 'lo', f: (v, it) => '約' + v + 'mm・' + it.p.slots + 'スロット' },
          { t: '電源コネクタ', v: it => it.p.conn },
          { t: '', v: it => it.p.id, f: v => '<a class="btn sub sm" href="#/build?' + U.idsToQuery(E.complete({ cpu: BASE_CPU, gpu: v }, {})) + '">これで組む</a>' }
        ]) + '</div>';
    }

    /* ---------- CPU ---------- */
    function cpuView() {
      st.cpu = st.cpu.filter(id => D.by.cpu[id]);
      const items = st.cpu.map(id => ({ p: D.by.cpu[id], label: D.by.cpu[id].name }));
      const gpu = D.by.gpu[BASE_GPU];
      const fpsOf = (it, g) => E.fps(g, st.res, { cpu: it.p, gpu: gpu, mem: D.by.mem['d5-32'] }, { quality: st.quality });
      const note = c => [c.legacy ? '旧世代・中古中心' : '', c.priceUnverified ? '価格未確認' : '', c.unstable ? '第13・14世代の不安定問題の対象（最新のBIOSに）' : '', c.bios ? 'BIOS更新が必要な場合あり' : '', c.win11 === false ? 'Windows 11 公式非対応' : ''].filter(Boolean).join('・') || '—';
      return '<div class="card">' + slots('cpu', st.cpu, cur => U.optionsHtml('cpu', D.cpu, cur, c => c.name + '　' + yen(c.price)), 'CPU') + '</div>' +
        '<div class="card sp"><h2>ゲームごとのfps</h2><p class="muted">グラボは ' + esc(gpu.name) + ' で計算しています（CPUの差が出やすいように、速いグラボにしています）。解像度や画質を下げるほど、CPUの差が大きくなります。</p>' + fpsChart(items, fpsOf) + '</div>' +
        '<div class="card sp"><h2>くわしく比べる</h2>' + table(items, [
          { t: '価格', v: it => it.p.price, better: 'lo', f: v => yen(v) },
          { t: 'ゲーム性能の目安', v: it => it.p.gs, better: 'hi' },
          { t: 'グラボとの相性<br><span class="muted">' + esc(gpu.name) + '</span>', v: it => it, f: (v, it) => aisho(it.p, gpu) },
          { t: '動画編集などの性能の目安', v: it => it.p.mt, better: 'hi' },
          { t: 'コア数', v: it => it.p.core },
          { t: 'ソケット', v: it => it.p.sock },
          { t: '使えるメモリ', v: it => E.platformTypes(it.p.sock).join('・') },
          { t: '最大消費電力', v: it => it.p.pw, better: 'lo', f: v => '約' + v + 'W' },
          { t: '内蔵グラフィックス', v: it => it.p.igpu === false ? 'なし' : 'あり' },
          { t: '注意', v: it => note(it.p) },
          { t: '', v: it => it.p.id, f: v => '<a class="btn sub sm" href="#/build?' + U.idsToQuery(E.complete({ cpu: v, gpu: BASE_GPU }, {})) + '">これで組む</a>' }
        ]) + '</div>';
    }

    /* ---------- 構成 ---------- */
    function buildView() {
      const src = buildSources();
      const byKey = {}; src.forEach(s => { byKey[s.key] = s; });
      st.build = (st.build || []).filter(b => byKey[b.key] || b.ids);
      if (st.build.length < 2) src.slice(0, 2).forEach(s => { if (!st.build.some(b => b.key === s.key)) st.build.push({ key: s.key }); });
      const items = st.build.map(b => { const s = byKey[b.key] || b; const ev = E.evaluate(s.ids, Object.assign({}, U.prefs(), { res: st.res, quality: st.quality })); return { s: s, ev: ev, label: s.name }; });
      const opt = cur => ['自作', 'BTOの目安', 'BTO'].map(kind => { const l = src.filter(s => s.kind === kind); return l.length ? '<optgroup label="' + (kind === 'BTO' ? 'BTOモデル（各社の価格）' : kind === '自作' ? '自作の構成' : '保存したBTOの目安') + '">' + l.map(s => '<option value="' + esc(s.key) + '"' + (s.key === cur ? ' selected' : '') + '>' + esc(s.name) + '</option>').join('') + '</optgroup>' : ''; }).join('');
      const price = it => it.s.price || it.ev.total;
      const fpsOf = (it, g) => E.fps(g, st.res, it.ev.B, { quality: st.quality });
      return '<div class="card"><p class="muted">保存した構成、前回の自作構成、BTOモデル（' + ((window.PCR_BTO_MODELS || []).length) + '機種）から選べます。自作ビルダーの「保存する」で、比べる候補を増やせます。</p>' +
        slots('build', st.build.map(b => b.key), opt, '構成') + '</div>' +
        '<div class="card sp"><h2>ゲームごとのfps</h2>' + fpsChart(items, fpsOf) + '</div>' +
        '<div class="card sp"><h2>くわしく比べる</h2>' + table(items, [
          { t: '種類', v: it => it.s.kind },
          { t: '価格', v: it => price(it), better: 'lo', f: (v, it) => yen(v) + '<br><span class="muted">' + (it.s.price ? 'メーカーの表示価格' : 'パーツ価格の合計') + '</span>' },
          { t: 'CPU', v: it => it.ev.B.cpu.name },
          { t: 'グラボ', v: it => it.ev.B.gpu.name },
          { t: 'CPUとグラボの相性', v: it => it, f: (v, it) => it.ev.B.gpu.id === 'none' ? '—' : aisho(it.ev.B.cpu, it.ev.B.gpu) },
          { t: 'メモリ', v: it => it.ev.B.mem.cap, better: 'hi', f: (v, it) => it.ev.B.mem.name },
          { t: 'SSD', v: it => it.ev.B.ssd.cap, better: 'hi', f: (v, it) => it.ev.B.ssd.name },
          { t: '平均fps', v: it => Math.round(it.ev.avgFps || 0), better: 'hi', f: v => v + 'fps' },
          { t: '電気代（月）', v: it => Math.round(it.ev.monthly), better: 'lo', f: v => '約' + yen(v) },
          { t: '互換性', v: it => it.ev.hasNg ? '要修正あり' : '問題なし' },
          { t: '', v: it => it, f: (v, it) => '<a class="btn sub sm" href="#/build?' + U.idsToQuery(it.ev.ids) + '">自作ビルダーで開く</a>' + (it.s.url ? '<a class="btn sub sm" target="_blank" rel="sponsored noopener" href="' + esc(U.makerDeepLink(it.s.maker, it.s.url) || it.s.url) + '">商品ページ</a>' : '') }
        ]) + '</div>';
    }

    el.addEventListener('change', e => {
      const t = e.target;
      if (t.name === 'vr') st.res = +t.value;
      else if (t.name === 'vq') st.quality = t.value;
      else if (t.dataset.kind === 'build') st.build[+t.dataset.i] = { key: t.value };
      else if (t.dataset.kind) st[t.dataset.kind][+t.dataset.i] = t.value;
      else return;
      draw();
    });
    el.addEventListener('click', e => {
      const tab = e.target.closest('[data-tab]'), add = e.target.closest('[data-add]'), del = e.target.closest('[data-del]');
      if (tab) { st.tab = tab.dataset.tab; draw(); }
      else if (add) {
        const k = add.dataset.add;
        if (k === 'gpu') st.gpu.push(D.gpu.find(g => g.id !== 'none' && D.suggestable(g) && st.gpu.indexOf(g.id) < 0).id);
        else if (k === 'cpu') st.cpu.push(D.cpu.find(c => D.suggestable(c) && st.cpu.indexOf(c.id) < 0).id);
        else { const s = buildSources().find(s => !st.build.some(b => b.key === s.key)); if (s) st.build.push({ key: s.key }); }
        draw();
      } else if (del) {
        const list = st.tab === 'build' ? st.build : st[st.tab];
        list.splice(+del.dataset.del, 1); draw();
      }
    });
    draw();
  }, '/compare');
})();
