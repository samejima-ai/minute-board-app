# Context: frontend/app/layout.tsx

## 目的 (Purpose)

Next.js アプリケーションのルートレイアウト。
全ページ共通のHTML構造、メタデータ設定、およびフォント（Google Fonts）の読み込みを担当する。

## 依存関係 (Dependencies)

- **External Libraries**: `next/font/google`, `react`
- **Internal Assets**: `globals.css`

## 設計判断 (Design Decisions)

- **Font Strategy**:
  - 英語/数字: `Inter`
  - 日本語: `Noto Sans JP`
  - **Handwriting**:
    - `Zen Kurenaido` (マーカー風)
    - `Yomogi` (チョーク風)
  - これらをCSS変数として定義し、Tailwindから参照可能にする。
- **Hydration Mismatch Prevention**: `html` タグに `suppressHydrationWarning` を付与（ブラウザ拡張機能等によるDOM変更対策）。

## 変遷 (History)

- [2026-02-07] Hydration Error修正（`html` タグ直下の不要なテキストノード削除）。
- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
- [2026-02-08] **Font Update**: V2 UI用に `Zen Kurenaido` と `Yomogi` を追加導入し、テーマごとのフォント使い分けを実現。
