/* ============================================================
   第2弾: 予算で最強構成 / BTOモデル比較 / 購入ガイド / ツール集
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;
  const RES = { 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' };
  const MAKER_NAME = k => (CFG.affiliate.bto[k] || {}).name || k;

  /* ---------- 予算で最強構成 ---------- */
  const BEST = { budget: 250000, purpose: 'game', res: 1440, size: 'mid', quiet: false };

  U.route('/best', '予算で最強構成', function (el) {
    const prefGames = (U.prefs().games || []).filter(id => D.by.games[id]);
    const games = prefGames.length ? prefGames : ['apex', 'valorant'];
    el.innerHTML = '<h1>予算で最強構成</h1><p class="muted tipify">予算を決めると、<b>その金額でいちばん性能が高くなる組み合わせ</b>を探します。さらに「あと何円足すと、どれだけ速くなるか」も表示します。</p>' +
      '<div class="card"><div class="grid g2">' +
      '<div><label class="f">予算（税込・目安）: <b id="bv"></b></label><input type="range" id="bs" min="100000" max="600000" step="10000"></div>' +
      '<div><label class="f">使い道</label><select id="bp"><option value="game">ゲーム中心</option><option value="stream">ゲーム＋配信</option><option value="edit">動画編集もする</option></select></div>' +
      '<div><label class="f">画面の解像度</label><select id="br"><option value="1080">フルHD</option><option value="1440">WQHD</option><option value="2160">4K</option></select></div>' +
      '<div><label class="f">大きさの好み</label><select id="bz"><option value="mini">小型</option><option value="compact">コンパクト</option><option value="mid">標準</option><option value="large">大型</option></select></div>' +
      '</div><div class="row sp"><label class="chip"><input type="checkbox" id="bq"><span>静音重視</span></label></div></div><div id="out" class="sp"></div>';
    $('#bs', el).value = BEST.budget; $('#bp', el).value = BEST.purpose; $('#br', el).value = BEST.res; $('#bz', el).value = BEST.size; $('#bq', el).checked = BEST.quiet;
    const ctx = () => Object.assign(U.prefs(), { res: BEST.res, games: games, stream: BEST.purpose === 'stream' });
    function run(budget) {
      return E.autoBuild({ budget: budget, game: true, games: games, res: BEST.res, target: 144, edit: BEST.purpose === 'edit' ? '4k' : 'none', stream: BEST.purpose === 'stream', size: BEST.size, quiet: BEST.quiet, os: true, maxPerf: true });
    }
    function evalOf(rec) { return E.evaluate(rec.ids, ctx()); }
    function draw() {
      $('#bv', el).textContent = yen(BEST.budget);
      const main = run(BEST.budget), ev = evalOf(main), B = ev.B;
      let h = '<div class="card"><div class="row" style="justify-content:space-between"><h2>' + yen(BEST.budget) + 'で組める、性能重視の構成</h2><span class="badge ' + (main.over ? 'warn' : 'ok') + '">' + (main.over ? '予算が足りません' : '予算内') + '</span></div>' +
        '<div class="total">' + yen(ev.total) + '</div>' +
        (main.over ? '<div class="chk warn sp"><span class="mk">!</span><div>この予算では組めなかったため、条件を満たす中でいちばん安い構成を出しています。</div></div>' : '') +
        '<table class="t sp"><tbody>' + ['cpu', 'gpu', 'mem', 'ssd', 'mb', 'psu', 'case', 'cooler'].map(k => '<tr><th>' + E.LABEL[k] + '</th><td>' + esc(B[k].name) + '</td></tr>').join('') + '</tbody></table>' +
        '<div class="sp">' + ev.fpsRows.map(f => '<div class="row" style="justify-content:space-between;font-size:.92rem"><span>' + esc(f.game.name.replace(/ \(.*\)$/, '')) + '（' + RES[BEST.res] + '）</span><b>約' + Math.round(f.fps) + 'fps</b></div>').join('') + '</div>' +
        '<p class="muted">平均 <b>約' + Math.round(ev.avgFps) + 'fps</b>。fpsは計算モデルによる目安で、実測ではありません。</p>' +
        '<div class="row sp"><a class="btn sm" href="#/build?' + U.idsToQuery(main.ids) + '">自作で組む</a><a class="btn sub sm" href="#/bto?cpu=' + main.ids.cpu + '&gpu=' + main.ids.gpu + '&mem=' + main.ids.mem + '&ssd=' + main.ids.ssd + '&size=' + BEST.size + (BEST.quiet ? '&quiet=1' : '') + '">BTOで探す</a><button class="btn sub sm" id="sv">保存</button></div></div>';

      // あと◯円で…（上の段階）／ ◯円へらすと…（下の段階）
      const steps = [-50000, -30000, 30000, 50000, 100000].filter(d => BEST.budget + d >= 100000 && BEST.budget + d <= 800000);
      const rows = []; const seen = {}; seen[JSON.stringify(main.ids)] = 1;
      steps.forEach(d => {
        const r = run(BEST.budget + d); const key = JSON.stringify(r.ids);
        if (seen[key]) return; seen[key] = 1;
        const e = evalOf(r);
        rows.push({ d: d, r: r, e: e });
      });
      h += '<div class="card sp"><h2>予算を変えるとどうなる？</h2>';
      if (!rows.length) h += '<p class="muted">この前後の予算では、構成はほぼ変わりません。</p>';
      else {
        h += '<div class="tbl-wrap"><table class="t"><thead><tr><th>予算の変化</th><th>合計</th><th>変わるところ</th><th>平均fps</th></tr></thead><tbody>' +
          rows.sort((a, b) => a.d - b.d).map(x => {
            const diff = [];
            ['cpu', 'gpu', 'mem', 'ssd'].forEach(k => { if (x.r.ids[k] !== main.ids[k]) diff.push(E.LABEL[k] + ': ' + esc(D.by[k][x.r.ids[k]].name)); });
            const gain = x.e.avgFps - ev.avgFps;
            return '<tr><td><b>' + (x.d > 0 ? 'あと ' + yen(x.d) : yen(-x.d) + ' へらす') + '</b></td><td>' + yen(x.e.total) + '</td><td>' + (diff.join('<br>') || '周辺パーツが変わります') + '</td><td>約' + Math.round(x.e.avgFps) + 'fps <span class="muted">(' + (gain >= 0 ? '+' : '') + Math.round(gain) + ')</span></td></tr>';
          }).join('') + '</tbody></table></div>' +
          '<p class="muted sp">足したお金に対して、fpsがあまり増えない段階は「お得感が薄い」目安です。</p>';
      }
      h += '</div>';
      $('#out', el).innerHTML = h;
      const sv = $('#sv', el); if (sv) sv.onclick = () => { const r = U.saveBuild('最強構成 ' + yen(BEST.budget), main.ids, 'build'); U.toast(r.ok ? '保存しました' : r.msg); };
    }
    $('#bs', el).oninput = e => { BEST.budget = +e.target.value; draw(); };
    $('#bp', el).onchange = e => { BEST.purpose = e.target.value; draw(); };
    $('#br', el).onchange = e => { BEST.res = +e.target.value; draw(); };
    $('#bz', el).onchange = e => { BEST.size = e.target.value; draw(); };
    $('#bq', el).onchange = e => { BEST.quiet = e.target.checked; draw(); };
    draw();
  });

  /* ---------- BTOモデル比較 ---------- */
  const CMP = { maker: '', gpu: '', max: '', sort: 'price' };
  // BTOのメモリ容量 → 同じ容量の自作用メモリ（AM4などDDR4の土台ならDDR4）。8GBのモデルは16GBで近似
  const memId = (gb, cpu) => E.memFor(gb >= 64 ? 64 : gb >= 48 ? 48 : gb >= 32 ? 32 : 16, E.platformTypes(D.by.cpu[cpu].sock)[0]);
  const ssdId = tb => tb >= 4 ? 'g4-4' : tb >= 2 ? 'g4-2' : tb >= 1 ? 'g4-1' : 'g4-500';

  U.route('/compare', 'BTOモデル比較', function (el) {
    const models = (window.PCR_BTO_MODELS || []).filter(m => D.by.cpu[m.cpu] && D.by.gpu[m.gpu]);
    const mk = Object.keys(CFG.affiliate.bto).filter(k => models.some(m => m.maker === k)).map(MAKER_NAME);
    let h = '<h1>BTOモデル比較</h1><p class="muted tipify">' + (mk.length ? esc(mk.join('・')) : 'BTOメーカー') + 'のモデルを、<b>同じ中身で自作したときの目安</b>と比べます。価格は各メーカー公式サイトの表示価格（確認日はカードに記載）で、セールなどで毎日変わります。</p>';
    if (!models.length) {
      h += '<div class="card"><h2>モデルのデータは、まだ入っていません</h2><p>このページは、<code>tools/bto-models.csv</code> にモデルを入れて <code>node tools/update-prices.mjs</code> を実行すると、自動で表示されます。</p>' +
        '<p class="muted">正しい価格が確認できていないものを、勝手に表示することはしません。データを入れるまでは、下の「BTOと自作のちがい」と、各社のページへのリンクを使ってください。</p>' +
        '<div class="row sp"><a class="btn" href="#/bto">BTOパソコン選びへ</a><a class="btn sub" href="#/best">予算で最強構成へ</a></div></div>';
    } else {
      h += '<div class="card"><div class="grid g3"><div><label class="f">メーカー</label><select id="cm"><option value="">すべて</option>' + Object.keys(CFG.affiliate.bto).filter(k => models.some(m => m.maker === k)).map(k => '<option value="' + k + '">' + esc(MAKER_NAME(k)) + '</option>').join('') + '</select></div>' +
        '<div><label class="f">グラフィックボード</label><select id="cg"><option value="">すべて</option>' + D.gpu.filter(g => g.id !== 'none').map(g => '<option value="' + g.id + '">' + esc(g.name) + '</option>').join('') + '</select></div>' +
        '<div><label class="f">上限金額（円）</label><input type="number" id="cx" min="0" step="10000" placeholder="例 300000"></div></div>' +
        '<div class="row sp"><label class="f" style="margin:0">並び順</label><select id="cs" style="width:auto"><option value="price">安い順</option><option value="perf">性能が高い順</option><option value="value">コスパ順（性能÷価格）</option></select></div></div><div id="list" class="sp"></div>';
    }
    h += '<div class="card sp tipify"><h2>BTOと自作のちがい</h2><div class="tbl-wrap"><table class="t"><thead><tr><th></th><th>BTO（完成品）</th><th>自作</th></tr></thead><tbody>' +
      '<tr><th>手間</th><td>注文して待つだけ</td><td>パーツ選びと組み立てが必要</td></tr>' +
      '<tr><th>保証</th><td>まとめて1か所に相談できる</td><td>パーツごとに別々</td></tr>' +
      '<tr><th>値段</th><td>組み立て代込み。セールで安くなることも</td><td>選び方しだいで安くできるが、OSなども別買い</td></tr>' +
      '<tr><th>選べる自由度</th><td>メーカーが用意した範囲</td><td>ほぼ自由</td></tr>' +
      '<tr><th>向いている人</th><td>初めて・時間がない・サポート重視</td><td>こだわりたい・安くしたい・組み立てが楽しみ</td></tr></tbody></table></div>' +
      '<p class="muted sp">迷ったら、まず <a href="#/guide/bto-or-diy">BTOか自作か</a> の読みものをどうぞ。</p></div>';
    el.innerHTML = h;
    if (!models.length) return;

    $('#cm', el).value = CMP.maker; $('#cg', el).value = CMP.gpu; $('#cx', el).value = CMP.max; $('#cs', el).value = CMP.sort;
    function draw() {
      let list = models.filter(m => (!CMP.maker || m.maker === CMP.maker) && (!CMP.gpu || m.gpu === CMP.gpu) && (!CMP.max || m.price <= +CMP.max));
      const info = list.map(m => {
        const ids = E.complete({ cpu: m.cpu, gpu: m.gpu, mem: memId(m.memGB, m.cpu), ssd: ssdId(m.ssdTB) }, {});
        const ev = E.evaluate(ids, U.prefs());
        const perf = D.by.cpu[m.cpu].gs * 0.3 + D.by.gpu[m.gpu].score * 0.7;
        return { m: m, ev: ev, ids: ids, perf: perf, diy: ev.total, value: perf / m.price * 10000 };
      });
      info.sort((a, b) => CMP.sort === 'perf' ? b.perf - a.perf : CMP.sort === 'value' ? b.value - a.value : a.m.price - b.m.price);
      $('#list', el).innerHTML = !info.length ? '<div class="card"><p>条件に合うモデルがありません。</p></div>' :
        '<div class="grid g2">' + info.map(x => {
          const m = x.m, d = m.price - x.diy;
          return '<div class="card"><div class="muted">' + esc(MAKER_NAME(m.maker)) + '</div><h3>' + esc(m.name) + '</h3><div class="total">' + yen(m.price) + '</div>' +
            '<table class="t sp"><tbody><tr><th>CPU</th><td>' + esc(D.by.cpu[m.cpu].name) + '</td></tr><tr><th>GPU</th><td>' + esc(D.by.gpu[m.gpu].name) + '</td></tr><tr><th>メモリ/SSD</th><td>' + m.memGB + 'GB / ' + (m.ssdTB < 1 ? Math.round(m.ssdTB * 1000) + 'GB' : m.ssdTB + 'TB') + '</td></tr>' +
            (m.warranty ? '<tr><th>保証</th><td>' + m.warranty + '年</td></tr>' : '') + (m.days ? '<tr><th>納期の目安</th><td>' + m.days + '日</td></tr>' : '') + '</tbody></table>' +
            '<p class="sp">同じ中身で自作すると 約' + yen(x.diy) + '。BTOは<b>' + (d >= 0 ? '約' + yen(d) + ' 高い' : '約' + yen(-d) + ' 安い') + '</b>（組み立て・保証・サポート込みの価格）。</p>' +
            '<div class="muted">価格確認日: ' + esc(m.updated) + '</div>' +
            '<div class="row sp"><span class="pr">PR</span>' + (U.makerIsAd(m.maker)
              // 広告リンクがあるメーカー: 広告リンク（公式サイトのトップ）と、商品ページへの直接リンクを並べる
              ? '<a class="btn sm" target="_blank" rel="sponsored noopener" href="' + esc(U.makerLink(m.maker)) + '">' + esc(MAKER_NAME(m.maker)) + '公式サイトへ</a>' + U.makerImp(m.maker) + (m.url ? '<a class="btn sub sm" target="_blank" rel="noopener" href="' + esc(m.url) + '">商品ページ</a>' : '')
              : (m.url ? '<a class="btn sm" target="_blank" rel="sponsored noopener" href="' + esc(m.url) + '">商品ページへ</a>' : '<a class="btn sm" target="_blank" rel="sponsored noopener" href="' + esc(U.makerLink(m.maker)) + '">公式ページへ</a>')) +
            '<a class="btn sub sm" href="#/build?' + U.idsToQuery(x.ids) + '">自作で組む</a></div></div>';
        }).join('') + '</div><p class="muted sp">「自作の目安」は、このサイトの価格データでの計算です。BTOの価格は各社の標準構成（OS込み）で、送料が別にかかるメーカーもあります。セールで毎日変わるため、購入前に商品ページで確認してください。</p>';
    }
    $('#cm', el).onchange = e => { CMP.maker = e.target.value; draw(); };
    $('#cg', el).onchange = e => { CMP.gpu = e.target.value; draw(); };
    $('#cx', el).oninput = e => { CMP.max = e.target.value; draw(); };
    $('#cs', el).onchange = e => { CMP.sort = e.target.value; draw(); };
    draw();
  }, '/bto');

  /* ---------- 購入ガイド ---------- */
  const SALES = [
    ['1月', '初売り・福袋セール', 'お正月明けに、各社が初売りセールをすることが多い時期です。'],
    ['2〜3月', '新生活セール', '進学・就職にあわせて、学生向けや新生活向けのキャンペーンが増えます。'],
    ['6月', '決算・ボーナス前セール', '夏のボーナスに合わせたセールが出やすい時期です。'],
    ['7月', 'Amazonプライムデー', '例年、夏にパーツがセールになることがあります。日程は毎年発表されます。'],
    ['11月', 'ブラックフライデー', 'パーツ・BTOともに、1年でいちばん割引が大きくなりやすい時期です。'],
    ['12月', '年末セール', '年末に向けたセールや、福袋の予告が出ることがあります。']
  ];
  const LISTS = {
    before: ['予算の上限を決めた（OS・周辺機器の分も含めた）', '遊びたいゲームの推奨スペックを確認した', 'モニターのサイズ・解像度・リフレッシュレートを決めた', '置く場所の広さと、ケースの大きさを確認した', 'キーボード・マウス・モニターなど、買い足すものを確認した', 'このサイトで互換性チェック（NGなし）を確認した'],
    bto: ['CPU・GPU・メモリ・SSDが希望どおりか、商品ページで確認した', '電源の容量と、ブランド（80PLUSの等級）を確認した', 'マザーボードの種類・メモリの空きスロット数を確認した', '保証の年数と、サポートの連絡方法を確認した', '納期（発送までの日数）を確認した', 'OS（Windows）が含まれているか確認した', 'セールの期限と、キャンセル条件を確認した'],
    diy: ['CPUとマザーボードのソケットが同じか確認した', 'ケースにグラボが入る長さか確認した', 'CPUクーラーの高さがケースに入るか確認した', '電源の容量とコネクタ（12V-2x6など）を確認した', 'メモリの規格（DDR5）とマザーボードが合っているか確認した', 'OS（Windows）のライセンスを用意した', '最新のBIOSが必要なCPUか確認した', '組み立てに使うドライバー・結束バンドを用意した'],
    after: ['初期不良がないか、届いてすぐ動作確認した', 'Windows Updateとドライバーを更新した', 'GPUの温度とファンの音を確認した', 'メモリが正しい速度で動いているか確認した（XMP/EXPO）', '保証書・レシートを保管した', '大切なデータのバックアップ方法を決めた']
  };
  const LNAME = { before: '買う前', bto: 'BTOを注文するとき', diy: '自作のパーツを買うとき', after: '届いたあと' };

  U.route('/buy', '購入ガイド', function (el) {
    const st = U.store.get('pcr.check.v1', {});
    el.innerHTML = '<h1>購入ガイド</h1><p class="muted tipify">セールの時期の目安と、買う前・買うとき・届いたあとのチェックリストです。チェックはこの端末に保存されます。</p>' +
      '<div class="card"><h2>セール時期の目安（例年の傾向）</h2><div class="tbl-wrap"><table class="t"><tbody>' + SALES.map(s => '<tr><th>' + s[0] + '</th><td><b>' + s[1] + '</b><div class="muted">' + s[2] + '</div></td></tr>').join('') + '</tbody></table></div>' +
      '<p class="muted sp">実際の開催日や内容は毎年変わります。各社の公式ページで必ず確認してください。「今が買い時か」は <a href="#/guide/timing">買い時の読みもの</a> も参考にどうぞ。</p></div>' +
      '<div class="sp" id="lists"></div><div class="row sp"><button class="btn sub sm" id="rst">チェックをすべて外す</button></div>';
    function draw() {
      $('#lists', el).innerHTML = '<div class="grid g2">' + Object.keys(LISTS).map(k => {
        const done = LISTS[k].filter((_, i) => st[k + i]).length;
        return '<div class="card"><div class="row" style="justify-content:space-between"><h3>' + LNAME[k] + '</h3><span class="badge ' + (done === LISTS[k].length ? 'ok' : 'warn') + '">' + done + '/' + LISTS[k].length + '</span></div>' +
          LISTS[k].map((t, i) => '<label class="chk-row" style="display:flex;gap:8px;align-items:flex-start;padding:6px 0"><input type="checkbox" data-k="' + k + i + '"' + (st[k + i] ? ' checked' : '') + '><span>' + esc(t) + '</span></label>').join('') + '</div>';
      }).join('') + '</div>';
      $$('input[data-k]', el).forEach(c => c.onchange = () => { if (c.checked) st[c.dataset.k] = 1; else delete st[c.dataset.k]; U.store.set('pcr.check.v1', st); draw(); });
    }
    $('#rst', el).onclick = () => { Object.keys(st).forEach(k => delete st[k]); U.store.set('pcr.check.v1', st); draw(); };
    draw();
  });

  /* ---------- ツール集 ---------- */
  U.route('/tools', 'ツール集', function (el) {
    const items = [
      ['/best', '💰 予算で最強構成', '予算に合わせて、いちばん性能が高い組み合わせを探します'],
      ['/server', '🖥 サーバー用PC診断', 'ARK・マイクラ・パルワールドなどのサーバー向け構成と電気代'],
      ['/mypc', '💻 今のPCから診断', 'いま使っているPCのパーツを読み取って、買い替え候補と互換性を表示します'],
      ['/upgrade', '🔧 アップグレード診断', '今のPCのどこを替えると効果が大きいか調べます'],
      ['/games', '🎮 ゲーム別fps', 'GPUごとのfpsの目安を見比べます'],
      ['/compare', '📊 BTOモデル比較', 'BTOと自作の値段のちがいを比べます'],
      ['/history', '📈 価格の推移', 'パーツの価格グラフと、今が安いかの目安'],
      ['/buy', '🛒 購入ガイド', 'セール時期とチェックリスト']
    ];
    el.innerHTML = '<h1>ツール集</h1><div class="grid g2">' + items.map(i => '<a class="card card-link" href="#' + i[0] + '"><h3>' + i[1] + '</h3><p class="muted">' + i[2] + '</p></a>').join('') + '</div>';
  });
})();
