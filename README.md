# 家族スケジュール管理アプリ（v2）

田中家の長期休暇の「泊まる場所＋予定」を管理し、画像化して家族に共有するアプリ。
2026年にUI/UXとバグを根治するため Vite + React + TypeScript で全面再構築（v1の単一HTMLは `legacy/index.html` にバックアップ）。

## 主な特徴
- **縦長・転置テーブル**（日付=行／家族=列）でスマホ縦持ちでもそのまま読める。
- **塗る／書くモード切替**：塗る=タップで泊まる場所の色、書く=タップで予定文字（定番チップ・IME対応）。消しゴム/同色再タップで色消し。
- **期間ごとに自動保存**（localStorage）。リロードしても消えない。期間一覧から再選択・削除。
- **画像で共有/保存**：スマホは共有シート（Web Share）、PCはJPEG保存。タイトル・凡例を焼き込み。
- タイトル自動生成 例：`260810~0817_田中家 お盆予定`。
- 家族名・泊まる場所（名前/色/短縮字）・家族ラベル・定番予定は**アプリ内設定で編集可**。

## 開発
```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # dist/ を生成
npm run preview
```

## デプロイ（Netlify）
- git連携なら push で自動反映（`netlify.toml`：build=`npm run build` / publish=`dist`）。
- 非連携なら `npm run build` 後に `dist/` をNetlifyにドラッグ配備。

## 構成
```
src/
  components/  Grid, Cell, ModeBar, HolidaySelector, PeriodList, Legend, ExportView, Settings
  hooks/       useLocalStorage, useSettings, useScheduleStore
  lib/         dateUtils, holidays, title, exportImage
  types.ts, constants.ts, App.tsx, main.tsx, styles.css
legacy/index.html   # v1（旧・単一HTML）バックアップ
```

## データ（localStorage / v2スキーマ）
- `fsa:v2:periods` 期間メタ一覧（uuidキー）
- `fsa:v2:schedules` 期間ID→セル（`memberId:date` → {locationId?, text?}）
- `fsa:v2:active` 選択中の期間ID
- `fsa:v2:settings` 家族・場所・ラベル・定番予定
