# Context: frontend/e2e/scenario.spec.ts

## 目的 (Purpose)

フロントエンドのE2Eテストシナリオ。
Playwrightを使用し、実際のブラウザ操作をシミュレートしてアプリケーションの主要機能（シナリオ再生、カード生成、表示）を検証する。

## 依存関係 (Dependencies)

- **Framework**: Playwright
- **Target**: `http://127.0.0.1:3000` (Frontend)
- **UI Structure**:
  - `<details>` / `<summary>`: デバッグメニュー。
  - `Next Step` Button: シナリオ進行トリガー。
  - `.card-animate-in`: 生成されたカード。

## テストフロー (Test Flow)

1. **Setup**: トップページアクセス、初期状態スクショ保存。
2. **Interact**:
   - メニュー展開（Force Click）、アニメーション待機(1000ms)、展開後スクショ保存。
   - "Next Step" ボタンクリック（Force Click）。
3. **Verification**:
   - カード生成待機 (Timeout 45s)、生成後スクショ保存。
   - テキスト内容検証。
4. **Error Handling**: 失敗時に `error-state.png` と `error-state.html` を保存。コンソールログおよびページエラーをキャプチャ。

## 変遷 (History)

- [2026-02-08] デバッグ強化: HTMLダンプ機能と詳細ログ出力を追加。要素カウントログを追加。
- [2026-02-08] 修正: オーバーレイ等の干渉を考慮し、クリック操作に `{ force: true }` を適用。
- [2026-02-08] デバッグ強化: スクリーンショット保存機能と詳細なエラーハンドリングを追加。
- [2026-02-08] 初版作成: シナリオプレイヤーを用いた基本的動作確認テストの実装。
