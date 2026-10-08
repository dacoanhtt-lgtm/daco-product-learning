# HỆ THỐNG CẨM NANG & TRA CỨU SẢN PHẨM NỘI BỘ (MULTI-BRAND PORTAL)

Dự án cổng tra cứu tri thức sản phẩm và đào tạo kỹ thuật nội bộ dành cho nhân viên kinh doanh, kỹ thuật và mua hàng.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
cam_nang_san_pham/
│
├── index.html                  # Giao diện chính Portal Đa Thương Hiệu (Generic Engine)
├── dong_bo_du_lieu.bat         # File bấm đúp 1-Click để đồng bộ dữ liệu từ Excel vào Web
├── sync_data.py                # Script Python tự động bóc tách Excel xuất sang JSON
│
├── data/                       # Dữ liệu độc lập của từng thương hiệu (Dễ dàng mở rộng)
│   ├── brands.json             # Danh mục các thương hiệu (Mitsubishi, Mitutoyo, Qlight...)
│   ├── mitsubishi.json         # Dữ liệu chuẩn hóa Mitsubishi Electric
│   ├── mitutoyo.json           # Dữ liệu chuẩn hóa Mitutoyo
│   ├── qlight.json             # Dữ liệu chuẩn hóa Qlight
│   └── history_timelines.json  # Dữ liệu sơ đồ tiến hóa dòng thời gian (History Lineage)
│
└── assets/                     # Tài nguyên giao diện, icons, sơ đồ
    ├── style.css               # Phong cách giao diện hiện đại, tinh gọn
    └── app.js                  # Bộ máy xử lý tìm kiếm toàn cục, lọc & chuyển đổi
```

---

## 🎯 5 NGUYÊN TẮC THIẾT KẾ ĐÃ ĐƯỢC CHUẨN HÓA

1. **Gạch đầu dòng (Bullet points)**: Không dùng văn xuôi dài; chia nhỏ thành: Bản chất • Ứng dụng • Cảnh báo thực chiến.
2. **Sơ đồ tiến hóa (History Lineage)**: Trực quan hóa dòng đời các thế hệ sản phẩm (Cũ ngừng SX ➔ Mới thay thế).
3. **Mở rộng không giới hạn (Modular Data)**: Giao diện tách rời dữ liệu; thêm hãng mới chỉ cần thêm 1 file trong thư mục `data/`.
4. **Tìm kiếm toàn cục (Global Universal Search)**: Đặt vĩnh viễn trên Header, gợi ý tức thì xuyên suốt mọi thương hiệu.
5. **Đồng bộ 1-Click từ Excel**: Bấm đúp `dong_bo_du_lieu.bat` là web tự cập nhật theo file Excel nội bộ của công ty.
