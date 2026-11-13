#!/usr/bin/env node
/* 検索エンジン向けの静的ページを作るツール
 *
 * 使い方:  node tools/build-pages.mjs
 *
 * js/data.js の読みもの・用語集・ゲームのデータから、次のHTMLを作り直します。
 *   guide/index.html, guide/<記事ID>.html, guide/glossary.html  … 読みもの・用語集
 *   fps/index.html, fps/<ゲームID>.html                          … ゲーム別fpsの目安
 *   sitemap.xml                                                   … 検索エンジン用のページ一覧
 * サイト本体（index.html の診断・ビルダーなど）は、これまでどおり # のページです。
 * 価格を更新したあと（node tools/update-prices.mjs のあと）にも実行すると、fpsページの価格も新しくなります。
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
['js/config.js', 'js/prices.js', 'js/bto-models.js', 'js/parts-real.js', 'js/data.js', 'js/engine.js'].forEach(f => vm.runInContext(read(f), sb));
const CFG = sb.PCR_CONFIG, D = sb.PCR_DATA, E = sb.PCR_ENGINE;
const SITE = CFG.siteUrl.replace(/\/?$/, '/');
const today = new Date().toISOString().slice(0, 10);
const priceDate = D.priceDate || CFG.dataDate;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const yen = n => '¥' + Math.round(n).toLocaleString('ja-JP');

/* 1ページ分のHTML。dir は 'guide' や 'fps'（サイトの一番上から1階層下） */
function page({ dir, file, title, desc, body, crumbs, jsonld }) {
  const url = SITE + dir + '/' + (file === 'index.html' ? '' : file);
  const full = title + ' | ' + CFG.siteName;
  const nav = [['#/wizard', '診断'], ['#/build', '自作で組む'], ['#/bto', 'BTOで選ぶ'], ['#/compare', '比べる'], ['#/mypc', '今のPCを強化'], ['#/server', 'サーバー'], ['guide/', '調べる']];
  const tabs = [['', '🏠', 'ホーム'], ['#/wizard', '🧭', '診断'], ['#/build', '🔧', '組む'], ['#/compare', '⚖️', '比べる'], ['guide/', '📘', '調べる']];
  const bc = [['../', 'ホーム']].concat(crumbs || []);
  const ld = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: bc.concat([[null, title]]).map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[1], item: c[0] ? new URL(c[0], url).href : url })) }].concat(jsonld || []);
  return `<!doctype html>
<html lang="ja" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#23803d">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(CFG.siteName)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(SITE)}img/ogp.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%2334a853'/%3E%3Crect x='9' y='9' width='14' height='14' rx='3' fill='none' stroke='white' stroke-width='2.5'/%3E%3C/svg%3E">
<link rel="apple-touch-icon" href="../img/icon-180.png">
<link rel="stylesheet" href="../css/style.css">
<script>try{var t=JSON.parse(localStorage.getItem('pcr.theme'));if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='dark'}catch(e){}window.PCR_STATIC=true;</script>
<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>
</head>
<body>
<div class="prbar">当サイトは広告（アフィリエイト・PR）を含みます</div>
<header class="hd">
  <div class="hd-in">
    <a class="logo" href="../"><i></i>${esc(CFG.siteName)}</a>
    <nav class="nav" id="nav" aria-label="メインメニュー">${nav.map(n => `<a href="../${n[0]}"${n[0] === dir + '/' ? ' class="on"' : ''}>${n[1]}</a>`).join('')}</nav>
    <a class="icon-btn sbtn" href="../#/search" aria-label="サイト内検索">🔍</a>
  </div>
</header>
<main id="app">
<p class="muted" style="font-size:.85rem">${bc.map(c => `<a href="${c[0]}">${esc(c[1])}</a>`).join(' › ')} › ${esc(title)}</p>
${body}
<div class="card flat sp2"><h3>診断ツールで、自分に合う構成を探す</h3><p>用途と予算を答えるだけで、おすすめ構成と互換性・電源・fpsの目安が分かります。</p><div class="row sp"><a class="btn" href="../#/wizard">🧭 まず診断してみる</a><a class="btn sub" href="../#/build">自作PCビルダー</a><a class="btn sub" href="../#/compare">BTOモデル比較</a></div></div>
</main>
<footer class="ft"><div class="ft-in">
<p><b>PR</b>　当サイトにはアフィリエイト広告が含まれます。表示しているfps・性能は計算モデルによる目安です。価格は確認日時点の目安で、毎日変わります。（価格確認日: ${esc(priceDate)}）</p>
<p><a href="../guide/">読みもの</a>　<a href="../fps/">ゲーム別fpsの目安</a>　<a href="../#/about">このサイトについて・プライバシーポリシー</a>${CFG.contactUrl ? `　<a href="${esc(CFG.contactUrl)}" target="_blank" rel="noopener">お問い合わせ</a>` : ''}</p>
<p>© ${new Date().getFullYear()} ${esc(CFG.siteName)}</p>
</div></footer>
<nav class="tabbar" aria-label="よく使うページ">${tabs.map(t => `<a href="../${t[0]}"${(t[0] === 'guide/' && dir === 'guide') ? ' class="on"' : ''}><span class="ti">${t[1]}</span>${t[2]}</a>`).join('')}</nav>
<script src="../js/config.js"></script>
<script src="../js/analytics.js"></script>
<script>window.PCR_TRACK && window.PCR_TRACK();</script>
</body>
</html>
`;
}

