# V2 UI Renovation & Intelligent Canvas Specification

## 1. Overview

本仕様書は、Voice Memo AppのV2 UI刷新に関する要件と設計を定義する。
従来の「リスト形式・ヘッダー配置」のUIから、「没入型キャンバス・ボトムコントロール」へのパラダイムシフトを行う。

## 2. Core Concepts

1.  **Bottom-Centric Control**: 全ての操作系とステータス表示を画面下部中央に集約し、視線移動を最小限にする。
2.  **Streaming Typography**: 音声認識結果は装飾的なUIではなく、流れるようなタイポグラフィとして表示する。
3.  **Spatial Organization**: カードをグリッドではなく、意味的な距離に応じた空間配置（Spatial Layout）で表示する。

## 3. UI Layout Specification

### 3.1 Global Structure

- **Screen**: 全画面をキャンバス(`Whiteboard`)として使用。ヘッダー（上部バー）は廃止。
- **Control Bar**: 画面下部（bottom-8）にツールバー風に配置。
  - 参照画像に基づき、枠線で囲まれたボタンスタイルを採用。
  - 中央: マイクボタン（録音/停止）
  - 右側: テーマ切り替え（Sun/Moon）
  - アイコンの下に手書き風フォントでラベル（例: "Mic", "Theme"）を配置する。
  - ストリーミングテキスト表示エリア（Control Bar直上）

### 3.2 Streaming View

- **Placement**: Control Barの直上に配置。
- **Appearance**: 背景なし、文字のみ。フェードイン・フェードアウトのアニメーション。
- **Behavior**: 認識中のテキストをリアルタイム表示し、確定（Silence/Flush）と共に「カード化プロセス」へ移行する（吸い込まれるようなエフェクト推奨）。

### 3.3 Intelligent Card Canvas

- **Layout Logic**:
  - D3.js (`d3-force`) を使用した物理演算レイアウト。
  - 初期出現位置: 画面中央またはランダム。
  - **Gravity (引力)**:
    - 画面中央への弱い引力（画面外への逸脱防止）。
    - 同じ `type` (PROPOSAL, ISSUE, etc.) を持つカード間の引力。
  - **Collision (衝突)**: カード同士が重ならないような反発力。
- **Card Design**:
  - **Sticky Note Style**: 参照画像のように、正方形に近い形状で、手書き風の枠線とドロップシャドウを持つ。
  - **Tilt**: わずかにランダムな傾きを与え、アナログ感を出す。
  - **Content**: 手書き風フォントを使用。
  - ドラッグ＆ドロップによる手動位置調整を可能にする（将来拡張優先度は中）。

## 4. Data Flow & Interaction

1.  **Input Phase**:
    - User speaks -> `useSpeechToText` captures audio.
    - UI shows streaming text above Control Bar.
2.  **Processing Phase**:
    - Silence detected -> `handleFlush` triggered.
    - UI shows "Thinking..." indicator (e.g., pulsing glow on Control Bar).
    - Text streams text "flies" into the center/processor.
3.  **Materialization Phase**:
    - API returns structured commands.
    - New cards spawn on the canvas.
    - D3 force simulation adjusts layout dynamically.

## 5. Implementation Strategy

### 5.1 Technology Stack

- **Framework**: Next.js (Existing)
- **Styling**: Tailwind CSS (Existing)
- **Physics Engine**: `d3-force` (New dependency)
- **Animation**: `framer-motion` (Recommended for transitions)

### 5.2 Component Hierarchy - Current vs New

**Current:**

- Whiteboard (Grid) -> Header (Fixed) -> LiveTicker (Fixed)

**New:**

- ImmersiveCanvas (Absolute) -> FloatingCard[mapped force-layout items]
- SpatialController (Overlay) -> ControlBar (New Component) -> StreamingTypography (New Component)

## 6. Asset & Iconography Strategy (New)

- **Concept**: 参照画像のような「完全なモノトーン手書きスケッチ」。
- **Themes**:
  - **Whiteboard (Light)**: 白地に黒の鉛筆/マーカーライン。
  - **Blackboard (Dark)**: 黒板色（深緑またはダークグレー）に白のチョークライン。
- **Typography (New)**:
  - 日本語の手書き風フォント（Google Fonts: `Zen Kurenaido` または `Yomogi`）を導入し、UI全体（カード、ラベル、ストリーミングテキスト）に適用する。
- **Required Assets**:
  - `icon_mic_on`: 録音中（手書きスケッチ）
  - `icon_mic_off`: 待機中（手書きスケッチ）
  - `icon_theme_sun`: 太陽のスケッチ
  - `icon_theme_moon`: 月のスケッチ
  - `bg_texture`: 紙の質感（Light） / 黒板の質感（Dark）
  - `ui_panel_bg`: ツールバーの背景（手書き風の枠線）

## 7. Future Data Requirements (Backend API)

- 現在のAPIは `type` と `content` のみを返すが、空間配置の精度向上のため、以下を将来的に追加検討：
  - `related_card_ids`: 関連する既存カードのID。
  - `importance`: 0.0-1.0の重要度（ノードサイズに反映）。
