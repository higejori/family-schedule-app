@echo off
chcp 65001 > nul
cls

echo =====================================
echo   家族スケジュール管理アプリ
echo =====================================
echo.

:: Node.jsがインストールされているかチェック
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.jsがインストールされていません
    echo.
    echo 📥 Node.jsをインストールしてください:
    echo    https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo 🚀 アプリケーションを起動しています...
echo.

cd /d "%~dp0family-schedule-app"

if %errorlevel% neq 0 (
    echo ❌ プロジェクトディレクトリが見つかりません
    echo    %~dp0family-schedule-app
    pause
    exit /b 1
)

echo ✓ プロジェクトディレクトリに移動しました
echo.

if not exist node_modules (
    echo 📦 依存関係をインストールしています...
    echo    初回起動時のみ時間がかかります
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 依存関係のインストールに失敗しました
        echo    インターネット接続を確認してください
        pause
        exit /b 1
    )
    echo.
    echo ✓ 依存関係のインストールが完了しました
    echo.
)

echo 🌐 開発サーバーを起動中...
echo.
echo ┌─────────────────────────────────────┐
echo │  http://localhost:5173/ でアクセス  │
echo │  終了するにはこのウィンドウを閉じる │
echo └─────────────────────────────────────┘
echo.

:: 5秒後にブラウザを開く
timeout /t 5 /nobreak > nul
start http://localhost:5173/

:: 開発サーバー起動
npm run dev-open