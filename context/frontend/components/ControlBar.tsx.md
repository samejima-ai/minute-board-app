# Context: ControlBar Component

## 目的 (Purpose)

アプリケーションの主要な操作（マイク切り替え、テーマ切り替え、設定、カード数表示）を行うための常駐コントロールバー。
画面下部に固定表示され、ユーザーがいつでもアクセスできるようにする。

## 依存関係 (Dependencies)

### Imports

- **UIライブラリ**: `@mui/material` (AppBar, Toolbar, IconButton, Badge, Tooltip)
- **アイコン**: `lucide-react` (Mic, Sun, Moon, Settings), `next/image` (手書き風アイコン画像)
- **テーマ**: `useTheme` フックによるダーク/ライトモード判定
- **Context**: [providers.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/providers.tsx) (`ThemeContext`)

### Exports

- `ControlBar` (export) - コントロールバーコンポーネント

### Dependents

- [page.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/page.tsx) - メインページで使用

## データ構造 (Data Structures)

- **Props**:
  - `isListening`: boolean - 音声認識中かどうか
  - `onToggleMic`: () => void - マイク切り替え
  - `onOpenSettings`: () => void - 設定モーダルを開く
  - `cardCount`: number -表示中のカード数

- **Context**:
  - `ThemeContext` から `mode` と `toggleTheme` を取得し、テーマ切り替えを実行

## 設計判断 (Design Decisions)

1.  **MUI AppBarの採用**:
    - 画面下部への固定表示 (`position="fixed", bottom=0`) とレイアウト管理のため `AppBar` を採用。
    - 背景は透過させ、内部のコンテナ (`Box`) にのみ背景色とぼかし効果を適用することで、浮遊感のあるデザインを実現。

2.  **手書き風アイコンの維持**:
    - アプリの「親しみやすさ」を表現するため、`lucide-react` の標準アイコンではなく、手書き風のPNG画像 (`next/image`) を引き続き使用。
    - 画像読み込みエラー時のフォールバックとして `lucide-react` アイコンを用意。

3.  **Badgeによる情報表示**:
    - カード枚数は `Badge` コンポーネントを使用し、付箋紙のようなデザイン (`transform: rotate(6deg)`) で遊び心を演出。

## 変遷 (History)

- [2026-02-08] **テーマ切り替え修正**: `page.tsx` のローカル state に依存していたテーマ切り替えを、`ThemeContext` を直接使用するよう変更。Props から `theme` と `onToggleTheme` を削除し、コンポーネント内で `useContext(ThemeContext)` を使用。
- [2026-02-08] MUI移行: `AppBar`, `Toolbar` をベースに再実装。手書き風アイコンの表示ロジックは維持しつつ、MUIのスタイリングシステムに統合。
- [2026-02-06] デザイン調整: マイクボタンの強調表示とアニメーション追加。
- [2026-02-06] 初版作成
