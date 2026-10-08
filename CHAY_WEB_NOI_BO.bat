@echo off
chcp 65001 > nul
cls
echo ======================================================================
echo      DACO PORTAL - MÁY CHỦ TRA CỨU KỸ THUẬT NỘI BỘ (MẠNG LAN)
echo ======================================================================
echo.
echo [V] Đang khởi động Web Server phục vụ toàn bộ phòng ban...
echo.
echo ----------------------------------------------------------------------
echo  HƯỚNG DẪN TRUY CẬP CHO SẾP VÀ ĐỒNG NGHIỆP:
echo.
echo  Mọi người chỉ cần mở trình duyệt (Chrome, Cốc Cốc, Edge, điện thoại...)
echo  và nhập chính xác địa chỉ sau:
echo.
echo      >>>  http://192.168.2.129:8000  <<<
echo.
echo ----------------------------------------------------------------------
echo  (*) LƯU Ý QUAN TRỌNG:
echo   1. Máy tính hoặc điện thoại người xem phải kết nối chung mạng WiFi / LAN công ty.
echo   2. Giữ nguyên cửa sổ màu đen này chạy nền trong giờ làm việc để mọi người truy cập.
echo   3. Muốn tắt server thì chỉ cần đóng (tắt) cửa sổ này lại.
echo ======================================================================
echo.
python -m http.server 8000
pause
