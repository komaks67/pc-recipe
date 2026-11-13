/* ============================================================
   CPUとグラボの相性表（どちらが性能の上限を決めているか）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };

  /* r = CPU側の上限fps ÷ グラボ側の上限fps
     r が小さい → CPUが先に限界（グラボの力を出し切れない） */
  function judge(r) {
    if (r < 0.75) return { c: 'm-ng', t: 'CPU不足', mk: '✕', msg: 'CPUの力が足りず、グラボの性能をかなり出し切れません。もっと速いCPUにするか、グラボを1つ下げても同じくらいのfpsになります。' };
    if (r < 0.95) return { c: 'm-warn', t: 'CPUやや不足', mk: '△', msg: 'CPUが少し先に限界になります。設定を上げる（画質・解像度）と、グラボの力を活かせます。' };
    if (r <= 1.8) return { c: 'm-ok', t: 'ぴったり', mk: '◎', msg: 'CPUとグラボのバランスが良く、どちらもムダになりにくい組み合わせです。' };
    return { c: 'm-gpu', t: '問題なし', mk: '○', msg: 'グラボの性能でfpsが決まる、ゲーム用PCではふつうの状態です。CPUには余裕があるので、将来グラボだけ交換しても力を出せます。' };
  }
  // 「主なCPU」: ゲーム性能の幅が広くなるよう、価格を確認できたCPUから選ぶ
  const MAIN_CPU = ['r5-5500', 'r5-5600', 'r7-5700x', 'i5-14400f', 'r5-7500f', 'r5-9600x', 'cu5-225f', 'r7-9700x', 'i7-14700f', 'cu7-265k', 'r7-7800x3d', 'r7-9800x3d', 'r9-9950x3d'];

  U.route('/match', 'CPUとグラボの相性表', function (el, q) {
    const st = {
      game: D.by.games[q.get('g')] ? q.get('g') : 'apex',
      res: [1080, 1440, 2160].indexOf(+q.get('r')) >= 0 ? +q.get('r') : 1080,
      quality: E.QUALITY[q.get('q')] ? q.get('q') : 'high',
      allCpu: q.get('all') === '1', used: q.get('used') === '1', sel: null
    };
    el.innerHTML = '<h1>CPUとグラボの相性表</h1>' +
      '<p class="muted tipify">CPUとグラボの組み合わせごとに、相性を<b>◎ ○ △ ✕</b>の4段階で表しています（◎がいちばん良い）。マスの数字は目安のfpsです。マスを押すと、くわしい説明と「この組み合わせで組む」ボタンが出ます。</p>' +
      '<div class="card no-print"><div class="grid g2 filt"><div><label class="f">ゲーム</label><select id="mg">' + D.games.map(g => '<option value="' + g.id + '">' + esc(g.name) + '</option>').join('') + '</select></div>' +
      '<div><label class="f">画面の解像度</label><div class="chips" id="mr">' + [1080, 1440, 2160].map(r => '<label class="chip"><input type="radio" name="mr" value="' + r + '"><span>' + RES[r] + '</span></label>').join('') + '</div></div></div>' +
      '<label class="f sp">画質（ゲームの設定）</label>' + U.qualityChips('mq', st.quality) +
      '<div class="row sp"><label class="chip"><input type="checkbox" id="mall"><span>CPUをすべて表示</span></label><label class="chip"><input type="checkbox" id="mused"><span>中古のグラボも表示</span></label></div></div>' +
      '<div class="m-legend sp" aria-label="記号の意味">' + [[1.2], [2.5], [0.85], [0.5]].map(v => { const j = judge(v[0]); return '<span class="m-key ' + j.c + '"><b>' + j.mk + '</b>' + j.t + '</span>'; }).join('') + '</div>' +
      '<div id="mtab" class="sp"></div><div id="mdet" class="sp" aria-live="polite"></div>' +
      '<div class="card flat sp2 tipify"><h3>この表の見方</h3><ul>' +
      '<li><b>◎ ぴったり</b>：CPUとグラボのバランスが良い組み合わせです。</li>' +
      '<li><b>○ 問題なし</b>：グラボの性能でfpsが決まります。CPUには余裕があり、ゲーム用PCではふつうの状態です。</li>' +
      '<li><b>△ CPUやや不足 ／ ✕ CPU不足</b>：CPUが先に限界になり、高いグラボの力が余ります。お金をかけるならCPUを先に上げましょう。</li>' +
      '<li>解像度や画質を上げる（フルHD → 4K、低 → 最高）と、グラボの負担が増えるので、CPU不足は起きにくくなります。画質を下げてfpsを稼ぐときは、CPUの速さが大事になります。</li>' +
      '<li>数字は<b>計算モデルによる目安</b>で、実測ではありません。メモリ32GBで計算しています。</li></ul></div>';
    $('#mg', el).value = st.game;
    $('input[name=mr][value="' + st.res + '"]', el).checked = true;
    $('#mall', el).checked = st.allCpu; $('#mused', el).checked = st.used;

    function lists() {
      const cpus = D.cpu.filter(c => st.allCpu ? D.suggestable(c) : MAIN_CPU.indexOf(c.id) >= 0).sort((a, b) => a.gs - b.gs || a.price - b.price);
      const gpus = D.gpu.filter(g => g.id !== 'none' && (D.suggestable(g) || (st.used && g.used))).sort((a, b) => a.score - b.score || a.price - b.price);
      return { cpus, gpus };
    }
    function cell(cpu, gpu) {
      const g = D.by.games[st.game];
      const f = E.fps(g, st.res, { cpu: cpu, gpu: gpu, mem: D.by.mem['d5-32'] }, { quality: st.quality });
      return { f: f, j: judge(f.cpuF / f.gpuF) };
    }
    function draw() {
      const { cpus, gpus } = lists();
      const h = '<div class="tbl-wrap m-wrap"><table class="m-tab"><caption class="sr">' + esc(D.by.games[st.game].name) + '（' + RES[st.res] + '）のCPUとグラボの相性表</caption>' +
        '<thead><tr><th scope="col" class="m-corner">CPU ＼ グラボ</th>' + gpus.map(g => '<th scope="col"><span>' + esc(g.name.replace('GeForce ', '').replace('Radeon ', '').replace('Intel ', '')) + (g.used ? '<em>中古</em>' : '') + '</span></th>').join('') + '</tr></thead><tbody>' +
        cpus.map(c => '<tr><th scope="row">' + esc(c.name.replace('Core ', '')) + '</th>' + gpus.map(g => {
          const x = cell(c, g);
          const on = st.sel && st.sel[0] === c.id && st.sel[1] === g.id;
          return '<td><button type="button" class="m-c ' + x.j.c + (on ? ' on' : '') + '" data-c="' + c.id + '" data-g="' + g.id + '" aria-label="' + esc(c.name + ' と ' + g.name + '：' + x.j.t + '、約' + Math.round(x.f.fps) + 'fps') + '" title="' + esc(c.name + ' × ' + g.name + '\n' + x.j.t + '・約' + Math.round(x.f.fps) + 'fps') + '"><b>' + x.j.mk + '</b>' + Math.round(x.f.fps) + '</button></td>';
        }).join('') + '</tr>').join('') + '</tbody></table></div>' +
        '<p class="muted">' + esc(D.by.games[st.game].name) + '・' + RES[st.res] + '・' + E.QUALITY[st.quality].t + '画質　／　CPU ' + cpus.length + '個 × グラボ ' + gpus.length + '個。左右にスクロールできます。</p>';
      $('#mtab', el).innerHTML = h;
      detail();
      history.replaceState(null, '', '#/match?g=' + st.game + '&r=' + st.res + '&q=' + st.quality + (st.allCpu ? '&all=1' : '') + (st.used ? '&used=1' : ''));
    }
    function detail() {
      const box = $('#mdet', el);
      if (!st.sel) { box.innerHTML = ''; return; }
      const c = D.by.cpu[st.sel[0]], g = D.by.gpu[st.sel[1]], x = cell(c, g);
      const ids = E.complete({ cpu: c.id, gpu: g.id }, {});
      const ev = E.evaluate(ids, U.prefs());
      box.innerHTML = '<div class="card"><h2>' + esc(c.name) + ' × ' + esc(g.name) + '</h2>' +
        '<p><span class="m-key ' + x.j.c + '"><b>' + x.j.mk + '</b>' + x.j.t + '</span>　' + esc(D.by.games[st.game].name) + '（' + RES[st.res] + '）で <b>約' + Math.round(x.f.fps) + 'fps</b></p>' +
        '<p>' + x.j.msg + '</p>' +
        '<p class="muted">CPU側の上限 約' + Math.round(x.f.cpuF) + 'fps ／ グラボ側の上限 約' + Math.round(x.f.gpuF) + 'fps' + (D.by.games[st.game].cap ? '（このゲームのfps上限 ' + D.by.games[st.game].cap + 'fps）' : '') + '</p>' +
        '<p class="muted">CPU ' + yen(c.price) + ' ＋ グラボ ' + yen(g.price) + (g.used ? '（中古）' : '') + '　／　この2つで組んだときの合計の目安 <b>' + yen(ev.total) + '</b></p>' +
        '<div class="row"><a class="btn" href="#/build?' + U.idsToQuery(ids) + '">この組み合わせで組む</a><button class="btn sub" type="button" id="mx">閉じる</button></div></div>';
      $('#mx', el).onclick = () => { st.sel = null; draw(); };
    }
    el.addEventListener('change', e => {
      if (e.target.id === 'mg') st.game = e.target.value;
      else if (e.target.name === 'mr') st.res = +e.target.value;
      else if (e.target.name === 'mq') st.quality = e.target.value;
      else if (e.target.id === 'mall') st.allCpu = e.target.checked;
      else if (e.target.id === 'mused') st.used = e.target.checked;
      else return;
      draw();
    });
    el.addEventListener('click', e => {
      const b = e.target.closest('.m-c'); if (!b) return;
      st.sel = [b.dataset.c, b.dataset.g]; draw();
      $('#mdet', el).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    draw();
  }, '/compare');
})();
