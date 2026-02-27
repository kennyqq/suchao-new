@echo off
chcp 65001 >nul
title suchao-app 一键启动
echo.
echo 正在启动 suchao-app 全栈服务...
echo.

:: 检查依赖
if not exist "node_modules" (
    echo 首次启动，正在安装依赖...
    call npm install
)

:: 启动后端
echo [1/2] 启动 BFF 后端 (localhost:3001)...
start "suchao-backend" cmd /k "node server/index.cjs"

:: 等待2秒
timeout /t 2 /nobreak >nul

:: 启动前端
echo [2/2] 启动前端服务 (localhost:3000)...
start "suchao-frontend" cmd /k "npm run dev:frontend"

echo.
echo ✓ 服务已启动！
echo   前端: http://localhost:3000
echo   后端: http://localhost:3001
echo.
echo 按任意键关闭此窗口（服务继续在后台运行）
pause >nul
