# Serverless RDS Proxy Rest API

## 機能

#### ✔ 自動リクエストとレスポンスのJSONパース
[Middy](https://github.com/middyjs/middy)を利用して、リクエストのbodyを自動的にオブジェクトにパースする
#### ✔ JSON Schemaからの自動リクエストとレスポンスバリデーション
[JSON Schema](https://json-schema.org/learn/getting-started-step-by-step.html) を使って、リクエストのbodyのバリデーションとAPIレスポンスのバリデーションは自動的に実行されます。
また、bodyのTypescriptインターフェースもSchemaから作成されます。
※ここもMiddyを使っています。
#### ✔ Webpack+Typescriptで共通処理実装可能（Lambda Layerは不要）
普段、各Lambdaは独立された処理なので、共通処理を実装したい場合、Lambda Layerを使うことが多いと思います。
ただ、Layerのバージョン管理でデプロイが複雑になったり、ローカル実行が難しくなったりします。
Webpackを使うことで、ビルドのタイミングで必要なコードを各Lambdaの中に入れてくれるため、Layerは不要になります。
※別のリポジトリーで処理を使いたい場合、Layerはまだ必要です。
#### ✔ ローカル実行可能 + ホットリロード！！
[serverless-offline](https://www.serverless.com/plugins/serverless-offline) ってプラグインを使って、APIのローカル動作確認は可能になります。
#### ✔ RDS Proxy(MySQL)対応
RDS Proxyに繋げるための実装はできているので、設定ファイルに必要なVPC情報やAWSリソース情報を入れたら使えます。

## ローカル環境

- ローカルDBを立ち上げる
- `configLOCAL.ts`ファイルにDB設定を更新する
- 以下のコマンドを実行する

```
// npmパッケージのインストール
npm install
// ローカルAPIの実行
npm run serve
```

## デプロイ

- ローカルにAWSプロフールが設定されていることは必要
- 以下のコマンドを実行

```
npx serverless deploy --stage dev --aws-profile [自分のプロフィール名]
```