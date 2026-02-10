# Context: ImmersiveCanvas Component

## 目的 (Purpose)

全画面表示で没入感のある情報空間を提供するキャンバスコンポーネント。
`Whiteboard` と類似しているが、より視覚的な演出（リンク線の描画など）や、プレゼンテーションモードとしての利用を想定している。

## 依存関係 (Dependencies)

### Imports

- **UIライブラリ**: `@mui/material` (Box, styled), `framer-motion`
- **物理演算**: `d3-force`
- **サブコンポーネント**: [SpeechCard](file:///c:/Users/Owner/CDD-Guideline/frontend/components/SpeechCard.tsx)
- **Context**: `useTheme` (MUI)

### Exports

- `ImmersiveCanvas` (export)

### Dependents

- [page.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/page.tsx)
- [Whiteboard.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/components/Whiteboard.tsx)

## データ構造 (Data Structures)

- **Props**:
  - `cards`: SpeechCardProps[] - カードデータ
- **State**:
  - `nodes`: SimulationNode[] - ノードデータ
  - `links`: SimulationLink[] - ノード間のリンクデータ

## 設計判断 (Design Decisions)

1.  **Framer MotionとMUIの併用**:
    - カードの出現アニメーションやドラッグ操作には `framer-motion` を使用し、滑らかな動きを実現。
    - コンテナレイアウトやSVG描画領域にはMUI `Box`, `styled` を使用。

2.  **リンク線の描画**:
    - `SVG` 要素を最背面に配置し、関連度の高いカード間を線で結ぶことで、情報のつながりを可視化。
    - 動的に変化するか確認。
    - `framer-motion` の `AnimatePresence` を使用し、カードの追加・削除時にスムーズなアニメーションを提供。
    - 各カードは `motion.div` でラップされ、物理演算の位置情報に基づき `animate` プロパティで移動する。

3.  **d3-forceによる自動配置**:
    - カードの類似度 (`Jaccard Index` 等) に基づいて引力を計算し、関連するカードが近くに集まるように配置。

4.  **レイアウト安定化 (Stability)**:
    - カード追加時に全カードが再配置されるのを防ぐため、シミュレーションインスタンスを `useRef` で保持し、データ更新のみを行う。
    - シミュレーション再開時の `alpha` 値を調整し、急激な動きを抑制する。

## 変遷 (History)

- [2026-02-08] レイアウト改善: シミュレーション再利用ロジックを追加。
- [2026-02-08] MUI移行: コンテナコンポーネントとして再定義され、`Box` を使用して全画面表示を実現。
- [2026-02-06] 初版作成
