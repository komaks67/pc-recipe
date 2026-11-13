/* ============================================================
   診断ウィザード / アップグレード診断 / ゲーム別fps
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };

  /* ============================================================
     診断ウィザード
     ============================================================ */
  const W = { step: 0, purposes: ['game'], games: ['apex', 'valorant'], res: 1080, target: 144, edit: 'fhd', budget: 250000, size: 'mid', quiet: false, os: true };

  function stepsList() {
    const s = ['purpose'];
    if (W.purposes.indexOf('game') >= 0) s.push('game');
    if (W.purposes.indexOf('edit') >= 0) s.push('edit');
    s.push('budget', 'style', 'result');
    return s;
  }
  const optCard = (type, name, val, checked, title, desc) => '<label class="opt-card"><input type="' + type + '" name="' + name + '" value="' + val + '"' + (checked ? ' checked' : '') + '><div class="in"><b>' + title + '</b><div class="muted">' + desc + '</div></div></label>';

  U.route('/wizard', '診断ウィザード', function (el) {
    const root = document.createElement('div'); el.appendChild(root);
    draw();

    function draw() {
      const steps = stepsList();
      if (W.step >= steps.length) W.step = steps.length - 1;
      const cur = steps[W.step];
      const pct = Math.round(W.step / (steps.length - 1) * 100);
      let h = '<h1>用途・予算で診断</h1><div class="prog" aria-label="進み具合"><i style="width:' + pct + '%"></i></div><div class="wiz-step tipify">';
      if (cur === 'purpose') {
        h += '<h2>1. このパソコンで何をしたいですか？（いくつでもOK）</h2><div class="grid g2">' +
          optCard('checkbox', 'p', 'game', W.purposes.indexOf('game') >= 0, '🎮 ゲームをする', 'FPS・オープンワールドなど') +
          optCard('checkbox', 'p', 'stream', W.purposes.indexOf('stream') >= 0, '📡 ゲーム配信をする', 'ゲームをしながら配信・録画（ゲームも含みます）') +
          optCard('checkbox', 'p', 'edit', W.purposes.indexOf('edit') >= 0, '🎬 動画編集をする', 'YouTube・思い出動画など') +
          optCard('checkbox', 'p', 'office', W.purposes.indexOf('office') >= 0, '📄 勉強・事務・ネット', '高性能なグラボは不要です') + '</div>';
      } else if (cur === 'game') {
        h += '<h2>2. 遊ぶゲームと、どのくらい滑らかに遊びたいか</h2><label class="f">遊ぶゲーム（いくつでも）</label><div class="chips" id="w-games">' +
          D.games.map(g => '<label class="chip"><input type="checkbox" value="' + g.id + '"' + (W.games.indexOf(g.id) >= 0 ? ' checked' : '') + '><span>' + esc(g.name.replace(/ \(.*\)$/, '')) + '</span></label>').join('') + '</div>' +
          '<label class="f sp">モニターの解像度</label><div class="grid g3">' +
          optCard('radio', 'res', '1080', W.res === 1080, 'フルHD', '1920×1080。いちばん軽い') + optCard('radio', 'res', '1440', W.res === 1440, 'WQHD', '2560×1440。バランス型') + optCard('radio', 'res', '2160', W.res === 2160, '4K', '3840×2160。とても重い') + '</div>' +
          '<label class="f sp">目標のfps（モニターのリフレッシュレートに合わせる）</label><div class="grid g3">' +
          optCard('radio', 'tg', '60', W.target === 60, '60fps', 'ふつうの滑らかさ') + optCard('radio', 'tg', '144', W.target === 144, '144fps', 'FPSなどで人気') + optCard('radio', 'tg', '240', W.target === 240, '240fps', '競技志向。要求は高め') + '</div>';
      } else if (cur === 'edit') {
        h += '<h2>3. 動画編集の画質は？</h2><div class="grid g2">' + optCard('radio', 'ed', 'fhd', W.edit === 'fhd', 'フルHD(1080p)', '一般的なYouTube動画') + optCard('radio', 'ed', '4k', W.edit === '4k', '4K', 'データが大きく、CPUとメモリが重要') + '</div>';
      } else if (cur === 'budget') {
        h += '<h2>予算はどのくらいですか？（パソコン本体の合計）</h2><div class="total" id="w-bv">' + yen(W.budget) + '</div><input type="range" id="w-budget" min="100000" max="600000" step="10000" value="' + W.budget + '" aria-label="予算">' +
          '<div class="row sp"><button class="btn sub sm" data-b="150000">15万</button><button class="btn sub sm" data-b="250000">25万</button><button class="btn sub sm" data-b="350000">35万</button><button class="btn sub sm" data-b="500000">50万</button></div>' +
          '<div class="sp"><label class="chip"><input type="checkbox" id="w-os"' + (W.os ? ' checked' : '') + '><span>Windows 11 を予算に含める</span></label></div>' +
          '<p class="muted">モニター・キーボード・マウスは含みません。' + (CFG.priceIsPlaceholder ? 'パーツ価格は仮の目安のため、実際の金額とは差があります。' : '') + '</p>';
      } else if (cur === 'style') {
        h += '<h2>最後に、大きさと静かさ</h2><div class="grid g2">' +
          optCard('radio', 'sz', 'mini', W.size === 'mini', '小型（Mini-ITX）', '机の上に置ける。入るGPUに制限あり') + optCard('radio', 'sz', 'compact', W.size === 'compact', 'コンパクト', 'Micro-ATX。省スペース') +
          optCard('radio', 'sz', 'mid', W.size === 'mid', '標準（ミドルタワー）', 'おすすめ。部品が入れやすい') + optCard('radio', 'sz', 'large', W.size === 'large', '大型（フルタワー）', '最強構成や水冷向け') + '</div>' +
          '<div class="sp"><label class="chip"><input type="checkbox" id="w-quiet"' + (W.quiet ? ' checked' : '') + '><span>音が静かなほうがいい</span></label></div>';
      } else {
        h += resultHtml();
      }
      h += '</div>';
      if (cur !== 'result') {
        h += '<div class="row sp2"><button class="btn sub" id="w-back"' + (W.step === 0 ? ' disabled' : '') + '>← 戻る</button><button class="btn" id="w-next">' + (steps[W.step + 1] === 'result' ? '診断結果を見る →' : '次へ →') + '</button></div>';
      } else {
        h += '<div class="row sp2"><button class="btn sub" id="w-back">← 条件を変える</button><button class="btn sub" id="w-again">最初からやり直す</button></div>';
      }
      root.innerHTML = h;
      U.tipify(root);
      bind(cur);
    }

    function bind(cur) {
      const next = $('#w-next', root), back = $('#w-back', root);
      if (next) next.onclick = () => { if (cur === 'purpose' && !W.purposes.length) { U.toast('ひとつ以上えらんでください'); return; } if (cur === 'game' && !W.games.length) { U.toast('ゲームをひとつ以上えらんでください'); return; } W.step++; draw(); window.scrollTo(0, 0); };
      if (back) back.onclick = () => { W.step = Math.max(0, W.step - 1); draw(); window.scrollTo(0, 0); };
      const again = $('#w-again', root); if (again) again.onclick = () => { W.step = 0; draw(); window.scrollTo(0, 0); };
      if (cur === 'purpose') $$('input[name=p]', root).forEach(i => i.onchange = () => {
        W.purposes = $$('input[name=p]:checked', root).map(x => x.value);
        if (W.purposes.indexOf('stream') >= 0 && W.purposes.indexOf('game') < 0) { W.purposes.push('game'); $('input[value=game]', root).checked = true; }
      });
      if (cur === 'game') {
        $$('#w-games input', root).forEach(i => i.onchange = () => { W.games = $$('#w-games input:checked', root).map(x => x.value); });
        $$('input[name=res]', root).forEach(i => i.onchange = () => { W.res = +i.value; });
        $$('input[name=tg]', root).forEach(i => i.onchange = () => { W.target = +i.value; });
      }
      if (cur === 'edit') $$('input[name=ed]', root).forEach(i => i.onchange = () => { W.edit = i.value; });
      if (cur === 'budget') {
        const r = $('#w-budget', root), v = $('#w-bv', root);
        r.oninput = () => { W.budget = +r.value; v.textContent = yen(W.budget); };
        $$('[data-b]', root).forEach(b => b.onclick = () => { W.budget = +b.dataset.b; r.value = W.budget; v.textContent = yen(W.budget); });
        $('#w-os', root).onchange = e => { W.os = e.target.checked; };
      }
      if (cur === 'style') {
        $$('input[name=sz]', root).forEach(i => i.onchange = () => { W.size = i.value; });
        $('#w-quiet', root).onchange = e => { W.quiet = e.target.checked; };
      }
      if (cur === 'result') {
        $$('[data-save]', root).forEach(b => b.onclick = () => {
          const p = PLANS[+b.dataset.save]; const r = U.saveBuild('診断: ' + p.label + ' (' + new Date().toLocaleDateString('ja-JP') + ')', p.rec.ids, 'build'); U.toast(r.ok ? '保存しました' : r.msg);
        });
      }
    }

    let PLANS = [];
    function resultHtml() {
      const game = W.purposes.indexOf('game') >= 0 && W.games.length > 0;
      const o = { budget: W.budget, game: game, games: game ? W.games : [], res: W.res, target: W.target, edit: W.purposes.indexOf('edit') >= 0 ? W.edit : 'none', stream: W.purposes.indexOf('stream') >= 0, size: W.size, quiet: W.quiet, os: W.os };
      // 節約: 予算の8割 / おすすめ: 目標より少し余裕 / ゆとり: 予算を上乗せして、目標の約1.5倍のfpsを狙う
      const plans = [['節約プラン', 0.8, 1, '少し予算をおさえたい人向け。目標ぎりぎりを狙います'], ['おすすめ', 1, 1.15, '目標に少し余裕を持たせた、バランスの良い構成'], ['ゆとりプラン', 1.25, 1.5, '予算を上乗せして、新しいゲームにも余裕を持たせる構成']];
      PLANS = plans.map(p => {
        const rec = E.autoBuild(Object.assign({}, o, { budget: Math.round(W.budget * p[1] / 10000) * 10000, target: o.target * p[2], head: p[2] }));
        rec.sat = E.satisfaction(rec.ev.B, o);   // 判定は、元の目標で行う
        return { label: p[0], rate: p[1], desc: p[3], rec: rec };
      });
      const c = Object.assign(U.prefs(), { res: W.res, games: o.games.length ? o.games : U.prefs().games, stream: o.stream });
      const why = [];
      if (game) why.push('ゲームは <b>' + RES[W.res] + ' ' + W.target + 'fps</b> を目標に、GPUを中心に選びました。');
      if (o.stream) why.push('配信があるので、CPUのコア数とメモリ(32GB以上)に余裕を持たせています。');
      if (o.edit !== 'none') why.push('動画編集(' + (o.edit === '4k' ? '4K' : 'フルHD') + ')のため、CPUのコア数とSSD容量を重視しました。');
      if (!game && o.edit === 'none' && !o.stream) why.push('事務・学習用なので、グラフィックボードなしの構成にしています（費用をおさえられます）。');
      let h = '<h2>診断結果</h2><div class="card flat">' + why.map(x => '<p>' + x + '</p>').join('') + '<p class="muted">予算 ' + yen(W.budget) + '。fpsは計算モデルによる目安で、実測ではありません。</p></div><div class="grid g3 sp">';
      // 同じ構成になったプランは、ひとつにまとめる
      const groups = [];
      PLANS.forEach((p, i) => {
        const key = JSON.stringify(p.rec.ids), g = groups.find(x => x.key === key);
        if (g) { g.labels.push(p.label); g.star = g.star || i === 1; } else groups.push({ key: key, labels: [p.label], star: i === 1, p: p, i: i });
      });
      if (groups.length === 1) h = h.replace('<div class="grid g3 sp">', '<div class="chk ok sp"><span class="mk">✓</span><div>この条件では、予算を変えても同じ構成になりました（目標に対して、ちょうどよい構成です）。</div></div><div class="grid g3 sp">');
      groups.forEach(gr => {
        const p = gr.p, i = gr.i;
        const r = p.rec, ev = r.ev, ids = r.ids, B = ev.B;
        const sat = r.sat, verdict = sat >= 1 ? ['ok', '目標を満たす見込み'] : sat >= 0.85 ? ['warn', 'ほぼ目標に近い'] : ['ng', '目標には届きません'];
        const ev2 = E.evaluate(ids, c);
        h += '<div class="card"><div class="row" style="justify-content:space-between"><h3>' + gr.labels.join('・') + (gr.star ? ' ⭐' : '') + '</h3><span class="badge ' + verdict[0] + '">' + (game || o.edit !== 'none' ? verdict[1] : '用途に十分') + '</span></div>' +
          '<div class="total">' + yen(ev.total) + '</div><div class="muted">' + (gr.labels.length > 1 ? 'どの予算でも、この構成がちょうどよい見込みです' : p.desc) + '</div>' + (r.over ? '<div class="chk warn sp"><span class="mk">!</span><div>この予算では組めなかったため、条件を満たす中でいちばん安い構成です。</div></div>' : '') +
          '<table class="t sp"><tbody>' + ['cpu', 'gpu', 'mem', 'ssd', 'mb', 'psu', 'case', 'cooler'].map(k => '<tr><th>' + E.LABEL[k] + '</th><td>' + esc(B[k].name) + '</td></tr>').join('') + '</tbody></table>' +
          (ev2.fpsRows.length && game ? '<div class="sp">' + ev2.fpsRows.map(f => '<div class="row" style="justify-content:space-between;font-size:.9rem"><span>' + esc(f.game.name.replace(/ \(.*\)$/, '')) + '</span><b>約' + Math.round(f.fps) + 'fps</b></div>').join('') + '</div>' : '') +
          '<div class="row sp"><a class="btn sm" href="#/build?' + U.idsToQuery(ids) + '">自作で組む</a><a class="btn sub sm" href="#/bto?cpu=' + ids.cpu + '&gpu=' + ids.gpu + '&mem=' + ids.mem + '&ssd=' + ids.ssd + '&size=' + W.size + (W.quiet ? '&quiet=1' : '') + '">BTOで探す</a><button class="btn sub sm" data-save="' + i + '">保存</button></div></div>';
      });
      h += '</div><p class="muted sp">「自作で組む」では細かくパーツを変えられます。「BTOで探す」では、ショップで選ぶ目安と、メーカー比較が見られます。</p>';
      return h;
    }
  });

  /* ============================================================
     既存PCからのアップグレード診断
     ============================================================ */
  U.route('/upgrade', 'アップグレード診断', function (el) {
    const p = U.prefs();
    const st = { cpu: 'o-i5-12400', gpu: 'g-3060', memGB: 16, psuW: 550, res: p.res === 2160 ? 1440 : p.res, games: p.games.slice(0, 4), target: 100 };
    el.innerHTML = '<h1>今のPCからのアップグレード診断</h1><p class="muted tipify">今使っているパーツを選ぶと、「どこを替えると効果が大きいか」を診断します。</p>' +
      '<div class="build"><div><div class="card"><div class="grid g2">' +
      '<div><label class="f">今のCPU</label><select id="u-cpu">' + D.oldCpu.map(x => '<option value="' + x.id + '">' + esc(x.name) + '</option>').join('') + '</select></div>' +
      '<div><label class="f">今のグラフィックボード</label><select id="u-gpu">' + D.oldGpu.map(x => '<option value="' + x.id + '">' + esc(x.name) + '</option>').join('') + '</select></div>' +
      '<div><label class="f">今のメモリ</label><select id="u-mem">' + [8, 16, 32, 64].map(x => '<option value="' + x + '">' + x + 'GB</option>').join('') + '</select></div>' +
      '<div><label class="f">今の電源の容量</label><select id="u-psu">' + [450, 500, 550, 650, 750, 850, 1000].map(x => '<option value="' + x + '">' + x + 'W</option>').join('') + '</select></div></div>' +
      '<label class="f sp">遊ぶゲーム</label><div class="chips" id="u-games">' + D.games.map(g => '<label class="chip"><input type="checkbox" value="' + g.id + '"><span>' + esc(g.name.replace(/ \(.*\)$/, '')) + '</span></label>').join('') + '</div>' +
      '<div class="grid g2 sp"><div><label class="f">解像度</label><select id="u-res"><option value="1080">フルHD</option><option value="1440">WQHD</option><option value="2160">4K</option></select></div>' +
      '<div><label class="f">目標のfps</label><select id="u-tg"><option>60</option><option>100</option><option>144</option><option>240</option></select></div></div></div></div>' +
      '<div class="sticky"><div id="u-out"></div></div></div>';
    $('#u-cpu', el).value = st.cpu; $('#u-gpu', el).value = st.gpu; $('#u-mem', el).value = st.memGB; $('#u-psu', el).value = st.psuW; $('#u-res', el).value = st.res; $('#u-tg', el).value = st.target;
    $$('#u-games input', el).forEach(i => { i.checked = st.games.indexOf(i.value) >= 0; });

    function run() {
      st.cpu = $('#u-cpu', el).value; st.gpu = $('#u-gpu', el).value; st.memGB = +$('#u-mem', el).value; st.psuW = +$('#u-psu', el).value;
      st.res = +$('#u-res', el).value; st.target = +$('#u-tg', el).value; st.games = $$('#u-games input:checked', el).map(i => i.value);
      const out = $('#u-out', el);
      if (!st.games.length) { out.innerHTML = '<div class="card"><p>遊ぶゲームをひとつ以上選んでください。</p></div>'; return; }
      const r = E.upgradeDiag(st), n = st.games.length;
      let h = '<div class="card"><h3>今の構成の目安（' + RES[st.res] + '）</h3><div class="total">平均 約' + Math.round(r.now.avg) + 'fps</div><p>目標 ' + st.target + 'fps に届くゲーム: <b>' + r.now.ok + ' / ' + n + '</b>' + (r.now.cpuLim ? '（うち ' + r.now.cpuLim + ' 本はCPUが先に限界）' : '') + '</p></div>';
      h += '<div class="card sp"><h3>診断</h3>' + r.advice.map(a => '<div class="chk ' + a.lv + '"><span class="mk">' + (a.lv === 'ok' ? '✓' : '!') + '</span><div><b>' + esc(a.t) + '</b>' + esc(a.m) + '</div></div>').join('') + '</div>';
      const gOpts = r.gpuOptions.slice(0, 40);
      const pick = gOpts.filter(o => o.r.ok >= n).slice(0, 1).concat(gOpts.filter(o => o.r.ok < n).slice(-1));
      const showG = gOpts.filter((o, i) => i === 0 || pick.indexOf(o) >= 0 || i < 3).slice(0, 4);
      h += '<div class="card sp"><h3>グラフィックボードだけ替えるなら</h3>' + (showG.length ? '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th><th>平均fps</th><th>目標</th></tr></thead><tbody>' +
        showG.map(o => '<tr><td><b>' + esc(o.gpu.name) + '</b>' + (o.psuNote ? '<br><span class="muted">' + esc(o.psuNote) + '</span>' : '') + (o.r.cpuLim / n >= 0.6 ? '<br><span class="neg">CPUが先に限界になりそう</span>' : '') + '</td><td>' + yen(o.cost) + '</td><td>約' + Math.round(o.r.avg) + '</td><td>' + (o.r.ok >= n ? '<span class="badge ok">達成</span>' : o.r.ok + '/' + n) + '</td></tr>').join('') + '</tbody></table></div>' : '<p>今より大きく性能が上がるGPUがありません。</p>') + '</div>';
      const cOpts = r.cpuOptions.slice(0, 4);
      h += '<div class="card sp"><h3>CPUを替えるなら</h3>' + (cOpts.length ? '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th><th>平均fps</th></tr></thead><tbody>' +
        cOpts.map(o => '<tr><td><b>' + esc(o.cpu.name) + '</b><br><span class="muted">' + esc(o.note) + '</span></td><td>' + yen(o.cost) + '</td><td>約' + Math.round(o.r.avg) + '</td></tr>').join('') + '</tbody></table></div>' : '<p>今より大きく性能が上がる候補がありません。</p>') + '</div>';
      h += '<p class="muted sp">価格とfpsは目安です。電源は、ケーブルの種類（コネクタ）も確認してください。</p>';
      out.innerHTML = h; U.tipify(out);
    }
    el.addEventListener('change', run);
    run();
  }, '/tools');

  /* ============================================================
     ゲーム別 fps 目安
     ============================================================ */
  U.route('/games', 'ゲーム別fps目安', function (el, q) {
    const p = U.prefs();
    const st = { game: D.by.games[q.get('g')] ? q.get('g') : 'apex', cpu: D.by.cpu[q.get('cpu')] ? q.get('cpu') : 'r7-9800x3d', mem: 'd5-32', quality: E.QUALITY[q.get('q')] ? q.get('q') : 'high' };
    el.innerHTML = '<h1>ゲーム別 fps の目安</h1><p class="muted tipify">ゲームとCPUを選ぶと、グラフィックボードごとの目安fpsが一覧で見られます。実測値ではなく、性能の目安から計算した値です。</p>' +
      '<div class="card"><div class="grid g2"><div><label class="f">ゲーム</label><select id="g-game">' + D.games.map(g => '<option value="' + g.id + '">' + esc(g.name) + '</option>').join('') + '</select></div>' +
      '<div><label class="f">CPU</label><select id="g-cpu">' + D.cpu.map(c => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('') + '</select></div></div><label class="f sp">画質（ゲームの設定）</label>' + U.qualityChips('gq', st.quality) + '</div><div id="g-out" class="sp"></div>';
    $('#g-game', el).value = st.game; $('#g-cpu', el).value = st.cpu;
    function draw() {
      st.game = $('#g-game', el).value; st.cpu = $('#g-cpu', el).value; st.quality = ($('input[name=gq]:checked', el) || { value: 'high' }).value;
      const g = D.by.games[st.game], cpu = D.by.cpu[st.cpu];
      const rows = D.gpu.filter(x => x.id !== 'none').sort((a, b) => b.score - a.score).map(gpu => {
        const B = { cpu: cpu, gpu: gpu, mem: D.by.mem[st.mem] };
        return '<tr><td><b>' + esc(gpu.name) + '</b><br><span class="muted">VRAM ' + gpu.vram + 'GB / ' + yen(gpu.price) + '</span></td>' + [1080, 1440, 2160].map(r => { const x = E.fps(g, r, B, { quality: st.quality }), f = x.fps, l = E.fpsLabel(f); return '<td><b>' + Math.round(f) + '</b> <span class="fl ' + l.c + '">' + l.t + '</span>' + (x.vramPen ? '<br><span class="neg" style="font-size:.75rem">VRAM不足ぎみ</span>' : '') + '</td>'; }).join('') + '</tr>';
      }).join('');
      $('#g-out', el).innerHTML = '<div class="card"><h2>' + esc(g.name) + ' ／ ' + esc(cpu.name) + ' ／ ' + E.QUALITY[st.quality].t + '画質</h2><p class="muted">快適に遊べるメモリの目安: ' + g.mem + 'GB以上</p><div class="tbl-wrap"><table class="t"><thead><tr><th>グラフィックボード</th><th>フルHD</th><th>WQHD</th><th>4K</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<p class="sp"><a href="fps/' + esc(g.id) + '.html">' + esc(g.name) + 'のおすすめグラボまとめ（目標fpsに届くいちばん安いグラボ）</a></p><p class="muted sp">※fpsは「平均的なシーンの目安」です。ゲームの更新、画質設定、DLSS/FSRの有無で大きく変わります。購入前にレビュー記事の実測値も確認しましょう。</p></div>';
    }
    el.addEventListener('change', draw); draw();
  }, '/tools');
})();
