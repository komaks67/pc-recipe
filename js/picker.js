/* ============================================================
   パーツ選びの画面（検索・並べ替え・絞り込み・合うものだけ）
   U.pickPart({ k, cur, ids, ctx, onPick, compat })
     k: 'cpu' など / cur: 今のID / ids: 今の構成（合うかどうかの判定に使う。なければ判定しない）
   ============================================================ */
(function () {
  const U = PCR_UI, D = PCR_DATA, E = PCR_ENGINE;
  const esc = U.esc, yen = U.yen;
  const PAGE = 40;

  /* 性能（並べ替え・バー表示用）と、その単位 */
  const PERF = {
    cpu: p => p.gs, gpu: p => p.score, mem: p => p.cap, ssd: p => p.cap * 10 + p.gen, psu: p => p.w,
    case: p => p.gpuMax, cooler: p => p.tdpMax, mb: p => p.m2g * 10 + (p.oc ? 5 : 0) + (p.wifi === 'yes' ? 2 : 0), os: () => 0
  };
  const PERF_LABEL = { cpu: 'ゲーム性能', gpu: '性能', mem: '容量', ssd: '容量', psu: '容量', case: '入るグラボの長さ', cooler: '冷却力', mb: '機能', os: '' };

  /* 絞り込み（グループごとに1つ選ぶ。先頭は「すべて」） */
  const isNew = p => !p.used && !p.legacy;
  const FILTERS = {
    cpu: [
      ['メーカー', [['AMD', p => p.b === 'AMD'], ['Intel', p => p.b === 'Intel']]],
      ['ソケット', [['AM5', p => p.sock === 'AM5'], ['AM4', p => p.sock === 'AM4'], ['LGA1851', p => p.sock === 'LGA1851'], ['LGA1700', p => p.sock === 'LGA1700']]],
      ['内蔵グラフィックス', [['あり', p => p.igpu !== false], ['なし', p => p.igpu === false]]]
    ],
    gpu: [
      ['メーカー', [['NVIDIA', p => p.b === 'NVIDIA'], ['AMD', p => p.b === 'AMD'], ['Intel', p => p.b === 'Intel']]],
      ['VRAM', [['8GB', p => p.vram === 8], ['12GB以上', p => p.vram >= 12], ['16GB以上', p => p.vram >= 16]]],
      ['新品・中古', [['新品', p => !p.used], ['中古', p => !!p.used]]]
    ],
    mb: [
      ['大きさ', [['ATX', p => p.form === 'ATX'], ['Micro-ATX', p => p.form === 'mATX'], ['Mini-ITX', p => p.form === 'ITX']]],
      ['Wi-Fi', [['あり', p => p.wifi === 'yes']]]
    ],
    mem: [['規格', [['DDR5', p => p.type === 'DDR5'], ['DDR4', p => p.type === 'DDR4']]], ['容量', [['16GB', p => p.cap === 16], ['32GB', p => p.cap === 32], ['48GB以上', p => p.cap >= 48]]]],
    ssd: [['種類', [['Gen5', p => p.gen === 5], ['Gen4', p => p.gen === 4], ['Gen3', p => p.gen === 3], ['SATA', p => p.gen === 0]]], ['容量', [['1TB以下', p => p.cap <= 1], ['2TB', p => p.cap === 2], ['4TB以上', p => p.cap >= 4]]]],
    psu: [['形', [['ATX', p => p.form === 'ATX'], ['SFX（小型）', p => p.form === 'SFX']]], ['等級', [['Bronze', p => p.grade === 'Bronze'], ['Gold', p => p.grade === 'Gold'], ['Platinum以上', p => p.grade === 'Platinum' || p.grade === 'Titanium']]]],
    case: [['大きさ', [['ミドル', p => p.size === 'ミドル'], ['ミニ', p => p.size === 'ミニ'], ['大型', p => p.size === '大型']]], ['静かさ', [['静音', p => p.noise === '静音']]]],
    cooler: [['種類', [['空冷', p => p.kind === '空冷'], ['水冷', p => p.kind === '水冷']]]],
    os: []
  };
  const REAL = ['mb', 'mem', 'ssd', 'psu', 'case', 'cooler'];

  let box = null, bg = null;
  function close() { if (box) { box.remove(); bg.remove(); box = bg = null; document.body.classList.remove('noscroll'); window.removeEventListener('hashchange', close); } }
  U.closePicker = close;

  U.pickPart = function (o) {
    close();
    const k = o.k, cur = o.cur, ctx = o.ctx || U.prefs();
    const st = { q: '', sort: 'rec', f: {}, compat: o.ids ? true : false, more: false, kind: '', page: PAGE };
    const badCache = {};
    const isBad = p => {
      if (!o.ids || p.id === cur) return false;
      if (!(p.id in badCache)) badCache[p.id] = E.check(E.swap(o.ids, k, p.id), ctx).some(c => c.lv === 'ng');
      return badCache[p.id];
    };
    const base = D[k].filter(p => !(k === 'gpu' && p.id === 'none' && o.noNone));
    const hasReal = REAL.indexOf(k) >= 0 && base.some(p => p.real);
    const hasExtra = base.some(p => p.legacy || p.priceUnverified);

    bg = document.createElement('div'); bg.className = 'sheet-bg pk-bg';
    box = document.createElement('div'); box.className = 'picker'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', E.LABEL[k] + 'を選ぶ');
    const chip = (g, label, on) => '<button type="button" class="pk-chip' + (on ? ' on' : '') + '" data-g="' + esc(g) + '" data-v="' + esc(label) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(label) + '</button>';
    box.innerHTML = '<div class="pk-hd"><b>' + esc(E.LABEL[k]) + 'を選ぶ</b><button type="button" class="icon-btn pk-x" aria-label="閉じる">✕</button></div>' +
      '<input type="search" class="pk-q" placeholder="名前で探す（例: ' + esc({ cpu: '9800X3D', gpu: '5070', mb: 'B850', mem: 'DDR5', ssd: '2TB', psu: '850W', case: 'Mini', cooler: '360', os: 'Windows' }[k] || '') + '）" aria-label="名前で探す">' +
      '<div class="pk-tools"><label class="pk-sort">並び順 <select class="pk-s"><option value="rec">おすすめ順</option><option value="price">安い順</option><option value="perf">' + esc(PERF_LABEL[k] || '性能') + 'が高い順</option>' + (k === 'cpu' || k === 'gpu' ? '<option value="value">コスパ順（性能÷価格）</option>' : '') + '</select></label>' +
      (o.ids ? '<label class="pk-tg"><input type="checkbox" class="pk-compat" checked> 合うものだけ</label>' : '') +
      (hasExtra ? '<label class="pk-tg"><input type="checkbox" class="pk-more"> 旧世代・価格未確認も表示</label>' : '') + '</div>' +
      '<div class="pk-filters">' + (hasReal ? '<div class="pk-fg"><span>種類</span>' + chip('kind', 'すべて', true) + chip('kind', '種類ごとの目安', false) + chip('kind', '実際の商品', false) + '</div>' : '') +
      (FILTERS[k] || []).map(([g, opts]) => '<div class="pk-fg"><span>' + esc(g) + '</span>' + chip(g, 'すべて', true) + opts.map(x => chip(g, x[0], false)).join('') + '</div>').join('') + '</div>' +
      '<div class="pk-count muted" aria-live="polite"></div><ul class="pk-list" role="listbox"></ul>';
    document.body.appendChild(bg); document.body.appendChild(box);
    document.body.classList.add('noscroll');
    window.addEventListener('hashchange', close);

    const curP = D.by[k][cur];
    const maxPerf = Math.max(1, ...base.map(PERF[k] || (() => 0)));
    function list() {
      const q = st.q;
      let l = base.filter(p => {
        if (q && !U.matchQ(q, '', p._sk || (p._sk = U.searchKey(p.name + ' ' + (p.q || '') + ' ' + (p.b || ''))))) return false;
        if (!st.more && (p.legacy || p.priceUnverified) && p.id !== cur) return false;
        if (st.kind === '種類ごとの目安' && p.real) return false;
        if (st.kind === '実際の商品' && !p.real) return false;
        for (const [g, opts] of (FILTERS[k] || [])) { const v = st.f[g]; if (v) { const fn = opts.find(x => x[0] === v)[1]; if (!fn(p)) return false; } }
        if (st.compat && isBad(p)) return false;
        return true;
      });
      const perf = PERF[k] || (() => 0);
      const val = p => p.price ? perf(p) / p.price : 0;
      if (st.sort === 'price') l.sort((a, b) => a.price - b.price);
      else if (st.sort === 'perf') l.sort((a, b) => perf(b) - perf(a) || a.price - b.price);
      else if (st.sort === 'value') l.sort((a, b) => val(b) - val(a));
      else l.sort((a, b) => (isNew(b) - isNew(a)) || ((!!a.real) - (!!b.real)) || ((!!a.priceUnverified) - (!!b.priceUnverified)) || (k === 'cpu' || k === 'gpu' ? perf(a) - perf(b) : a.price - b.price));
      return l;
    }
    // 相手（CPUならグラボ、グラボならCPU）が決まっていれば、候補ごとに相性を出す
    const mate = o.ids && (k === 'gpu' ? D.by.cpu[o.ids.cpu] : k === 'cpu' ? D.by.gpu[o.ids.gpu] : null);
    const pcache = {};
    const pairOpt = { games: ctx.games, res: ctx.res, quality: ctx.quality };
    function pairOf(p) {
      if (!mate || p.id === 'none' || (k === 'cpu' && mate.id === 'none')) return null;
      return p.id in pcache ? pcache[p.id] : (pcache[p.id] = k === 'gpu' ? E.pair(mate, p, pairOpt) : E.pair(p, mate, pairOpt));
    }
    function badge(p) {
      return U.pairTag(pairOf(p), 1) + (p.id === cur ? '<span class="badge ok">選択中</span>' : '') + (p.used ? '<span class="badge warn">中古</span>' : '') + (p.legacy ? '<span class="badge warn">旧世代</span>' : '') +
        (p.priceUnverified ? '<span class="badge warn">価格未確認</span>' : '') + (p.real ? '<span class="badge">実際の商品</span>' : '') + (p.unstable ? '<span class="badge warn">BIOS更新を</span>' : '') +
        (!st.compat && isBad(p) ? '<span class="badge ng">⚠ 合わない</span>' : '');
    }
    function draw() {
      const l = list(), shown = l.slice(0, st.page);
      box.querySelector('.pk-count').textContent = l.length + '件' + (st.compat ? '（今の構成に合うものだけ）' : '') + (mate && mate.id !== 'none' ? ' ／ ◎○△✕ は ' + mate.name + ' との相性' : '');
      box.querySelector('.pk-list').innerHTML = !l.length ? '<li class="pk-none">見つかりませんでした。絞り込みを外すか、「合うものだけ」を外してみてください。</li>' :
        shown.map(p => {
          const d = curP ? p.price - curP.price : 0, pf = (PERF[k] || (() => 0))(p);
          return '<li><button type="button" class="pk-item' + (p.id === cur ? ' on' : '') + '" data-id="' + esc(p.id) + '" role="option" aria-selected="' + (p.id === cur) + '">' +
            '<span class="pk-n">' + esc(p.name) + '</span><span class="pk-b">' + badge(p) + '</span>' +
            '<span class="pk-sp">' + esc(U.specLine ? U.specLine(k, p).replace(/<[^>]+>/g, '') : '') + '</span>' +
            (pf && (k === 'cpu' || k === 'gpu') ? '<span class="pk-pf" aria-hidden="true"><i style="width:' + Math.round(pf / maxPerf * 100) + '%"></i></span>' : '') +
            '<span class="pk-p"><b>' + (p.price ? yen(p.price) : '0円') + '</b>' + (p.id !== cur && curP ? ' <span class="' + (d > 0 ? 'neg' : d < 0 ? 'pos' : 'muted') + '">' + (d === 0 ? '±0' : U.sgn(d)) + '</span>' : '') + '</span></button>' +
            (k === 'cpu' || k === 'gpu' ? '<a class="pk-more-link" href="#/part/' + k + '/' + esc(p.id) + '">詳しく</a>' : '') + '</li>';
        }).join('') + (l.length > shown.length ? '<li><button type="button" class="btn sub pk-next">もっと見る（残り ' + (l.length - shown.length) + '件）</button></li>' : '');
    }
    draw();
    const qi = box.querySelector('.pk-q');
    if (window.matchMedia && matchMedia('(min-width: 721px)').matches) qi.focus();
    qi.addEventListener('input', () => { st.q = qi.value.trim(); st.page = PAGE; draw(); });
    box.querySelector('.pk-s').addEventListener('change', e => { st.sort = e.target.value; draw(); });
    const cp = box.querySelector('.pk-compat'); if (cp) cp.addEventListener('change', e => { st.compat = e.target.checked; st.page = PAGE; draw(); });
    const mo = box.querySelector('.pk-more'); if (mo) mo.addEventListener('change', e => { st.more = e.target.checked; draw(); });
    box.addEventListener('click', e => {
      if (e.target.closest('.pk-x')) return close();
      const ch = e.target.closest('.pk-chip');
      if (ch) {
        const g = ch.dataset.g, v = ch.dataset.v === 'すべて' ? '' : ch.dataset.v;
        if (g === 'kind') st.kind = v; else st.f[g] = v;
        box.querySelectorAll('.pk-chip[data-g="' + g.replace(/"/g, '') + '"]').forEach(b => { const on = b === ch; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        st.page = PAGE; draw(); return;
      }
      if (e.target.closest('.pk-next')) { st.page += PAGE; draw(); return; }
      const it = e.target.closest('.pk-item');
      if (it) { const id = it.dataset.id; close(); if (id !== cur) o.onPick(id); }
    });
    bg.addEventListener('click', close);
    box.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  };

  /* 選択ボタン（今のパーツ名・価格を表示し、押すとパーツ選びの画面を開く） */
  U.pickButton = function (k, id, extra) {
    const p = D.by[k][id];
    return '<button type="button" class="pk-btn" data-pick="' + k + '"' + (extra || '') + ' aria-label="' + esc(E.LABEL[k]) + 'を変更（今は ' + esc(p ? p.name : '') + '）"><span class="pk-btn-n">' + esc(p ? p.name : '選ぶ') + '</span><span class="pk-btn-p">' + (p && p.price ? yen(p.price) : '') + '</span><span class="pk-btn-c">変更</span></button>';
  };
})();
