/* ============================================================
   PC Recipe パーツデータ
   - 仕様（ソケット・消費電力・規格など）は公式情報をもとにした値
   - gs / mt / score は「相対的な性能の目安」（公式の数値ではありません）
   - price は data.js では初期値。実際の表示価格は js/prices.js（tools/parts-prices.csv から作成）で上書きされます
   - 確認日: config.js の dataDate
   パーツを足したいときは、各配列に1行足すだけで画面に反映されます。
   ============================================================ */
window.PCR_DATA = (function () {
  const D = {};

  /* ---------- CPU ----------
     sock: ソケット / tdp: 公称TDP / pw: 最大時の消費電力の目安(W)
     gs: ゲーム性能の目安(Ryzen 7 9800X3D = 100) / mt: 動画編集など多コア性能の目安(最大=100)
     fam: 世代の区分 / igpu:false = 内蔵グラフィックスなし / bios:true = 新しいBIOSが必要な場合あり / unstable: 13・14世代の不安定問題の対象
   plus: Core Ultra 200S Plus（2026年3月発売） */
  D.cpu = [
    { id: 'r5-9500f', name: 'Ryzen 5 9500F', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 63, mt: 43, price: 24000, q: 'Ryzen 5 9500F', fam: '9000', igpu: false },
    { id: 'r5-9600', name: 'Ryzen 5 9600', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 66, mt: 44, price: 29000, q: 'Ryzen 5 9600', fam: '9000' },
    { id: 'r5-9600x', name: 'Ryzen 5 9600X', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 90, gs: 68, mt: 45, price: 35000, q: 'Ryzen 5 9600X', fam: '9000' },
    { id: 'r7-9700x', name: 'Ryzen 7 9700X', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 65, pw: 90, gs: 74, mt: 55, price: 48000, q: 'Ryzen 7 9700X', fam: '9000' },
    { id: 'r7-9800x3d', name: 'Ryzen 7 9800X3D', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 120, pw: 125, gs: 100, mt: 56, price: 68000, q: 'Ryzen 7 9800X3D', fam: '9000', x3d: true },
    { id: 'r7-9850x3d', name: 'Ryzen 7 9850X3D', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 120, pw: 130, gs: 105, mt: 58, price: 78000, q: 'Ryzen 7 9850X3D', fam: '9000', x3d: true },
    { id: 'r9-9900x', name: 'Ryzen 9 9900X', b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 120, pw: 165, gs: 72, mt: 75, price: 58000, q: 'Ryzen 9 9900X', fam: '9000' },
    { id: 'r9-9900x3d', name: 'Ryzen 9 9900X3D', b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 120, pw: 165, gs: 95, mt: 78, price: 79000, q: 'Ryzen 9 9900X3D', fam: '9000', x3d: true },
    { id: 'r9-9950x', name: 'Ryzen 9 9950X', b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 170, pw: 205, gs: 75, mt: 100, price: 85000, q: 'Ryzen 9 9950X', fam: '9000' },
    { id: 'r9-9950x3d', name: 'Ryzen 9 9950X3D', b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 170, pw: 205, gs: 97, mt: 100, price: 98000, q: 'Ryzen 9 9950X3D', fam: '9000', x3d: true },
    { id: 'r9-9950x3d2', name: 'Ryzen 9 9950X3D2 Dual Edition', b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 200, pw: 245, gs: 98, mt: 100, price: 120000, q: 'Ryzen 9 9950X3D2 Dual Edition', fam: '9000', x3d: true },
    { id: 'r5-7500f', name: 'Ryzen 5 7500F', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 56, mt: 40, price: 22000, q: 'Ryzen 5 7500F', fam: '7000', igpu: false },
    { id: 'r5-7600', name: 'Ryzen 5 7600', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 60, mt: 42, price: 28000, q: 'Ryzen 5 7600', fam: '7000' },
    { id: 'r5-7600x', name: 'Ryzen 5 7600X', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 105, pw: 142, gs: 64, mt: 46, price: 31000, q: 'Ryzen 5 7600X', fam: '7000' },
    { id: 'r7-7700', name: 'Ryzen 7 7700', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 65, pw: 88, gs: 66, mt: 52, price: 38000, q: 'Ryzen 7 7700', fam: '7000' },
    { id: 'r7-7700x', name: 'Ryzen 7 7700X', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 105, pw: 142, gs: 68, mt: 54, price: 42000, q: 'Ryzen 7 7700X', fam: '7000' },
    { id: 'r7-7800x3d', name: 'Ryzen 7 7800X3D', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 120, pw: 130, gs: 92, mt: 55, price: 52000, q: 'Ryzen 7 7800X3D', fam: '7000', x3d: true },
    { id: 'r9-7900', name: 'Ryzen 9 7900', b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 65, pw: 88, gs: 66, mt: 70, price: 52000, q: 'Ryzen 9 7900', fam: '7000' },
    { id: 'r9-7900x', name: 'Ryzen 9 7900X', b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 170, pw: 230, gs: 70, mt: 76, price: 55000, q: 'Ryzen 9 7900X', fam: '7000' },
    { id: 'r9-7900x3d', name: 'Ryzen 9 7900X3D', b: 'AMD', sock: 'AM5', core: '12コア/24スレッド', tdp: 120, pw: 162, gs: 88, mt: 74, price: 65000, q: 'Ryzen 9 7900X3D', fam: '7000', x3d: true },
    { id: 'r9-7950x', name: 'Ryzen 9 7950X', b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 170, pw: 230, gs: 72, mt: 92, price: 70000, q: 'Ryzen 9 7950X', fam: '7000' },
    { id: 'r9-7950x3d', name: 'Ryzen 9 7950X3D', b: 'AMD', sock: 'AM5', core: '16コア/32スレッド', tdp: 120, pw: 162, gs: 90, mt: 92, price: 80000, q: 'Ryzen 9 7950X3D', fam: '7000', x3d: true },
    { id: 'cu5-225', name: 'Core Ultra 5 225', b: 'Intel', sock: 'LGA1851', core: '10コア(6P+4E)', tdp: 65, pw: 121, gs: 60, mt: 42, price: 28000, q: 'Core Ultra 5 225', fam: 'U200' },
    { id: 'cu5-245', name: 'Core Ultra 5 245', b: 'Intel', sock: 'LGA1851', core: '14コア(6P+8E)', tdp: 65, pw: 121, gs: 66, mt: 60, price: 40000, q: 'Core Ultra 5 245', fam: 'U200' },
    { id: 'cu5-245k', name: 'Core Ultra 5 245K', b: 'Intel', sock: 'LGA1851', core: '14コア(6P+8E)', tdp: 125, pw: 160, gs: 68, mt: 62, price: 45000, q: 'Core Ultra 5 245K', fam: 'U200', oc: true },
    { id: 'cu5-250kp', name: 'Core Ultra 5 250K Plus', b: 'Intel', sock: 'LGA1851', core: '18コア(6P+12E)', tdp: 125, pw: 160, gs: 74, mt: 80, price: 38000, q: 'Core Ultra 5 250K Plus', fam: 'U200P', oc: true, plus: true },
    { id: 'cu7-265', name: 'Core Ultra 7 265', b: 'Intel', sock: 'LGA1851', core: '20コア(8P+12E)', tdp: 65, pw: 182, gs: 74, mt: 80, price: 55000, q: 'Core Ultra 7 265', fam: 'U200' },
    { id: 'cu7-265k', name: 'Core Ultra 7 265K', b: 'Intel', sock: 'LGA1851', core: '20コア(8P+12E)', tdp: 125, pw: 250, gs: 76, mt: 82, price: 62000, q: 'Core Ultra 7 265K', fam: 'U200', oc: true },
    { id: 'cu7-270kp', name: 'Core Ultra 7 270K Plus', b: 'Intel', sock: 'LGA1851', core: '24コア(8P+16E)', tdp: 125, pw: 250, gs: 82, mt: 95, price: 47000, q: 'Core Ultra 7 270K Plus', fam: 'U200P', oc: true, plus: true },
    { id: 'cu9-285', name: 'Core Ultra 9 285', b: 'Intel', sock: 'LGA1851', core: '24コア(8P+16E)', tdp: 65, pw: 182, gs: 78, mt: 98, price: 82000, q: 'Core Ultra 9 285', fam: 'U200' },
    { id: 'cu9-285k', name: 'Core Ultra 9 285K', b: 'Intel', sock: 'LGA1851', core: '24コア(8P+16E)', tdp: 125, pw: 250, gs: 80, mt: 100, price: 90000, q: 'Core Ultra 9 285K', fam: 'U200', oc: true },
    { id: 'i3-12100f', name: 'Core i3-12100F', b: 'Intel', sock: 'LGA1700', core: '4コア/8スレッド', tdp: 58, pw: 89, gs: 42, mt: 20, price: 11000, q: 'Core i3-12100F', fam: '12', igpu: false },
    { id: 'i5-12400f', name: 'Core i5-12400F', b: 'Intel', sock: 'LGA1700', core: '6コア/12スレッド', tdp: 65, pw: 117, gs: 52, mt: 38, price: 16000, q: 'Core i5-12400F', fam: '12', igpu: false },
    { id: 'i5-12600k', name: 'Core i5-12600K', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 125, pw: 150, gs: 60, mt: 55, price: 27000, q: 'Core i5-12600K', fam: '12', oc: true },
    { id: 'i5-13400f', name: 'Core i5-13400F', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 65, pw: 148, gs: 56, mt: 52, price: 24000, q: 'Core i5-13400F', fam: '13', igpu: false },
    { id: 'i5-13600k', name: 'Core i5-13600K', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 125, pw: 181, gs: 72, mt: 76, price: 38000, q: 'Core i5-13600K', fam: '13', oc: true },
    { id: 'i5-14400f', name: 'Core i5-14400F', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 65, pw: 148, gs: 58, mt: 52, price: 25000, q: 'Core i5-14400F', fam: '14', igpu: false },
    { id: 'i5-14600k', name: 'Core i5-14600K', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 125, pw: 181, gs: 74, mt: 78, price: 40000, q: 'Core i5-14600K', fam: '14', oc: true },
    { id: 'i7-13700k', name: 'Core i7-13700K', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 125, pw: 253, gs: 72, mt: 85, price: 48000, q: 'Core i7-13700K', fam: '13', oc: true, unstable: true },
    { id: 'i7-14700f', name: 'Core i7-14700F', b: 'Intel', sock: 'LGA1700', core: '20コア(8P+12E)', tdp: 65, pw: 219, gs: 74, mt: 90, price: 48000, q: 'Core i7-14700F', fam: '14', igpu: false, unstable: true },
    { id: 'i7-14700k', name: 'Core i7-14700K', b: 'Intel', sock: 'LGA1700', core: '20コア(8P+12E)', tdp: 125, pw: 253, gs: 76, mt: 95, price: 55000, q: 'Core i7-14700K', fam: '14', oc: true, unstable: true },
    { id: 'i9-13900k', name: 'Core i9-13900K', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 125, pw: 253, gs: 78, mt: 98, price: 70000, q: 'Core i9-13900K', fam: '13', oc: true, unstable: true },
    { id: 'i9-14900k', name: 'Core i9-14900K', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 125, pw: 253, gs: 80, mt: 100, price: 82000, q: 'Core i9-14900K', fam: '14', oc: true, unstable: true },
    { id: 'r5-5500', name: 'Ryzen 5 5500', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 44, mt: 32, price: 12000, q: 'Ryzen 5 5500', fam: '5000', igpu: false },
    { id: 'r5-5600', name: 'Ryzen 5 5600', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 48, mt: 38, price: 15000, q: 'Ryzen 5 5600', fam: '5000', igpu: false },
    { id: 'r5-5600x', name: 'Ryzen 5 5600X', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 50, mt: 40, price: 18000, q: 'Ryzen 5 5600X', fam: '5000', igpu: false },
    { id: 'r5-5600gt', name: 'Ryzen 5 5600GT', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 47, mt: 36, price: 17000, q: 'Ryzen 5 5600GT', fam: '5000', bios: true },
    { id: 'r7-5700x', name: 'Ryzen 7 5700X', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 65, pw: 88, gs: 52, mt: 46, price: 23000, q: 'Ryzen 7 5700X', fam: '5000', igpu: false },
    { id: 'r7-5700x3d', name: 'Ryzen 7 5700X3D', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 105, pw: 142, gs: 70, mt: 48, price: 33000, q: 'Ryzen 7 5700X3D', fam: '5000', igpu: false, x3d: true, bios: true },
    { id: 'r7-5800x', name: 'Ryzen 7 5800X', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 105, pw: 142, gs: 54, mt: 50, price: 27000, q: 'Ryzen 7 5800X', fam: '5000', igpu: false },
    { id: 'r7-5800xt', name: 'Ryzen 7 5800XT', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 105, pw: 142, gs: 56, mt: 52, price: 30000, q: 'Ryzen 7 5800XT', fam: '5000', igpu: false, bios: true },
    { id: 'r7-5800x3d', name: 'Ryzen 7 5800X3D', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 105, pw: 142, gs: 72, mt: 50, price: 38000, q: 'Ryzen 7 5800X3D', fam: '5000', igpu: false, x3d: true },
    { id: 'r9-5900x', name: 'Ryzen 9 5900X', b: 'AMD', sock: 'AM4', core: '12コア/24スレッド', tdp: 105, pw: 142, gs: 54, mt: 62, price: 40000, q: 'Ryzen 9 5900X', fam: '5000', igpu: false },
    { id: 'r9-5900xt', name: 'Ryzen 9 5900XT', b: 'AMD', sock: 'AM4', core: '16コア/32スレッド', tdp: 105, pw: 142, gs: 56, mt: 76, price: 42000, q: 'Ryzen 9 5900XT', fam: '5000', igpu: false, bios: true },
    { id: 'r9-5950x', name: 'Ryzen 9 5950X', b: 'AMD', sock: 'AM4', core: '16コア/32スレッド', tdp: 105, pw: 142, gs: 56, mt: 78, price: 55000, q: 'Ryzen 9 5950X', fam: '5000', igpu: false },
    { id: 'i5-12400', name: 'Core i5-12400', b: 'Intel', sock: 'LGA1700', core: '6コア/12スレッド', tdp: 65, pw: 117, gs: 52, mt: 38, price: 19000, q: 'Core i5-12400', fam: '12' },
    { id: 'i5-12500', name: 'Core i5-12500', b: 'Intel', sock: 'LGA1700', core: '6コア/12スレッド', tdp: 65, pw: 117, gs: 54, mt: 38, price: 22000, q: 'Core i5-12500', fam: '12' },
    { id: 'i5-12600', name: 'Core i5-12600', b: 'Intel', sock: 'LGA1700', core: '6コア/12スレッド', tdp: 65, pw: 117, gs: 56, mt: 40, price: 26000, q: 'Core i5-12600', fam: '12' },
    { id: 'i5-12600kf', name: 'Core i5-12600KF', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 125, pw: 150, gs: 60, mt: 55, price: 25000, q: 'Core i5-12600KF', fam: '12', igpu: false, oc: true },
    { id: 'i7-12700', name: 'Core i7-12700', b: 'Intel', sock: 'LGA1700', core: '12コア(8P+4E)', tdp: 65, pw: 180, gs: 62, mt: 68, price: 40000, q: 'Core i7-12700', fam: '12' },
    { id: 'i7-12700f', name: 'Core i7-12700F', b: 'Intel', sock: 'LGA1700', core: '12コア(8P+4E)', tdp: 65, pw: 180, gs: 62, mt: 68, price: 36000, q: 'Core i7-12700F', fam: '12', igpu: false },
    { id: 'i7-12700k', name: 'Core i7-12700K', b: 'Intel', sock: 'LGA1700', core: '12コア(8P+4E)', tdp: 125, pw: 190, gs: 66, mt: 70, price: 42000, q: 'Core i7-12700K', fam: '12', oc: true },
    { id: 'i7-12700kf', name: 'Core i7-12700KF', b: 'Intel', sock: 'LGA1700', core: '12コア(8P+4E)', tdp: 125, pw: 190, gs: 66, mt: 70, price: 39000, q: 'Core i7-12700KF', fam: '12', igpu: false, oc: true },
    { id: 'i9-12900', name: 'Core i9-12900', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 65, pw: 202, gs: 66, mt: 80, price: 52000, q: 'Core i9-12900', fam: '12' },
    { id: 'i9-12900f', name: 'Core i9-12900F', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 65, pw: 202, gs: 66, mt: 80, price: 48000, q: 'Core i9-12900F', fam: '12', igpu: false },
    { id: 'i9-12900k', name: 'Core i9-12900K', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 125, pw: 241, gs: 70, mt: 85, price: 60000, q: 'Core i9-12900K', fam: '12', oc: true },
    { id: 'i9-12900kf', name: 'Core i9-12900KF', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 125, pw: 241, gs: 70, mt: 85, price: 56000, q: 'Core i9-12900KF', fam: '12', igpu: false, oc: true },
    { id: 'i9-12900ks', name: 'Core i9-12900KS', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 150, pw: 241, gs: 72, mt: 86, price: 72000, q: 'Core i9-12900KS', fam: '12', oc: true },
    { id: 'i3-13100', name: 'Core i3-13100', b: 'Intel', sock: 'LGA1700', core: '4コア/8スレッド', tdp: 60, pw: 89, gs: 46, mt: 22, price: 16000, q: 'Core i3-13100', fam: '13' },
    { id: 'i3-13100f', name: 'Core i3-13100F', b: 'Intel', sock: 'LGA1700', core: '4コア/8スレッド', tdp: 58, pw: 89, gs: 46, mt: 22, price: 14000, q: 'Core i3-13100F', fam: '13', igpu: false },
    { id: 'i5-13400', name: 'Core i5-13400', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 65, pw: 148, gs: 56, mt: 52, price: 28000, q: 'Core i5-13400', fam: '13' },
    { id: 'i5-13500', name: 'Core i5-13500', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 65, pw: 154, gs: 62, mt: 68, price: 36000, q: 'Core i5-13500', fam: '13' },
    { id: 'i5-13600kf', name: 'Core i5-13600KF', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 125, pw: 181, gs: 72, mt: 76, price: 36000, q: 'Core i5-13600KF', fam: '13', igpu: false, oc: true },
    { id: 'i7-13700', name: 'Core i7-13700', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 65, pw: 219, gs: 70, mt: 85, price: 50000, q: 'Core i7-13700', fam: '13', unstable: true },
    { id: 'i7-13700f', name: 'Core i7-13700F', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 65, pw: 219, gs: 70, mt: 85, price: 46000, q: 'Core i7-13700F', fam: '13', igpu: false, unstable: true },
    { id: 'i7-13700kf', name: 'Core i7-13700KF', b: 'Intel', sock: 'LGA1700', core: '16コア(8P+8E)', tdp: 125, pw: 253, gs: 72, mt: 85, price: 46000, q: 'Core i7-13700KF', fam: '13', igpu: false, oc: true, unstable: true },
    { id: 'i9-13900', name: 'Core i9-13900', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 65, pw: 219, gs: 74, mt: 95, price: 68000, q: 'Core i9-13900', fam: '13', unstable: true },
    { id: 'i9-13900f', name: 'Core i9-13900F', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 65, pw: 219, gs: 74, mt: 95, price: 63000, q: 'Core i9-13900F', fam: '13', igpu: false, unstable: true },
    { id: 'i9-13900kf', name: 'Core i9-13900KF', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 125, pw: 253, gs: 78, mt: 98, price: 66000, q: 'Core i9-13900KF', fam: '13', igpu: false, oc: true, unstable: true },
    { id: 'i9-13900ks', name: 'Core i9-13900KS', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 150, pw: 253, gs: 80, mt: 98, price: 90000, q: 'Core i9-13900KS', fam: '13', oc: true, unstable: true },
    { id: 'i3-14100', name: 'Core i3-14100', b: 'Intel', sock: 'LGA1700', core: '4コア/8スレッド', tdp: 60, pw: 89, gs: 47, mt: 22, price: 17000, q: 'Core i3-14100', fam: '14' },
    { id: 'i3-14100f', name: 'Core i3-14100F', b: 'Intel', sock: 'LGA1700', core: '4コア/8スレッド', tdp: 58, pw: 89, gs: 47, mt: 22, price: 15000, q: 'Core i3-14100F', fam: '14', igpu: false },
    { id: 'i5-14400', name: 'Core i5-14400', b: 'Intel', sock: 'LGA1700', core: '10コア(6P+4E)', tdp: 65, pw: 148, gs: 58, mt: 52, price: 30000, q: 'Core i5-14400', fam: '14' },
    { id: 'i5-14500', name: 'Core i5-14500', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 65, pw: 154, gs: 64, mt: 70, price: 38000, q: 'Core i5-14500', fam: '14' },
    { id: 'i5-14600kf', name: 'Core i5-14600KF', b: 'Intel', sock: 'LGA1700', core: '14コア(6P+8E)', tdp: 125, pw: 181, gs: 74, mt: 78, price: 38000, q: 'Core i5-14600KF', fam: '14', igpu: false, oc: true },
    { id: 'i7-14700', name: 'Core i7-14700', b: 'Intel', sock: 'LGA1700', core: '20コア(8P+12E)', tdp: 65, pw: 219, gs: 74, mt: 90, price: 55000, q: 'Core i7-14700', fam: '14', unstable: true },
    { id: 'i7-14700kf', name: 'Core i7-14700KF', b: 'Intel', sock: 'LGA1700', core: '20コア(8P+12E)', tdp: 125, pw: 253, gs: 76, mt: 95, price: 52000, q: 'Core i7-14700KF', fam: '14', igpu: false, oc: true, unstable: true },
    { id: 'i9-14900', name: 'Core i9-14900', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 65, pw: 219, gs: 77, mt: 98, price: 73000, q: 'Core i9-14900', fam: '14', unstable: true },
    { id: 'i9-14900f', name: 'Core i9-14900F', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 65, pw: 219, gs: 77, mt: 98, price: 70000, q: 'Core i9-14900F', fam: '14', igpu: false, unstable: true },
    { id: 'i9-14900kf', name: 'Core i9-14900KF', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 125, pw: 253, gs: 80, mt: 100, price: 80000, q: 'Core i9-14900KF', fam: '14', igpu: false, oc: true, unstable: true },
    { id: 'i9-14900ks', name: 'Core i9-14900KS', b: 'Intel', sock: 'LGA1700', core: '24コア(8P+16E)', tdp: 150, pw: 253, gs: 82, mt: 100, price: 95000, q: 'Core i9-14900KS', fam: '14', oc: true, unstable: true },
    { id: 'cu5-225f', name: 'Core Ultra 5 225F', b: 'Intel', sock: 'LGA1851', core: '10コア(6P+4E)', tdp: 65, pw: 121, gs: 60, mt: 42, price: 26000, q: 'Core Ultra 5 225F', fam: 'U200', igpu: false },
    { id: 'cu5-235', name: 'Core Ultra 5 235', b: 'Intel', sock: 'LGA1851', core: '14コア(6P+8E)', tdp: 65, pw: 121, gs: 64, mt: 58, price: 36000, q: 'Core Ultra 5 235', fam: 'U200' },
    { id: 'cu5-245kf', name: 'Core Ultra 5 245KF', b: 'Intel', sock: 'LGA1851', core: '14コア(6P+8E)', tdp: 125, pw: 160, gs: 68, mt: 62, price: 42000, q: 'Core Ultra 5 245KF', fam: 'U200', igpu: false, oc: true },
    { id: 'cu7-265f', name: 'Core Ultra 7 265F', b: 'Intel', sock: 'LGA1851', core: '20コア(8P+12E)', tdp: 65, pw: 182, gs: 74, mt: 80, price: 52000, q: 'Core Ultra 7 265F', fam: 'U200', igpu: false },
    { id: 'cu7-265kf', name: 'Core Ultra 7 265KF', b: 'Intel', sock: 'LGA1851', core: '20コア(8P+12E)', tdp: 125, pw: 250, gs: 76, mt: 82, price: 58000, q: 'Core Ultra 7 265KF', fam: 'U200', igpu: false, oc: true },
    { id: 'r3-4100', name: 'Ryzen 3 4100', b: 'AMD', sock: 'AM4', core: '4コア/8スレッド', tdp: 65, pw: 88, gs: 38, mt: 20, price: 8000, q: 'Ryzen 3 4100', fam: '4000', igpu: false },
    { id: 'r5-4500', name: 'Ryzen 5 4500', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 42, mt: 30, price: 10000, q: 'Ryzen 5 4500', fam: '4000', igpu: false },
    { id: 'r5-4600g', name: 'Ryzen 5 4600G', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 44, mt: 33, price: 13000, q: 'Ryzen 5 4600G', fam: '4000' },
    { id: 'r5-5500gt', name: 'Ryzen 5 5500GT', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 46, mt: 34, price: 17000, q: 'Ryzen 5 5500GT', fam: '5000' },
    { id: 'r5-5600g', name: 'Ryzen 5 5600G', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 48, mt: 38, price: 20000, q: 'Ryzen 5 5600G', fam: '5000' },
    { id: 'r7-5700', name: 'Ryzen 7 5700', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 65, pw: 88, gs: 51, mt: 44, price: 21000, q: 'Ryzen 7 5700', fam: '5000', igpu: false },
    { id: 'r7-5700g', name: 'Ryzen 7 5700G', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 65, pw: 88, gs: 52, mt: 46, price: 28000, q: 'Ryzen 7 5700G', fam: '5000' },
    { id: 'r5-3600', name: 'Ryzen 5 3600', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 40, mt: 34, price: 14000, q: 'Ryzen 5 3600', fam: '3000', igpu: false, legacy: true },
    /* 旧世代CPU（第6〜11世代 / Ryzen 1000〜3000）。中古・在庫限りが中心なので、自動提案には出さず、自分で選ぶときだけ使えます */
    { id: 'i3-10100', name: 'Core i3-10100', b: 'Intel', sock: 'LGA1200', core: '4コア/8スレッド', tdp: 65, pw: 90, gs: 34, mt: 20, price: 11000, q: 'Core i3-10100', fam: '10', legacy: true },
    { id: 'i5-10400f', name: 'Core i5-10400F', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 65, pw: 130, gs: 38, mt: 30, price: 10000, q: 'Core i5-10400F', fam: '10', legacy: true, igpu: false },
    { id: 'i5-10400', name: 'Core i5-10400', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 65, pw: 130, gs: 38, mt: 30, price: 13000, q: 'Core i5-10400', fam: '10', legacy: true },
    { id: 'i5-10500', name: 'Core i5-10500', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 65, pw: 130, gs: 40, mt: 31, price: 14000, q: 'Core i5-10500', fam: '10', legacy: true },
    { id: 'i5-10600k', name: 'Core i5-10600K', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 125, pw: 182, gs: 44, mt: 36, price: 19000, q: 'Core i5-10600K', fam: '10', legacy: true, oc: true },
    { id: 'i7-10700', name: 'Core i7-10700', b: 'Intel', sock: 'LGA1200', core: '8コア/16スレッド', tdp: 65, pw: 224, gs: 44, mt: 45, price: 24000, q: 'Core i7-10700', fam: '10', legacy: true },
    { id: 'i7-10700k', name: 'Core i7-10700K', b: 'Intel', sock: 'LGA1200', core: '8コア/16スレッド', tdp: 125, pw: 229, gs: 48, mt: 48, price: 26000, q: 'Core i7-10700K', fam: '10', legacy: true, oc: true },
    { id: 'i9-10900k', name: 'Core i9-10900K', b: 'Intel', sock: 'LGA1200', core: '10コア/20スレッド', tdp: 125, pw: 250, gs: 52, mt: 58, price: 33000, q: 'Core i9-10900K', fam: '10', legacy: true, oc: true },
    { id: 'i5-11400', name: 'Core i5-11400', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 65, pw: 154, gs: 46, mt: 36, price: 15000, q: 'Core i5-11400', fam: '11', legacy: true },
    { id: 'i5-11600k', name: 'Core i5-11600K', b: 'Intel', sock: 'LGA1200', core: '6コア/12スレッド', tdp: 125, pw: 182, gs: 52, mt: 40, price: 19000, q: 'Core i5-11600K', fam: '11', legacy: true, oc: true },
    { id: 'i7-11700', name: 'Core i7-11700', b: 'Intel', sock: 'LGA1200', core: '8コア/16スレッド', tdp: 65, pw: 224, gs: 52, mt: 48, price: 27000, q: 'Core i7-11700', fam: '11', legacy: true },
    { id: 'i7-11700k', name: 'Core i7-11700K', b: 'Intel', sock: 'LGA1200', core: '8コア/16スレッド', tdp: 125, pw: 251, gs: 56, mt: 52, price: 29000, q: 'Core i7-11700K', fam: '11', legacy: true, oc: true },
    { id: 'i9-11900k', name: 'Core i9-11900K', b: 'Intel', sock: 'LGA1200', core: '8コア/16スレッド', tdp: 125, pw: 251, gs: 58, mt: 54, price: 36000, q: 'Core i9-11900K', fam: '11', legacy: true, oc: true },
    { id: 'i5-9400f', name: 'Core i5-9400F', b: 'Intel', sock: 'LGA1151', core: '6コア/6スレッド', tdp: 65, pw: 90, gs: 32, mt: 25, price: 8000, q: 'Core i5-9400F', fam: '9', legacy: true, igpu: false },
    { id: 'i7-9700k', name: 'Core i7-9700K', b: 'Intel', sock: 'LGA1151', core: '8コア/8スレッド', tdp: 95, pw: 160, gs: 38, mt: 32, price: 18000, q: 'Core i7-9700K', fam: '9', legacy: true, oc: true },
    { id: 'i9-9900k', name: 'Core i9-9900K', b: 'Intel', sock: 'LGA1151', core: '8コア/16スレッド', tdp: 95, pw: 210, gs: 42, mt: 42, price: 24000, q: 'Core i9-9900K', fam: '9', legacy: true, oc: true },
    { id: 'i5-8400', name: 'Core i5-8400', b: 'Intel', sock: 'LGA1151', core: '6コア/6スレッド', tdp: 65, pw: 65, gs: 30, mt: 24, price: 7000, q: 'Core i5-8400', fam: '8', legacy: true },
    { id: 'i7-8700k', name: 'Core i7-8700K', b: 'Intel', sock: 'LGA1151', core: '6コア/12スレッド', tdp: 95, pw: 150, gs: 36, mt: 32, price: 15000, q: 'Core i7-8700K', fam: '8', legacy: true, oc: true },
    { id: 'i5-6600k', name: 'Core i5-6600K', b: 'Intel', sock: 'LGA1151-v1', core: '4コア/4スレッド', tdp: 91, pw: 95, gs: 24, mt: 16, price: 6000, q: 'Core i5-6600K', fam: '6', legacy: true, oc: true, win11: false },
    { id: 'i7-6700k', name: 'Core i7-6700K', b: 'Intel', sock: 'LGA1151-v1', core: '4コア/8スレッド', tdp: 91, pw: 95, gs: 28, mt: 22, price: 10000, q: 'Core i7-6700K', fam: '6', legacy: true, oc: true, win11: false },
    { id: 'i7-7700k', name: 'Core i7-7700K', b: 'Intel', sock: 'LGA1151-v1', core: '4コア/8スレッド', tdp: 91, pw: 100, gs: 32, mt: 24, price: 12000, q: 'Core i7-7700K', fam: '7', legacy: true, oc: true, win11: false },
    { id: 'r5-1600', name: 'Ryzen 5 1600', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 90, gs: 26, mt: 28, price: 6000, q: 'Ryzen 5 1600', fam: '1000', legacy: true, igpu: false, win11: false },
    { id: 'r5-2600', name: 'Ryzen 5 2600', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 65, pw: 90, gs: 30, mt: 30, price: 7000, q: 'Ryzen 5 2600', fam: '2000', legacy: true, igpu: false },
    { id: 'r7-2700x', name: 'Ryzen 7 2700X', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 105, pw: 130, gs: 32, mt: 40, price: 10000, q: 'Ryzen 7 2700X', fam: '2000', legacy: true, igpu: false },
    { id: 'r3-3100', name: 'Ryzen 3 3100', b: 'AMD', sock: 'AM4', core: '4コア/8スレッド', tdp: 65, pw: 80, gs: 32, mt: 20, price: 7000, q: 'Ryzen 3 3100', fam: '3000', legacy: true, igpu: false },
    { id: 'r5-3400g', name: 'Ryzen 5 3400G', b: 'AMD', sock: 'AM4', core: '4コア/8スレッド', tdp: 65, pw: 90, gs: 28, mt: 22, price: 9000, q: 'Ryzen 5 3400G', fam: '3000', legacy: true },
    { id: 'r5-3600x', name: 'Ryzen 5 3600X', b: 'AMD', sock: 'AM4', core: '6コア/12スレッド', tdp: 95, pw: 110, gs: 40, mt: 36, price: 12000, q: 'Ryzen 5 3600X', fam: '3000', legacy: true, igpu: false },
    { id: 'r7-3700x', name: 'Ryzen 7 3700X', b: 'AMD', sock: 'AM4', core: '8コア/16スレッド', tdp: 65, pw: 100, gs: 42, mt: 46, price: 16000, q: 'Ryzen 7 3700X', fam: '3000', legacy: true, igpu: false },
    { id: 'r9-3900x', name: 'Ryzen 9 3900X', b: 'AMD', sock: 'AM4', core: '12コア/24スレッド', tdp: 105, pw: 150, gs: 44, mt: 62, price: 24000, q: 'Ryzen 9 3900X', fam: '3000', legacy: true, igpu: false },
    { id: 'r5-8400f', name: 'Ryzen 5 8400F', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 56, mt: 40, price: 21000, q: 'Ryzen 5 8400F', fam: '8000', igpu: false },
    { id: 'r5-8500g', name: 'Ryzen 5 8500G', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 56, mt: 36, price: 28000, q: 'Ryzen 5 8500G', fam: '8000' },
    { id: 'r5-8600g', name: 'Ryzen 5 8600G', b: 'AMD', sock: 'AM5', core: '6コア/12スレッド', tdp: 65, pw: 88, gs: 58, mt: 42, price: 33000, q: 'Ryzen 5 8600G', fam: '8000' },
    { id: 'r7-8700g', name: 'Ryzen 7 8700G', b: 'AMD', sock: 'AM5', core: '8コア/16スレッド', tdp: 65, pw: 88, gs: 62, mt: 54, price: 48000, q: 'Ryzen 7 8700G', fam: '8000' }
  ];

  /* ---------- GPU ----------
     tgp: 消費電力(W) / rec: メーカー推奨の電源容量(W) / len: 市販品のおおよその長さ(mm・製品で差あり)
     slots: 厚みの目安(スロット数) / conn: 電源コネクタ / score: 性能の目安(RTX 5090 = 100) */
  D.gpu = [
    { id: 'none', name: 'グラフィックボードなし(CPU内蔵)', b: '-', vram: 0, tgp: 0, rec: 0, len: 0, slots: 0, conn: '-', score: 3, price: 0, q: '' },
    { id: 'rx7600', name: 'Radeon RX 7600', b: 'AMD', vram: 8, tgp: 165, rec: 550, len: 240, slots: 2, conn: '8pin', score: 21, price: 38000, q: 'Radeon RX 7600', older: true, used: true },
    { id: 'arc-b570', name: 'Intel Arc B570', b: 'Intel', vram: 10, tgp: 150, rec: 450, len: 270, slots: 2, conn: '8pin', score: 23, price: 30000, q: 'Intel Arc B570' },
    { id: 'rtx4060', name: 'GeForce RTX 4060', b: 'NVIDIA', vram: 8, tgp: 115, rec: 550, len: 240, slots: 2, conn: '8pin', score: 24, price: 48000, q: 'GeForce RTX 4060', older: true, used: true },
    { id: 'rx7600xt', name: 'Radeon RX 7600 XT', b: 'AMD', vram: 16, tgp: 190, rec: 600, len: 280, slots: 2.5, conn: '8pin', score: 25, price: 52000, q: 'Radeon RX 7600 XT', older: true },
    { id: 'arc-b580', name: 'Intel Arc B580', b: 'Intel', vram: 12, tgp: 190, rec: 600, len: 270, slots: 2, conn: '8pin', score: 27, price: 38000, q: 'Intel Arc B580' },
    { id: 'rtx5050', name: 'GeForce RTX 5050', b: 'NVIDIA', vram: 8, tgp: 130, rec: 550, len: 240, slots: 2, conn: '8pin', score: 22, price: 40000, q: 'GeForce RTX 5050' },
    { id: 'rtx5060', name: 'GeForce RTX 5060', b: 'NVIDIA', vram: 8, tgp: 145, rec: 550, len: 250, slots: 2, conn: '8pin', score: 29, price: 55000, q: 'GeForce RTX 5060' },
    { id: 'rtx4060ti', name: 'GeForce RTX 4060 Ti 8GB', b: 'NVIDIA', vram: 8, tgp: 160, rec: 550, len: 250, slots: 2.5, conn: '8pin', score: 30, price: 62000, q: 'GeForce RTX 4060 Ti 8GB', older: true, used: true },
    { id: 'rtx4060ti16', name: 'GeForce RTX 4060 Ti 16GB', b: 'NVIDIA', vram: 16, tgp: 165, rec: 550, len: 260, slots: 2.5, conn: '8pin', score: 31, price: 78000, q: 'GeForce RTX 4060 Ti 16GB', older: true },
    { id: 'rx9060xt8', name: 'Radeon RX 9060 XT 8GB', b: 'AMD', vram: 8, tgp: 150, rec: 450, len: 280, slots: 2.5, conn: '8pin', score: 34, price: 52000, q: 'Radeon RX 9060 XT 8GB' },
    { id: 'rx9060xt', name: 'Radeon RX 9060 XT 16GB', b: 'AMD', vram: 16, tgp: 160, rec: 450, len: 280, slots: 2.5, conn: '8pin', score: 35, price: 68000, q: 'Radeon RX 9060 XT 16GB' },
    { id: 'rtx5060ti8', name: 'GeForce RTX 5060 Ti 8GB', b: 'NVIDIA', vram: 8, tgp: 180, rec: 600, len: 270, slots: 2.5, conn: '8pin', score: 35, price: 66000, q: 'GeForce RTX 5060 Ti 8GB' },
    { id: 'rtx5060ti', name: 'GeForce RTX 5060 Ti 16GB', b: 'NVIDIA', vram: 16, tgp: 180, rec: 600, len: 270, slots: 2.5, conn: '8pin', score: 36, price: 78000, q: 'GeForce RTX 5060 Ti 16GB' },
    { id: 'rx7700xt', name: 'Radeon RX 7700 XT', b: 'AMD', vram: 12, tgp: 245, rec: 700, len: 280, slots: 2.5, conn: '8pin×2', score: 38, price: 70000, q: 'Radeon RX 7700 XT', older: true, used: true },
    { id: 'rtx4070', name: 'GeForce RTX 4070', b: 'NVIDIA', vram: 12, tgp: 200, rec: 650, len: 270, slots: 2.5, conn: '8pin', score: 41, price: 88000, q: 'GeForce RTX 4070', older: true, used: true },
    { id: 'rx7800xt', name: 'Radeon RX 7800 XT', b: 'AMD', vram: 16, tgp: 263, rec: 700, len: 300, slots: 2.5, conn: '8pin×2', score: 45, price: 85000, q: 'Radeon RX 7800 XT', older: true, used: true },
    { id: 'rtx4070s', name: 'GeForce RTX 4070 SUPER', b: 'NVIDIA', vram: 12, tgp: 220, rec: 650, len: 280, slots: 2.5, conn: '8pin', score: 47, price: 100000, q: 'GeForce RTX 4070 SUPER', older: true, used: true },
    { id: 'rtx5070', name: 'GeForce RTX 5070', b: 'NVIDIA', vram: 12, tgp: 250, rec: 650, len: 300, slots: 2.5, conn: '12V-2x6', score: 48, price: 95000, q: 'GeForce RTX 5070' },
    { id: 'rx7900gre', name: 'Radeon RX 7900 GRE', b: 'AMD', vram: 16, tgp: 260, rec: 700, len: 290, slots: 2.5, conn: '8pin×2', score: 49, price: 95000, q: 'Radeon RX 7900 GRE', older: true },
    { id: 'rtx4070ti', name: 'GeForce RTX 4070 Ti', b: 'NVIDIA', vram: 12, tgp: 285, rec: 700, len: 300, slots: 3, conn: '12V-2x6', score: 51, price: 115000, q: 'GeForce RTX 4070 Ti', older: true, used: true },
    { id: 'rx7900xt', name: 'Radeon RX 7900 XT', b: 'AMD', vram: 20, tgp: 315, rec: 750, len: 320, slots: 3, conn: '8pin×2', score: 53, price: 125000, q: 'Radeon RX 7900 XT', older: true },
    { id: 'rtx4070tis', name: 'GeForce RTX 4070 Ti SUPER', b: 'NVIDIA', vram: 16, tgp: 285, rec: 700, len: 310, slots: 3, conn: '12V-2x6', score: 55, price: 130000, q: 'GeForce RTX 4070 Ti SUPER', older: true },
    { id: 'rx9070', name: 'Radeon RX 9070', b: 'AMD', vram: 16, tgp: 220, rec: 650, len: 310, slots: 3, conn: '8pin×2', score: 55, price: 105000, q: 'Radeon RX 9070' },
    { id: 'rtx4080', name: 'GeForce RTX 4080', b: 'NVIDIA', vram: 16, tgp: 320, rec: 750, len: 320, slots: 3.5, conn: '12V-2x6', score: 60, price: 180000, q: 'GeForce RTX 4080', older: true, used: true },
    { id: 'rx7900xtx', name: 'Radeon RX 7900 XTX', b: 'AMD', vram: 24, tgp: 355, rec: 800, len: 330, slots: 3.5, conn: '8pin×2', score: 60, price: 150000, q: 'Radeon RX 7900 XTX', older: true },
    { id: 'rtx4080s', name: 'GeForce RTX 4080 SUPER', b: 'NVIDIA', vram: 16, tgp: 320, rec: 750, len: 320, slots: 3.5, conn: '12V-2x6', score: 62, price: 175000, q: 'GeForce RTX 4080 SUPER', older: true },
    { id: 'rtx5070ti', name: 'GeForce RTX 5070 Ti', b: 'NVIDIA', vram: 16, tgp: 300, rec: 750, len: 320, slots: 3, conn: '12V-2x6', score: 62, price: 135000, q: 'GeForce RTX 5070 Ti' },
    { id: 'rx9070xt', name: 'Radeon RX 9070 XT', b: 'AMD', vram: 16, tgp: 304, rec: 750, len: 320, slots: 3, conn: '8pin×2', score: 63, price: 120000, q: 'Radeon RX 9070 XT' },
    { id: 'rtx5080', name: 'GeForce RTX 5080', b: 'NVIDIA', vram: 16, tgp: 360, rec: 850, len: 330, slots: 3, conn: '12V-2x6', score: 70, price: 190000, q: 'GeForce RTX 5080' },
    { id: 'rtx4090', name: 'GeForce RTX 4090', b: 'NVIDIA', vram: 24, tgp: 450, rec: 850, len: 340, slots: 3.5, conn: '12V-2x6', score: 80, price: 330000, q: 'GeForce RTX 4090', older: true },
    { id: 'rtx5090', name: 'GeForce RTX 5090', b: 'NVIDIA', vram: 32, tgp: 575, rec: 1000, len: 340, slots: 3.5, conn: '12V-2x6', score: 100, price: 450000, q: 'GeForce RTX 5090' },
    /* ---- 中古（新品はほぼ売られていない世代）。価格はドスパラの中古の販売価格の目安。性能・寸法は一般的な値の見積もり ---- */
    { id: 'gtx1650', name: 'GeForce GTX 1650', b: 'NVIDIA', vram: 4, tgp: 75, rec: 350, len: 180, slots: 2, conn: 'なし', score: 6, price: 11900, q: 'GeForce GTX 1650 中古', used: true },
    { id: 'gtx1070', name: 'GeForce GTX 1070', b: 'NVIDIA', vram: 8, tgp: 150, rec: 500, len: 240, slots: 2, conn: '8pin', score: 10, price: 14900, q: 'GeForce GTX 1070 中古', used: true },
    { id: 'gtx1660s', name: 'GeForce GTX 1660 SUPER', b: 'NVIDIA', vram: 6, tgp: 125, rec: 450, len: 220, slots: 2, conn: '8pin', score: 11, price: 15360, q: 'GeForce GTX 1660 SUPER 中古', used: true },
    { id: 'rtx2060', name: 'GeForce RTX 2060', b: 'NVIDIA', vram: 6, tgp: 160, rec: 500, len: 230, slots: 2, conn: '8pin', score: 14, price: 24900, q: 'GeForce RTX 2060 中古', used: true },
    { id: 'rtx2060s', name: 'GeForce RTX 2060 SUPER', b: 'NVIDIA', vram: 8, tgp: 175, rec: 550, len: 240, slots: 2, conn: '8pin', score: 16, price: 25900, q: 'GeForce RTX 2060 SUPER 中古', used: true },
    { id: 'rtx2070', name: 'GeForce RTX 2070', b: 'NVIDIA', vram: 8, tgp: 175, rec: 550, len: 250, slots: 2, conn: '8pin', score: 17, price: 28000, q: 'GeForce RTX 2070 中古', used: true },
    { id: 'rtx2070s', name: 'GeForce RTX 2070 SUPER', b: 'NVIDIA', vram: 8, tgp: 215, rec: 650, len: 260, slots: 2.5, conn: '8pin×2', score: 19, price: 31900, q: 'GeForce RTX 2070 SUPER 中古', used: true },
    { id: 'rtx2080s', name: 'GeForce RTX 2080 SUPER', b: 'NVIDIA', vram: 8, tgp: 250, rec: 650, len: 270, slots: 2.5, conn: '8pin×2', score: 23, price: 31900, q: 'GeForce RTX 2080 SUPER 中古', used: true },
    { id: 'rtx3050', name: 'GeForce RTX 3050 8GB', b: 'NVIDIA', vram: 8, tgp: 130, rec: 550, len: 220, slots: 2, conn: '8pin', score: 12, price: 28900, q: 'GeForce RTX 3050 8GB 中古', used: true },
    { id: 'rtx3060', name: 'GeForce RTX 3060 12GB', b: 'NVIDIA', vram: 12, tgp: 170, rec: 550, len: 240, slots: 2, conn: '8pin', score: 20, price: 47900, q: 'GeForce RTX 3060 12GB 中古', used: true },
    { id: 'rtx3060ti', name: 'GeForce RTX 3060 Ti', b: 'NVIDIA', vram: 8, tgp: 200, rec: 600, len: 240, slots: 2, conn: '8pin', score: 25, price: 36900, q: 'GeForce RTX 3060 Ti 中古', used: true },
    { id: 'rtx3070', name: 'GeForce RTX 3070', b: 'NVIDIA', vram: 8, tgp: 220, rec: 650, len: 270, slots: 2.5, conn: '8pin×2', score: 28, price: 39900, q: 'GeForce RTX 3070 中古', used: true },
    { id: 'rtx3070ti', name: 'GeForce RTX 3070 Ti', b: 'NVIDIA', vram: 8, tgp: 290, rec: 750, len: 290, slots: 2.5, conn: '8pin×2', score: 30, price: 50900, q: 'GeForce RTX 3070 Ti 中古', used: true },
    { id: 'rtx3080', name: 'GeForce RTX 3080 10GB', b: 'NVIDIA', vram: 10, tgp: 320, rec: 750, len: 300, slots: 2.5, conn: '8pin×2', score: 40, price: 56900, q: 'GeForce RTX 3080 中古', used: true },
    { id: 'rtx3080ti', name: 'GeForce RTX 3080 Ti', b: 'NVIDIA', vram: 12, tgp: 350, rec: 750, len: 310, slots: 3, conn: '8pin×2', score: 44, price: 81900, q: 'GeForce RTX 3080 Ti 中古', used: true },
    { id: 'rx6600', name: 'Radeon RX 6600', b: 'AMD', vram: 8, tgp: 132, rec: 450, len: 240, slots: 2, conn: '8pin', score: 18, price: 29900, q: 'Radeon RX 6600 中古', used: true },
    { id: 'rx6600xt', name: 'Radeon RX 6600 XT', b: 'AMD', vram: 8, tgp: 160, rec: 500, len: 240, slots: 2, conn: '8pin', score: 21, price: 31900, q: 'Radeon RX 6600 XT 中古', used: true },
    { id: 'rx6650xt', name: 'Radeon RX 6650 XT', b: 'AMD', vram: 8, tgp: 180, rec: 500, len: 250, slots: 2, conn: '8pin', score: 22, price: 32900, q: 'Radeon RX 6650 XT 中古', used: true },
    { id: 'rx6700xt', name: 'Radeon RX 6700 XT', b: 'AMD', vram: 12, tgp: 230, rec: 650, len: 270, slots: 2.5, conn: '8pin×2', score: 24, price: 43901, q: 'Radeon RX 6700 XT 中古', used: true }
  ];

  /* ---------- マザーボード（チップセット別の代表クラス） ----------
     form: ATX / mATX / ITX / m2g: 搭載されるM.2の最大世代の目安 / wifi: yes no varies */
  D.mb = [
    { id: 'am4-b450-i', name: 'AM4 B450 Mini-ITX', sock: 'AM4', chip: 'B450', form: 'ITX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: true, price: 14000, q: 'B450 Mini-ITX マザーボード AM4' },
    { id: 'in-b560-i', name: 'LGA1200 B560 Mini-ITX', sock: 'LGA1200', chip: 'B560', form: 'ITX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 17000, q: 'B560 Mini-ITX マザーボード LGA1200' },
    { id: 'in-b365-i', name: 'LGA1151 B365 Mini-ITX', sock: 'LGA1151', chip: 'B365', form: 'ITX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 12000, q: 'B365 Mini-ITX マザーボード LGA1151' },
    { id: 'in-b250-i', name: 'LGA1151(第6・7世代用) B250 Mini-ITX', sock: 'LGA1151-v1', chip: 'B250', form: 'ITX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 10000, q: 'B250 Mini-ITX マザーボード LGA1151' },
    { id: 'am4-b450-m', name: 'AM4 B450 Micro-ATX', sock: 'AM4', chip: 'B450', form: 'mATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: true, price: 8000, q: 'B450 Micro-ATX マザーボード AM4' },
    { id: 'am4-b450-a', name: 'AM4 B450 ATX', sock: 'AM4', chip: 'B450', form: 'ATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: true, price: 10000, q: 'B450 ATX マザーボード AM4' },
    { id: 'in-h510-m', name: 'LGA1200 H510 Micro-ATX', sock: 'LGA1200', chip: 'H510', form: 'mATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 9000, q: 'H510 Micro-ATX マザーボード LGA1200', memOc: false },
    { id: 'in-b560-m', name: 'LGA1200 B560 Micro-ATX', sock: 'LGA1200', chip: 'B560', form: 'mATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 11000, q: 'B560 Micro-ATX マザーボード LGA1200' },
    { id: 'in-b560-a', name: 'LGA1200 B560 ATX', sock: 'LGA1200', chip: 'B560', form: 'ATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 13000, q: 'B560 ATX マザーボード LGA1200' },
    { id: 'in-z590-a', name: 'LGA1200 Z590 ATX', sock: 'LGA1200', chip: 'Z590', form: 'ATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: true, price: 18000, q: 'Z590 ATX マザーボード LGA1200' },
    { id: 'in-b365-m', name: 'LGA1151 B365 Micro-ATX', sock: 'LGA1151', chip: 'B365', form: 'mATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 7000, q: 'B365 Micro-ATX マザーボード LGA1151' },
    { id: 'in-z390-a', name: 'LGA1151 Z390 ATX', sock: 'LGA1151', chip: 'Z390', form: 'ATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: true, price: 12000, q: 'Z390 ATX マザーボード LGA1151' },
    { id: 'in-b250-m', name: 'LGA1151(第6・7世代用) B250 Micro-ATX', sock: 'LGA1151-v1', chip: 'B250', form: 'mATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 6000, q: 'B250 Micro-ATX マザーボード LGA1151' },
    { id: 'in-z270-a', name: 'LGA1151(第6・7世代用) Z270 ATX', sock: 'LGA1151-v1', chip: 'Z270', form: 'ATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: true, price: 9000, q: 'Z270 ATX マザーボード LGA1151' },
    { id: 'am5-a620-m', name: 'AM5 A620 Micro-ATX', sock: 'AM5', chip: 'A620', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, price: 12000, q: 'A620 Micro-ATX マザーボード AM5', weakVrm: true },
    { id: 'am5-a620-a', name: 'AM5 A620 ATX', sock: 'AM5', chip: 'A620', form: 'ATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, price: 13500, q: 'A620 ATX マザーボード AM5', weakVrm: true },
    { id: 'am5-b650-m', name: 'AM5 B650 Micro-ATX', sock: 'AM5', chip: 'B650', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: true, price: 17000, q: 'B650 Micro-ATX マザーボード AM5' },
    { id: 'am5-b650-a', name: 'AM5 B650 ATX', sock: 'AM5', chip: 'B650', form: 'ATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: true, price: 20000, q: 'B650 ATX マザーボード AM5' },
    { id: 'am5-b850-m', name: 'AM5 B850 Micro-ATX', sock: 'AM5', chip: 'B850', form: 'mATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: true, price: 22000, q: 'B850 Micro-ATX マザーボード AM5' },
    { id: 'am5-b850-a', name: 'AM5 B850 ATX', sock: 'AM5', chip: 'B850', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: true, price: 26000, q: 'B850 ATX マザーボード AM5' },
    { id: 'am5-b850-i', name: 'AM5 B850 Mini-ITX', sock: 'AM5', chip: 'B850', form: 'ITX', mem: 'DDR5', m2g: 5, wifi: 'yes', oc: true, price: 38000, q: 'B850 Mini-ITX マザーボード AM5' },
    { id: 'am5-x870-a', name: 'AM5 X870 ATX', sock: 'AM5', chip: 'X870', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: true, price: 36000, q: 'X870 ATX マザーボード AM5' },
    { id: 'am5-x870e-a', name: 'AM5 X870E ATX', sock: 'AM5', chip: 'X870E', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'yes', oc: true, price: 48000, q: 'X870E ATX マザーボード AM5' },
    { id: 'in-h810-m', name: 'LGA1851 H810 Micro-ATX', sock: 'LGA1851', chip: 'H810', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, price: 15000, q: 'H810 Micro-ATX マザーボード LGA1851', memOc: false },
    { id: 'in-b860-m', name: 'LGA1851 B860 Micro-ATX', sock: 'LGA1851', chip: 'B860', form: 'mATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: false, price: 21000, q: 'B860 Micro-ATX マザーボード LGA1851' },
    { id: 'in-b860-a', name: 'LGA1851 B860 ATX', sock: 'LGA1851', chip: 'B860', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'varies', oc: false, price: 26000, q: 'B860 ATX マザーボード LGA1851' },
    { id: 'in-b860-i', name: 'LGA1851 B860 Mini-ITX', sock: 'LGA1851', chip: 'B860', form: 'ITX', mem: 'DDR5', m2g: 5, wifi: 'yes', oc: false, price: 36000, q: 'B860 Mini-ITX マザーボード LGA1851' },
    { id: 'in-z890-a', name: 'LGA1851 Z890 ATX', sock: 'LGA1851', chip: 'Z890', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'yes', oc: true, price: 40000, q: 'Z890 ATX マザーボード LGA1851' },
    { id: 'in-h610-m-d4', name: 'LGA1700 H610 Micro-ATX (DDR4)', sock: 'LGA1700', chip: 'H610', form: 'mATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 9500, q: 'H610 Micro-ATX マザーボード LGA1700', memOc: false },
    { id: 'in-b760-m-d4', name: 'LGA1700 B760 Micro-ATX (DDR4)', sock: 'LGA1700', chip: 'B760', form: 'mATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 15000, q: 'B760 Micro-ATX マザーボード LGA1700' },
    { id: 'in-b760-a-d4', name: 'LGA1700 B760 ATX (DDR4)', sock: 'LGA1700', chip: 'B760', form: 'ATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: false, price: 18000, q: 'B760 ATX マザーボード LGA1700' },
    { id: 'in-b760-i-d4', name: 'LGA1700 B760 Mini-ITX (DDR4)', sock: 'LGA1700', chip: 'B760', form: 'ITX', mem: 'DDR4', m2g: 4, wifi: 'yes', oc: false, price: 27000, q: 'B760 Mini-ITX マザーボード LGA1700' },
    { id: 'in-b760-m-d5', name: 'LGA1700 B760 Micro-ATX (DDR5)', sock: 'LGA1700', chip: 'B760', form: 'mATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, price: 17000, q: 'B760 Micro-ATX マザーボード LGA1700' },
    { id: 'in-b760-a-d5', name: 'LGA1700 B760 ATX (DDR5)', sock: 'LGA1700', chip: 'B760', form: 'ATX', mem: 'DDR5', m2g: 4, wifi: 'varies', oc: false, price: 22000, q: 'B760 ATX マザーボード LGA1700' },
    { id: 'in-b760-i-d5', name: 'LGA1700 B760 Mini-ITX (DDR5)', sock: 'LGA1700', chip: 'B760', form: 'ITX', mem: 'DDR5', m2g: 4, wifi: 'yes', oc: false, price: 30000, q: 'B760 Mini-ITX マザーボード LGA1700' },
    { id: 'in-z790-a-d4', name: 'LGA1700 Z790 ATX (DDR4)', sock: 'LGA1700', chip: 'Z790', form: 'ATX', mem: 'DDR4', m2g: 5, wifi: 'varies', oc: true, price: 32000, q: 'Z790 ATX マザーボード LGA1700' },
    { id: 'in-z790-a-d5', name: 'LGA1700 Z790 ATX (DDR5)', sock: 'LGA1700', chip: 'Z790', form: 'ATX', mem: 'DDR5', m2g: 5, wifi: 'yes', oc: true, price: 38000, q: 'Z790 ATX マザーボード LGA1700' },
    { id: 'am4-a520-m', name: 'AM4 A520 Micro-ATX', sock: 'AM4', chip: 'A520', form: 'mATX', mem: 'DDR4', m2g: 3, wifi: 'varies', oc: false, price: 7500, q: 'A520 Micro-ATX マザーボード AM4', weakVrm: true },
    { id: 'am4-b550-m', name: 'AM4 B550 Micro-ATX', sock: 'AM4', chip: 'B550', form: 'mATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: true, price: 11000, q: 'B550 Micro-ATX マザーボード AM4' },
    { id: 'am4-b550-a', name: 'AM4 B550 ATX', sock: 'AM4', chip: 'B550', form: 'ATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: true, price: 14000, q: 'B550 ATX マザーボード AM4' },
    { id: 'am4-b550-i', name: 'AM4 B550 Mini-ITX', sock: 'AM4', chip: 'B550', form: 'ITX', mem: 'DDR4', m2g: 4, wifi: 'yes', oc: true, price: 22000, q: 'B550 Mini-ITX マザーボード AM4' },
    { id: 'am4-x570-a', name: 'AM4 X570 ATX', sock: 'AM4', chip: 'X570', form: 'ATX', mem: 'DDR4', m2g: 4, wifi: 'varies', oc: true, price: 24000, q: 'X570 ATX マザーボード AM4' }
  ];

  /* ---------- メモリ（AM5・LGA1851 は DDR5 のみ / AM4 は DDR4 のみ / LGA1700 はボードにより DDR4 か DDR5） ---------- */
  D.mem = [
    { id: 'd4-16', name: 'DDR4-3200 16GB(8GB×2)', cap: 16, type: 'DDR4', price: 14000, q: 'DDR4 16GB 8GBx2 デスクトップ用メモリ' },
    { id: 'd4-32', name: 'DDR4-3200 32GB(16GB×2)', cap: 32, type: 'DDR4', price: 28000, q: 'DDR4 32GB 16GBx2 デスクトップ用メモリ' },
    { id: 'd4-64', name: 'DDR4-3200 64GB(32GB×2)', cap: 64, type: 'DDR4', price: 58000, q: 'DDR4 64GB 32GBx2 デスクトップ用メモリ' },
    { id: 'd5-16', name: 'DDR5-5600 16GB(8GB×2)', cap: 16, type: 'DDR5', price: 20000, q: 'DDR5 16GB 8GBx2 デスクトップ用メモリ' },
    { id: 'd5-32', name: 'DDR5-5600 32GB(16GB×2)', cap: 32, type: 'DDR5', price: 38000, q: 'DDR5 32GB 16GBx2 デスクトップ用メモリ' },
    { id: 'd5-32f', name: 'DDR5-6000 32GB(16GB×2)', cap: 32, type: 'DDR5', price: 41000, q: 'DDR5-6000 32GB 16GBx2 デスクトップ用メモリ' },
    { id: 'd5-48', name: 'DDR5-5600 48GB(24GB×2)', cap: 48, type: 'DDR5', price: 58000, q: 'DDR5 48GB 24GBx2 デスクトップ用メモリ' },
    { id: 'd5-64', name: 'DDR5-6000 64GB(32GB×2)', cap: 64, type: 'DDR5', price: 80000, q: 'DDR5-6000 64GB 32GBx2 デスクトップ用メモリ' }
  ];

  /* ---------- ストレージ ---------- */
  D.ssd = [
    { id: 'sata-500', name: 'SATA SSD 500GB', cap: 0.5, gen: 0, type: 'SATA', price: 5500, q: 'SATA SSD 500GB 2.5インチ' },
    { id: 'sata-1', name: 'SATA SSD 1TB', cap: 1, gen: 0, type: 'SATA', price: 9000, q: 'SATA SSD 1TB 2.5インチ' },
    { id: 'sata-2', name: 'SATA SSD 2TB', cap: 2, gen: 0, type: 'SATA', price: 17000, q: 'SATA SSD 2TB 2.5インチ' },
    { id: 'g3-1', name: 'NVMe Gen3 SSD 1TB', cap: 1, gen: 3, type: 'NVMe', price: 9500, q: 'NVMe M.2 SSD 1TB Gen3' },
    { id: 'g3-2', name: 'NVMe Gen3 SSD 2TB', cap: 2, gen: 3, type: 'NVMe', price: 18000, q: 'NVMe M.2 SSD 2TB Gen3' },
    { id: 'g4-500', name: 'NVMe Gen4 SSD 500GB', cap: 0.5, gen: 4, type: 'NVMe', price: 7000, q: 'NVMe M.2 SSD 500GB Gen4' },
    { id: 'g4-1', name: 'NVMe Gen4 SSD 1TB', cap: 1, gen: 4, type: 'NVMe', price: 11000, q: 'NVMe M.2 SSD 1TB Gen4' },
    { id: 'g4-2', name: 'NVMe Gen4 SSD 2TB', cap: 2, gen: 4, type: 'NVMe', price: 20000, q: 'NVMe M.2 SSD 2TB Gen4' },
    { id: 'g4-4', name: 'NVMe Gen4 SSD 4TB', cap: 4, gen: 4, type: 'NVMe', price: 46000, q: 'NVMe M.2 SSD 4TB Gen4' },
    { id: 'g5-1', name: 'NVMe Gen5 SSD 1TB', cap: 1, gen: 5, type: 'NVMe', price: 18000, q: 'NVMe M.2 SSD 1TB Gen5' },
    { id: 'g5-2', name: 'NVMe Gen5 SSD 2TB', cap: 2, gen: 5, type: 'NVMe', price: 33000, q: 'NVMe M.2 SSD 2TB Gen5' },
    { id: 'g5-4', name: 'NVMe Gen5 SSD 4TB', cap: 4, gen: 5, type: 'NVMe', price: 70000, q: 'NVMe M.2 SSD 4TB Gen5' }
  ];

  /* ---------- 電源 ---------- */
  D.psu = [
    { id: 'p550', name: '550W 80PLUS Bronze (ATX)', w: 550, form: 'ATX', grade: 'Bronze', atx3: false, price: 6500, q: '電源ユニット 550W 80PLUS Bronze ATX' },
    { id: 'p650b', name: '650W 80PLUS Bronze (ATX)', w: 650, form: 'ATX', grade: 'Bronze', atx3: false, price: 7500, q: '電源ユニット 650W 80PLUS Bronze ATX' },
    { id: 'p650', name: '650W 80PLUS Gold (ATX 3.x)', w: 650, form: 'ATX', grade: 'Gold', atx3: true, price: 9500, q: '電源ユニット 650W 80PLUS Gold ATX3.1' },
    { id: 'p750g2', name: '750W 80PLUS Gold (ATX 2.x・12V-2x6なし)', w: 750, form: 'ATX', grade: 'Gold', atx3: false, price: 11000, q: '電源ユニット 750W 80PLUS Gold ATX' },
    { id: 'p750', name: '750W 80PLUS Gold (ATX 3.x)', w: 750, form: 'ATX', grade: 'Gold', atx3: true, price: 12000, q: '電源ユニット 750W 80PLUS Gold ATX3.1' },
    { id: 'p850', name: '850W 80PLUS Gold (ATX 3.x)', w: 850, form: 'ATX', grade: 'Gold', atx3: true, price: 15000, q: '電源ユニット 850W 80PLUS Gold ATX3.1' },
    { id: 'p850p', name: '850W 80PLUS Platinum (ATX 3.x)', w: 850, form: 'ATX', grade: 'Platinum', atx3: true, price: 21000, q: '電源ユニット 850W 80PLUS Platinum ATX3.1' },
    { id: 'p1000', name: '1000W 80PLUS Gold (ATX 3.x)', w: 1000, form: 'ATX', grade: 'Gold', atx3: true, price: 22000, q: '電源ユニット 1000W 80PLUS Gold ATX3.1' },
    { id: 'p1000p', name: '1000W 80PLUS Platinum (ATX 3.x)', w: 1000, form: 'ATX', grade: 'Platinum', atx3: true, price: 28000, q: '電源ユニット 1000W 80PLUS Platinum ATX3.1' },
    { id: 'p1200', name: '1200W 80PLUS Platinum (ATX 3.x)', w: 1200, form: 'ATX', grade: 'Platinum', atx3: true, price: 32000, q: '電源ユニット 1200W 80PLUS Platinum ATX3.1' },
    { id: 'p1300', name: '1300W 80PLUS Platinum (ATX 3.x)', w: 1300, form: 'ATX', grade: 'Platinum', atx3: true, price: 38000, q: '電源ユニット 1300W 80PLUS Platinum ATX3.1' },
    { id: 'p1600', name: '1600W 80PLUS Titanium (ATX 3.x)', w: 1600, form: 'ATX', grade: 'Titanium', atx3: true, price: 62000, q: '電源ユニット 1600W 80PLUS Titanium ATX3.1' },
    { id: 'sfx650', name: '650W 80PLUS Gold (SFX・小型ケース用)', w: 650, form: 'SFX', grade: 'Gold', atx3: true, price: 17000, q: '電源ユニット SFX 650W 80PLUS Gold ATX3.1' },
    { id: 'sfx750', name: '750W 80PLUS Gold (SFX・小型ケース用)', w: 750, form: 'SFX', grade: 'Gold', atx3: true, price: 20000, q: '電源ユニット SFX 750W 80PLUS Gold ATX3.1' },
    { id: 'sfx850', name: '850W 80PLUS Gold (SFX・小型ケース用)', w: 850, form: 'SFX', grade: 'Gold', atx3: true, price: 24000, q: '電源ユニット SFX 850W 80PLUS Gold ATX3.1' },
    { id: 'sfx1000', name: '1000W 80PLUS Platinum (SFX・小型ケース用)', w: 1000, form: 'SFX', grade: 'Platinum', atx3: true, price: 32000, q: '電源ユニット SFX 1000W 80PLUS Platinum ATX3.1' }
  ];

  /* ---------- ケース（代表クラス。実際の製品は寸法を必ず確認） ----------
     gpuMax: 入るGPUの長さ(mm) / coolerMax: 入る空冷クーラーの高さ(mm) / rad: 入る水冷ラジエーター(mm) */
  D.case = [
    { id: 'c-budget', name: 'ミドルタワー(低価格)', size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 330, coolerMax: 150, rad: [240], psu: ['ATX'], gpuSlots: 3.5, price: 5500, q: 'PCケース ミドルタワー 低価格 ATX' },
    { id: 'c-mid-s', name: 'ミドルタワー(小さめ)', size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 340, coolerMax: 160, rad: [240, 280], psu: ['ATX'], gpuSlots: 3.5, price: 8500, q: 'PCケース ミニタワー ATX 小型' },
    { id: 'c-mid', name: 'ミドルタワー(標準)', size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 380, coolerMax: 160, rad: [240, 280, 360], psu: ['ATX'], gpuSlots: 4, price: 10000, q: 'PCケース ミドルタワー ATX' },
    { id: 'c-air', name: 'ミドルタワー(エアフロー重視)', size: 'ミドル', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 400, coolerMax: 170, rad: [240, 280, 360], psu: ['ATX'], gpuSlots: 4, price: 11000, q: 'PCケース エアフロー メッシュ ミドルタワー' },
    { id: 'c-quiet', name: 'ミドルタワー(静音重視)', size: 'ミドル', noise: '静音', form: ['ATX', 'mATX', 'ITX'], gpuMax: 370, coolerMax: 165, rad: [240, 280, 360], psu: ['ATX'], gpuSlots: 4, price: 14000, q: 'PCケース 静音 ミドルタワー' },
    { id: 'c-matx', name: 'コンパクト(Micro-ATX)', size: 'ミニ', noise: '標準', form: ['mATX', 'ITX'], gpuMax: 330, coolerMax: 155, rad: [240, 280], psu: ['ATX'], gpuSlots: 3, price: 8500, q: 'PCケース Micro-ATX コンパクト' },
    { id: 'c-matx-air', name: 'Micro-ATX(メッシュ・冷却重視)', size: 'ミニ', noise: '標準', form: ['mATX', 'ITX'], gpuMax: 350, coolerMax: 160, rad: [240, 280], psu: ['ATX'], gpuSlots: 3.5, price: 10500, q: 'PCケース Micro-ATX メッシュ エアフロー' },
    { id: 'c-matx-sfx', name: 'Micro-ATX 小型(SFX電源)', size: 'ミニ', noise: '標準', form: ['mATX', 'ITX'], gpuMax: 320, coolerMax: 150, rad: [240], psu: ['SFX'], gpuSlots: 3, price: 13000, q: 'PCケース Micro-ATX 小型 SFX電源対応' },
    { id: 'c-itx-l', name: 'Mini-ITX 中型(大きめGPU可)', size: 'ミニ', noise: '標準', form: ['ITX'], gpuMax: 330, coolerMax: 155, rad: [120, 240, 280], psu: ['SFX'], gpuSlots: 3, price: 16000, q: 'PCケース Mini-ITX 中型 SFX電源対応 簡易水冷' },
    { id: 'c-itx', name: 'Mini-ITX 小型', size: 'ミニ', noise: '標準', form: ['ITX'], gpuMax: 310, coolerMax: 70, rad: [], psu: ['SFX'], gpuSlots: 2.5, price: 15000, q: 'PCケース Mini-ITX 小型 SFX電源対応' },
    { id: 'c-full', name: 'フルタワー(大型)', size: '大型', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 450, coolerMax: 185, rad: [240, 280, 360, 420], psu: ['ATX'], gpuSlots: 5, price: 22000, q: 'PCケース フルタワー 大型' },
    { id: 'c-full-dual', name: 'デュアルチャンバー(大型・ガラス)', size: '大型', noise: '標準', form: ['ATX', 'mATX', 'ITX'], gpuMax: 420, coolerMax: 170, rad: [240, 280, 360], psu: ['ATX'], gpuSlots: 4.5, price: 19000, q: 'PCケース デュアルチャンバー 大型 ガラス' }
  ];

  /* ---------- CPUクーラー ---------- */
  D.cooler = [
    { id: 'k-low', name: '低背 空冷クーラー(〜47mm)', kind: '空冷', h: 47, rad: 0, tdpMax: 95, noise: 'やや大きい', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 3500, q: 'CPUクーラー 低背 ロープロファイル AM5 LGA1700' },
    { id: 'k-air-m', name: '空冷 スリムタワー(〜120mm)', kind: '空冷', h: 120, rad: 0, tdpMax: 120, noise: '標準', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 3000, q: 'CPUクーラー 空冷 シングルタワー 120mm薄型' },
    { id: 'k-air-s', name: '空冷 120mmタワー', kind: '空冷', h: 155, rad: 0, tdpMax: 150, noise: '標準', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 4500, q: 'CPUクーラー 空冷 120mm サイドフロー' },
    { id: 'k-air-l', name: '空冷 大型デュアルタワー', kind: '空冷', h: 165, rad: 0, tdpMax: 260, noise: '静か', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 7500, q: 'CPUクーラー 空冷 デュアルタワー 大型' },
    { id: 'k-aio120', name: '簡易水冷 120mm', kind: '水冷', h: 0, rad: 120, tdpMax: 150, noise: '標準', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 9000, q: '簡易水冷 CPUクーラー 120mm' },
    { id: 'k-aio240', name: '簡易水冷 240mm', kind: '水冷', h: 0, rad: 240, tdpMax: 260, noise: '標準', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 12000, q: '簡易水冷 CPUクーラー 240mm' },
    { id: 'k-aio280', name: '簡易水冷 280mm', kind: '水冷', h: 0, rad: 280, tdpMax: 300, noise: '標準', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 14000, q: '簡易水冷 CPUクーラー 280mm' },
    { id: 'k-aio360', name: '簡易水冷 360mm', kind: '水冷', h: 0, rad: 360, tdpMax: 350, noise: '静か', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 17000, q: '簡易水冷 CPUクーラー 360mm' },
    { id: 'k-aio420', name: '簡易水冷 420mm', kind: '水冷', h: 0, rad: 420, tdpMax: 380, noise: '静か', sock: ['AM4', 'AM5', 'LGA1700', 'LGA1851', 'LGA1200', 'LGA1151', 'LGA1151-v1'], price: 22000, q: '簡易水冷 CPUクーラー 420mm' }
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
    { id: 'mhwilds',   name: 'Monster Hunter Wilds (高設定)',  genre: '重量級AAA', g: { 1080: 150, 1440: 115, 2160: 62 },  c: 110, k: 0.9,  mem: 32 },
    /* ---- 追加分（fpsは計算モデルによる目安。実測ではありません） ---- */
    { id: 'asa',       name: 'ARK: Survival Ascended (高設定)', genre: '重量級AAA', g: { 1080: 85, 1440: 62, 2160: 32 },   c: 95,  k: 1.0,  mem: 32 },
    { id: 'ase',       name: 'ARK: Survival Evolved (高設定)',  genre: 'サバイバル', g: { 1080: 240, 1440: 170, 2160: 90 }, c: 130, k: 0.8,  mem: 16 },
    { id: 'minecraft', name: 'Minecraft Java版 (MODなし)',     genre: 'サンドボックス', g: { 1080: 700, 1440: 600, 2160: 420 }, c: 420, k: 0.45, mem: 8 },
    { id: 'mcshader',  name: 'Minecraft Java版 (重いシェーダー)', genre: 'サンドボックス', g: { 1080: 260, 1440: 170, 2160: 80 }, c: 300, k: 0.9, mem: 16 },
    { id: 'valheim',   name: 'Valheim (ヴァルヘイム)',         genre: 'サバイバル', g: { 1080: 260, 1440: 190, 2160: 100 }, c: 180, k: 0.75, mem: 16 },
    { id: 'rust',      name: 'Rust',                           genre: 'サバイバル', g: { 1080: 220, 1440: 160, 2160: 90 },  c: 150, k: 0.8,  mem: 16 },
    { id: '7dtd',      name: '7 Days to Die',                  genre: 'サバイバル', g: { 1080: 280, 1440: 200, 2160: 100 }, c: 170, k: 0.75, mem: 16 },
    { id: 'eldenring', name: 'ELDEN RING (60fps上限)',         genre: 'アクションRPG', g: { 1080: 170, 1440: 120, 2160: 62 }, c: 110, k: 0.85, mem: 16, cap: 60 },
    { id: 'bg3',       name: "Baldur's Gate 3 (高設定)",       genre: 'RPG',       g: { 1080: 190, 1440: 140, 2160: 75 },  c: 120, k: 0.85, mem: 16 },
    { id: 'wukong',    name: 'Black Myth: Wukong (RTなし・高)', genre: '重量級AAA', g: { 1080: 120, 1440: 85, 2160: 45 },   c: 100, k: 1.0,  mem: 16 },
    { id: 'ow2',       name: 'Overwatch 2',                    genre: 'FPS',       g: { 1080: 420, 1440: 330, 2160: 180 }, c: 360, k: 0.6,  mem: 16 },
    { id: 'rivals',    name: 'Marvel Rivals (高設定)',         genre: 'FPS',       g: { 1080: 230, 1440: 170, 2160: 90 },  c: 170, k: 0.85, mem: 16 },
    { id: 'bf6',       name: 'Battlefield 6 (高設定)',         genre: 'FPS',       g: { 1080: 230, 1440: 170, 2160: 90 },  c: 170, k: 0.85, mem: 16 },
    { id: 'warzone',   name: 'Call of Duty: Warzone',          genre: 'バトロワ',  g: { 1080: 260, 1440: 190, 2160: 100 }, c: 200, k: 0.85, mem: 16 },
    { id: 'pubg',      name: 'PUBG: BATTLEGROUNDS',            genre: 'バトロワ',  g: { 1080: 300, 1440: 230, 2160: 125 }, c: 200, k: 0.8,  mem: 16 },
    { id: 'helldivers', name: 'HELLDIVERS 2 (高設定)',         genre: 'シューター', g: { 1080: 170, 1440: 125, 2160: 68 }, c: 130, k: 0.9,  mem: 16 },
    { id: 'lol',       name: 'League of Legends',              genre: 'eスポーツ', g: { 1080: 900, 1440: 800, 2160: 600 }, c: 600, k: 0.5,  mem: 8 },
    { id: 'gtav',      name: 'Grand Theft Auto V',             genre: 'オープンワールド', g: { 1080: 420, 1440: 340, 2160: 190 }, c: 250, k: 0.65, mem: 16 }
  ];

  /* ---------- 今使っているPC（アップグレード診断用）----------
     plat: 世代の区分 / path: 'cpu'=CPUだけ交換できる / 'board'=マザボ・メモリごと交換が必要 */
  D.oldCpu = [
    { id: 'o-i5-10400', sock: 'LGA1200', name: 'Core i5-10400 (第10世代)',  gs: 38, mt: 30, pw: 130, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-r5-3600', sock: 'AM4',  name: 'Ryzen 5 3600',              gs: 38, mt: 34, pw: 90,  plat: 'AM4 / DDR4',     path: 'am4' },
    { id: 'o-r5-5600', sock: 'AM4',  name: 'Ryzen 5 5600',              gs: 48, mt: 42, pw: 90,  plat: 'AM4 / DDR4',     path: 'am4' },
    { id: 'o-r7-5700x3d', sock: 'AM4',name:'Ryzen 7 5700X3D',           gs: 70, mt: 55, pw: 110, plat: 'AM4 / DDR4',     path: 'board' },
    { id: 'o-i5-12400', sock: 'LGA1700', name: 'Core i5-12400F (第12世代)', gs: 52, mt: 45, pw: 120, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i5-13400', sock: 'LGA1700', name: 'Core i5-13400F (第13世代)', gs: 56, mt: 55, pw: 150, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i7-13700', sock: 'LGA1700', name: 'Core i7-13700K (第13世代)', gs: 72, mt: 85, pw: 250, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-i7-14700', sock: 'LGA1700', name: 'Core i7-14700K (第14世代)', gs: 76, mt: 95, pw: 253, plat: 'LGA1700 / DDR4または5', path: 'board' },
    { id: 'o-r5-7600', sock: 'AM5',  name: 'Ryzen 5 7600',              gs: 62, mt: 45, pw: 90,  plat: 'AM5 / DDR5',     path: 'cpu' },
    { id: 'o-r7-7800x3d', sock: 'AM5',name:'Ryzen 7 7800X3D',           gs: 92, mt: 55, pw: 120, plat: 'AM5 / DDR5',     path: 'cpu' },
    /* 以下は「今のPC」として選べる旧世代のCPUです（新品では買えないものが中心。性能値は相対的な見積もり） */
    { id: 'o-i3-10100', sock: 'LGA1200', name: 'Core i3-10100 (第10世代)', gs: 34, mt: 20, pw: 90, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-10400f', sock: 'LGA1200', name: 'Core i5-10400F (第10世代)', gs: 38, mt: 30, pw: 130, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-10500', sock: 'LGA1200', name: 'Core i5-10500 (第10世代)', gs: 40, mt: 31, pw: 130, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-10600k', sock: 'LGA1200', name: 'Core i5-10600K (第10世代)', gs: 44, mt: 36, pw: 182, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i7-10700', sock: 'LGA1200', name: 'Core i7-10700 (第10世代)', gs: 44, mt: 45, pw: 224, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i7-10700k', sock: 'LGA1200', name: 'Core i7-10700K (第10世代)', gs: 48, mt: 48, pw: 229, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i9-10900k', sock: 'LGA1200', name: 'Core i9-10900K (第10世代)', gs: 52, mt: 58, pw: 250, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-11400', sock: 'LGA1200', name: 'Core i5-11400 (第11世代)', gs: 46, mt: 36, pw: 154, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-11600k', sock: 'LGA1200', name: 'Core i5-11600K (第11世代)', gs: 52, mt: 40, pw: 182, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i7-11700', sock: 'LGA1200', name: 'Core i7-11700 (第11世代)', gs: 52, mt: 48, pw: 224, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i7-11700k', sock: 'LGA1200', name: 'Core i7-11700K (第11世代)', gs: 56, mt: 52, pw: 251, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i9-11900k', sock: 'LGA1200', name: 'Core i9-11900K (第11世代)', gs: 58, mt: 54, pw: 251, plat: 'LGA1200 / DDR4', path: 'board' },
    { id: 'o-i5-6600k', sock: 'LGA1151', name: 'Core i5-6600K (第6世代)', gs: 24, mt: 16, pw: 95, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i7-6700k', sock: 'LGA1151', name: 'Core i7-6700K (第6世代)', gs: 28, mt: 22, pw: 95, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i7-7700k', sock: 'LGA1151', name: 'Core i7-7700K (第7世代)', gs: 32, mt: 24, pw: 100, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i5-8400', sock: 'LGA1151', name: 'Core i5-8400 (第8世代)', gs: 30, mt: 24, pw: 65, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i7-8700k', sock: 'LGA1151', name: 'Core i7-8700K (第8世代)', gs: 36, mt: 32, pw: 150, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i5-9400f', sock: 'LGA1151', name: 'Core i5-9400F (第9世代)', gs: 32, mt: 25, pw: 90, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i7-9700k', sock: 'LGA1151', name: 'Core i7-9700K (第9世代)', gs: 38, mt: 32, pw: 160, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-i9-9900k', sock: 'LGA1151', name: 'Core i9-9900K (第9世代)', gs: 42, mt: 42, pw: 210, plat: 'LGA1151 / DDR4', path: 'board' },
    { id: 'o-r5-1600', sock: 'AM4', name: 'Ryzen 5 1600', gs: 26, mt: 28, pw: 90, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r5-2600', sock: 'AM4', name: 'Ryzen 5 2600', gs: 30, mt: 30, pw: 90, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r7-2700x', sock: 'AM4', name: 'Ryzen 7 2700X', gs: 32, mt: 40, pw: 130, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r3-3100', sock: 'AM4', name: 'Ryzen 3 3100', gs: 32, mt: 20, pw: 80, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r5-3400g', sock: 'AM4', name: 'Ryzen 5 3400G', gs: 28, mt: 22, pw: 90, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r5-3600x', sock: 'AM4', name: 'Ryzen 5 3600X', gs: 40, mt: 36, pw: 110, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r7-3700x', sock: 'AM4', name: 'Ryzen 7 3700X', gs: 42, mt: 46, pw: 100, plat: 'AM4 / DDR4', path: 'am4' },
    { id: 'o-r9-3900x', sock: 'AM4', name: 'Ryzen 9 3900X', gs: 44, mt: 62, pw: 150, plat: 'AM4 / DDR4', path: 'am4' }
  ];
  D.oldCpu.sort(function (a, b) { return a.gs - b.gs; });
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
    { id: 'g-4090',   name: 'GeForce RTX 4090',        score: 80, tgp: 450, vram: 24 },
    /* 以下は「今のPCから診断」用に追加した旧世代（性能の値は相対的な見積もり） */
    { id: 'g-1650',   name: 'GeForce GTX 1650',        score: 6,  tgp: 75,  vram: 4 },
    { id: 'g-rx580',  name: 'Radeon RX 580',           score: 7,  tgp: 185, vram: 8 },
    { id: 'g-1660',   name: 'GeForce GTX 1660',        score: 10, tgp: 120, vram: 6 },
    { id: 'g-2060',   name: 'GeForce RTX 2060',        score: 14, tgp: 160, vram: 6 },
    { id: 'g-rx5700xt', name: 'Radeon RX 5700 XT',     score: 16, tgp: 225, vram: 8 },
    { id: 'g-2070s',  name: 'GeForce RTX 2070 SUPER',  score: 19, tgp: 215, vram: 8 },
    { id: 'g-3060ti', name: 'GeForce RTX 3060 Ti',     score: 25, tgp: 200, vram: 8 },
    { id: 'g-rx6700xt', name: 'Radeon RX 6700 XT',     score: 24, tgp: 230, vram: 12 },
    { id: 'g-3070ti', name: 'GeForce RTX 3070 Ti',     score: 30, tgp: 290, vram: 8 },
    { id: 'g-3080',   name: 'GeForce RTX 3080',        score: 40, tgp: 320, vram: 10 },
    { id: 'g-rx6800xt', name: 'Radeon RX 6800 XT',     score: 40, tgp: 300, vram: 16 }
  ];
  D.oldGpu.sort(function (a, b) { return a.score - b.score; });

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
    { key: 'tsukumo',  brand: 'G-GEAR', note: '秋葉原の老舗ショップのブランド。メモリやSSDの容量が大きめの構成が多いと言われます。', check: ['納期の目安', '標準でついてくるパーツの内容', '保証とサポート窓口の時間'] },
    { key: 'frontier', brand: 'FRONTIER', note: '山口県の自社工場で組み立てるBTOメーカー。週替わりのセールが多く、メモリやSSDが多めの構成もよく見かけます。', check: ['セールの期限と台数', '送料（別料金のことがある）', '標準保証の年数（モデルにより1〜3年）'] },
    { key: 'sycom', brand: 'G-Master', note: '電源やマザーボードなど、パーツのメーカーまで細かく選べるBTOメーカー。品質重視の人向けで、価格は高めです。', check: ['標準構成のパーツのメーカーと型番', 'カスタマイズ後の合計金額', '納期（受注生産で日数がかかることがある）'] },
    { key: 'mdl', brand: 'MDL.make', note: '鹿児島のメーカーが運営する、価格の安さが特徴のBTOブランド。表示価格はメモリ16GB・SSD 500GBの最小構成のことが多いです。', check: ['メモリとSSDの容量（最小構成か）', 'SSDの規格（Gen3かGen4か）', '保証の内容とサポートの方法（LINEなど）'] },
    { key: 'ozgaming', brand: 'OZgaming', note: '千葉のメーカーのゲーミングPCブランド。見た目にこだわったケースや台数限定のセールモデルが多いのが特徴です。', check: ['台数限定・セールの期限', '標準のパーツの内容', '保証とサポートの方法（LINE・電話など）'] }
  ];

  /* ---------- 実際の商品（js/parts-real.js）を、種類ごとの目安の後ろに足す ---------- */
  if (window.PCR_REAL) {
    const BASE = { mb: id => D.mb.find(m => m.sock === id.sock && m.chip === id.chip && m.form === id.form) || D.mb.find(m => m.sock === id.sock && m.chip === id.chip) || D.mb.find(m => m.sock === id.sock) };
    Object.keys(window.PCR_REAL).forEach(function (k) {
      if (!D[k]) return;
      window.PCR_REAL[k].forEach(function (x) {
        // マザーボードは、M.2の世代・OC対応などを同じクラスの目安から引き継ぐ
        const b = BASE[k] ? BASE[k](x) : null;
        D[k].push(b ? Object.assign({ m2g: b.m2g, oc: b.oc }, x) : x);
      });
    });
  }

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
      if (k.indexOf('__') === 0 || !D.by[k]) return;
      Object.keys(window.PCR_PRICES[k]).forEach(function (id) {
        if (D.by[k][id] && typeof window.PCR_PRICES[k][id] === 'number') D.by[k][id].price = window.PCR_PRICES[k][id];
      });
    });
    /* 価格を確認できていないCPU・グラボ（在庫が少ない・販売終了など）。おまかせ提案には使わない */
    const un = window.PCR_PRICES.__unverified || {};
    Object.keys(un).forEach(function (k) {
      (un[k] || []).forEach(function (id) { if (D.by[k] && D.by[k][id]) D.by[k][id].priceUnverified = true; });
    });
    D.priceChecked = window.PCR_PRICES.__checked || {};
  }
  /* おまかせ提案・交換の提案に出してよいパーツか（旧世代と、価格を確認できていないものは出さない） */
  D.suggestable = function (p) { return !p.legacy && !p.priceUnverified && !p.used && !p.real; };

  return D;
})();
