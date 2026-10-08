window.PORTAL_DATA_MITSUBISHI = {
  "brand": "Mitsubishi Electric",
  "software": [
    {
      "name": "GX Works3",
      "version": "v1.095+ (iQ Edition)",
      "target": "PLC FX5U, FX5UC (iQ-F), iQ-R Series",
      "purpose": "Lập trình Ladder, SFC, ST, FBD; cấu hình Parameter đồ họa kéo thả",
      "note": "Phần mềm chủ lực thế hệ mới, dung lượng cài đặt lớn (~15GB trong bộ iQ Works)."
    },
    {
      "name": "GX Works2",
      "version": "v1.600+",
      "target": "PLC FX3U, FX3G, FX3S, Q Series, L Series",
      "purpose": "Lập trình PLC dòng kinh điển, tích hợp sẵn mô phỏng GX Simulator 2",
      "note": "Cực kỳ ổn định, chạy mượt trên mọi máy tính văn phòng, chuẩn quốc tế IEC 61131-3."
    },
    {
      "name": "GX Developer",
      "version": "v8.119+",
      "target": "PLC dòng cũ đã khai tử: A Series, FX0N, FX1N, FX2N, QnA",
      "purpose": "Đọc/ghi chương trình máy cũ bảo trì, upload code dự phòng",
      "note": "Giao diện cổ điển, siêu nhẹ (<500MB), tương thích tốt với cáp chuyển đổi USB-RS422."
    },
    {
      "name": "GT Designer3",
      "version": "GOT2000 Series",
      "target": "Màn hình HMI GS2107, GS2110, GT21, GT23, GT25, GT27",
      "purpose": "Thiết kế giao diện cảm ứng HMI, chuyển đổi giao diện từ màn cũ sang màn mới",
      "note": "Đi kèm công cụ GT SoftGOT giúp chạy mô phỏng HMI trực tiếp trên máy tính PC."
    },
    {
      "name": "FR Configurator2",
      "version": "v1.28+",
      "target": "Biến tần FR-D700/D800, FR-E700/E800, FR-A800, FR-F800",
      "purpose": "Cài đặt tham số (Pr.), sao lưu/backup thông số, vẽ đồ thị sóng dòng/áp/tần số",
      "note": "Kết nối qua cáp USB mini hoặc truyền thông RS-485 Modbus; sao chép tham số sang biến tần mới chỉ mất 10 giây."
    },
    {
      "name": "MR Configurator2",
      "version": "v1.130+",
      "target": "Bộ khuếch đại Servo MR-J4, MR-JE, MR-J3, MR-JN",
      "purpose": "Tự động tinh chỉnh One-Touch Tuning, đọc mã lỗi alarm, vẽ đồ thị vị trí/tốc độ/momen",
      "note": "Công cụ bắt buộc phải có khi kỹ thuật viên đi bàn giao chạy thử nghiệm máy chạy Servo."
    },
    {
      "name": "MX Component",
      "version": "v5.0+",
      "target": "Toàn bộ PLC Mitsubishi kết nối máy tính chủ",
      "purpose": "Thư viện giao tiếp ActiveX / .NET phục vụ phần mềm C#, VB.NET, Python đọc ghi thanh ghi PLC",
      "note": "Chuyên dùng cho các công ty làm dự án SCADA, thu thập dữ liệu IoT nhà máy thông minh."
    }
  ],
  "history": [
    {
      "category": "PLC Cỡ Nhỏ (Compact PLC)",
      "steps": [
        {
          "era": "1990 - 2000",
          "name": "Dòng A / FX0N",
          "status": "Đã khai tử",
          "badge": "discontinued",
          "software": "GX Developer",
          "highlight": "Cáp tròn RS-422, chỉ còn máy cũ thanh lý"
        },
        {
          "era": "2000 - 2015",
          "name": "FX1N / FX2N / FX1S",
          "status": "Đã khai tử",
          "badge": "discontinued",
          "software": "GX Developer / GX Works2",
          "highlight": "Thị trường 90% là hàng Fake bo mạch TQ hoặc Renew"
        },
        {
          "era": "2010 - Nay",
          "name": "FX3U / FX3G / FX3S",
          "status": "Chuyển tiếp",
          "badge": "transition",
          "software": "GX Works2",
          "highlight": "Micro PLC bán chạy nhất lịch sử, làm giả chip STM32 rất nhiều"
        },
        {
          "era": "2016 - Tương lai",
          "name": "FX5U / FX5UC (iQ-F)",
          "status": "Chuẩn hiện hành",
          "badge": "current",
          "software": "GX Works3",
          "highlight": "Tích hợp sẵn Ethernet + Analog, thay thế hoàn hảo cho FX3U"
        }
      ]
    },
    {
      "category": "Biến Tần (Inverter FREQROL)",
      "steps": [
        {
          "era": "Thế hệ cũ (2007-2022)",
          "name": "FR-D700 / FR-E700 / FR-A700",
          "status": "Ngừng sản xuất",
          "badge": "discontinued",
          "software": "FR Configurator",
          "highlight": "Đặt mới thời gian chờ 5-6 tháng, thị trường chủ yếu hàng tồn/bãi"
        },
        {
          "era": "Thế hệ mới (2020 - Nay)",
          "name": "FR-D800 / FR-E800 / FR-A800",
          "status": "Chuẩn hiện hành",
          "badge": "current",
          "software": "FR Configurator2",
          "highlight": "Có mã phủ sơn bảo vệ chống ẩm hóa chất (-60), bản E800 tích hợp 2 cổng Ethernet"
        }
      ]
    },
    {
      "category": "Màn Hình Cảm Ứng (GOT HMI)",
      "steps": [
        {
          "era": "Thế hệ cũ",
          "name": "GOT1000 / GT23",
          "status": "Ngừng sản xuất",
          "badge": "discontinued",
          "software": "GT Designer3",
          "highlight": "GT23 thiếu vi mạch chính ngừng SX, chuyển giao sang GS2000 hoặc GT25"
        },
        {
          "era": "Thế hệ hiện hành",
          "name": "GS2000 (GS2107/GS2110) & GT25/GT27",
          "status": "Chuẩn hiện hành",
          "badge": "current",
          "software": "GT Designer3",
          "highlight": "GS2107-WTBD-N bán chạy số 1 Việt Nam; DACO nhập khẩu trực tiếp giá cực tốt"
        }
      ]
    },
    {
      "category": "Hệ Thống Servo (Drive & Motor)",
      "steps": [
        {
          "era": "Thế hệ cũ",
          "name": "MR-J2S / MR-J3 / Motor HF",
          "status": "Ngừng sản xuất",
          "badge": "discontinued",
          "software": "MR Configurator",
          "highlight": "Encoder 17-bit, Driver J4 không chạy được với Motor HF cũ"
        },
        {
          "era": "Hiện hành",
          "name": "MR-J4 / MR-JE / Motor HG",
          "status": "Chuẩn hiện hành",
          "badge": "current",
          "software": "MR Configurator2",
          "highlight": "Encoder 22-bit (4 triệu xung/vòng), thay cũ sang mới bắt buộc thay cả bộ"
        },
        {
          "era": "Tối tân",
          "name": "MR-J5 / Motor HK",
          "status": "Thế hệ mới",
          "badge": "future",
          "software": "MR Configurator2 (iQ Edition)",
          "highlight": "Encoder 26-bit (67 triệu xung), mạng CC-Link IE TSN siêu tốc"
        }
      ]
    }
  ],
  "products": [
    {
      "id": 1,
      "cat": "PLC",
      "subcat": "PLC cỡ lớn đời cũ kinh điển",
      "serial": "Dòng A (A1SJCPU)",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "A1SJCPU",
        "A1SJHCPU",
        "A2USHCPU-S1"
      ],
      "replacement": "Nâng cấp lên FX5U (máy nhỏ) hoặc Q Series (máy lớn)",
      "software": "GX Developer",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: Bộ vi xử lý công nghiệp đời đầu thập niên 1990, chuẩn cắm module rack A-Series.",
        "**Ứng dụng**: Dây chuyền cơ khí, dệt may, đúc ép nhựa cũ nhập từ Nhật, Đài Loan.",
        "**Cảnh báo thực chiến**: 100% KHÔNG CÓ HÀNG FAKE BO MẠCH; thị trường chỉ có hàng tháo máy bãi renew dán lại tem.",
        "**Tư vấn Sales**: Thuyết phục khách nâng cấp sang FX5U hoặc Q Series để có linh kiện lâu dài."
      ],
      "suppliers": "Tuyến 1: Kovi, Phạm Dương (tồn kho cũ) | Tuyến 2: Kênh bãi TQ, Toàn Cầu",
      "image": "assets/images/mitsubishi/plc_fx3u.webp"
    },
    {
      "id": 2,
      "cat": "PLC",
      "subcat": "PLC cỡ nhỏ thế hệ 1 & 2 (Đã khai tử)",
      "serial": "FX1N / FX2N / FX1S",
      "status": "Ngừng sx",
      "fake": "Có",
      "renew": "Có",
      "models": [
        "FX1N-14/24/40/60MT/MR",
        "FX2N-16/32/48/64/80/128MT/MR",
        "FX1S-10/14/20/30MT/MR"
      ],
      "replacement": "FX3U, FX3G hoặc nâng thẳng FX5U / FX5UC",
      "software": "GX Developer, GX Works2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: Micro PLC kinh điển, bộ nhớ 2k-16k bước lệnh, ngõ ra Relay (MR) hoặc Transistor (MT).",
        "**Ứng dụng**: Máy đóng gói mini, máy ép gạch, máy uốn đai sắt, dây chuyền cơ khí đơn giản.",
        "**Cảnh báo đỏ**: TRÊN 90% THỊ TRƯỜNG LÀ FAKE bo mạch clone từ TQ (ruột chip ARM giả lập) hoặc RENEW vỏ từ bãi phế liệu.",
        "**Tư vấn Sales**: Tuyệt đối không nhận cung cấp hàng mới 100% có CO/CQ xịn; bắt buộc tư vấn đổi sang FX3U/FX5U."
      ],
      "suppliers": "Tuyến 1: Toàn Cầu (renew), Kovi, Phạm Dương (tồn) | Tuyến 2: Kênh TQ, Hải Âu",
      "image": "assets/images/mitsubishi/plc_fx3u.webp"
    },
    {
      "id": 3,
      "cat": "PLC",
      "subcat": "PLC cỡ nhỏ phổ biến nhất (Thế hệ 3)",
      "serial": "FX3U / FX3G / FX3S",
      "status": "Thông dụng",
      "fake": "Có",
      "renew": "Có",
      "models": [
        "FX3U-16/32/48/64/80/128MR/ES-A",
        "FX3U-16/32/48/64/80/128MT/ES-A",
        "FX3G-14/24/40/60MR/ES-A",
        "FX3G-14/24/40/60MT/ES-A",
        "FX3S-10/14/20/30MR/ES"
      ],
      "replacement": "FX5U / FX5UC (MELSEC iQ-F)",
      "software": "GX Works2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/fx3u/index.html",
      "points": [
        "**Bản chất**: Mở rộng tới 384 I/O, tốc độ lệnh 0.065 µs, bản MT tích hợp phát xung 3 trục 100kHz.",
        "**Ứng dụng**: Máy cắt CNC mini, máy đóng gói bao bì, chiết rót, trạm giám sát phụ SCADA.",
        "**TÂM ĐIỂM FAKE & RENEW**: Dòng PLC bị làm giả tinh vi nhất; ruột dùng chip STM32 chạy vài tháng là treo.",
        "**Dấu hiệu nhận biết**: Soi kỹ ốc vít, font chữ in laser trên vỏ nhựa, tem 7 màu và chân giắc đấu dây."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long (hàng new chuẩn) | Tuyến 2: Sa Giang, Toàn Cầu, TQ",
      "image": "assets/images/mitsubishi/plc_fx3u.webp"
    },
    {
      "id": 4,
      "cat": "PLC",
      "subcat": "PLC thế hệ mới iQ-F hiệu năng cao",
      "serial": "FX5U / FX5UC (MELSEC iQ-F)",
      "status": "Thông dụng",
      "fake": "Có",
      "renew": "Có",
      "models": [
        "FX5U-32MR/ES",
        "FX5U-32MT/ES",
        "FX5U-64MR/ES",
        "FX5U-64MT/ES",
        "FX5U-80MR/ES",
        "FX5U-80MT/ES",
        "FX5UC-32MT/D"
      ],
      "replacement": "Dòng hiện hành mới nhất (Kế thừa FX3U)",
      "software": "GX Works3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/iq_f/index.html",
      "points": [
        "**Bản chất**: Bus truyền thông nhanh gấp 150 lần FX3U; tích hợp sẵn 1 cổng Ethernet RJ45, 1 RS-485, 2 Analog In, 1 Analog Out.",
        "**Ứng dụng**: Nhà máy thông minh IoT, hệ thống giám sát SCADA, máy tự động hóa nhiều trục.",
        "**Lợi thế kinh tế**: Giá FX5U rẻ hơn tổng chi phí mua FX3U cộng thêm module Ethernet mở rộng.",
        "**Cảnh báo**: Đã xuất hiện hàng renew tháo từ các nhà máy FDI (Samsung, Foxconn); hàng nhái TQ bắt đầu manh nha."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long (kho sẵn lớn) | Tuyến 2: Sa Giang, Hải Âu, BA",
      "image": "assets/images/mitsubishi/plc_fx5u.webp"
    },
    {
      "id": 5,
      "cat": "PLC",
      "subcat": "PLC dạng Module hệ thống lớn (Modular PLC)",
      "serial": "Q Series (MELSEC-Q)",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "Q00UJCPU",
        "Q01UCPU",
        "Q03UDVCPU",
        "Q04UDVCPU",
        "Q06UDVCPU",
        "Q13UDVCPU",
        "Q26UDVCPU",
        "Q61P",
        "Q62P",
        "Q33B",
        "Q35B",
        "Q38B",
        "Q312B"
      ],
      "replacement": "Q Series hiện hành hoặc nâng cấp iQ-R Series",
      "software": "GX Works2, GX Developer",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/q/index.html",
      "points": [
        "**Bản chất**: Quản lý tới 4.096 I/O đế rack và 8.192 I/O mạng; tốc độ xử lý 1.9 ns; hỗ trợ đa CPU chạy song song.",
        "**Ứng dụng**: Dây chuyền cán thép, xi măng, nhà máy bia rượu giải khát, xử lý nước đô thị, ô tô xe máy.",
        "**QUY TẮC PHẦN CỨNG**: 100% KHÔNG CÓ HÀNG FAKE BO MẠCH do kiến trúc vi xử lý siêu phức tạp.",
        "**Cảnh báo Renew**: Rất nhiều hàng tháo máy cũ sơn lại vỏ bán giá mới; khi báo giá phải hỏi khách đã có Nguồn và Đế Base chưa."
      ],
      "suppliers": "Tuyến 1: Kovi, Phạm Dương, Hợp Long | Tuyến 2: Sa Giang, Toàn Cầu, Kênh TQ",
      "image": "assets/images/mitsubishi/plc_q_series.webp"
    },
    {
      "id": 6,
      "cat": "PLC",
      "subcat": "PLC cỡ trung dạng thanh mỏng (Không rack)",
      "serial": "Dòng L Series",
      "status": "Hiếm",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "L02CPU",
        "L02CPU-P",
        "L06CPU",
        "L26CPU-BT",
        "L61P",
        "LX40C6",
        "LY40NT5P"
      ],
      "replacement": "Q Series hoặc iQ-R Series (nếu mở rộng mới)",
      "software": "GX Works2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/l/index.html",
      "points": [
        "**Bản chất**: Thiết kế thanh mỏng khóa trượt không cần đế rack Base; tích hợp sẵn 24 I/O số, cổng Ethernet, USB, khe thẻ nhớ SD.",
        "**Ứng dụng**: Máy đóng gói vừa, máy in công nghiệp, tủ điều khiển phân tán.",
        "**Thực chiến**: Thuộc phân khúc trung gian giữa FX và Q; đại lý ít stock sẵn; không có fake bo mạch.",
        "**Đặt hàng**: Ưu tiên hỏi Covifa hoặc Phạm Dương để kiểm tra lead time tiến độ giao hàng."
      ],
      "suppliers": "Tuyến 1: Covifa (NPP chính hãng lấy tiến độ) | Tuyến 2: Phạm Dương, Hải Âu, TQ",
      "image": "assets/images/mitsubishi/plc_q_series.webp"
    },
    {
      "id": 7,
      "cat": "PLC",
      "subcat": "PLC phân khúc tối tân doanh nghiệp (Flagship)",
      "serial": "iQ-R Series (MELSEC iQ-R)",
      "status": "Hiếm",
      "fake": "Không",
      "renew": "Không",
      "models": [
        "R04CPU",
        "R08CPU",
        "R16CPU",
        "R32CPU",
        "R16MTCPU",
        "R32MTCPU",
        "R61P",
        "R35B",
        "R38B"
      ],
      "replacement": "Dòng tối tân nhất của Mitsubishi hiện nay",
      "software": "GX Works3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/iq_r/index.html",
      "points": [
        "**Bản chất**: Bộ vi xử lý đa nhân, bus hệ thống nhanh hơn Q-Series 40 lần; bảo mật phần cứng Security Key; mạng CC-Link IE TSN 1Gbps.",
        "**Ứng dụng**: Nhà máy bán dẫn, dây chuyền pin xe điện, hóa chất lọc dầu, an toàn Safety SIL3.",
        "**Đặc điểm**: HOÀN TOÀN KHÔNG CÓ FAKE, CHƯA CÓ RENEW; giá thành rất cao.",
        "**Quy trình mua**: Bắt buộc mua qua kênh phân phối chính thức Covifa/Hợp Long kèm hồ sơ đăng ký dự án để bảo hộ giá."
      ],
      "suppliers": "Tuyến 1: Covifa (NPP chính ngạch bảo hộ dự án) | Tuyến 2: Hợp Long, Phạm Dương",
      "image": "assets/images/mitsubishi/plc_q_series.webp"
    },
    {
      "id": 8,
      "cat": "Module",
      "subcat": "Module truyền thông mạng & Serial cho FX",
      "serial": "FX Comms (Ethernet & Serial)",
      "status": "Thông dụng",
      "fake": "Có",
      "renew": "Có",
      "models": [
        "FX3U-ENET",
        "FX3U-ENET-ADP",
        "FX5-ENET",
        "FX5-ENET/IP",
        "FX3U-232-BD",
        "FX3U-422-BD",
        "FX3U-485-BD",
        "FX5-232-ADP",
        "FX5-485-ADP"
      ],
      "replacement": "FX5-ENET, FX5-232-ADP, FX5-485-ADP",
      "software": "GX Works2, GX Works3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: Bo cắm BD hoặc adapter mạng mở rộng cổng Ethernet TCP/IP hoặc Serial RS-232/485 Modbus RTU.",
        "**Ứng dụng**: Thu thập dữ liệu IoT, giám sát điện năng, kết nối biến tần, mạng PLC-to-PLC.",
        "**CẢNH BÁO FAKE**: Các bo FX3U-232-BD, FX3U-485-BD và FX3U-ENET mạch đơn giản nên hàng nhái TQ rất nhiều.",
        "**Lỗi thường gặp**: FX3U-ENET nhái rất hay bị rớt mạng kết nối SCADA sau vài ngày chạy liên tục."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Sa Giang, Toàn Cầu, TQ",
      "image": "assets/images/mitsubishi/comm_module.webp"
    },
    {
      "id": 9,
      "cat": "Module",
      "subcat": "Module mạng Ethernet & Mạng hiện trường CC-Link Q",
      "serial": "Q Comms & CC-Link",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "QJ71E71-100",
        "QJ61BT11N",
        "QJ71C24N",
        "QJ71C24N-R2/R4",
        "AJ65SBTB1-8D/16D/32DT"
      ],
      "replacement": "Dòng Q Comms hiện hành (Kế thừa)",
      "software": "GX Works2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: QJ71E71-100 quản lý 16 kênh TCP độc lập; QJ61BT11N là module chủ CC-Link 10Mbps kết nối xa 1200m.",
        "**Ứng dụng**: Dây chuyền sản xuất phân tán, kết nối máy tính chủ cấp quản lý MES/ERP.",
        "**Đặc điểm**: KHÔNG CÓ HÀNG FAKE BO MẠCH; có hàng renew tháo máy thanh lý.",
        "**Lưu ý trạm Remote**: Khi chào trạm AJ65SBTB1 phải xác định rõ ngõ ra Relay hay Transistor, giắc cắm domino hay ốc vặn."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Sa Giang, BA, Hải Âu, TQ",
      "image": "assets/images/mitsubishi/comm_module.webp"
    },
    {
      "id": 10,
      "cat": "Module",
      "subcat": "Module mở rộng ngõ vào/ra số và Analog FX",
      "serial": "Analog & I/O dòng FX",
      "status": "Thông dụng",
      "fake": "Có",
      "renew": "Có",
      "models": [
        "FX3U-4AD",
        "FX3U-4DA",
        "FX3U-4AD-PT-ADP",
        "FX2N-8EX",
        "FX2N-8EYR",
        "FX2N-16EX",
        "FX2N-16EYR",
        "FX5-4AD",
        "FX5-4DA",
        "FX5-8EX/ES"
      ],
      "replacement": "Dòng module mở rộng FX5 thế hệ mới",
      "software": "GX Works2, GX Works3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: Mở rộng tín hiệu Analog (0-10V, 4-20mA), cảm biến nhiệt độ PT100/TC và rơ le I/O số.",
        "**Ứng dụng**: Đo nhiệt độ lò sấy, điều áp đường ống bơm nước, trạm cân định lượng.",
        "**CẢNH BÁO FAKE**: FX3U-4AD, FX3U-4DA và FX2N-8EYR có tỷ lệ hàng Fake và Renew rất cao.",
        "**Nguy cơ**: Bo Fake dùng chip ADC/DAC cấp thấp gây trôi dạt sai số đo đạc lớn khi nhiệt độ môi trường thay đổi."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Toàn Cầu, Hải Âu, TQ",
      "image": "assets/images/mitsubishi/plc_fx3u.webp"
    },
    {
      "id": 11,
      "cat": "Module",
      "subcat": "Module ngõ vào/ra số & Analog Q",
      "serial": "Analog & I/O dòng Q",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "QX40",
        "QX42",
        "QY40P",
        "QY41P",
        "QY10",
        "Q64AD",
        "Q64DA",
        "Q68ADV/ADI"
      ],
      "replacement": "Dòng module I/O dòng Q tiêu chuẩn hiện hành",
      "software": "GX Works2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/cnt/plc/index.html",
      "points": [
        "**Bản chất**: Chuẩn cách ly quang opto cao áp chống nhiễu vượt trội; các mã đuôi 42 dùng giắc 40 chân mật độ cao.",
        "**Ứng dụng**: Đấu nối cảm biến, nút bấm, đèn báo, van khí nén trong tủ điều khiển trung tâm lớn.",
        "**Đặc điểm**: KHÔNG CÓ HÀNG FAKE BO MẠCH; chỉ có hàng Renew tháo máy.",
        "**Lưu ý khi bán**: Khi chào mã mật độ cao 32/64 điểm (QX42, QY41P) phải hỏi khách đã có giắc cắm hoặc cầu đấu ngoài chưa."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Sa Giang, BA, TQ",
      "image": "assets/images/mitsubishi/plc_q_series.webp"
    },
    {
      "id": 12,
      "cat": "Biến tần",
      "subcat": "Biến tần tải nhẹ kinh tế cỡ nhỏ",
      "serial": "FREQROL FR-D700 ➔ D800",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "FR-D720-0.75K/1.5K/2.2K",
        "FR-D740-0.75K/1.5K/2.2K/3.7K/5.5K/7.5K",
        "FR-D720S-0.75K"
      ],
      "replacement": "FR-D800 (FR-D820 / FR-D840 có lớp phủ -60)",
      "software": "FR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/inv/pmerit/fr_d800/index.html",
      "points": [
        "**Bản chất**: Điều khiển V/F và Vector từ thông tổng quát, quá tải 150% 60s, tích hợp biến trở núm xoay.",
        "**Ứng dụng**: Băng tải nhỏ, máy khuấy, bơm cấp thoát nước mini, quạt hút thông gió, đóng gói.",
        "**Giai đoạn khai tử**: Hãng ngừng sản xuất D700 chuyển sang D800; đặt mới D700 chờ rất lâu (5-6 tháng).",
        "**Tư vấn Sales**: Thuyết phục khách sang D800 có phủ lớp sơn bảo vệ chống ẩm hóa chất (mã đuôi -60)."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long (kho sẵn nhiều D700/D800) | Tuyến 2: Sa Giang, DACO, TQ",
      "image": "assets/images/mitsubishi/inv_fr_d700.webp"
    },
    {
      "id": 13,
      "cat": "Biến tần",
      "subcat": "Biến tần đa năng tải trung hiệu năng cao",
      "serial": "FREQROL FR-E700 ➔ E800",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "FR-E720-0.75K/1.5K/2.2K",
        "FR-E740-0.75K/1.5K/2.2K/3.7K/5.5K/7.5K/11K/15K",
        "FR-E840-0.75K-1",
        "FR-E840-1.5K-1"
      ],
      "replacement": "FR-E800 Series (FR-E820 / FR-E840 đuôi -1 hoặc -E)",
      "software": "FR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/inv/pmerit/fr_e800/index.html",
      "points": [
        "**Bản chất**: Vector từ thông momen khởi động 200% ở 0.5Hz; dòng E800 tích hợp 2 cổng Ethernet kết nối trực tiếp.",
        "**Ứng dụng**: Máy ép viên thức ăn, máy kéo sợi dệt, băng tải tải nặng, máy chế biến gỗ.",
        "**KHAI TỬ 100%**: E700 đã ngừng sản xuất; khách hỏi mua E700 BẮT BUỘC TƯ VẤN SANG E800.",
        "**Chọn mã chuẩn**: Bản tiêu chuẩn chọn đuôi -1 (như FR-E840-1.5K-1); bản Ethernet chọn đuôi -E."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Sa Giang, Hải Âu, BA, TQ (nặng cước)",
      "image": "assets/images/mitsubishi/inv_fr_e800.webp"
    },
    {
      "id": 14,
      "cat": "Biến tần",
      "subcat": "Biến tần cao cấp tải siêu nặng & Cẩu trục",
      "serial": "FREQROL FR-A700 ➔ A800",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "FR-A720-5.5K",
        "FR-A740-3.7K/7.5K",
        "FR-A840-0.75K đến 500K",
        "FR-A842-185K~500K"
      ],
      "replacement": "FR-A800 Series (FR-A820 / FR-A840)",
      "software": "FR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/inv/pmerit/fr_a800/index.html",
      "points": [
        "**Bản chất**: Real Sensorless Vector & Vector vòng kín Encoder; quá tải 200% trong 60s; an toàn PLd / SIL2.",
        "**Ứng dụng**: Cẩu trục cảng biển, tời kéo khai khoáng, máy đùn nhựa công suất lớn, cán thép, máy ly tâm.",
        "**TẢI NẶNG ĐỈNH CAO**: A700 đã ngừng SX, chuyển sang A800; không có hàng làm giả bo mạch.",
        "**Lưu ý cẩu trục**: Khi chào cẩu trục nâng hạ phải hỏi khách có lắp điện trở xả hoặc bộ hãm FR-BU2 không."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Sa Giang, Hải Âu, Duy Hưng",
      "image": "assets/images/mitsubishi/inv_fr_a800.webp"
    },
    {
      "id": 15,
      "cat": "Biến tần",
      "subcat": "Biến tần chuyên dụng tiết kiệm điện Bơm/Quạt HVAC",
      "serial": "FREQROL FR-F800 Series",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "FR-F820-0.75K đến 110K",
        "FR-F840-0.75K đến 560K"
      ],
      "replacement": "Dòng F800 hiện hành tối tân cho hệ HVAC/Bơm",
      "software": "FR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/inv/pmerit/fr_f800/index.html",
      "points": [
        "**Bản chất**: Thuật toán tối ưu năng lượng AOEC tiết kiệm điện tối đa; điều khiển đa bơm luân phiên tới 4 bơm.",
        "**Ứng dụng**: Trạm bơm cấp nước đô thị, chiller điều hòa tòa nhà, quạt hút thông gió đường hầm.",
        "**CHUYÊN BIỆT TẢI BIẾN THIÊN**: Tuyệt đối không chào F800 cho cẩu trục vì momen thiết kế riêng cho bơm/quạt.",
        "**Thị trường**: Không có fake bo mạch; hàng thanh lý từ các tòa nhà hoặc trạm xử lý nước được renew khá nhiều."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: Duy Hưng, Sa Giang, TQ",
      "image": "assets/images/mitsubishi/inv_fr_a800.webp"
    },
    {
      "id": 16,
      "cat": "HMI",
      "subcat": "Màn hình cảm ứng kinh tế bán chạy số 1",
      "serial": "GOT SIMPLE GS2000 Series",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "GS2107-WTBD-N",
        "GS2110-WTBD-N"
      ],
      "replacement": "Dòng GS2000 thế hệ mới (bản đuôi -N)",
      "software": "GT Designer3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/hmi/got/pmerit/got_simple/index.html",
      "points": [
        "**Bản chất**: TFT LCD 65k màu WVGA 800x480; tích hợp sẵn 1 Ethernet RJ45, 1 RS-232, 1 RS-422/485, khe SD, USB mini.",
        "**Ứng dụng**: Màn hình điều khiển tủ máy tiêu chuẩn, hiển thị báo lỗi, cài đặt thông số máy móc.",
        "**TOP 1 DOANH SỐ**: GS2107-WTBD-N là mã HMI bán chạy nhất tại VN; KHÔNG CÓ FAKE, CÓ RENEW tháo máy.",
        "**Thực chiến mua**: DACO NHẬP TRỰC TIẾP nên giá cực kỳ tốt; cẩn trọng nguồn Toàn Cầu chất lượng không ổn định."
      ],
      "suppliers": "Tuyến 1: DACO (giá cực tốt - nhập trực tiếp), Phạm Dương, Hợp Long, Kovi | Tuyến 2: Toàn Cầu, Hải Âu, BA",
      "image": "assets/images/mitsubishi/hmi_gs2000.webp"
    },
    {
      "id": 17,
      "cat": "HMI",
      "subcat": "Màn hình cảm ứng cỡ nhỏ chi phí tối thiểu",
      "serial": "GOT2000 GT21 Series",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "GT2103-PMBD",
        "GT2103-PMBDS",
        "GT2104-RTBD",
        "GT2105-QTBDS",
        "GT2107-WTBD"
      ],
      "replacement": "GT21 Series hiện hành hoặc GS2107",
      "software": "GT Designer3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/hmi/got/pmerit/got2000/gt21/index.html",
      "points": [
        "**Bản chất**: Kích thước nhỏ gọn 3.8-5.7 inch; chuẩn chống bụi nước IP67F mặt trước; chi phí thấp.",
        "**Ứng dụng**: Bảng nút bấm ảo thay thế dàn nút cơ, trạm thao tác máy công cụ nhỏ, dây chuyền test linh kiện.",
        "**Đặc điểm**: Tính năng cơ bản, thay thế đồng hồ kim cơ; không có hàng fake; thị trường chỉ có tồn kho hoặc renew."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: TQ, Hải Âu, BA",
      "image": "assets/images/mitsubishi/hmi_gs2000.webp"
    },
    {
      "id": 18,
      "cat": "HMI",
      "subcat": "Màn hình cảm ứng đời cũ (Đã ngừng sản xuất)",
      "serial": "GT23 / GT1000 Series",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "GT2308-VTBA",
        "GT2310-VTBA",
        "GT2308-VTBD",
        "GT2310-VTBD",
        "GT1050-QBBD",
        "GT1150-QLBD",
        "GT1275-VNBA",
        "GT1675-VNBA"
      ],
      "replacement": "Nâng cấp lên GT25 (nếu cấu hình cao) hoặc GS2000 / GT21",
      "software": "GT Designer3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/hmi/got/index.html",
      "points": [
        "**Bản chất**: Từng là phân khúc tầm trung chủ lực, đầy đủ cổng RS-232, RS-422, Ethernet.",
        "**Lý do ngừng SX**: Thiếu vi mạch điện tử chính nên Mitsubishi dừng sản xuất dòng GT23.",
        "**Tư vấn Sales**: Chuyển sang GT25 (nếu cần đồ họa cao) hoặc GS2107/GS2110 (nếu muốn tối ưu chi phí).",
        "**Thị trường**: Không có fake; chỉ còn hàng bãi cũ renew hoặc hàng tồn kho các đại lý."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi (hàng bãi/tồn) | Tuyến 2: Kênh TQ, Toàn Cầu, Hải Âu",
      "image": "assets/images/mitsubishi/hmi_gt25.webp"
    },
    {
      "id": 19,
      "cat": "HMI",
      "subcat": "Màn hình cảm ứng phân khúc cao cấp & Đồ họa nặng",
      "serial": "GOT2000 GT25 / GT27 Series",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "GT2505-VTBD",
        "GT2508-VTBA/VTBD",
        "GT2510-VTBA/VTBD",
        "GT2512-STBA/STBD",
        "GT2708-VTBD",
        "GT2710-VTBD",
        "GT2715-XTBD"
      ],
      "replacement": "Dòng GOT2000 Flagship cao cấp nhất",
      "software": "GT Designer3",
      "brochure": "https://www.mitsubishielectric.com/fa/products/hmi/got/pmerit/got2000/gt25/index.html",
      "points": [
        "**Bản chất**: TFT LCD 65k màu cao cấp, bộ nhớ 32MB-57MB; hỗ trợ xem trực tiếp tài liệu PDF, video hướng dẫn, VNC/Web Server.",
        "**Ứng dụng**: Dây chuyền phòng sạch dược phẩm, F&B, trạm giám sát trung tâm điều hành.",
        "**Đặc điểm**: KHÔNG CÓ HÀNG FAKE; hàng renew chủ yếu từ các nhà máy FDI điện tử thanh lý.",
        "**Lưu ý điện áp**: Kiểm tra kỹ đuôi -A (100-240VAC) hay -D (24VDC) để tránh khách cắm nhầm cháy nguồn."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Kovi, Hợp Long | Tuyến 2: DACO, Hải Âu, TQ",
      "image": "assets/images/mitsubishi/hmi_gt25.webp"
    },
    {
      "id": 20,
      "cat": "Servo",
      "subcat": "Bộ khuếch đại Servo đời cũ (Đã ngừng sản xuất)",
      "serial": "MR-J2S / MR-J3 / MR-JN Series",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "MR-J2S-10A/20A/40A/60A/100A",
        "MR-J3-10A/20A/40A/70A/100A",
        "MR-JN-10A/20A/40A"
      ],
      "replacement": "Thay thế đồng bộ cả bộ sang MR-J4 hoặc MR-JE",
      "software": "MR Configurator",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/servo/index.html",
      "points": [
        "**Bản chất**: Servo amplifier kinh điển thế hệ trước; bản -A phát xung/analog; bản -B mạng SSCNET.",
        "**Ứng dụng**: Máy CNC, robot gắp phôi, máy cắt nhãn, dán màng.",
        "**CẢNH BÁO SỐNG CÒN**: J2S và J3 đã khai tử; KHÔNG THỂ thay riêng lẻ Driver J4 vào Motor HF của J2S/J3 cũ (khác chuẩn Encoder).",
        "**Nguyên tắc**: BẮT BUỘC PHẢI THAY ĐỒNG BỘ CẢ DRIVER VÀ MOTOR sang dòng J4 hoặc JE!"
      ],
      "suppliers": "Tuyến 1: Kovi, Phạm Dương (tồn kho) | Tuyến 2: Kênh TQ (chuyên renew J2S/J3), Toàn Cầu",
      "image": "assets/images/mitsubishi/servo_mr_j4.webp"
    },
    {
      "id": 21,
      "cat": "Servo",
      "subcat": "Bộ khuếch đại Servo thông dụng hiện hành",
      "serial": "MR-J4 & MR-JE Series",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "MR-J4-10A/20A/40A/60A/70A/100A/200A",
        "MR-J4-10B/20B/40B/60B/100B",
        "MR-JE-10A/20A/40A/70A/100A/200A/300A",
        "MR-JE-10B/20B/40B/70B/100B"
      ],
      "replacement": "Dòng hiện hành chủ lực; Đang phát triển nâng lên MR-J5",
      "software": "MR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/servo/pmerit/mr_j4/index.html",
      "points": [
        "**Bản chất**: MR-J4 Encoder 22-bit (4 triệu xung/vòng), đáp ứng 2.5kHz, One-Touch Tuning; MR-JE là dòng kinh tế giá cạnh tranh.",
        "**Ứng dụng**: Máy khắc laser, máy quấn dây motor, cơ cấu cam điện tử, in bao bì.",
        "**LƯU Ý XUẤT XỨ**: Hàng nhập từ TQ đa số Made in China (nhà máy Wuxi); hàng đại lý VN đa số Made in Japan.",
        "**Thực chiến**: KHÔNG CÓ FAKE, CÓ RENEW; FDI Nhật/Hàn chỉ nhận hàng Japan kèm CO/CQ gốc."
      ],
      "suppliers": "Tuyến 1: Phạm Dương, Hợp Long, Kovi, Sa Giang | Tuyến 2: Kênh TQ (giá rất cạnh tranh), BA",
      "image": "assets/images/mitsubishi/servo_mr_j4.webp"
    },
    {
      "id": 22,
      "cat": "Servo",
      "subcat": "Bộ khuếch đại Servo thế hệ mới siêu tốc",
      "serial": "MR-J5 Series (MELSEC iQ-R & TSN)",
      "status": "Mới",
      "fake": "Không",
      "renew": "Không",
      "models": [
        "MR-J5-10A/20A/40A/70A/100A",
        "MR-J5-10B/20B/40B/100B",
        "MR-J5-10G/20G/40G/100G"
      ],
      "replacement": "Thế hệ Servo đỉnh cao nhất hiện nay",
      "software": "MR Configurator2 (iQ Edition)",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/servo/pmerit/mr_j5/index.html",
      "points": [
        "**Bản chất**: Encoder 26-bit (67 triệu xung/vòng), đáp ứng 3.5kHz; mạng CC-Link IE TSN micro giây; tích hợp AI chuẩn đoán hỏng hóc cơ khí.",
        "**Ứng dụng**: Dây chuyền bán dẫn, lắp ráp smartphone, gia công siêu chính xác.",
        "**Đặc điểm**: Hoàn toàn KHÔNG CÓ FAKE, CHƯA CÓ RENEW; giá thành cao.",
        "**Đặt hàng**: Yêu cầu đặt hàng theo dự án kèm động cơ đồng bộ thế hệ mới HK Series và cáp quang."
      ],
      "suppliers": "Tuyến 1: Kovi, Phạm Dương, Hợp Long, Sa Giang | Tuyến 2: Hãng Mitsubishi Electric VN",
      "image": "assets/images/mitsubishi/servo_mr_j4.webp"
    },
    {
      "id": 23,
      "cat": "Servo",
      "subcat": "Động cơ Servo xoay chiều đời cũ (Đã ngừng sản xuất)",
      "serial": "HF-KP / HF-SP / HF-JP / HF-KN",
      "status": "Ngừng sx",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "HF-KP13/23/43/73",
        "HF-SP52/102/152/202",
        "HF-KN13/23/43/73"
      ],
      "replacement": "HG-KR, HG-SR, HG-KN (Bắt buộc thay cả bộ gồm Driver + Cáp)",
      "software": "MR Configurator",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/servo/index.html",
      "points": [
        "**Bản chất**: Động cơ AC Servo nam châm vĩnh cửu; Encoder 17-bit hoặc 18-bit; quán tính thấp (KP) và trung bình (SP).",
        "**Thực trạng**: Đã khai tử hoàn toàn; 100% thị trường là động cơ cũ tháo máy bãi hoặc tồn kho.",
        "**QUY TẮC BẮT BUỘC**: Không thể thay lẻ động cơ HG mới vào Driver J2S/J3 cũ.",
        "**Giải pháp**: Thuyết phục khách chuyển đổi sang bộ J4 + motor HG-KR hoặc JE + motor HG-KN."
      ],
      "suppliers": "Tuyến 1: Kovi, Phạm Dương (tồn kho cũ) | Tuyến 2: Kênh TQ (chuyên renew động cơ cũ), Toàn Cầu",
      "image": "assets/images/mitsubishi/servo_motor_hg.webp"
    },
    {
      "id": 24,
      "cat": "Servo",
      "subcat": "Động cơ Servo thông dụng & Dòng có phanh (-B)",
      "serial": "HG-KR / HG-SR / HG-KN / Phanh (-B)",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Có",
      "models": [
        "HG-KR13/23/43/73",
        "HG-SR52/102/152/202",
        "HG-KN13/23/43",
        "HG-KR13B",
        "HG-KR23B",
        "HG-SR102B"
      ],
      "replacement": "Dòng HG Series hiện hành (Đi kèm MR-J4 và MR-JE)",
      "software": "MR Configurator2",
      "brochure": "https://www.mitsubishielectric.com/fa/products/drv/servo/pmerit/mr_j4/index.html",
      "points": [
        "**Bản chất**: Quán tính nhỏ HG-KR (3000-6000 rpm) và trung bình HG-SR (1000-3000 rpm); chuẩn chống bụi nước IP65/IP67.",
        "**Dòng có phanh (-B)**: Tích hợp phanh từ hãm giữ trục 24VDC, chuyên dùng cho trục Z thẳng đứng chống rơi tự do khi mất điện.",
        "**Vận chuyển**: Motor trên 1kW rất nặng (7-20kg), vận chuyển TQ RẤT DỄ BỊ MÓP MÉO HỘP, VỠ GIẮC NỐI HOẶC CONG TRỤC.",
        "**Lợi thế giá**: Motor dưới 1kW Hợp Long và Phạm Dương giá cực kỳ tốt và luôn có sẵn kho."
      ],
      "suppliers": "Tuyến 1: Hợp Long (giá rất tốt motor <1kW), Phạm Dương, Kovi | Tuyến 2: Sa Giang, Kênh TQ",
      "image": "assets/images/mitsubishi/servo_motor_hg.webp"
    },
    {
      "id": 25,
      "cat": "Đóng cắt",
      "subcat": "Aptomat khối MCCB, MCB, ELCB, Contactor & Rơ le nhiệt",
      "serial": "NF / BH-D / NV / CP30 / S-T / TH-T",
      "status": "Thông dụng",
      "fake": "Không",
      "renew": "Không",
      "models": [
        "NF30-CS",
        "NF63-CV",
        "NF125-CV",
        "NF250-CV",
        "NF400-CW",
        "BH-D6",
        "BH-D10",
        "NV30-CS",
        "NV63-CV",
        "NV125-CV",
        "CP30-BA",
        "S-T10",
        "S-T12",
        "S-T20",
        "S-T21",
        "S-T25",
        "S-T32",
        "S-T50",
        "TH-T18",
        "TH-T25",
        "TH-T50"
      ],
      "replacement": "Dòng thiết bị đóng cắt hạ thế tiêu chuẩn quốc tế của Mitsubishi",
      "software": "Không dùng phần mềm",
      "brochure": "https://www.mitsubishielectric.com/fa/products/lvd/lvcb/index.html",
      "points": [
        "**Bản chất**: MCCB dòng cắt Icu tới 50kA; Contactor S-T dùng tiếp điểm chống hàn dính độc quyền Mitsubishi vận hành êm ái.",
        "**Ứng dụng**: Tủ điện phân phối tổng MSB, tủ động lực điều khiển bơm/quạt/motor nhà xưởng công nghiệp.",
        "**100% KHÔNG CÓ HÀNG FAKE** đối với dòng đóng cắt Mitsubishi chính hãng tại các đại lý miền Bắc.",
        "**LƯU Ý ELCB**: Bắt buộc hỏi rõ dòng rò mA (15mA, 30mA hay dải điều chỉnh 100-500mA) vì lệch dòng rò là đại lý báo sai mã.",
        "**Chiết khấu tốt nhất**: Duy Hưng và Hợp Long là 2 đơn vị có mức chiết khấu đóng cắt cao nhất miền Bắc."
      ],
      "suppliers": "Tuyến 1: Duy Hưng (chuyên gia chiết khấu cao), Hợp Long (tổng kho lớn) | Tuyến 2: Nghĩa Phong Hân, Phạm Dương, DTECH, BA",
      "image": "assets/images/mitsubishi/mccb_nf.webp"
    }
  ],
  "treeData": [
    {
      "id": "cat-plc",
      "name": "Bộ Điều Khiển Lập Trình (PLC)",
      "filterCat": "PLC",
      "icon": "⚡",
      "tier": "Phổ thông, Tiêu chuẩn & Cao cấp hệ thống lớn",
      "application": "Điều khiển logic máy tự động độc lập, máy đóng gói, chiết rót, băng tải, hệ thống SCADA và dây chuyền sản xuất lớn.",
      "description": "Bộ não điều khiển trung tâm trong mọi dây chuyền tự động hóa Mitsubishi.",
      "series": [
        {
          "id": "fx5u",
          "name": "FX5U / FX5UC (MELSEC iQ-F)",
          "lookupKeyword": "FX5U",
          "tier": "Tiêu chuẩn thế hệ mới (Thay thế FX3U)",
          "application": "Máy công nghiệp chế tạo, đóng gói tốc độ cao, xử lý tín hiệu analog tích hợp, kết nối mạng IoT Ethernet.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/plc_fx5u.webp",
          "namingRule": {
            "example": "FX5U-32MT/ES",
            "standardDoc": "MELSEC iQ-F FX5U User's Manual (Hardware) - JY997D55301",
            "breakdown": [
              {
                "part": "FX5U-",
                "title": "Dòng CPU (Series)",
                "desc": "Khối CPU cơ bản MELSEC iQ-F thế hệ mới, tích hợp Ethernet & 2 kênh Analog vào / 1 kênh Analog ra."
              },
              {
                "part": "32",
                "title": "Tổng Số Điểm I/O",
                "desc": "Tổng 32 điểm I/O tích hợp sẵn trên khối CPU (16 ngõ vào Input / 16 ngõ ra Output)."
              },
              {
                "part": "M",
                "title": "Loại Khối (Unit Type)",
                "desc": "M = Khối CPU chính (Main Unit) tích hợp sẵn vi xử lý và bộ nguồn."
              },
              {
                "part": "T",
                "title": "Loại Ngõ Ra (Output Type)",
                "desc": "T = Transistor tốc độ cao (phát xung điều khiển vị trí); R = Relay tiếp điểm cơ khí (chịu dòng 2A)."
              },
              {
                "part": "/ES",
                "title": "Nguồn & Logic Ngõ Vào/Ra",
                "desc": "E = Nguồn AC 100-240V; S = Ngõ vào 24VDC hỗ trợ cả Sink/Source, ngõ ra Transistor Sink (NPN). (/ESS = Transistor Source PNP; /DS = Nguồn DC 24V Sink)."
              }
            ]
          },
          "warnings": "⚠️ Cảnh báo thực chiến: Thị trường có nguy cơ hàng FAKE / Bo mạch copy nhái hoặc hàng cũ Renew dựng lại vỏ. Ưu tiên cấp FX5U chính hãng thay thế cho FX3U.",
          "commonModels": [
            "FX5U-32MT/ES",
            "FX5U-32MR/ES",
            "FX5U-64MT/ES",
            "FX5U-64MR/ES",
            "FX5U-80MT/ES"
          ],
          "replacement": "Thay thế nâng cấp trực tiếp cho FX3U / FX2N cũ."
        },
        {
          "id": "fx3u",
          "name": "FX3U / FX3G / FX3S (MELSEC-F Kinh điển)",
          "lookupKeyword": "FX3U",
          "tier": "Dòng chuyển tiếp / Chạy máy cũ",
          "application": "Dây chuyền sản xuất truyền thống, nâng cấp và bảo trì máy đang chạy ổn định.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/plc_fx3u.webp",
          "namingRule": {
            "example": "FX3U-48MR/ES-A",
            "standardDoc": "MELSEC-F FX3U Series Hardware Manual - JY997D16501",
            "breakdown": [
              {
                "part": "FX3U-",
                "title": "Dòng CPU (Series)",
                "desc": "Họ vi điều khiển Compact PLC MELSEC-F thế hệ 3 kinh điển."
              },
              {
                "part": "48",
                "title": "Tổng Điểm I/O",
                "desc": "Tổng cộng 48 điểm Vào/Ra trên khối chính (24 Input / 24 Output)."
              },
              {
                "part": "M",
                "title": "Khối Cơ Bản (Unit Type)",
                "desc": "M = Main Unit (Khối CPU chính tích hợp nguồn)."
              },
              {
                "part": "R",
                "title": "Kiểu Ngõ Ra (Output)",
                "desc": "R = Ngõ ra Relay (tiếp điểm khô chịu dòng); T = Ngõ ra Transistor."
              },
              {
                "part": "/ES-A",
                "title": "Nguồn & Tiêu Chuẩn Quốc Tế",
                "desc": "E = Nguồn điện lưới AC 100-240V; S = Ngõ vào Sink/Source; -A = Bản đạt chuẩn quốc tế CE/UL."
              }
            ]
          },
          "warnings": "⚠️ Cảnh báo thực chiến: Thị trường có cực kỳ nhiều hàng FAKE bo mạch làm giả chip STM32 và hàng Renew tháo máy. Cần đối chiếu tem nhãn và bo mạch.",
          "commonModels": [
            "FX3U-16MT/ES",
            "FX3U-32MT/ES",
            "FX3U-48MT/ES",
            "FX3U-64MT/ES",
            "FX3U-80MT/ES"
          ],
          "replacement": "Khi thay thế hoặc làm máy mới, khuyến nghị chuyển sang FX5U."
        },
        {
          "id": "q_series",
          "name": "Q Series (MELSEC-Q Modular)",
          "lookupKeyword": "Q0",
          "tier": "Cao cấp hệ thống lớn (Dạng Module ghép)",
          "application": "Dây chuyền tự động hóa quy mô lớn, nhà máy lắp ráp linh kiện ô tô, điện tử, xử lý hàng chục nghìn điểm I/O.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/plc_q_series.webp",
          "namingRule": {
            "example": "Q03UDVCPU",
            "standardDoc": "QCPU User's Manual (Hardware Design and Maintenance) - SH-080483ENG",
            "breakdown": [
              {
                "part": "Q",
                "title": "Họ MELSEC-Q",
                "desc": "Hệ thống điều khiển tự động hóa dạng thanh Rack cắm Module ghép linh hoạt."
              },
              {
                "part": "03",
                "title": "Dung Lượng Bộ Nhớ (Memory)",
                "desc": "03 = 30k bước lệnh chương trình (00J = 8k, 01 = 15k, 02 = 20k, 04 = 40k, 06 = 60k, 13 = 130k bước)."
              },
              {
                "part": "UD",
                "title": "Kiểu CPU (Universal QCPU)",
                "desc": "Universal Model QCPU đa năng tốc độ cao, hỗ trợ đa CPU (tối đa 4 CPU trên cùng 1 rack base)."
              },
              {
                "part": "V",
                "title": "Thế Hệ Tốc Độ Cao (High-Speed)",
                "desc": "V = High-speed generation (chu kỳ lệnh cơ bản chỉ 1.9ns), tích hợp sẵn cổng Ethernet 100BASE-TX & mini-USB."
              },
              {
                "part": "CPU",
                "title": "Module Xử Lý Trung Tâm",
                "desc": "Module CPU tính toán điều khiển độc lập gắn trên Base Unit."
              }
            ]
          },
          "warnings": "🔄 Cảnh báo thực chiến: Hàng Q Series không có hàng FAKE nhưng có rủi ro hàng Renew/tháo máy tồn kho date cũ.",
          "commonModels": [
            "Q01UCPU",
            "Q02UCPU",
            "Q03UDVCPU",
            "Q04UDVCPU",
            "Q06UDVCPU",
            "Q13UDVCPU"
          ],
          "replacement": "Thế hệ kế thừa tương lai là dòng MELSEC iQ-R."
        },
        {
          "id": "fx1n_fx2n",
          "name": "FX1N / FX2N / FX1S (Đã Khai Tử)",
          "lookupKeyword": "FX1N",
          "tier": "Đã ngừng sản xuất (Legacy)",
          "application": "Chỉ dùng để bảo trì máy cũ nhập khẩu từ Nhật, Châu Âu trước năm 2015.",
          "status": "Ngừng sx",
          "image": "assets/images/mitsubishi/plc_fx3u.webp",
          "namingRule": {
            "example": "FX2N-48MT-001",
            "standardDoc": "FX2N Series Hardware Manual - JY992D66301",
            "breakdown": [
              {
                "part": "FX2N-",
                "title": "Dòng Cũ Khai Tử",
                "desc": "Thế hệ PLC ra đời năm 1997, chính thức ngừng sản xuất (EOL) từ 2015."
              },
              {
                "part": "48",
                "title": "Tổng Số Điểm I/O",
                "desc": "48 điểm I/O tích hợp (24 Input / 24 Output)."
              },
              {
                "part": "M",
                "title": "Khối CPU Chính",
                "desc": "Main Unit tích hợp CPU và cổng nạp RS-422 tròn Mini-DIN 8 chân."
              },
              {
                "part": "T",
                "title": "Ngõ Ra Transistor",
                "desc": "T = Transistor Sink (NPN); R = Relay cơ khí."
              }
            ]
          },
          "warnings": "🛑 100% hàng trên thị trường hiện nay là hàng Fake bo mạch Trung Quốc hoặc Renew dựng lại vỏ. Bắt buộc tư vấn khách đổi sang FX3G hoặc FX5U.",
          "commonModels": [
            "FX1N-24MT",
            "FX1N-40MT",
            "FX2N-32MT",
            "FX2N-48MT",
            "FX2N-64MT"
          ],
          "replacement": "Thay thế bằng FX3G hoặc FX5U (chú ý chuyển đổi sơ đồ dây và code phần mềm)."
        }
      ]
    },
    {
      "id": "cat-hmi",
      "name": "Màn Hình Cảm Ứng HMI (GOT Series)",
      "filterCat": "HMI",
      "icon": "🖥️",
      "tier": "Kinh tế GS2000, Cơ bản GT21, Trung/Cao cấp GT25, Cao cấp GT27",
      "application": "Giao diện cảm ứng vận hành máy, cài đặt thông số công nghệ, đồ thị giám sát thời gian thực, lưu trữ lịch sử báo lỗi.",
      "description": "Màn hình công nghiệp bền bỉ, DACO nhập khẩu trực tiếp dòng GS2000 giá cực tốt.",
      "series": [
        {
          "id": "gs2000",
          "name": "GOT Simple GS2000 (GS2107 / GS2110)",
          "lookupKeyword": "GS21",
          "tier": "Phổ thông kinh tế (DACO nhập trực tiếp giá cực tốt)",
          "application": "Máy chế tạo độc lập, máy đóng gói, trạm bơm nước, giao diện trực quan chi phí hợp lý.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/hmi_gs2000.webp",
          "namingRule": {
            "example": "GS2107-WTBD-N",
            "standardDoc": "GOT SIMPLE Series User's Manual (Hardware) - JY997D52901",
            "breakdown": [
              {
                "part": "GS",
                "title": "Dòng Màn Hình (Series)",
                "desc": "GOT SIMPLE Series - Màn hình cảm ứng công nghiệp phân khúc kinh tế của Mitsubishi."
              },
              {
                "part": "21",
                "title": "Thế Hệ Phần Cứng",
                "desc": "Thế hệ 21 hiệu năng cao, tích hợp cổng Ethernet, RS-232, RS-422/485 và khe thẻ nhớ SD."
              },
              {
                "part": "07",
                "title": "Kích Thước Màn Hình (Display Size)",
                "desc": "07 = 7.0 inch (độ phân giải WVGA 800x480); 10 = 10.1 inch (độ phân giải WSVGA 1024x600)."
              },
              {
                "part": "-W",
                "title": "Tỉ Lệ Khung Hình (Aspect Ratio)",
                "desc": "W = Widescreen (màn hình góc rộng tỉ lệ 16:9)."
              },
              {
                "part": "T",
                "title": "Công Nghệ Màn Hình",
                "desc": "T = TFT color LCD (hiển thị 65,536 màu sắc nét, đèn nền LED tuổi thọ 50,000 giờ)."
              },
              {
                "part": "B",
                "title": "Màu Viền Mặt Trước (Bezel Color)",
                "desc": "B = Màu đen (Black); W = Màu trắng (White)."
              },
              {
                "part": "D",
                "title": "Nguồn Điện Cấp (Power Supply)",
                "desc": "D = Nguồn điện một chiều 24V DC (A = Nguồn điện xoay chiều 100-240V AC)."
              },
              {
                "part": "-N",
                "title": "Bản Cải Tiến (New Release)",
                "desc": "Phiên bản phần cứng nâng cấp mới nhất, thay thế cho mã không có đuôi -N cũ."
              }
            ]
          },
          "warnings": "⭐ DACO là đơn vị nhập trực tiếp, có giá cực kỳ cạnh tranh và lượng tồn kho dồi dào cho các nhà tích hợp chế tạo máy.",
          "commonModels": [
            "GS2107-WTBD-N",
            "GS2110-WTBD-N"
          ],
          "replacement": "Lựa chọn hàng đầu thay thế cho màn hình GT1050/GT1150 cũ và các hãng khác."
        },
        {
          "id": "gt25",
          "name": "GOT2000 GT25 Series (Kế Thừa GT23)",
          "lookupKeyword": "GT25",
          "tier": "Trung / Cao cấp công nghiệp",
          "application": "Dây chuyền sản xuất tiêu chuẩn cao, hỗ trợ nhiều cổng truyền thông, thẻ nhớ SD, Ethernet kép.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/hmi_gt25.webp",
          "namingRule": {
            "example": "GT2508-VTBA",
            "standardDoc": "GOT2000 Series User's Manual (Hardware) - SH-081194ENG",
            "breakdown": [
              {
                "part": "GT",
                "title": "Dòng GOT (Graphic Terminal)",
                "desc": "Graphic Operation Terminal - Màn hình giao diện vận hành đồ họa Mitsubishi."
              },
              {
                "part": "25",
                "title": "Phân Khúc Model (Model Group)",
                "desc": "GT25 = Dòng tiêu chuẩn hiệu năng cao Standard Model (kế thừa dòng GT23 đã ngừng SX; GT27 = Cao cấp nhất; GT21 = Nhỏ gọn)."
              },
              {
                "part": "08",
                "title": "Kích Thước Màn Hình",
                "desc": "05 = 5.7 inch; 08 = 8.4 inch; 10 = 10.4 inch; 12 = 12.1 inch."
              },
              {
                "part": "V",
                "title": "Độ Phân Giải (Resolution)",
                "desc": "V = VGA (640x480 pixels); S = SVGA (800x600 pixels); X = XGA (1024x768 pixels)."
              },
              {
                "part": "T",
                "title": "Màn Hình Hiển Thị",
                "desc": "T = Màn hình màu TFT LCD 65k màu."
              },
              {
                "part": "B",
                "title": "Màu Khung Mặt Trước",
                "desc": "B = Khung màu đen công nghiệp (Black); W = Khung màu trắng phòng sạch (White)."
              },
              {
                "part": "A",
                "title": "Nguồn Cấp (Power Supply)",
                "desc": "A = Nguồn xoay chiều AC 100-240V (D = Nguồn một chiều DC 24V)."
              }
            ]
          },
          "warnings": "GT23 đã ngừng sản xuất do khan hiếm linh kiện vi mạch -> Khách hàng chuyển đổi hoàn toàn sang GT25.",
          "commonModels": [
            "GT2508-VTBA",
            "GT2508-VTBD",
            "GT2510-VTBA",
            "GT2510-VTBD",
            "GT2512-STBA"
          ],
          "replacement": "Thay thế chính thức cho GT2308, GT2310."
        },
        {
          "id": "gt27",
          "name": "GOT2000 GT27 Series",
          "lookupKeyword": "GT27",
          "tier": "Cao cấp nhất (Flagship)",
          "application": "Các dự án phòng sạch, nhà máy điện tử bán dẫn, điều khiển cảm ứng đa điểm như tablet, xuất video HDMI.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/hmi_gt25.webp",
          "namingRule": {
            "example": "GT2710-STBD",
            "standardDoc": "GOT2000 Series User's Manual (Hardware) - SH-081194ENG",
            "breakdown": [
              {
                "part": "GT",
                "title": "Họ Graphic Terminal",
                "desc": "Màn hình giao diện điều khiển HMI cao cấp nhất của Mitsubishi Electric."
              },
              {
                "part": "27",
                "title": "Phân Khúc Flagship Cao Cấp",
                "desc": "GT27 = Dòng cao cấp nhất hỗ trợ thao tác cảm ứng đa điểm (Multi-touch / Gesture), tích hợp cổng ngõ ra HDMI/Video."
              },
              {
                "part": "10",
                "title": "Kích Thước Màn Hình",
                "desc": "08 = 8.4 inch; 10 = 10.4 inch; 12 = 12.1 inch; 15 = 15.0 inch."
              },
              {
                "part": "S",
                "title": "Độ Phân Giải Màn Hình",
                "desc": "S = SVGA (800x600 pixels); X = XGA (1024x768 pixels); V = VGA (640x480 pixels)."
              },
              {
                "part": "T",
                "title": "Hiển Thị Màu TFT",
                "desc": "TFT LCD màu 65,536 màu với bộ lọc chống chói bề mặt."
              },
              {
                "part": "BD",
                "title": "Khung & Nguồn Cấp",
                "desc": "B = Màu viền đen (Black); D = Nguồn cấp DC 24V (BA = Nguồn AC 100-240V)."
              }
            ]
          },
          "warnings": "Giá thành cao, tính năng phong phú, chủ yếu dùng trong các dây chuyền lớn có yêu cầu khắt khe.",
          "commonModels": [
            "GT2708-VTBD",
            "GT2710-STBA",
            "GT2710-STBD",
            "GT2712-STBD",
            "GT2715-XTBA"
          ],
          "replacement": "Đỉnh cao công nghệ HMI Mitsubishi."
        }
      ]
    },
    {
      "id": "cat-inv",
      "name": "Biến Tần Inverter (FREQROL Series)",
      "filterCat": "Biến tần",
      "icon": "🔄",
      "tier": "Tải nhẹ (D700/D800), Tải trung (E700/E800), Tải nặng (A700/A800), Bơm quạt (F800)",
      "application": "Điều khiển tốc độ động cơ không đồng bộ 3 pha, tiết kiệm năng lượng, bảo vệ động cơ chống kẹt và sụt áp.",
      "description": "Thương hiệu biến tần uy tín hàng đầu thị trường về khả năng chịu tải và độ bền vượt trội.",
      "series": [
        {
          "id": "fr_e800",
          "name": "FREQROL FR-E800 (Tải Trung Đa Năng - Thế Hệ Mới)",
          "lookupKeyword": "E800",
          "tier": "Tiêu chuẩn thế hệ mới (Thay thế FR-E700)",
          "application": "Máy chế biến gỗ, dệt may, băng tải thông minh, máy ép nhựa, tích hợp sẵn truyền thông mạng không cần card mở rộng.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/inv_fr_e800.webp",
          "namingRule": {
            "example": "FR-E820-0.75K-1",
            "standardDoc": "FREQROL-E800 Instruction Manual (Detailed) - IB-0600868ENG",
            "breakdown": [
              {
                "part": "FR-E8",
                "title": "Dòng Biến Tần (Series)",
                "desc": "FREQROL-E800 thế hệ mới - Dòng biến tần đa năng nhỏ gọn thông minh thay thế cho FR-E700."
              },
              {
                "part": "2",
                "title": "Cấp Điện Áp (Voltage Class)",
                "desc": "2 = Cấp điện áp 200V (3P 200-240V); 4 = Cấp điện áp 400V (3P 380-480V); 1 = Cấp 100V."
              },
              {
                "part": "0",
                "title": "Pha Nguồn Vào (Input Phase)",
                "desc": "0 = Nguồn vào 3 pha (Three-phase); S = Nguồn vào 1 pha 200V (Single-phase 200V); W = 1 pha 100V."
              },
              {
                "part": "-0.75K",
                "title": "Công Suất Định Mức (Capacity)",
                "desc": "0.75 kW (tương đương 1 HP; chuẩn quốc tế ký hiệu bằng 10 lần dòng định mức: 0030 = 3.0A ND)."
              },
              {
                "part": "-1",
                "title": "Giao Tiếp & Tiêu Chuẩn",
                "desc": "-1 = Bản tiêu chuẩn trang bị cổng RS-485 Modbus RTU (Terminal FM); -E = Bản tích hợp 2 cổng Ethernet kép (CC-Link IE TSN / Modbus TCP / EtherNet/IP); -SCE = Bản an toàn Safety."
              }
            ]
          },
          "warnings": "⭐ DACO khuyến nghị khách hàng thiết kế máy mới chọn ngay FR-E800 thay vì FR-E700 cũ đã ngưng sản xuất.",
          "commonModels": [
            "FR-E820-0.4K-1",
            "FR-E820-0.75K-1",
            "FR-E820-1.5K-1",
            "FR-E840-0.75K-1",
            "FR-E840-1.5K-1",
            "FR-E840-2.2K-1",
            "FR-E840-3.7K-1",
            "FR-E840-5.5K-1"
          ],
          "replacement": "Thay thế hoàn hảo cho FR-E720 và FR-E740."
        },
        {
          "id": "fr_d700",
          "name": "FREQROL FR-D700 & D800 (Tải Nhẹ Kinh Tế)",
          "lookupKeyword": "D700",
          "tier": "Kinh tế tải nhẹ",
          "application": "Băng tải nhỏ, quạt hút, máy cuốn dây đơn giản, máy khuấy sơn, cửa tự động.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/inv_fr_d700.webp",
          "namingRule": {
            "example": "FR-D740-2.2K-CHT",
            "standardDoc": "FREQROL-D700 Instruction Manual (Detailed) - IB-0600403ENG",
            "breakdown": [
              {
                "part": "FR-D7",
                "title": "Dòng Biến Tần (Series)",
                "desc": "FREQROL-D700 - Dòng biến tần tải nhẹ cỡ nhỏ kinh tế bán chạy số 1 của Mitsubishi."
              },
              {
                "part": "4",
                "title": "Cấp Điện Áp (Voltage)",
                "desc": "4 = 3 Pha 380V - 480V AC; 2 = 3 Pha 200V - 240V AC; 1 = 1 Pha 100V."
              },
              {
                "part": "0",
                "title": "Số Pha Nguồn Vào",
                "desc": "0 = Nguồn vào 3 pha; S = Nguồn vào 1 pha 200-240V (FR-D720S)."
              },
              {
                "part": "-2.2K",
                "title": "Công Suất Motor (kW)",
                "desc": "Công suất định mức động cơ 2.2 kW (3 HP)."
              },
              {
                "part": "-CHT",
                "title": "Thị Trường & Phiên Bản",
                "desc": "-CHT = Phiên bản sản xuất cho thị trường Châu Á/Trung Quốc; -EC = Phiên bản Châu Âu; -NA = Bắc Mỹ; -60 = Bản có phủ keo chống ẩm bo mạch."
              }
            ]
          },
          "warnings": "D700 đang dần chuyển giao sang D800. Khi thay D800 cần lưu ý thêm dòng định mức và tùy chọn phủ bo mạch bảo vệ (-60).",
          "commonModels": [
            "FR-D720-0.4K",
            "FR-D720-0.75K",
            "FR-D740-0.75K",
            "FR-D740-1.5K",
            "FR-D740-2.2K",
            "FR-D740-3.7K"
          ],
          "replacement": "Thế hệ thay thế kế thừa là FR-D800."
        },
        {
          "id": "fr_a800",
          "name": "FREQROL FR-A800 (Tải Nặng Cực Hạn)",
          "lookupKeyword": "A800",
          "tier": "Cao cấp tải nặng (Heavy Duty)",
          "application": "Cầu trục, palang nâng hạ, máy đùn cao su, máy kéo thép, máy nghiền đá, thang hàng tốc độ cao.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/inv_fr_a800.webp",
          "namingRule": {
            "example": "FR-A840-3.7K",
            "standardDoc": "FREQROL-A800 Instruction Manual (Detailed) - IB-0600503ENG",
            "breakdown": [
              {
                "part": "FR-A8",
                "title": "Dòng Flagship Tải Nặng",
                "desc": "FREQROL-A800 - Dòng biến tần điều khiển Vector tải nặng cao cấp nhất của Mitsubishi Electric."
              },
              {
                "part": "4",
                "title": "Cấp Điện Áp Nguồn",
                "desc": "4 = 3 Pha 380V - 500V AC (50/60Hz); 2 = 3 Pha 200V - 240V AC."
              },
              {
                "part": "0",
                "title": "Số Pha Nguồn Vào",
                "desc": "0 = Nguồn cấp 3 pha công nghiệp."
              },
              {
                "part": "-3.7K",
                "title": "Công Suất Động Cơ (kW)",
                "desc": "3.7 kW (tải nặng ND), hỗ trợ 4 cấp tải (SLD/LD/ND/HND), khả năng chịu quá tải lên tới 250% trong 3 giây."
              }
            ]
          },
          "warnings": "Thay thế cho dòng FR-A700 cũ đã ngưng sản xuất. Cần kiểm tra kỹ kích thước lắp đặt khi thay thế tủ điện cũ.",
          "commonModels": [
            "FR-A840-2.2K",
            "FR-A840-3.7K",
            "FR-A840-5.5K",
            "FR-A840-7.5K",
            "FR-A840-11K",
            "FR-A840-15K",
            "FR-A840-22K"
          ],
          "replacement": "Thay thế cho FR-A740 và FR-A720."
        }
      ]
    },
    {
      "id": "cat-servo",
      "name": "Bộ Điều Khiển & Động Cơ AC Servo (MELSERVO)",
      "filterCat": "Servo",
      "icon": "⚙️",
      "tier": "Tiêu chuẩn MR-JE, Đa năng chủ lực MR-J4, Thế hệ mới TSN MR-J5",
      "application": "Điều khiển vị trí, tốc độ và góc quay chính xác cao trong máy đóng gói, cánh tay robot, máy khắc CNC, máy dán nhãn.",
      "description": "Hệ thống truyền động chính xác micro-giây, phản hồi encoder độ phân giải lên đến 26-bit.",
      "series": [
        {
          "id": "mr_j4",
          "name": "Bộ Khuếch Đại Servo MR-J4 Series",
          "lookupKeyword": "MR-J4",
          "tier": "Chủ lực đa năng thông dụng nhất",
          "application": "Các trục điều khiển chuyển động chính xác cao trong máy công nghiệp, máy dán nhãn, máy cắt cuộn.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/servo_mr_j4.webp",
          "namingRule": {
            "example": "MR-J4-40B",
            "standardDoc": "MELSERVO-J4 Servo Amplifier Instruction Manual - SH-030106ENG",
            "breakdown": [
              {
                "part": "MR-J4-",
                "title": "Dòng Servo Driver (Series)",
                "desc": "Hệ thống truyền động xoay chiều AC Servo MELSERVO-J4 thế hệ 4 chủ lực đa năng."
              },
              {
                "part": "40",
                "title": "Công Suất Định Mức Driver",
                "desc": "40 = 400 Watt (0.4 kW) (10 = 100W, 20 = 200W, 60 = 600W, 70 = 750W, 100 = 1.0 kW, 200 = 2.0 kW, 350 = 3.5 kW, 500 = 5.0 kW, 700 = 7.0 kW)."
              },
              {
                "part": "B",
                "title": "Phương Thức Giao Tiếp Điều Khiển",
                "desc": "B = Điều khiển mạng cáp quang tốc độ cao SSCNET III/H (0.222ms); A = Điều khiển Xung / Điện áp Analog (Pulse train / Analog); GF = Mạng CC-Link IE Field; TM = Đa mạng mở (EtherCAT/Profinet)."
              }
            ]
          },
          "warnings": "Có 2 xuất xứ chính trên thị trường: Made in Japan và Made in China. Khi chuyển đổi từ J2S, J3 sang J4 cần chú ý kích thước gá lắp.",
          "commonModels": [
            "MR-J4-10A",
            "MR-J4-20A",
            "MR-J4-40A",
            "MR-J4-70A",
            "MR-J4-100A",
            "MR-J4-20B",
            "MR-J4-40B",
            "MR-J4-70B"
          ],
          "replacement": "Kế thừa cho MR-J2S và MR-J3 đã ngừng sản xuất."
        },
        {
          "id": "hg_kr",
          "name": "Động Cơ Servo HG-KR / HG-SR Series",
          "lookupKeyword": "HG-KR",
          "tier": "Động cơ đồng bộ cho Driver MR-J4",
          "application": "Truyền động trục máy, quán tính thấp tăng tốc cực nhanh, định vị độ chính xác cao.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/servo_motor_hg.webp",
          "namingRule": {
            "example": "HG-KR43B",
            "standardDoc": "HG-KR/HG-SR Rotary Servo Motor Instruction Manual - SH-030113ENG",
            "breakdown": [
              {
                "part": "HG-KR",
                "title": "Dòng Động Cơ Servo (Series)",
                "desc": "HG-KR = Dòng động cơ quán tính thấp (Low Inertia), gia tốc cực nhanh (HG-SR = Quán tính trung bình Medium Inertia)."
              },
              {
                "part": "4",
                "title": "Công Suất Định Mức Motor",
                "desc": "4 = 400 Watt (05 = 50W, 1 = 100W, 2 = 200W, 4 = 400W, 7 = 750W)."
              },
              {
                "part": "3",
                "title": "Tốc Độ Định Mức (Rated Speed)",
                "desc": "3 = Tốc độ quay định mức 3000 vòng/phút (r/min) (tốc độ tối đa lên đến 6000 r/min)."
              },
              {
                "part": "B",
                "title": "Tùy Chọn Phanh Giữ (Brake)",
                "desc": "B = Tích hợp phanh điện từ hãm giữ trục khi mất nguồn; Trống (không có B) = Trục trơn tiêu chuẩn không có phanh."
              }
            ]
          },
          "warnings": "Động cơ trên 1kW khối lượng rất nặng, cần đóng gói và vận chuyển cẩn thận để tránh gãy vỡ hộp và móp méo đầu trục.",
          "commonModels": [
            "HG-KR13",
            "HG-KR23",
            "HG-KR43",
            "HG-KR73",
            "HG-KR43B",
            "HG-KR73B",
            "HG-SR102",
            "HG-SR202"
          ],
          "replacement": "Thay thế cho dòng động cơ HF-KP và HF-SP cũ."
        },
        {
          "id": "mr_je",
          "name": "Bộ Khuếch Đại & Động Cơ MR-JE (Kinh Tế)",
          "lookupKeyword": "MR-JE",
          "tier": "Kinh tế / Tiêu chuẩn cơ bản",
          "application": "Các trục phụ, băng chuyền, máy đóng gói kinh tế, thay thế dòng MR-JN cũ.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/servo_mr_j4.webp",
          "namingRule": {
            "example": "MR-JE-40A",
            "breakdown": [
              {
                "part": "MR-JE-",
                "title": "Dòng JE",
                "desc": "Dòng servo kinh tế giá tốt"
              },
              {
                "part": "40",
                "title": "Công suất",
                "desc": "400W (Đi kèm motor HG-KN43 hoặc HG-SN)"
              },
              {
                "part": "A",
                "title": "Điều khiển",
                "desc": "A = Xung / Analog; B = SSCNET III/H; C = Modbus RTU / Ethernet"
              }
            ]
          },
          "warnings": "Dưới 1kW DACO và các đối tác có giá cực kỳ cạnh tranh, cạnh tranh trực tiếp với servo Đài Loan / Hàn Quốc.",
          "commonModels": [
            "MR-JE-10A",
            "MR-JE-20A",
            "MR-JE-40A",
            "MR-JE-70A",
            "MR-JE-100A"
          ],
          "replacement": "Thay thế cho dòng MR-JN đã ngừng sản xuất."
        }
      ]
    },
    {
      "id": "cat-switchgear",
      "name": "Thiết Bị Đóng Cắt Hạ Thế (Low-Voltage Switchgear)",
      "filterCat": "Đóng cắt",
      "icon": "🛡️",
      "tier": "Công nghiệp nặng & Tủ điện phân phối dân dụng/công nghiệp",
      "application": "Bảo vệ quá tải, ngắn mạch, chống dòng rò bảo vệ người, đóng cắt động cơ trong tủ điện hạ thế.",
      "description": "100% thiết bị đóng cắt Mitsubishi chính hãng không có hàng giả, độ tin cậy tuyệt đối.",
      "series": [
        {
          "id": "mccb_nf",
          "name": "Aptomat Khối MCCB NF Series",
          "lookupKeyword": "NF",
          "tier": "Đóng cắt khối bảo vệ công nghiệp",
          "application": "Aptomat tổng (Incomer) và phân phối nhánh trong tủ điện nhà xưởng, tòa nhà, trạm biến áp.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/mccb_nf.webp",
          "namingRule": {
            "example": "NF125-CV 3P 100A",
            "standardDoc": "Mitsubishi Low Voltage Circuit Breakers Catalog - Y-0694",
            "breakdown": [
              {
                "part": "NF",
                "title": "Dòng Aptomat Khối (No-Fuse Breaker)",
                "desc": "NF = No-Fuse Breaker (Aptomat khối MCCB chống quá tải & ngắn mạch; NV = ELCB chống dòng rò; BH-D = MCB tép)."
              },
              {
                "part": "125",
                "title": "Khung Dòng Điện Định Mức (AF - Ampere Frame)",
                "desc": "125 AF = Kích thước khung dòng tối đa 125A (các cỡ khung chuẩn: 30AF, 63AF, 125AF, 250AF, 400AF, 630AF, 800AF)."
              },
              {
                "part": "-CV",
                "title": "Phân Khúc Hiệu Năng (Class Type)",
                "desc": "-CV = Dòng kinh tế tiêu chuẩn (Economy Class, dòng cắt Icu 30kA); -SV = Dòng tiêu chuẩn công nghiệp (Standard); -HV = Dòng cắt ngắn mạch cao (High-fault)."
              },
              {
                "part": "3P",
                "title": "Số Cực Pha (Poles)",
                "desc": "3P = 3 Cực bảo vệ lưới điện 3 pha (2P = 2 Cực 1 pha; 4P = 4 Cực 3 pha 4 dây có trung tính)."
              },
              {
                "part": "100A",
                "title": "Dòng Cắt Định Mức (In / AT - Ampere Trip)",
                "desc": "Dòng định mức bảo vệ tác động nhiệt-từ: 100A (dải dòng chế tạo: 16A, 20A, 32A, 40A, 50A, 63A, 80A, 100A, 125A)."
              }
            ]
          },
          "warnings": "⭐ Điểm mạnh tuyệt đối: Thiết bị đóng cắt Mitsubishi trên thị trường KHÔNG CÓ HÀNG FAKE, chất lượng được chứng thực toàn cầu.",
          "commonModels": [
            "NF30-CS 3P 30A",
            "NF63-CV 3P 50A",
            "NF63-CV 3P 63A",
            "NF125-CV 3P 100A",
            "NF125-CV 3P 125A",
            "NF250-CV 3P 200A",
            "NF250-CV 3P 250A"
          ],
          "replacement": "Tiêu chuẩn vàng cho tủ điện công nghiệp."
        },
        {
          "id": "contactor_st",
          "name": "Khởi Động Từ Contactor S-T & Rơ Le Nhiệt TH-T",
          "lookupKeyword": "S-T",
          "tier": "Điều khiển đóng ngắt động cơ",
          "application": "Điều khiển khởi động trực tiếp (DOL) hoặc sao-tam giác cho động cơ 3 pha bơm, quạt, máy nén.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/contactor_st.webp",
          "namingRule": {
            "example": "S-T21 AC220V",
            "standardDoc": "Mitsubishi Magnetic Motor Starters MS-T Series Catalog - L-02035",
            "breakdown": [
              {
                "part": "S-T",
                "title": "Dòng Khởi Động Từ (Magnetic Contactor)",
                "desc": "S-T = Dòng khởi động từ nhỏ gọn thế hệ mới (thay thế dòng S-N cũ); M-T = Cụm khởi động từ có gắn sẵn rơ le nhiệt TH-T."
              },
              {
                "part": "21",
                "title": "Cỡ Khung Định Mức (Frame Size)",
                "desc": "21 = Cỡ khung dòng làm việc định mức 22A (tải AC-3 động cơ 11kW ở 380V) (các cỡ: 10, 11, 12, 20, 21, 25, 35, 50, 65, 80, 100)."
              },
              {
                "part": "AC220V",
                "title": "Điện Áp Định Mức Cuộn Hút (Coil Voltage)",
                "desc": "AC220V 50/60Hz = Cuộn hút kích hoạt bằng điện áp AC 200-240V (các cấp điện áp khác: AC110V, AC380V, DC24V)."
              }
            ]
          },
          "warnings": "Khi báo giá Contactor cần lưu ý hỏi thêm khách hàng có lấy kèm Rơ le nhiệt (TH-T) hay không và dải chỉnh dòng (A) bao nhiêu.",
          "commonModels": [
            "S-T10 AC220V",
            "S-T12 AC220V",
            "S-T20 AC220V",
            "S-T21 AC220V",
            "S-T25 AC220V",
            "TH-T18 7-11A",
            "TH-T25 12-18A"
          ],
          "replacement": "Thay thế chính thức cho dòng Contactor S-N cũ."
        }
      ]
    },
    {
      "id": "cat-module",
      "name": "Module Truyền Thông & Mở Rộng I/O",
      "filterCat": "Module",
      "icon": "🌐",
      "tier": "Mở rộng hệ thống linh hoạt",
      "application": "Kết nối mạng công nghiệp Ethernet, Modbus, CC-Link IE, thu thập tín hiệu cảm biến nhiệt độ áp suất Analog.",
      "description": "Mở rộng khả năng kết nối mạng và I/O tín hiệu cho PLC dòng FX và dòng Q.",
      "series": [
        {
          "id": "mod_comm",
          "name": "Module Truyền Thông Ethernet & CC-Link (FX & Q)",
          "lookupKeyword": "FX Comms",
          "tier": "Mạng truyền thông công nghiệp",
          "application": "Truyền nhận dữ liệu giữa nhiều PLC, kết nối máy tính giám sát SCADA, kết nối Remote I/O.",
          "status": "Thông dụng",
          "image": "assets/images/mitsubishi/comm_module.webp",
          "namingRule": {
            "example": "FX5-ENET / QJ71E71-100",
            "breakdown": [
              {
                "part": "FX5-ENET",
                "title": "Tên Module",
                "desc": "Module mạng Ethernet cho PLC dòng FX5"
              },
              {
                "part": "QJ71E71",
                "title": "Dòng Q",
                "desc": "Card Ethernet tốc độ 100Mbps cắm trên rack dòng Q"
              },
              {
                "part": "QJ61BT11N",
                "title": "CC-Link",
                "desc": "Master/Local station cho mạng mạng CC-Link"
              }
            ]
          },
          "warnings": "Dòng FX3U-ENET và các module cũ thường có hàng renew/tháo máy, cần kiểm tra kỹ cổng RJ45 và bo mạch.",
          "commonModels": [
            "FX5-ENET",
            "FX3U-ENET-L",
            "QJ71E71-100",
            "QJ61BT11N",
            "AJ65SBTB1-16D"
          ],
          "replacement": "Tích hợp mạng IoT nhà máy thông minh."
        }
      ]
    }
  ],
  "suppliersDirectory": [
    {
      "id": "kovifa",
      "name": "Công ty TNHH KOVIFA VINA (Covifa / Kovi)",
      "shortName": "Kovi / Covifa",
      "badge": "Nhà Phân Phối Cấp 1 Chính Thức",
      "badgeType": "badge-green",
      "website": "https://kovifa.vn",
      "phone": "0222 386 3888 / info@kovifa.vn",
      "address": "Trụ sở Bắc Ninh (KCN Quế Võ / Đình Bảng) & Văn phòng Hà Nội, Hải Phòng",
      "legalInfo": "Doanh nghiệp thành lập từ năm 2015, là Đại lý phân phối chính thức của Mitsubishi Electric FA (Factory Automation) tại Việt Nam.",
      "keyStrengths": "PLC Q Series, iQ-R Series, FX5U, Biến tần công suất lớn, Dự án nhà máy FDI",
      "pros": "Pháp lý chuẩn 100%, CO/CQ cấp trực tiếp từ Mitsubishi Electric Việt Nam; Giá dự án có bảo hộ tốt; Tồn kho dòng cao cấp tốt nhất.",
      "cons": "Quy trình báo giá và công nợ cứng nhắc; Không linh hoạt cho đơn hàng nhỏ lẻ; Lead time đặt hàng nhà máy dài.",
      "buyingGuide": "Ưu tiên số 1 cho các đơn thầu lớn, nhà máy FDI Nhật/Hàn yêu cầu nghiệm thu CO/CQ gốc chính ngạch, thiết bị cao cấp dòng Q/R.",
      "matchTokens": [
        "kovi",
        "covifa",
        "kovifa"
      ]
    },
    {
      "id": "hop_long",
      "name": "Công ty Cổ phần Công nghệ Hợp Long (Hoplongtech)",
      "shortName": "Hợp Long",
      "badge": "Đại Lý Cấp 1 - Tổng Kho Lớn Nhất Miền Bắc",
      "badgeType": "badge-blue",
      "website": "https://hoplongtech.com",
      "phone": "1900 6536 / contact@hoplong.com",
      "address": "Tòa nhà Hợp Long, 87 Lĩnh Nam, Hoàng Mai, Hà Nội (Chi nhánh: TP.HCM, Hải Phòng, Đà Nẵng, Cần Thơ)",
      "legalInfo": "Hơn 15 năm kinh nghiệm, đơn vị phân phối thiết bị tự động hóa công nghiệp và thiết bị đóng cắt hạ thế hàng đầu miền Bắc.",
      "keyStrengths": "Thiết bị đóng cắt (MCCB NF, MCB BH-D, Contactor S-T), PLC FX5U, Biến tần D740/E840",
      "pros": "Tổng kho lớn nhất miền Bắc, hàng phổ thông luôn có sẵn hàng trăm chiếc; Chiết khấu thiết bị đóng cắt và biến tần cực tốt; Giao hàng hỏa tốc trong ngày.",
      "cons": "Hàng chuyên biệt (dòng Q hiếm, Servo tải nặng trên 3kW) ít tồn kho; Giờ cao điểm xuất hóa đơn có thể chậm.",
      "buyingGuide": "Ưu tiên số 1 khi cần lấy hàng gấp trong ngày các mã thông dụng (NF, BH-D, S-T, D740, FX5U-32MT); Check giá song song với Duy Hưng để đàm phán chiết khấu tốt nhất.",
      "matchTokens": [
        "hợp long",
        "hop long",
        "hoplong",
        "hl",
        "hồng long"
      ]
    },
    {
      "id": "pham_duong",
      "name": "Công ty Cổ phần Sản xuất và Thương mại Phạm Dương (Phạm Dương JSC)",
      "shortName": "Phạm Dương",
      "badge": "Đại Lý Cấp 1 Năng Động - Kho Sẵn",
      "badgeType": "badge-blue",
      "website": "https://phamduongjsc.com.vn",
      "phone": "0974.596.569 – 0945.627.188 – 0976.844.195",
      "address": "Số 27, hẻm 201/12/20 đường Phúc Lợi, tổ 6, phường Phúc Lợi, Long Biên, Hà Nội",
      "legalInfo": "Doanh nghiệp thương mại kỹ thuật chuyên sâu về PLC, HMI, biến tần, servo Mitsubishi, Omron, Delta tại Hà Nội.",
      "keyStrengths": "PLC FX3U/FX5U, HMI GS2107/GS2110, Biến tần D700/E800, Servo MR-JE/J4",
      "pros": "Báo giá siêu nhanh (dưới 15 phút); Tồn kho đa dạng cả dòng mới lẫn một số mã date cũ khó kiếm; Hỗ trợ công nợ linh hoạt cho khách quen.",
      "cons": "Bộ phận kho đôi khi nhầm lẫn giữa mã đuôi Relay (-MR) và Transistor (-MT), hoặc nhầm điện áp 1 pha và 3 pha; Cần người mua kiểm tra kỹ mã khi nhận hàng.",
      "buyingGuide": "Đơn vị chiến lược cho các đơn mua lẻ, đơn cần gấp trong 2 giờ tại nội thành Hà Nội; Phải chốt mã chi tiết bằng văn bản kèm ảnh chụp tem nhãn trước khi xuất kho.",
      "matchTokens": [
        "phạm dương",
        "pham duong",
        "pd"
      ]
    },
    {
      "id": "daco",
      "name": "Công ty TNHH Kỹ Thuật Tự Động DACO (DACO Auto)",
      "shortName": "DACO Nhập Trực Tiếp",
      "badge": "Đơn Vị Nhập Khẩu Trực Tiếp HMI",
      "badgeType": "badge-green",
      "website": "https://daco.vn",
      "phone": "0904.182.235 / 0989.286.139",
      "address": "Số 146 Cầu Bươu, Tân Triều, Thanh Trì, Hà Nội",
      "legalInfo": "Đơn vị nhập khẩu trực tiếp container số lượng lớn màn hình cảm ứng Mitsubishi GOT SIMPLE GS2000 phục vụ chế tạo máy và tủ điện.",
      "keyStrengths": "Màn hình cảm ứng HMI Mitsubishi GOT SIMPLE GS2107-WTBD-N, GS2110-WTBD-N",
      "pros": "Nhập khẩu trực tiếp từ nhà máy nên giá màn hình GS2000 cực kỳ cạnh tranh, rẻ hơn các đại lý khác từ 3-7%; Sẵn hàng hàng trăm chiếc trong kho.",
      "cons": "Chỉ tập trung mảng HMI, không stock phong phú các dòng PLC cao cấp hoặc Servo; Chính sách công nợ với khách mới khá chặt chẽ.",
      "buyingGuide": "Mua màn hình HMI GS2107-WTBD-N và GS2110-WTBD-N ƯU TIÊN HỎI DACO ĐẦU TIÊN để có giá gốc tốt nhất phục vụ chào thầu cạnh tranh.",
      "matchTokens": [
        "daco"
      ]
    },
    {
      "id": "duy_hung",
      "name": "Công ty TNHH Thương mại và Dịch vụ Thiết bị Điện Duy Hưng",
      "shortName": "Duy Hưng",
      "badge": "Đại Lý Cấp 1 Chuyên Sâu Đóng Cắt",
      "badgeType": "badge-blue",
      "website": "https://duyhung.vn",
      "phone": "Hotline kinh doanh thiết bị điện hạ thế",
      "address": "Hà Nội",
      "legalInfo": "Đại lý phân phối thiết bị điện công nghiệp, chuyên sâu giải pháp thiết bị đóng cắt bảo vệ mạch Mitsubishi Electric.",
      "keyStrengths": "Aptomat MCCB (NF), MCB (BH-D), Chống rò ELCB (NV), Contactor S-T, ACB",
      "pros": "Mức chiết khấu thiết bị đóng cắt hạ thế thuộc hàng cao nhất miền Bắc; Tồn kho dải dòng định mức rất sâu (từ 6A đến 800A).",
      "cons": "Không mạnh về mảng Tự động hóa điều khiển (PLC, HMI, Servo ít stock hàng); Hỗ trợ tư vấn kỹ thuật điều khiển hạn chế.",
      "buyingGuide": "Chỉ tập trung mua thiết bị đóng cắt, bảo vệ mạch tại đây để lấy biên lợi nhuận cao nhất; Tuyệt đối chú ý dòng rò mA khi hỏi mua ELCB.",
      "matchTokens": [
        "duy hưng",
        "duy hung"
      ]
    },
    {
      "id": "sa_giang",
      "name": "Công ty TNHH Thương mại Sa Giang (Sa Giang Co., Ltd)",
      "shortName": "Sa Giang",
      "badge": "Đại Lý Phân Phối Chính Thức - Chuyên Sâu Servo",
      "badgeType": "badge-green",
      "website": "https://sagiangvn.com",
      "phone": "(028) 3943 1568 / 69 / 70",
      "address": "Tầng 11, Tòa nhà Ree, Số 9 Đoàn Văn Bơ, Phường 12, Quận 4, TP.HCM",
      "legalInfo": "Thành lập từ 1997, đại lý phân phối chính thức của Mitsubishi Electric, được sự hỗ trợ trực tiếp từ tập đoàn Setsuyo Astec (Mitsubishi Electric Group).",
      "keyStrengths": "Bộ điều khiển Servo MR-JE, MR-J4, MR-J5, Động cơ HG/HK, Cáp đúc Servo chuyên dụng",
      "pros": "Nắm rất sâu kỹ thuật điều khiển vị trí; Stock sẵn nhiều mã Driver và Motor công suất vừa/nhỏ; Có sẵn cáp đúc Encoder/Power chuẩn công nghiệp.",
      "cons": "Giá một số dòng PLC phổ thông không cạnh tranh bằng tổng kho miền Bắc; Tồn kho biến tần công suất lớn không nhiều.",
      "buyingGuide": "Hỏi giá và tư vấn giải pháp Servo trọn gói (Driver + Motor + Cáp nguồn cáp encoder 3m/5m/10m); Cứu cánh khi các đại lý khác hết hàng Servo.",
      "matchTokens": [
        "sa giang"
      ]
    },
    {
      "id": "toan_cau",
      "name": "Công ty Cổ phần Tự Động Hóa Toàn Cầu (Global Automation JSC)",
      "shortName": "Toàn Cầu",
      "badge": "Kênh Cung Ứng Đa Năng & Hàng Bãi Thay Thế",
      "badgeType": "badge-amber",
      "website": "https://tudonghoatoancau.com",
      "phone": "0912.119.901 / 0961.320.333",
      "address": "Lô 17-F1 KĐT Đại Kim, Định Công, Hoàng Mai, Hà Nội",
      "legalInfo": "Đơn vị thương mại và dịch vụ kỹ thuật tự động hóa, cung cấp thiết bị thay thế và sửa chữa PLC, biến tần, servo.",
      "keyStrengths": "Hàng thay thế bảo trì, dòng cũ ngừng SX (FX1N, FX2N, E700, A700, MR-J2S), sửa chữa bo mạch",
      "pros": "Khả năng gom và săn các mã hàng đã khai tử rất tốt; Có nguồn hàng tháo máy cũ đáp ứng nhu cầu sửa máy gấp với chi phí rẻ.",
      "cons": "Chất lượng không đồng đều; Nhiều sản phẩm là hàng Renew sơn vỏ lại; Tiềm ẩn rủi ro bo mạch đã qua sửa chữa; Bảo hành ngắn (1-3 tháng).",
      "buyingGuide": "Chỉ mua khi khách hàng nhất quyết không chịu nâng cấp máy lên model mới và chấp nhận mua hàng bãi/renew; BẮT BUỘC test kỹ tại chỗ trước khi nhận hàng.",
      "matchTokens": [
        "toàn cầu",
        "toan cau"
      ]
    },
    {
      "id": "kenh_bai_tq",
      "name": "Kênh Bãi Trung Quốc & Chợ Thâm Quyến (China Surplus / Spot Market)",
      "shortName": "Kênh Bãi TQ / Hàng Tháo Máy",
      "badge": "Kênh Tiểu Ngạch & Hàng Bãi Dự Phòng",
      "badgeType": "badge-red",
      "website": "Tiểu ngạch / Sàn 1688 / Taobao / Đối tác Thâm Quyến",
      "phone": "Kênh nhập khẩu tiểu ngạch",
      "address": "Thâm Quyến, Quảng Đông, Trung Quốc",
      "legalInfo": "Kênh nhập khẩu trực tiếp từ các chợ linh kiện điện tử Thâm Quyến hoặc nhà máy nội địa Trung Quốc.",
      "keyStrengths": "Mã hiếm, linh kiện ngừng sản xuất 15-20 năm (A-Series, FX0N, FX2N, MR-J2S/J3, motor cũ), bo mạch thay thế",
      "pros": "Giá thành rẻ hơn hàng chính ngạch 15-30%; Mã gì cũng có thể tìm được kể cả linh kiện đã ngừng sản xuất lâu năm.",
      "cons": "Thời gian vận chuyển 5-10 ngày; Rủi ro cao về hàng Fake bo mạch giả chip STM32; Động cơ nặng dễ móp méo va đập khi vận chuyển; Đổi trả bảo hành rất khó khăn.",
      "buyingGuide": "Chỉ dùng làm kênh dự phòng khi toàn bộ thị trường Việt Nam đứt hàng, hoặc khách hàng chấp nhận giá rẻ không cần hóa đơn VAT/CO/CQ. Bắt buộc mở nắp kiểm tra bo mạch thật/giả ngay khi nhận hàng.",
      "matchTokens": [
        "kênh bãi tq",
        "kênh tq",
        "tq",
        "bãi tq"
      ]
    },
    {
      "id": "hai_au",
      "name": "Công ty TNHH Tự Động Hóa Hải Âu (Hai Au Automation)",
      "shortName": "Hải Âu",
      "badge": "Đại Lý Cung Ứng & Tích Hợp Miền Nam",
      "badgeType": "badge-blue",
      "website": "https://haiau.com.vn",
      "phone": "Hotline hỗ trợ kỹ thuật và bán hàng",
      "address": "TP. Hồ Chí Minh",
      "legalInfo": "Đơn vị cung cấp biến tần, thiết bị tự động hóa và tích hợp hệ thống tủ điện tại TP.HCM.",
      "keyStrengths": "Biến tần Mitsubishi, PLC FX, giải pháp tủ biến tần điều khiển bơm quạt",
      "pros": "Hàng sẵn kho khu vực phía Nam, đội ngũ kỹ sư hỗ trợ cài đặt và chuyển giao công nghệ tốt.",
      "cons": "Nếu giao hàng ra các tỉnh phía Bắc mất thời gian vận chuyển 2-3 ngày.",
      "buyingGuide": "Ưu tiên hợp tác khi có khách hàng hoặc công trình thi công tại các KCN Bình Dương, Đồng Nai, Long An, TP.HCM.",
      "matchTokens": [
        "hải âu",
        "hai au"
      ]
    },
    {
      "id": "bao_ha",
      "name": "Công ty Cổ phần Thiết bị Điện Bảo Hà (Bao Ha Electric)",
      "shortName": "Bảo Hà (BA)",
      "badge": "Đại Lý Thiết Bị Điện & Tủ Bảng Điện",
      "badgeType": "badge-blue",
      "website": "https://baoha.vn",
      "phone": "Hotline thiết bị điện công nghiệp",
      "address": "Hà Nội",
      "legalInfo": "Doanh nghiệp chuyên phân phối thiết bị đóng cắt hạ thế, vật tư cơ điện và phụ kiện tủ bảng điện.",
      "keyStrengths": "Aptomat MCCB, MCB, phụ kiện tủ điện công nghiệp",
      "pros": "Hàng chính hãng, CO/CQ đầy đủ phục vụ nghiệm thu dự án tủ điện cơ điện M&E.",
      "cons": "Mảng tự động hóa PLC/HMI/Servo không có sẵn dải sản phẩm phong phú.",
      "buyingGuide": "Thích hợp đặt mua cùng lúc với các vật tư phụ kiện vỏ tủ, thanh đồng, đèn báo, nút nhấn khi thi công trọn gói tủ điện.",
      "matchTokens": [
        "ba",
        "bảo hà",
        "bao ha"
      ]
    },
    {
      "id": "mitsubishi_vn",
      "name": "Công ty TNHH Mitsubishi Electric Việt Nam (Hãng MEVN)",
      "shortName": "Hãng Mitsubishi Electric VN",
      "badge": "Hãng Sản Xuất Trực Tiếp",
      "badgeType": "badge-green",
      "website": "https://www.mitsubishi-electric.vn",
      "phone": "(028) 3910 5945 / (024) 3937 8075",
      "address": "Tầng 11 & 12, Tòa nhà Viettel, 285 Cách Mạng Tháng 8, P.12, Q.10, TP.HCM & Chi nhánh Hà Nội, Đà Nẵng",
      "legalInfo": "Pháp nhân chính thức của Tập đoàn Mitsubishi Electric tại Việt Nam.",
      "keyStrengths": "Bảo hành chính hãng, tài liệu kỹ thuật gốc, hỗ trợ kỹ thuật cấp cao, bảo hộ dự án cấp tập đoàn",
      "pros": "Độ tin cậy tuyệt đối, chuyên gia hãng hỗ trợ đào tạo và xử lý sự cố phức tạp nhất.",
      "cons": "Không bán trực tiếp cho người dùng lẻ, bắt buộc phân phối qua kênh đại lý ủy quyền.",
      "buyingGuide": "Liên hệ hãng khi cần đào tạo chuyên sâu, đăng ký bảo hộ dự án FDI quy mô lớn hoặc yêu cầu xác thực nguồn gốc chứng nhận CO/CQ.",
      "matchTokens": [
        "hãng mitsubishi electric vn",
        "hãng mitsubishi",
        "mevn"
      ]
    }
  ]
};
