@echo off
setlocal enabledelayedexpansion

rem Set the environment variable to the desired value
set NEW_NODE_ENV=production

rem Specify the path to your .env file
set FILE_PATH=.env

rem Create a temporary file to store updated contents
set TEMP_FILE=%TEMP%\temp_env_file

rem Loop through each line in the .env file
for /f "tokens=*" %%a in (!FILE_PATH!) do (
  set line=%%a
  echo !line! | findstr /C:"NODE_ENV=" > nul
  if !errorlevel! equ 0 (
    echo NODE_ENV=!NEW_NODE_ENV!>> !TEMP_FILE!
  ) else (
    echo !line!>> !TEMP_FILE!
  )
)

rem Replace the original .env file with the updated contents
move /y !TEMP_FILE! !FILE_PATH!

rem Run your build or other commands here
npx electron-packager . Ringer --platform=win32 --arch=x64 --out=out --electron-version=22.2.0

endlocal
