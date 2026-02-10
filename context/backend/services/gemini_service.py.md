# Context: backend/services/gemini_service.py

## 目的 (Purpose)

Google Gemini API を利用して、自然言語テキストを構造化データ（JSONコマンド）に変換するサービスロジック。
プロンプトの管理、API呼び出し、レスポンスのパース（Markdownフェンスの除去など）をカプセル化する。

## 依存関係 (Dependencies)

- **External Libraries**: `google.generativeai`
- **System Resources**: `.env` (GOOGLE_API_KEY), `backend/prompts/backend_logic.md` (System Prompt)

## データ構造 (Data Structures)

### GeminiService Class

- **Attributes**:
  - `api_key`: Google API Key
  - `model_name`: 使用するGeminiモデル名 (default: `gemini-2.0-flash`)
  - `system_prompt`: 外部ファイルから読み込んだシステムプロンプト

- **Methods**:
- **Methods**:
  - `__init__()`: APIキー確認、モデル設定、システムプロンプト読み込みを行う。APIキー欠落時はログ警告のうえ、空レスポンスを返すセーフモードで起動する。
  - `organize_text(text, current_themes)`: テキストを送信し、`Command` オブジェクトのリストを含む辞書を返す。エラー時は空リストを返し、例外を握りつぶしてサーバークラッシュを防ぐ。
  - `_load_system_prompt()`: プロンプトファイルの読み込み。
  - `_clean_and_parse_json(response_text)`: LLMのレスポンスからJSONを抽出・パースする。

## 設計判断 (Design Decisions)

- **プロンプトの外部化**: ロジックとプロンプトを分離し、プロンプトエンジニアリングを容易にするため、`prompts/backend_logic.md` を読み込む設計。
- **モデルの選定**: 応答速度と精度のバランスから `gemini-2.0-flash-exp` をデフォルト採用（要件に基づく）。
- **JSONパースの堅牢化**: LLMがMarkdown記法 (`json ... `) を含めて返すケースに対応するため、`_clean_and_parse_json` でクリーニング処理を実装。

## 変遷 (History)

- [2026-02-07] システムプロンプト (`prompts/backend_logic.md`) の読み込みと適用を強化。
- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
