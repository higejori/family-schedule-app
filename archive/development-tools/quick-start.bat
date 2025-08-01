@echo off
chcp 65001 > nul
cls

echo =====================================
echo   家族スケジュール管理アプリ - クイックスタート
echo =====================================
echo.

echo 🚀 最も簡単な起動方法を選択してください:
echo.
echo 1. 自動起動 (推奨) - サーバー起動+ブラウザ自動オープン
echo 2. サーバーのみ起動 - 手動でブラウザを開く
echo 3. 接続テスト - サーバー状態を確認
echo 4. トラブルシューティング - 問題解決
echo 5. 終了
echo.
set /p choice="選択してください (1-5): "

if "%choice%"=="1" goto auto_start
if "%choice%"=="2" goto server_only  
if "%choice%"=="3" goto test_connection
if "%choice%"=="4" goto troubleshoot
if "%choice%"=="5" goto exit
goto menu

:auto_start
echo.
echo 🎯 自動起動を開始します...
call start.bat
goto end

:server_only
echo.
echo 🖥️ サーバーのみを起動します...
cd /d "%~dp0family-schedule-app"
echo ✅ http://localhost:5173/ でアクセスしてください
npm run dev
goto end

:test_connection
echo.
echo 🔍 接続テストページを開きます...
start test-server.html
goto end

:troubleshoot
echo.
echo 🛠️ トラブルシューティングを実行します...
call troubleshoot.bat
goto end

:exit
echo.
echo 👋 終了します
exit /b 0

:end
echo.
echo 💡 ヒント: 
echo   - サーバーを停止するには Ctrl+C を押してください
echo   - 問題がある場合は troubleshoot.bat を実行してください
echo.
pause