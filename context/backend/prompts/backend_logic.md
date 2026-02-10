# Context: backend/prompts/backend_logic.md

## 目的 (Purpose)

Gemini API へのシステムプロンプト。
ユーザーの自然言語入力を分析し、構造化されたコマンド（JSON）に変換するためのルール定義。

## データ構造 (Data Structures)

- **Input**: `Input Text`, `Current Themes` (Context)
- **Output Schema**:
  ```json
  {
    "commands": [
      {
        "action": "add_note",
        "args": {
          "type": "PROPOSAL" | "DECISION" | "ISSUE" | "INFO",
          "summary": "Short title",
          "content": "Detailed content",
          "importance": 0.0 - 1.0, // New in V2: 数値化された重要度
          "keywords": ["tag1", "tag2"], // New in V2: 関連性タグ
          "related_concepts": ["concept1"] // New in V2: 概念的リンク
        }
      }
    ]
  ```

## 設計判断 (Design Decisions)

- **Strict JSON**: コードブロックなしの Raw JSON 出力を強制し、パースエラーを最小化する。
- **Intelligence (V2)**:
  - `importance`: コンテンツの緊急度や重要性を0.0-1.0で数値化し、UI上のカードサイズや配置計算（引力）に反映させる。
  - `keywords`: ベクトル検索を待たずとも、単純なキーワードマッチングで「関連カード」を引き寄せるためのタグ。

## 変遷 (History)

- [2026-02-08] V2アップデート: `importance`, `keywords` フィールドを追加。
