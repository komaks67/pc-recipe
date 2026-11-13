#!/usr/bin/env node
/* データの整合性チェック
 *
 * 使い方:  node tools/check-data.mjs
 *
 * パーツ・ゲーム・BTOモデル・価格・設定・静的ページのつながりを点検し、
 * 「エラー」（直さないと画面がおかしくなるもの）と「注意」（確認した方がよいもの）を表示します。
 * エラーが1件でもあると、終了コード1で終わります。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const sb = { console };
sb.window = sb;
vm.createContext(sb);
['js/config.js', 'js/prices.js', 'js/bto-models.js', 'js/parts-real.js', 'js/data.js', 'js/engine.js'].forEach(f => vm.runInContext(read(f), sb, { filename: f }));
const CFG = sb.PCR_CONFIG, D = sb.PCR_DATA, E = sb.PCR_ENGINE, P = sb.PCR_PRICES, M = sb.PCR_BTO_MODELS;

const err = [], warn = [];
const E_ = (m) => err.push(m), W_ = (m) => warn.push(m);
const KEYS = ['cpu', 'gpu', 'mb', 'mem', 'ssd', 'psu', 'case', 'cooler', 'os'];
const SOCK = ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'];
const num = (x, lo, hi) => typeof x === 'number' && Number.isFinite(x) && x >= lo && x <= hi;

/* ---------- 1. IDと必須項目 ---------- */
KEYS.concat(['games', 'oldCpu', 'oldGpu']).forEach(k => {
  const seen = {};
  D[k].forEach(p => {
    if (!p.id) E_(`${k}: IDがない項目があります (${p.name})`);
    if (seen[p.id]) E_(`${k}: IDが重複しています (${p.id})`);
    seen[p.id] = 1;
    if (!p.name) E_(`${k}/${p.id}: 名前がありません`);
  });
  const names = {};
  D[k].forEach(p => { if (names[p.name] && k !== 'oldCpu' && k !== 'oldGpu') W_(`${k}: 同じ名前が2つあります「${p.name}」(${names[p.name]} と ${p.id})`); names[p.name] = p.id; });
});
KEYS.forEach(k => D[k].forEach(p => {
  const free = (k === 'gpu' && p.id === 'none') || (k === 'os' && p.id === 'none');
  if (!num(p.price, free ? 0 : 1, 3000000)) E_(`${k}/${p.id}: 価格がおかしい (${p.price})`);
}));

