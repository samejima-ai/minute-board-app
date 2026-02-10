# Context: useSettings Hook

## 概要

アプリケーション全体の設定値を管理し、`localStorage` に永続化するためのカスタムフック。

## 目的

ユーザーがカスタマイズ可能な設定項目（音声認識パラメータ、表示設定、カード管理設定）を一元管理し、アプリケーションの再起動後も設定を維持する。

## 要件

1.  **設定項目**:
    - **音声認識**:
      - `language`: 言語設定 (デフォルト: "ja-JP")
      - `silenceDuration`: 無言判定時間 (ms) (デフォルト: 3000)
      - `autoSubmitThreshold`: 自動送信文字数 (デフォルト: 100)
    - **カード管理**:
      - `maxCardCount`: 最大表示枚数 (デフォルト: 50)
      - `enableDeduplication`: 重複排除有効化 (デフォルト: true)
    - **レイアウト**:
      - `layoutStrength`: 物理演算強度 (0.1 ~ 2.0, デフォルト: 1.0)
      - `fontSizeScale`: フォントサイズ倍率 (0.8 ~ 1.5, デフォルト: 1.0)
2.  **永続化**:
    - `localStorage` キー: `app-settings`
    - 初期ロード時に保存値を読み込み、なければデフォルト値を使用。
3.  **インターフェース**:
    - `settings`: 現在の設定オブジェクト
    - `updateSettings`: 設定の一部を更新する関数
    - `resetSettings`: デフォルトに戻す関数

## 関連ファイル

- `src/frontend/hooks/useSettings.ts` (実装ファイル)
