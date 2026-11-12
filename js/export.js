/* ============================================================
   構成を画像(PNG)で保存 / QRコード表示
   ============================================================ */
(function () {
  const U = PCR_UI, E = PCR_ENGINE, CFG = PCR_CONFIG;
  const FONT = '"Hiragino Sans","Noto Sans JP","Yu Gothic","Meiryo",sans-serif';

  function drawQr(ctx, text, x, y, size) {
    const qr = PCR_QR.make(text);
    if (!qr) return false;
    const quiet = 3, n = qr.size + quiet * 2, cell = size / n;
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, size, size);
    ctx.fillStyle = '#111';
    for (let r = 0; r < qr.size; r++) for (let c = 0; c < qr.size; c++) if (qr.get(c, r)) ctx.fillRect(Math.floor(x + (c + quiet) * cell), Math.floor(y + (r + quiet) * cell), Math.ceil(cell), Math.ceil(cell));
    return true;
  }
  function trim(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    while (text.length > 1 && ctx.measureText(text + '…').width > maxW) text = text.slice(0, -1);
    return text + '…';
  }

  /* 構成の画像を作る。返り値: canvas */
  U.buildCanvas = function (ids, ctxEv, name, path) {
    const ev = E.evaluate(ids, ctxEv);
    const W = 1080, rowH = 62, pad = 56;
    const checks = ev.checks.filter(c => c.lv !== 'ok').slice(0, 3);
    const fpsN = Math.min(ev.fpsRows.length, 5);
    const H = 150 + E.KEYS.length * rowH + 160 + (fpsN ? 60 + fpsN * 44 : 0) + (checks.length ? 50 + checks.length * 40 : 0) + 260;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    g.fillStyle = '#f5f8fc'; g.fillRect(0, 0, W, H);
    const grad = g.createLinearGradient(0, 0, W, 0); grad.addColorStop(0, '#2563eb'); grad.addColorStop(1, '#14b8a6');
    g.fillStyle = grad; g.fillRect(0, 0, W, 120);
    g.fillStyle = '#fff'; g.font = '700 40px ' + FONT; g.textBaseline = 'middle'; g.fillText(trim(g, name || 'PC構成', W - pad * 2 - 200), pad, 48);
    g.font = '400 24px ' + FONT; g.fillText(CFG.siteName + '  ' + new Date().toLocaleDateString('ja-JP'), pad, 90);
    let y = 150;
    g.fillStyle = '#fff'; g.fillRect(pad - 16, y - 10, W - pad * 2 + 32, E.KEYS.length * rowH + 20);
    E.KEYS.forEach((k, i) => {
      const p = ev.B[k], cy = y + i * rowH + rowH / 2;
      if (i) { g.fillStyle = '#e5eaf2'; g.fillRect(pad, y + i * rowH, W - pad * 2, 2); }
      g.fillStyle = '#64748b'; g.font = '600 24px ' + FONT; g.fillText(E.LABEL[k], pad, cy);
      g.fillStyle = '#0f172a'; g.font = '500 28px ' + FONT; g.fillText(trim(g, p.name, 560), pad + 230, cy);
      g.textAlign = 'right'; g.fillStyle = '#334155'; g.font = '600 26px ' + FONT; g.fillText(p.price ? U.yen(p.price) : '-', W - pad, cy); g.textAlign = 'left';
    });
    y += E.KEYS.length * rowH + 50;
    g.fillStyle = '#0f172a'; g.font = '700 28px ' + FONT; g.fillText('合計（目安）', pad, y + 28);
    g.textAlign = 'right'; g.fillStyle = '#2563eb'; g.font = '800 64px ' + FONT; g.fillText(U.yen(ev.total), W - pad, y + 28); g.textAlign = 'left';
    y += 70; g.fillStyle = '#64748b'; g.font = '400 24px ' + FONT;
    g.fillText('電源の推奨 ' + ev.power.rec + 'W以上（選択 ' + ev.B.psu.w + 'W）', pad, y + 20);
    y += 90;
    if (fpsN) {
      g.fillStyle = '#0f172a'; g.font = '700 28px ' + FONT; g.fillText('fpsの目安（計算モデル・実測ではありません）', pad, y);
      y += 30;
      ev.fpsRows.slice(0, fpsN).forEach((f, i) => {
        const cy = y + i * 44 + 22;
        g.fillStyle = '#334155'; g.font = '500 24px ' + FONT; g.fillText(trim(g, f.game.name.replace(/ \(.*\)$/, ''), 480), pad, cy);
        g.fillStyle = '#dbe5f3'; g.fillRect(pad + 500, cy - 10, 320, 20);
        g.fillStyle = grad; g.fillRect(pad + 500, cy - 10, Math.min(320, 320 * f.fps / 300), 20);
        g.textAlign = 'right'; g.fillStyle = '#0f172a'; g.font = '700 24px ' + FONT; g.fillText('約' + Math.round(f.fps) + 'fps', W - pad, cy); g.textAlign = 'left';
      });
      y += fpsN * 44 + 20;
    }
    if (checks.length) {
      g.fillStyle = '#b45309'; g.font = '700 26px ' + FONT; g.fillText('注意点', pad, y + 10); y += 40;
      checks.forEach(c => { g.fillStyle = '#7c2d12'; g.font = '400 22px ' + FONT; g.fillText(trim(g, (c.lv === 'ng' ? '【要修正】' : '【注意】') + c.title, W - pad * 2), pad, y + 12); y += 40; });
    }
    // QR（開くと同じ構成が出る）
    const url = U.shortUrl(path || '/build', ids), qrOk = /^https?:/.test(url) && drawQr(g, url, W - pad - 200, H - 240, 200);
    g.fillStyle = '#64748b'; g.font = '400 22px ' + FONT;
    g.fillText(qrOk ? 'QRコードを読み取ると、同じ構成が開きます' : '同じ構成は、サイトの「共有URL」から開けます', pad, H - 150);
    g.fillText(CFG.priceIsPlaceholder ? '※価格は仮の目安です。購入前に必ず最新の価格を確認してください。' : '※価格は変わります。購入前に最新の価格を確認してください。', pad, H - 110);
    g.fillText('※性能は目安で、実測ではありません。', pad, H - 70);
    return cv;
  };
  U.downloadImage = function (ids, ctxEv, name, path, file) {
    try {
      U.buildCanvas(ids, ctxEv, name, path).toBlob(function (blob) {
        if (!blob) { U.toast('画像を作れませんでした'); return; }
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file || 'pc-recipe.png';
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
        U.toast('画像を保存しました');
      }, 'image/png');
    } catch (e) { U.toast('画像を作れませんでした'); }
  };
  /* QRだけを小さなダイアログで見せる */
  U.showQr = function (url) {
    if (!/^https?:/.test(url)) { U.toast('公開したサイトのURLでないため、QRは作れません（公開後に使えます）'); return; }
    const cv = document.createElement('canvas'); cv.width = cv.height = 320;
    if (!drawQr(cv.getContext('2d'), url, 0, 0, 320)) { U.toast('URLが長すぎてQRにできませんでした'); return; }
    const d = document.createElement('div'); d.className = 'qr-pop';
    d.innerHTML = '<div class="qr-box" role="dialog" aria-label="QRコード"><b>スマホで読み取ると開きます</b></div>';
    const box = d.firstChild; box.appendChild(cv);
    const b = document.createElement('button'); b.className = 'btn sub sm'; b.textContent = '閉じる'; b.onclick = () => d.remove(); box.appendChild(b);
    d.onclick = e => { if (e.target === d) d.remove(); };
    document.body.appendChild(d);
  };
})();
