# Context: backend/main.py

## 目的 (Purpose)

FastAPI アプリケーションのエントリーポイント。
フロントエンドからのリクエストを受け付け、`GeminiService` を用いてテキストの構造化処理を行う。
CORS設定、環境変数の読み込み、ロギングの初期化も担当する。

## 依存関係 (Dependencies)

- **External Libraries**: `fastapi`, `uvicorn`, `python-dotenv`, `pydantic`
- **Internal Modules**: `backend.services.gemini_service`

## データ構造 (Data Structures)

### Pydantic Models

- **OrganizeRequest**:
  - `text` (str): 構造化対象の入力テキスト
  - `current_themes` (List[str]): 現在のホワイトボード上のテーマ一覧

- **CommandArgs** (新規):
  - `summary` (str): カードのタイトル
  - `content` (str): カードの詳細内容
  - `keywords` (List[str]): タグ・キーワード
  - `importance` (float): 重要度 (0.0 - 1.0)
  - `type` (str): "INFO" 等

- **Command** (新規):
  - `action` (ActionType): "add_note", "update_graph", "unknown"
  - `args` (Union[CommandArgs, Dict]): コマンド引数
  - `original_text` (Optional[str]): 引用元テキスト

- **OrganizeResponse**:
  - `commands` (List[Command]): 実行すべき操作コマンドのリスト（型安全）
  - `raw_response` (Optional[str]): デバッグ用
  - `processing_time` (Optional[float]): 処理時間

## 設計判断 (Design Decisions)

- **FastAPIの採用**: 非同期処理 (`async def`) のサポートと、Pydanticによる型安全性・自動バリデーションのため。
- **CORS設定**: Next.js (port 3000, 3001) からのアクセスを許可するため、明示的に `allow_origins` を設定。
- **エラーハンドリング**: サービス層でのエラーはログ出力し、フロントエンドには空のコマンドリストを返すことで、UIのクラッシュを防ぐ設計（Graceful Degradation）。

## 変遷 (History)

- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
