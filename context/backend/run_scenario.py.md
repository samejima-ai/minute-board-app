# Context: backend/run_scenario.py

## 目的 (Purpose)

バックエンドのロジック検証を効率化するためのCLIツール。
フロントエンドを介さずに、定義済みの会話シナリオ（テキストリスト）を `GeminiService` に順次送信し、構造化結果（JSON）を検証・ログ記録する。

## 依存関係 (Dependencies)

- **Internal**: `backend.services.gemini_service.GeminiService`
- **Libraries**: `asyncio` (非同期実行), `logging` (ログ記録)

## データ構造 (Data Structures)

- **Scenario Data**:
  - PythonのリストまたはJSONファイルとして定義。
  - `[{"step": 1, "input": "...", "expected_type": "PROPOSAL"}, ...]`
- **Log Format**:
  - `logs/scenario_test_YYYYMMDD_HHMMSS.log`
  - 各ステップの入力、Raw Response、Parsed Commandsを記録。

## 設計判断 (Design Decisions)

- **CLI Execution**: 開発サイクルを高速化するため、`uvicorn` サーバーを立てずに単体スクリプトとして実行可能にする。
- **AsyncIO**: `GeminiService` 自体は同期/非同期どちらでも呼べるように設計されているが、将来的な並列実行も視野に入れ `asyncio` ベースで実装する（ただし今回は順次実行）。
- **Mock Context**: フロントエンドが保持している `current_themes` (Context) の蓄積・更新をシミュレートする簡易ロジックを含める。

## 変遷 (History)

- [2026-02-08] 新規作成: V2 UI刷新後のバックエンドロジック検証用。