/* 記事の中の「#/guide/xxx」などのリンクを、静的ページ用に直す */
const fixLinks = html => html
  .replace(/href="#\/guide\/glossary"/g, 'href="glossary.html"')
  .replace(/href="#\/guide\/([a-z0-9-]+)"/g, (m, id) => D.articles.some(a => a.id === id) ? `href="${id}.html"` : `href="../#/guide/${id}"`)
  .replace(/href="#\//g, 'href="../#/');

const out = [];   // [相対パス, HTML]
const sitemap = [['', today]];

/* ---------- 読みもの ---------- */
D.articles.forEach((a, i) => {
  const nx = D.articles[i + 1], pv = D.articles[i - 1];
  const body = `<article class="article"><h1>${esc(a.title)}</h1><p class="muted">${esc(a.lead)}</p>${fixLinks(a.html)}</article>
<div class="row sp2">${pv ? `<a class="btn sub" href="${pv.id}.html">← ${esc(pv.title)}</a>` : ''}${nx ? `<a class="btn sub" href="${nx.id}.html">次: ${esc(nx.title)} →</a>` : ''}<a class="btn sub" href="./">読みもの一覧</a></div>`;
  out.push(['guide/' + a.id + '.html', page({ dir: 'guide', file: a.id + '.html', title: a.title, desc: a.lead, body, crumbs: [['./', '読みもの']],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.lead, inLanguage: 'ja', dateModified: today, author: { '@type': 'Organization', name: CFG.siteName }, publisher: { '@type': 'Organization', name: CFG.siteName } }] })]);
  sitemap.push(['guide/' + a.id + '.html', today]);
});
{
  const list = D.glossary.slice().sort((a, b) => a[0].localeCompare(b[0], 'ja'));
  const body = `<h1>PCパーツ用語集</h1><p class="muted">CPU・GPU・VRAMなど、パソコン選びでよく出てくる${list.length}個の言葉を、中学生にも分かる言葉で説明しています。</p>
<div class="card sp"><dl>${list.map(g => `<dt style="font-weight:800;margin-top:12px" id="${esc(encodeURIComponent(g[0]))}">${esc(g[0])}</dt><dd style="margin:0">${esc(g[1])}</dd>`).join('')}</dl></div>`;
  out.push(['guide/glossary.html', page({ dir: 'guide', file: 'glossary.html', title: 'PCパーツ用語集', desc: 'CPU・GPU・VRAM・電源容量など、自作PC・BTOパソコン選びで出てくる言葉を、やさしく解説した用語集です。', body, crumbs: [['./', '読みもの']],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'PCパーツ用語集', hasDefinedTerm: list.map(g => ({ '@type': 'DefinedTerm', name: g[0], description: g[1] })) }] })]);
  sitemap.push(['guide/glossary.html', today]);
}
{
  const body = `<h1>読みもの・用語集</h1><p class="muted">はじめての人向けに、BTOパソコンと自作PCの選び方をやさしく解説しています。</p><div class="grid g2 sp">` +
    D.articles.map(a => `<a class="card card-link" href="${a.id}.html"><h2 style="font-size:1.1rem">${esc(a.title)}</h2><p class="muted">${esc(a.lead)}</p></a>`).join('') +
    `<a class="card card-link" href="glossary.html"><h2 style="font-size:1.1rem">📖 PCパーツ用語集</h2><p class="muted">${D.glossary.length}個の言葉をやさしく説明しています。</p></a>` +
    `<a class="card card-link" href="../fps/"><h2 style="font-size:1.1rem">🎮 ゲーム別fpsの目安</h2><p class="muted">${D.games.length}本のゲームについて、グラボごとのfpsの目安をまとめています。</p></a></div>`;
  out.push(['guide/index.html', page({ dir: 'guide', file: 'index.html', title: '読みもの・用語集', desc: 'BTOパソコンと自作PCの選び方、組み立て手順、よくある失敗、買い時の目安などを初心者向けにやさしく解説しています。', body })]);
  sitemap.push(['guide/', today]);
}

