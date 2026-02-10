# Context: SpeechCard Component

## 目的 (Purpose)

音声認識によって生成された個々の情報カードを表示するコンポーネント。
要約、詳細、キーワード、重要度などの情報を視覚的に整理し、物理演算レイアウト内で操作可能なオブジェクトとして機能する。

## 依存関係 (Dependencies)

- **UIライブラリ**: `@mui/material` (Card, CardContent, Typography, Chip, Avatar, Box)
- **アイコン**: `lucide-react` (ZoomIn)
- **データ型**: `src/types/card.ts` (SpeechCardProps)

## データ構造 (Data Structures)

- **Props (SpeechCardProps)**:
  - `id`: string - 一意の識別子
  - `type`: 'IDEA' | 'TODO' | 'NOTE' | 'ISSUE' | 'DECISION' - カードタイプ
  - `summary`: string - 要約
  - `detail`: string - 詳細
  - `importance`: number - 重要度 (1-5)
  - `keywords`: string[] - 関連キーワード
  - `timestamp`: string - 生成日時
  - `style`: CSSProperties - 外部（d3-force等）からのスタイル注入用

## 設計判断 (Design Decisions)

1.  **MUI Cardの採用**:
    - 情報のまとまりを表現するため `Card` コンポーネントを使用。
    - `sx` prop を用いて、タイプごとの色分けや重要度に応じたグラデーションボーダーを動的に適用。

2.  **視覚的階層**:
    - **Header**: カードタイプと重要度（星印やインジケータ）。
    - **Body**: 要約を大きく表示 (`h6`)、詳細は折りたたみまたはモーダル表示（現在は概要表示のみ）。
    - **Footer**: キーワードを `Chip` で表示。

3.  **d3-forceとの連携**:
    - 親コンポーネント (`Whiteboard`) から渡される `style` (transform等) を受け取り、DOM要素に適用することで物理演算による位置更新をスムーズに行う。

## 変遷 (History)

- [2026-02-08] MUI移行: `Card`, `CardContent`, `Chip` を用いて再実装。Tailwind CSSの複雑なクラス定義をMUIの `sx` スタイリングに整理。
- [2026-02-07] デザイン改修: タイプ別カラーリングとグラスモーフィズムの適用。
- [2026-02-06] 初版作成
