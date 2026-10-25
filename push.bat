@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo       ScholaRise Poster Studio - Auto Push to GitHub
echo ========================================================
echo.

set "GIT_CMD=C:\Users\Navirex\AppData\Local\Programs\Git\cmd\git.exe"

REM Check if remote origin is configured
"%GIT_CMD%" remote get-url origin >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] No GitHub remote repository linked yet.
    echo.
    set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/repo.git): "
    if not defined REPO_URL (
        echo Error: No URL provided. Exiting.
        pause
        exit /b 1
    )
    "%GIT_CMD%" remote add origin !REPO_URL!
    echo [OK] Remote repository set to !REPO_URL!
    echo.
)

echo [1/3] Checking for changes...
"%GIT_CMD%" add .

REM Check if there is anything to commit
"%GIT_CMD%" diff-index --quiet HEAD --
if %ERRORLEVEL% equ 0 (
    echo [INFO] No local file changes to commit.
) else (
    echo [2/3] Committing changes...
    "%GIT_CMD%" commit -m "Auto-update: %DATE% %TIME%"
)

echo [3/3] Pushing to GitHub (branch: main)...
"%GIT_CMD%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo  SUCCESS! Changes successfully pushed to GitHub.
    echo ========================================================
) else (
    echo.
    echo [!] Push encountered an issue. Please verify your repository URL
    echo     and GitHub authentication credentials.
)

echo.
pause
