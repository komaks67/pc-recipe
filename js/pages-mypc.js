/* ============================================================
   今のPCから診断（Windows向け）
   1) ブラウザで仮読み取り（GPU名・CPUのスレッド数）
   2) 確認用スクリプト（PowerShell）の結果を貼り付けて正確に読み込み
   3) 替えたいパーツを選ぶと、候補・互換性・費用の目安を表示
   ※ 読み取った情報は、このPCの中だけで処理します（どこにも送りません）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };

  /* ---------- 確認用スクリプト（読み取るだけ。変更も送信もしません） ---------- */
  const PS = [
    '# PC Recipe 用: このPCのパーツ名を読み取って、文字にまとめます。',
    '# 読み取るだけで、設定の変更や、ネットへの送信は一切しません。',
    '$cpu = (Get-CimInstance Win32_Processor | Select-Object -First 1).Name.Trim()',
    "$gpu = (Get-CimInstance Win32_VideoController | Where-Object { $_.Name -notmatch 'Microsoft|Virtual|Remote' } | ForEach-Object { $_.Name }) -join ' ; '",
    '$mem = Get-CimInstance Win32_PhysicalMemory',
    '$gb = [math]::Round((($mem | Measure-Object Capacity -Sum).Sum) / 1GB)',
    '$t = ($mem | Select-Object -First 1).SMBIOSMemoryType',
    "$type = switch ($t) { 26 { 'DDR4' } 34 { 'DDR5' } 24 { 'DDR3' } default { 'unknown' } }",
    '$mb = Get-CimInstance Win32_BaseBoard | Select-Object -First 1',
    "$ssd = (Get-PhysicalDisk | ForEach-Object { $_.FriendlyName + ' ' + [math]::Round($_.Size / 1GB) + 'GB' }) -join ' ; '",
    "$lines = @('PCRECIPE1', \"CPU=$cpu\", \"GPU=$gpu\", \"MEM=$gb\", \"MEMTYPE=$type\", \"MB=$($mb.Manufacturer) $($mb.Product)\", \"SSD=$ssd\")",
    '$text = [string]::Join([string][char]10, $lines)',
    '$text',
    'Set-Clipboard -Value $text',
    "Write-Host ''",
    "Write-Host 'コピーしました。サイトの入力欄に貼り付けてください。'"
  ].join('\r\n');

  /* ---------- パーツ名のマッチング ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  function cpuTok(name) {
    const t = name.replace(/\(.*?\)|（.*?）/g, ' ').split(/\s+/).filter(w => /\d/.test(w)).map(norm).filter(Boolean);
    return t.sort((a, b) => b.length - a.length)[0] || '';
  }
  function pseudoCpu(c) {
    const plat = { AM4: 'AM4 / DDR4', AM5: 'AM5 / DDR5', LGA1700: 'LGA1700 / DDR4または5', LGA1851: 'LGA1851 / DDR5' }[c.sock] || c.sock;
    return { id: 'n:' + c.id, sock: c.sock, name: c.name, gs: c.gs, mt: c.mt, pw: c.pw, plat: plat, path: c.sock === 'AM5' ? 'cpu' : c.sock === 'AM4' ? 'am4' : 'board' };
  }
  const CPUS = D.cpu.map(pseudoCpu).concat(D.oldCpu.map(o => Object.assign({}, o, { id: 'o:' + o.id })));
  const IGPU = { id: 'igpu', name: '内蔵グラフィックス（グラボなし）', score: 3, tgp: 0, vram: 0 };
  const GPUS = D.gpu.filter(g => g.id !== 'none').map(g => ({ id: 'n:' + g.id, name: g.name, score: g.score, tgp: g.tgp, vram: g.vram }))
    .concat(D.oldGpu.map(o => Object.assign({}, o, { id: 'o:' + o.id })), [IGPU]);
  const cpuById = id => CPUS.find(c => c.id === id);
  const gpuById = id => GPUS.find(g => g.id === id);

  function gpuKey(name) {
    let s = String(name || '');
    const m = s.match(/^ANGLE \(([^,]*),\s*([^)]*?)(?:\s+Direct3D.*|\s+vs_\d.*)?(?:,[^,]*)?\)$/i);
    if (m) s = m[2];
    s = s.replace(/\(.*?\)/g, ' ').replace(/laptop gpu|max-q|with max-q design|\d+\s*gb/ig, ' ').replace(/geforce|radeon|nvidia|amd|intel|graphics|series/ig, ' ');
    return norm(s);
  }
  function matchGpu(text) {
    const parts = String(text || '').split(/\s;\s/).map(x => x.trim()).filter(Boolean);
    let integrated = false;
    const missed = [];   // 名前はあるのに、サイトのデータに見つからなかった専用GPU
    for (const p of parts) {
      const k = gpuKey(p);
      if (!k || /uhd|iris|vega|radeon\(tm\)\s*graphics|radeon graphics/i.test(p)) { integrated = true; continue; }
      const hit = GPUS.find(g => g.id !== 'igpu' && gpuKey(g.name) === k);
      if (hit) return { id: hit.id, from: p, laptop: /laptop/i.test(p) };
      missed.push(p);
    }
    if (missed.length) return { miss: missed.join(' ; '), laptop: /laptop/i.test(missed.join(' ')) };   // 内蔵グラフィックスに置きかえない
    return integrated ? { id: 'igpu', from: parts.join(' / ') } : null;
  }
  function matchCpu(text) {
    const toks = String(text || '').split(/\s+/).map(norm).filter(Boolean);
    const exact = CPUS.filter(c => { const t = cpuTok(c.name); return t && toks.indexOf(t) >= 0; }).sort((a, b) => cpuTok(b.name).length - cpuTok(a.name).length)[0];
    if (exact) return { id: exact.id, from: text };
    const base = t => t.replace(/[a-z]+$/, '');
    const near = CPUS.find(c => { const b = base(cpuTok(c.name)); return b.length >= 4 && /\d/.test(b) && toks.some(x => base(x) === b); });
    return near ? { id: near.id, from: text, near: true } : null;
  }

  /* ---------- 貼り付けた結果の読み取り ---------- */
  function parsePaste(text) {
    const o = {};
    String(text || '').split(/\r?\n/).forEach(l => { const m = l.match(/^([A-Z]+)=(.*)$/); if (m) o[m[1]] = m[2].trim(); });
    if (!o.CPU && !o.GPU) return null;
    return o;
  }

  /* ---------- ブラウザでの仮読み取り ---------- */
  function browserProbe() {
    const r = { threads: navigator.hardwareConcurrency || 0, gpuText: '' };
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        r.gpuText = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
      }
    } catch (e) { /* 読み取れない */ }
    return r;
  }

  /* ---------- ページ ---------- */
  const ST = { cpu: 'o:o-i5-12400', gpu: 'o:g-3060', memGB: 16, memType: '', psuW: 550, res: 1440, target: 100, games: null, sel: { gpu: true, cpu: false, mem: false, psu: false }, info: null, note: [] };

  U.route('/mypc', '今のPCから診断', function (el) {
    const pr = U.prefs();
    if (!ST.games) ST.games = (pr.games || []).slice(0, 4);
    if (!ST.games.length) ST.games = ['apex', 'valorant'];
    const opt = (list, grp) => list.map(x => '<option value="' + x.id + '">' + esc(x.name) + '</option>').join('');
    el.innerHTML = '<h1>今のPCから診断</h1>' +
      '<p class="muted tipify">いま使っているPCのパーツを読み取って、<b>買い替えたいパーツの候補・互換性・費用</b>を表示します。<b>Windows向け</b>です。読み取った内容は、このPCの中だけで処理し、どこにも送りません。</p>' +
      '<div class="card"><h2>① パーツを読み取る</h2>' +
      '<div class="row"><button class="btn sm" id="m-probe">ブラウザで仮読み取り（かんたん）</button></div>' +
      '<p class="muted sp">ブラウザの機能で、グラフィックボードの名前などを読み取ります。CPUの名前やメモリの量は分からないので、あとで下で選んでください。</p>' +
      '<details class="sp"><summary><b>正確に読み取る（確認用スクリプトを使う）</b></summary>' +
      '<ol class="sp"><li>下の「スクリプトをコピー」を押します。</li><li>Windowsのスタートボタンを右クリックして「ターミナル」または「PowerShell」を開きます。</li><li>貼り付けて Enter を押します（右クリックで貼り付けられます）。</li><li>出てきた文章は、自動でコピーされています。下の入力欄に貼り付けて、「読み込む」を押します。</li></ol>' +
      '<div class="row"><button class="btn sub sm" id="m-copy">スクリプトをコピー</button><button class="btn sub sm" id="m-dl">ファイルでダウンロード</button></div>' +
      '<p class="muted sp">スクリプトの中身は下のとおりです。パーツ名を読み取って文字にまとめるだけで、変更や送信はしません。</p>' +
      '<textarea readonly rows="6" style="width:100%;font-size:.78rem" id="m-ps"></textarea>' +
      '<textarea id="m-paste" rows="5" style="width:100%;margin-top:8px" placeholder="ここに貼り付け（PCRECIPE1 から始まる文章）"></textarea>' +
      '<div class="row sp"><button class="btn sm" id="m-load">読み込む</button></div></details>' +
      '<div id="m-msg" class="sp"></div></div>' +
      '<div class="card sp"><h2>② 今のPC（違っていたら直してください）</h2><div class="grid g2">' +
      '<div><label class="f">CPU</label><select id="m-cpu">' + opt(CPUS) + '</select></div>' +
      '<div><label class="f">グラフィックボード</label><select id="m-gpu">' + opt(GPUS) + '</select></div>' +
      '<div><label class="f">メモリの量</label><select id="m-mem">' + [8, 16, 32, 64].map(x => '<option value="' + x + '">' + x + 'GB</option>').join('') + '</select></div>' +
      '<div><label class="f">メモリの規格</label><select id="m-mt"><option value="">わからない</option><option value="DDR4">DDR4</option><option value="DDR5">DDR5</option></select></div>' +
      '<div><label class="f">電源の容量（箱やラベルで確認）</label><select id="m-psu">' + [450, 500, 550, 650, 750, 850, 1000].map(x => '<option value="' + x + '">' + x + 'W</option>').join('') + '</select></div>' +
      '<div><label class="f">画面の解像度 / 目標のfps</label><div class="row"><select id="m-res"><option value="1080">フルHD</option><option value="1440">WQHD</option><option value="2160">4K</option></select><select id="m-tg"><option>60</option><option>100</option><option>144</option><option>240</option></select></div></div></div>' +
      '<div id="m-info" class="sp"></div>' +
      '<details class="sp"><summary>遊ぶゲーム（<span id="m-gn"></span>本）</summary><div class="chips sp" id="m-games">' + D.games.map(g => '<label class="chip"><input type="checkbox" value="' + g.id + '"><span>' + esc(g.name.replace(/ \(.*\)$/, '')) + '</span></label>').join('') + '</div></details></div>' +
      '<div class="card sp"><h2>③ 替えたいパーツを選ぶ</h2><div class="chips" id="m-sel">' +
      [['gpu', 'グラフィックボード'], ['cpu', 'CPU'], ['mem', 'メモリ'], ['psu', '電源']].map(x => '<label class="chip"><input type="checkbox" value="' + x[0] + '"><span>' + x[1] + '</span></label>').join('') + '</div></div>' +
      '<div id="m-out" class="sp"></div>';

    $('#m-ps', el).value = PS;
    function setForm() {
      $('#m-cpu', el).value = ST.cpu; $('#m-gpu', el).value = ST.gpu; $('#m-mem', el).value = ST.memGB; $('#m-mt', el).value = ST.memType;
      $('#m-psu', el).value = ST.psuW; $('#m-res', el).value = ST.res; $('#m-tg', el).value = ST.target;
      $$('#m-games input', el).forEach(i => { i.checked = ST.games.indexOf(i.value) >= 0; });
      $$('#m-sel input', el).forEach(i => { i.checked = !!ST.sel[i.value]; });
    }
    function readForm() {
      ST.cpu = $('#m-cpu', el).value; ST.gpu = $('#m-gpu', el).value; ST.memGB = +$('#m-mem', el).value; ST.memType = $('#m-mt', el).value;
      ST.psuW = +$('#m-psu', el).value; ST.res = +$('#m-res', el).value; ST.target = +$('#m-tg', el).value;
      ST.games = $$('#m-games input:checked', el).map(i => i.value);
      $$('#m-sel input', el).forEach(i => { ST.sel[i.value] = i.checked; });
    }
    function showMsg(lines) {
      $('#m-msg', el).innerHTML = lines.map(l => '<div class="chk ' + l[0] + '"><span class="mk">' + (l[0] === 'ok' ? '✓' : '!') + '</span><div>' + l[1] + '</div></div>').join('');
    }

    /* 仮読み取り */
    $('#m-probe', el).onclick = () => {
      const r = browserProbe(), msg = [];
      const g = matchGpu(r.gpuText);
      if (g && g.id) { ST.gpu = g.id; msg.push(['ok', 'グラフィックボード: <b>' + esc(gpuById(g.id).name) + '</b> と読み取りました' + (g.laptop ? '（ノートPC用のGPUです。性能は少し低めです）' : '')]); }
      else if (g && g.miss) msg.push(['warn', 'グラフィックボード「' + esc(g.miss) + '」は、サイトのデータに見つかりませんでした。下で近いものを選んでください。' + (g.laptop ? '（ノートPC用のGPUは、交換できません）' : '')]);
      else msg.push(['warn', 'グラフィックボードの名前を読み取れませんでした' + (r.gpuText ? '（' + esc(r.gpuText) + '）' : '') + '。下で選んでください。']);
      msg.push(['warn', 'CPUは、スレッド数が <b>' + r.threads + '</b> と分かりました。名前は分からないので、下で選んでください。']);
      msg.push(['warn', 'メモリの量・規格、電源は、ブラウザからは分かりません。下で選んでください（正確に読み取るなら、確認用スクリプトが使えます）。']);
      showMsg(msg); setForm(); draw();
    };
    /* スクリプト */
    $('#m-copy', el).onclick = () => U.copy(PS);
    $('#m-dl', el).onclick = () => U.download('pc-recipe-check.ps1', '﻿' + PS, 'text/plain;charset=utf-8');
    $('#m-load', el).onclick = () => {
      const o = parsePaste($('#m-paste', el).value);
      if (!o) { showMsg([['warn', '読み込めませんでした。スクリプトの結果（PCRECIPE1 から始まる文章）を、そのまま貼り付けてください。']]); return; }
      const msg = [];
      const c = matchCpu(o.CPU || '');
      if (c) { ST.cpu = c.id; msg.push([c.near ? 'warn' : 'ok', 'CPU: <b>' + esc(cpuById(c.id).name) + '</b>' + (c.near ? '（近い型番を選びました。違っていたら下で直してください）' : '') + '　<span class="muted">読み取り: ' + esc(o.CPU) + '</span>']); }
      else msg.push(['warn', 'CPU「' + esc(o.CPU || '') + '」は、サイトのデータに見つかりませんでした。近いものを下で選んでください。']);
      const g = matchGpu(o.GPU || '');
      if (g && g.id) { ST.gpu = g.id; msg.push(['ok', 'グラフィックボード: <b>' + esc(gpuById(g.id).name) + '</b>　<span class="muted">読み取り: ' + esc(o.GPU) + '</span>']); }
      else if (g && g.miss) msg.push(['warn', 'グラフィックボード「' + esc(g.miss) + '」は、サイトのデータに見つかりませんでした。下で近いものを選んでください。' + (g.laptop ? '（ノートPC用のGPUは、交換できません）' : '')]);
      else msg.push(['warn', 'グラフィックボード「' + esc(o.GPU || '') + '」は、サイトのデータに見つかりませんでした。近いものを下で選んでください。']);
      const gb = +o.MEM; if (gb) { ST.memGB = [8, 16, 32, 64].reduce((a, b) => Math.abs(b - gb) < Math.abs(a - gb) ? b : a); msg.push(['ok', 'メモリ: <b>' + gb + 'GB</b>' + (o.MEMTYPE && o.MEMTYPE !== 'unknown' ? '（' + esc(o.MEMTYPE) + '）' : '')]); }
      if (o.MEMTYPE === 'DDR4' || o.MEMTYPE === 'DDR5') ST.memType = o.MEMTYPE;
      ST.info = { mb: o.MB || '', ssd: o.SSD || '' };
      msg.push(['warn', '電源の容量は読み取れません。下で選んでください（今は ' + ST.psuW + 'W）。']);
      showMsg(msg); setForm(); draw();
    };
    el.addEventListener('change', e => { if (e.target.closest('#m-paste')) return; readForm(); draw(); });

    /* ---------- 診断の表示 ---------- */
    function draw() {
      readForm();
      $('#m-gn', el).textContent = ST.games.length;
      const cpu = cpuById(ST.cpu), gpu = gpuById(ST.gpu), out = $('#m-out', el);
      $('#m-info', el).innerHTML = ST.info && (ST.info.mb || ST.info.ssd) ? '<p class="muted">読み取った情報（参考）: マザーボード ' + esc(ST.info.mb) + ' ／ ストレージ ' + esc(ST.info.ssd) + '</p>' : '';
      if (!ST.games.length) { out.innerHTML = '<div class="card"><p>遊ぶゲームをひとつ以上選んでください。</p></div>'; return; }
      const sel = ST.sel;
      if (!sel.gpu && !sel.cpu && !sel.mem && !sel.psu) { out.innerHTML = '<div class="card"><p class="muted">③で、替えたいパーツを選ぶと、候補が表示されます。</p></div>'; return; }
      const inp = { cpu: '', gpu: '', cpuObj: cpu, gpuObj: gpu, memGB: ST.memGB, psuW: ST.psuW, res: ST.res, games: ST.games, target: ST.target };
      const r = E.upgradeDiag(inp), n = ST.games.length;
      let h = '<div class="card"><h3>今のPCの目安（' + RES[ST.res] + '）</h3><div class="total">平均 約' + Math.round(r.now.avg) + 'fps</div><p>目標 ' + ST.target + 'fps に届くゲーム: <b>' + r.now.ok + ' / ' + n + '</b>' + (r.now.cpuLim ? '（うち ' + r.now.cpuLim + ' 本はCPUが先に限界）' : '') + '</p>' +
        r.advice.map(a => '<div class="chk ' + a.lv + '"><span class="mk">' + (a.lv === 'ok' ? '✓' : '!') + '</span><div><b>' + esc(a.t) + '</b>　' + esc(a.m) + '</div></div>').join('') + '</div>';

      if (sel.gpu) {
        const list = r.gpuOptions.slice(0, 40);
        const good = list.filter(o => o.r.ok >= n)[0];
        const show = list.filter((o, i) => i < 3 || o === good).slice(0, 5);
        h += '<div class="card sp"><h3>グラフィックボードを替えるなら</h3>';
        if (!show.length) h += '<p>今より大きく性能が上がる候補がありません。</p>';
        else h += '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th><th>平均fps</th><th>目標</th></tr></thead><tbody>' + show.map(o => {
          const g = o.gpu, ck = [];
          ck.push(o.psuNote ? ['warn', esc(o.psuNote)] : ['ok', '今の電源（' + ST.psuW + 'W）で足ります']);
          if (g.conn === '12V-2x6') ck.push(['warn', '12V-2x6コネクタ。電源に標準でなければ変換ケーブルが必要']);
          else if (g.conn === '8pin×2') ck.push(['warn', '8ピンを2本使います。電源の端子数を確認']);
          ck.push([g.len > 300 ? 'warn' : 'ok', '長さ 約' + g.len + 'mm、厚み 約' + g.slots + 'スロット。ケースの空きを確認']);
          if (o.r.cpuLim / n >= 0.6) ck.push(['warn', 'CPUが先に限界になりそう']);
          if (ST.memGB < 16) ck.push(['warn', 'メモリが少なめです']);
          return '<tr><td><b>' + esc(g.name) + '</b><br>' + ck.map(c => '<span class="' + (c[0] === 'ok' ? 'pos' : 'neg') + '" style="font-size:.82rem">' + (c[0] === 'ok' ? '✓ ' : '! ') + c[1] + '</span>').join('<br>') + '</td><td>' + yen(o.cost) + '</td><td>約' + Math.round(o.r.avg) + '</td><td>' + (o.r.ok >= n ? '◎' : o.r.ok + '/' + n) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
        h += '</div>';
      }
      if (sel.cpu) {
        const list = r.cpuOptions.slice(0, 5);
        h += '<div class="card sp"><h3>CPUを替えるなら</h3>';
        if (!list.length) h += '<p>今より大きく性能が上がる候補がありません。</p>';
        else h += '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th><th>平均fps</th></tr></thead><tbody>' + list.map(o => {
          const c = o.cpu, same = c.sock === cpu.sock, ck = [];
          ck.push(same ? ['ok', 'ソケットが同じ（' + c.sock + '）。CPUだけの交換でOK。BIOS更新が必要な場合あり'] : ['warn', 'ソケットが違う（' + cpu.sock + ' → ' + c.sock + '）。マザーボードも交換が必要']);
          const needDdr5 = c.sock === 'AM5' || c.sock === 'LGA1851';
          if (needDdr5 && ST.memType !== 'DDR5') ck.push(['warn', 'DDR5メモリが必要' + (ST.memType === 'DDR4' ? '（今はDDR4なので、メモリも交換）' : '（今のメモリの規格を確認）')]);
          if (!same) ck.push(['warn', 'CPUクーラーが新しいソケットに合うか確認']);
          const need = Math.max(0, Math.ceil((c.pw + (gpu.tgp || 0) + 80) * 1.25 / 50) * 50);
          ck.push(need > ST.psuW ? ['warn', '電源は ' + need + 'W 以上がおすすめ（今 ' + ST.psuW + 'W）'] : ['ok', '今の電源で足ります']);
          return '<tr><td><b>' + esc(c.name) + '</b><br>' + ck.map(x => '<span class="' + (x[0] === 'ok' ? 'pos' : 'neg') + '" style="font-size:.82rem">' + (x[0] === 'ok' ? '✓ ' : '! ') + x[1] + '</span>').join('<br>') + '</td><td>' + yen(o.cost) + '</td><td>約' + Math.round(o.r.avg) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
        h += '</div>';
      }
      if (sel.mem) {
        const types = ST.memType ? [ST.memType] : ['DDR4', 'DDR5'];
        const rows = [];
        types.forEach(t => [32, 64].forEach(cap => { if (cap <= ST.memGB) return; const m = D.mem.filter(x => x.type === t && x.cap === cap).sort((a, b) => a.price - b.price)[0]; if (m) rows.push(m); }));
        h += '<div class="card sp"><h3>メモリを替える・増やすなら</h3>' + (ST.memGB >= 32 ? '<p>' + ST.memGB + 'GBあるので、ほとんどのゲームで足ります。</p>' : '') + (rows.length ? '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th></tr></thead><tbody>' + rows.map(m => '<tr><td><b>' + esc(m.name) + '</b><br><span class="neg" style="font-size:.82rem">! マザーボードの規格（' + m.type + '）とスロットの空きを確認</span></td><td>' + yen(m.price) + '</td></tr>').join('') + '</tbody></table></div><p class="muted sp">いまのメモリを外して入れ替える前提の金額です。同じ規格のメモリを足せる場合もあります。</p>' : '<p>候補がありません。</p>') + (ST.memType ? '' : '<p class="muted">メモリの規格が分からないため、DDR4とDDR5の両方を表示しています。</p>') + '</div>';
      }
      if (sel.psu) {
        const topGpu = r.gpuOptions.slice(0, 3).reduce((m, o) => Math.max(m, Math.ceil((cpu.pw + o.gpu.tgp + 80) * 1.25 / 50) * 50), Math.ceil((cpu.pw + (gpu.tgp || 0) + 80) * 1.25 / 50) * 50);
        const ps = D.psu.filter(p => p.form === 'ATX' && p.w >= topGpu).sort((a, b) => a.price - b.price).slice(0, 3);
        h += '<div class="card sp"><h3>電源を替えるなら</h3><p>今のCPU・GPUと、上位のGPU候補までを考えると、<b>' + topGpu + 'W以上</b>がおすすめです（今 ' + ST.psuW + 'W）。</p>' + (ps.length ? '<div class="tbl-wrap"><table class="t"><thead><tr><th>候補</th><th>費用の目安</th></tr></thead><tbody>' + ps.map(p => '<tr><td><b>' + esc(p.name) + '</b><br><span class="neg" style="font-size:.82rem">! ケースの電源の規格（ATXかSFX）を確認</span></td><td>' + yen(p.price) + '</td></tr>').join('') + '</tbody></table></div>' : '') + '</div>';
      }
      h += '<p class="muted sp">価格・fpsは目安です。ケースの大きさ、マザーボードの規格、電源のケーブルは、購入前に必ず製品ページで確認してください。</p>';
      out.innerHTML = h; U.tipify(out);
    }
    setForm(); draw();
  }, '/tools');
})();
