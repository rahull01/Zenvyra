@echo off
cd /d "C:\Users\Pradeep Singh\Desktop\Zenvyra\frontend"
node node_modules\typescript\bin\tsc --noEmit > tsc-out.txt 2>&1
echo EXIT=%ERRORLEVEL%
