@echo off
echo ==========================================
echo    AVVIO SERVER LOCALE - DI ROM
echo ==========================================
echo.
echo Il sito sara' disponibile all'indirizzo:
echo http://localhost:8080
echo.
echo Per fermare il server, premi CTRL+C or chiudi questa finestra.
echo.
python -m http.server 8080
pause
