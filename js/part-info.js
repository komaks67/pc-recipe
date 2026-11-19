/* ============================================================
   パーツの詳しい情報（CPU・グラボ）
   画面（#/part/cpu/xxx）と、検索向けの静的ページ（parts/）の両方で使う。
   DOM を使わず、HTMLの文字だけを作る。
   ============================================================ */
window.PCR_PARTINFO = (function () {
  const D = window.PCR_DATA, E = window.PCR_ENGINE, CFG = window.PCR_CONFIG;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');
  const RES = [[1080, 'フルHD'], [1440, 'WQHD'], [2160, '4K']];
  const BASE_CPU = 'r7-9800x3d', BASE_GPU = 'rtx5070ti';
  const perf = (k, p) => k === 'cpu' ? p.gs : p.score;
  const current = k => D[k].filter(p => p.id !== 'none' && D.suggestable(p));

  /* 状態のラベル */
  function badges(p) {
    const b = [];
    if (p.used) b.push(['warn', '中古']);
    if (p.legacy) b.push(['warn', '旧世代（中古が中心）']);
    if (p.priceUnverified) b.push(['warn', '価格未確認（在庫が少ない・販売終了の可能性）']);
    if (!p.used && !p.legacy && !p.priceUnverified) b.push(['ok', '新品で買える']);
    if (p.unstable) b.push(['warn', '第13・14世代の不安定問題の対象（最新BIOSに）']);
    if (p.bios) b.push(['warn', 'BIOS更新が必要な場合あり']);
    if (p.win11 === false) b.push(['ng', 'Windows 11 公式非対応']);
    return b.map(x => '<span class="badge ' + x[0] + '">' + esc(x[1]) + '</span>').join(' ');
  }

  /* 順位（新品で買えるものの中で） */
  function rank(k, p) {
    const l = current(k).sort((a, b) => perf(k, b) - perf(k, a));
    const i = l.findIndex(x => perf(k, x) <= perf(k, p));
    return { n: l.length, r: i < 0 ? l.length : i + 1, top: l[0] };
  }

  /* 近いライバル（値段が近いもの・性能が近いもの） */
  function rivals(k, p) {
    const l = current(k).filter(x => x.id !== p.id);
    const byPrice = l.slice().sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 3);
    const byPerf = l.slice().sort((a, b) => Math.abs(perf(k, a) - perf(k, p)) - Math.abs(perf(k, b) - perf(k, p))).filter(x => byPrice.indexOf(x) < 0).slice(0, 2);
    return byPrice.concat(byPerf);
  }

  function specRows(k, p) {
    if (k === 'cpu') return [
      ['メーカー', p.b], ['コア数', p.core], ['ソケット', p.sock], ['使えるメモリ', E.platformTypes(p.sock).join(' / ')],
      ['TDP（基本の消費電力）', p.tdp + 'W'], ['最大消費電力の目安', '約' + p.pw + 'W'], ['内蔵グラフィックス', p.igpu === false ? 'なし（グラボが必要）' : 'あり'],
      ['ゲーム性能の目安', p.gs + '（Ryzen 7 9800X3D = 100）'], ['動画編集などの性能の目安', p.mt + '（いちばん速いCPU = 100）']];
    return [
      ['メーカー', p.b], ['VRAM（グラボのメモリ）', p.vram + 'GB'], ['消費電力の目安', '約' + p.tgp + 'W'], ['推奨の電源', p.rec + 'W以上'],
      ['長さ・厚み', '約' + p.len + 'mm ・ ' + p.slots + 'スロット'], ['電源コネクタ', p.conn],
      ['性能の目安', p.score + '（RTX 5090 = 100）']];
  }

  /* どんな使い方に向いているか（このサイトの計算から自動で） */
  function goodFor(k, p) {
    const lines = [];
    const gs = D.games.filter(g => ['apex', 'fortnite', 'cyberpunk', 'mhwilds', 'palworld', 'valorant', 'bf6', 'rivals'].indexOf(g.id) >= 0);
    const B = k === 'gpu' ? { cpu: D.by.cpu[BASE_CPU], gpu: p, mem: D.by.mem['d5-32'] } : { cpu: p, gpu: D.by.gpu[BASE_GPU], mem: D.by.mem['d5-32'] };
    if (k === 'gpu') {
      RES.forEach(([r, rn]) => {
        const ok60 = gs.filter(g => E.fps(g, r, B, { quality: 'high' }).fps >= 60).length;
        const ok144 = gs.filter(g => E.fps(g, r, B, { quality: 'high' }).fps >= 144).length;
        lines.push(rn + '・高画質で、人気ゲーム' + gs.length + '本のうち <b>' + ok60 + '本が60fps以上</b>、' + ok144 + '本が144fps以上');
      });
      if (p.vram <= 8) lines.push('VRAMが' + p.vram + 'GBなので、重いゲームを最高画質・WQHD以上で遊ぶと足りなくなることがあります');
      if (p.vram >= 16) lines.push('VRAMが' + p.vram + 'GBあるので、最高画質やMOD・動画編集にも余裕があります');
    } else {
      const lim = gs.filter(g => { const f = E.fps(g, 1080, B, { quality: 'high' }); return f.cpuF < f.gpuF * 0.95; }).length;
      lines.push('RTX 5070 Ti と組み合わせると、フルHDで ' + gs.length + '本のうち <b>' + lim + '本がCPUの速さで頭打ち</b>（数が少ないほど、速いグラボの力を出し切れます）');
      lines.push(p.mt >= 75 ? 'コア数が多く、動画編集・配信もしながらのゲームに向いています' : p.mt >= 50 ? 'ゲームと配信・軽い動画編集なら十分です' : '本格的な動画編集には、もっとコア数の多いCPUがおすすめです');
      if (p.igpu !== false) lines.push('内蔵グラフィックスがあるので、グラボが壊れたときも画面を映せます');
    }
    return lines;
  }

  /* ゲームごとのfps（3つの解像度・高画質）と、公式スペックの判定 */
  function fpsTable(k, p) {
    const B = k === 'gpu' ? { cpu: D.by.cpu[BASE_CPU], gpu: p, mem: D.by.mem['d5-32'] } : { cpu: p, gpu: D.by.gpu[BASE_GPU], mem: D.by.mem['d5-32'] };
    return '<div class="tbl-wrap"><table class="t"><thead><tr><th>ゲーム</th>' + RES.map(r => '<th>' + r[1] + '</th>').join('') + '<th>公式スペック</th></tr></thead><tbody>' +
      D.games.map(g => {
        const rq = E.req(g, B), L = E.REQ_LABEL[rq.lv];
        return '<tr><td>' + esc(g.name) + '</td>' + RES.map(([r]) => { const f = E.fps(g, r, B, { quality: 'high' }); return '<td><b>' + Math.round(f.fps) + '</b>' + (f.cpuF < f.gpuF * 0.95 ? '<span class="muted" title="CPUの速さで頭打ち">*</span>' : '') + '</td>'; }).join('') +
          '<td>' + (rq.lv === 'none' ? '—' : '<span class="badge ' + L.c + '">' + L.mk + ' ' + (rq.lv === 'rec' ? '推奨以上' : rq.lv === 'min' ? '最低以上' : '最低未満') + '</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  /* 一緒に使うパーツの目安 */
  function pairing(k, p) {
    if (k === 'cpu') {
      const mbs = D.mb.filter(m => m.sock === p.sock && !m.real);
      const chips = Array.from(new Set(mbs.map(m => m.chip)));
      const cool = D.cooler.filter(c => !c.real && c.tdpMax >= p.pw).sort((a, b) => a.price - b.price)[0];
      return '<ul><li><b>マザーボード</b>: ソケット ' + esc(p.sock) + '（' + esc(chips.join('・')) + ' など）</li>' +
        '<li><b>メモリ</b>: ' + esc(E.platformTypes(p.sock).join(' または ')) + '</li>' +
        '<li><b>CPUクーラー</b>: ' + (cool ? esc(cool.name) + ' 以上の冷却力（最大 約' + p.pw + 'W）' : '大型の空冷か水冷') + '</li>' +
        (p.igpu === false ? '<li><b>グラボ</b>: 内蔵グラフィックスがないので、グラボが必ず必要です</li>' : '') + '</ul>';
    }
    const psu = D.psu.filter(x => !x.real && x.form === 'ATX' && x.w >= p.rec && (p.conn !== '12V-2x6' || x.atx3)).sort((a, b) => a.price - b.price)[0];
    return '<ul><li><b>電源</b>: ' + p.rec + 'W以上' + (psu ? '（例: ' + esc(psu.name) + '）' : '') + (p.conn === '12V-2x6' ? '。12V-2x6コネクタなので、ATX 3.x の電源だと直接つながります' : '') + '</li>' +
      '<li><b>ケース</b>: グラボの長さ 約' + p.len + 'mm が入るもの（' + p.slots + 'スロット分の厚み）</li>' +
      '<li><b>CPU</b>: 相性は <a href="' + '{BASE}' + '#/match">CPUとグラボの相性表</a> で確認できます</li></ul>';
  }

  /* 本体 */
  /* CPUとグラボの相性（◎○△✕）。WQHD・高画質・代表的なゲームで判定 */
  const PAIR_GPU = ['rtx5050', 'rtx5060', 'rx9060xt', 'rtx5060ti', 'rtx5070', 'rx9070', 'rx9070xt', 'rtx5070ti', 'rtx5080', 'rtx5090'];
  const PAIR_CPU = ['r5-5500', 'r5-5600', 'i5-14400f', 'r5-7500f', 'cu5-225f', 'r5-9600x', 'r7-9700x', 'i7-14700f', 'cu7-265k', 'r7-7800x3d', 'r7-9800x3d'];
  const tag = j => '<span class="m-key sm ' + j.c + '"><b>' + j.mk + '</b>' + esc(j.t) + '</span>';
  function pairSec(k, p, link, base) {
    if (k === 'gpu' && p.id === 'none') return '';
    const pt = E.partners(k, p);
    const list = (k === 'gpu' ? PAIR_CPU : PAIR_GPU).map(id => D.by[k === 'gpu' ? 'cpu' : 'gpu'][id]).filter(Boolean)
      .map(x => ({ p: x, j: k === 'gpu' ? E.pair(x, p) : E.pair(p, x) })).filter(x => x.j);
    const ok = pt.best.slice(0, 4);
    let h = '<div class="card sp"><h2>' + (k === 'gpu' ? 'CPUとの相性' : 'グラボとの相性') + '</h2>';
    if (pt.limit) h += '<p>' + (k === 'gpu' ? '<b>' + esc(pt.limit.name) + '</b>（ゲーム性能 ' + pt.limit.gs + '）くらい以上のCPUなら、このグラボの力を出し切れます。' : 'このCPUなら、<b>' + esc(pt.limit.name) + '</b>（性能 ' + pt.limit.score + '）くらいまでのグラボの力を出し切れます。それより上のグラボは、CPUが先に限界になりやすくなります。') + '</p>';
    if (k === 'gpu' && ok.length) h += '<p class="muted">◎か○になる、いちばん安いCPU: ' + ok.map(x => '<a href="' + link('cpu', x.p.id) + '">' + esc(x.p.name) + '</a>（' + yen(x.p.price) + '）').join('、') + '</p>';
    h += '<div class="tbl-wrap"><table class="t"><thead><tr><th>' + (k === 'gpu' ? 'CPU' : 'グラボ') + '</th><th>相性</th><th>価格</th></tr></thead><tbody>' +
      list.map(x => '<tr><td><a href="' + link(k === 'gpu' ? 'cpu' : 'gpu', x.p.id) + '">' + esc(x.p.name) + '</a></td><td>' + tag(x.j) + '</td><td>' + yen(x.p.price) + '</td></tr>').join('') + '</tbody></table></div>' +
      '<p class="muted">◎ ぴったり ／ ○ 問題なし（グラボの性能でfpsが決まる）／ △ CPUやや不足 ／ ✕ CPU不足。WQHD・高画質・代表的なゲーム' + E.PAIR_GAMES.length + '本で判定した目安です。<a href="' + base + '#/match">相性表でゲーム・解像度を変えて見る</a></p></div>';
    return h;
  }

  function html(k, p, opt) {
    opt = opt || {};
    const base = opt.base || '';
    const rk = rank(k, p);
    const rv = rivals(k, p);
    const ids = E.complete(k === 'cpu' ? { cpu: p.id, gpu: BASE_GPU } : { cpu: BASE_CPU, gpu: p.id }, {});
    const q = E.idsToQuery ? E.idsToQuery(ids) : Object.keys(ids).map(x => x + '=' + ids[x]).join('&');
    const H = (window.PCR_HISTORY || {})[k] && window.PCR_HISTORY[k][p.id];
    const chk = (D.priceChecked && D.priceChecked[k] && D.priceChecked[k][p.id]) || D.priceDate || CFG.dataDate;
    const kind = k === 'cpu' ? 'CPU' : 'グラフィックボード';
    let h = '<article class="part-page">' +
      '<p class="muted">' + kind + '</p><h1>' + esc(p.name) + '</h1><p>' + badges(p) + '</p>' +
      '<div class="grid g2 sp"><div class="card"><div class="muted">価格の目安' + (p.used ? '（中古）' : '') + '</div><div class="total">' + yen(p.price) + '</div><div class="muted">' + (p.priceUnverified ? '価格を確認できていません' : '確認日 ' + esc(chk)) + '</div>' +
      (H && H.length > 1 ? '<div class="muted">記録: ' + H.length + '回（いちばん安かったとき ' + yen(Math.min(...H.map(x => x[1]))) + '）</div>' : '') +
      '<div class="row sp">' + (opt.shopLinks || '') + '</div></div>' +
      '<div class="card"><div class="muted">' + (k === 'cpu' ? 'ゲーム性能' : '性能') + 'の順位（新品で買える ' + rk.n + ' 個の中で）</div><div class="total">' + rk.r + '位</div>' +
      '<div class="pp-bar"><i style="width:' + Math.round(perf(k, p) / perf(k, rk.top) * 100) + '%"></i></div><div class="muted">いちばん速い ' + esc(rk.top.name) + ' を100としたとき <b>' + Math.round(perf(k, p) / perf(k, rk.top) * 100) + '</b></div>' +
      '<div class="row sp"><a class="btn sm" href="' + base + '#/build?' + q + '">このパーツで組む</a><a class="btn sub sm" href="' + base + '#/vs?add=' + k + ':' + esc(p.id) + '">くらべるに追加</a></div></div></div>' +
      '<div class="card sp"><h2>向いている使い方</h2><ul>' + goodFor(k, p).map(x => '<li>' + x + '</li>').join('') + '</ul><p class="muted">このサイトの計算モデルによる目安です。' + (k === 'gpu' ? 'CPUは Ryzen 7 9800X3D、' : 'グラボは RTX 5070 Ti、') + 'メモリ32GBで計算しています。</p></div>' +
      '<div class="card sp"><h2>仕様</h2><table class="t"><tbody>' + specRows(k, p).map(r => '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>').join('') + '</tbody></table>' +
      '<p class="muted">仕様はメーカーの公表値、性能の目安は Tom\'s Hardware の階層表などの公開ベンチマークに合わせた相対値です。購入前にメーカーの製品ページで確認してください。</p></div>' +
      '<div class="card sp"><h2>ライバルとの比較</h2><div class="tbl-wrap"><table class="t"><thead><tr><th></th><th>価格</th><th>' + (k === 'cpu' ? 'ゲーム性能' : '性能') + '</th><th>性能÷価格</th></tr></thead><tbody>' +
      [p].concat(rv).map(x => { const v = perf(k, x) / x.price * 10000; return '<tr' + (x === p ? ' class="vs-best"' : '') + '><td>' + (x === p ? '<b>' + esc(x.name) + '</b>（このパーツ）' : '<a href="' + (opt.static ? k + '-' + esc(x.id) + '.html' : base + '#/part/' + k + '/' + esc(x.id)) + '">' + esc(x.name) + '</a>') + '</td><td>' + yen(x.price) + '</td><td>' + perf(k, x) + '</td><td>' + v.toFixed(1) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted">「性能÷価格」は、1万円あたりの性能です。大きいほどお得です。</p></div>' +
      pairSec(k, p, (kk, id) => opt.static ? kk + '-' + esc(id) + '.html' : base + '#/part/' + kk + '/' + esc(id), base) +
      '<div class="card sp"><h2>ゲームごとのfpsの目安（高画質）</h2>' + fpsTable(k, p) + '<p class="muted">* はCPUの速さで頭打ちになっているゲームです。公式スペックは、Steamなどの公式発表と比べた判定です。</p></div>' +
      '<div class="card sp"><h2>一緒に使うパーツの目安</h2>' + pairing(k, p).replace(/\{BASE\}/g, base) + '</div>' +
      '</article>';
    return h;
  }
  return { html: html, rank: rank, badges: badges };
})();
