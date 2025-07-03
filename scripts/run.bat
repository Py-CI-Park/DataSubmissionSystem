@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul
title Data Submission System - Server
color 0B
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
echo                           🚀 SERVER RUNNER 🚀                               
echo                                                                               
echo ===============================================================================
echo.
echo                    🚀 Starting Data Submission System...
echo.

cd /d "%~dp0"

:CHECK_ENVIRONMENT
echo [1/4] Environment Check...
if not exist "node_modules" (
    echo ❌ Please run "install.bat" first.
    echo.
    echo 🔧 Would you like to run install.bat now? ^(Y/N^)
    set /p install_now=Choice: 
    if /i "!install_now!"=="Y" (
        echo.
        echo 🔄 Running installation...
        call install.bat
        if !errorlevel! neq 0 (
            echo ❌ Installation failed
            pause
            exit /b 1
        )
        echo ✅ Installation completed successfully
        echo 🔄 Rechecking environment...
        goto CHECK_ENVIRONMENT
    ) else (
        echo ❌ Installation required
        pause
        exit /b 1
    )
)
echo ✅ Environment OK

echo [2/4] Port Check...
netstat -an | findstr ":5000.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 is already in use.
    echo 💡 Terminating existing server and starting new one.
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 3 /nobreak >nul
)
echo ✅ Port 5000 ready

echo [3/4] Dependencies Check...
if not exist "package.json" (
    echo ❌ package.json not found
    pause
    exit /b 1
)
echo ✅ Dependencies OK

echo [4/4] Starting Server...
echo.

cls
color 0E
echo.
echo ===============================================================================
echo                                                                               
echo                             🎉 SERVER STARTED! 🎉                            
echo                                                                               
echo                         📍 Access URL: http://localhost:5000                 
echo                                                                               
echo                           🌐 Click link to open browser:                     
echo                             http://localhost:5000                            
echo                                                                               
echo ===============================================================================
echo.
echo ===============================================================================
echo                                 📋 USER GUIDE                                
echo                                                                               
echo   🔐 Admin Login:                                                             
echo      • Click "Admin" button in top-right corner                              
echo      • Password: 0000                                                        
echo                                                                               
echo   🚀 Main Features:                                                           
echo      • Create and manage events                                               
echo      • Upload and submit files                                                
echo      • View submission dashboard                                              
echo      • Real-time statistics                                                  
echo                                                                               
echo   🛑 Stop Server: Press Ctrl+C in this window                                
echo                                                                               
echo ===============================================================================
echo.

REM Auto-open browser after 5 seconds for better startup time
echo 🔄 Browser will open automatically in 5 seconds...
timeout /t 5 /nobreak >nul
start "" "http://localhost:5000"

echo.
echo ⚡ Server is starting... Please wait a moment.
echo 📡 If browser doesn't open, manually visit: http://localhost:5000
echo.
echo ================================================================================
echo                             🖥️  SERVER CONSOLE LOG  🖥️
echo ================================================================================
echo.

npm run dev

echo.
echo ===============================================================================
echo                                 SERVER STOPPED                               
echo                                                                               
echo   🔄 To restart: run run.bat                                                 
echo   🔧 If problems occur: run install.bat                                      
echo                                                                               
echo ===============================================================================
echo.
echo Press any key to exit...
pause > nul 