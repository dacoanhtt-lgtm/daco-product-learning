@echo off
chcp 65001 > nul
echo ========================================================
echo   DONG BO DU LIEU EXCEL SANG WEB PORTAL (1-CLICK)
echo ========================================================
echo.
echo Dang doc du lieu tu file Excel...
python sync_data.py
echo.
echo ========================================================
echo   HOAN TAT! HAY MO FILE INDEX.HTML DE XEM KET QUA
echo ========================================================
pause
