/* PC Recipe 起動 */
(function () {
  const CFG = PCR_CONFIG, U = PCR_UI;
  U.$('#ft').innerHTML = '<div class="ft-in"><p><b>PR</b>　当サイトにはアフィリエイト広告が含まれます。' +
    (CFG.affiliate.amazonTag ? 'Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。' : '') + '</p>' +
    '<p>表示しているfps・性能は計算モデルによる目安です。価格は確認日時点の目安で、毎日変わります。パーツの互換性と価格は、購入前に必ず公式の製品ページ・購入先で確認してください。（価格確認日: ' + U.esc(PCR_DATA.priceDate || CFG.dataDate) + '）</p>' +
    (U.hasImages() ? '<p>パーツ画像: <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener">Supported by Rakuten Developers</a>（画像の著作権は各ショップに帰属します）</p>' : '') +
    '<p><a href="guide/">読みもの・用語集</a>　<a href="fps/">ゲーム別fpsの目安</a>　<a href="#/about">このサイトについて</a>　<a href="#/about">プライバシーポリシー・免責事項</a>' + (CFG.contactUrl ? '　<a href="' + U.esc(CFG.contactUrl) + '" target="_blank" rel="noopener">お問い合わせ</a>' : '') + '</p><p>© ' + new Date().getFullYear() + ' ' + CFG.siteName + '</p></div>';
  U.start();
})();
