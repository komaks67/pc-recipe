/* PC Recipe 起動 */
(function () {
  const CFG = PCR_CONFIG, U = PCR_UI;
  U.$('#ft').innerHTML = '<div class="ft-in"><p><b>PR</b>　当サイトにはアフィリエイト広告が含まれます。' +
    (CFG.affiliate.amazonTag ? 'Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。' : '') + '</p>' +
    '<p>表示しているfps・性能は計算モデルによる目安です。パーツの互換性は、購入前に必ず公式の製品ページで確認してください。（データ確認日: ' + CFG.dataDate + '）</p>' +
    '<p><a href="#/about">このサイトについて・免責・プライバシー</a>　© ' + new Date().getFullYear() + ' ' + CFG.siteName + '</p></div>';
  U.start();
})();
