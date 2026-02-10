# Context: frontend/app/page.tsx

## 目的 (Purpose)

アプリケーションのメインページ（Home）。
音声認識 (`useSpeechToText`)、UI表示 (`Whiteboard`, `LiveTicker`)、およびバックエンドAPIとの通信を統合・制御する。

## 依存関係 (Dependencies)

### Imports

- **Components**:
  - [ControlBar](file:///c:/Users/Owner/CDD-Guideline/frontend/components/ControlBar.tsx)
  - [ImmersiveCanvas](file:///c:/Users/Owner/CDD-Guideline/frontend/components/ImmersiveCanvas.tsx)
  - [SettingsModal](file:///c:/Users/Owner/CDD-Guideline/frontend/components/SettingsModal.tsx)
  - [StreamingTypography](file:///c:/Users/Owner/CDD-Guideline/frontend/components/StreamingTypography.tsx)
- **Hooks**:
  - `src/hooks/useSpeechToText`
  - `src/hooks/useSettings`
  - `src/hooks/useScenarioSequence`
- **Context**:
  - [providers.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/providers.tsx) (`ThemeContext`)

### Exports

- `Home` (default export) - メインページコンポーネント

### Dependents

- (None - Root Page)

## データ構造 (Data Structures)

- **State**:
  - `cards` (List[SpeechCardProps]): 画面上に表示されるカード（メモ、決定事項など）のリスト。
  - `scenarioIndex` (number): テストシナリオの進行状況を管理するインデックス。
  - `apiStatus` ("IDLE" | "LOADING" | "SUCCESS" | "ERROR"): 直近のAPIリクエストのステータス。
  - `rawResponse` (string | null): デバッグおよび検証用に表示するバックエンドからの生JSONレスポンス。

- **Event Handlers**:
  - `handleFlush(text)`: 音声認識結果が確定した際に呼び出され、バックエンドに送信・レスポンス処理を行う。
  - **Data Mapping**: APIレスポンス (`summary`, `importance`, `keywords`) を `SpeechCardProps` にマッピングする。`summary` が提供されない場合は `content` の先頭30文字をフォールバックとして使用。
  - `playNextScenario()`: シナリオの次の行を送信し、インデックスを進める。
  - `resetScenario()`: シナリオとカードの状態を初期化する。

## 設計判断 (Design Decisions)

- **Client Component**: `useSpeechToText` や `useState` を使用するため、`"use client"` ディレクティブが必要。
- **Debug Features**:
  - **Scenario Player**: 開発環境 (`NODE_ENV === 'development'`) 限定で、画面右下にシナリオ再生パネルを表示。定義済みの一連の会話データを順次送信することで、バックエンドの挙動テストを効率化する。
  - マイク入力なしでも、`handleFlush` を直接呼び出すことで擬似的な音声入力をシミュレート。
- **Type Mapping**:
  - バックエンドからの `type` 文字列 ("PROPOSAL"等) をフロントエンドの `CardType` にキャスト。
  - 未知のタイプは "INFO" にフォールバックして安全性を確保。
- **Client Component**: `useSpeechToText` や `useState` を使用するため、`"use client"` ディレクティブが必要。
- **Debug Features**:
  - **Scenario Player**: 開発環境 (`NODE_ENV === 'development'`) 限定で、画面右下にシナリオ再生パネルを表示。定義済みの一連の会話データを順次送信することで、バックエンドの挙動テストを効率化する。
  - マイク入力なしでも、`handleFlush` を直接呼び出すことで擬似的な音声入力をシミュレート。
- **Type Mapping**:
  - バックエンドからの `type` 文字列 ("PROPOSAL"等) をフロントエンドの `CardType` にキャスト。
  - 未知のタイプは "INFO" にフォールバックして安全性を確保。
- **Unidirectional Data Flow**: 音声入力 -> テキスト化 -> API送信 -> コマンド受信 -> State更新 -> UI描画 という単方向フローを維持。
- **Deduplication**: `handleFlush` またはシナリオ再生時に、既存のカードと完全に一致するコンテンツ（`detail`, `type`, `summary`）が含まれる場合は追加をスキップし、重複表示を防止する。
- **Layout Structure**:
  - ルートに `<main>` コンテナを導入し、`max-w` 制約と `mx-auto` で中央寄せを行う。
  - `ImmersiveCanvas` と `ControlBar` はこのコンテナ内での `absolute` 配置とし、コンテナサイズに追従させる。

## 変遷 (History)

- [2026-02-08] **テーマ切り替え修正**: ローカル `theme` state と関連 `useEffect` を削除。テーマ切り替えは `providers.tsx` の `ThemeContext` に一元化し、`ControlBar` が直接 Context を参照する形に変更。
- [2026-02-08] **レイアウト調整**: Scenario Player を `bottom-20` に移動し、フッター上部に配置。UI Overlay の padding を `pb-24` に変更し、フッターとの重複を回避。
- [2026-02-08] **UI刷新 (V2)**: `LiveTicker` を `ControlBar` + `StreamingTypography` に分割・置換。レイアウトを `ImmersiveCanvas` (via `Whiteboard`) 中心に変更。
- [2026-02-07] シナリオテスト機能 (Scenario Player) の強化。APIステータス表示を追加。
- [2026-02-07] シナリオテスト機能 (Scenario Player) の実装。
- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
