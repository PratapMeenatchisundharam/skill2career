@echo off
setlocal
set "NODE_DIR=C:\Program Files\nodejs"
if not exist "%NODE_DIR%\npm.cmd" (
  echo Node.js not found in "%NODE_DIR%".
  echo Install Node.js LTS and restart this command window.
  exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0"
npm run dev
