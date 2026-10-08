// Dữ Liệu Kịch Bản Báo Giá Thực Chiến (Trích xuất từ file Báo giá Mitsubishi.docx)
window.PORTAL_QUOTATION_SCENARIOS = [
  {
    "id": "scenario_tm_1",
    "name": "Kịch bản 1: Khách Thương Mại (Hỏi giá Servo JE, FX5U, HMI GS2110)",
    "customerType": "Thương Mại",
    "rawInquiry": "Báo cho anh list giá, anh bên Thương mại:\n- MR-JE-40A, Motor 400W (2 bộ)\n- Cable Encoder 5 mét, Cable nguồn 5 mét, Jack CN3 hàn sẵn có cầu đấu kèm theo + Terminal (2 bộ)\n- PLC Mitsubishi FX5U-64MT/DS (2 cái)\n- Màn hình HMI Mitsubishi GS2110-WTBD 10 inch (1 cái)",
    "items": [
      { "model": "MR-JE-40A", "name": "Driver Servo 400W", "qty": 2, "unit": "Cái", "defaultCost": 4200000, "targetPrice": 4650000, "supplier": "Phạm Dương / Sa Giang", "origin": "China/Japan", "leadTime": "Có sẵn" },
      { "model": "HG-KN43J-S100", "name": "Động cơ Servo 400W", "qty": 2, "unit": "Cái", "defaultCost": 3500000, "targetPrice": 3900000, "supplier": "Hồng Long / Phạm Dương", "origin": "Japan", "leadTime": "Có sẵn" },
      { "model": "MR-PWS1CBL5M-A1-L", "name": "Cáp nguồn Servo 5m", "qty": 2, "unit": "Sợi", "defaultCost": 320000, "targetPrice": 400000, "supplier": "Sa Giang / TQ", "origin": "China/VN", "leadTime": "Có sẵn" },
      { "model": "MR-J3ENCBL5M-A1-L", "name": "Cáp Encoder Servo 5m", "qty": 2, "unit": "Sợi", "defaultCost": 380000, "targetPrice": 480000, "supplier": "Sa Giang / TQ", "origin": "China/VN", "leadTime": "Có sẵn" },
      { "model": "CN3-JACK-TERM", "name": "Jack CN3 hàn sẵn kèm cầu đấu Terminal", "qty": 2, "unit": "Bộ", "defaultCost": 180000, "targetPrice": 250000, "supplier": "Kho kỹ thuật / Sa Giang", "origin": "China/VN", "leadTime": "Có sẵn" },
      { "model": "FX5U-64MT/DS", "name": "PLC FX5U 32 DI / 32 DO Transistor, Nguồn 24VDC", "qty": 2, "unit": "Cái", "defaultCost": 6800000, "targetPrice": 7450000, "supplier": "Hồng Long / Phạm Dương", "origin": "Japan", "leadTime": "Có sẵn" },
      { "model": "GS2110-WTBD-N", "name": "Màn hình cảm ứng GOT SIMPLE 10 inch", "qty": 1, "unit": "Cái", "defaultCost": 9500000, "targetPrice": 10500000, "supplier": "DACO (Nhập trực tiếp)", "origin": "Japan", "leadTime": "Có sẵn" }
    ],
    "keyCheckpoints": [
      "Khách Thương Mại: Biên lợi nhuận phải mỏng (8% - 12%) để khách còn bán lại được.",
      "HMI GS2110: Phải hỏi giá DACO đầu tiên để có giá gốc thấp nhất miền Bắc.",
      "Mã PLC đuôi /DS: Là nguồn 24VDC (chú ý khác mã /ES nguồn 220VAC).",
      "Jack CN3 hàn sẵn: Thể hiện dịch vụ hỗ trợ kỹ thuật vượt trội giúp giữ chân khách."
    ]
  },
  {
    "id": "scenario_ctm_2",
    "name": "Kịch bản 2: Khách Chế Tạo Máy (CTM) - Cần hàng sẵn tối đa 7-12 ngày",
    "customerType": "Chế Tạo Máy (OEM)",
    "rawInquiry": "Báo giá list KH CTM - cần hàng sẵn, tối đa 7-12 ngày:\n- GT2712-STBD (2 Cái)\n- HG-KR43 (4 Cái), HG-KR23B có phanh (2 Cái), HG-KR13 (2 Cái)\n- Q38B (2 Cái), Q63P (2 Cái), Q13UDVCPU (2 Cái), QJ61BT11N (4 Cái)\n- AJ65SBTB1-32D1 (16 Cái), AJ65SBTB1-32T1 (10 Cái), QD77MS16 (2 Cái), QJ71E71-100 (4 Cái)\n- Cáp nguồn & Encoder 5m, cáp phanh, cáp quang SSCNET MR-J3BUS3M / 0.5M",
    "items": [
      { "model": "GT2712-STBD", "name": "Màn hình GOT2000 12.1 inch SVGA Nguồn 24VDC", "qty": 2, "unit": "Cái", "defaultCost": 32000000, "targetPrice": 36000000, "supplier": "Covifa / Phạm Dương", "origin": "Japan", "leadTime": "7-12 ngày" },
      { "model": "HG-KR43", "name": "Motor Servo 400W không phanh", "qty": 4, "unit": "Cái", "defaultCost": 4100000, "targetPrice": 4650000, "supplier": "Hồng Long / Phạm Dương", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "HG-KR23B", "name": "Motor Servo 200W CÓ PHANH (-B)", "qty": 2, "unit": "Cái", "defaultCost": 4500000, "targetPrice": 5200000, "supplier": "Hồng Long / Sa Giang", "origin": "Japan", "leadTime": "7-12 ngày" },
      { "model": "HG-KR13", "name": "Motor Servo 100W", "qty": 2, "unit": "Cái", "defaultCost": 3200000, "targetPrice": 3650000, "supplier": "Hồng Long", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "Q38B", "name": "Đế Base 8 khe cắm dòng Q", "qty": 2, "unit": "Cái", "defaultCost": 2800000, "targetPrice": 3200000, "supplier": "Phạm Dương / Kovi", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "Q63P", "name": "Bộ nguồn 24VDC vào cho PLC dòng Q", "qty": 2, "unit": "Cái", "defaultCost": 3500000, "targetPrice": 4050000, "supplier": "Phạm Dương / Kovi", "origin": "Japan", "leadTime": "7-12 ngày" },
      { "model": "Q13UDVCPU", "name": "CPU PLC Q tốc độ cao 130k bước", "qty": 2, "unit": "Cái", "defaultCost": 18500000, "targetPrice": 21000000, "supplier": "Kovi / Phạm Dương", "origin": "Japan", "leadTime": "7-12 ngày" },
      { "model": "QD77MS16", "name": "Module điều khiển vị trí 16 trục mạng SSCNET", "qty": 2, "unit": "Cái", "defaultCost": 28000000, "targetPrice": 31500000, "supplier": "Kovi / Sa Giang", "origin": "Japan", "leadTime": "7-12 ngày" },
      { "model": "MR-BKS1CBL5M-A1-H", "name": "Cáp phanh cho motor HG-KR23B", "qty": 2, "unit": "Sợi", "defaultCost": 450000, "targetPrice": 600000, "supplier": "Sa Giang", "origin": "Japan/China", "leadTime": "Hàng sẵn" }
    ],
    "keyCheckpoints": [
      "TIẾN ĐỘ SỐNG CÒN: Khách CTM cần gấp 7-12 ngày để kịp tiến độ bàn giao máy, phải chọn đại lý kho sẵn lớn.",
      "ĐỒNG BỘ CÁP PHANH: Khách mua motor HG-KR23B (có phanh) BẮT BUỘC PHẢI BÁO THÊM CÁP PHANH MR-BKS1CBL.",
      "NGUỒN Q63P: Lưu ý Q63P là nguồn cấp vào 24VDC (khác với Q61P nguồn 220VAC).",
      "Biên lợi nhuận khách CTM tiêu chuẩn: 12% - 18%."
    ]
  },
  {
    "id": "scenario_fdi_3",
    "name": "Kịch bản 3: Khách Nhà Máy FDI - Bộ Servo MR-J4-100A có phanh, bắt buộc CO/CQ xịn",
    "customerType": "Nhà Máy FDI",
    "rawInquiry": "Báo giá cho nhà máy:\n- Bộ servo MR-J4-100A có phanh, full cáp (2 bộ)\n- Yêu cầu bắt buộc: Hàng mới 100%, xuất xứ Japan, đầy đủ chứng chỉ CO/CQ gốc chính hãng phục vụ nghiệm thu dự án.",
    "items": [
      { "model": "MR-J4-100A", "name": "Driver Servo 1kW dòng MR-J4", "qty": 2, "unit": "Bộ", "defaultCost": 8500000, "targetPrice": 10200000, "supplier": "Covifa (Kovi) / Hồng Long", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "HG-SR102B", "name": "Động cơ Servo 1kW CÓ PHANH (-B), trục có then", "qty": 2, "unit": "Cái", "defaultCost": 12500000, "targetPrice": 14900000, "supplier": "Covifa (Kovi) / Hồng Long", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "MR-PWS2CBL5M-A1-L", "name": "Cáp động lực cho motor 1kW 5m", "qty": 2, "unit": "Sợi", "defaultCost": 750000, "targetPrice": 950000, "supplier": "Covifa / Sa Giang", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "MR-J3ENSCBL5M-L", "name": "Cáp Encoder cho motor HG-SR 5m", "qty": 2, "unit": "Sợi", "defaultCost": 850000, "targetPrice": 1100000, "supplier": "Covifa / Sa Giang", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "MR-BKS2CBL5M-A1-L", "name": "Cáp phanh cho motor HG-SR 5m", "qty": 2, "unit": "Sợi", "defaultCost": 600000, "targetPrice": 800000, "supplier": "Covifa / Sa Giang", "origin": "Japan", "leadTime": "Hàng sẵn" }
    ],
    "keyCheckpoints": [
      "CHỨNG CHỈ CO/CQ GỐC: Tuyệt đối không nhập nguồn tiểu ngạch TQ vì giấy tờ chỉ là bản scan, nhà máy FDI nghiệm thu sẽ phạt vi phạm hợp đồng.",
      "KÊNH NHẬP: Bắt buộc mua qua NPP chính ngạch Covifa (Kovi) hoặc Hồng Long có CO phòng thương mại và CQ hãng.",
      "Biên lợi nhuận nhà máy FDI: Đạt mức 18% - 25% vì kèm trách nhiệm bảo hành, hỗ trợ kỹ thuật và công nợ 30-45 ngày."
    ]
  },
  {
    "id": "scenario_tu_dien_4",
    "name": "Kịch bản 4: Khách Tủ Bảng Điện - Aptomat, Contactor AC100V, Rơ le nhiệt, PLC FX3U",
    "customerType": "Nhà Thầu Tủ Điện",
    "rawInquiry": "Báo giá KH tủ bảng điện - Cần CO CQ:\n- NF32-SV 3P 30A (1), NF32-SV 3P 10A (3), NF32-SV 2P 10A (1)\n- CP30-BA 2P 3A (3), CP30-BA 1P 5A (1), CP30-BA 1P 1A (1)\n- S-T10 AC100V (5 Pcs), Tiếp điểm phụ UT-AX4 2A2B (2 Pcs)\n- TH-T18 6.6A (2 Pcs), TH-T18 3.6A (1 Pcs)\n- FX3U-128MR/ES (1 Pcs), FX2N-16EYR-ES/UL (1 Pcs), FX2N-16EX (1 Pcs)",
    "items": [
      { "model": "NF32-SV 3P 30A", "name": "Aptomat khối MCCB 3P 30A dòng cắt 7.5kA", "qty": 1, "unit": "Cái", "defaultCost": 480000, "targetPrice": 560000, "supplier": "Duy Hưng (Chiết khấu cao)", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "S-T10 AC100V", "name": "Khởi động từ Contactor S-T10 CUỘN HÚT AC100V", "qty": 5, "unit": "Cái", "defaultCost": 220000, "targetPrice": 265000, "supplier": "Duy Hưng / Hồng Long", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "TH-T18 6.6A", "name": "Rơ le nhiệt dải chỉnh 5.2A ~ 8A", "qty": 2, "unit": "Cái", "defaultCost": 190000, "targetPrice": 235000, "supplier": "Duy Hưng", "origin": "Japan", "leadTime": "Hàng sẵn" },
      { "model": "FX3U-128MR/ES", "name": "PLC FX3U 64 In / 64 Out Relay (Khuyến nghị đổi FX5U)", "qty": 1, "unit": "Cái", "defaultCost": 10500000, "targetPrice": 11800000, "supplier": "Phạm Dương / Hồng Long", "origin": "Japan", "leadTime": "Hàng sẵn" }
    ],
    "keyCheckpoints": [
      "ĐIỂM CHẾT NGƯỜI: Contactor ghi rõ cuộn hút AC100V (phải xác nhận kỹ với khách tủ điện, nếu tủ dùng lưới điện VN 220V mà lắp nhầm cuộn 100V là nổ cuộn hút ngay khi cấp điện!).",
      "ĐÓNG CẮT HẠ THẾ: Mua Duy Hưng hoặc Hồng Long để lấy mức chiết khấu cao nhất (thường từ 45% đến 52% so với giá bảng).",
      "CẢNH BÁO FAKE FX3U: Tư vấn khách sang dòng FX5U-80MR + module mở rộng FX5-32ER để an toàn hơn."
    ]
  }
];