/* ---------- 2. 種類ごとの項目 ---------- */
D.cpu.forEach(c => {
  if (SOCK.indexOf(c.sock) < 0) E_(`cpu/${c.id}: 知らないソケット ${c.sock}`);
  if (!num(c.tdp, 35, 250) || !num(c.pw, c.tdp, 400)) E_(`cpu/${c.id}: TDP・最大消費電力がおかしい (tdp ${c.tdp} / pw ${c.pw})`);
  if (!num(c.gs, 1, 130) || !num(c.mt, 1, 130)) E_(`cpu/${c.id}: 性能の値がおかしい (gs ${c.gs} / mt ${c.mt})`);
  const m = /(\d+)コア/.exec(c.core || ''); if (!m) E_(`cpu/${c.id}: コア数の書き方がおかしい (${c.core})`);
  if (/F$/.test(c.name) && c.igpu !== false) E_(`cpu/${c.id}: F型番なのに内蔵グラフィックスありになっています`);
  if (/^Core i[579]-1[34]\d{3}K/.test(c.name) && !c.unstable) W_(`cpu/${c.id}: 第13・14世代のK型番ですが「不安定問題」の注意が付いていません`);
});
D.gpu.filter(g => g.id !== 'none').forEach(g => {
  if (!num(g.vram, 2, 48) || !num(g.tgp, 30, 700) || !num(g.score, 1, 120)) E_(`gpu/${g.id}: VRAM・消費電力・性能の値がおかしい`);
  if (!num(g.rec, g.tgp + 150, 1600)) E_(`gpu/${g.id}: 推奨電源 ${g.rec}W が消費電力 ${g.tgp}W に対して小さすぎます`);
  if (!num(g.len, 150, 380) || !num(g.slots, 1, 4)) E_(`gpu/${g.id}: 長さ・厚みがおかしい`);
  if (['8pin', '8pin×2', '12V-2x6', 'なし'].indexOf(g.conn) < 0) E_(`gpu/${g.id}: 電源コネクタの書き方 ${g.conn}`);
});
D.mb.forEach(m => {
  if (SOCK.indexOf(m.sock) < 0 || ['ATX', 'mATX', 'ITX'].indexOf(m.form) < 0 || ['DDR4', 'DDR5'].indexOf(m.mem) < 0) E_(`mb/${m.id}: ソケット・大きさ・メモリ規格がおかしい`);
  if (E.platformTypes(m.sock).indexOf(m.mem) < 0) E_(`mb/${m.id}: ${m.sock} なのに ${m.mem}`);
  if (!num(m.m2g, 3, 5)) E_(`mb/${m.id}: M.2の世代 ${m.m2g}`);
});
D.mem.forEach(m => { if (['DDR4', 'DDR5'].indexOf(m.type) < 0 || [8, 16, 32, 48, 64, 96, 128].indexOf(m.cap) < 0) E_(`mem/${m.id}: 規格・容量がおかしい`); });
D.ssd.forEach(s => { if (!num(s.cap, 0.25, 8) || [0, 3, 4, 5].indexOf(s.gen) < 0) E_(`ssd/${s.id}: 容量・世代がおかしい`); });
D.psu.forEach(p => { if (!num(p.w, 300, 3000) || ['ATX', 'SFX'].indexOf(p.form) < 0 || ['Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium', 'Standard'].indexOf(p.grade) < 0) E_(`psu/${p.id}: 容量・形・等級がおかしい`); });
D.case.forEach(c => {
  if (!c.form.length || c.form.some(f => ['ATX', 'mATX', 'ITX'].indexOf(f) < 0)) E_(`case/${c.id}: 対応マザーボードの書き方`);
  if (!num(c.gpuMax, 150, 500) || !num(c.coolerMax, 30, 200)) E_(`case/${c.id}: グラボ長・クーラー高がおかしい`);
  if (!c.psu.length) E_(`case/${c.id}: 電源の形がない`);
});
D.cooler.forEach(k => {
  if (['空冷', '水冷'].indexOf(k.kind) < 0 || !num(k.tdpMax, 50, 500)) E_(`cooler/${k.id}: 種類・冷却力がおかしい`);
  if (k.kind === '空冷' && !num(k.h, 20, 200)) E_(`cooler/${k.id}: 高さ ${k.h}`);
  if (k.kind === '水冷' && [120, 240, 280, 360, 420].indexOf(k.rad) < 0) E_(`cooler/${k.id}: ラジエーター ${k.rad}`);
  if (!k.sock.length) E_(`cooler/${k.id}: 対応ソケットがない`);
});

