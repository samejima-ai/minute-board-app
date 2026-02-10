# Context: frontend/components/StreamingTypography.tsx

## 目的 (Purpose)

音声認識中のテキストをリアルタイムで表示するコンポーネント。
従来の無機質なテキスト表示ではなく、言葉が「紡ぎ出される」ような視覚体験を提供する。

## 依存関係 (Dependencies)

- **External Libraries**: `framer-motion` (Animations)
- **Parent**: `app/page.tsx`

## データ構造 (Data Structures)

- **Props**:
  - `text`: string - 現在認識されているテキスト
  - `isValid`: boolean - 音声認識が有効か（またはブラウザが対応しているか）

## 設計判断 (Design Decisions)

- **Ephemeral UI**: テキストは入力中のみ表示され、確定後（カード化後）はフェードアウトして消える。これにより画面の「散らかり」を防ぐ。
- **Typography Focus**: 装飾を極力排し、フォント (`Zen Kurenaido`) の美しさを強調するデザイン。
- **Motion Design**: `AnimatePresence` を使用し、テキストの出現・消失に滑らかなアニメーションを適用。

## 変遷 (History)

- [2026-02-08] 新規作成: V2 UI刷新に伴い、`LiveTicker` の機能を代替・特化させる形で実装。
