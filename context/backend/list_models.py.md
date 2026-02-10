# Context: backend/list_models.py

## 目的 (Purpose)

Google Generative AI (Gemini) で利用可能なモデル一覧を取得・表示するユーティリティスクリプト。
使用可能なモデル名（例: `gemini-2.0-flash`）を確認し、`gemini_service.py` の設定に反映させるために使用する。

## 依存関係 (Dependencies)

- **Library**: `google.generativeai`
- **Env Var**: `GOOGLE_API_KEY` (must be set in environment)

## データ構造 (Data Structures)

- **Output**: コンソールにモデル名(`name`)、サポートされる生成メソッド(`supported_generation_methods`)を表示。

## 設計判断 (Design Decisions)

- **Simple Script**: アプリケーション本体とは独立して実行可能。`python-dotenv` 等は使用せず、環境変数が設定されている前提で動作するシンプルな構成。

## 変遷 (History)

- [2026-02-07] 初版作成: 利用可能なGeminiモデル（特に2.0系）の存在確認用。
