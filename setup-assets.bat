@echo off
chcp 65001 > nul
echo ========================================================
echo   حلواني فيستيفال ^| Festival Pastry - تجهيز صور الموقع
echo ========================================================
echo.

set "DEST_DIR=%~dp0assets"
if not exist "%DEST_DIR%" (
    mkdir "%DEST_DIR%"
    echo [✓] تم إنشاء مجلد assets
)

set "SRC_DIR=C:\Users\dell\.gemini\antigravity\brain\6d040525-ce79-4c46-b9f7-adc0b348a60f\.user_uploaded"

if exist "%SRC_DIR%\media_1791109995300.jpg" (
    copy /Y "%SRC_DIR%\media_1791109995300.jpg" "%DEST_DIR%\festival-logo.jpg" > nul
    echo [✓] تم نسخ لوجو فيستيفال الرسمي (festival-logo.jpg)
)

if exist "%SRC_DIR%\media_1791109995309.jpg" (
    copy /Y "%SRC_DIR%\media_1791109995309.jpg" "%DEST_DIR%\hero-tortes.jpg" > nul
    echo [✓] تم نسخ تشكيلة التورت المتنوعة (hero-tortes.jpg)
)

if exist "%SRC_DIR%\media_1791110023828.jpg" (
    copy /Y "%SRC_DIR%\media_1791110023828.jpg" "%DEST_DIR%\oriental-platter.jpg" > nul
    echo [✓] تم نسخ صينية الحلويات الشرقية الملكية (oriental-platter.jpg)
)

if exist "%SRC_DIR%\media_1791109995292.jpg" (
    copy /Y "%SRC_DIR%\media_1791109995292.jpg" "%DEST_DIR%\festival-box-ad.jpg" > nul
    echo [✓] تم نسخ بوكس التشكيلة الفاخرة (festival-box-ad.jpg)
)

echo.
echo ========================================================
echo   تم تجهيز جميع الصور بنجاح!
echo   يمكنك الآن فتح index.html في أي متصفح.
echo ========================================================
pause
