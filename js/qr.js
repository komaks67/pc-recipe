/* ============================================================
   QRコード生成（外部サービス・ライブラリなし）
   バイトモード / 誤り訂正レベルM / バージョン1〜10（最大216バイト）
   使い方: PCR_QR.make('文字列') → { size, get(x,y) }  /  収まらない場合は null
   ============================================================ */
window.PCR_QR = (function () {
  // [誤り訂正バイト数/ブロック, [ブロック数, データ語数] の組...]
  const EC = [null, [10, [1, 16]], [16, [1, 28]], [26, [1, 44]], [18, [2, 32]], [24, [2, 43]], [16, [4, 27]], [18, [4, 31]], [22, [2, 38], [2, 39]], [22, [3, 36], [2, 37]], [26, [4, 43], [1, 44]]];
  const ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

  // GF(256)
  const EXP = new Array(512), LOG = new Array(256);
  (function () { let x = 1; for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11D; } for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  const mul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
  function rsGen(n) { let p = [1]; for (let i = 0; i < n; i++) { const q = new Array(p.length + 1).fill(0); for (let j = 0; j < p.length; j++) { q[j] ^= p[j]; q[j + 1] ^= mul(p[j], EXP[i]); } p = q; } return p; }
  function rsRem(data, n) {
    const gen = rsGen(n), r = new Array(n).fill(0);
    data.forEach(d => { const f = d ^ r.shift(); r.push(0); if (f) for (let i = 0; i < n; i++) r[i] ^= mul(gen[i + 1], f); });
    return r;
  }
  const capacity = v => EC[v].slice(1).reduce((s, g) => s + g[0] * g[1], 0);

  function bchFormat(data) { let v = data << 10; for (let i = 14; i >= 10; i--) if ((v >> i) & 1) v ^= 0x537 << (i - 10); return ((data << 10) | v) ^ 0x5412; }
  function bchVersion(ver) { let v = ver << 12; for (let i = 17; i >= 12; i--) if ((v >> i) & 1) v ^= 0x1F25 << (i - 12); return (ver << 12) | v; }

  function make(text) {
    const bytes = Array.from(unescape(encodeURIComponent(text))).map(c => c.charCodeAt(0));
    let ver = 0;
    for (let v = 1; v <= 10; v++) { const cc = v < 10 ? 8 : 16; if (4 + cc + bytes.length * 8 <= capacity(v) * 8) { ver = v; break; } }
    if (!ver) return null;
    const cap = capacity(ver), ccBits = ver < 10 ? 8 : 16;
    // ビット列
    const bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    put(4, 4); put(bytes.length, ccBits); bytes.forEach(b => put(b, 8));
    put(0, Math.min(4, cap * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; data.push(b); }
    for (let pad = 0xEC; data.length < cap; pad ^= 0xEC ^ 0x11) data.push(pad);
    // ブロック分割＋誤り訂正
    const ecLen = EC[ver][0], blocks = []; let pos = 0;
    EC[ver].slice(1).forEach(g => { for (let i = 0; i < g[0]; i++) { const d = data.slice(pos, pos + g[1]); pos += g[1]; blocks.push({ d: d, e: rsRem(d, ecLen) }); } });
    const out = [], maxD = Math.max.apply(null, blocks.map(b => b.d.length));
    for (let i = 0; i < maxD; i++) blocks.forEach(b => { if (i < b.d.length) out.push(b.d[i]); });
    for (let i = 0; i < ecLen; i++) blocks.forEach(b => out.push(b.e[i]));

    const N = ver * 4 + 17;
    const M = [], F = [];   // 値 / 機能パターン(固定)
    for (let i = 0; i < N; i++) { M.push(new Array(N).fill(0)); F.push(new Array(N).fill(false)); }
    const set = (x, y, v) => { if (x < 0 || y < 0 || x >= N || y >= N) return; M[y][x] = v ? 1 : 0; F[y][x] = true; };
    // ファインダー
    [[0, 0], [N - 7, 0], [0, N - 7]].forEach(p => {
      for (let dy = -1; dy <= 7; dy++) for (let dx = -1; dx <= 7; dx++) {
        const on = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        set(p[0] + dx, p[1] + dy, on);
      }
    });
    // タイミング
    for (let i = 8; i < N - 8; i++) { set(i, 6, i % 2 === 0); set(6, i, i % 2 === 0); }
    // 位置合わせ
    const al = ALIGN[ver];
    al.forEach(ay => al.forEach(ax => {
      if ((ax === 6 && ay === 6) || (ax === 6 && ay === al[al.length - 1]) || (ay === 6 && ax === al[al.length - 1])) return;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }));
    // 形式情報の場所を予約（あとで書く）
    for (let i = 0; i < 9; i++) { F[8][i] = true; F[i][8] = true; }
    for (let i = 0; i < 8; i++) { F[8][N - 1 - i] = true; F[N - 1 - i][8] = true; }
    set(8, N - 8, 1);   // 暗モジュール
    if (ver >= 7) { const vb = bchVersion(ver); for (let i = 0; i < 18; i++) { const b = (vb >> i) & 1, a = N - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, b); set(c, a, b); } }
    // データ配置
    const dbits = []; out.forEach(b => { for (let i = 7; i >= 0; i--) dbits.push((b >> i) & 1); });
    let bi = 0, up = true;
    for (let x = N - 1; x > 0; x -= 2) {
      if (x === 6) x = 5;
      for (let k = 0; k < N; k++) {
        const y = up ? N - 1 - k : k;
        for (let dx = 0; dx < 2; dx++) { const xx = x - dx; if (!F[y][xx]) { M[y][xx] = bi < dbits.length ? dbits[bi] : 0; bi++; } }
      }
      up = !up;
    }
    // マスク選び（連続・2x2の簡易ペナルティ）
    const masks = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x, y) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0, (x, y) => (x * y) % 2 + (x * y) % 3 === 0, (x, y) => ((x * y) % 2 + (x * y) % 3) % 2 === 0, (x, y) => ((x + y) % 2 + (x * y) % 3) % 2 === 0];
    function applied(m) {
      return M.map((row, y) => row.map((v, x) => F[y][x] ? v : (masks[m](x, y) ? v ^ 1 : v)));
    }
    function penalty(G) {
      let p = 0;
      for (let t = 0; t < 2; t++) for (let a = 0; a < N; a++) { let run = 1; for (let b = 1; b < N; b++) { const c = t ? G[b][a] : G[a][b], d = t ? G[b - 1][a] : G[a][b - 1]; if (c === d) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (let y = 0; y < N - 1; y++) for (let x = 0; x < N - 1; x++) if (G[y][x] === G[y][x + 1] && G[y][x] === G[y + 1][x] && G[y][x] === G[y + 1][x + 1]) p += 3;
      return p;
    }
    let best = null, bm = 0;
    for (let m = 0; m < 8; m++) { const G = applied(m), p = penalty(G); if (!best || p < best.p) { best = { G: G, p: p }; bm = m; } }
    const G = best.G;
    // 形式情報（レベルM=0, マスク番号）
    const fb = bchFormat((0 << 3) | bm);
    for (let i = 0; i < 15; i++) {
      const b = (fb >> i) & 1;
      if (i < 6) G[i][8] = b; else if (i < 8) G[i + 1][8] = b; else if (i < 9) G[8][7] = b; else G[8][14 - i] = b;
      if (i < 8) G[8][N - 1 - i] = b; else G[N - 15 + i][8] = b;
    }
    G[N - 8][8] = 1;
    return { size: N, get: (x, y) => G[y][x] === 1 };
  }
  return { make: make };
})();
