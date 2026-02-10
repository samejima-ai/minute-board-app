# Context: Whiteboard Component

## 目的 (Purpose)

アプリケーションのメイン画面となるホワイトボード/黒板コンポーネント。
生成された `SpeechCard` を配置し、物理演算 (`d3-force`) による有機的なレイアウトを提供する。
ユーザーがドラッグ操作でカード整理を行えるようにする。

## 依存関係 (Dependencies)

- **UIライブラリ**: `@mui/material` (Box, AppBar, Toolbar, IconButton, Tooltip, CircularProgress)
- **物理演算**: `d3` (forceSimulation, drag, forceLink)
- **サブコンポーネント**: `SpeechCard`, `SettingsModal`, `ThemeToggle`
- **フック**: `useSettings`, `d3-force` 関連フック

## データ構造 (Data Structures)

- **Props**:
  - `cards`: SpeechCardProps[] - 表示するカードのリスト
- **Internal Interfaces**:
  - `CardNode`: `d3.SimulationNodeDatum` & `SpeechCardProps` - シミュレーション用ノード
  - `SimulationLink`: `d3.SimulationLinkDatum<CardNode>` & `{ value: number }` - 類似度リンク

## 設計判断 (Design Decisions)

1.  **MUI Box/AppBarによる構造化**:
    - 全体を `Box` (flex column) で構成し、ヘッダー (`AppBar`) とメインキャンバス (`Box`) に分割。
    - `sx` プロパティで背景グラデーションやガラス効果を適用し、テーマごとの世界観（黒板/ホワイトボード）を表現。

2.  **d3-forceシミュレーションの統合**:
    - `useRef` と `useEffect` を使用してd3シミュレーションを初期化・更新。
    - `SimulationLink` インターフェースを定義し、d3の標準型を拡張して `value` (類似度スコア) を保持できるように変更（TypeScript対応）。
    - DOM要素を直接操作 (`ref` + `transform`) することで、Reactの再レンダリングを最小限に抑え、高パフォーマンスなアニメーションを実現。

3.  **レイアウト安定化 (Stability)**:
    - カード追加時に全カードが再配置されるのを防ぐため、シミュレーションインスタンスを `useRef` で保持し、`nodes` データのみを更新する。
    - データ更新時の再開 (`restart`) は、`alpha` (温度) を低く設定し、急激な動きを抑制する。

## 変遷 (History)

- [2026-02-08] **Visual Update**: テーマに応じた背景グラデーション（黒板風/ホワイトボード風）の実装。
- [2026-02-08] レイアウト改善: シミュレーションの再利用ロジックを追加し、カード追加時の位置リセットを防止。
- [2026-02-08] ビルド修正: `SimulationLink` 型定義を追加し、TypeScriptエラーを解消。
- [2026-02-08] MUI移行: `AppBar` ヘッダーと `Box` メインエリアに再構築。`globals.css` のクラス依存を排除し、MUIテーマシステムと統合。
- [2026-02-07] 物理演算ロジックの改善: カード間の引力・斥力調整。
- [2026-02-06] 初版作成
