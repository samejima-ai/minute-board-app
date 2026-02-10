# Context: frontend/app/globals.css

## 目的 (Purpose)

アプリケーション全体のグローバルスタイル定義。
Tailwind CSS v4 の設定（`@import`, `@source`）および、デザインシステムの中核となるCSS変数（カラーパレット、フォント）を定義する。

## 依存関係 (Dependencies)

- **External**: Tailwind CSS
- **Internal**: `frontend/components` (for `@source` scanning)

## データ構造 (Data Structures)

### CSS Variables (Theming)

- **Colors**:
  - `--background`: #f8f9fa (Soft Off-White) - 書類のような質感
  - `--primary`: #1e293b (Navy Blue-Grey) - 知的な印象
  - `--accent`: #d97706 (Amber/Gold) - 重要なハイライト

### Utilities

- `.bg-dot-pattern`: 背景に微細なドットパターンを描画し、デジタルホワイトボード感を演出するカスタムユーティリティ。

## 設計判断 (Design Decisions)

- **Theme Consistency**: "Executive Secretary" テーマを表現するため、落ち着いた色調と高級感のあるフォント設定（Inter + Noto Sans JP）を採用。
- **Tailwind v4 Config**: `globals.css` 内で `@source "../components"` を指定し、外部コンポーネントディレクトリのクラススキャンを有効化（v4固有の設定）。
- **Unified Theme Strategy**: ダークモード (`.dark`) とライトモードで共通のHTML構造を維持し、CSS変数のみを切り替えることで実装コストを削減。アセットもCSSフィルタで反転利用する方針。
- **Responsive Container Strategy**:
  - `body` はアプリの背景（壁紙）として機能させる。
  - コンテンツは `max-w-screen-2xl` 等の制約を持つ中央寄せコンテナ内に配置し、超ワイド画面での拡散を防ぐ。
  - モバイルでは `w-full` で全画面表示を維持。

## 変遷 (History)

- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
- [2026-02-08] **Theme Update**: 黒板（Dark）/ホワイトボード（Light）テーマ用の変数を追加・整理。手書きフォント用の定義を追加。
