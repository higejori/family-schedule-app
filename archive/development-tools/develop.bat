@echo off
chcp 65001 > nul
cls

echo =====================================
echo   家族スケジュール管理アプリ - 開発モード
echo =====================================
echo.

cd /d "%~dp0family-schedule-app"

:menu
echo 📋 開発メニュー:
echo.
echo 1. 開発サーバー起動
echo 2. ビルド実行
echo 3. プレビュー（ビルド後）
echo 4. 依存関係の再インストール
echo 5. プロジェクト構造表示
echo 9. 終了
echo.
set /p choice="選択してください (1-5, 9): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto build
if "%choice%"=="3" goto preview
if "%choice%"=="4" goto reinstall
if "%choice%"=="5" goto structure
if "%choice%"=="9" goto exit

echo 無効な選択です。
echo.
goto menu

:dev
echo.
echo 🌐 開発サーバーを起動しています...
start http://localhost:5173/
call npm run dev
goto menu

:build
echo.
echo 🔨 ビルドを実行しています...
call npm run build
if %errorlevel% equ 0 (
    echo ✓ ビルドが完了しました
) else (
    echo ❌ ビルドに失敗しました
)
echo.
pause
goto menu

:preview
echo.
echo 👁️ プレビューを起動しています...
start http://localhost:4173/
call npm run preview
goto menu

:reinstall
echo.
echo 🗑️ node_modulesを削除しています...
if exist node_modules rmdir /s /q node_modules
echo 📦 依存関係を再インストールしています...
call npm install
echo ✓ 再インストールが完了しました
echo.
pause
goto menu

:structure
echo.
echo 📁 プロジェクト構造:
tree /f /a
echo.
pause
goto menu

:exit
echo.
echo 👋 開発環境を終了します
exit /b 0