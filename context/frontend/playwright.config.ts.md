# Context: Configure Playwright for E2E Testing

## 目的

Playwrightを用いたE2Eテストの設定を行う。

## 設定内容

- `testDir`: `./e2e` (テストファイルの格納場所)
- `testDir`: `./e2e` (テストファイルの格納場所)
- `baseURL`: `http://127.0.0.1:3001` (開発サーバー)
- `webServer`: 無効化（既存サーバーを手動管理するため）。Playwrightによる自動起動は行わない。
- `projects`: Chromiumブラウザを使用。

## 参照

- [Framework]: Playwright
- [Frontend]: Next.js
