#!/usr/bin/env node
/* 価格データ更新ツール（CSV → js/prices.js / js/bto-models.js）
 *
 * 使い方:
 *   node tools/update-prices.mjs --init     … 今のパーツ一覧から tools/parts-prices.csv の雛形を作る
 *   node tools/update-prices.mjs            … CSV を読み込んで js/prices.js と js/bto-models.js を作り直す
 *
 * CSV は Excel / Googleスプレッドシートで編集して「CSV(UTF-8)」で保存してください。
 * 将来、ASPの商品データ(API/フィード)が使えるようになったら、
 * その取得結果を同じ形のCSVに書き出す処理を足すだけで、自動更新にできます。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

// data.js を読み込んで、パーツIDの一覧を得る
const sandbox = { window: {}, console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(read('js/config.js'), sandbox);
vm.runInContext(read('js/parts-real.js'), sandbox);
vm.runInContext(read('js/data.js'), sandbox);
const D = sandbox.PCR_DATA;
const KEYS = ['cpu', 'gpu', 'mb', 'mem', 'ssd', 'psu', 'case', 'cooler', 'os'];

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^﻿/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(x => x.trim() !== '')) rows.push(row); row = []; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some(x => x.trim() !== '')) rows.push(row); }
  return rows;
}
const toObjs = rows => { const h = rows[0].map(x => x.trim()); return rows.slice(1).map(r => Object.fromEntries(h.map((k, i) => [k, (r[i] || '').trim()]))); };
const esc = v => /[",\n]/.test(v) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v);

if (process.argv.includes('--init')) {
  // すでに入力した価格は消さずに、新しく増えたパーツの行だけを足す
  const old = {};
  const pf0 = path.join(root, 'tools/parts-prices.csv');
  if (fs.existsSync(pf0)) toObjs(parseCsv(fs.readFileSync(pf0, 'utf8'))).forEach(r => { old[r.category + '/' + r.id] = r; });
  const lines = ['category,id,name,price,checked,source'];
  // 新しい行: 実際の商品（parts-real.js）は商品ページの確認日、中古グラボは data.js の価格を「中古の目安」として入れる
  const fresh = p => p.real ? [p.price, p.checked || '', 'ドスパラ通販の販売価格（実際の商品）'] : p.used ? [p.price, '', 'ドスパラ中古の販売価格（要確認）'] : [p.price, '', '目安(未確認)'];
  KEYS.forEach(k => D[k].forEach(p => {
    const o = old[k + '/' + p.id];
    const v = o && o.price !== '' ? [o.price, o.checked || '', o.source || ''] : fresh(p);
    lines.push([k, p.id, p.name].concat(v).map(x => esc(String(x))).join(','));
  }));
  fs.writeFileSync(pf0, '\uFEFF' + lines.join('\n') + '\n');
  if (!fs.existsSync(path.join(root, 'tools/bto-models.csv'))) {
    fs.writeFileSync(path.join(root, 'tools/bto-models.csv'), '\uFEFFmaker,name,cpu,gpu,memGB,ssdTB,price,warranty_years,delivery_days,url,updated\n');
  }
  console.log('tools/parts-prices.csv を更新しました（入力済みの価格はそのまま残しています）。価格を入れてから、もう一度 node tools/update-prices.mjs を実行してください。');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const problems = [];

// ---- パーツ価格 ----
const prices = { __date: today, __unverified: {}, __checked: {} };
const pf = path.join(root, 'tools/parts-prices.csv');
if (fs.existsSync(pf)) {
  toObjs(parseCsv(fs.readFileSync(pf, 'utf8'))).forEach((r, i) => {
    const line = i + 2;
    if (!r.price) return;                              // 価格が空の行は無視（data.js の値を使う）
    const price = Number(r.price.replace(/[,¥円\s]/g, ''));
    if (!KEYS.includes(r.category) || !D.by[r.category][r.id]) { problems.push('parts-prices.csv ' + line + '行目: 知らないパーツです (' + r.category + ' / ' + r.id + ')'); return; }
    if (!Number.isFinite(price) || price < 0 || price > 3000000) { problems.push('parts-prices.csv ' + line + '行目: 価格が正しくありません (' + r.price + ')'); return; }
    (prices[r.category] = prices[r.category] || {})[r.id] = price;
    // checked 列（確認日）が空の CPU・グラボは「価格未確認」として、おまかせ提案に使わない
    if ('checked' in r && (r.category === 'cpu' || r.category === 'gpu')) {
      if (!r.checked) (prices.__unverified[r.category] = prices.__unverified[r.category] || []).push(r.id);
      else if (/^\d{4}-\d{2}/.test(r.checked)) (prices.__checked[r.category] = prices.__checked[r.category] || {})[r.id] = r.checked;
    }
  });
} else problems.push('tools/parts-prices.csv がありません。--init で作れます。');

// ---- BTOモデル ----
const models = [];
const bf = path.join(root, 'tools/bto-models.csv');
if (fs.existsSync(bf)) {
  toObjs(parseCsv(fs.readFileSync(bf, 'utf8'))).forEach((r, i) => {
    const line = i + 2, price = Number((r.price || '').replace(/[,¥円\s]/g, ''));
    const MAKERS = Object.keys(sandbox.PCR_CONFIG.affiliate.bto);
    if (!MAKERS.includes(r.maker)) { problems.push('bto-models.csv ' + line + '行目: maker は ' + MAKERS.join(' / ') + ' のどれかです（js/config.js の affiliate.bto に書いたもの）'); return; }
    if (!D.by.cpu[r.cpu] || !D.by.gpu[r.gpu]) { problems.push('bto-models.csv ' + line + '行目: cpu か gpu のIDが data.js にありません (' + r.cpu + ' / ' + r.gpu + ')'); return; }
    if (!Number.isFinite(price) || price <= 0) { problems.push('bto-models.csv ' + line + '行目: 価格が正しくありません'); return; }
    if (r.url && !/^https?:\/\//.test(r.url)) { problems.push('bto-models.csv ' + line + '行目: url は http(s):// で始めてください'); return; }
    models.push({ maker: r.maker, name: r.name, cpu: r.cpu, gpu: r.gpu, memGB: Number(r.memGB) || 0, ssdTB: Number(r.ssdTB) || 0, price: price, warranty: Number(r.warranty_years) || 0, days: Number(r.delivery_days) || 0, url: r.url || '', updated: r.updated || today });
  });
}

if (problems.length) { console.error('次の問題があります:\n- ' + problems.join('\n- ')); }
const hard = problems.filter(p => !p.includes('がありません。--init'));
if (hard.length) { console.error('\n修正してからもう一度実行してください（ファイルは更新していません）。'); process.exit(1); }

fs.writeFileSync(path.join(root, 'js/prices.js'), '/* 自動生成: tools/update-prices.mjs（' + today + '） */\nwindow.PCR_PRICES = ' + JSON.stringify(prices, null, 1) + ';\n');
fs.writeFileSync(path.join(root, 'js/bto-models.js'), '/* 自動生成: tools/update-prices.mjs（' + today + '） */\nwindow.PCR_BTO_MODELS = ' + JSON.stringify(models, null, 1) + ';\n');
// ---- 価格の履歴（その日の価格を1点追加。同じ日は上書き） ----
const hsb = { window: {} }; hsb.window = hsb; vm.createContext(hsb);
const hf = path.join(root, 'js/price-history.js');
try { vm.runInContext(read('js/price-history.js'), hsb); } catch (e) { /* 初回 */ }
const hist = hsb.PCR_HISTORY || {};
Object.keys(prices).filter(k => !k.startsWith('__')).forEach(k => {
  hist[k] = hist[k] || {};
  Object.keys(prices[k]).forEach(id => {
    const arr = (hist[k][id] = hist[k][id] || []).filter(p => p[0] !== today);
    arr.push([today, prices[k][id]]);
    hist[k][id] = arr.slice(-120);
  });
});
fs.writeFileSync(hf, '/* 自動生成: tools/update-prices.mjs。実行のたびに、その日の価格が1点ずつ増えます */\nwindow.PCR_HISTORY = ' + JSON.stringify(hist) + ';\n');

const n = Object.keys(prices).filter(k => !k.startsWith('__')).reduce((s, k) => s + Object.keys(prices[k]).length, 0);
console.log('js/prices.js を更新しました（パーツ ' + n + ' 件）／ js/bto-models.js を更新しました（BTOモデル ' + models.length + ' 件）');
console.log('価格を最新にしたら、js/config.js の priceIsPlaceholder を false にしてください。');
