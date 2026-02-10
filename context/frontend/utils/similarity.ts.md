# Context: Similarity Utility

## 概要

2つのキーワード配列間の類似度を計算するユーティリティ関数。

## 目的

カード間の関連性を定量化し、物理演算レイアウトにおける「引力（Link Force）」の強さを決定するために使用する。

## 実装内容

- `calculateJaccardIndex(a: string[], b: string[]): number`
  - 入力: 2つの文字列配列（キーワードリスト）
  - 出力: 0.0 〜 1.0 の数値（Jaccard係数）
  - ロジック: `(A ∩ B) / (A ∪ B)`

## 関連ファイル

- `src/frontend/utils/similarity.ts` (実装ファイル)
