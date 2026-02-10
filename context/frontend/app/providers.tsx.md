# Context: frontend/app/providers.tsx

## 目的 (Purpose)

アプリケーション全体にコンテキストプロバイダーを提供するラッパーコンポーネント。
MUIの `ThemeProvider`、スタイルリセット (`CssBaseline`)、およびアプリケーション独自の `ThemeContext` を管理する。

## 依存関係 (Dependencies)

### Imports

- **MUI**: `@mui/material`, `@mui/material-nextjs`
- **Internal**: `src/theme.ts` (`getAppTheme`)

### Exports

- `Providers` (default export)
- `ThemeContext` (export)

### Dependents

- [layout.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/app/layout.tsx)
- [ControlBar.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/components/ControlBar.tsx)
- [SettingsModal.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/components/SettingsModal.tsx)
- [ThemeToggle.tsx](file:///c:/Users/Owner/CDD-Guideline/frontend/components/ThemeToggle.tsx)

## 設計判断 (Design Decisions)

1.  **Client-Side Rendering**:
    - `"use client"` ディレクティブを使用し、クライアントコンポーネントとして動作。
    - `useState`, `useEffect` を用いて、サーバーサイドレンダリング (SSR) とクライアントサイドのハイドレーション不一致を防ぐ（マウント後にレンダリング）。

2.  **Theme Context**:
    - `mode` (light/dark) に加えて、`fontMode` (handwriting/digital) の状態を管理。
    - `toggleTheme` と `toggleFontMode` 関数を公開し、設定画面やトグルボタンから状態を変更可能にする。
    - ユーザーの選択は `localStorage` に保存し、次回訪問時に復元する（実装予定/一部実装済み）。

3.  **AppRouter Integration**:
    - `AppRouterCacheProvider` を使用して、Next.js App Router と MUI のスタイルエンジン (Emotion) を統合。

4.  **Single Source of Truth**:
    - テーマ状態 (`mode`, `fontMode`) は本コンポーネントの `ThemeContext` に一元化。各ページやコンポーネント（`page.tsx`, `ControlBar` 等）で個別に状態を持たず、常にここから状態を参照・更新する。

## 変遷 (History)

- [2026-02-08] **Font Context**: `ThemeContext` に `fontMode` と `toggleFontMode` を追加。
- [2026-02-07] 初期実装: MUIプロバイダーとダークモード管理の実装。
