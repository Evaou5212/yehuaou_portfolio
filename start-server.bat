@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   正在启动 Vite 开发服务器（含 Shader）
echo ========================================
echo.

if not exist "node_modules" (
    echo 首次运行需要安装依赖，请稍候...
    call npm install
    echo.
)

echo 启动后，在浏览器打开:  http://localhost:8080
echo.
echo 关闭此窗口即可停止服务器。
echo ========================================
echo.

npm run serve

pause
