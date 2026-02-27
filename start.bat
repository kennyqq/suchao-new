@echo off
chcp 65001 >nul
title suchao-app 全栈启动工具
cls

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                                                              ║
echo  ║           suchao-app 全栈启动工具                             ║
echo  ║           Frontend + BFF (Backend for Frontend)              ║
echo  ║                                                              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: 设置颜色
set "GREEN=[92m"
set "YELLOW=[93m"
set "CYAN=[96m"
set "RED=[91m"
set "RESET=[0m"

:: 检查 Node.js 是否安装
echo %CYAN%[检查环境]%RESET% 检查 Node.js 安装...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[错误]%RESET% Node.js 未安装，请先安装 Node.js (>= 18.0.0)
    pause
    exit /b 1
)
echo %GREEN%[OK]%RESET% Node.js 版本: 
node --version

:: 检查 npm 是否安装
echo.
echo %CYAN%[检查环境]%RESET% 检查 npm 安装...
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[错误]%RESET% npm 未安装
    pause
    exit /b 1
)
echo %GREEN%[OK]%RESET% npm 版本: 
npm --version

:: 检查依赖是否安装
if not exist "node_modules" (
    echo.
    echo %YELLOW%[警告]%RESET% 未找到 node_modules，正在安装依赖...
    echo 这可能需要几分钟时间，请耐心等待...
    echo.
    call npm install
    if errorlevel 1 (
        echo %RED%[错误]%RESET% 依赖安装失败
        pause
        exit /b 1
    )
    echo %GREEN%[OK]%RESET% 依赖安装完成
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo %CYAN%[启动模式选择]%RESET%
echo.
echo   [1] 同时启动前后端 (推荐)
echo       - BFF 后端服务: http://localhost:3001
echo       - 前端开发服务: http://localhost:3000

echo.
echo   [2] 仅启动 BFF 后端

echo       - 后端 API 服务: http://localhost:3001

echo.
echo   [3] 仅启动前端开发服务

echo       - 前端开发服务: http://localhost:3000

echo.
echo   [Q] 退出

echo.
echo ════════════════════════════════════════════════════════════════
echo.

set /p choice="请选择启动模式 [1/2/3/Q]: "

if "%choice%"=="1" goto start_fullstack
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if /i "%choice%"=="Q" goto exit_script
echo %RED%[错误]%RESET% 无效的选择
pause
exit /b 1

:: ============================================
:: 启动前后端（并发模式）
:: ============================================
:start_fullstack
echo.
echo %CYAN%[启动]%RESET% 正在启动全栈服务...
echo.
echo %YELLOW%提示: 按 Ctrl+C 两次可停止所有服务，或直接关闭窗口%RESET%
echo.

:: 使用 start 命令在新的窗口中启动服务
echo %GREEN%[1/2]%RESET% 启动 BFF 后端服务 (端口: 3001)...
start "suchao-app BFF Server - 3001" cmd /k "cd /d "%~dp0" && node server/index.cjs"

:: 等待后端启动
timeout /t 2 /nobreak >nul

echo %GREEN%[2/2]%RESET% 启动前端开发服务 (端口: 3000)...
start "suchao-app Frontend - 3000" cmd /k "cd /d "%~dp0" && npm run dev:frontend"

echo.
echo ════════════════════════════════════════════════════════════════
echo %GREEN%所有服务已启动!%RESET%
echo.
echo 访问地址:
echo   - 前端页面: %CYAN%http://localhost:3000%RESET%
echo   - 后端 API: %CYAN%http://localhost:3001%RESET%
echo   - 健康检查: %CYAN%http://localhost:3001/api/health%RESET%
echo.
echo %YELLOW%注意: 关闭此窗口不会停止已启动的服务%RESET%
echo       请手动关闭对应的命令行窗口

echo.
echo 按任意键退出此窗口...
pause >nul
exit /b 0

:: ============================================
:: 仅启动后端
:: ============================================
:start_backend
echo.
echo %CYAN%[启动]%RESET% 正在启动 BFF 后端服务...
echo.

echo %GREEN%启动中...%RESET% 后端服务将在端口 3001 运行
node server/index.cjs

if errorlevel 1 (
    echo.
    echo %RED%[错误]%RESET% 后端服务启动失败
    pause
    exit /b 1
)
exit /b 0

:: ============================================
:: 仅启动前端
:: ============================================
:start_frontend
echo.
echo %CYAN%[启动]%RESET% 正在启动前端开发服务...
echo.

echo %GREEN%启动中...%RESET% 前端服务将在端口 3000 运行
npm run dev:frontend

if errorlevel 1 (
    echo.
    echo %RED%[错误]%RESET% 前端服务启动失败
    pause
    exit /b 1
)
exit /b 0

:: ============================================
:: 退出脚本
:: ============================================
:exit_script
echo.
echo 已取消启动
pause
exit /b 0
