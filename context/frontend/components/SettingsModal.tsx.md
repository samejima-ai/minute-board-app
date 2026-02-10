# Context: SettingsModal Component

## 目的 (Purpose)

アプリケーションの設定を変更するためのモーダルUIコンポーネント。
ユーザーが「音声認識」「カード管理」「表示設定」の各パラメータを直感的に変更できるようにする。
MUI (Material UI) を採用し、モダンで統一感のあるデザインを提供する。

## 依存関係 (Dependencies)

### Imports

- **UIライブラリ**: `@mui/material`, `@mui/icons-material`
- **アイコン**: `lucide-react`, `@mui/icons-material`
- **Hooks**: `src/hooks/useSettings.ts`
- **Context**: [providers.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/providers.tsx) (`ThemeContext`)

### Exports

- `SettingsModal` (export)

### Dependents

- [page.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/page.tsx)

## データ構造 (Data Structures)

- **Props**:
  - `isOpen`: boolean - モーダルの表示状態
  - `onClose`: () => void - 閉じる時のコールバック
  - `settings`: AppSettings - 現在の設定オブジェクト
  - `onUpdate`: (updates: Partial<AppSettings>) => void - 設定更新用関数
  - `onReset`: () => void - 設定リセット用関数

## 設計判断 (Design Decisions)

1.  **MUI Dialogの採用**:
    - モーダル実装の標準化とアクセシビリティ向上のため、MUIの `Dialog` コンポーネントを使用。
    - `backdropFilter` を用いてグラスモーフィズム効果を適用し、アプリ全体のデザインテーマと統一。

2.  **セクション分割**:
    - 設定項目が多いため、「音声入力」「カード管理」「表示」の3セクションに分割し、`Stack` と `Paper` で視覚的にグループ化。

3.  **インタラクティブな入力**:
    - 数値設定には `Slider` を採用し、直感的な調整を可能に。
    - フラグ設定には `Switch` を採用。

4.  **アイコン**:
    - `RotateCcw` の代わりに `@mui/icons-material/RestartAlt` を採用し、機能的な意味を明確化（エイリアス `RotateCcw` として使用）。

## 変遷 (History)

- [2026-02-08] **Feature Add**: フォントスタイル切り替え（手書き風/デジタル）機能を追加。
- [2026-02-08] MUI移行: Tailwind CSSベースからMUIコンポーネントへ完全移行。グラスモーフィズムデザインを `sx` prop で再実装。
- [2026-02-07] デザイン調整: グラスモーフィズム (Glassmorphism) デザインの適用。
- [2026-02-06] 初版作成
