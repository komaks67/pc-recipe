/* 価格の上書きデータ。tools/update-prices.mjs が自動で作ります（手で書き換えても動きます）。
   形式: window.PCR_PRICES = { __date: '2026-11-12', cpu: { 'r5-9600x': 34800 }, gpu: { ... } };
   ここに無いパーツは、data.js の price が使われます。 */
window.PCR_PRICES = {};