/* ---------- ゲーム別fps ---------- */
const CPU = D.by.cpu['r7-9800x3d'], MEM = D.by.mem['d5-32'];
const GPUS = D.gpu.filter(g => g.id !== 'none' && D.suggestable(g)).sort((a, b) => b.score - a.score);
const RES = [[1080, 'フルHD'], [1440, 'WQHD'], [2160, '4K']];
const fpsOf = (g, gpu, r, q) => E.fps(g, r, { cpu: CPU, gpu, mem: MEM }, { quality: q || 'high' }).fps;
/* その解像度で目標fpsに届く、いちばん安いグラボ */
const cheapest = (g, r, target) => GPUS.filter(x => fpsOf(g, x, r) >= target).sort((a, b) => a.price - b.price)[0];

D.games.forEach(g => {
  const targets = g.cap ? [Math.min(60, g.cap)] : [60, 144];
  const picks = RES.map(([r, rn]) => targets.map(t => { const x = cheapest(g, r, t); return `<tr><th>${rn}で${t}fps</th><td>${x ? `<b>${esc(x.name)}</b>（${yen(x.price)}・目安 ${Math.round(fpsOf(g, x, r))}fps）` : 'この一覧のグラボでは届かない見込み'}</td></tr>`; }).join('')).join('');
  const rows = GPUS.map(gpu => `<tr><td><b>${esc(gpu.name)}</b><br><span class="muted">VRAM ${gpu.vram}GB / ${yen(gpu.price)}</span></td>` +
    RES.map(([r]) => { const f = fpsOf(g, gpu, r), l = E.fpsLabel(f); return `<td><b>${Math.round(f)}</b> <span class="fl ${l.c}">${l.t}</span></td>`; }).join('') + '</tr>').join('');
  const title = `${g.name}のfps目安とおすすめグラボ（フルHD・WQHD・4K）`;
  const desc = `${g.name}を快適に遊ぶためのグラフィックボード選びの目安。フルHD・WQHD・4K、最高〜低画質でのグラボ別fpsの目安と、${targets.join('fps・')}fpsに届くいちばん安いグラボをまとめました（価格確認日 ${priceDate}）。`;
  const body = `<article class="article"><h1>${esc(title)}</h1>
<p class="muted">${esc(g.genre || '')}${g.genre ? '｜' : ''}快適に遊べるメモリの目安: <b>${g.mem}GB以上</b>${g.cap ? `｜このゲームはfpsの上限が <b>${g.cap}fps</b> です` : ''}</p>
<h2>結論：目標fpsに届く、いちばん安いグラボ</h2>
<div class="tbl-wrap"><table class="t"><tbody>${picks}</tbody></table></div>
<p class="muted">CPUは ${esc(CPU.name)}、メモリ ${MEM.cap}GB で計算しています。CPUが遅いと、ここより低くなることがあります。</p>
<h2>グラボ別のfps目安</h2>
<div class="tbl-wrap"><table class="t"><thead><tr><th>グラフィックボード</th>${RES.map(r => `<th>${r[1]}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
<h2>画質ごとのfps目安（WQHD）</h2>
<p class="muted">同じグラボでも、ゲームの画質設定で fps は大きく変わります。表の数字は「最高／高／中／低」の4つの画質での目安です。</p>
<div class="tbl-wrap"><table class="t"><thead><tr><th>グラフィックボード</th>${E.QKEYS.map(q => `<th>${E.QUALITY[q].t}</th>`).join('')}</tr></thead><tbody>${GPUS.map(gpu => `<tr><td><b>${esc(gpu.name)}</b></td>${E.QKEYS.map(q => `<td>${Math.round(fpsOf(g, gpu, 1440, q))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
<h2>この数字について</h2>
<ul><li>fpsは<b>実測ではなく、計算モデルによる目安</b>です。平均的なシーンを想定し、上の2つの表は「高」画質の目安です。画質ごとの差は、一般的な傾向からの見積もりです。</li>
<li>ゲームのアップデート、画質設定、DLSS・FSR（画質を少し下げてfpsを上げる機能）の有無で、大きく変わります。購入前にレビュー記事の実測値も確認しましょう。</li>
<li>価格は ${esc(priceDate)} 時点の目安で、毎日変わります。価格を確認できなかった古い世代のグラボは、一覧に入れていません。</li></ul>
<p><a class="btn" href="../#/games?g=${esc(g.id)}">CPUを変えて計算する（ゲーム別fpsツール）</a></p></article>`;
  out.push(['fps/' + g.id + '.html', page({ dir: 'fps', file: g.id + '.html', title, desc, body, crumbs: [['./', 'ゲーム別fpsの目安']] })]);
  sitemap.push(['fps/' + g.id + '.html', today]);
});
{
  const body = `<h1>ゲーム別fpsの目安とおすすめグラボ</h1><p class="muted">${D.games.length}本のゲームについて、フルHD・WQHD・4Kでのグラボ別fpsの目安をまとめています（計算モデルによる目安・価格確認日 ${esc(priceDate)}）。</p><div class="grid g3 sp">` +
    D.games.map(g => { const x = cheapest(g, 1080, g.cap ? Math.min(60, g.cap) : 144); return `<a class="card card-link" href="${g.id}.html"><h2 style="font-size:1.05rem">${esc(g.name)}</h2><p class="muted">${esc(g.genre || '')}${x ? `<br>フルHD ${g.cap ? Math.min(60, g.cap) : 144}fpsの目安: ${esc(x.name)}〜` : ''}</p></a>`; }).join('') + '</div>';
  out.push(['fps/index.html', page({ dir: 'fps', file: 'index.html', title: 'ゲーム別fpsの目安とおすすめグラボ', desc: `Apex・VALORANT・モンハン・ARKなど${D.games.length}本のゲームについて、グラボ別のfpsの目安と、目標fpsに届くいちばん安いグラボをまとめました。`, body })]);
  sitemap.push(['fps/', today]);
}

/* ---------- 書き出し ---------- */
['guide', 'fps'].forEach(d => {
  const dir = path.join(root, d);
  fs.mkdirSync(dir, { recursive: true });
  // 前回作ったHTMLで、今回なくなったものは消す（このツールが作るフォルダの中だけ）
  fs.readdirSync(dir).filter(f => f.endsWith('.html') && !out.some(o => o[0] === d + '/' + f)).forEach(f => fs.unlinkSync(path.join(dir, f)));
});
out.forEach(([p, html]) => fs.writeFileSync(path.join(root, p), html));
fs.writeFileSync(path.join(root, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemap.map(([p, d]) => `  <url><loc>${SITE}${p}</loc><lastmod>${d}</lastmod></url>`).join('\n') + '\n</urlset>\n');
console.log(`静的ページを ${out.length} 件作りました（guide/・fps/）。sitemap.xml も更新しました（${sitemap.length} 件）。`);
