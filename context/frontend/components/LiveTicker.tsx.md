# Context: LiveTicker Component

## 目的 (Purpose)

リアルタイムの音声認識結果を画面下部にストリーミング表示するティッカーコンポーネント。
ユーザーが話している内容を即座にフィードバックし、認識状態（録音中、処理中、待機中）を視覚的に伝える。

## 依存関係 (Dependencies)

- **UIライブラリ**: `@mui/material` (Paper, Box, Typography, IconButton)
- **アイコン**: `lucide-react` (Mic, MicOff, WifiOff)
- **アニメーション**: `@mui/material/styles` (keyframes)

## データ構造 (Data Structures)

- **Props**:
  - `isListening`: boolean - 音声認識中かどうか
  - `transcript`: string - 現在の認識テキスト
  - `isSupported`: boolean - ブラウザサポート状況
  - `onToggle`: () => void - マイク切り替えコールバック

## 設計判断 (Design Decisions)

1.  **MUI Paperによる浮遊感**:
    - `Paper` コンポーネントを使用し、影 (`elevation`) と角丸 (`borderRadius`) を適用して、画面上に浮いているようなデザインを実現。
    - `sx` プロパティでパルスアニメーション (`pulseRing`) やステータスインジケータ (`statusPulse`) を定義。

2.  **ステータス表示**:
    - マイクアイコンの状態変化（色、アニメーション）で録音状態を表現。
    - 認識テキストがない場合はガイドメッセージを表示。

3.  **レスポンシブ**:
    - 画面幅に応じて最大幅 (`maxWidth`) を調整し、モバイルでも視認性を確保。

## 変遷 (History)

- [2026-02-08] MUI移行: `Paper` コンポーネントベースに再実装。Tailwind CSSクラスを `sx` スタイリングに置き換え、アニメーションもMUIシステム内で定義。
- [2026-02-07] デザイン調整: 浮遊型カプセルデザイン (Floating Capsule) の採用。
- [2026-02-06] 初版作成
