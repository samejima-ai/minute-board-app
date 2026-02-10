# test_api.py Context

## 目的

Backend API (`POST /api/organize`) の動作検証。

## 概要

`requests` ライブラリを使用してローカルのFastAPIサーバーに対してリクエストを送信し、構造化機能が正常に動作するかを簡易テストするスクリプト。

## 処理フロー

1.  **Setup**:
    - URL: `http://localhost:8000/api/organize`
    - Payload: サンプルのテキストとテーマリスト
2.  **Request**: `POST` リクエストを送信。
3.  **Validation**:
    - Status Code が 200 であること。
    - Response JSON に `commands` キーが含まれていること。
4.  **Output**: 結果をコンソールに出力。

## 依存関係

- `requests`
- `json`
- `time`
