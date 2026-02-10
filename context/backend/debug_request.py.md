# Context: backend/debug_request.py

## 目的 (Purpose)

APIエンドポイント (`/api/organize`) の動作確認用スクリプト。
日本語エンコーディングの問題特定や、バックエンドロジックの単体検証に使用する。
`urllib.request` を使用し、外部依存（requestsライブラリ等）を極力排除して環境依存の問題を切り分ける。

## 依存関係 (Dependencies)

- **Standard Libraries**: `urllib.request`, `json`
- **Target Endpoint**: `http://127.0.0.1:8000/api/organize`

## データ構造 (Data Structures)

- **Payload**:
  - `text`: 送信テキスト（日本語を含むテスト文）
  - `current_themes`: 現在のテーマリスト（空配列）

## 設計判断 (Design Decisions)

- **Standard Library Only**: 実行環境（CI/CD、異なるOS）での互換性を高めるため、サードパーティライブラリを使用しない実装とした。
- **UTF-8 Encoding**: 日本語ペイロードを正しく扱うため、`json.dumps().encode('utf-8')` を明示的に行い、`Content-Type` ヘッダーを設定している。

## 変遷 (History)

- [2026-02-07] 初版作成: APIの422エラーおよびエンコーディング問題のデバッグ用として実装。
