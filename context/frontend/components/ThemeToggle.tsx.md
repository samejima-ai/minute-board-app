# Context: ThemeToggle Component

## 目的 (Purpose)

アプリケーションのテーマ（ダーク/ライト）を切り替えるボタンコンポーネント。
ユーザーが好みの外観を選択できるようにし、システム全体のテーマ適用状態を管理する。

## 依存関係 (Dependencies)

### Imports

- **UIライブラリ**: `@mui/material` (IconButton, Tooltip)
- **アイコン**: `lucide-react` (Sun, Moon)
- **Context**: [providers.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/providers.tsx) (`ThemeContext`)

### Exports

- `ThemeToggle` (export)

### Dependents

- [SettingsModal.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/components/SettingsModal.tsx)
- (その他、任意の場所で使用可能)

## データ構造 (Data Structures)

- **Props**:
  - `className`: string - 追加スタイルクラス（廃止予定、MUI sx propへ移行）
- **Context**:
  - `toggleTheme`: () => void - テーマ切り替え関数
  - `mode`: 'light' | 'dark' - 現在のテーマモード

## 設計判断 (Design Decisions)

1.  **MUI IconButtonの使用**:
    - クリック時のリップルエフェクトやアクセシビリティ対応のため、標準の `IconButton` を使用。
    - アイコンは `lucide-react` を維持し、デザインの一貫性を確保。

2.  **Context経由の制御**:
    - `useTheme` フックではなく、`Providers` で定義した `ThemeContext` を直接利用することで、トグル機能を確実に動作させる（MUIの `toggleColorMode` パターンに準拠）。
    - 追記: 実装では `useContext(ThemeContext)` を使用。

## 変遷 (History)

- [2026-02-08] MUI移行: `IconButton` ベースに再実装。`ThemeContext` を利用してテーマ切り替えを行うように変更。
- [2026-02-07] 初版作成
