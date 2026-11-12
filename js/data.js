/* ============================================================
   PC Recipe パーツデータ
   - 仕様（ソケット・消費電力・規格など）は公式情報をもとにした値
   - gs / mt / score は「相対的な性能の目安」（公式の数値ではありません）
   - price は仮の目安値です（config.js の priceIsPlaceholder を参照）
   - 確認日: config.js の dataDate
   パーツを足したいときは、各配列に1行足すだけで画面に反映されます。
   ============================================================ */
window.PCR_DATA = (function () {
  const D = {};

  /* ---------- CPU ----------
     sock: ソケット / tdp: 公称TDP / pw: 最大時の消費電力の目安(W)
     gs: ゲーム性能の目安(Ryzen 7 9800X3D = 100) / mt: 動画編集など多コア性能の目安(最大=100)
     plus: Core Ultra 200S Plus（2026年3月発売。仕様は公式で要確認） */
  D.cpu = [
    { id: 'r5-9600x',  name: 'Ryzen 5 9600X',  b: 'AMD', sock: 'AM5', core: '6コア/12スレッド',  tdp: 65,  pw: 90,  gs: 68,  mt: 45,  price: 35000, q: 'Ryzen 5 9600X' },
    { id: 'r7-9700x',  name: 'Ryzen 7 9700X',  b: 'AMD', sock: 'AM5', core: '8コア/16スレッド',  tdp: 65,  pw: 90,  gs: 74,  mt: 55,  price: 48000, q: 'Ryzen 7 9700X' },
    { id: 'r7-9800x3d',name: 'Ryzen 7 9800X3D',b: 'AMD', sock: 'AM5', core: '8コア/16スレッド',  tdp: 120, pw: 125, gs: 100, mt: 56,  price: 68000, q: 'Ryzen 7 9800X3D', x3d: true },
    { id: 'r9-9900x',  name: 'Ryzen 9 9900X',  b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 120, pw: 165, gs: 72,  mt: 75,  price: 58000, q: 'Ryzen 9 9900X' },
    { id: 'r9-9950x',  name: 'Ryzen 9 9950X',  b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 170, pw: 205, gs: 75,  mt: 100, price: 85000, q: 'Ryzen 9 9950X' },
    { id: 'r9-9950x3d',name: 'Ryzen 9 9950X3D',b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 170, pw: 205, gs: 97,  mt: 100, price: 98000, q: 'Ryzen 9 9950X3D', x3d: true },
    { id: 'cu5-245k',  name: 'Core Ultra 5 245K',     b: 'Intel', sock: 'LGA1851', core: '14コア(6P+8E)',  tdp: 125, pw: 160, gs: 68, mt: 62,  price: 45000, q: 'Core Ultra 5 245K', oc: true },
    { id: 'cu5-250kp', name: 'Core Ultra 5 250K Plus',b: 'Intel', sock: 'LGA1851', core: 'Eコア増量版(詳細は公式で確認)', tdp: 125, pw: 160, gs: 74, mt: 80,  price: 38000, q: 'Core Ultra 5 250K Plus', oc: true, plus: true },
    { id: 'cu7-265k',  name: 'Core Ultra 7 265K',     b: 'Intel', sock: 'LGA1851', core: '20コア(8P+12E)', tdp: 125, pw: 250, gs: 76, mt: 82,  price: 62000, q: 'Core Ultra 7 265K', oc: true },
    { id: 'cu7-270kp', name: 'Core Ultra 7 270K Plus',b: 'Intel', sock: 'LGA1851', core: 'Eコア増量版(詳細は公式で確認)', tdp: 125, pw: 250, gs: 82, mt: 95,  price: 47000, q: 'Core Ultra 7 270K Plus', oc: true, plus: true },
    { id: 'cu9-285k',  name: 'Core Ultra 9 285K',     b: 'Intel', sock: 'LGA1851', core: '24コア(8P+16E)', tdp: 125, pw: 250, gs: 80, mt: 100, price: 90000, q: 'Core Ultra 9 285K', oc: true }
  ];

  /* ---------- GPU ----------
     tgp: 消費電力(W) / rec: メーカー推奨の電源容量(W) / len: 市販品のおおよその長さ(mm・製品で差あり)
     slots: 厚みの目安(スロット数) / conn: 電源コネクタ / score: 性能の目安(RTX 5090 = 100) */
  D.gpu = [
    { id: 'none',     name: 'グラフィックボードなし(CPU内蔵)', b: '-', vram: 0,  tgp: 0,   rec: 0,    len: 0,   slots: 0,   conn: '-',      score: 3,   price: 0,      q: '' },
    { id: 'rtx5050',  name: 'GeForce RTX 5050',        b: 'NVIDIA', vram: 8,  tgp: 130, rec: 550,  len: 240, slots: 2,   conn: '8pin',   score: 22,  price: 40000,  q: 'GeForce RTX 5050' },
    { id: 'rtx5060',  name: 'GeForce RTX 5060',        b: 'NVIDIA', vram: 8,  tgp: 145, rec: 550,  len: 250, slots: 2,   conn: '8pin',   score: 29,  price: 55000,  q: 'GeForce RTX 5060' },
    { id: 'rx9060xt', name: 'Radeon RX 9060 XT 16GB',  b: 'AMD',    vram: 16, tgp: 160, rec: 450,  len: 280, slots: 2.5, conn: '8pin',   score: 35,  price: 68000,  q: 'Radeon RX 9060 XT 16GB' },
    { id: 'rtx5060ti',name: 'GeForce RTX 5060 Ti 16GB',b: 'NVIDIA', vram: 16, tgp: 180, rec: 600,  len: 270, slots: 2.5, conn: '8pin',   score: 36,  price: 78000,  q: 'GeForce RTX 5060 Ti 16GB' },
    { id: 'rtx5070',  name: 'GeForce RTX 5070',        b: 'NVIDIA', vram: 12, tgp: 250, rec: 650,  len: 300, slots: 2.5, conn: '12V-2x6',score: 48,  price: 95000,  q: 'GeForce RTX 5070' },
    { id: 'rx9070',   name: 'Radeon RX 9070',          b: 'AMD',    vram: 16, tgp: 220, rec: 650,  len: 310, slots: 3,   conn: '8pin×2', score: 55,  price: 105000, q: 'Radeon RX 9070' },
    { id: 'rtx5070ti',name: 'GeForce RTX 5070 Ti',     b: 'NVIDIA', vram: 16, tgp: 300, rec: 750,  len: 320, slots: 3,   conn: '12V-2x6',score: 62,  price: 135000, q: 'GeForce RTX 5070 Ti' },
    { id: 'rx9070xt', name: 'Radeon RX 9070 XT',       b: 'AMD',    vram: 16, tgp: 304, rec: 750,  len: 320, slots: 3,   conn: '8pin×2', score: 63,  price: 120000, q: 'Radeon RX 9070 XT' },
    { id: 'rtx5080',  name: 'GeForce RTX 5080',        b: 'NVIDIA', vram: 16, tgp: 360, rec: 850,  len: 330, slots: 3,   conn: '12V-2x6',score: 70,  price: 190000, q: 'GeForce RTX 5080' },
    { id: 'rtx5090',  name: 'GeForce RTX 5090',        b: 'NVIDIA', vram: 32, tgp: 575, rec: 1000, len: 340, slots: 3.5, conn: '12V-2x6',score: 100, price: 450000, q: 'GeForce RTX 5090' }
  ];

  /* ---------- マザーボード（チップセット別の代表クラス） ----------
     form: ATX / mATX / ITX / m2g: 搭載されるM.2の最大世代の目安 / wifi: yes no varies */
  D.mb = [
    { id: 'am5-a620-m',  name: 'AM5 A620 Micro-ATX',   sock: 'AM5', chip: 'A620', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, weakVrm: true, price: 12000, q: 'A620 Micro-ATX マザーボード AM5' },
    { id: 'am5-b650-m',  name: 'AM5 B650 Micro-ATX',   sock: 'AM5', chip: 'B650', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: true,  price: 17000, q: 'B650 Micro-ATX マザーボード AM5' },
    { id: 'am5-b850-m',  name: 'AM5 B850 Micro-ATX',   sock: 'AM5', chip: 'B850', form: 'mATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: true,  price: 22000, q: 'B850 Micro-ATX マザーボード AM5' },
    { id: 'am5-b850-a',  name: 'AM5 B850 ATX',         sock: 'AM5', chip: 'B850', form: 'ATX',  mem: 'DDR5', m2g: 5, wifi: 'varies', oc: true,  price: 26000, q: 'B850 ATX マザーボード AM5' },
    { id: 'am5-b850-i',  name: 'AM5 B850 Mini-ITX',    sock: 'AM5', chip: 'B850', form: 'ITX',  mem: 'DDR5', m2g: 5, wifi: 'yes',    oc: true,  price: 38000, q: 'B850 Mini-ITX マザーボード AM5' },
    { id: 'am5-x870e-a', name: 'AM5 X870E ATX',        sock: 'AM5', chip: 'X870E',form: 'ATX',  mem: 'DDR5', m2g: 5, wifi: 'yes',    oc: true,  price: 48000, q: 'X870E ATX マザーボード AM5' },
    { id: 'in-h810-m',   name: 'LGA1851 H810 Micro-ATX',sock: 'LGA1851', chip: 'H810', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, memOc: false, price: 15000, q: 'H810 Micro-ATX マザーボード LGA1851' },
    { id: 'in-b860-m',   name: 'LGA1851 B860 Micro-ATX',sock: 'LGA1851', chip: 'B860', form: 'mATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: false, price: 21000, q: 'B860 Micro-ATX マザーボード LGA1851' },
    { id: 'in-b860-a',   name: 'LGA1851 B860 ATX',     sock: 'LGA1851', chip: 'B860', form: 'ATX',  mem: 'DDR5', m2g: 5, wifi: 'varies', oc: false, price: 26000, q: 'B860 ATX マザーボード LGA1851' },
    { id: 'in-b860-i',   name: 'LGA1851 B860 Mini-ITX',sock: 'LGA1851', chip: 'B860', form: 'ITX',  mem: 'DDR5', m2g: 5, wifi: 'yes',    oc: false, price: 36000, q: 'B860 Mini-ITX マザーボード LGA1851' },
    { id: 'in-z890-a',   name: 'LGA1851 Z890 ATX',     sock: 'LGA1851', chip: 'Z890', form: 'ATX',  mem: 'DDR5', m2g: 5, wifi: 'yes',    oc: true,  price: 40000, q: 'Z890 ATX マザーボード LGA1851' }
  ];

  /* ---------- メモリ（今の世代はAMD・Intelとも DDR5 のみ） ---------- */
  D.mem = [
    { id: 'd5-16',    name: 'DDR5-5600 16GB(8GB×2)',  cap: 16, type: 'DDR5', price: 20000, q: 'DDR5 16GB 8GBx2 デスクトップ用メモリ' },
    { id: 'd5-32',    name: 'DDR5-5600 32GB(16GB×2)', cap: 32, type: 'DDR5', price: 38000, q: 'DDR5 32GB 16GBx2 デスクトップ用メモリ' },
    { id: 'd5-32f',   name: 'DDR5-6000 32GB(16GB×2)', cap: 32, type: 'DDR5', price: 41000, q: 'DDR5-6000 32GB 16GBx2 デスクトップ用メモリ' },
    { id: 'd5-64',    name: 'DDR5-6000 64GB(32GB×2)', cap: 64, type: 'DDR5', price: 80000, q: 'DDR5-6000 64GB 32GBx2 デスクトップ用メモリ' }
  ];

  /* ---------- ストレージ ---------- */
  D.ssd = [
    { id: 'sata-1', name: 'SATA SSD 1TB',      cap: 1, gen: 0, type: 'SATA', price: 9000,  q: 'SATA SSD 1TB 2.5インチ' },
    { id: 'g4-1',   name: 'NVMe Gen4 SSD 1TB', cap: 1, gen: 4, type: 'NVMe', price: 11000, q: 'NVMe M.2 SSD 1TB Gen4' },
    { id: 'g4-2',   name: 'NVMe Gen4 SSD 2TB', cap: 2, gen: 4, type: 'NVMe', price: 20000, q: 'NVMe M.2 SSD 2TB Gen4' },
    { id: 'g5-1',   name: 'NVMe Gen5 SSD 1TB', cap: 1, gen: 5, type: 'NVMe', price: 18000, q: 'NVMe M.2 SSD 1TB Gen5' },
    { id: 'g5-2',   name: 'NVMe Gen5 SSD 2TB', cap: 2, gen: 5, type: 'NVMe', price: 33000, q: 'NVMe M.2 SSD 2TB Gen5' }
  ];

  /* ---------- 電源 ---------- */
  D.psu = [
    { id: 'p550',  name: '550W 80PLUS Bronze (ATX)', w: 550,  form: 'ATX', grade: 'Bronze', atx3: false, price: 6500,  q: '電源ユニット 550W 80PLUS Bronze ATX' },
    { id: 'p650',  name: '650W 80PLUS Gold (ATX 3.x)', w: 650, form: 'ATX', grade: 'Gold',   atx3: true,  price: 9500,  q: '電源ユニット 650W 80PLUS Gold ATX3.1' },
    { id: 'p750',  name: '750W 80PLUS Gold (ATX 3.x)', w: 750, form: 'ATX', grade: 'Gold',   atx3: true,  price: 12000, q: '電源ユニット 750W 80PLUS Gold ATX3.1' },
    { id: 'p850',  name: '850W 80PLUS Gold (ATX 3.x)', w: 850, form: 'ATX', grade: 'Gold',   atx3: true,  price: 15000, q: '電源ユニット 850W 80PLUS Gold ATX3.1' },
    { id: 'p1000', name: '1000W 80PLUS Gold (ATX 3.x)',w: 1000,form: 'ATX', grade: 'Gold',   atx3: true,  price: 22000, q: '電源ユニット 1000W 80PLUS Gold ATX3.1' },
    { id: 'p1200', name: '1200W 80PLUS Platinum (ATX 3.x)', w: 1200, form: 'ATX', grade: 'Platinum', atx3: true, price: 32000, q: '電源ユニット 1200W 80PLUS Platinum ATX3.1' },
    { id: 'sfx750',name: '750W 80PLUS Gold (SFX・小型ケース用)', w: 750, form: 'SFX', grade: 'Gold', atx3: true, price: 20000, q: '電源ユニット SFX 750W 80PLUS Gold ATX3.1' }
  ];

  /* ---------- ケース（代表クラス。実際の製品は寸法を必ず確認） ----------
     gpuMax: 入るGPUの長さ(mm) / coolerMax: 入る空冷クーラーの高さ(mm) / rad: 入る水冷ラジエーター(mm) */
  D.case = [
    { id: 'c-mid',   name: 'ミドルタワー(標準)',        size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 380, coolerMax: 160, rad: [240, 360], psu: ['ATX'], gpuSlots: 4,   price: 10000, q: 'PCケース ミドルタワー ATX' },
    { id: 'c-quiet', name: 'ミドルタワー(静音重視)',    size: 'ミドル', noise: '静音', form: ['ATX', 'mATX', 'ITX'], gpuMax: 370, coolerMax: 165, rad: [240, 360], psu: ['ATX'], gpuSlots: 4,   price: 14000, q: 'PCケース 静音 ミドルタワー' },
    { id: 'c-air',   name: 'ミドルタワー(エアフロー重視)', size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 400, coolerMax: 170, rad: [240, 360], psu: ['ATX'], gpuSlots: 4,   price: 11000, q: 'PCケース エアフロー メッシュ ミドルタワー' },
    { id: 'c-matx',  name: 'コンパクト(Micro-ATX)',      size: 'ミニ',   noise: '標準', form: ['mATX', 'ITX'],        gpuMax: 330, coolerMax: 155, rad: [240],      psu: ['ATX'], gpuSlots: 3,   price: 8500,  q: 'PCケース Micro-ATX コンパクト' },
    { id: 'c-itx',   name: 'Mini-ITX 小型',              size: 'ミニ',   noise: '標準', form: ['ITX'],                gpuMax: 310, coolerMax: 70,  rad: [],         psu: ['SFX'], gpuSlots: 2.5, price: 15000, q: 'PCケース Mini-ITX 小型 SFX電源対応' },
    { id: 'c-full',  name: 'フルタワー(大型)',           size: '大型',   noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 450, coolerMax: 185, rad: [240, 360, 420], psu: ['ATX'], gpuSlots: 5, price: 22000, q: 'PCケース フルタワー 大型' }
  ];

  /* ---------- CPUクーラー ---------- */
  D.cooler = [
    { id: 'k-low',   name: '低背 空冷クーラー(〜47mm)', kind: '空冷', h: 47,  rad: 0,   tdpMax: 95,  noise: 'やや大きい', sock: ['AM5', 'LGA1851'], price: 3500,  q: 'CPUクーラー 低背 ロープロファイル AM5 LGA1700' },
    { id: 'k-air-s', name: '空冷 120mmタワー',          kind: '空冷', h: 155, rad: 0,   tdpMax: 150, noise: '標準',       sock: ['AM5', 'LGA1851'], price: 4500,  q: 'CPUクーラー 空冷 120mm サイドフロー' },
    { id: 'k-air-l', name: '空冷 大型デュアルタワー',   kind: '空冷', h: 165, rad: 0,   tdpMax: 250, noise: '静か',       sock: ['AM5', 'LGA1851'], price: 7500,  q: 'CPUクーラー 空冷 デュアルタワー 大型' },
    { id: 'k-aio240',name: '簡易水冷 240mm',            kind: '水冷', h: 0,   rad: 240, tdpMax: 250, noise: '標準',       sock: ['AM5', 'LGA1851'], price: 12000, q: '簡易水冷 CPUクーラー 240mm' },
    { id: 'k-aio360',name: '簡易水冷 360mm',            kind: '水冷', h: 0,   rad: 360, tdpMax: 350, noise: '静か',       sock: ['AM5', 'LGA1851'], price: 17000, q: '簡易水冷 CPUクーラー 360mm' }
  ];

  D.os = [
    { id: 'win11', name: 'Windows 11 Home', price: 16000, q: 'Windows 11 Home DSP版' },
    { id: 'none',  name: 'OSなし(手持ちのライセンスを使う)', price: 0, q: '' }
  ];

  /* ---------- ゲーム ----------
     g: GPUがRTX 5090相当(score=100)のときのGPU側の上限fps(1080/1440/2160) / c: CPUがgs=100のときのCPU側の上限fps
     k: GPU性能がfpsに効く強さ(軽いゲームほど小さい) / mem: 快適に遊べるメモリ容量(GB)
     ※ これは実測ではなく、計算モデルによる「目安」です。 */
  D.games = [
    { id: 'valorant',  name: 'VALORANT',                       genre: 'eスポーツ', g: { 1080: 900, 1440: 800, 2160: 600 }, c: 700, k: 0.5,  mem: 8 },
    { id: 'cs2',       name: 'Counter-Strike 2',               genre: 'eスポーツ', g: { 1080: 800, 1440: 650, 2160: 420 }, c: 600, k: 0.55, mem: 16 },
    { id: 'apex',      name: 'Apex Legends',                   genre: 'FPS',       g: { 1080: 450, 1440: 360, 2160: 200 }, c: 380, k: 0.7,  mem: 16 },
    { id: 'fortnite',  name: 'Fortnite (DX12・高設定)',        genre: 'バトロワ',  g: { 1080: 480, 1440: 350, 2160: 190 }, c: 320, k: 0.75, mem: 16 },
    { id: 'palworld',  name: 'Palworld (パルワールド)',        genre: 'オープンワールド', g: { 1080: 260, 1440: 200, 2160: 115 }, c: 190, k: 0.8, mem: 16 },
    { id: 'ffxiv',     name: 'FF XIV (最高品質)',              genre: 'MMO',       g: { 1080: 420, 1440: 330, 2160: 190 }, c: 260, k: 0.7,  mem: 16 },
    { id: 'cyberpunk', name: 'Cyberpunk 2077 (RTなし・最高)',  genre: '重量級AAA', g: { 1080: 300, 1440: 235, 2160: 125 }, c: 220, k: 0.9,  mem: 16 },
    { id: 'mhwilds',   name: 'Monster Hunter Wilds (高設定)',  genre: '重量級AAA', g: { 1080: 150, 1440: 115, 2160: 62 },  c: 110, k: 0.9,  mem: 32 }
  ];

  /* ---------- 今使っているPC（アップグレード診断用）----------
     plat: 世代の区分 / path: 'cpu'=CPUだけ交換できる / 'board'=マザボ・メモリごと交換が必要 */
  D.oldCpu = [
    { id: 'o-i5-10400', name: 'Core i5-10400 (第10世代)',  gs: 38, mt: 30, pw: 130, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-r5-3600',  name: 'Ryzen 5 3600',              gs: 38, mt: 34, pw: 90,  plat: 'AM4 / DDR4',     path: 'am4' },
    { id: 'o-r5-5600',  name: 'Ryzen 5 5600',              gs: 48, mt: 42, pw: 90,  plat: 'AM4 / DDR4',     path: 'am4' },
    { id: 'o-r7-5700x3d',name:'Ryzen 7 5700X3D',           gs: 70, mt: 55, pw: 110, plat: 'AM4 / DDR4',     path: 'board' },
    { id: 'o-i5-12400', name: 'Core i5-12400F (第12世代)', gs: 52, mt: 45, pw: 120, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i5-13400', name: 'Core i5-13400F (第13世代)', gs: 56, mt: 55, pw: 150, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i7-13700', name: 'Core i7-13700K (第13世代)', gs: 72, mt: 85, pw: 250, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i7-14700', name: 'Core i7-14700K (第14世代)', gs: 76, mt: 95, pw: 253, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-r5-7600',  name: 'Ryzen 5 7600',              gs: 62, mt: 45, pw: 90,  plat: 'AM5 / DDR5',     path: 'cpu' },
    { id: 'o-r7-7800x3d',name:'Ryzen 7 7800X3D',           gs: 92, mt: 55, pw: 120, plat: 'AM5 / DDR5',     path: 'cpu' }
  ];
  D.oldGpu = [
    { id: 'g-1060',   name: 'GeForce GTX 1060',        score: 8,  tgp: 120, vram: 6 },
    { id: 'g-1660s',  name: 'GeForce GTX 1660 SUPER',  score: 11, tgp: 125, vram: 6 },
    { id: 'g-rx6600', name: 'Radeon RX 6600',          score: 18, tgp: 132, vram: 8 },
    { id: 'g-3060',   name: 'GeForce RTX 3060',        score: 20, tgp: 170, vram: 12 },
    { id: 'g-4060',   name: 'GeForce RTX 4060',        score: 24, tgp: 115, vram: 8 },
    { id: 'g-3070',   name: 'GeForce RTX 3070',        score: 28, tgp: 220, vram: 8 },
    { id: 'g-4060ti', name: 'GeForce RTX 4060 Ti',     score: 30, tgp: 160, vram: 8 },
    { id: 'g-4070',   name: 'GeForce RTX 4070',        score: 41, tgp: 200, vram: 12 },
    { id: 'g-4070s',  name: 'GeForce RTX 4070 SUPER',  score: 47, tgp: 220, vram: 12 },
    { id: 'g-rx7800xt',name:'Radeon RX 7800 XT',       score: 45, tgp: 263, vram: 16 },
    { id: 'g-4080s',  name: 'GeForce RTX 4080 SUPER',  score: 62, tgp: 320, vram: 16 },
    { id: 'g-4090',   name: 'GeForce RTX 4090',        score: 80, tgp: 450, vram: 24 }
  ];

  /* ---------- 用語集（ホバーで出る説明） ---------- */
  D.glossary = [
    ['CPU', 'パソコンの「頭脳」。計算や命令の処理をする部品です。ゲームでは敵の動きや物理計算を担当します。'],
    ['GPU', '画面に映す絵を作る専用の部品（グラフィックボードの中身）。ゲームの映像の美しさやfpsを大きく左右します。'],
    ['グラフィックボード', 'GPUが載った拡張カード。ゲームをするなら一番お金をかけたいパーツです。'],
    ['VRAM', 'GPUが使う専用のメモリ。足りないと高画質の設定でカクつきます。フルHDなら8GB〜、WQHD/4Kなら12〜16GBが安心です。'],
    ['メモリ', '作業机の広さにあたる部品。広いほど、たくさんのアプリを同時に動かせます。今は32GBが標準的です。'],
    ['DDR5', '現在のメモリの規格。今の世代のCPU（Ryzen 9000・Core Ultra 200S）はDDR5専用で、古いDDR4は挿せません。'],
    ['SSD', 'データをしまう記憶装置。HDDよりずっと速く、Windowsの起動やゲームのロードが短くなります。'],
    ['NVMe', '小さな基板型で、とても速いSSDの接続方式。M.2スロットに差します。'],
    ['M.2', 'ガム型の小さなSSDを差すスロット（差し込み口）の形。'],
    ['PCIe', 'GPUやSSDをつなぐ高速道路のような規格。Gen4・Gen5と数字が大きいほど速いですが、ゲームでの体感差は小さめです。'],
    ['Gen5', 'PCIeの第5世代。SSDでは速度が約2倍ですが、発熱が大きく、ゲームのロードではGen4と大差ないことが多いです。'],
    ['マザーボード', 'すべての部品をつなぐ大きな基板。CPUの種類（ソケット）とサイズが合うものを選びます。'],
    ['チップセット', 'マザーボードの機能のグレードを決める部品。B850やZ890などの名前で、新しいほど・数字や文字が上位ほど多機能です。'],
    ['ソケット', 'CPUを差し込む場所の形。AMDの今はAM5、Intelの今はLGA1851。違う形のCPUは付けられません。'],
    ['電源ユニット', 'コンセントの電気をパソコン用に変えて、各パーツへ配る部品。容量(W)が足りないと落ちたり壊れたりします。'],
    ['80PLUS', '電源の変換効率の認証。Bronze・Gold・Platinumの順に効率が良く、ムダな熱が少なくなります。'],
    ['ATX 3.1', '新しい電源の規格。最新のGPUが使う12V-2x6コネクタに標準で対応します。'],
    ['12V-2x6', '最新の高性能GPUが使う1本の太い電源コネクタ。奥まで確実に差し込まないと危険です。'],
    ['ボトルネック', '「足を引っ張る部品」のこと。強いGPUに弱いCPUを組み合わせると、CPUのせいでGPUの力を出し切れません。'],
    ['fps', '1秒間に画面を何回書き換えるか。60fpsなら1秒に60枚。数字が大きいほど滑らかです。'],
    ['リフレッシュレート', 'モニターが1秒間に画面を書き換える回数(Hz)。144Hzのモニターで144fpsを出すと一番滑らかです。'],
    ['フルHD', '1920×1080の画面サイズ。1080pとも言います。いちばん軽く、ゲームで高fpsを出しやすい。'],
    ['WQHD', '2560×1440の画面サイズ。1440pとも。フルHDより細かく、4Kより軽いバランス型です。'],
    ['4K', '3840×2160の画面サイズ。とてもきれいですが、GPUにとって一番重い設定です。'],
    ['DLSS', 'NVIDIAのGPUで使える、画質をなるべく保ちつつfpsを上げる技術。'],
    ['FSR', 'AMDが出している、fpsを上げる技術。AMDのGPUだけでなくNVIDIAでも使えるゲームが多いです。'],
    ['レイトレーシング', '光の反射や影を本物のように計算する技術。きれいですがとても重く、fpsが大きく下がります。'],
    ['TDP', 'CPUが出す熱の目安(W)。クーラー選びの目安になりますが、実際の消費電力はそれより大きくなることもあります。'],
    ['TGP', 'グラフィックボード全体の消費電力の目安(W)。電源容量を選ぶときに使います。'],
    ['簡易水冷', '液体で冷やすCPUクーラー。ラジエーターで熱を逃がします。大型CPUに向きますが、空冷より高価です。'],
    ['空冷', '金属のヒートシンクとファンで冷やすクーラー。簡単で壊れにくく、普通のCPUなら十分です。'],
    ['BIOS', 'パソコンの電源を入れて最初に動く基本ソフト。新しいCPUを使うために更新が必要なことがあります。'],
    ['Core Ultra', 'Intelの今のCPUブランド。数字の5・7・9が大きいほど高性能（i5・i7・i9にあたる）。語尾のKはオーバークロック可能、Fは内蔵グラフィックスなし。'],
    ['X3D', 'AMDのゲーム向けCPU。「3D V-Cache」という大容量キャッシュでゲームのfpsが特に伸びます。'],
    ['3D V-Cache', 'CPUの上に追加で積んだ大容量の高速メモリ。ゲームで特に効果があります。'],
    ['Mini-ITX', '一番小さなマザーボードの規格。小型ケースに入りますが、価格が高めで拡張性は低めです。'],
    ['ミドルタワー', '標準的な大きさのパソコンケース。部品が入れやすく、初心者におすすめです。'],
    ['BTO', 'Build To Order(受注生産)の略。ショップで部品を選んで注文すると、組み立てて送ってくれるパソコンです。'],
    ['即納', '注文してすぐ（最短で当日〜数日）に出荷されるモデル。カスタマイズはできないことが多いです。'],
    ['NVENC', 'NVIDIA GPUの映像エンコード専用の機能。配信や録画をしても、ゲームの重さがあまり増えません。'],
    ['オーバークロック', 'CPUなどを定格より速く動かすこと。性能は上がりますが、発熱が増え、初心者にはおすすめしません。'],
    ['ドライバ', 'パーツを動かすための小さなソフト。特にGPUは新しいゲームに合わせた更新で性能が上がることがあります。']
  ];

  /* 用語リストを長い順に並べる（自動ホバー用） */
  D.glossary.sort(function (a, b) { return b[0].length - a[0].length; });

  /* ---------- 読みもの ---------- */
  D.articles = [
    { id: 'bto-or-diy', title: 'BTOと自作、どっちがいい？', lead: 'はじめてなら迷いどころ。向き不向きをまとめました。', html:
      '<h3>BTOが向いている人</h3><ul><li>とにかく失敗したくない・時間をかけたくない</li><li>保証やサポートがほしい（初期不良や故障のとき相談できる）</li><li>パーツの相性を自分で調べるのが不安</li></ul>' +
      '<h3>自作が向いている人</h3><ul><li>見た目や静音性など、細かいこだわりがある</li><li>パーツを少しずつ買い替えて長く使いたい</li><li>組み立て自体を楽しみたい</li></ul>' +
      '<h3>お金の違い</h3><p>最近は自作が必ず安いわけではありません。セール時期のBTOは、同じ部品を自分で買うより安いこともあります。<b>自作の強みは、安さより「選べること」</b>です。</p>' +
      '<h3>迷ったら</h3><p>初めての1台は<b>BTO</b>、2台目から<b>自作</b>、という人も多いです。このサイトの「BTOモード」と「自作モード」で、同じ構成の金額を見比べてみましょう。</p>' },
    { id: 'assembly', title: '自作PC 組み立ての手順（初心者向け）', lead: 'ケースを開けてからWindowsが起動するまでの流れです。', html:
      '<p>用意するもの：プラスドライバー(#2)、結束バンド、ハサミ、広い机。静電気を逃がすため、作業前に金属（ドアノブなど）に触れましょう。</p>' +
      '<ol>' +
      '<li><b>マザーボードにCPUをつける</b>：ソケットのレバーを上げ、CPUの▲印とソケットの▲印を合わせて<b>そっと置くだけ</b>。押し込まないこと。</li>' +
      '<li><b>メモリを差す</b>：向きの切り欠きを合わせ、「カチッ」と両側のツメが閉まるまで押す。2枚なら、取扱説明書で指定された位置（多くはA2とB2）に。</li>' +
      '<li><b>M.2 SSDをつける</b>：スロットに斜めに差し込み、ネジで固定。ヒートシンクのカバーのはがし忘れに注意。</li>' +
      '<li><b>CPUクーラーをつける</b>：グリスが塗られているか確認し、対角線の順にネジを少しずつ締める。ファンのケーブルを「CPU_FAN」に。</li>' +
      '<li><b>ケースにマザーボードを固定</b>：先にI/Oパネル（背面の板）をはめ、ケース側のスペーサー位置に合わせてネジ止め。</li>' +
      '<li><b>電源ユニットを取り付け</b>：ケースの下部が多い。ケーブルは必要なものだけ接続。</li>' +
      '<li><b>グラフィックボードを差す</b>：PCIeスロットの一番上（長いスロット）に差し、ケース背面のネジで固定。電源ケーブルは<b>奥まで確実に</b>。</li>' +
      '<li><b>配線をつなぐ</b>：マザーボードの24pin、CPU用の電源(8pin)、ケースのスイッチ線、USB、ファンの順に、説明書を見ながら。</li>' +
      '<li><b>最初の起動</b>：モニターを<b>グラフィックボードの端子</b>につなぎ、電源ON。BIOS画面が出れば成功。</li>' +
      '<li><b>Windowsのインストール</b>：USBメモリでインストールし、チップセットとGPUのドライバを入れる。</li>' +
      '</ol>' +
      '<p>どこかで不安になったら、<a href="#/guide/no-boot">起動しないとき</a>の確認リストを見てください。</p>' },
    { id: 'mistakes', title: 'よくある失敗10選', lead: '先輩たちがやってしまった失敗です。', html:
      '<ol>' +
      '<li><b>CPUとマザーボードのソケットが違う</b>（AM5とLGA1851は互換性なし）</li>' +
      '<li><b>メモリの規格違い</b>（今の世代はDDR5。DDR4は挿せません）</li>' +
      '<li><b>電源容量がギリギリ</b>（GPUの推奨電源を必ず確認）</li>' +
      '<li><b>グラフィックボードがケースに入らない</b>（長さ・厚みを確認）</li>' +
      '<li><b>CPUクーラーの高さがケースに収まらない</b></li>' +
      '<li><b>モニターをマザーボード側につなぐ</b>（映らない原因No.1。GPU側の端子へ）</li>' +
      '<li><b>電源ケーブルの差し込みが浅い</b>（特に12V-2x6は奥まで）</li>' +
      '<li><b>OSを買い忘れた</b></li>' +
      '<li><b>モニターが60Hzのまま</b>（高fpsのパソコンを買っても、144Hzモニターが無いと体感できません）</li>' +
      '<li><b>Wi-Fiが付いていない</b>（有線LANが使えない部屋だと困ります）</li>' +
      '</ol>' },
    { id: 'no-boot', title: '起動しないときの確認リスト', lead: '慌てずに、上から順に試しましょう。', html:
      '<ol>' +
      '<li>電源ユニットのスイッチがON（|側）か、コンセントが刺さっているか</li>' +
      '<li>マザーボードの<b>24pin</b>と<b>CPU用8pin</b>が奥まで刺さっているか</li>' +
      '<li>モニターのケーブルが<b>グラフィックボード側</b>に刺さっているか</li>' +
      '<li>メモリが「カチッ」と奥まで入っているか（1枚だけにして試す）</li>' +
      '<li>グラフィックボードの補助電源が差さっているか</li>' +
      '<li>ケースのスイッチ線（POWER SW）が正しい位置か</li>' +
      '<li>ファンが回るかどうか、マザーボードのエラー表示（LEDや数字）を確認</li>' +
      '<li>最小構成（CPU・メモリ1枚・電源だけ）で起動できるか試す</li>' +
      '</ol>' +
      '<p>これでもだめな場合は、マザーボードの説明書のエラーコードを見て、メーカーサポートに相談しましょう。BTOなら購入先のサポートへ。</p>' },
    { id: 'checklist', title: 'BTO購入チェックリスト', lead: 'ポチる前の最終確認に使ってください。', html:
      '<ul class="checklist">' +
      '<li>CPU・GPUの型番が、希望の構成と同じか</li>' +
      '<li>メモリは<b>32GB</b>以上か（配信・動画編集なら特に）</li>' +
      '<li>SSDは<b>NVMe</b>で、容量は1TB以上か</li>' +
      '<li>電源の容量は、このサイトの「推奨」以上か</li>' +
      '<li>OS（Windows）は付いているか</li>' +
      '<li>Wi-Fi・Bluetoothは付いているか（必要なら）</li>' +
      '<li>保証期間と、延長保証の有無・料金</li>' +
      '<li>初期不良のときの対応（返品・交換の期限）</li>' +
      '<li>納期（即納モデルか、受注生産か）</li>' +
      '<li>キーボード・マウス・モニターは別売りか</li>' +
      '<li>支払い方法・ポイント・クーポンが使えるか</li>' +
      '</ul>' },
    { id: 'timing', title: '買い時の目安', lead: '「いつ買うと得か」のざっくりした考え方です。', html:
      '<h3>セールが多い時期（例年）</h3><ul><li>1月：初売り・福袋</li><li>2〜3月：新生活セール</li><li>7月：Amazonプライムデー（時期は年により変わります）</li><li>11月：ブラックフライデー</li><li>年末：決算セール</li></ul>' +
      '<h3>新製品の前後</h3><p>新しいCPUやGPUが発売されると、<b>ひとつ前の世代が値下がり</b>することがあります。一方、発売直後は品薄で高くなりがち。ニュースをチェックしましょう。</p>' +
      '<h3>パーツ価格の注意</h3><p>2026年はメモリなどの価格が高い状況が報じられています。値動きが大きいため、<b>必要になったタイミングで、複数のお店を見比べる</b>のが安全です。</p>' +
      '<p class="muted">※ 時期は目安です。最新のセール情報は各社の公式ページで確認してください。</p>' },
    { id: 'usage', title: '用途別ガイド（ゲーム・配信・動画編集・事務）', lead: '何をしたいかで、かける場所が変わります。', html:
      '<h3>ゲーム中心</h3><p>お金をかける順番は <b>GPU ＞ CPU ＞ メモリ(32GB)</b>。フルHDで144fpsなら中位GPU、WQHDや4Kならハイエンドが目安です。</p>' +
      '<h3>ゲーム配信</h3><p>ゲームと配信ソフトを同時に動かすので、<b>CPUのコア数とメモリ(32GB以上)</b>に余裕を。GPUはNVENCなどのエンコーダー付きだと負担が軽くなります。</p>' +
      '<h3>動画編集</h3><p>CPUのコア数が多いほど書き出しが速くなります。メモリは32GB、4Kなら64GBが安心。SSDは速く、容量は2TB以上がおすすめです。</p>' +
      '<h3>事務・学習・ネット</h3><p>高性能なGPUは不要です。<b>CPU内蔵グラフィックスで十分</b>。メモリ16〜32GBと、NVMe SSDがあれば快適です。</p>' }
  ];

  /* ---------- BTOメーカー情報（公式ページで必ず最終確認してください） ---------- */
  D.makers = [
    { key: 'dospara',  brand: 'GALLERIA', note: 'ゲーミングPC専門のブランド。在庫モデルをすぐ届ける「即納」に力を入れているのが特徴です。', check: ['即納モデルの在庫と出荷日', '標準保証と延長保証の内容', 'カスタマイズできるパーツの範囲'] },
    { key: 'pckoubou', brand: 'LEVEL∞', note: 'ゲーミングPCのブランド。全国に店舗があり、セールが多いのが特徴です。', check: ['店頭での受け取り・相談ができるか', '現在のセール・クーポン', '保証期間と延長保証'] },
    { key: 'tsukumo',  brand: 'G-GEAR', note: '秋葉原の老舗ショップのブランド。メモリやSSDの容量が大きめの構成が多いと言われます。', check: ['納期の目安', '標準でついてくるパーツの内容', '保証とサポート窓口の時間'] }
  ];

  /* ---------- ID引き辞書 ---------- */
  D.by = {};
  ['cpu', 'gpu', 'mb', 'mem', 'ssd', 'psu', 'case', 'cooler', 'os', 'games', 'oldCpu', 'oldGpu'].forEach(function (k) {
    D.by[k] = {};
    D[k].forEach(function (x) { D.by[k][x.id] = x; });
  });

  /* ---------- 価格の上書き（js/prices.js。tools/update-prices.mjs で作成） ---------- */
  D.priceDate = null;
  if (window.PCR_PRICES) {
    D.priceDate = window.PCR_PRICES.__date || null;
    Object.keys(window.PCR_PRICES).forEach(function (k) {
      if (k === '__date' || !D.by[k]) return;
      Object.keys(window.PCR_PRICES[k]).forEach(function (id) {
        if (D.by[k][id] && typeof window.PCR_PRICES[k][id] === 'number') D.by[k][id].price = window.PCR_PRICES[k][id];
      });
    });
  }

  return D;
})();
