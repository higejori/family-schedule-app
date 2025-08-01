@echo off
chcp 65001 > nul
cls

echo =====================================
echo   トラブルシューティング
echo =====================================
echo.

echo 🔍 システム環境をチェックしています...
echo.

:: Node.jsのチェック
echo [1/4] Node.js の確認
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js がインストールされています
    node --version
) else (
    echo ❌ Node.js がインストールされていません
    echo    ダウンロード: https://nodejs.org/
)
echo.

:: npmのチェック
echo [2/4] npm の確認
where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm が利用可能です
    npm --version
) else (
    echo ❌ npm が利用できません
)
echo.

:: プロジェクトディレクトリのチェック
echo [3/4] プロジェクトディレクトリの確認
if exist "%~dp0family-schedule-app" (
    echo ✓ プロジェクトディレクトリが存在します
    echo    場所: %~dp0family-schedule-app
) else (
    echo ❌ プロジェクトディレクトリが見つかりません
    echo    期待する場所: %~dp0family-schedule-app
)
echo.

:: 依存関係のチェック
echo [4/4] 依存関係の確認
cd /d "%~dp0family-schedule-app" 2>nul
if %errorlevel% equ 0 (
    if exist node_modules (
        echo ✓ 依存関係がインストール済みです
    ) else (
        echo ⚠️ 依存関係がインストールされていません
        echo    npm install を実行してください
    )
    
    if exist package.json (
        echo ✓ package.json が存在します
    ) else (
        echo ❌ package.json が見つかりません
    )
) else (
    echo ❌ プロジェクトディレクトリにアクセスできません
)
echo.

echo =====================================
echo   推奨される解決手順
echo =====================================
echo.
echo 1. Node.js をインストール (未インストールの場合)
echo    https://nodejs.org/ からダウンロード
echo.
echo 2. コマンドプロンプトで以下を実行:
echo    cd "%~dp0family-schedule-app"
echo    npm install
echo    npm run dev
echo.
echo 3. ブラウザで http://localhost:5173/ にアクセス
echo.
echo 4. ファイアウォールがブロックしている場合:
echo    Windows Defender で Node.js を許可
echo.
echo 5. ポート5173が使用中の場合:
echo    他のアプリケーションを終了するか
echo    npm run dev -- --port 3000 で別ポートを使用
echo.

echo =====================================
echo   手動起動方法
echo =====================================
echo.
echo コマンドプロンプトを開いて以下を実行:
echo.
echo cd /d "%~dp0family-schedule-app"
echo npm run dev
echo.

pause