/* ---------- 3. 組み合わせの土台 ---------- */
// どのCPUにも、同じソケットのマザーボードがある / 自動で選ぶマザーボードが存在する
SOCK.forEach(s => {
  if (!D.cpu.some(c => c.sock === s)) return;
  ['ATX', 'mATX', 'ITX'].forEach(f => E.platformTypes(s).forEach(t => {
    let id; try { id = E.defaultMb(s, [f], { memType: t }); } catch (e) { id = null; }
    if (!id || !D.by.mb[id]) E_(`自動のマザーボード選び: ${s} / ${f} / ${t} の候補が data.js にありません (${id})`);
    else if (D.by.mb[id].sock !== s || D.by.mb[id].form !== f) E_(`自動のマザーボード選び: ${s} / ${f} に ${id}（${D.by.mb[id].sock} / ${D.by.mb[id].form}）が選ばれます`);
  }));
});
[16, 32, 48, 64].forEach(c => ['DDR4', 'DDR5'].forEach(t => { if (!D.by.mem[E.memFor(c, t)]) E_(`メモリの自動選び: ${t} ${c}GB の候補がありません`); }));
// コードの中で名前で使っているIDが存在する
const src = ['js/engine.js', 'js/pages-build.js', 'js/pages-wizard.js', 'js/pages-second.js', 'js/pages-server.js', 'js/pages-mypc.js', 'js/pages-match.js', 'js/ui.js'].map(read).join('\n');
const fixedIds = new Set();
src.replace(/D\.by\.(cpu|gpu|mb|mem|ssd|psu|case|cooler|os)\[['"]([\w-]+)['"]\]/g, (m, k, id) => { fixedIds.add(k + '/' + id); return m; });
src.replace(/\b(?:cpu|gpu|mem|ssd): '([\w-]+)'/g, (m, id) => { fixedIds.add('?/' + id); return m; });
fixedIds.forEach(x => {
  const [k, id] = x.split('/');
  if (k === '?') { if (!/^[a-z0-9]/.test(id)) return; if (!KEYS.concat(['oldCpu', 'oldGpu']).some(kk => D.by[kk][id] || D.by[kk][id.replace(/^[on]:/, '')]) && !D.by.games[id] && !D.oldCpu.some(o => 'o-' + o.id === id || o.id === id.replace(/^o-/, ''))) W_(`コードの中のID「${id}」が、どのパーツにも見つかりません`); }
  else if (!D.by[k][id]) E_(`コードの中のID ${k}/${id} が data.js にありません`);
});
(read('js/engine.js').match(/'(c-[\w-]+|k-[\w-]+|p\d+\w*)'/g) || []).forEach(q => { const id = q.slice(1, -1); if (!['case', 'cooler', 'psu'].some(k => D.by[k][id])) E_(`engine.js の固定ID ${id} がありません`); });

/* ---------- 4. 性能・価格の並び（おかしな逆転がないか） ---------- */
const pairs = (list, key, f) => list.forEach(a => list.forEach(b => { if (a !== b && f(a, b)) W_(key(a, b)); }));
// 同じ世代で、上位の型番のゲーム性能が下位より低い
const tier = c => { const m = /(Ryzen|Core i|Core Ultra) ?(\d)/.exec(c.name); return m ? +m[2] : 0; };
pairs(D.cpu.filter(c => !c.legacy), (a, b) => `cpu: ${a.name}(上位) のゲーム性能 ${a.gs} が ${b.name} の ${b.gs} より低い`,
  (a, b) => a.fam === b.fam && a.b === b.b && tier(a) > tier(b) && a.mt < b.mt && a.gs < b.gs - 2 && !/X3D/.test(b.name));
// 「F」型番が、同じ型番の内蔵グラフィックスありより高い
D.cpu.filter(c => /F$/.test(c.name)).forEach(f => { const base = D.cpu.find(c => c.name === f.name.replace(/F$/, '')); if (base && f.price > base.price && !f.priceUnverified && !base.priceUnverified) W_(`cpu: ${f.name}（${f.price}円）が ${base.name}（${base.price}円）より高い`); });
// メモリ・SSD: 同じ種類で容量が大きい方が安い
pairs(D.mem.filter(m => !m.real), (a, b) => `mem: ${a.name} が ${b.name} より安い（容量が大きいのに）`, (a, b) => a.type === b.type && a.cap > b.cap && a.price < b.price);
pairs(D.ssd.filter(s => !s.real), (a, b) => `ssd: ${a.name} が ${b.name} より安い（容量が大きいのに）`, (a, b) => a.gen === b.gen && a.type === b.type && a.cap > b.cap && a.price < b.price);
// グラボ: 新品同士で、性能が上なのに大幅に安い（価格の入れ間違いの可能性）
pairs(D.gpu.filter(g => g.id !== 'none' && D.suggestable(g)), (a, b) => `gpu: ${a.name}（性能${a.score}・${a.price}円）が ${b.name}（性能${b.score}・${b.price}円）よりかなり安い`, (a, b) => a.score > b.score + 5 && a.price < b.price * 0.8);

/* ---------- 5. ゲーム ---------- */
D.games.forEach(g => {
  if (!(g.g[1080] >= g.g[1440] && g.g[1440] >= g.g[2160])) E_(`games/${g.id}: 解像度が上がるとfpsが上がる設定になっています`);
  if (!num(g.c, 20, 2000) || !num(g.k, 0.1, 2) || !num(g.mem, 4, 64)) E_(`games/${g.id}: 計算の値がおかしい`);
});

/* ---------- 6. 価格ファイル・BTOモデル ---------- */
Object.keys(P).filter(k => !k.startsWith('__')).forEach(k => Object.keys(P[k]).forEach(id => { if (!D.by[k] || !D.by[k][id]) E_(`prices.js: 知らないパーツ ${k}/${id}`); }));
Object.keys(P.__unverified || {}).forEach(k => P.__unverified[k].forEach(id => { if (P.__checked && P.__checked[k] && P.__checked[k][id]) E_(`prices.js: ${k}/${id} が「確認済み」と「未確認」の両方に入っています`); }));
const host = u => { try { return new URL(u).hostname; } catch (e) { return ''; } };
const MAKER_HOST = { dospara: 'dospara.co.jp', pckoubou: 'pc-koubou.jp', tsukumo: 'tsukumo.co.jp', frontier: 'frontier-direct.jp', sycom: 'sycom.co.jp', mdl: 'mdlmake.shop', ozgaming: 'ozgaming-pcshop.com' };
M.forEach((m, i) => {
  const t = `bto-models ${i + 1}件目（${m.name}）`;
  if (!CFG.affiliate.bto[m.maker]) E_(`${t}: メーカー ${m.maker} が config.js にありません`);
  if (!D.by.cpu[m.cpu] || !D.by.gpu[m.gpu]) E_(`${t}: CPUかGPUのIDがありません`);
  if (m.url && MAKER_HOST[m.maker] && host(m.url).indexOf(MAKER_HOST[m.maker]) < 0) E_(`${t}: 商品ページのURLがメーカーのサイトではありません (${m.url})`);
  if (D.by.cpu[m.cpu] && D.by.gpu[m.gpu]) {
    const diy = D.by.cpu[m.cpu].price + D.by.gpu[m.gpu].price;
    if (m.price < diy * 0.9) W_(`${t}: BTOの価格 ${m.price}円が、CPUとグラボだけの値段 ${diy}円よりかなり安い（入力ミス？）`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.updated || '')) E_(`${t}: 確認日がありません`);
});
Object.keys(CFG.affiliate.bto).forEach(k => {
  const c = CFG.affiliate.bto[k];
  if (!/^https:\/\//.test(c.url)) E_(`config.js: ${k} のURLが https で始まっていません`);
  if (c.imp && !/^https:\/\/www\d*\.a8\.net\/0\.gif\?a8mat=/.test(c.imp)) E_(`config.js: ${k} の計測用画像のURLの形がおかしい`);
  if (c.deepMat && !c.deepAllow) E_(`config.js: ${k} は機種ページへのリンクの飛び先の範囲（deepAllow）がありません`);
  if (c.deepMat) M.filter(m => m.maker === k && m.url && m.url.indexOf(c.deepAllow) !== 0).forEach(m => W_(`${k}: ${m.name} の商品ページが広告主の決めた飛び先の範囲の外です`));
  if (!D.makers.some(m => m.key === k)) E_(`data.js の D.makers に ${k} の説明がありません`);
});

/* ---------- 7. 読みもの・静的ページ ---------- */
D.articles.forEach(a => (a.html.match(/href="#\/guide\/([\w-]+)"/g) || []).forEach(h => { const id = h.split('/').pop().replace('"', ''); if (id !== 'glossary' && !D.articles.some(x => x.id === id)) E_(`記事 ${a.id}: 存在しない記事へのリンク ${id}`); }));
const sm = read('sitemap.xml');
(sm.match(/<loc>[^<]+<\/loc>/g) || []).forEach(l => {
  const p = l.replace(/<\/?loc>/g, '').replace(CFG.siteUrl, '');
  const f = path.join(root, p === '' ? 'index.html' : p.endsWith('/') ? p + 'index.html' : p);
  if (!fs.existsSync(f)) E_(`sitemap.xml: ファイルがありません ${p}`);
});
D.games.forEach(g => { if (!fs.existsSync(path.join(root, 'fps', g.id + '.html'))) W_(`fps/${g.id}.html がありません（node tools/build-pages.mjs を実行してください）`); });

/* ---------- 8. 自動の提案がちゃんと組めるか ---------- */
[120000, 200000, 300000, 500000].forEach(b => {
  const r = E.autoBuild({ budget: b, game: true, res: 1440, games: ['apex', 'cyberpunk'], target: 144, os: true, edit: 'none' });
  if (r.ev.hasNg) E_(`おまかせ提案（予算${b}円）の構成に「要修正」があります`);
  Object.keys(r.ids).forEach(k => { const p = D.by[k][r.ids[k]]; if (p && (p.real || p.used || p.legacy)) E_(`おまかせ提案（予算${b}円）に、提案に使わないパーツ ${p.name} が入っています`); });
});

/* ---------- 結果 ---------- */
console.log(`パーツ: ${KEYS.map(k => k + ' ' + D[k].length).join(' / ')} ／ ゲーム ${D.games.length} ／ BTOモデル ${M.length}`);
if (err.length) console.log('\n■ エラー（' + err.length + '件）\n- ' + err.join('\n- '));
if (warn.length) console.log('\n■ 注意（' + warn.length + '件）\n- ' + warn.join('\n- '));
if (!err.length && !warn.length) console.log('\n問題は見つかりませんでした。');
process.exit(err.length ? 1 : 0);
