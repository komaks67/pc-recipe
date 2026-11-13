/* ============================================================
   PC Recipe 計算エンジン（互換性・電源・fps目安・おすすめ構成）
   ============================================================ */
window.PCR_ENGINE = (function () {
  const D = PCR_DATA, CFG = PCR_CONFIG;
  const E = {};
  E.KEYS = ['cpu', 'mb', 'gpu', 'mem', 'ssd', 'psu', 'case', 'cooler', 'os'];
  E.LABEL = { cpu: 'CPU', mb: 'マザーボード', gpu: 'グラフィックボード', mem: 'メモリ', ssd: 'ストレージ', psu: '電源', case: 'ケース', cooler: 'CPUクーラー', os: 'OS' };

  const avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

  E.get = function (ids) {
    const o = {};
    E.KEYS.forEach(k => { o[k] = D.by[k][ids[k]]; });
    return o;
  };

  /* ---------- fps の目安 ---------- */
  E.fps = function (game, res, B, opt) {
    opt = opt || {};
    const gpuF = game.g[res] * Math.pow(B.gpu.score / 100, game.k);
    const cpuF = game.c * Math.pow(B.cpu.gs / 100, 0.8);
    const p = 6;
    let f = Math.pow(Math.pow(gpuF, -p) + Math.pow(cpuF, -p), -1 / p);
    const need = game.mem + (opt.stream ? 8 : 0);
    const memPen = !!(B.mem && B.mem.cap < need);
    if (memPen) f *= 0.85;
    if (opt.stream) f *= 0.9;
    if (game.cap) f = Math.min(f, game.cap);   // フレームレートの上限があるゲーム
    return { fps: f, gpuF: gpuF, cpuF: cpuF, limit: gpuF <= cpuF ? 'GPU' : 'CPU', memPen: memPen };
  };
  E.fpsLabel = function (f) {
    if (f >= 240) return { t: '240fps級', c: 'a' };
    if (f >= 144) return { t: '144fps級', c: 'b' };
    if (f >= 100) return { t: '100fps超', c: 'c' };
    if (f >= 60)  return { t: '60fps以上', c: 'd' };
    if (f >= 30)  return { t: '設定を下げて', c: 'e' };
    return { t: '重い', c: 'f' };
  };
  E.avgFps = function (B, ctx) {
    const gs = (ctx.games || []).map(id => D.by.games[id]).filter(Boolean);
    return avg(gs.map(g => E.fps(g, ctx.res, B, ctx).fps));
  };

  /* ---------- 電源容量 ---------- */
  E.power = function (B) {
    const other = 80 + (B.cooler && B.cooler.kind === '水冷' ? 10 : 0);
    const need = B.cpu.pw + B.gpu.tgp + other;                    // 最大時の目安
    const rec = Math.max(B.gpu.rec || 0, Math.ceil(need * 1.25 / 50) * 50); // 推奨容量
    const load = Math.round(B.cpu.pw * 0.5 + B.gpu.tgp * 0.85 + 50);     // ゲーム中の消費電力の目安
    return { need: need, rec: rec, load: load };
  };
  E.fitPsu = function (ids) {
    const B = E.get(ids);
    const pw = E.power(B);
    const cs = B.case;
    const list = D.psu.filter(p => cs.psu.indexOf(p.form) >= 0).sort((a, b) => a.w - b.w);
    const needAtx3 = B.gpu.conn === '12V-2x6' && list.some(p => p.atx3 && p.w >= pw.rec);
    const good = list.filter(p => p.w >= pw.rec && (B.gpu.id === 'none' || p.grade !== 'Bronze') && (!needAtx3 || p.atx3));
    const ok = good.length ? good : list.filter(p => p.w >= pw.rec);
    if (ok.length) return ok.sort((a, b) => a.price - b.price)[0].id;
    return list[list.length - 1].id;
  };

  /* ---------- 互換性チェック ---------- */
  E.check = function (ids, ctx) {
    ctx = ctx || {};
    const B = E.get(ids);
    const out = [];
    const add = (lv, title, msg) => out.push({ lv: lv, title: title, msg: msg });

    // CPU × マザーボード
    if (B.cpu.sock !== B.mb.sock) add('ng', 'CPUとマザーボード', B.cpu.name + ' は ' + B.cpu.sock + ' 用、' + B.mb.name + ' は ' + B.mb.sock + ' 用です。ソケットの形が違うので取り付けできません。');
    else add('ok', 'CPUとマザーボード', 'ソケットが同じ（' + B.cpu.sock + '）なので取り付けできます。');

    // BIOS更新
    if (B.cpu.sock === 'AM5' && B.mb.chip === 'B650' && B.cpu.fam === '9000') add('warn', 'BIOS更新の可能性', 'B650は発売が古いので、在庫によっては Ryzen 9000 を使うためにBIOS更新が必要な場合があります。購入前にお店や製品ページで確認してください。');
    if (B.cpu.plus && B.cpu.sock === B.mb.sock) add('warn', 'BIOS更新の可能性', 'Core Ultra 200S Plus は2026年3月発売の新しいCPUです。マザーボードの製造時期によっては、BIOS更新が必要な場合があります。製品ページの対応CPU表で確認してください。');
    if (B.mb.chip === 'A620' && B.cpu.pw >= 165) add('warn', 'A620と大型CPU', 'A620は電源回路が簡素なボードが多く、消費電力の大きいCPU（' + B.cpu.name + '）との組み合わせはおすすめできません。B650以上にしましょう。');
    if (B.cpu.bios && B.cpu.sock === B.mb.sock) add('warn', 'BIOS更新の可能性', B.cpu.name + ' は比較的新しい（または追加された）CPUです。マザーボードの在庫によっては、BIOS更新が必要な場合があります。製品ページの「対応CPU」と「必要なBIOS」を確認しましょう。');
    if (B.mb.chip === 'H610' && (B.cpu.fam === '13' || B.cpu.fam === '14') && B.cpu.sock === B.mb.sock) add('warn', 'BIOS更新の可能性', 'H610は発売が古いので、第13・14世代CPUには、BIOS更新が必要な場合があります。購入前に対応CPUとBIOSの版を確認しましょう。');
    if ((B.cpu.fam === '1000' || B.cpu.fam === '2000') && B.mb.sock === 'AM4' && (B.mb.chip === 'A520' || B.mb.chip === 'B550' || B.mb.chip === 'X570')) add('ng', 'CPUとチップセットの組み合わせ', B.cpu.name + ' は古い世代のため、' + B.mb.chip + 'のボードでは動作しないものがほとんどです。B450など400番台のボードを選んでください。');
    if (B.cpu.fam === '5000' && B.mb.chip === 'B450') add('warn', 'BIOS更新の可能性', 'B450は発売が古いので、Ryzen 5000を使うにはBIOS更新が必要です。更新にはCPUが1つ必要になる場合があるので、販売店の「対応済み」表記を確認してください。');
    if (B.cpu.sock === 'LGA1200' && B.mb.sock === 'LGA1200' && B.cpu.fam === '11' && B.mb.m2g < 4) add('warn', 'PCIe 4.0 は使えません', B.mb.chip + 'のボードでは、第11世代CPUでもPCIe 4.0（Gen4）の速度は出ません。');
    if (B.cpu.win11 === false && B.os.id === 'win11') add('warn', 'Windows 11 は公式非対応', B.cpu.name + ' はMicrosoftのWindows 11の対応CPUに入っていません。通常のやり方ではインストールできないので、OSなし（Windows 10など手持ち）の構成も検討してください。');
    if (B.cpu.legacy) add('warn', '旧世代のCPUです', B.cpu.name + ' は新品の流通が少なく、中古品が中心です。価格は目安で、保証や状態は購入先ごとに確認が必要です。');
    if (B.cpu.unstable) add('warn', '第13・14世代の不安定問題', B.cpu.name + ' を含む第13・14世代の一部CPUは、過去に動作が不安定になる問題があり、Intelが対策のBIOS更新を案内しています。最新のBIOSにして使いましょう。');
    if (B.mb.chip === 'A520' && B.cpu.tdp >= 105) add('warn', 'A520と高出力CPU', 'A520は電源回路が簡素なボードが多く、消費電力の大きいCPU（' + B.cpu.name + '）との組み合わせはおすすめできません。B550以上にしましょう。');
    if (B.gpu.id === 'none' && B.cpu.igpu === false) add('ng', '映像の出力', B.cpu.name + ' は内蔵グラフィックスがありません。グラフィックボードを付けないと、画面に映りません。');
    if (B.cpu.oc && B.mb.sock === 'LGA1700' && B.mb.chip !== 'Z790') add('ok', 'KシリーズCPUとチップセット', 'このCPUはオーバークロック対応ですが、' + B.mb.chip + 'では設定できません。普通に使う分には問題ありません。');
    if (B.cpu.oc && (B.mb.sock === 'LGA1200' || B.mb.sock === 'LGA1151' || B.mb.sock === 'LGA1151-v1') && B.cpu.sock === B.mb.sock && !B.mb.oc) add('ok', 'KシリーズCPUとチップセット', 'このCPUはオーバークロック対応ですが、' + B.mb.chip + 'では設定できません。普通に使う分には問題ありません。');
    if (B.cpu.oc && B.mb.sock === 'LGA1851' && B.mb.chip !== 'Z890') add('ok', 'KシリーズCPUとチップセット', 'このCPUはオーバークロック対応ですが、' + B.mb.chip + 'では設定できません。普通に使う分には問題ありません。');
    if (B.mb.memOc === false) add('warn', 'メモリの高速化', B.mb.chip + 'はメモリのオーバークロックに対応していません。高速メモリを買っても、速度が下がって動くことがあります。');

    // メモリ
    if (B.mem.type !== B.mb.mem) add('ng', 'メモリの規格', 'マザーボードは ' + B.mb.mem + '、メモリは ' + B.mem.type + ' で規格が違います。');
    else add('ok', 'メモリの規格', 'どちらも ' + B.mem.type + ' で合っています。');

    // ケース × マザーボード
    if (B.case.form.indexOf(B.mb.form) < 0) add('ng', 'ケースとマザーボードのサイズ', B.mb.form + 'サイズのマザーボードは、' + B.case.name + ' に入りません。');
    else add('ok', 'ケースとマザーボードのサイズ', B.mb.form + 'サイズのマザーボードがケースに入ります。');

    // ケース × GPU
    if (B.gpu.id !== 'none') {
      if (B.gpu.len > B.case.gpuMax) add('ng', 'ケースとGPUの長さ', B.gpu.name + ' は約' + B.gpu.len + 'mmで、ケースの上限（約' + B.case.gpuMax + 'mm）を超えるおそれがあります。');
      else if (B.gpu.len > B.case.gpuMax - 20) add('warn', 'ケースとGPUの長さ', 'GPU（約' + B.gpu.len + 'mm）がケースの上限（約' + B.case.gpuMax + 'mm）にかなり近いです。製品によって長さが違うので、実物の寸法を確認してください。');
      else add('ok', 'ケースとGPUの長さ', 'GPU（約' + B.gpu.len + 'mm）はケースに入る見込みです（上限 約' + B.case.gpuMax + 'mm）。製品ごとの寸法は購入時に確認を。');
      if (B.gpu.slots > B.case.gpuSlots) add('ng', 'ケースとGPUの厚み', 'GPUの厚み（約' + B.gpu.slots + 'スロット分）が、ケースの余裕（約' + B.case.gpuSlots + 'スロット分）を超えるおそれがあります。');
    }

    // クーラー
    const k = B.cooler;
    if (k.kind === '空冷') {
      if (k.h > B.case.coolerMax) add('ng', 'ケースとCPUクーラーの高さ', k.name + '（高さ約' + k.h + 'mm）は、ケースの上限（約' + B.case.coolerMax + 'mm）に収まりません。');
      else add('ok', 'ケースとCPUクーラーの高さ', 'クーラーの高さ（約' + k.h + 'mm）がケースに収まります。');
    } else {
      if (B.case.rad.indexOf(k.rad) < 0) add('ng', 'ケースと水冷ラジエーター', '簡易水冷' + k.rad + 'mmは、このケースに取り付けできません。');
      else add('ok', 'ケースと水冷ラジエーター', '簡易水冷' + k.rad + 'mmがケースに入ります。');
    }
    if (k.sock.indexOf(B.cpu.sock) < 0) add('ng', 'クーラーとソケット', 'このクーラーは ' + B.cpu.sock + ' に対応していません。');
    if (k.tdpMax < B.cpu.pw * 0.85) add('ng', 'クーラーの冷却力', k.name + '（目安 〜' + k.tdpMax + 'W）では、' + B.cpu.name + '（最大 約' + B.cpu.pw + 'W）を冷やしきれません。');
    else if (k.tdpMax < B.cpu.pw) add('warn', 'クーラーの冷却力', 'クーラー（目安 〜' + k.tdpMax + 'W）が、CPUの最大消費電力（約' + B.cpu.pw + 'W）にぎりぎりです。ゲーム中は問題なくても、重い作業で熱くなるかもしれません。');
    else add('ok', 'クーラーの冷却力', 'クーラーの目安（〜' + k.tdpMax + 'W）が、CPUの最大消費電力（約' + B.cpu.pw + 'W）を上回っています。');

    // 電源
    const pw = E.power(B);
    if (B.case.psu.indexOf(B.psu.form) < 0) add('ng', 'ケースと電源の規格', 'このケースは ' + B.case.psu.join('/') + ' 規格の電源用です。選んだ電源は ' + B.psu.form + ' です。');
    if (B.psu.w < pw.need) add('ng', '電源容量', '電源が足りません。最大で約' + pw.need + 'W必要なのに、' + B.psu.w + 'Wです。推奨は' + pw.rec + 'W以上。');
    else if (B.psu.w < pw.rec) add('warn', '電源容量', '動きますが余裕が少なめです。推奨は' + pw.rec + 'W以上（今は' + B.psu.w + 'W）。');
    else add('ok', '電源容量', '推奨（' + pw.rec + 'W）を満たしています（' + B.psu.w + 'W）。');
    if (B.gpu.conn === '12V-2x6' && !B.psu.atx3) add('warn', 'GPUの電源コネクタ', B.gpu.name + ' は12V-2x6コネクタを使います。この電源には標準ではついていないので、変換ケーブルが必要になります。ATX 3.x対応の電源がおすすめです。');
    if (B.gpu.conn === '8pin×2' && B.psu.w < 650) add('warn', 'GPUの電源コネクタ', B.gpu.name + ' は8ピンを2本使います。電源の端子数を確認してください。');

    // ストレージ
    if (B.ssd.type === 'NVMe') {
      if (B.ssd.gen > B.mb.m2g) add('warn', 'SSDの規格', 'Gen' + B.ssd.gen + ' SSDですが、このマザーボードはGen' + B.mb.m2g + 'までの場合が多いです。Gen' + B.mb.m2g + 'の速度で動作します（故障ではありません）。');
      else add('ok', 'SSDの規格', 'M.2 NVMe SSD（Gen' + B.ssd.gen + '）が使えます。');
    } else add('warn', 'SSDの種類', 'SATA SSDはNVMeより遅めです。Windowsを入れるドライブにはNVMeがおすすめです。');

    const order = { ng: 0, warn: 1, ok: 2 };
    out.sort((a, b) => order[a.lv] - order[b.lv]);
    return out;
  };

  /* ---------- ボトルネック判定 ---------- */
  E.bottleneck = function (B, ctx) {
    if (B.gpu.id === 'none') return { lv: 'ok', msg: 'グラフィックボードなしの構成なので、ゲーム向けのバランス判定はしません。事務・学習用の構成です。' };
    const gs = (ctx.games || []).map(id => D.by.games[id]).filter(Boolean);
    if (!gs.length) return { lv: 'ok', msg: 'ゲームを選ぶと、CPUとGPUのバランスを判定します。' };
    let cpuLim = 0;
    gs.forEach(g => { const r = E.fps(g, ctx.res, B, ctx); if (r.cpuF < r.gpuF * 0.95) cpuLim++; });
    const ratio = cpuLim / gs.length;
    if (ratio >= 0.7 && B.gpu.score >= 35) return { lv: 'warn', msg: '選んだゲームの多くで、CPUが先に限界になりそうです。GPUの力を使い切れません。CPUを一段上げるか、GPUを少し下げて、その分をCPUに回すとバランスが良くなります。' };
    if (B.cpu.gs >= 90 && B.gpu.score < 30) return { lv: 'warn', msg: 'CPUが強いわりにGPUが控えめです。ゲームではGPUのほうが効きやすいので、CPUを少し下げてGPUを強くしたほうが、fpsが伸びる可能性が高いです。' };
    if (ratio >= 0.4) return { lv: 'ok', msg: 'おおむねバランスは良好です。ゲームによってはCPUが先に頭打ちになります（フルHDの軽いゲームなど）。' };
    return { lv: 'ok', msg: 'CPUとGPUのバランスは良好です。画質や解像度を上げるほど、GPU性能が効いてきます。' };
  };

  /* ---------- 「買ってはいけない構成」のヒント ---------- */
  E.tips = function (ids, ctx) {
    const B = E.get(ids), out = [];
    const add = (lv, t, m) => out.push({ lv: lv, title: t, msg: m });
    if (B.mem.cap < 32) add('warn', 'メモリ16GBは少なめ', '今のゲームや配信・動画編集では、16GBだと足りなくなる場面があります。32GBがおすすめです。');
    if (B.gpu.id !== 'none' && B.gpu.vram <= 8 && ctx.res >= 1440) add('warn', 'VRAM(8GB)が少なめ', 'WQHD以上の高画質では、VRAMが足りずカクつくことがあります。12〜16GBのGPUが安心です。');
    if (B.gpu.id !== 'none' && B.gpu.vram <= 8 && ctx.res === 1080) add('warn', 'VRAM(8GB)は余裕が少なめ', 'フルHDでも、最新ゲームの最高画質ではVRAMが足りなくなることがあります。設定を調整すれば遊べます。');
    if (B.case.id === 'c-itx' && (B.gpu.tgp > 250 || B.cpu.pw > 150)) add('warn', '小型ケースは熱に注意', '小さなケースに高消費電力のパーツを入れると、熱がこもって性能が下がる、うるさくなることがあります。');
    if (B.cpu.sock === 'AM4' || B.cpu.sock === 'LGA1700') add('warn', '新しい買い替えには向かない世代', B.cpu.sock + ' は、新しいCPUが出ない世代です。DDR4を使うなど安く組めますが、将来CPUだけを新しいものに替えることはできません。長く使いたいなら、AM5やLGA1851も検討しましょう。');
    if (B.os.id === 'none') add('warn', 'OSなしの構成', 'Windowsのライセンスを別に用意する必要があります（持っていなければ追加費用）。');
    if (ctx.stream && B.cpu.mt < 55) add('warn', '配信にはCPUが弱め', 'ゲームをしながら配信すると、CPUの負担が増えます。コア数の多いCPUが安心です。');
    if (B.mb.chip === 'A620' && B.cpu.pw >= 120) add('warn', 'A620は拡張性が低め', 'A620は安価ですが、将来CPUを強いものに替えにくい場合があります。');
    if (B.gpu.id !== 'none' && B.gpu.score >= 55 && B.psu.w < 650) add('warn', '電源が小さい', '高性能GPUに、650W未満の電源は避けましょう。');
    if (B.gpu.id === 'none' && ctx.games && ctx.games.length && ctx.purposeGame) add('warn', 'ゲーム用なのにGPUなし', 'CPU内蔵グラフィックスでは、最新の3Dゲームはほぼ遊べません。グラフィックボードを追加しましょう。');
    return out;
  };

  /* ---------- 全体の評価 ---------- */
  E.evaluate = function (ids, ctx) {
    ctx = Object.assign({ res: 1440, games: ['valorant', 'apex', 'palworld', 'cyberpunk'], stream: false, hours: 3, kwh: CFG.electricityYenPerKwh }, ctx || {});
    const B = E.get(ids);
    const total = E.KEYS.reduce((s, k) => s + (B[k] ? B[k].price : 0), 0);
    const pw = E.power(B);
    const checks = E.check(ids, ctx);
    const gs = ctx.games.map(id => D.by.games[id]).filter(Boolean);
    const fpsRows = gs.map(g => { const r = E.fps(g, ctx.res, B, ctx); return Object.assign({ game: g }, r); });
    const monthly = pw.load / 1000 * ctx.hours * 30 * ctx.kwh;
    return {
      B: B, ids: ids, total: total, power: pw, checks: checks,
      bottleneck: E.bottleneck(B, ctx), tips: E.tips(ids, ctx),
      fpsRows: fpsRows, avgFps: avg(fpsRows.map(r => r.fps)),
      monthly: monthly, hasNg: checks.some(c => c.lv === 'ng'), ctx: ctx
    };
  };

  /* ---------- 1つ上・1つ下のパーツ（シミュレーター用） ---------- */
  E.neighbors = function (key, ids) {
    const cur = D.by[key][ids[key]];
    let list;
    if (key === 'gpu') list = D.gpu.slice().sort((a, b) => a.score - b.score);
    else if (key === 'cpu') list = D.cpu.filter(c => c.sock === cur.sock).sort((a, b) => (a.gs * 0.7 + a.mt * 0.3) - (b.gs * 0.7 + b.mt * 0.3));
    else if (key === 'mem') list = D.mem.filter(m => m.type === cur.type).sort((a, b) => a.cap - b.cap || a.price - b.price);
    else if (key === 'ssd') list = D.ssd.slice().sort((a, b) => a.price - b.price);
    else return { up: null, down: null };
    const i = list.findIndex(x => x.id === cur.id);
    return { up: list[i + 1] || null, down: list[i - 1] || null };
  };
  E.swap = function (ids, key, newId) {
    const n = Object.assign({}, ids);
    n[key] = newId;
    return E.autoAdjust(n, key);
  };

  /* 部品を替えたとき、合わなくなる部品を自動で合わせる */
  E.autoAdjust = function (ids, changed) {
    const n = Object.assign({}, ids);
    const cpu = D.by.cpu[n.cpu];
    if (changed === 'cpu' && D.by.mb[n.mb].sock !== cpu.sock) {
      const form = D.by.mb[n.mb].form;
      n.mb = E.defaultMb(cpu.sock, [form], { cheap: D.by.mb[n.mb].price < 20000, memType: D.by.mem[n.mem].type, cpu: cpu });
      if (D.by.mem[n.mem].type !== D.by.mb[n.mb].mem) n.mem = E.memFor(D.by.mem[n.mem].cap, D.by.mb[n.mb].mem);
    }
    if (changed === 'mem' && cpu.sock === 'LGA1700' && D.by.mb[n.mb].mem !== D.by.mem[n.mem].type) {
      n.mb = E.defaultMb(cpu.sock, [D.by.mb[n.mb].form], { cheap: D.by.mb[n.mb].price < 16000, memType: D.by.mem[n.mem].type, cpu: cpu });
    }
    if (changed === 'case') {
      const cs = D.by.case[n.case];
      if (cs.form.indexOf(D.by.mb[n.mb].form) < 0) n.mb = E.defaultMb(cpu.sock, cs.form, { memType: D.by.mem[n.mem].type, cpu: cpu });
    }
    return n;
  };

  /* ---------- 自動で部品を埋める ---------- */
  E.memFor = function (cap, type) {
    const t = { DDR5: { 16: 'd5-16', 32: 'd5-32', 48: 'd5-48', 64: 'd5-64' }, DDR4: { 16: 'd4-16', 32: 'd4-32', 48: 'd4-32', 64: 'd4-64' } }[type];
    return t[cap] || t[32];
  };
  E.platformTypes = function (sock) { return (sock === 'AM4' || sock === 'LGA1200' || sock === 'LGA1151' || sock === 'LGA1151-v1') ? ['DDR4'] : sock === 'LGA1700' ? ['DDR5', 'DDR4'] : ['DDR5']; };
  E.defaultMb = function (sock, forms, opt) {
    opt = opt || {};
    const form = (forms.indexOf('ATX') >= 0 && !opt.small && !(opt.cheap && forms.indexOf('mATX') >= 0)) ? 'ATX' : forms.indexOf('mATX') >= 0 ? 'mATX' : 'ITX';
    const cpu = opt.cpu || {};
    const strong = cpu.tdp >= 105 || cpu.fam === '13' || cpu.fam === '14';
    const type = opt.memType || 'DDR5';
    const map = {
      AM5: { ATX: 'am5-b850-a', mATX: opt.cheap ? 'am5-b650-m' : 'am5-b850-m', ITX: 'am5-b850-i' },
      LGA1851: { ATX: opt.oc ? 'in-z890-a' : 'in-b860-a', mATX: 'in-b860-m', ITX: 'in-b860-i' },
      LGA1200: { ATX: opt.oc ? 'in-z590-a' : 'in-b560-a', mATX: opt.cheap ? 'in-h510-m' : 'in-b560-m', ITX: 'in-b560-i' },
      LGA1151: { ATX: opt.oc ? 'in-z390-a' : 'in-z390-a', mATX: 'in-b365-m', ITX: 'in-b365-i' },
      'LGA1151-v1': { ATX: 'in-z270-a', mATX: 'in-b250-m', ITX: 'in-b250-i' },
      AM4: { ATX: (cpu.fam === '1000' || cpu.fam === '2000') ? 'am4-b450-a' : 'am4-b550-a', mATX: (cpu.fam === '1000' || cpu.fam === '2000') ? 'am4-b450-m' : (opt.cheap && !strong) ? 'am4-a520-m' : 'am4-b550-m', ITX: (cpu.fam === '1000' || cpu.fam === '2000') ? 'am4-b450-i' : 'am4-b550-i' },
      LGA1700: type === 'DDR4'
        ? { ATX: opt.oc ? 'in-z790-a-d4' : 'in-b760-a-d4', mATX: (opt.cheap && !strong) ? 'in-h610-m-d4' : 'in-b760-m-d4', ITX: 'in-b760-i-d4' }
        : { ATX: opt.oc ? 'in-z790-a-d5' : 'in-b760-a-d5', mATX: 'in-b760-m-d5', ITX: 'in-b760-i-d5' }
    };
    return map[sock][form];
  };
  E.complete = function (p, opt) {
    opt = opt || {};
    const ids = Object.assign({}, p);
    const cpu = D.by.cpu[ids.cpu], gpu = D.by.gpu[ids.gpu];
    if (!ids.case) {
      const pref = { mini: ['c-itx', 'c-itx-l'], compact: ['c-matx', 'c-matx-air', 'c-mid-s', 'c-mid'], mid: [opt.quiet ? 'c-quiet' : 'c-mid', 'c-air', 'c-full'], large: ['c-full', 'c-full-dual'] }[opt.size || 'mid'];
      const gpuOk = c => gpu.len <= c.gpuMax && gpu.slots <= c.gpuSlots;
      const coolOk = c => D.cooler.some(k => k.tdpMax >= cpu.pw && (k.id !== 'k-low' || c.coolerMax < 100) && (k.kind === '空冷' ? k.h <= c.coolerMax : c.rad.indexOf(k.rad) >= 0));
      ids.case = pref.find(id => gpuOk(D.by.case[id]) && coolOk(D.by.case[id])) || pref.find(id => gpuOk(D.by.case[id])) || pref[pref.length - 1];
    }
    const cs = D.by.case[ids.case];
    if (!ids.mb) ids.mb = E.defaultMb(cpu.sock, cs.form, { cheap: opt.cheap, small: opt.size === 'compact', memType: opt.memType || (ids.mem && D.by.mem[ids.mem].type) || 'DDR5', cpu: cpu });
    if (!ids.mem) ids.mem = D.by.mb[ids.mb].mem === 'DDR4' ? 'd4-32' : 'd5-32';
    if (!ids.ssd) ids.ssd = 'g4-1';
    if (!ids.os) ids.os = opt.noOs ? 'none' : 'win11';
    if (!ids.cooler) {
      const cand = D.cooler.filter(k => k.tdpMax >= cpu.pw && (k.id !== 'k-low' || cs.coolerMax < 100) && (k.kind === '空冷' ? k.h <= cs.coolerMax : cs.rad.indexOf(k.rad) >= 0));
      cand.sort((a, b) => (opt.quiet ? ((a.noise === '静か' ? 0 : 1) - (b.noise === '静か' ? 0 : 1)) : 0) || a.price - b.price);
      ids.cooler = (cand[0] || D.by.cooler['k-air-l']).id;
    }
    if (!ids.psu) ids.psu = E.fitPsu(ids);
    return ids;
  };

  /* ---------- おすすめ構成の自動生成（診断ウィザード） ---------- */
  E.satisfaction = function (B, o) {
    const parts = [];
    if (o.game && o.games.length) {
      const arr = o.games.map(id => E.fps(D.by.games[id], o.res, B, { stream: o.stream }).fps / o.target);
      parts.push({ w: 0.75, v: avg(arr.map(x => Math.min(x, o.maxPerf ? 5 : 1.15))) });
    }
    if (o.edit && o.edit !== 'none') {
      const hd = o.head || 1;
      const need = (o.edit === '4k' ? 80 : 55) * hd, gneed = (o.edit === '4k' ? 30 : 15) * hd;
      parts.push({ w: 0.5, v: 0.7 * Math.min(B.cpu.mt / need, 1.15) + 0.3 * Math.min(B.gpu.score / gneed, 1.15) });
    }
    if (o.stream) parts.push({ w: 0.3, v: Math.min(B.cpu.mt / (55 * (o.head || 1)), 1.15) });
    if (!parts.length) return 1;
    const w = parts.reduce((s, x) => s + x.w, 0);
    return parts.reduce((s, x) => s + x.v * x.w, 0) / w;
  };
  /* 他のどれにも「同じ以上の性能で、安く、省電力」で負けているパーツは、候補から外す（計算を速くするため） */
  function prune(list, better) {
    return list.filter(a => !list.some(b => b !== a && better(b, a)));
  }
  const cpuBetter = (b, a) => b.sock === a.sock && b.price <= a.price && b.gs >= a.gs && b.mt >= a.mt && b.pw <= a.pw && (a.igpu === false || b.igpu !== false) && !(b.unstable && !a.unstable) && !(b.bios && !a.bios) &&
    (b.price < a.price || b.gs > a.gs || b.mt > a.mt || b.pw < a.pw);
  const gpuBetter = (b, a) => b.price <= a.price && b.score >= a.score && b.tgp <= a.tgp && b.vram >= a.vram && b.len <= a.len && b.slots <= a.slots && b.rec <= a.rec &&
    (b.price < a.price || b.score > a.score || b.tgp < a.tgp || b.vram > a.vram);
  E.autoBuild = function (o) {
    const officeOnly = !o.game && (!o.edit || o.edit === 'none') && !o.stream;
    const gpus = prune(officeOnly ? D.gpu.filter(g => g.id === 'none') : D.gpu.filter(g => g.id !== 'none' && D.suggestable(g)), gpuBetter);
    const cpus = prune(D.cpu.filter(D.suggestable), cpuBetter);
    let caps = [32];
    if (officeOnly) caps = [o.budget >= 150000 ? 32 : 16];
    else if (o.edit === '4k' && o.budget >= 280000) caps = [64];
    else if (o.maxPerf && o.budget >= 200000) caps = [32];
    else if (o.budget < 260000) caps = [32, 16];   // 予算が少ないときは16GBも候補にする
    const ssdId = (o.edit && o.edit !== 'none') || o.budget >= 200000 ? 'g4-2' : 'g4-1';
    const ctx = { res: o.res, games: o.games, stream: o.stream, purposeGame: o.game };
    let best = null, cheapest = null;
    cpus.forEach(cpu => {
      if (officeOnly && cpu.igpu === false) return;   // グラボなしの構成には、内蔵グラフィックスが必要
      gpus.forEach(gpu => caps.forEach(cap => E.platformTypes(cpu.sock).forEach(type => {
        const ids = E.complete({ cpu: cpu.id, gpu: gpu.id, mem: E.memFor(cap, type), ssd: ssdId }, { size: o.size, quiet: o.quiet, cheap: o.budget < 200000, noOs: !o.os, memType: type });
        if (D.by.mb[ids.mb].m2g < D.by.ssd[ids.ssd].gen) ids.ssd = D.by.ssd[ids.ssd].cap >= 2 ? 'g3-2' : 'g3-1';   // 古いボードにはGen3 SSD
        const ev = E.evaluate(ids, ctx);
        if (ev.hasNg) return;
        const sat = E.satisfaction(ev.B, o);
        const lowMem = !officeOnly && D.by.mem[ids.mem].cap < 32 ? 6 : 0;
        const oldPlat = cpu.sock === 'AM4' || cpu.sock === 'LGA1700' ? (o.maxPerf ? 10 : 4) : 0;   // 新しいCPUが出ない世代は、少しだけ不利にする
        const util = Math.min(sat, o.maxPerf ? 5 : 1.12) * 100 - (o.maxPerf ? 0.5 : 8) * ev.total / o.budget - lowMem - oldPlat;
        const rec = { ids: ids, ev: ev, sat: sat, util: util };
        if (!cheapest || ev.total < cheapest.ev.total) cheapest = rec;
        if (ev.total <= o.budget && (!best || util > best.util || (util === best.util && ev.total < best.ev.total))) best = rec;
      })));
    });
    if (best) return Object.assign(best, { over: false });
    return Object.assign(cheapest, { over: true });
  };

  /* ---------- 今のPCからのアップグレード診断 ---------- */
  E.upgradeDiag = function (inp) {
    const oc = inp.cpuObj || D.by.oldCpu[inp.cpu], og = inp.gpuObj || D.by.oldGpu[inp.gpu];   // cpuObj/gpuObj: 「今のPCから診断」で読み取ったパーツ
    const games = inp.games.map(id => D.by.games[id]).filter(Boolean);
    const memStub = { cap: inp.memGB };
    const run = (cpuGs, gpuScore, memCap) => {
      const B = { cpu: { gs: cpuGs }, gpu: { score: gpuScore }, mem: { cap: memCap } };
      const rows = games.map(g => E.fps(g, inp.res, B, {}));
      return { avg: avg(rows.map(r => r.fps)), cpuLim: rows.filter(r => r.cpuF < r.gpuF * 0.95).length, rows: rows, ok: rows.filter(r => r.fps >= inp.target).length };
    };
    const now = run(oc.gs, og.score, inp.memGB);
    const res = { now: now, oc: oc, og: og, gpuOptions: [], cpuOptions: [], advice: [], games: games };

    // GPU交換案
    D.gpu.filter(g => g.id !== 'none' && D.suggestable(g) && g.score >= og.score * 1.3).forEach(g => {
      const r = run(oc.gs, g.score, inp.memGB);
      const need = Math.max(g.rec, Math.ceil((oc.pw + g.tgp + 80) * 1.25 / 50) * 50);
      let extra = 0, psuNote = '';
      if (inp.psuW < need) {
        const p = D.psu.filter(x => x.form === 'ATX' && x.w >= need).sort((a, b) => a.price - b.price)[0] || D.by.psu.p1200;
        extra = p.price; psuNote = '電源の交換が必要（今' + inp.psuW + 'W → ' + need + 'W以上。目安 +' + p.price.toLocaleString('ja-JP') + '円）';
      }
      res.gpuOptions.push({ gpu: g, r: r, cost: g.price + extra, psuNote: psuNote, extra: extra });
    });
    res.gpuOptions.sort((a, b) => a.cost - b.cost);

    // CPU交換案
    D.cpu.filter(c => D.suggestable(c) && c.gs >= oc.gs * 1.15).forEach(c => {
      const r = run(c.gs, og.score, inp.memGB);
      let cost = c.price, note = '';
      if (oc.sock === c.sock) note = 'CPUだけの交換でOK（BIOS更新が必要な場合あり）';
      else {
        const type = c.sock === 'AM4' ? 'DDR4' : 'DDR5';
        const mb = D.by.mb[E.defaultMb(c.sock, ['ATX'], { cheap: true, memType: type, cpu: c })];
        const m = D.by.mem[E.memFor(32, type)];
        cost += mb.price + m.price;
        note = '今のPCは ' + oc.plat + ' です。' + c.sock + ' に替えるには、マザーボードとDDR5メモリも一緒に交換が必要（CPU込みで目安 ' + cost.toLocaleString('ja-JP') + '円）。';
      }
      res.cpuOptions.push({ cpu: c, r: r, cost: cost, note: note });
    });
    res.cpuOptions.sort((a, b) => a.cost - b.cost);

    // アドバイス
    const n = games.length || 1;
    if (now.ok >= n) res.advice.push({ lv: 'ok', t: '今の構成でも目標に届いています', m: '選んだゲームでは、目標のfpsをほぼ達成できる見込みです。急いで交換する必要はありません。' });
    else if (now.cpuLim / n >= 0.6) res.advice.push({ lv: 'warn', t: 'まずはCPUがボトルネックです', m: 'GPUを替えても、CPUが先に限界になるゲームが多い見込みです。CPUの交換（または全体の買い替え）を先に検討しましょう。' });
    else res.advice.push({ lv: 'warn', t: 'まずはGPUの交換が効果的です', m: 'GPUが足を引っ張っています。グラフィックボードの交換が、いちばん費用対効果が高い見込みです。' });
    if (inp.memGB < 32) res.advice.push({ lv: 'warn', t: 'メモリが' + inp.memGB + 'GBです', m: '最新のゲームでは32GBがおすすめです。今のマザーボードがDDR4かDDR5かを確認して、同じ規格のメモリを増設しましょう。' });
    if (oc.path === 'board' || oc.path === 'am4') res.advice.push({ lv: 'ok', t: 'CPUを新世代にするなら、土台ごと交換', m: '今のCPUは ' + oc.plat + ' です。新しいCPUに替える場合は、マザーボードとメモリ（DDR5）も一緒に交換することになります。実質的に「買い替え」に近い費用です。' });
    return res;
  };

  return E;
})();
