@echo off
chcp 65001 > nul
title Data Submission System - Installation
color 0A
cls

echo.
echo ===============================================================================
echo                                                                               
echo     ██████╗  █████╗ ████████╗ █████╗     ███████╗██╗   ██╗██████╗ ███╗   ███╗██╗████████╗
echo     ██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗    ██╔════╝██║   ██║██╔══██╗████╗ ████║██║╚══██╔══╝
echo     ██║  ██║███████║   ██║   ███████║    ███████╗██║   ██║██████╔╝██╔████╔██║██║   ██║   
echo     ██║  ██║██╔══██║   ██║   ██╔══██║    ╚════██║██║   ██║██╔══██╗██║╚██╔╝██║██║   ██║   
echo     ██████╔╝██║  ██║   ██║   ██║  ██║    ███████║╚██████╔╝██████╔╝██║ ╚═╝ ██║██║   ██║   
echo     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝   ╚═╝   
echo                                                                               
echo         ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗                
echo         ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║                
echo         ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║                
echo         ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║                
echo         ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║                
echo         ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝                
echo                                                                               
echo                           🔧 INSTALLATION TOOL 🔧                           
echo                                                                               
echo ===============================================================================
echo.
echo                    🔧 Installing Data Submission System...
echo.

cd /d "%~dp0"

echo [1/3] Checking Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is required.
    echo 💡 Please download from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js detected

echo [2/3] Installing packages...
npm install
if %errorlevel% neq 0 (
    echo ❌ Installation failed
    pause
    exit /b 1
)
echo ✅ Installation completed

echo [3/3] Verifying installation...
if not exist "node_modules" (
    echo ❌ Installation verification failed
    pause
    exit /b 1
)
echo ✅ Installation verified

cls
color 0E
echo.
echo ===============================================================================
echo                                                                               
echo                             🎉 Installation Complete! 🎉                    
echo                                                                               
echo ===============================================================================
echo.
echo ✨ Data Submission System has been successfully installed!
echo.
echo 📋 How to use:
echo ┌─────────────────────────────────────────────────┐
echo │  1️⃣  Double-click run.bat                        │
echo │  2️⃣  Browser will open automatically             │
echo │  3️⃣  Access http://localhost:5000                │
echo │  4️⃣  Admin password: 0000                        │
echo └─────────────────────────────────────────────────┘
echo.
echo 🔧 Main features:
echo   • Event creation and management
echo   • File upload and submission
echo   • Submission dashboard
echo   • Admin statistics
echo.
echo 💡 Tips:
echo   • Stop server: Press Ctrl+C in run window
echo   • Restart: Run run.bat again
echo   • If problems occur: Run install.bat again
echo.
echo 🚀 Would you like to start now? (Y/N)
set /p start_now=Choice: 
if /i "%start_now%"=="Y" (
    echo.
    echo 🎯 Starting run.bat...
    timeout /t 2 /nobreak > nul
    call run.bat
) else (
    echo.
    echo 👍 Run "run.bat" when ready!
    echo.
    echo Press any key to exit...
    pause > nul
) 