/* ============================================================
   PC Recipe 設定ファイル（ここだけ書き換えればOK）
   ============================================================ */
window.PCR_CONFIG = {
  siteName: 'PC Recipe',

  /* 価格が「仮の値」のあいだは true。
     data.js の price を最新に更新したら false にしてください。
     true のあいだは、画面に「仮の価格」の帯が出ます。 */
  priceIsPlaceholder: true,

  /* パーツデータを最後に確認した日 */
  dataDate: '2026-11-12',

  /* 1kWhあたりの電気代（円）。目安: 31円。画面でも変更できます */
  electricityYenPerKwh: 31,

  /* お問い合わせ・誤りの報告フォームのURL（Googleフォーム等）。空のままだと表示されません */
  contactUrl: '',

  affiliate: {
    /* AmazonアソシエイトのトラッキングID（例: pcrecipe-22）。空のままだと普通のリンクになります */
    amazonTag: '',
    /* 楽天アフィリエイトのID（空のままだと普通のリンク） */
    rakutenId: '596b99d6.84cad32d.596b99d7.476d5a69',

    /* BTOメーカーのリンク。ASP（A8.netなど）で提携が通ったら、
       url を ASP が発行した「広告リンクのURL」に差し替えてください。 */
    bto: {
      dospara: { name: 'ドスパラ',       brand: 'GALLERIA', url: 'https://www.dospara.co.jp/' },
      pckoubou: { name: 'パソコン工房',   brand: 'LEVEL∞',   url: 'https://www.pc-koubou.jp/' },
      tsukumo: { name: 'TSUKUMO',        brand: 'G-GEAR',   url: 'https://www.tsukumo.co.jp/' }
    }
  }
};
