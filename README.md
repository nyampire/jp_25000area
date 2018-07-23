# What's this?
地理院地図、およびその元データとなっている基盤地図情報において、1/25000精度で作成されている地域を
抽出したものです。

## 注意点
このデータおよびリストは、完全なものではありません。
実際には、これより多くの地域が1/25000精度でデータ作成されているかと思われます。

## 行っている処理
1. 地理院地図上で公開されている "[縮尺2500分の1相当以上の概ねの範囲](http://maps.gsi.go.jp/#8/35.431582/138.408508/&base=std&ls=std|fgd_2500_area)" のデータを、frogcatさんによる手順 [地理院タイルの領域に対応する GeoJSON の生成](https://qiita.com/frogcat/items/09a91e393efede922ef1) に従って処理
2. [国土数値情報](http://nlftp.mlit.go.jp/ksj/)から取得した[行政区域データ](http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html)と重ね合わせ、差分処理を実施

## 利用しているデータ
* 地理院地図: "[縮尺2500分の1相当以上の概ねの範囲](http://maps.gsi.go.jp/#8/35.431582/138.408508/&base=std&ls=std|fgd_2500_area)"
* 国交省 [国土数値情報](http://nlftp.mlit.go.jp/ksj/): [行政区域](http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html)

## 作成しているデータのライセンス
This data is published under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ja) License.

