/* ============================================================
   ホーム / 読みもの / 保存 / このサイトについて
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const $ = U.$, $$ = U.$$, esc = U.esc, yen = U.yen;

  /* ---------- ホーム ---------- */
  U.route('/', '', function (el) {
    const saved = (U.store.get('pcr.saved.v1', []) || []).length;
    const last = U.store.get('pcr.last.build', null);
    const goal = (href, ico, t, d, main) => '<a class="goal' + (main ? ' main' : '') + '" href="' + href + '"><span class="g-ico">' + ico + '</span><span class="g-tx"><b>' + t + '</b><span>' + d + '</span></span><span class="g-go" aria-hidden="true">›</span></a>';
    el.innerHTML =
      '<section class="hero home-hero"><h1>はじめてでも迷わない、<br>PCの“レシピ”づくり。</h1>' +
      '<p class="lead tipify">用途と予算を答えるだけで、おすすめのパーツの組み合わせが分かります。パーツ同士が合うか、電源は足りるか、ゲームが何fpsで動くかも、その場でチェックできます。</p>' +
      '<div class="row sp"><a class="btn" href="#/wizard">🧭 まず診断してみる（約1分）</a></div></section>' +
      '<h2 class="sp2">何をしたいですか？</h2>' +
      '<div class="goals">' +
        goal('#/wizard', '🧭', 'おすすめのPCを知りたい', '用途と予算を答えるだけ。3つのプランを提案します', true) +
        goal('#/compare', '⚖️', 'BTOパソコンを比べたい', '6社・' + ((window.PCR_BTO_MODELS || []).length) + '機種を、同じ中身の自作と比べます') +
        goal('#/build', '🔧', '自分でパーツを選んで組みたい', '合わない組み合わせは、すぐ教えます') +
        goal('#/mypc', '💻', '今のPCを強化したい', '今のパーツを読み取って、替える候補と費用を出します') +
        goal('#/server', '🖥', 'ゲームのサーバーを建てたい', 'ARK・マイクラ・パルワールドなど。24時間の電気代も') +
        goal('#/games', '🎮', 'ゲームが何fpsで動くか知りたい', D.games.length + '本のゲームを、グラボごとに比べます') +
        goal('#/match', '🧩', 'CPUとグラボの相性を知りたい', 'ムダのない組み合わせが、ひと目で分かります') +
      '</div>' +
      (last || saved ? '<div class="card flat sp2 resume"><b>前回の続き</b><div class="row sp">' + (last ? '<a class="btn sub sm" href="#/build?' + U.idsToQuery(last) + '">🔧 前回の自作構成を開く</a>' : '') + (saved ? '<a class="btn sub sm" href="#/saved">⭐ 保存した構成（' + saved + '件）</a>' : '') + '</div></div>' : '') +
      '<h2 class="sp2">はじめての人へ</h2><div class="grid g3">' +
        [['guide/bto-or-diy.html', '🤔', 'BTOと自作、どっちがいい？'], ['guide/checklist.html', '✅', 'BTO購入チェックリスト'], ['guide/glossary.html', '📖', 'むずかしい言葉の用語集']]
          .map(a => '<a class="card flat card-link feat" href="' + a[0] + '"><span class="ico">' + a[1] + '</span><span><b>' + a[2] + '</b></span></a>').join('') + '</div>' +
      '<div class="card flat sp2"><h3>ご利用にあたって</h3><ul><li>fps・性能の数値は、実測ではなく<b>計算モデルによる目安</b>です。</li><li>価格は<b>' + esc(D.priceDate || CFG.dataDate) + '</b>時点の目安です。購入前に必ずお店で確認してください。</li><li>互換性チェックは参考情報です。購入前に、メーカーの製品ページで<b>対応情報を必ず確認</b>してください。詳しくは<a href="#/about">このサイトについて</a>へ。</li></ul></div>';
  });

  U.route('/404', 'ページが見つかりません', function (el) {
    el.innerHTML = '<div class="card"><h1>ページが見つかりません</h1><p><a class="btn" href="#/">ホームへ戻る</a></p></div>';
  });

  /* ---------- 読みもの ---------- */
  U.route('/guide', '読みもの・用語集', function (el, q, arg) {
    if (arg === 'glossary') {
      el.innerHTML = '<p><a href="#/guide">← 読みもの一覧</a></p><h1>用語集</h1><input type="text" id="gq" placeholder="言葉をしぼりこむ（例: メモリ）" aria-label="用語を検索"><div class="card sp"><dl id="gl"></dl></div>';
      const dl = $('#gl', el);
      const draw = () => {
        const w = $('#gq', el).value.trim().toLowerCase();
        const list = D.glossary.slice().sort((a, b) => a[0].localeCompare(b[0], 'ja')).filter(g => !w || (g[0] + g[1]).toLowerCase().indexOf(w) >= 0);
        dl.innerHTML = list.length ? list.map(g => '<dt style="font-weight:800;margin-top:12px">' + esc(g[0]) + '</dt><dd style="margin:0">' + esc(g[1]) + '</dd>').join('') : '<p class="muted">見つかりませんでした。</p>';
      };
      $('#gq', el).addEventListener('input', draw); draw(); return;
    }
    if (arg) {
      const a = D.articles.find(x => x.id === arg);
      if (!a) { el.innerHTML = '<div class="card"><p>記事が見つかりません。</p><a href="#/guide">一覧へ</a></div>'; return; }
      document.title = a.title + ' | ' + CFG.siteName;
      const i = D.articles.indexOf(a), nx = D.articles[i + 1];
      el.innerHTML = '<p><a href="#/guide">← 読みもの一覧</a></p><article class="article tipify"><h1>' + esc(a.title) + '</h1><p class="muted">' + esc(a.lead) + '</p>' + a.html +
        '</article><div class="row sp2"><a class="btn" href="#/wizard">診断してみる</a>' + (nx ? '<a class="btn sub" href="#/guide/' + nx.id + '">次: ' + esc(nx.title) + '</a>' : '') + '</div>';
      return;
    }
    el.innerHTML = '<h1>読みもの・用語集</h1><p class="muted">はじめての人向けに、やさしく解説しています。</p><div class="grid g2">' +
      D.articles.map(a => '<a class="card card-link" href="#/guide/' + a.id + '"><h3>' + esc(a.title) + '</h3><p class="muted">' + esc(a.lead) + '</p></a>').join('') +
      '<a class="card card-link" href="#/guide/glossary"><h3>📖 用語集</h3><p class="muted">CPU・GPU・VRAMなど、' + D.glossary.length + '個の言葉をやさしく説明しています。</p></a></div>';
  });

  /* ---------- 保存ページ ---------- */
  const MODE = { build: '自作', bto: 'BTO' };
  U.route('/saved', '保存した構成', function (el) {
    const sel = [];
    function openLink(s) {
      return s.mode === 'bto' ? '#/bto?cpu=' + s.ids.cpu + '&gpu=' + s.ids.gpu + '&mem=' + s.ids.mem + '&ssd=' + s.ids.ssd : '#/build?' + U.idsToQuery(s.ids);
    }
    function compareHtml() {
      if (sel.length !== 2) return '<p class="muted">比べたい構成を2つ選ぶと、ここに表示されます。</p>';
      const list = U.getSaved(), A = list.find(x => x.id === sel[0]), B = list.find(x => x.id === sel[1]);
      if (!A || !B) return '';
      const c = U.prefs(), a = E.evaluate(A.ids, c), b = E.evaluate(B.ids, c);
      const row = (lbl, x, y) => '<tr><th>' + lbl + '</th><td' + (x !== y ? ' style="font-weight:800"' : '') + '>' + x + '</td><td' + (x !== y ? ' style="font-weight:800"' : '') + '>' + y + '</td></tr>';
      return '<div class="tbl-wrap"><table class="t"><thead><tr><th></th><th>' + esc(A.name) + '</th><th>' + esc(B.name) + '</th></tr></thead><tbody>' +
        E.KEYS.map(k => row(E.LABEL[k], esc(a.B[k].name), esc(b.B[k].name))).join('') +
        row('合計', yen(a.total), yen(b.total)) + row('平均fps(目安)', Math.round(a.avgFps) + 'fps', Math.round(b.avgFps) + 'fps') + row('電源の推奨', a.power.rec + 'W', b.power.rec + 'W') + row('電気代(月)', yen(a.monthly), yen(b.monthly)) +
        '</tbody></table></div><p class="muted">差があるところは太字です。fpsは「見積もりの条件」（' + ({ 1080: 'フルHD', 1440: 'WQHD', 2160: '4K' }[c.res]) + '・選択中のゲーム）での目安です。</p>';
    }
    function draw() {
      const list = U.getSaved(), fav = U.getFav();
      let h = '<h1>保存した構成・お気に入り</h1><div class="chk warn"><span class="mk">!</span><div>この画面の保存は、<b>このブラウザの中</b>にだけ残ります。ブラウザのデータを消すと消えます。大事な構成は「共有URL」や下の「ファイルで書き出し」でも残しておきましょう。</div></div>';
      h += '<div class="card sp"><h2>保存した構成（' + list.length + ' / 20）</h2>';
      if (!list.length) h += '<p class="muted">まだありません。<a href="#/build">自作ビルダー</a>や<a href="#/bto">BTOモード</a>、<a href="#/wizard">診断</a>から保存できます。</p>';
      else h += '<div class="tbl-wrap"><table class="t"><thead><tr><th>比べる</th><th>名前</th><th>合計(目安)</th><th>保存日</th><th></th></tr></thead><tbody>' +
        list.map(s => '<tr><td><input type="checkbox" data-cmp="' + s.id + '"' + (sel.indexOf(s.id) >= 0 ? ' checked' : '') + ' aria-label="比較に選ぶ"></td><td><b>' + esc(s.name) + '</b><br><span class="badge ok">' + MODE[s.mode] + '</span> ' + esc(D.by.cpu[s.ids.cpu].name) + ' / ' + esc(D.by.gpu[s.ids.gpu].name) + '</td><td>' + yen(s.total) + '</td><td>' + new Date(s.date).toLocaleDateString('ja-JP') + '</td>' +
          '<td><div class="row"><a class="btn sm" href="' + openLink(s) + '">開く</a><button class="btn sub sm" data-ren="' + s.id + '">名前</button><button class="btn sub sm" data-dup="' + s.id + '">複製</button><button class="btn sub sm" data-del="' + s.id + '">削除</button></div></td></tr>').join('') + '</tbody></table></div>';
      h += '</div><div class="card sp"><h2>構成を比べる</h2><div id="cmp">' + compareHtml() + '</div></div>';
      h += '<div class="card sp"><h2>★ お気に入りのパーツ（' + fav.length + '）</h2>' + (fav.length ? fav.filter(f => D.by[f.k] && D.by[f.k][f.id]).map(f => { const p = D.by[f.k][f.id]; return '<div class="row" style="justify-content:space-between;margin-bottom:8px"><span><span class="badge ok">' + E.LABEL[f.k] + '</span> ' + esc(p.name) + ' ' + (p.price ? yen(p.price) : '') + '</span><span>' + U.links(p.q) + ' <button class="btn sub sm" data-unfav="' + f.k + ':' + f.id + '">外す</button></span></div>'; }).join('') : '<p class="muted">自作ビルダーの各パーツの ☆ を押すと、ここに集まります。</p>') + '</div>';
      h += '<div class="card sp"><h2>バックアップ（ファイル）</h2><p class="muted">保存した構成・お気に入り・価格メモを1つのファイルに書き出して、別の端末で読み込めます。</p><div class="row"><button class="btn sub" id="ex">⬇ 書き出す</button><label class="btn sub" style="cursor:pointer">⬆ 読み込む<input type="file" id="im" accept="application/json,.json" hidden></label></div></div>';
      el.innerHTML = h;
    }
    draw();
    el.addEventListener('click', e => {
      const t = e.target;
      const list = U.getSaved();
      if (t.dataset.del) { U.updateSaved(list.filter(x => x.id !== t.dataset.del)); const i = sel.indexOf(t.dataset.del); if (i >= 0) sel.splice(i, 1); draw(); }
      if (t.dataset.dup) { const s = list.find(x => x.id === t.dataset.dup); if (s && list.length < 20) { list.unshift(Object.assign({}, s, { id: 's' + Date.now().toString(36), name: s.name + ' (コピー)', date: new Date().toISOString() })); U.updateSaved(list); draw(); } else U.toast('保存できるのは20件までです'); }
      if (t.dataset.ren) { const s = list.find(x => x.id === t.dataset.ren); const n = s && prompt('新しい名前', s.name); if (n && n.trim()) { s.name = n.trim().slice(0, 30); U.updateSaved(list); draw(); } }
      if (t.dataset.unfav) { const [k, id] = t.dataset.unfav.split(':'); U.toggleFav(k, id); draw(); }
      if (t.id === 'ex') U.download('pc-recipe-backup.json', JSON.stringify({ v: 1, saved: list, fav: U.getFav(), memo: U.store.get('pcr.btoMemo.v1', []) }, null, 1), 'application/json');
    });
    el.addEventListener('change', e => {
      const t = e.target;
      if (t.dataset.cmp) { const i = sel.indexOf(t.dataset.cmp); if (t.checked && i < 0) sel.push(t.dataset.cmp); if (!t.checked && i >= 0) sel.splice(i, 1); while (sel.length > 2) { const old = sel.shift(); const cb = $('[data-cmp="' + old + '"]', el); if (cb) cb.checked = false; } $('#cmp', el).innerHTML = compareHtml(); }
      if (t.id === 'im' && t.files[0]) {
        const r = new FileReader();
        r.onload = () => {
          try {
            const d = JSON.parse(r.result); if (!d || d.v !== 1) throw new Error('v');
            const valid = s => s && s.ids && E.KEYS.every(k => D.by[k][s.ids[k]]);
            const have = U.getSaved(), add = (d.saved || []).filter(valid).filter(s => !have.some(h => h.id === s.id));
            U.updateSaved(have.concat(add).slice(0, 20));
            const fav = U.getFav(); (d.fav || []).forEach(f => { if (D.by[f.k] && D.by[f.k][f.id] && !fav.some(x => x.k === f.k && x.id === f.id)) fav.push(f); }); U.store.set('pcr.fav.v1', fav);
            if (Array.isArray(d.memo) && !U.store.get('pcr.btoMemo.v1', []).length) U.store.set('pcr.btoMemo.v1', d.memo.slice(0, 20));
            U.toast(add.length + '件の構成を読み込みました'); draw();
          } catch (err) { U.toast('このファイルは読み込めませんでした'); }
        };
        r.readAsText(t.files[0]);
      }
    });
  });

  /* ---------- このサイトについて（運営者・広告・免責・プライバシーポリシー） ---------- */
  U.route('/about', 'このサイトについて・プライバシーポリシー', function (el) {
    const ga = /^G-[A-Z0-9]+$/.test((CFG.gaMeasurementId || '').trim());
    const op = CFG.operatorName || (CFG.siteName + ' 運営者');
    const pd = D.priceDate ? esc(D.priceDate) : esc(CFG.dataDate);
    el.innerHTML = '<h1>このサイトについて</h1><div class="article tipify">' +
      '<p class="muted">目次: <a href="#about-what">PC Recipe とは</a> / <a href="#about-data">データと計算方法</a> / <a href="#about-ad">広告について</a> / <a href="#about-disclaimer">免責事項</a> / <a href="#about-privacy">プライバシーポリシー</a> / <a href="#about-contact">運営者・お問い合わせ</a></p>' +
      '<h2 id="about-what">PC Recipe とは</h2><p>BTOパソコンや自作PCを選ぶ人のための、診断・チェックサイトです。むずかしい言葉は、カーソルを合わせると説明が出ます。利用は無料で、会員登録もいりません。</p>' +
      '<h2 id="about-data">データと計算方法</h2><ul>' +
      '<li><b>パーツの仕様</b>（ソケット、メモリ規格、消費電力、推奨電源など）は、メーカー公式の情報をもとにしています。データ確認日: <b>' + esc(CFG.dataDate) + '</b>。</li>' +
      '<li><b>性能の数値</b>（ゲーム性能・動画編集性能の指数）は、公開されているベンチマークの傾向をもとにした<b>相対的な目安</b>で、公式の数字ではありません。</li>' +
      '<li><b>fps</b>は、ゲームごとの「GPU側の上限」と「CPU側の上限」から計算した目安です（実測ではありません）。</li>' +
      '<li><b>電源の推奨容量</b>は、CPUとGPUの最大消費電力に周辺機器分を足し、約25%の余裕を持たせて計算し、GPUメーカーの推奨容量と比べて大きい方を採用しています。</li>' +
      '<li><b>価格</b>（価格確認日: <b>' + pd + '</b>）は、次の公開情報をもとにした目安です。CPU・メモリ・SSDは秋葉原の店頭価格調査（AKIBA PC Hotline!）の最安値、グラフィックボード・電源はドスパラ通販の販売価格、BTOパソコンは各メーカー公式サイトの表示価格です。価格は毎日変わるため、<b>購入前に必ず購入先で確認</b>してください。</li>' +
      '<li>価格を確認できなかったパーツ（在庫が少ない、販売が終わった可能性があるもの）は「<b>価格未確認</b>」と表示し、おまかせ提案には使いません。自分でパーツを選ぶ画面では選べます。</li>' +
      '<li>マザーボード・電源・ケース・クーラーは、特定の製品ではなく「そのクラスの代表的な価格」です。</li>' +
      '<li><b>パーツの寸法</b>（GPUの長さ、クーラーの高さなど）は、一般的なクラスの値です。実際の製品は必ず製品ページで確認してください。</li></ul>' +
      '<h2 id="about-ad">広告（アフィリエイト）について</h2><p>当サイトは、楽天アフィリエイト、A8.net などのアフィリエイトサービス' + (CFG.affiliate.amazonTag ? '、Amazonアソシエイト' : '') + 'を利用した<b>広告（PR）を含みます</b>。「PR」と書かれたリンクや、ショップ・BTOメーカーへのリンクから商品を購入されると、当サイトに報酬が支払われることがあります。</p>' +
      '<p>おすすめ構成や並び順は、性能・価格・互換性の計算だけで決めており、<b>報酬の有無や金額で変えることはありません</b>。広告主から、紹介内容について指示を受けることもありません。</p>' +
      (CFG.affiliate.amazonTag ? '<p>Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。</p>' : '') +
      '<h2 id="about-disclaimer">免責事項</h2><p>当サイトの情報は正確を心がけていますが、完全性・正確性・最新性を保証するものではありません。パーツの互換性、動作、性能、価格、在庫は変わることがあります。当サイトの情報を利用して行った購入や組み立てによって生じた損害について、当サイトは責任を負いかねます。購入前に、メーカーおよび販売店の公式情報を必ずご確認ください。リンク先のサイトの内容・サービスについても、当サイトは責任を負いません。</p>' +
      '<p>当サイトに掲載している文章・画像の無断転載はご遠慮ください。商品名・会社名は、各社の商標または登録商標です。</p>' +
      '<h2 id="about-privacy">プライバシーポリシー</h2>' +
      '<h3>1. この端末の中だけに保存する情報</h3><p>保存した構成、お気に入り、チェックリスト、画面の設定（ダークモードなど）は、お使いのブラウザの中（localStorage）にだけ保存します。当サイトのサーバーには送信しません。ブラウザのサイトデータを削除すると消えます。「今のPCから診断」で貼り付けたPCの情報も、ブラウザの中で読み取るだけで、送信しません。</p>' +
      '<h3>2. アクセス解析（外部への送信）</h3>' +
      (ga ? '<p>当サイトは、サイトの改善のために、Google LLC のアクセス解析ツール「Google アナリティクス」を利用しています。Google アナリティクスは Cookie などを使って、次の情報を Google に送信します。個人の名前やメールアドレスなど、個人を特定する情報は送信しません。</p>' +
        '<div class="tbl-wrap"><table class="t"><tbody><tr><th>送信先</th><td>Google LLC</td></tr><tr><th>送信する情報</th><td>見たページ、ページを見た日時、使っているブラウザ・端末の種類、おおまかな地域、どのサイトから来たか、ショップへのリンクを押したかどうか（押したリンクの行き先のドメイン）、Cookie などの識別子</td></tr><tr><th>目的</th><td>どのページがよく使われているかを知り、サイトを改善するため</td></tr></tbody></table></div>' +
        '<p>送信されたデータは、<a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener">Google のプライバシーポリシー</a>に従って管理されます。送信を止めたい場合は、<a href="https://tools.google.com/dlpage/gaoptout?hl=ja" target="_blank" rel="noopener">Google アナリティクス オプトアウト アドオン</a>を使うか、ブラウザの設定で Cookie を無効にしてください。詳しくは「<a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank" rel="noopener">Google のサービスを使用するサイトやアプリから収集した情報の Google による使用</a>」をご覧ください。</p>'
        : '<p>現在、当サイトはアクセス解析ツールを使っていません。使い始める場合は、このページでお知らせします。</p>') +
      '<h3>3. 広告リンク（アフィリエイト）</h3><p>ショップやBTOメーカーへのリンクを押すと、リンク先（楽天市場、Amazon、A8.net を経由する各社サイトなど）で、購入を確認するための Cookie が使われることがあります。これはリンク先・アフィリエイトサービス側の仕組みで、それぞれの会社のプライバシーポリシーに従って扱われます。当サイトが、購入者の名前や住所などを受け取ることはありません。</p><p>また、A8.net の広告リンクを表示しているページでは、広告が表示された回数を数えるために、A8.net（株式会社ファンコミュニケーションズ）のサーバーから小さな画像を読み込みます。このとき、お使いのブラウザから A8.net へ、表示したページの情報などが送られます。</p>' +
      (U.hasImages() ? '<h3>4. パーツの写真</h3><p>パーツの写真は、楽天ウェブサービスから取得した画像を、楽天のサーバーから表示しています。表示するときに、お使いのブラウザから楽天のサーバーへ通常の画像の読み込みが行われます。</p>' : '') +
      '<h3>' + (U.hasImages() ? '5' : '4') + '. お問い合わせで受け取る情報</h3><p>お問い合わせフォームに書かれた内容（返信先を書いた場合はその連絡先を含みます）は、お問い合わせへの対応と、サイトの誤りの修正のためだけに使い、法律にもとづく場合を除いて、第三者に渡しません。</p>' +
      '<h3>' + (U.hasImages() ? '6' : '5') + '. このポリシーの変更</h3><p>内容は、必要に応じて変更することがあります。変更した場合は、このページに掲載した時点から有効になります。（最終更新日: 2026年11月13日）</p>' +
      '<h2 id="about-contact">運営者・お問い合わせ</h2><table class="t"><tbody><tr><th>サイト名</th><td>' + esc(CFG.siteName) + '</td></tr><tr><th>運営者</th><td>' + esc(op) + '</td></tr>' +
      (CFG.siteUrl ? '<tr><th>URL</th><td>' + esc(CFG.siteUrl) + '</td></tr>' : '') +
      '<tr><th>お問い合わせ</th><td>' + (CFG.contactUrl ? '<a href="' + esc(CFG.contactUrl) + '" target="_blank" rel="noopener">お問い合わせ・誤りの報告フォーム</a>（Googleフォーム）' : '準備中です') + '</td></tr></tbody></table>' +
      '<p class="muted">価格・仕様の誤りを見つけたら、フォームから教えていただけると助かります。</p>' +
      '</div>';
    // 目次のリンク（#about-xxx）は、ページ切り替えに使う # とぶつかるので、スクロールだけ行う
    el.querySelectorAll('a[href^="#about-"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const t = el.querySelector(a.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth' }); }));
  });
})();
