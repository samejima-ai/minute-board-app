# Minute Board App (議事録ボードアプリ)

音声メモと連動したデジタルホワイトボードアプリケーションです。
Next.js (Frontend) と Python (Backend) で構成されています。

## ディレクトリ構成

- `frontend/`: Next.js + React によるフロントエンドアプリケーション
- `backend/`: Python によるバックエンド API サーバー
- `context/`: CDD (Context-Driven Development) に基づく設計・仕様ドキュメント

## セットアップ手順

### フロントエンド (frontend)

```bash
cd frontend
npm install
npm run dev
```

### バックエンド (backend)

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

## 技術スタック

- **Frontend**: Next.js, React, Tailwind CSS, TypeScript
- **Backend**: Python, FastAPI (想定), Gemini API
- **Design**: "Executive Secretary" Theme, Digital Whiteboard UI
