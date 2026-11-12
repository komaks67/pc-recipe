#!/usr/bin/env node
/* パーツ写真の取得ツール（楽天市場 商品検索API → js/images.js）
 *
 * 必要なもの（楽天ウェブサービスで無料登録。キーは「環境変数」で渡し、サイトのファイルには書きません）
 *   RAKUTEN_APP_ID       … アプリID
 *   RAKUTEN_ACCESS_KEY   … アクセスキー
 *   RAKUTEN_REFERER      … 楽天ウェブサービスに登録した「アプリのURL」（例: https://ユーザー名.github.io/pc-recipe/）
 *   RAKUTEN_ENDPOINT     … （任意）APIのURL。省略時は下の既定値
 *
 * 使い方:
 *   RAKUTEN_APP_ID=xxx RAKUTEN_ACCESS_KEY=yyy RAKUTEN_REFERER=https://... node tools/fetch-images.mjs
 *   node tools/fetch-images.mjs --refresh   … すでに取得済みの写真も取り直す
 *
 * キーが無いときは何もせず終了します（サイトは写真なしの表示のまま動きます）。
 * ※ 商品画像の著作権は各ショップにあります。サイトには「Supported by Rakuten Developers」の表示が出ます。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const APP = process.env.RAKUTEN_APP_ID, KEY = process.env.RAKUTEN_ACCESS_KEY, REF = process.env.RAKUTEN_REFERER;
const ENDPOINT = process.env.RAKUTEN_ENDPOINT || 'https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601';
const refresh = process.argv.includes('--refresh');

if (!APP || !KEY) {
  console.log('RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が設定されていないため、写真の取得は行いません（写真なしで動きます）。');
  process.exit(0);
}

const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(read('js/config.js'), sandbox);
vm.runInContext(read('js/data.js'), sandbox);
const D = sandbox.PCR_DATA;
const KEYS = ['cpu', 'gpu', 'mb', 'mem', 'ssd', 'psu', 'case', 'cooler'];

// いまの images.js を読み込む
let images = {};
try {
  const sb = { window: {} }; sb.window = sb; vm.createContext(sb);
  vm.runInContext(read('js/images.js'), sb);
  images = sb.PCR_IMAGES || {};
} catch (e) { images = {}; }

/* 型番っぽい文字列（例: 9700X, RTX 5070）を取り出して、無関係な商品を除く */
function token(name) {
  const m = name.replace(/[()（）]/g, ' ').split(/\s+/).filter(w => /[0-9]/.test(w) && /[A-Za-z]|[0-9]{3,}/.test(w));
  return m.length ? m.sort((a, b) => b.length - a.length)[0].toLowerCase() : null;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

let added = 0, miss = 0, fail = 0;
for (const k of KEYS) {
  images[k] = images[k] || {};
  for (const p of D[k]) {
    if (p.id === 'none' || (images[k][p.id] && !refresh)) continue;
    const keyword = p.q || p.name;
    const url = new URL(ENDPOINT);
    Object.entries({ applicationId: APP, accessKey: KEY, keyword: keyword, hits: 10, imageFlag: 1, format: 'json', formatVersion: 2, availability: 1 }).forEach(([a, b]) => url.searchParams.set(a, b));
    try {
      const res = await fetch(url, { headers: REF ? { Referer: REF, Origin: new URL(REF).origin } : {} });
      if (!res.ok) { console.log('✗', k, p.id, res.status); fail++; if (res.status === 401 || res.status === 403) { console.log('認証エラーです。ID・アクセスキー・登録したURL(RAKUTEN_REFERER)を確認してください。'); break; } continue; }
      const json = await res.json();
      const items = (json.Items || []).map(x => x.Item || x);
      const t = token(p.name);
      const hit = items.find(it => {
        const img = (it.mediumImageUrls || [])[0];
        const src = typeof img === 'string' ? img : img && img.imageUrl;
        return src && (!t || String(it.itemName || '').toLowerCase().indexOf(t) >= 0);
      });
      if (hit) {
        const img = hit.mediumImageUrls[0], src = typeof img === 'string' ? img : img.imageUrl;
        images[k][p.id] = { u: src.replace(/\?_ex=\d+x\d+/, '?_ex=200x200') };
        added++; console.log('○', k, p.id);
      } else { miss++; console.log('－', k, p.id, '（該当なし）'); }
    } catch (e) { fail++; console.log('✗', k, p.id, e.message); }
    await sleep(1100);   // APIの利用間隔（1秒に1回まで）を守る
  }
}
const out = '/* 自動生成: node tools/fetch-images.mjs（楽天市場 商品検索API）。手で編集しても構いません。\n   画像の著作権は各ショップにあります。 */\nwindow.PCR_IMAGES = ' + JSON.stringify(images, null, 1) + ';\n';
fs.writeFileSync(path.join(root, 'js/images.js'), out);
console.log('完了: 追加 ' + added + ' / 該当なし ' + miss + ' / 失敗 ' + fail);
