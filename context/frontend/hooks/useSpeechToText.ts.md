# Context: frontend/hooks/useSpeechToText.ts

## 目的 (Purpose)

Web Speech API (`SpeechRecognition`) をReactで使用するためのカスタムフック。
音声の連続認識、テキスト化、およびバックエンド送信のタイミング制御（バッファリング）を担当する。

## 依存関係 (Dependencies)

- **Web API**: `window.SpeechRecognition` (or `webkitSpeechRecognition`)

## データ構造 (Data Structures)

### State / Refs

- `transcript` (string): 暫定的な認識結果（画面表示用）
- `bufferRef` (string): 確定した認識結果を一時的に蓄積するバッファ
- `flushTimerRef` (Timeout): 発話停止を検知してバッファをフラッシュするためのタイマー

### Props

- `onFlush` (function): バッファがフラッシュされた（発話が区切られた）際に呼ばれるコールバック。ここでAPI送信を行う。

## 設計判断 (Design Decisions)

- **Continuous Listening**: `recognition.continuous = true` を設定し、途切れることなく認識を続ける。
- **Auto Reconnect**: `onend` イベントで自動的に `start()` を呼び出し、意図しない切断から復帰するロジック（`isExplicitStopRef` で制御）。
- **Debounce & Buffer**:
  - LLMへのリクエスト過多を防ぐため、確定したテキストをバッファリングする。
  - 「1500msの無音」または「バッファ文字数が100文字超過」のいずれかの条件で `onFlush` をトリガーする。これにより、文脈の切れ目での自然なAPI送信を実現している。

## 変遷 (History)

- [2026-02-07] CDD遵守のためのContextファイル作成（文脈復元）
