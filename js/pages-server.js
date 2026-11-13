/* ============================================================
   サーバー用PC診断（ゲームサーバーを自宅で動かす用）
   ※ 必要メモリ・CPUの値は、各ゲームの公式情報とレンタルサーバー各社の
     公開情報をもとにした「目安」です（実測ではありません）。
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;

  /* ram: 1サーバーの基本メモリ(GB) / per: 1人ふえるごとのメモリ(GB) / gs: 必要なCPUの1コアの速さ / mt: 必要なコア数の目安
     disk: 1サーバーが使う容量(GB) / mods: MODやプラグインの段階（add=足すメモリ, pm=人数あたりの倍率, gs=足す1コアの速さ） */
  D.servers = [
    { id: 'asa', name: 'ARK: Survival Ascended', inst: true, maxP: 70, ram: 12, per: 0.15, gs: 70, mt: 30, disk: 60,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'MODあり（少なめ）', add: 2, pm: 1.3, gs: 4 }, { l: 'MODあり（多め）', add: 4, pm: 1.6, gs: 8 }],
      note: ['マップ1つにつき、メモリを約10〜16GB使うのが目安です。複数のマップを同時に動かすなら、その分ふえます。', '1コアの速さが大事なゲームです。コア数を増やすより、速いCPUのほうが効きます。', '保存先はNVMe SSDがおすすめです。'] },
    { id: 'ase', name: 'ARK: Survival Evolved', inst: true, maxP: 70, ram: 7, per: 0.15, gs: 52, mt: 20, disk: 30,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'MODあり（少なめ）', add: 1.5, pm: 1.3, gs: 3 }, { l: 'MODあり（多め）', add: 3, pm: 1.6, gs: 6 }],
      note: ['1〜10人なら、メモリ8GBが最低ライン、12GBあると安心です。', 'テイム（飼いならした生き物）が増えるほどメモリを使います。'] },
    { id: 'mc', name: 'Minecraft Java版', inst: false, maxP: 50, ram: 1.5, per: 0.1, gs: 52, mt: 12, disk: 10,
      mods: [{ l: 'MODなし（バニラ）', add: 0, pm: 1, gs: 0 }, { l: 'プラグイン入り（Paper等）', add: 2, pm: 1.3, gs: 4 }, { l: 'MOD入り（軽い・50個くらいまで）', add: 5, pm: 1.5, gs: 10 }, { l: 'MOD入り（ふつう・100〜150個）', add: 7, pm: 2, gs: 14 }, { l: 'MOD入り（重い・200個以上）', add: 10, pm: 2.5, gs: 18 }],
      note: ['マイクラのサーバーは、おもに1つのコアで動きます。メモリを増やしても遅さは直りません。CPUの1コアの速さが一番大事です。', 'MODが多いほどCPUの速さが必要になります。1人ふえるごとに、MOD入りでは約100〜300MBふえます。'] },
    { id: 'palworld', name: 'Palworld（パルワールド）', inst: false, maxP: 32, ram: 8, per: 0.3, gs: 58, mt: 40, disk: 30,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'MODあり', add: 2, pm: 1.2, gs: 4 }],
      note: ['公式はメモリ16GB、大きなサーバーは32GB以上をすすめています。', '長く動かすとメモリが増えていく性質があるので、数時間おきの自動再起動が定番です。', '最大32人までです。'] },
    { id: 'terraria', name: 'Terraria（テラリア）', inst: false, maxP: 32, ram: 0.8, per: 0.05, gs: 35, mt: 10, disk: 5,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'tModLoaderのMODあり', add: 1.5, pm: 1.5, gs: 8 }],
      note: ['とても軽いサーバーです。ほとんどのPCで動きます。（この数値は軽さを考えた目安です）'] },
    { id: 'valheim', name: 'Valheim（ヴァルヘイム）', inst: false, maxP: 10, ram: 3, per: 0.25, gs: 45, mt: 14, disk: 10,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'MODあり', add: 1.5, pm: 1.3, gs: 5 }],
      note: ['最低4GB、4〜8GBが目安です。ふつうは10人までです。'] },
    { id: 'rust', name: 'Rust', inst: false, maxP: 100, ram: 7, per: 0.08, gs: 60, mt: 30, disk: 25,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'プラグインあり（uMod等）', add: 1.5, pm: 1.3, gs: 4 }],
      note: ['最低8GB、10〜20人なら12〜16GBが目安です。', '自動セーブのとき、遅いSSDだとカクつきます。NVMe SSDがおすすめです。'] },
    { id: '7dtd', name: '7 Days to Die', inst: false, maxP: 16, ram: 5.5, per: 0.35, gs: 68, mt: 20, disk: 20,
      mods: [{ l: 'MODなし', add: 0, pm: 1, gs: 0 }, { l: 'MODあり', add: 2, pm: 1.3, gs: 5 }],
      note: ['1コアの速さと、SSDの速さが大事です。', 'ゾンビがたくさん出る夜（ブラッドムーン）は、いつもよりCPUを使います。'] }
  ];
  D.by.servers = {};
  D.servers.forEach(s => { D.by.servers[s.id] = s; });

  /* ---------- 必要なスペックの見積もり ---------- */
  E.serverReq = function (s, st) {
    const mod = s.mods[st.mod] || s.mods[0];
    const inst = s.inst ? st.inst : 1;
    const one = s.ram + mod.add + s.per * mod.pm * st.players;
    return {
      ram: Math.ceil(one * inst + 4),                       // +4GB は Windows などの分
      one: one, inst: inst,
      gs: s.gs + mod.gs,
      mt: Math.min(100, s.mt * inst),
      disk: s.disk * inst
    };
  };
  const SRV_MEM = { DDR5: { 16: 'd5-16', 32: 'd5-32', 48: 'd5-48', 64: 'd5-64' }, DDR4: { 16: 'd4-16', 32: 'd4-32', 48: 'd4-64', 64: 'd4-64' } };
  function memFor(ram, type) {
    const cap = [16, 32, 48, 64].find(c => c >= ram) || 64;
    return SRV_MEM[type][cap];
  }
  /* 24時間つけっぱなしのときの消費電力の目安(W) */
  E.serverWatts = function (B) {
    return Math.round(30 + B.cpu.pw * 0.28 + (B.gpu.id !== 'none' ? 10 : 0) + B.mem.cap / 16 * 3);
  };

  /* mode: 'cheap' = 買うときの値段が最安 / 'eco' = 3年間の合計(購入+電気代)が最安 / 'room' = 余裕を持たせた3年間合計最安 */
  E.serverBuild = function (st, mode, opt) {
    opt = opt || {};
    const s = D.by.servers[st.game];
    const req = E.serverReq(s, st);
    const margin = mode === 'room' ? 1.3 : 1;
    const kwh = opt.kwh || CFG.electricityYenPerKwh;
    const cheapGpu = D.gpu.filter(g => g.id !== 'none' && g.price > 0 && D.suggestable(g)).sort((a, b) => a.price - b.price)[0];
    const cpus = D.cpu.filter(c => !c.unstable && D.suggestable(c));            // 24時間動かすので、不安定問題のあるCPUは避ける
    const prunedCpus = cpus.filter(a => !cpus.some(b => b !== a && b.sock === a.sock && b.price <= a.price && b.gs >= a.gs && b.mt >= a.mt && b.pw <= a.pw && (a.igpu === false || b.igpu !== false) && !(b.bios && !a.bios) && (b.price < a.price || b.gs > a.gs || b.mt > a.mt || b.pw < a.pw)));
    const ssdBase = req.disk > 700 ? 'g4-2' : 'g4-1';
    let best = null, fallback = null;
    prunedCpus.forEach(cpu => {
      E.platformTypes(cpu.sock).forEach(type => {
        const gpuId = cpu.igpu === false ? cheapGpu.id : 'none';
        const ids = E.complete({ cpu: cpu.id, gpu: gpuId, mem: memFor(req.ram * margin, type), ssd: ssdBase },
          { size: st.size, quiet: st.quiet, cheap: true, noOs: !st.os, memType: type });
        if (D.by.mb[ids.mb].m2g < D.by.ssd[ids.ssd].gen) ids.ssd = D.by.ssd[ids.ssd].cap >= 2 ? 'g3-2' : 'g3-1';
        const ev = E.evaluate(ids, { games: [], res: 1080 });
        if (ev.hasNg) return;
        const B = ev.B;
        const watts = E.serverWatts(B);
        const monthly = Math.round(watts / 1000 * 24 * 30 * kwh);
        const rec = { ids: ids, ev: ev, B: B, req: req, watts: watts, monthly: monthly, total: ev.total, total3: ev.total + monthly * 36,
          ramOk: B.mem.cap >= req.ram * margin, gsOk: B.cpu.gs >= req.gs * margin, mtOk: B.cpu.mt >= req.mt * margin };
        rec.ok = rec.ramOk && rec.gsOk && rec.mtOk;
        rec.deficit = (rec.ramOk ? 0 : 1) + (rec.gsOk ? 0 : (req.gs * margin - B.cpu.gs) / 100) + (rec.mtOk ? 0 : (req.mt * margin - B.cpu.mt) / 100);
        const score = mode === 'cheap' ? rec.total : rec.total3;
        rec.score = score;
        if (rec.ok && (!best || score < best.score)) best = rec;
        if (!fallback || rec.deficit < fallback.deficit || (rec.deficit === fallback.deficit && score < fallback.score)) fallback = rec;
      });
    });
    const r = best || fallback;
    r.short = !best;
    r.mode = mode;
    return r;
  };

  /* ---------- ページ ---------- */
  const ST = { game: 'asa', players: 10, mod: 0, inst: 1, size: 'mid', quiet: false, os: true };
  const PLAN = { cheap: ['買うときの値段が一番安い', '最初に払う金額を抑えたい人向け。'], eco: ['3年間のトータルで安い（おすすめ）', '電気代も含めた3年間の合計が一番安い構成です。'], room: ['余裕をもたせた構成', 'メモリとCPUに約3割の余裕。人数やMODがふえても安心です。'] };

  U.route('/server', 'サーバー用PC診断', function (el, q) {
    if (q && q.get('g') && D.by.servers[q.get('g')]) { ST.game = q.get('g'); ST.players = Math.min(+q.get('p') || ST.players, D.by.servers[ST.game].maxP); ST.mod = +q.get('m') || 0; ST.inst = +q.get('i') || 1; }
    el.innerHTML = '<h1>サーバー用PC診断</h1>' +
      '<p class="muted tipify">自宅で、ゲームのサーバーを24時間動かすためのPCを提案します。ふつうのゲーム用と違い、<b>メモリの量・CPUの1コアの速さ・電気代</b>が大事です。グラフィックボードは基本的にいりません。</p>' +
      '<div class="card"><div class="grid g2">' +
      '<div><label class="f">動かすゲーム</label><select id="sg">' + D.servers.map(s => '<option value="' + s.id + '">' + esc(s.name) + '</option>').join('') + '</select></div>' +
      '<div><label class="f">同時に遊ぶ人数: <b id="spv"></b>人</label><input type="range" id="sp" min="1" max="70" step="1"></div>' +
      '<div><label class="f">MODやプラグイン</label><select id="sm"></select></div>' +
      '<div id="si-wrap"><label class="f">同時に動かすサーバー（マップ）の数</label><select id="si"><option value="1">1つ</option><option value="2">2つ</option><option value="3">3つ</option></select></div>' +
      '<div><label class="f">大きさの好み</label><select id="sz"><option value="mini">小型</option><option value="compact">コンパクト</option><option value="mid">標準</option></select></div>' +
      '</div><div class="row sp"><label class="chip"><input type="checkbox" id="sq"><span>静かなほうがいい</span></label><label class="chip"><input type="checkbox" id="so"><span>OSは自分で用意（Linuxなど）</span></label></div></div><div id="out" class="sp"></div>';
    const s0 = () => D.by.servers[ST.game];
    function sync() {
      const s = s0();
      $('#sg', el).value = ST.game;
      $('#sp', el).max = s.maxP; ST.players = Math.min(ST.players, s.maxP); $('#sp', el).value = ST.players;
      $('#sm', el).innerHTML = s.mods.map((m, i) => '<option value="' + i + '">' + esc(m.l) + '</option>').join('');
      if (ST.mod >= s.mods.length) ST.mod = 0;
      $('#sm', el).value = ST.mod;
      $('#si-wrap', el).style.display = s.inst ? '' : 'none';
      $('#si', el).value = ST.inst; $('#sz', el).value = ST.size; $('#sq', el).checked = ST.quiet; $('#so', el).checked = !ST.os;
    }
    function draw() {
      const s = s0();
      $('#spv', el).textContent = ST.players;
      const inst = s.inst ? ST.inst : 1;
      const req = E.serverReq(s, ST);
      const kwh = U.prefs().kwh || CFG.electricityYenPerKwh;
      const plans = [];
      ['cheap', 'eco', 'room'].forEach(m => {
        const r = E.serverBuild(ST, m, { kwh: kwh });
        const key = JSON.stringify(r.ids);
        const dup = plans.find(p => JSON.stringify(p.r.ids) === key);
        if (dup) dup.modes.push(m); else plans.push({ r: r, modes: [m] });
      });
      let h = '<div class="card"><h2>この条件で必要なスペックの目安</h2><table class="t"><tbody>' +
        '<tr><th>メモリ</th><td><b>約' + req.ram + 'GB</b> 以上（OS分の約4GB込み）</td></tr>' +
        '<tr><th>CPU</th><td>1コアの速さが大事です' + (req.mt >= 40 ? '。コア数も多めに必要です' : '') + '</td></tr>' +
        '<tr><th>保存容量</th><td>約' + Math.ceil(req.disk) + 'GB（NVMe SSD推奨）</td></tr></tbody></table>' +
        '<p class="muted sp">' + s.note.map(esc).join('<br>') + '</p>' +
        '<p class="muted">数値は、ゲームの公式情報や各社の公開情報をもとにした目安です。マップの大きさや遊び方で変わります。</p></div>';
      plans.forEach((p, idx) => {
        const r = p.r, B = r.B, main = p.modes.indexOf('eco') >= 0 ? 'eco' : p.modes[0];
        const names = p.modes.map(m => PLAN[m][0]).join(' ／ ');
        h += '<div class="card sp"><div class="row" style="justify-content:space-between"><h2>' + esc(names) + '</h2><span class="badge ' + (r.short ? 'warn' : 'ok') + '">' + (r.short ? '条件に届きません' : '条件OK') + '</span></div>' +
          '<p class="muted">' + esc(PLAN[main][1]) + '</p>' +
          '<div class="total">' + yen(r.total) + '</div>' +
          '<table class="t sp"><tbody>' + ['cpu', 'mb', 'mem', 'ssd', 'psu', 'case', 'cooler'].concat(r.ids.gpu !== 'none' ? ['gpu'] : []).map(k => '<tr><th>' + E.LABEL[k] + '</th><td>' + U.partImg(k, B[k].id, 32) + ' ' + esc(B[k].name) + '</td></tr>').join('') + '</tbody></table>' +
          '<div class="grid g2 sp"><div class="card" style="margin:0"><b>電気代（24時間つけっぱなし）</b><div class="total" style="font-size:1.3rem">月 約' + yen(r.monthly) + '</div><span class="muted">消費電力 約' + r.watts + 'W ／ 1kWh=' + kwh + '円で計算</span></div>' +
          '<div class="card" style="margin:0"><b>3年間の合計（本体＋電気代）</b><div class="total" style="font-size:1.3rem">約' + yen(r.total3) + '</div><span class="muted">電気代は目安です</span></div></div>' +
          '<div class="sp">' + [
            ['メモリ', r.ramOk, B.mem.cap + 'GB（必要の目安 約' + req.ram + 'GB）'],
            ['CPUの1コアの速さ', r.gsOk, r.gsOk ? '目安をクリア' : '目安より少し足りません'],
            ['CPUのコア数', r.mtOk, r.mtOk ? '目安をクリア' : '目安より少し足りません']
          ].map(x => '<div class="chk ' + (x[1] ? 'ok' : 'warn') + '"><span class="mk">' + (x[1] ? '✓' : '!') + '</span><div><b>' + x[0] + '</b>: ' + x[2] + '</div></div>').join('') + '</div>' +
          (r.ids.gpu !== 'none' ? '<p class="muted sp">このCPUは内蔵グラフィックスがないため、いちばん安いグラフィックボードを入れています。内蔵グラフィックス付きのCPUなら、ボードは不要です。</p>' : '') +
          (r.short ? '<div class="chk warn sp"><span class="mk">!</span><div>この条件は、家庭用のパーツでは余裕をもって満たせません。人数やMODを減らすか、レンタルサーバーも検討してください。</div></div>' : '') +
          r.ev.checks.filter(c => c.lv !== 'ok').map(c => '<div class="chk ' + c.lv + ' sp"><span class="mk">!</span><div><b>' + esc(c.title) + '</b>: ' + esc(c.msg) + '</div></div>').join('') +
          '<div class="row sp"><a class="btn sm" href="#/build?' + U.idsToQuery(r.ids) + '">自作で組む</a><button class="btn sub sm" data-sv="' + idx + '">保存</button></div></div>';
      });
      h += '<p class="muted sp">24時間動かす前提のため、動作が不安定になる問題が報告された第13・14世代のCPUは、おすすめから外しています。</p>';
      $('#out', el).innerHTML = h;
      $$('[data-sv]', el).forEach(b => b.onclick = () => { const p = plans[+b.dataset.sv]; const r2 = U.saveBuild('サーバー ' + s.name.replace(/ \(.*$|（.*$/, '') + ' ' + ST.players + '人', p.r.ids, 'build'); U.toast(r2.ok ? '保存しました' : r2.msg); });
    }
    sync(); draw();
    $('#sg', el).onchange = e => { ST.game = e.target.value; ST.mod = 0; sync(); draw(); };
    $('#sp', el).oninput = e => { ST.players = +e.target.value; draw(); };
    $('#sm', el).onchange = e => { ST.mod = +e.target.value; draw(); };
    $('#si', el).onchange = e => { ST.inst = +e.target.value; draw(); };
    $('#sz', el).onchange = e => { ST.size = e.target.value; draw(); };
    $('#sq', el).onchange = e => { ST.quiet = e.target.checked; draw(); };
    $('#so', el).onchange = e => { ST.os = !e.target.checked; draw(); };
  }, '/tools');
})();
