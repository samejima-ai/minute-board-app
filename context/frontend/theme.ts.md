# Context: frontend/theme.ts

## 目的 (Purpose)

MUI (Material UI) のテーマ定義ファイル。
アプリケーション全体のカラーパレット、タイポグラフィ、コンポーネントのデフォルトスタイルを管理する。
ユーザー設定（ダーク/ライトモード、フォントスタイル）に基づいて動的にテーマを生成する機能を提供する。

## 依存関係 (Dependencies)

- **Library**: `@mui/material/styles`
- **Fonts**: `Inter`, `Noto Sans JP`, `Roboto` (from `next/font/google` via layout), `Yomogi`, `Zen Kurenaido`

## 設計判断 (Design Decisions)

1.  **Dynamic Theme Generation (`getAppTheme`)**:
    - 単的な `lightTheme`/`darkTheme` 定数ではなく、`mode` (light/dark) と `fontMode` (handwriting/digital) を引数に取る関数として実装。
    - これにより、ユーザーが「手書き風フォント」と「デジタルフォント」を切り替えられるようにした。

2.  **Font Strategy**:
    - **Digital Mode**: `Inter`, `Noto Sans JP`, `Roboto` (視認性重視)
    - **Handwriting Mode**:
      - **Dark (Blackboard)**: `Yomogi` (チョーク風の質感)
      - **Light (Whiteboard)**: `Zen Kurenaido` (マーカー風の質感)
    - これらを `typography` 設定で一括適用し、アプリ全体の雰囲気を統一。

3.  **Color Palette**:
    - **Dark**: 深い緑 (`#1a2e1a`) を背景にし、黒板のような世界観を構築。
    - **Light**: オフホワイト (`#fdfbf7`) を背景にし、紙やホワイトボードの質感を表現。
    - **Primary/Secondary**: Tailwind CSSの色味 (`green-400`, `blue-500` 等) をベースに、それぞれのテーマに調和するよう微調整。

4.  **Glassmorphism**:
    - `MuiPaper`, `MuiDialog`, `MuiCard` 等の表面コンポーネントに `backdropFilter: blur` と半透明の背景色を設定し、モダンなガラス効果を適用。

## 変遷 (History)

- [2026-02-08] **Font Customization**: `fontMode` オプションを追加し、手書き風フォント (`Yomogi`, `Zen Kurenaido`) とデジタルフォントの切り替えに対応。
- [2026-02-08] **Refactoring**: 静的なテーマオブジェクトから動的な生成関数へ移行。
- [2026-02-08] MUI移行: Tailwind CSS変数を参照しつつ、MUIの `createTheme` で完全なテーマシステムを構築。
