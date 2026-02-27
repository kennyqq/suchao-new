@echo off
chcp 65001 >nul
title suchao-app 服务停止工具
echo.
echo 正在停止 suchao-app 服务...
echo.

:: 停止 Node.js 进程（后端）
echo [1/2] 停止 BFF 后端服务...
taskkill /FI "WINDOWTITLE eq suchao-backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq suchao-app BFF Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *server/index.js*" /F >nul 2>&1

:: 停止 Vite 进程（前端）
echo [2/2] 停止前端开发服务...
taskkill /FI "WINDOWTITLE eq suchao-frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq suchao-app Frontend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *vite*" /F >nul 2>&1

:: 备用：按端口停止
netstat -ano | findstr ":3001" >nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)
netstat -ano | findstr ":3000" >nul && (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo ✓ 所有服务已停止
echo.
pause
