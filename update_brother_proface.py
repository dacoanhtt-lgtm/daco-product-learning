# -*- coding: utf-8 -*-
"""
Script Chuẩn Hóa Toàn Diện Dữ Liệu 2 Thương Hiệu: BROTHER & PRO-FACE
Đạt 100% tiêu chuẩn cấu trúc của Mitsubishi Electric và Qlight trong Web Portal:
1. Catalog Products Table (đầy đủ bản chất, thông số, cảnh báo thực chiến, tư vấn sales, phụ kiện)
2. Tree Hierarchy (treeData) phân nhóm sâu sắc, trực quan
3. Naming Rules & Code Breakdown chi tiết từng ký tự theo Catalog / User Manual chính thức
4. History Lineage sơ đồ tiến hóa dòng đời sản phẩm
5. Software Ecosystem & Brochures chính hãng
6. Suppliers Directory (Hồ sơ nhà cung cấp có thật: VP TECH, DACO, KHUÊ TÚ, AN PHÁT, HỢP LONG, NHÂN HÒA NGHĨA, GIA LỰC, AVA, Kênh Nhật...)
7. Instant Model Decoder tích hợp vào app.js
8. Cập nhật brands.json, brands.js và bundle lại DACO_PORTAL_STANDALONE.html
"""

import os
import json
import re
import sys

base_dir = r'e:\sp\Mitutoyo\cam_nang_san_pham'
data_dir = os.path.join(base_dir, 'data')

# ==============================================================================
# 1. DỮ LIỆU CHUẨN HÓA BROTHER
# ==============================================================================

brother_software = [
    {
        "name": "P-touch Editor",
        "version": "v5.4 / v6.x (Windows / macOS)",
        "target": "Toàn bộ máy in nhãn Brother P-Touch (PT-E850TKW, PT-P900W/950W), dòng nhãn giấy QL (QL-800, QL-820NWB) và dòng TD",
        "purpose": "Thiết kế nhãn công nghiệp đồ họa chuyên nghiệp; tạo mã vạch 1D, mã QR 2D, DataMatrix; liên kết trực tiếp với cơ sở dữ liệu Excel/CSV/Access để in tem hàng loạt nhảy số tự động",
        "note": "Phần mềm miễn phí chính hãng Brother, giao diện tiếng Anh trực quan, hỗ trợ thiết kế nhãn đánh dấu cáp điện (dạng cờ flag, quấn dây wrap, patch panel, cầu đấu terminal block).",
        "link": "https://support.brother.com/g/b/downloadtop.aspx"
    },
    {
        "name": "Brother Pro Label Tool App",
        "version": "v1.5+ (iOS & Android)",
        "target": "Máy in nhãn cầm tay thế hệ mới kết nối Bluetooth & Wi-Fi: PT-E310BT, PT-E560BT, PT-E850TKW, PT-P900W",
        "purpose": "Thiết kế và in nhãn trực tiếp từ điện thoại thông minh / máy tính bảng ngay tại công trường hoặc bên trong tủ điện mà không cần mang theo laptop",
        "note": "Tích hợp sẵn thư viện hàng trăm biểu tượng ngành điện, cảnh báo nguy hiểm, tiêu chuẩn viễn thông TIA-606; tải mẫu in từ đám mây OneDrive/Dropbox.",
        "link": "https://apps.apple.com/app/brother-pro-label-tool/id1527710928"
    },
    {
        "name": "Brother iPrint&Label",
        "version": "v5.8+ (Mobile / Tablet)",
        "target": "Dòng máy in nhãn giấy QL-810W, QL-820NWB, QL-1110NWB và dòng TD",
        "purpose": "In nhanh tem nhãn giá sản phẩm, tem địa chỉ giao hàng, nhãn quản lý tài sản từ thiết bị di động qua mạng Wi-Fi hoặc Bluetooth",
        "note": "Rất tiện lợi cho nhân viên kho bãi dán nhãn đơn hàng chuyển phát nhanh logistics.",
        "link": "https://www.brother.com.vn/"
    },
    {
        "name": "Brother Cable Label Tool",
        "version": "v1.2+",
        "target": "Kỹ sư cơ điện M&E, viễn thông, thi công hạ tầng mạng Data Center",
        "purpose": "Chuyên môn hóa việc in nhãn đánh dấu cáp mạng Cat5/Cat6, cáp quang, thanh đấu nối Patch Panel, tủ Rack viễn thông",
        "note": "Tự động căn chỉnh kích thước nhãn vừa khít với khoảng cách các cổng RJ45 trên switch.",
        "link": "https://support.brother.com/"
    }
]

brother_brochures = [
    {
        "title": "Brother Industrial Labeling Solutions Catalog (P-Touch & Tube)",
        "category": "Catalog Máy In Công Nghiệp",
        "desc": "Tổng hợp dải sản phẩm máy in nhãn cầm tay PT-E110/E310BT/E560BT và máy in ống lồng đầu cốt PT-E850TKW chuyên dụng ngành điện.",
        "link": "https://www.brother.com.vn/",
        "isLocal": False
    },
    {
        "title": "Brother QL Series Professional Label Printers Catalog",
        "category": "Catalog Máy In Nhãn Giấy QL",
        "desc": "Catalog dòng máy in nhãn giấy tốc độ cao QL-800, QL-810W, QL-820NWB, QL-1100 in nhãn vận chuyển, logistics, văn phòng.",
        "link": "https://www.brother.com.vn/",
        "isLocal": False
    },
    {
        "title": "Brother TD Series Desktop Barcode & Receipt Printers",
        "category": "Catalog Máy In Mã Vạch TD",
        "desc": "Catalog giải pháp in mã vạch để bàn công nghiệp 2-inch và 4-inch TD-2310D, TD-2320D, TD-4410D, TD-4420DN, TD-4550DNWB.",
        "link": "https://www.brother.com.vn/",
        "isLocal": False
    },
    {
        "title": "Brother TZe Tape & HSe Heat Shrink Tube Spec Guide",
        "category": "Tài Liệu Băng Nhãn Tiêu Hao",
        "desc": "Bảng tra cứu kích thước và đặc tính băng nhãn siêu bền TZe, ống co nhiệt HSe, nhãn dán dẻo quấn cờ TZe-FX, nhãn siêu dính TZe-S.",
        "link": "https://www.brother.com.vn/",
        "isLocal": False
    }
]

brother_history = [
    {
        "category": "Máy In Nhãn Cầm Tay P-Touch (Handheld Series)",
        "steps": [
            {
                "era": "2000 - 2014",
                "name": "PT-1280 / PT-7600 / PT-E100",
                "status": "Đã khai tử",
                "badge": "discontinued",
                "software": "Bàn phím tích hợp",
                "highlight": "Máy in nhãn dã ngoại cho thợ điện thế hệ đầu; dùng pin tiểu AAA, cắt thủ công bằng tay gạt cơ khí."
            },
            {
                "era": "2015 - 2022",
                "name": "PT-E110 / PT-E300 / PT-E500 / PT-E550W",
                "status": "Chuyển tiếp",
                "badge": "transition",
                "software": "P-touch Editor / Wi-Fi",
                "highlight": "Dòng máy in nhãn tủ điện kinh điển bán chạy nhất; hỗ trợ kết nối Wi-Fi, dao cắt bán tự động."
            },
            {
                "era": "2023 - Nay",
                "name": "PT-E110 / PT-E310BT / PT-E560BT",
                "status": "Chuẩn hiện hành",
                "badge": "current",
                "software": "Brother Pro Label Tool App / Bluetooth",
                "highlight": "Nâng cấp cổng sạc USB Type-C hiện đại, kết nối Bluetooth in trực tiếp từ smartphone, dao cắt Half-Cut tự động."
            }
        ]
    },
    {
        "category": "Máy In Ống Lồng & Nhãn Để Bàn (Twin Engine & Desktop)",
        "steps": [
            {
                "era": "Trước 2016",
                "name": "Chỉ có máy in ống Max Letatwin / Canon MK",
                "status": "Độc quyền máy đơn chức năng",
                "badge": "discontinued",
                "software": "Bàn phím cơ",
                "highlight": "Khách hàng phải mua 2 máy riêng biệt: 1 máy in ống đầu cốt và 1 máy in tem nhãn tủ điện."
            },
            {
                "era": "2016 - Nay",
                "name": "PT-E800T / PT-E850TKW",
                "status": "Chuẩn hiện hành",
                "badge": "current",
                "software": "P-touch Editor & Pro Label Tool",
                "highlight": "Đột phá 'Twin-Engine' với 2 động cơ độc lập: Vừa in ống lồng PVC (Ø2.5-6.5mm) vừa in nhãn TZe khổ lớn lên tới 36mm."
            },
            {
                "era": "Hiện hành",
                "name": "PT-P900W / PT-P950W",
                "status": "Chuẩn công nghiệp",
                "badge": "current",
                "software": "P-touch Editor / LAN / Wi-Fi",
                "highlight": "Máy in nhãn để bàn công nghiệp tốc độ cao 60mm/s, độ phân giải siêu cao 360x720 dpi cho dây chuyền tự động hóa."
            }
        ]
    },
    {
        "category": "Máy In Nhãn Giấy QL & Máy In Mã Vạch TD",
        "steps": [
            {
                "era": "2010 - 2017",
                "name": "QL-700 / QL-720NW / TD-2120N",
                "status": "Đã khai tử",
                "badge": "discontinued",
                "software": "P-touch Editor v5",
                "highlight": "In nhiệt trực tiếp cuộn nhãn giấy DK đơn sắc đen trắng, tốc độ in tiêu chuẩn."
            },
            {
                "era": "2018 - Nay",
                "name": "QL-800 / QL-810W / QL-820NWB",
                "status": "Chuẩn hiện hành",
                "badge": "current",
                "software": "P-touch Editor / Bluetooth / Wi-Fi",
                "highlight": "Đột phá in được 2 màu ĐỎ & ĐEN trên cùng 1 nhãn giấy (DK-22251), dòng 820NWB có màn hình LCD in độc lập không cần máy tính."
            },
            {
                "era": "2020 - Nay",
                "name": "QL-1100 / TD-4420DN / TD-4550DNWB",
                "status": "Công nghiệp khổ rộng",
                "badge": "current",
                "software": "P-touch Editor / Mạng LAN / Barcode",
                "highlight": "Khổ in mở rộng lên đến 4-inch (108-118mm) chuyên dụng in vận đơn thương mại điện tử, tem logistics kho bãi."
            }
        ]
    }
]

# 17 Sản phẩm chuẩn mực Brother (bỏ dòng rác NCC VP TECH, bổ sung tiêu hao TZe/HSe/DK)
brother_products = [
    {
        "id": 1,
        "cat": "Máy in nhãn cầm tay",
        "subcat": "Dòng máy in nhãn dã ngoại thợ điện cơ bản",
        "serial": "PT-E110",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-E110", "PT-E110VP"],
        "replacement": "Thay thế cho dòng cũ PT-E100",
        "software": "Không dùng (Bàn phím tích hợp)",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn cầm tay độc lập phân khúc phổ thông nhất của Brother, thiết kế cao su chống va đập chuyên dụng cho thợ điện công trình.",
            "**Thông số kỹ thuật**: Màn hình LCD 1 dòng (16 ký tự); Hỗ trợ khổ nhãn TZe từ 6mm, 9mm đến tối đa 12mm; Tốc độ in 20mm/giây; Độ phân giải 180 dpi; Dao cắt thủ công bằng tay gạt cơ khí.",
            "**Cảnh báo thực chiến**: Bản tiêu chuẩn PT-E110 máy trần không kèm adapter nguồn; Phải mua riêng adapter AD-24ES hoặc dùng 6 viên pin tiểu AAA. Bản vali PT-E110VP có kèm sẵn sạc adapter và hộp đựng.",
            "**Tư vấn Sales**: Dành cho khách hàng cá nhân, thợ điện dân dụng hoặc tủ điện nhỏ; Không kết nối được máy tính hay điện thoại.",
            "**Vật tư tiêu hao**: Băng nhãn Brother TZe khổ 6mm, 9mm, 12mm (TZe-231 trắng chữ đen, TZe-631 vàng chữ đen)."
        ],
        "suppliers": "Tuyến 1: VP TECH (stock lớn), DACO | Tuyến 2: GK TECH, TÂN PHÁT",
        "namingRule": {
            "example": "PT-E110VP",
            "standardDoc": "Brother P-Touch Industrial Handheld Manual - PT-E110",
            "breakdown": [
                { "part": "PT-", "title": "Dòng P-Touch", "desc": "P-Touch - Thương hiệu máy in nhãn hàng đầu thế giới của Brother." },
                { "part": "E", "title": "Phân Khúc Điện & Viễn Thông (Electrical)", "desc": "E = Electrical & Datacom Series, thiết kế chống sốc chuyên dụng cho kỹ sư điện." },
                { "part": "110", "title": "Cấp Độ Model (Entry Level)", "desc": "110 = Khổ nhãn tối đa 12mm, bàn phím kiểu ABC, dao cắt thủ công." },
                { "part": "VP", "title": "Gói Phụ Kiện Kèm Theo (Value Pack)", "desc": "VP = Gói đầy đủ kèm vali chống sốc, adapter sạc và 1 cuộn nhãn mẫu (bản không có VP là máy trần hộp giấy)." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-", "title": "Dòng P-Touch", "desc": "P-Touch - Máy in nhãn công nghiệp Brother." },
            { "part": "E", "title": "Phân Khúc Electrical", "desc": "Chuyên dụng cho thợ cơ điện, viễn thông." },
            { "part": "110", "title": "Cấp Độ Model", "desc": "Khổ nhãn tối đa 12mm, cắt tay thủ công." },
            { "part": "VP", "title": "Value Pack", "desc": "Kèm vali đựng chuyên dụng và adapter sạc chính hãng." }
        ]
    },
    {
        "id": 2,
        "cat": "Máy in nhãn cầm tay",
        "subcat": "Máy in nhãn công nghiệp Bluetooth tầm trung",
        "serial": "PT-E310BT",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-E310BT"],
        "replacement": "Thế hệ mới nâng cấp thay thế dòng PT-E300",
        "software": "Brother Pro Label Tool App, P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn cầm tay thông minh thế hệ mới, tích hợp đồng thời bàn phím QWERTY vật lý và kết nối không dây Bluetooth với điện thoại.",
            "**Thông số kỹ thuật**: Màn hình đồ họa LCD 3 dòng có đèn nền; Khổ nhãn TZe và ống co nhiệt HSe từ 3.5mm đến tối đa 18mm; Tốc độ in 20mm/s; Độ phân giải 180 dpi; Cổng sạc và truyền dữ liệu USB Type-C.",
            "**Cảnh báo thực chiến**: Cắt nhãn thủ công (bấm nút dao cơ); Kèm sẵn pin sạc Li-ion, cáp USB-C và vali cứng đựng máy.",
            "**Tư vấn Sales**: Lựa chọn hoàn hảo cho đội bảo trì nhà máy và kỹ sư thi công tủ điện cỡ vừa cần in nhãn quấn dây, nhãn mặt tủ và ống co nhiệt khổ tới 18mm.",
            "**Vật tư tiêu hao**: Băng nhãn TZe (6-18mm), ống co nhiệt HSe (HSe-211 5.8mm, HSe-221 8.8mm, HSe-231 11.7mm)."
        ],
        "suppliers": "Tuyến 1: VP TECH (stock lớn), DACO | Tuyến 2: GK TECH, TÂN PHÁT",
        "namingRule": {
            "example": "PT-E310BT",
            "standardDoc": "Brother Industrial Label Printer User's Guide - PT-E310BT",
            "breakdown": [
                { "part": "PT-E", "title": "Họ P-Touch Electrical", "desc": "Dòng máy in chuyên dụng cho hệ thống tủ điện và viễn thông." },
                { "part": "310", "title": "Thế Hệ Tầm Trung (Mid-Tier)", "desc": "Khổ nhãn tối đa 18mm, bàn phím QWERTY, in được ống co nhiệt HSe." },
                { "part": "BT", "title": "Kết Nối Bluetooth", "desc": "BT = Tích hợp Bluetooth kết nối ứng dụng Brother Pro Label Tool trên iOS/Android." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Máy in nhãn tủ điện công nghiệp." },
            { "part": "310", "title": "Model 18mm", "desc": "Khổ nhãn max 18mm, in được ống co nhiệt HSe." },
            { "part": "BT", "title": "Bluetooth", "desc": "Kết nối Bluetooth in trực tiếp từ smartphone." }
        ]
    },
    {
        "id": 3,
        "cat": "Máy in nhãn cầm tay",
        "subcat": "Máy in nhãn cầm tay cao cấp dao cắt tự động & Half-Cut",
        "serial": "PT-E560BT",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-E560BT"],
        "replacement": "Thế hệ mới nâng cấp thay thế dòng huyền thoại PT-E550W",
        "software": "Brother Pro Label Tool App, P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: FLAGSHIP CẦM TAY SỐ 1 CỦA BROTHER: Máy in nhãn tủ điện cao cấp nhất với dao cắt tự động hoàn toàn và chức năng cắt nửa (Half-Cut) cực kỳ tiện lợi.",
            "**Thông số kỹ thuật**: Màn hình đồ họa LCD có đèn nền; Khổ nhãn TZe lên tới 24mm và ống co nhiệt HSe lên tới 23.6mm; Tốc độ in siêu nhanh 30mm/s (qua sạc USB-PD); Độ phân giải 180 dpi; Kết nối kép Bluetooth và USB Type-C.",
            "**Tính năng cắt nửa (Half-Cut)**: Cắt đứt lớp nhãn trên nhưng giữ lại lớp đế giấy phía dưới, giúp nhãn thành một dải dài không bị rơi vãi, bóc dán nhanh gấp 3 lần tại hiện trường.",
            "**Tư vấn Sales**: Sản phẩm bán chạy nhất cho các đơn vị làm tủ bảng điện chuyên nghiệp, nhà thầu cơ điện M&E thi công tòa nhà, dự án năng lượng mặt trời.",
            "**Vật tư tiêu hao**: Băng nhãn TZe (6-24mm, đặc biệt TZe-251 24mm), ống co nhiệt HSe (HSe-211 đến HSe-251)."
        ],
        "suppliers": "Tuyến 1: VP TECH (stock lớn), DACO | Tuyến 2: GK TECH, TÂN PHÁT",
        "namingRule": {
            "example": "PT-E560BT",
            "standardDoc": "Brother Industrial Label Printer User's Guide - PT-E560BT",
            "breakdown": [
                { "part": "PT-E", "title": "Họ P-Touch Electrical", "desc": "Máy in nhãn công nghiệp cho kỹ sư điện." },
                { "part": "560", "title": "Flagship 24mm (Auto & Half-Cut)", "desc": "560 = Khổ nhãn tối đa 24mm, trang bị động cơ dao cắt tự động hoàn toàn và chức năng cắt nửa Half-Cut." },
                { "part": "BT", "title": "Kết Nối Bluetooth & USB-C", "desc": "Kết nối Bluetooth tốc độ cao với smartphone và máy tính PC qua cáp Type-C." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Máy in nhãn tủ điện chuyên dụng." },
            { "part": "560", "title": "Flagship 24mm", "desc": "Khổ nhãn max 24mm, tích hợp dao cắt tự động & cắt nửa Half-Cut." },
            { "part": "BT", "title": "Bluetooth Wireless", "desc": "Kết nối Bluetooth không dây với smartphone/tablet." }
        ]
    },
    {
        "id": 4,
        "cat": "Máy in ống lồng & nhãn",
        "subcat": "Máy in kép 2 động cơ độc lập (Twin-Engine) VỪA IN ỐNG VỪA IN NHÃN",
        "serial": "PT-E850TKW",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-E850TKW"],
        "replacement": "Giải pháp 2 trong 1 thay thế cả máy in nhãn và máy in ống Max Letatwin",
        "software": "P-touch Editor, Brother Pro Label Tool App",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: SIÊU PHẨM CÔNG NGHỆ TWIN-ENGINE SỐ 1: Tích hợp 2 khối động cơ in độc lập trong 1 thân máy, cho phép in ống lồng PVC đánh số đầu dây và in nhãn TZe khổ lớn đồng thời mà không cần tháo lắp thay đổi cuộn vật tư.",
            "**Thông số in ống lồng**: Đường kính ống PVC từ Ø2.5mm đến Ø6.5mm; Tốc độ in ống 40mm/s; Dùng ruy-băng mực in ống Brother TR-100BK (100m).",
            "**Thông số in nhãn**: Khổ nhãn TZe rộng kỷ lục lên đến 36mm; Tốc độ in nhãn 60mm/s; Độ phân giải siêu cao 360 dpi (lên đến 720 x 360 dpi chế độ High-Res).",
            "**Thiết kế & Tiện ích**: Bàn phím cơ tháo rời được thành nắp đậy bảo vệ; Tích hợp dao cắt tự động và cắt nửa Half-Cut cho cả ống và nhãn; Kết nối Wi-Fi không dây và USB PC; Kèm nguồn AC và pin sạc Li-ion dung lượng lớn.",
            "**Tư vấn Sales**: 'Vũ khí tối thượng' cho các xưởng sản xuất tủ điện công nghiệp lớn, nhà máy tự động hóa OEM; Thay thế hoàn toàn việc phải mua 2 máy cồng kềnh.",
            "**Cảnh báo thực chiến**: Cần hướng dẫn khách dùng đúng ruy-băng mực chính hãng TR-100BK để tránh làm mòn đầu kim nhiệt in ống."
        ],
        "suppliers": "Tuyến 1: VP TECH (kho lớn), KHUÊ TÚ, DACO | Tuyến 2: HÃNG BROTHER VN",
        "namingRule": {
            "example": "PT-E850TKW",
            "standardDoc": "Brother Industrial Tube & Label Printer Manual - PT-E850TKW",
            "breakdown": [
                { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Họ máy in nhãn công nghiệp chuyên dụng tủ điện." },
                { "part": "850", "title": "Phân Khúc Đỉnh Cao (Heavy Duty)", "desc": "850 = Dòng máy in công suất lớn, độ phân giải 360 dpi, nhãn khổ rộng 36mm." },
                { "part": "TK", "title": "Động Cơ Ống & Bàn Phím (Tube & Keyboard)", "desc": "TK = Twin-Engine in ống lồng PVC (Tube) + tích hợp bàn phím tháo rời (Keyboard)." },
                { "part": "W", "title": "Kết Nối Mạng Wi-Fi Không Dây", "desc": "W = Trang bị card mạng Wi-Fi in không dây từ máy tính và thiết bị di động." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Máy in công nghiệp chuyên dụng tủ điện." },
            { "part": "850", "title": "Heavy Duty 36mm", "desc": "Nhãn max 36mm, độ phân giải 360 dpi." },
            { "part": "TK", "title": "Tube & Keyboard", "desc": "Động cơ in ống lồng PVC + bàn phím rời." },
            { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối Wi-Fi không dây đa thiết bị." }
        ]
    },
    {
        "id": 5,
        "cat": "Máy in nhãn để bàn công nghiệp",
        "subcat": "Máy in nhãn kết nối máy tính khổ lớn 36mm tốc độ cao",
        "serial": "PT-P900W",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-P900W"],
        "replacement": "Dòng máy in nhãn để bàn chuyên nghiệp",
        "software": "P-touch Editor, Brother Pro Label Tool App",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn để bàn công nghiệp kết nối PC/Wi-Fi, chuyên dùng in tem nhãn tài sản, tem linh kiện điện tử, nhãn nhận diện thiết bị công nghiệp.",
            "**Thông số kỹ thuật**: Khổ nhãn TZe từ 3.5mm đến tối đa 36mm; Tốc độ in cực nhanh 60mm/s; Độ phân giải in tối đa 360 x 720 dpi; Tích hợp dao cắt tự động và cắt nửa Half-Cut.",
            "**Kết nối**: Kết nối máy tính qua cổng USB 2.0 và mạng không dây Wi-Fi (chuẩn b/g/n); Hỗ trợ in từ thiết bị di động.",
            "**Tư vấn Sales**: Thích hợp đặt cố định tại phòng thiết kế, phòng kỹ thuật, xưởng lắp ráp linh kiện cần in nhãn số lượng lớn liên kết trực tiếp từ file Excel.",
            "**Vật tư tiêu hao**: Băng nhãn TZe khổ 6mm, 9mm, 12mm, 18mm, 24mm, 36mm; Băng siêu dính TZe-S261."
        ],
        "suppliers": "Tuyến 1: VP TECH, KHUÊ TÚ, DACO | Tuyến 2: HÃNG BROTHER VN",
        "namingRule": {
            "example": "PT-P900W",
            "standardDoc": "Brother Industrial PC Label Printer Manual - PT-P900W",
            "breakdown": [
                { "part": "PT-P", "title": "P-Touch PC-Connectable", "desc": "Dòng máy in nhãn để bàn điều khiển hoàn toàn từ máy tính PC." },
                { "part": "900", "title": "Phân Khúc Cao Cấp 36mm", "desc": "900 = Tốc độ in 60mm/s, độ phân giải 360 dpi, khổ nhãn tối đa 36mm." },
                { "part": "W", "title": "Kết Nối Không Dây Wi-Fi", "desc": "W = Hỗ trợ Wi-Fi không dây chia sẻ in cho nhiều máy tính trong mạng nội bộ." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-P", "title": "PC-Connectable", "desc": "Máy in nhãn để bàn kết nối PC." },
            { "part": "900", "title": "Model 36mm", "desc": "Khổ nhãn max 36mm, tốc độ 60mm/s." },
            { "part": "W", "title": "Wi-Fi Network", "desc": "Kết nối Wi-Fi chia sẻ đa người dùng." }
        ]
    },
    {
        "id": 6,
        "cat": "Máy in nhãn để bàn công nghiệp",
        "subcat": "Máy in nhãn để bàn hỗ trợ mạng có dây LAN & Wi-Fi",
        "serial": "PT-P950W",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PT-P950W"],
        "replacement": "Bản mở rộng mạng LAN của PT-P900W",
        "software": "P-touch Editor, Brother Pro Label Tool App",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Phiên bản hoàn thiện nhất của dòng máy in để bàn công nghiệp P-Touch, bổ sung cổng mạng LAN Ethernet có dây chuyên dụng cho môi trường nhà xưởng có độ nhiễu Wi-Fi cao.",
            "**Thông số kỹ thuật**: Khổ nhãn TZe tối đa 36mm; Tốc độ in 60mm/s; Độ phân giải 360 x 720 dpi; Dao cắt tự động và cắt nửa Half-Cut; Tùy chọn lắp thêm bộ pin sạc Li-ion và dock sạc để di chuyển cơ động.",
            "**Kết nối toàn diện**: USB 2.0, cổng mạng Ethernet 10/100 BASE-TX, Wi-Fi không dây, cổng Serial RS-232C (kết nối máy quét barcode hoặc cân điện tử).",
            "**Tư vấn Sales**: Dành cho các dây chuyền sản xuất SMT, nhà máy chế tạo điện tử lớn cần kết nối máy in vào mạng LAN công nghiệp của nhà máy."
        ],
        "suppliers": "Tuyến 1: VP TECH, KHUÊ TÚ, DACO | Tuyến 2: HÃNG BROTHER VN",
        "namingRule": {
            "example": "PT-P950W",
            "standardDoc": "Brother Industrial Network Label Printer Manual - PT-P950W",
            "breakdown": [
                { "part": "PT-P", "title": "P-Touch PC/Network", "desc": "Máy in nhãn công nghiệp điều khiển từ máy tính / mạng mạng." },
                { "part": "950", "title": "Cấu Hình Cao Cấp (Network Edition)", "desc": "Tích hợp cổng mạng LAN Ethernet RJ-45 và cổng nối tiếp Serial RS-232C." },
                { "part": "W", "title": "Wi-Fi Wireless", "desc": "Hỗ trợ kết nối Wi-Fi không dây tích hợp." }
            ]
        },
        "codeBreakdown": [
            { "part": "PT-P", "title": "PC/Network", "desc": "Máy in nhãn mạng công nghiệp." },
            { "part": "950", "title": "Network & Serial", "desc": "Tích hợp cổng mạng LAN + Serial RS-232C." },
            { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối Wi-Fi không dây đồng thời." }
        ]
    },
    {
        "id": 7,
        "cat": "Máy in nhãn giấy QL",
        "subcat": "Máy in nhãn giấy in nhiệt tốc độ cao IN 2 MÀU ĐEN & ĐỎ",
        "serial": "QL-800",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["QL-800"],
        "replacement": "Thay thế cho dòng cũ QL-700",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn giấy in nhiệt trực tiếp (Direct Thermal) phân khúc phổ thông của Brother, công nghệ độc quyền cho phép in được 2 màu ĐEN và ĐỎ mà không cần mực in.",
            "**Thông số kỹ thuật**: Khổ nhãn giấy DK rộng lên đến 62mm; Tốc độ in cực nhanh 148mm/s (tương đương 93 nhãn/phút); Độ phân giải 300 x 600 dpi; Dao cắt tự động tích hợp; Kết nối USB 2.0; Kèm sẵn nguồn AC tích hợp.",
            "**Tính năng in 2 màu**: Khi sử dụng cuộn nhãn DK-22251 (cuộn giấy liên tục 62mm), máy in ra cả chữ đen và chữ đỏ nổi bật cảnh báo hàng dễ vỡ, hạn sử dụng, thông tin quan trọng.",
            "**Tư vấn Sales**: Sản phẩm bán chạy nhất cho các văn phòng, bệnh viện, nhà thuốc, cửa hàng bán lẻ in tem mã vạch, tem thư, nhãn hồ sơ."
        ],
        "suppliers": "Tuyến 1: VP TECH, METAKING, DACO | Tuyến 2: KHUÊ TÚ, BROTHER VN",
        "namingRule": {
            "example": "QL-800",
            "standardDoc": "Brother QL Series User's Guide - QL-800",
            "breakdown": [
                { "part": "QL-", "title": "Dòng Quick Label", "desc": "Quick Label - Dòng máy in nhãn giấy in nhiệt tốc độ cao của Brother." },
                { "part": "8", "title": "Thế Hệ In 2 Màu (Red/Black)", "desc": "8 = Thế hệ thứ 8 hỗ trợ công nghệ in 2 màu đen/đỏ trên nhãn DK-22251." },
                { "part": "00", "title": "Bản Kết Nối Tiêu Chuẩn (USB)", "desc": "00 = Kết nối cổng USB tiêu chuẩn, cấp nguồn điện trực tiếp." }
            ]
        },
        "codeBreakdown": [
            { "part": "QL-", "title": "Quick Label", "desc": "Máy in nhãn giấy in nhiệt trực tiếp." },
            { "part": "800", "title": "Model 62mm Red/Black", "desc": "In khổ max 62mm, hỗ trợ in 2 màu Đen & Đỏ." }
        ]
    },
    {
        "id": 8,
        "cat": "Máy in nhãn giấy QL",
        "subcat": "Máy in nhãn giấy in nhiệt có kết nối Wi-Fi & AirPrint",
        "serial": "QL-810W",
        "status": "Hiếm",
        "fake": "Không",
        "renew": "Không",
        "models": ["QL-810W"],
        "replacement": "Bản nâng cấp Wi-Fi của QL-800",
        "software": "P-touch Editor, Brother iPrint&Label",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn giấy in nhiệt khổ 62mm bổ sung kết nối không dây Wi-Fi và chuẩn in ấn di động Apple AirPrint / Mopria.",
            "**Thông số kỹ thuật**: Khổ nhãn DK lên đến 62mm; Tốc độ in 176mm/s (110 nhãn/phút); Hỗ trợ in 2 màu Đen & Đỏ; Dao cắt tự động; Bộ nhớ đệm 6MB lưu sẵn tối đa 99 mẫu nhãn in; Tùy chọn lắp thêm đế pin sạc Li-ion PA-BU-001 để mang đi di động.",
            "**Cảnh báo thực chiến**: Thị trường ít stock sẵn hơn QL-800 và QL-820NWB do khách hàng thường chọn hẳn dòng QL-820NWB có màn hình LCD và cổng LAN.",
            "**Tư vấn Sales**: Thuyết phục khách nâng cấp lên QL-820NWB nếu cần in mạng có dây hoặc in độc lập không máy tính."
        ],
        "suppliers": "Tuyến 1: VP TECH, METAKING | Tuyến 2: KHUÊ TÚ, BROTHER VN",
        "namingRule": {
            "example": "QL-810W",
            "standardDoc": "Brother QL Series User's Guide - QL-810W",
            "breakdown": [
                { "part": "QL-8", "title": "Dòng Quick Label In 2 Màu", "desc": "Dòng máy in nhãn giấy khổ 62mm in được màu Đen/Đỏ." },
                { "part": "10", "title": "Cấu Hình Nâng Cao", "desc": "Tốc độ in tăng lên 176mm/s, có bộ nhớ lưu mẫu nhãn." },
                { "part": "W", "title": "Wi-Fi Wireless & AirPrint", "desc": "Tích hợp Wi-Fi không dây và hỗ trợ AirPrint từ iPhone/iPad." }
            ]
        },
        "codeBreakdown": [
            { "part": "QL-8", "title": "Quick Label Red/Black", "desc": "In nhãn nhiệt 2 màu đen/đỏ." },
            { "part": "10", "title": "Bộ Nhớ 6MB", "desc": "Lưu 99 template nhãn trong máy." },
            { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối Wi-Fi không dây." }
        ]
    },
    {
        "id": 9,
        "cat": "Máy in nhãn giấy QL",
        "subcat": "Máy in nhãn giấy Flagship có màn hình LCD & Đồng hồ thời gian thực RTC",
        "serial": "QL-820NWB",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["QL-820NWB"],
        "replacement": "Model cao cấp và toàn diện nhất dòng QL 62mm",
        "software": "P-touch Editor, Brother iPrint&Label",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: MODEL BÁN CHẠY NHẤT DÒNG QL CAO CẤP: Tích hợp màn hình đồ họa LCD có đèn nền và đồng hồ thời gian thực RTC (Real-Time Clock), cho phép in nhãn hoàn toàn độc lập (Standalone) mà không cần bật máy tính.",
            "**Tính năng in độc lập (Standalone)**: Tải trước tối đa 255 mẫu nhãn vào bộ nhớ 6MB của máy; Đồng hồ RTC tự động tính toán và in ngày giờ hiện tại, ngày sản xuất, hạn sử dụng chính xác từng phút mà không sợ sai lệch.",
            "**Thông số kỹ thuật**: Khổ nhãn DK lên đến 62mm; Tốc độ in 176mm/s (110 nhãn/phút); In 2 màu Đen & Đỏ; Dao cắt tự động; Kết nối 'Full Option': USB, mạng LAN có dây Ethernet, Wi-Fi, Bluetooth 2.1 EDR và AirPrint.",
            "**Tư vấn Sales**: Sản phẩm số 1 cho các chuỗi siêu thị, nhà hàng, bếp ăn công nghiệp, bệnh viện cần in tem hạn sử dụng thực phẩm đóng gói ngay tại quầy."
        ],
        "suppliers": "Tuyến 1: VP TECH, METAKING, DACO | Tuyến 2: KHUÊ TÚ, BROTHER VN",
        "namingRule": {
            "example": "QL-820NWB",
            "standardDoc": "Brother QL Series User's Guide - QL-820NWB",
            "breakdown": [
                { "part": "QL-8", "title": "Dòng Quick Label In 2 Màu", "desc": "Máy in nhãn giấy công nghệ in 2 màu đen/đỏ." },
                { "part": "20", "title": "Màn Hình LCD & Đồng Hồ RTC", "desc": "Trang bị màn hình LCD đồ họa có đèn nền và đồng hồ thời gian thực in Standalone." },
                { "part": "N", "title": "Mạng Có Dây (Network LAN)", "desc": "N = Cổng mạng Ethernet 10/100 BASE-TX." },
                { "part": "W", "title": "Mạng Không Dây (Wi-Fi)", "desc": "W = Kết nối Wi-Fi 802.11 b/g/n." },
                { "part": "B", "title": "Bluetooth Wireless", "desc": "B = Kết nối Bluetooth in trực tiếp từ máy quét hoặc điện thoại." }
            ]
        },
        "codeBreakdown": [
            { "part": "QL-820", "title": "LCD & RTC Standalone", "desc": "Màn hình LCD + Đồng hồ thời gian thực in độc lập." },
            { "part": "N", "title": "Network LAN", "desc": "Cổng mạng có dây Ethernet." },
            { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối mạng không dây Wi-Fi." },
            { "part": "B", "title": "Bluetooth", "desc": "Kết nối Bluetooth không dây." }
        ]
    },
    {
        "id": 10,
        "cat": "Máy in nhãn giấy QL",
        "subcat": "Máy in nhãn giấy khổ rộng 4-inch (103mm) cho Logistics & E-Commerce",
        "serial": "QL-1100",
        "status": "Hiếm",
        "fake": "Không",
        "renew": "Không",
        "models": ["QL-1100"],
        "replacement": "Dòng máy in nhãn bưu gửi khổ rộng",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in nhãn giấy khổ rộng lên tới 4-inch (103.6mm), thiết kế chuẩn cho việc in mã vạch vận chuyển bưu gửi của Shopee, Lazada, TikTok Shop, Tiki, DHL, FedEx.",
            "**Thông số kỹ thuật**: Chiều rộng nhãn tối đa 103.6mm; Tốc độ in 110mm/s (69 nhãn/phút); Độ phân giải 300 dpi; Dao cắt tự động bền bỉ; Kết nối USB 2.0 và cổng USB Host; Bộ nhớ 7.8MB.",
            "**Tính năng 'Crop Print' độc quyền**: Tự động nhận diện và cắt từng mã vạch riêng lẻ từ file PDF khổ A4 thành các con tem nhỏ dán kiện hàng mà không cần chỉnh sửa phần mềm.",
            "**Tư vấn Sales**: Dành cho các tổng kho thương mại điện tử, bưu cục chuyển phát nhanh cần máy in tem nhãn vận chuyển khổ lớn."
        ],
        "suppliers": "Tuyến 1: VP TECH, METAKING | Tuyến 2: KHUÊ TÚ, BROTHER VN",
        "namingRule": {
            "example": "QL-1100",
            "standardDoc": "Brother Wide Format Label Printer Manual - QL-1100",
            "breakdown": [
                { "part": "QL-", "title": "Dòng Quick Label", "desc": "Máy in nhãn giấy in nhiệt trực tiếp Brother." },
                { "part": "11", "title": "Khổ Rộng 4-Inch (103mm)", "desc": "11 = Khổ in mở rộng lên đến 4 inch (103.6mm) chuyên dụng in tem bưu gửi bưu chính." },
                { "part": "00", "title": "Bản Kết Nối USB", "desc": "Kết nối cổng USB 2.0 tiêu chuẩn." }
            ]
        },
        "codeBreakdown": [
            { "part": "QL-", "title": "Quick Label", "desc": "Máy in nhãn nhiệt tốc độ cao." },
            { "part": "1100", "title": "Wide Format 4-inch", "desc": "Khổ in nhãn rộng 103mm cho vận đơn logistics." }
        ]
    },
    {
        "id": 11,
        "cat": "Máy in nhãn giấy QL",
        "subcat": "Máy in nhãn giấy khổ rộng 103mm 'Full Option' LAN / Wi-Fi / Bluetooth",
        "serial": "QL-1110NWB",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["QL-1110NWB"],
        "replacement": "Bản trang bị mạng toàn diện của QL-1100",
        "software": "P-touch Editor, Brother iPrint&Label",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Model cao cấp nhất dòng in nhãn khổ lớn 4-inch (103mm), trang bị đầy đủ mọi giao thức kết nối hiện đại nhất, cho phép đặt máy in tại kho và điều khiển in từ xa từ mọi thiết bị.",
            "**Thông số kỹ thuật**: Khổ nhãn tối đa 103.6mm; Tốc độ in 110mm/s; Độ phân giải 300 dpi; Dao cắt tự động; Bộ nhớ 7.8MB; Tính năng Crop Print PDF thông minh.",
            "**Kết nối toàn năng**: USB 2.0, USB Host (cắm trực tiếp máy quét barcode cầm tay), mạng LAN có dây 10/100, Wi-Fi 802.11 b/g/n, Bluetooth 2.1 EDR (chứng nhận MFi Apple) và AirPrint.",
            "**Tư vấn Sales**: Lựa chọn hàng đầu cho các kho hàng trung tâm Logistics (Shopee Xpress, GHTK, Viettel Post, Kerry Express)."
        ],
        "suppliers": "Tuyến 1: VP TECH, METAKING, DACO | Tuyến 2: KHUÊ TÚ, BROTHER VN",
        "namingRule": {
            "example": "QL-1110NWB",
            "standardDoc": "Brother Wide Format Network Label Printer Manual - QL-1110NWB",
            "breakdown": [
                { "part": "QL-1110", "title": "Dòng Khổ Rộng 4-Inch (103mm)", "desc": "Máy in nhãn bưu kiện vận chuyển khổ rộng 103mm." },
                { "part": "N", "title": "Network LAN", "desc": "Cổng mạng có dây Ethernet." },
                { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối mạng không dây Wi-Fi." },
                { "part": "B", "title": "Bluetooth Wireless", "desc": "Kết nối Bluetooth không dây (hỗ trợ MFi Apple)." }
            ]
        },
        "codeBreakdown": [
            { "part": "QL-1110", "title": "Wide Format 4-inch", "desc": "Khổ in rộng 103mm." },
            { "part": "NWB", "title": "Network / Wi-Fi / Bluetooth", "desc": "Đầy đủ 3 giao thức kết nối mạng hiện đại." }
        ]
    },
    {
        "id": 12,
        "cat": "Máy in mã vạch để bàn TD",
        "subcat": "Máy in mã vạch và vòng tay y tế 2-inch (63mm) 203 dpi",
        "serial": "TD-2310D",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["TD-2310D"],
        "replacement": "Thế hệ mới thay thế dòng cũ TD-2020",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in mã vạch để bàn nhỏ gọn 2-inch (63mm), công nghệ in nhiệt trực tiếp, thiết kế chuyên biệt cho bệnh viện, phòng xét nghiệm, quầy thuốc và cửa hàng bán lẻ.",
            "**Thông số kỹ thuật**: Chiều rộng in tối đa 56mm (khổ giấy tối đa 63mm); Độ phân giải 203 dpi; Tốc độ in cao lên đến 152mm/s (6 ips); Kết nối USB 2.0; Cấp nguồn adapter AC kèm theo.",
            "**Ứng dụng thực tế**: In tem ống nghiệm máu, tem dán lọ thuốc, nhãn quản lý mẫu bệnh phẩm, vòng đeo tay nhận diện bệnh nhân (Patient ID Wristband).",
            "**Tư vấn Sales**: Bán theo gói dự án cho các bệnh viện, phòng khám đa khoa kết nối với phần mềm quản lý bệnh viện HIS."
        ],
        "suppliers": "Tuyến 1: AN PHÁT, VP TECH | Tuyến 2: DACO, BROTHER VN",
        "namingRule": {
            "example": "TD-2310D",
            "standardDoc": "Brother TD Series Desktop Barcode Printer Manual - TD-2310D",
            "breakdown": [
                { "part": "TD-", "title": "Thermal Desktop", "desc": "Dòng máy in mã vạch để bàn công nghệ in nhiệt của Brother." },
                { "part": "2", "title": "Khổ Rộng 2-Inch (63mm)", "desc": "2 = Khổ giấy tối đa 2 inch (63mm) nhỏ gọn." },
                { "part": "3", "title": "Thế Hệ Máy Mới", "desc": "Thế hệ sản phẩm cải tiến tốc độ và độ bền cơ khí." },
                { "part": "10", "title": "Độ Phân Giải 203 dpi", "desc": "10 = Độ phân giải tiêu chuẩn 203 dpi." },
                { "part": "D", "title": "In Nhiệt Trực Tiếp (Direct Thermal)", "desc": "D = Direct Thermal (in trên giấy cảm nhiệt không dùng cuộn mực ruy-băng)." }
            ]
        },
        "codeBreakdown": [
            { "part": "TD-", "title": "Thermal Desktop", "desc": "Máy in mã vạch để bàn công nghiệp." },
            { "part": "2", "title": "Khổ 2-inch", "desc": "Rộng nhãn tối đa 63mm (in 56mm)." },
            { "part": "310", "title": "203 dpi USB", "desc": "Độ phân giải 203 dpi, kết nối USB." },
            { "part": "D", "title": "Direct Thermal", "desc": "In nhiệt trực tiếp không cần mực." }
        ]
    },
    {
        "id": 13,
        "cat": "Máy in mã vạch để bàn TD",
        "subcat": "Máy in mã vạch 2-inch độ phân giải cao 300 dpi kết nối mạng LAN & Serial",
        "serial": "TD-2320D / TD-2320DSA",
        "status": "Hiếm",
        "fake": "Không",
        "renew": "Không",
        "models": ["TD-2320D", "TD-2320DSA"],
        "replacement": "Bản nâng cấp độ nét cao của TD-2310D",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in mã vạch khổ 2-inch có độ phân giải siêu nét 300 dpi, chuyên in các con tem có kích thước cực nhỏ nhưng chứa mã vạch 2D QR Code mật độ cao.",
            "**Thông số kỹ thuật**: Khổ giấy tối đa 63mm; Độ phân giải 300 dpi; Tốc độ in 152mm/s; Kết nối USB 2.0, USB Host, cổng mạng có dây LAN Ethernet và cổng nối tiếp Serial RS-232C.",
            "**Bản đặc biệt TD-2320DSA**: Tích hợp màn hình cảm ứng màu LCD (Touch Display Unit) trực tiếp trên mặt máy, cho phép nhân viên bấm chọn mẫu in ngay tại bàn làm việc.",
            "**Tư vấn Sales**: Sản phẩm cao cấp cho các phòng xét nghiệm huyết học hiện đại hoặc dây chuyền linh kiện điện tử tinh xảo."
        ],
        "suppliers": "Tuyến 1: AN PHÁT, VP TECH | Tuyến 2: DACO, BROTHER VN",
        "namingRule": {
            "example": "TD-2320DSA",
            "standardDoc": "Brother TD Series User's Guide - TD-2320D / TD-2320DSA",
            "breakdown": [
                { "part": "TD-2", "title": "Dòng 2-Inch Nhỏ Gọn", "desc": "Khổ giấy nhãn 2 inch (63mm)." },
                { "part": "320", "title": "Độ Phân Giải Cao 300 dpi", "desc": "320 = Độ phân giải cao 300 dpi sắc nét cho mã vạch nhỏ." },
                { "part": "D", "title": "Direct Thermal", "desc": "Công nghệ in nhiệt trực tiếp." },
                { "part": "SA", "title": "Màn Hình Cảm Ứng (Standalone)", "desc": "SA = Tích hợp màn hình cảm ứng LCD điều khiển in độc lập." }
            ]
        },
        "codeBreakdown": [
            { "part": "TD-2", "title": "Khổ 2-inch", "desc": "Máy in nhãn mã vạch 63mm." },
            { "part": "320", "title": "300 dpi High-Res", "desc": "Độ phân giải cao 300 dpi." },
            { "part": "DSA", "title": "Direct Thermal & Touch LCD", "desc": "In nhiệt trực tiếp + Màn hình cảm ứng màu." }
        ]
    },
    {
        "id": 14,
        "cat": "Máy in mã vạch để bàn TD",
        "subcat": "Máy in mã vạch khổ rộng 4-inch (118mm) tốc độ cao 203mm/s (8 ips)",
        "serial": "TD-4410D",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["TD-4410D"],
        "replacement": "Thế hệ mới thay thế dòng TD-4000",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Máy in mã vạch công nghiệp khổ rộng 4-inch (khổ giấy tối đa 118mm, khổ in 104mm) tốc độ cao, thay thế hoàn hảo cho các dòng máy in mã vạch để bàn Zebra hay Godex truyền thống.",
            "**Thông số kỹ thuật**: Tốc độ in cực nhanh lên đến 203mm/s (8 ips); Độ phân giải 203 dpi; Cảm biến giấy kép (Transmissive & Reflective) nhận diện mọi loại tem nhãn khuyết góc hay có vạch đen; Cổng kết nối USB 2.0 và Serial RS-232C.",
            "**Tương thích ngôn ngữ lệnh**: Hỗ trợ đầy đủ các tập lệnh công nghiệp ZPL II (Zebra), EPL (Eltron), DPL (Datamax) giúp cắm thay thế máy cũ chạy ngay không cần sửa code phần mềm.",
            "**Tư vấn Sales**: Đơn vị nào đang dùng máy Zebra ZD220 / ZD230 bị lỗi đầu in có thể tư vấn đổi sang Brother TD-4410D đầu in cực kỳ bền bỉ và dễ thay thế."
        ],
        "suppliers": "Tuyến 1: AN PHÁT, VP TECH | Tuyến 2: DACO, BROTHER VN",
        "namingRule": {
            "example": "TD-4410D",
            "standardDoc": "Brother 4-Inch Thermal Desktop Printer Manual - TD-4410D",
            "breakdown": [
                { "part": "TD-", "title": "Dòng Thermal Desktop", "desc": "Máy in mã vạch để bàn công nghiệp Brother." },
                { "part": "4", "title": "Khổ Rộng 4-Inch (118mm)", "desc": "4 = Khổ in tiêu chuẩn công nghiệp 4 inch (in tối đa 104mm)." },
                { "part": "4", "title": "Thế Hệ Tốc Độ Cao (8 ips)", "desc": "Tốc độ in đạt tới 203mm/s (8 inch/giây)." },
                { "part": "10", "title": "Độ Phân Giải 203 dpi", "desc": "Độ phân giải tiêu chuẩn 203 dpi." },
                { "part": "D", "title": "Direct Thermal", "desc": "In nhiệt trực tiếp không cần ruy-băng mực." }
            ]
        },
        "codeBreakdown": [
            { "part": "TD-4", "title": "Khổ 4-inch (118mm)", "desc": "Khổ in tiêu chuẩn công nghiệp 104mm." },
            { "part": "410", "title": "203 dpi - 8 ips", "desc": "Độ phân giải 203 dpi, tốc độ 203mm/s." },
            { "part": "D", "title": "Direct Thermal", "desc": "In nhiệt trực tiếp." }
        ]
    },
    {
        "id": 15,
        "cat": "Máy in mã vạch để bàn TD",
        "subcat": "Máy in mã vạch khổ rộng 4-inch trang bị mạng có dây LAN Ethernet",
        "serial": "TD-4420DN",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["TD-4420DN"],
        "replacement": "Bản mở rộng mạng LAN của TD-4410D",
        "software": "P-touch Editor",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: Dòng máy in mã vạch 4-inch chủ lực cho các nhà máy công nghiệp lớn, tích hợp cổng mạng Ethernet có dây giúp kết nối mạng nội bộ chia sẻ in từ nhiều máy tính trong xưởng.",
            "**Thông số kỹ thuật**: Khổ giấy tối đa 118mm (in 104mm); Độ phân giải 203 dpi; Tốc độ in 203mm/s (8 ips); Tích hợp cổng USB 2.0, cổng Serial RS-232C và cổng mạng Ethernet 10/100 BASE-TX.",
            "**Tùy chọn mở rộng chính hãng**: Có thể gắn thêm bộ dao cắt tự động rời (Auto Cutter PA-CU-001) hoặc bộ bóc nhãn tự động (Peeler PA-LP-002) giúp tăng gấp đôi tốc độ dán nhãn.",
            "**Tư vấn Sales**: Sản phẩm mũi nhọn khi chào thầu cho các nhà máy sản xuất linh kiện ô tô, điện tử, may mặc xuất khẩu."
        ],
        "suppliers": "Tuyến 1: AN PHÁT, VP TECH, DACO | Tuyến 2: BROTHER VN",
        "namingRule": {
            "example": "TD-4420DN",
            "standardDoc": "Brother 4-Inch Network Barcode Printer Manual - TD-4420DN",
            "breakdown": [
                { "part": "TD-4", "title": "Khổ Rộng 4-Inch (118mm)", "desc": "Khổ giấy chuẩn công nghiệp 4 inch." },
                { "part": "420", "title": "Cấu Hình Mạng Công Nghiệp", "desc": "Tốc độ 203mm/s, độ phân giải 203 dpi, hỗ trợ quản trị mạng từ xa BRAdmin." },
                { "part": "D", "title": "Direct Thermal", "desc": "Công nghệ in nhiệt trực tiếp." },
                { "part": "N", "title": "Network LAN", "desc": "N = Tích hợp cổng mạng LAN Ethernet 10/100 BASE-TX." }
            ]
        },
        "codeBreakdown": [
            { "part": "TD-4", "title": "Khổ 4-inch", "desc": "Khổ in nhãn công nghiệp 104mm." },
            { "part": "420", "title": "Model 203 dpi", "desc": "Tốc độ in cao 203mm/s." },
            { "part": "DN", "title": "Direct Thermal & Network", "desc": "In nhiệt trực tiếp + Cổng mạng LAN có dây." }
        ]
    },
    {
        "id": 16,
        "cat": "Máy in mã vạch để bàn TD",
        "subcat": "Flagship máy in mã vạch 4-inch 300 dpi có màn hình LCD, LAN, Wi-Fi, Bluetooth",
        "serial": "TD-4550DNWB",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["TD-4550DNWB"],
        "replacement": "Model cao cấp nhất và toàn diện nhất dòng TD Series",
        "software": "P-touch Editor, Brother iPrint&Label",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất**: ĐỈNH CAO DÒNG MÁY IN MÃ VẠCH ĐỂ BÀN BROTHER: Kết hợp độ phân giải siêu nét 300 dpi với màn hình LCD đồ họa có đèn nền và đầy đủ mọi kết nối không dây.",
            "**Thông số kỹ thuật**: Khổ giấy tối đa 118mm (in 108mm); Độ phân giải cao 300 dpi; Tốc độ in 152mm/s (6 ips); Màn hình LCD đơn sắc có các phím điều hướng cấu hình trực tiếp trên máy; Đồng hồ thời gian thực RTC in hạn sử dụng chính xác.",
            "**Kết nối 'All-in-One'**: USB 2.0, USB Host, Serial RS-232C, mạng LAN có dây, Wi-Fi 802.11 a/b/g/n (hỗ trợ cả băng tần 5GHz chống nhiễu), Bluetooth 4.2 MFi và AirPrint.",
            "**Tư vấn Sales**: Dành cho các khách hàng đòi hỏi tiêu chuẩn khắt khe nhất trong ngành y tế, dược phẩm, sản xuất linh kiện bán dẫn hoặc logistics tự động."
        ],
        "suppliers": "Tuyến 1: AN PHÁT, VP TECH, DACO | Tuyến 2: BROTHER VN",
        "namingRule": {
            "example": "TD-4550DNWB",
            "standardDoc": "Brother 4-Inch Flagship Barcode Printer Manual - TD-4550DNWB",
            "breakdown": [
                { "part": "TD-4", "title": "Dòng Khổ Rộng 4-Inch", "desc": "Khổ in nhãn công nghiệp rộng 108mm." },
                { "part": "5", "title": "Độ Phân Giải Cao 300 dpi", "desc": "5 = Độ phân giải 300 dpi in siêu nét mã vạch nhỏ và chữ chi tiết." },
                { "part": "50", "title": "Màn Hình LCD & RTC", "desc": "Trang bị màn hình LCD đồ họa và đồng hồ thời gian thực RTC." },
                { "part": "D", "title": "Direct Thermal", "desc": "Công nghệ in nhiệt trực tiếp." },
                { "part": "N", "title": "Network LAN", "desc": "Mạng có dây Ethernet 10/100." },
                { "part": "W", "title": "Wi-Fi Dual Band", "desc": "Mạng không dây Wi-Fi (2.4GHz & 5GHz)." },
                { "part": "B", "title": "Bluetooth 4.2", "desc": "Bluetooth không dây tương thích iOS/Android." }
            ]
        },
        "codeBreakdown": [
            { "part": "TD-4550", "title": "4-inch 300 dpi LCD", "desc": "Khổ 4-inch, độ nét 300 dpi, màn hình LCD." },
            { "part": "DNWB", "title": "Full Connectivity", "desc": "Đầy đủ Direct Thermal, LAN, Wi-Fi, Bluetooth." }
        ]
    },
    {
        "id": 17,
        "cat": "Vật tư tiêu hao chính hãng",
        "subcat": "Băng nhãn siêu bền TZe, Ống co nhiệt HSe & Nhãn cuộn DK Brother",
        "serial": "Băng nhãn TZe / HSe / Cuộn DK",
        "status": "Thông dụng",
        "fake": "Có",
        "renew": "Không",
        "models": [
            "TZe-231 (12mm trắng chữ đen)",
            "TZe-241 (18mm trắng chữ đen)",
            "TZe-251 (24mm trắng chữ đen)",
            "TZe-261 (36mm trắng chữ đen)",
            "TZe-631 (12mm vàng chữ đen)",
            "TZe-S231 (12mm siêu dính)",
            "TZe-FX231 (12mm dẻo quấn cờ)",
            "HSe-211 (5.8mm co nhiệt)",
            "HSe-221 (8.8mm co nhiệt)",
            "HSe-231 (11.7mm co nhiệt)",
            "TR-100BK (Mực in ống 100m)",
            "DK-11201 (29x90mm 400 nhãn)",
            "DK-22205 (62mm x 30.48m)"
        ],
        "replacement": "Tuyệt đối không dùng nhãn nhái trôi nổi tránh làm kẹt đầu in",
        "software": "Không dùng",
        "brochure": "https://www.brother.com.vn/",
        "points": [
            "**Bản chất công nghệ TZe Laminated**: Cấu trúc độc quyền gồm 6 lớp vật liệu với màng phủ bảo vệ trong suốt phủ lên trên lớp mực, giúp nhãn chịu được dung môi cồn, dầu mỡ công nghiệp, chống bay màu dưới ánh nắng UV, chịu nhiệt độ khắc nghiệt từ -80°C đến +150°C, chống trầy xước và chống thấm nước 100%.",
            "**Dòng ống co nhiệt HSe (Heat Shrink)**: Tỷ lệ co 2:1 hoặc 3:1 khi khò nhiệt bằng máy sấy nhiệt, ôm khít dây cáp điện từ Ø1.7mm đến Ø14.3mm, tiêu chuẩn chống cháy UL224.",
            "**Dòng nhãn chuyên dụng**: TZe-S (Strong Adhesive - keo siêu dính tăng gấp 3 lần độ bám trên bề mặt nhám, kim loại sơn tĩnh điện); TZe-FX (Flexible ID - màng dẻo chuyên quấn quanh dây cáp điện không bị bong mép).",
            "**CẢNH BÁO FAKE THỰC CHIẾN**: Trên Shopee và thị trường trôi nổi có rất nhiều băng nhãn Fake (vỏ nhái Brother hoặc băng nhãn gia công TQ màng mỏng); Keo dính rất kém, sau 2-3 tháng tự bong rơi, đặc biệt làm mòn xước đầu kim nhiệt của máy in đắt tiền.",
            "**Tư vấn Sales**: Luôn tư vấn khách hàng mua băng nhãn chính hãng từ đại lý ủy quyền để được bảo hành máy in 12-24 tháng."
        ],
        "suppliers": "Tuyến 1: VP TECH (kho băng nhãn lớn nhất VN), DACO, KHUÊ TÚ | Tuyến 2: METAKING, AN PHÁT",
        "namingRule": {
            "example": "TZe-231",
            "standardDoc": "Brother TZe Laminated Tape Nomenclature Guide",
            "breakdown": [
                { "part": "TZe-", "title": "Băng Nhãn Laminated", "desc": "TZe = Băng nhãn có màng bảo vệ siêu bền Laminated thân thiện môi trường (thay cho dòng TZ cũ)." },
                { "part": "2", "title": "Màu Nền Băng Nhãn", "desc": "2 = Nền Trắng (1 = Nền Trong suốt, 3 = Nền Xanh lam, 4 = Nền Đỏ, 5 = Nền Vàng, 6 = Nền Cam)." },
                { "part": "3", "title": "Chiều Rộng Bản Nhãn", "desc": "1 = 6mm, 2 = 9mm, 3 = 12mm, 4 = 18mm, 5 = 24mm, 6 = 36mm." },
                { "part": "1", "title": "Màu Chữ Mực In", "desc": "1 = Chữ Đen (Black Ink), 2 = Chữ Đỏ, 3 = Chữ Xanh, 4 = Chữ Vàng, 5 = Chữ Trắng)." }
            ]
        },
        "codeBreakdown": [
            { "part": "TZe-", "title": "Băng Nhãn Laminated", "desc": "Công nghệ màng phủ siêu bền 6 lớp." },
            { "part": "2", "title": "Màu Nền Trắng", "desc": "Nền trắng tiêu chuẩn (2 = Trắng, 6 = Vàng)." },
            { "part": "3", "title": "Bản Rộng 12mm", "desc": "Khổ nhãn 12mm (3 = 12mm, 4 = 18mm, 5 = 24mm, 6 = 36mm)." },
            { "part": "1", "title": "Chữ Đen", "desc": "Mực in chữ màu đen tương phản cao." }
        ]
    }
]

# Sơ đồ cây phân cấp Brother
brother_tree = [
    {
        "id": "cat-brother-handheld",
        "name": "Máy In Nhãn Cầm Tay Công Nghiệp (Handheld P-Touch)",
        "filterCat": "Máy in nhãn cầm tay",
        "icon": "📱",
        "tier": "Dã ngoại, cơ động thi công công trình tủ điện",
        "application": "Dán nhãn mặt tủ điện, đánh dấu aptomat, rơ le, cầu đấu terminal block, quấn dây cáp điện tại hiện trường.",
        "description": "Dòng máy in nhãn vỏ bọc cao su chống va đập, tích hợp bàn phím cơ và kết nối Bluetooth in trực tiếp từ smartphone.",
        "series": [
            {
                "id": "pt-e110",
                "name": "PT-E110 / PT-E110VP (Cơ Bản 12mm)",
                "lookupKeyword": "PT-E110",
                "tier": "Phổ thông dã ngoại (Khổ max 12mm)",
                "application": "Thợ điện dân dụng, công trình nhỏ, tủ điện mini.",
                "status": "Thông dụng",
                "image": "assets/images/brother/pt_e110.jpg",
                "namingRule": {
                    "example": "PT-E110VP",
                    "standardDoc": "Brother PT-E110 User's Manual",
                    "breakdown": [
                        { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Dòng máy in nhãn chuyên dụng cho thợ điện." },
                        { "part": "110", "title": "Model 12mm", "desc": "Khổ nhãn tối đa 12mm, dao cắt thủ công." },
                        { "part": "VP", "title": "Value Pack", "desc": "Kèm vali chống sốc và adapter sạc chính hãng." }
                    ]
                },
                "warnings": "Lưu ý máy trần PT-E110 không có sẵn sạc; Phải mua bản VP hoặc mua thêm sạc AD-24ES.",
                "commonModels": ["PT-E110", "PT-E110VP"],
                "replacement": "Thay thế cho dòng cũ PT-E100."
            },
            {
                "id": "pt-e310bt",
                "name": "PT-E310BT (Bluetooth 18mm)",
                "lookupKeyword": "PT-E310BT",
                "tier": "Tầm trung thông minh (Khổ max 18mm)",
                "application": "In nhãn tủ điện, patch panel, in ống co nhiệt HSe khổ tới 18mm.",
                "status": "Thông dụng",
                "image": "assets/images/brother/pt_e310bt.jpg",
                "namingRule": {
                    "example": "PT-E310BT",
                    "standardDoc": "Brother PT-E310BT User's Manual",
                    "breakdown": [
                        { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Máy in nhãn tủ điện công nghiệp." },
                        { "part": "310", "title": "Cấu Hình 18mm", "desc": "Khổ nhãn max 18mm, bàn phím QWERTY, in được ống co nhiệt." },
                        { "part": "BT", "title": "Bluetooth", "desc": "Kết nối Bluetooth in trực tiếp từ smartphone qua Pro Label Tool." }
                    ]
                },
                "warnings": "Kèm sẵn pin sạc Li-ion, sạc qua cổng USB-C rất tiện lợi.",
                "commonModels": ["PT-E310BT"],
                "replacement": "Thế hệ mới thay thế PT-E300."
            },
            {
                "id": "pt-e560bt",
                "name": "PT-E560BT (Flagship Cầm Tay 24mm Auto/Half-Cut)",
                "lookupKeyword": "PT-E560BT",
                "tier": "Cao cấp số 1 (Khổ max 24mm, Cắt nửa Half-Cut)",
                "application": "Xưởng tủ bảng điện chuyên nghiệp, nhà thầu cơ điện M&E, trạm biến áp, Solar farm.",
                "status": "Thông dụng",
                "image": "assets/images/brother/pt_e560bt.jpg",
                "namingRule": {
                    "example": "PT-E560BT",
                    "standardDoc": "Brother PT-E560BT User's Manual",
                    "breakdown": [
                        { "part": "PT-E", "title": "P-Touch Electrical", "desc": "Máy in nhãn tủ điện công nghiệp." },
                        { "part": "560", "title": "Flagship 24mm", "desc": "Khổ nhãn max 24mm, trang bị dao cắt tự động & cắt nửa Half-Cut." },
                        { "part": "BT", "title": "Bluetooth & USB-C", "desc": "Kết nối Bluetooth với điện thoại và USB-C với máy tính." }
                    ]
                },
                "warnings": "Tính năng Half-Cut giúp bóc dán nhanh gấp 3 lần tại hiện trường, không bị rơi vãi tem rời.",
                "commonModels": ["PT-E560BT"],
                "replacement": "Thế hệ mới nâng cấp thay thế dòng huyền thoại PT-E550W."
            }
        ]
    },
    {
        "id": "cat-brother-twin",
        "name": "Máy In Ống Lồng & Nhãn Để Bàn (Twin-Engine & Heavy Duty)",
        "filterCat": "Máy in ống lồng & nhãn",
        "icon": "🖨️",
        "tier": "Công nghiệp nặng, xưởng sản xuất tủ điện & dây chuyền SMT",
        "application": "Vừa in ống lồng PVC đánh số đầu cốt dây điện, vừa in tem nhãn tủ điện khổ lớn 36mm.",
        "description": "Dòng máy in 2 động cơ độc lập đột phá số 1 thị trường của Brother.",
        "series": [
            {
                "id": "pt-e850tkw",
                "name": "PT-E850TKW (Twin-Engine In Kép Ống & Nhãn)",
                "lookupKeyword": "PT-E850TKW",
                "tier": "Vũ khí tối thượng xưởng tủ điện (In ống Ø2.5-6.5mm & Nhãn 36mm)",
                "application": "Xưởng sản xuất tủ bảng điện công nghiệp, nhà máy chế tạo máy tự động hóa OEM.",
                "status": "Thông dụng",
                "image": "assets/images/brother/pt_e850tkw.jpg",
                "namingRule": {
                    "example": "PT-E850TKW",
                    "standardDoc": "Brother PT-E850TKW Tube & Label Printer Manual",
                    "breakdown": [
                        { "part": "PT-E850", "title": "Dòng Công Nghiệp Nặng 36mm", "desc": "Khổ nhãn tối đa 36mm, độ phân giải 360 dpi." },
                        { "part": "TK", "title": "Tube & Keyboard", "desc": "Động cơ in ống lồng PVC độc lập + Bàn phím cơ tháo rời." },
                        { "part": "W", "title": "Wi-Fi Wireless", "desc": "Card mạng Wi-Fi in không dây đa thiết bị." }
                    ]
                },
                "warnings": "Thay thế cho việc phải mua 2 máy rời (máy in ống Max Letatwin + máy in nhãn); Tiết kiệm chi phí đầu tư đáng kể.",
                "commonModels": ["PT-E850TKW"],
                "replacement": "Model độc quyền 2 trong 1 của Brother."
            },
            {
                "id": "pt-p900w-p950w",
                "name": "PT-P900W / PT-P950W (Để Bàn 36mm 360x720 dpi)",
                "lookupKeyword": "PT-P900W",
                "tier": "Để bàn kết nối PC / LAN công nghiệp",
                "application": "Phòng kỹ thuật, dây chuyền sản xuất bo mạch điện tử SMT, in nhãn số lượng lớn từ Excel.",
                "status": "Thông dụng",
                "image": "assets/images/brother/pt_p900w.jpg",
                "namingRule": {
                    "example": "PT-P950W",
                    "standardDoc": "Brother PT-P900 Series User's Manual",
                    "breakdown": [
                        { "part": "PT-P", "title": "PC Connectable", "desc": "Máy in nhãn điều khiển hoàn toàn từ máy tính." },
                        { "part": "950", "title": "Network & Serial", "desc": "Khổ 36mm, tốc độ 60mm/s, có cổng LAN Ethernet và Serial RS-232C." },
                        { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối Wi-Fi không dây chia sẻ in trong mạng." }
                    ]
                },
                "warnings": "Bản PT-P950W có cổng LAN chuyên dụng cho nhà xưởng có sóng Wi-Fi yếu hoặc bị nhiễu.",
                "commonModels": ["PT-P900W", "PT-P950W"],
                "replacement": "Dòng máy in nhãn PC công nghiệp cao cấp nhất."
            }
        ]
    },
    {
        "id": "cat-brother-ql",
        "name": "Máy In Nhãn Giấy Cuộn QL Series (In Nhiệt Tốc Độ Cao Đỏ/Đen)",
        "filterCat": "Máy in nhãn giấy QL",
        "icon": "🏷️",
        "tier": "In nhiệt trực tiếp cuộn nhãn DK, tốc độ cao lên tới 176mm/s",
        "application": "Tem bưu gửi thương mại điện tử, nhãn hạn sử dụng thực phẩm, nhãn hồ sơ văn phòng, tem xét nghiệm bệnh viện.",
        "description": "Dòng máy in nhãn giấy đột phá công nghệ in được 2 màu ĐỎ và ĐEN trên cùng 1 con tem.",
        "series": [
            {
                "id": "ql-800-820",
                "name": "QL-800 / QL-810W / QL-820NWB (Khổ 62mm In 2 Màu)",
                "lookupKeyword": "QL-820NWB",
                "tier": "Chủ lực văn phòng & bán lẻ (Khổ max 62mm)",
                "application": "Tem giá, nhãn mã vạch sản phẩm, tem thực phẩm in ngày giờ tự động qua RTC.",
                "status": "Thông dụng",
                "image": "assets/images/brother/ql_820nwb.jpg",
                "namingRule": {
                    "example": "QL-820NWB",
                    "standardDoc": "Brother QL-800 Series User's Guide",
                    "breakdown": [
                        { "part": "QL-820", "title": "In 2 Màu & LCD Standalone", "desc": "Khổ 62mm, in đỏ/đen, màn hình LCD + Đồng hồ RTC in độc lập không máy tính." },
                        { "part": "N", "title": "Network LAN", "desc": "Cổng mạng có dây Ethernet." },
                        { "part": "W", "title": "Wi-Fi Wireless", "desc": "Kết nối mạng Wi-Fi không dây." },
                        { "part": "B", "title": "Bluetooth", "desc": "Kết nối Bluetooth không dây." }
                    ]
                },
                "warnings": "QL-820NWB bán chạy nhất nhờ khả năng in độc lập có đồng hồ thời gian thực tự nhảy hạn sử dụng.",
                "commonModels": ["QL-800", "QL-810W", "QL-820NWB"],
                "replacement": "Thế hệ máy in nhãn giấy in nhiệt phổ biến nhất."
            },
            {
                "id": "ql-1100-1110",
                "name": "QL-1100 / QL-1110NWB (Khổ Lớn 4-inch 103mm Logistics)",
                "lookupKeyword": "QL-1110NWB",
                "tier": "Logistics & Chuyển phát nhanh (Khổ 103.6mm)",
                "application": "Vận đơn Shopee, TikTok Shop, bưu gửi kho bãi, tem thùng carton.",
                "status": "Thông dụng",
                "image": "assets/images/brother/ql_1110nwb.jpg",
                "namingRule": {
                    "example": "QL-1110NWB",
                    "standardDoc": "Brother QL-1100 Series User's Guide",
                    "breakdown": [
                        { "part": "QL-1110", "title": "Khổ Rộng 4-Inch (103mm)", "desc": "In khổ lớn 103mm, tích hợp tính năng Crop Print PDF thông minh." },
                        { "part": "NWB", "title": "Full Network Connectivity", "desc": "Đầy đủ cổng mạng LAN, Wi-Fi và Bluetooth." }
                    ]
                },
                "warnings": "Tính năng Crop Print tự động tách con tem từ file PDF A4 chuyển phát nhanh, tiết kiệm 80% thời gian xử lý đơn.",
                "commonModels": ["QL-1100", "QL-1110NWB"],
                "replacement": "Giải pháp máy in vận đơn bưu chính hàng đầu."
            }
        ]
    },
    {
        "id": "cat-brother-td",
        "name": "Máy In Mã Vạch Để Bàn TD Series (Thermal Desktop Barcode)",
        "filterCat": "Máy in mã vạch để bàn TD",
        "icon": "📦",
        "tier": "Công nghiệp kho bãi, bệnh viện, dán thùng hàng carton",
        "application": "In tem nhãn mã vạch 1D/2D liên tục công suất lớn, thay thế máy in Zebra, Godex.",
        "description": "Máy in mã vạch để bàn công nghiệp siêu bền, hỗ trợ đầy đủ tập lệnh ZPL II / EPL / DPL.",
        "series": [
            {
                "id": "td-2000",
                "name": "TD-2310D / TD-2320D / TD-2320DSA (Khổ 2-inch 63mm Y Tế)",
                "lookupKeyword": "TD-2310D",
                "tier": "Y tế & Phòng xét nghiệm (Khổ 63mm)",
                "application": "Tem ống nghiệm, vòng tay bệnh nhân, nhãn thuốc.",
                "status": "Thông dụng",
                "image": "assets/images/brother/td_2310d.jpg",
                "namingRule": {
                    "example": "TD-2310D",
                    "standardDoc": "Brother TD-2000 Series Manual",
                    "breakdown": [
                        { "part": "TD-2", "title": "Khổ 2-inch (63mm)", "desc": "Kích thước nhỏ gọn tối ưu diện tích bàn làm việc." },
                        { "part": "310", "title": "203 dpi USB", "desc": "Độ phân giải 203 dpi, tốc độ 152mm/s." },
                        { "part": "D", "title": "Direct Thermal", "desc": "In nhiệt trực tiếp không cần cuộn ribbon." }
                    ]
                },
                "warnings": "Bản TD-2320DSA có màn hình cảm ứng màu độc lập rất tiện dụng cho điều dưỡng bệnh viện.",
                "commonModels": ["TD-2310D", "TD-2320D", "TD-2320DSA"],
                "replacement": "Thế hệ máy in y tế chuyên dụng."
            },
            {
                "id": "td-4000",
                "name": "TD-4410D / TD-4420DN / TD-4550DNWB (Khổ 4-inch 118mm Công Nghiệp)",
                "lookupKeyword": "TD-4420DN",
                "tier": "Công nghiệp nặng & Kho bãi (Khổ 118mm, Tốc độ 8 ips)",
                "application": "Dán thùng carton, nhãn phụ hàng hóa xuất nhập khẩu, dây chuyền may mặc, ô tô.",
                "status": "Thông dụng",
                "image": "assets/images/brother/td_4420dn.jpg",
                "namingRule": {
                    "example": "TD-4420DN",
                    "standardDoc": "Brother TD-4000 Series Manual",
                    "breakdown": [
                        { "part": "TD-4", "title": "Khổ 4-inch (118mm)", "desc": "Khổ in công nghiệp 104mm tiêu chuẩn." },
                        { "part": "420", "title": "Model 203 dpi - 8 ips", "desc": "Tốc độ in siêu nhanh 203mm/giây." },
                        { "part": "DN", "title": "Direct Thermal & Network", "desc": "In nhiệt trực tiếp + Mạng LAN có dây." }
                    ]
                },
                "warnings": "Có thể cắm thay thế trực tiếp máy in Zebra cũ nhờ tương thích 100% tập lệnh ZPL II.",
                "commonModels": ["TD-4410D", "TD-4420DN", "TD-4550DNWB"],
                "replacement": "Dòng máy in mã vạch để bàn công nghiệp mạnh mẽ nhất của Brother."
            }
        ]
    },
    {
        "id": "cat-brother-consumables",
        "name": "Vật Tư Tiêu Hao & Băng Nhãn Chính Hãng (TZe / HSe / DK)",
        "filterCat": "Vật tư tiêu hao chính hãng",
        "icon": "🎗️",
        "tier": "Chống chọi môi trường khắc nghiệt từ -80°C đến +150°C",
        "application": "Cung cấp vật tư tiêu hao định kỳ cho toàn bộ các dòng máy in Brother.",
        "description": "Băng nhãn công nghệ màng phủ Laminated độc quyền chống hóa chất, chống nước, chống bay màu.",
        "series": [
            {
                "id": "tze-tapes",
                "name": "Băng Nhãn Siêu Bền TZe (Laminated 6mm - 36mm)",
                "lookupKeyword": "TZe-231",
                "tier": "Băng nhãn màng phủ 6 lớp",
                "application": "Dán tủ điện ngoài trời, nhà máy hóa chất, kho lạnh âm độ sâu.",
                "status": "Thông dụng",
                "image": "assets/images/brother/tze_tape.jpg",
                "namingRule": {
                    "example": "TZe-231",
                    "standardDoc": "Brother TZe Tape Specification Guide",
                    "breakdown": [
                        { "part": "TZe-", "title": "Băng Nhãn Laminated", "desc": "Công nghệ màng phủ siêu bền độc quyền." },
                        { "part": "2", "title": "Màu Nền Trắng", "desc": "Nền màu trắng (6 = Vàng, 1 = Trong suốt, 4 = Đỏ)." },
                        { "part": "3", "title": "Bản Rộng 12mm", "desc": "1 = 6mm, 2 = 9mm, 3 = 12mm, 4 = 18mm, 5 = 24mm, 6 = 36mm." },
                        { "part": "1", "title": "Chữ Màu Đen", "desc": "Mực in chữ màu đen có độ tương phản cao." }
                    ]
                },
                "warnings": "Cảnh báo hàng Fake trôi nổi keo dính yếu, dễ làm xước đầu in nhiệt của máy.",
                "commonModels": ["TZe-231", "TZe-241", "TZe-251", "TZe-261", "TZe-631", "TZe-S231", "TZe-FX231"],
                "replacement": "Chỉ dùng băng nhãn chính hãng để được bảo hành máy."
            },
            {
                "id": "hse-tubes",
                "name": "Ống Co Nhiệt HSe & Ruy-Băng Mực TR-100BK",
                "lookupKeyword": "HSe-231",
                "tier": "Ống co nhiệt & Mực in ống PVC",
                "application": "Bọc dây cáp điện tủ bảng điện và ruy-băng in ống cho PT-E850TKW.",
                "status": "Thông dụng",
                "image": "assets/images/brother/hse_tube.jpg",
                "namingRule": {
                    "example": "HSe-231",
                    "standardDoc": "Brother HSe Heat Shrink Tube Guide",
                    "breakdown": [
                        { "part": "HSe-", "title": "Heat Shrink Tube", "desc": "Họ ống co nhiệt bọc dây cáp điện." },
                        { "part": "2", "title": "Ống Màu Trắng", "desc": "Nền màu trắng chữ đen." },
                        { "part": "3", "title": "Khổ 11.7mm", "desc": "Đường kính dây tương thích Ø3.6mm - Ø7.0mm." },
                        { "part": "1", "title": "Chữ Màu Đen", "desc": "Mực in chữ đen sắc nét." }
                    ]
                },
                "warnings": "Tỷ lệ co 2:1 hoặc 3:1 đạt tiêu chuẩn chống cháy UL224.",
                "commonModels": ["HSe-211", "HSe-221", "HSe-231", "HSe-241", "HSe-251", "TR-100BK"],
                "replacement": "Vật tư chính hãng cho thợ điện chuyên nghiệp."
            }
        ]
    }
]

# Danh bạ nhà cung cấp chuẩn mực Brother (từ file Excel thực tế công ty DACO)
brother_suppliers_dir = [
    {
        "id": "vp_tech",
        "name": "Công ty TNHH Giải Pháp Kỹ Thuật VP TECH",
        "shortName": "VP TECH",
        "badge": "Tổng Kho Máy In & Băng Nhãn Brother Số 1 Miền Bắc",
        "badgeType": "badge-green",
        "website": "https://vptech.vn",
        "phone": "024 3785 8899 / sales@vptech.vn",
        "address": "Tòa nhà VP TECH, Nam Từ Liêm, Hà Nội & Chi nhánh TP. Hồ Chí Minh",
        "legalInfo": "Nhà phân phối ủy quyền chính thức các dòng máy in nhãn công nghiệp và vật tư tiêu hao Brother tại Việt Nam.",
        "keyStrengths": "Tồn kho cực lớn máy in cầm tay PT-E110, PT-E310BT, PT-E560BT, PT-E850TKW, dòng QL, dòng TD và đầy đủ mọi mã băng nhãn TZe/HSe.",
        "pros": "Hàng sẵn số lượng lớn; Giao ngay trong ngày hoặc ngày hôm sau; Đội ngũ kỹ thuật rất am hiểu sản phẩm, hỗ trợ nhiệt tình; Chính sách công nợ 30 ngày linh hoạt.",
        "cons": "Giá bán dự án chênh lệch so với thông thường khoảng 5%; Muốn xin giá dự án tốt bắt buộc phải đăng ký thông tin khách hàng trước với hãng để bảo vệ.",
        "buyingGuide": "Ưu tiên số 1 khi DACO cần lấy hàng giao ngay hoặc cần hỗ trợ kỹ thuật chuyên sâu; Luôn đăng ký dự án sớm để chốt giá chiết khấu tốt nhất.",
        "matchTokens": ["vp tech", "vptech", "vp-tech"]
    },
    {
        "id": "daco_brother",
        "name": "Công ty Cổ phần DACO (DACO Industrial Automation)",
        "shortName": "DACO",
        "badge": "Nhà Phân Phối Trực Tiếp - Sẵn Kho & Hỗ Trợ Kỹ Thuật Chuyên Sâu",
        "badgeType": "badge-blue",
        "website": "https://daco.vn",
        "phone": "0936 064 289 / sales@daco.vn",
        "address": "Trụ sở Hà Nội & Văn phòng TP. Hồ Chí Minh",
        "legalInfo": "Đơn vị cung cấp giải pháp máy in nhãn, thiết bị tự động hóa và đào tạo kỹ thuật uy tín cho hàng nghìn nhà máy tại Việt Nam.",
        "keyStrengths": "Stock sẵn các mã chủ lực PT-E110, PT-E560BT, PT-E850TKW, QL-800, QL-820NWB và các mã băng nhãn TZe thông dụng.",
        "pros": "Chính hãng 100%, bảo hành chính thức; Đội ngũ kỹ sư hỗ trợ demo tận nơi, in thử mẫu nhãn thực tế cho khách hàng trước khi mua; Cấp hóa đơn VAT đầy đủ.",
        "cons": "Một số mã máy in mã vạch TD công nghiệp số lượng lớn cần đặt hàng 2-3 tuần.",
        "buyingGuide": "Lợi thế mạnh về tư vấn giải pháp toàn diện cho xưởng tủ điện kết hợp thiết bị tự động hóa.",
        "matchTokens": ["daco", "daco automation"]
    },
    {
        "id": "khue_tu",
        "name": "Công ty TNHH Công Nghệ Khuê Tú",
        "shortName": "Khuê Tú",
        "badge": "Đại Lý Chuyên Sâu Dòng QL & PT-E850TKW",
        "badgeType": "badge-yellow",
        "website": "https://khuetu.vn",
        "phone": "028 3512 8888",
        "address": "Bình Thạnh, TP. Hồ Chí Minh & Chi nhánh Hà Nội",
        "legalInfo": "Đại lý phân phối chính thức máy in nhãn Brother và máy scan chuyên nghiệp.",
        "keyStrengths": "Máy in nhãn giấy QL-800, QL-820NWB, QL-1110NWB và máy in ống lồng PT-E850TKW.",
        "pros": "Giá sỉ cạnh tranh cho các dòng QL; Có sẵn hàng tại TP.HCM hỗ trợ giao nhanh miền Nam; Đầy đủ CO/CQ hãng.",
        "cons": "Chủ yếu mạnh khu vực phía Nam; Dòng máy cầm tay dã ngoại không stock phong phú bằng VP TECH.",
        "buyingGuide": "Lựa chọn tốt cho các đơn hàng khu vực phía Nam hoặc mua số lượng lớn dòng QL.",
        "matchTokens": ["khuê tú", "khue tu", "khuetu"]
    },
    {
        "id": "an_phat_brother",
        "name": "Công ty TNHH Thiết Bị & Công Nghệ An Phát",
        "shortName": "An Phát",
        "badge": "Tổng Kho Chuyên Sâu Dòng Máy In Mã Vạch TD Series",
        "badgeType": "badge-purple",
        "website": "https://anphat.com.vn",
        "phone": "024 3568 2888",
        "address": "Hoàng Mai, Hà Nội",
        "legalInfo": "Doanh nghiệp chuyên sâu về mã số mã vạch, máy in tem nhiệt và giải pháp kho bãi tại Việt Nam.",
        "keyStrengths": "Dòng máy in mã vạch để bàn TD-2310D, TD-2320D, TD-4410D, TD-4420DN, TD-4550DNWB và giấy in cảm nhiệt.",
        "pros": "Stock sẵn đa dạng mã dòng TD; Hiểu sâu về các phần mềm in mã vạch và giao thức ZPL/EPL; Cung cấp trọn gói máy in kèm cuộn decal nhãn bế sẵn.",
        "cons": "Không chuyên dòng máy in ống lồng tủ điện PT-E850TKW.",
        "buyingGuide": "Ưu tiên số 1 khi khách hàng hỏi mua dòng máy in mã vạch để bàn TD Series cho bệnh viện, kho bãi.",
        "matchTokens": ["an phát", "an phat", "anphat"]
    },
    {
        "id": "japan_direct_brother",
        "name": "Kênh Nhập Khẩu Trực Tiếp Nhật Bản (Japan Direct Channel)",
        "shortName": "Kênh Hàng Nhật",
        "badge": "⚠️ Giá Rẻ - Hàng Xách Tay / Nội Địa Nhật (Cảnh Báo CO/CQ)",
        "badgeType": "badge-red",
        "website": "N/A",
        "phone": "N/A (Kênh trung gian đánh hàng)",
        "address": "Tokyo / Osaka, Nhật Bản",
        "legalInfo": "Kênh đặt hàng trực tiếp từ các nhà phân phối hoặc sàn thương mại điện tử tại Nhật Bản.",
        "keyStrengths": "Có thể tìm được các model hiếm, giá gốc máy trần khá tốt; Tiến độ giao hàng 4-6 tuần.",
        "pros": "Giá mua vào ban đầu cạnh tranh; Nguồn hàng chính gốc nội địa Nhật.",
        "cons": "⚠️ CẢNH BÁO MUA HÀNG & SALES: NCC Japan KHÔNG CẤP ĐƯỢC CO/CQ hợp chuẩn Việt Nam; KHÔNG ĐƯỢC BẢO HÀNH chính hãng tại VN; Không có hỗ trợ kỹ thuật; Bàn phím có thể có ký tự tiếng Nhật.",
        "buyingGuide": "Chỉ sử dụng khi khách hàng mua máy lẻ không yêu cầu chứng chỉ nghiệm thu CO/CQ và chấp nhận tự bảo hành; Tuyệt đối không báo vào các công trình dự án nghiệm thu nhà nước hay nhà máy FDI.",
        "matchTokens": ["japan", "nhật", "nước ngoài", "xách tay"]
    }
]


# ==============================================================================
# 2. DỮ LIỆU CHUẨN HÓA PRO-FACE (KÈM ĐỐI ỨNG BEIJER & WEINTEK)
# ==============================================================================

proface_software = [
    {
        "name": "GP-Pro EX",
        "version": "v4.09+ (Bản quyền Key cứng / License điện tử: PFXEXEDLS40A)",
        "target": "Màn hình HMI Pro-face GP4000, GP3000, ST6000, SP5000, IPC Pro-face",
        "purpose": "Phần mềm thiết kế giao diện HMI chủ lực số 1 của Pro-face; hỗ trợ kết nối đồng thời với hơn 800 thiết bị PLC, Inverter, Robot từ nhiều thương hiệu khác nhau (Mitsubishi, Siemens, Omron, Rockwell, Delta, Schneider...)",
        "note": "Hỗ trợ tính năng mô phỏng Offline Simulation cực mạnh không cần màn hình thật; Cho phép chuyển đổi đồ họa và tag địa chỉ từ các dự án màn hình GP2000/GP3000 cũ sang GP4000 chỉ bằng vài cú click chuột.",
        "link": "https://www.proface.com/en/product/software/gpproex"
    },
    {
        "name": "BLUE HMI Runtime & Editor",
        "version": "v3.3+ (Web HMI HTML5)",
        "target": "Dòng màn hình thế hệ mới ST6000, STM6000, ET6000",
        "purpose": "Phần mềm thiết kế Web HMI đồ họa chuẩn HTML5 hiện đại; giao diện responsive tự co giãn kích thước theo độ phân giải màn hình; trải nghiệm vuốt chạm mượt mà như smartphone",
        "note": "Hỗ trợ kết nối bảo mật OPC UA, bảo mật mạng cấp công nghiệp cho nhà máy Smart Factory Industry 4.0.",
        "link": "https://www.proface.com/en/product/software/blue"
    },
    {
        "name": "Pro-face Remote HMI",
        "version": "v1.4+ (iOS & Android)",
        "target": "Toàn bộ HMI Pro-face có kết nối Ethernet",
        "purpose": "Ứng dụng di động cho phép kỹ sư giám sát và điều khiển màn hình Pro-face từ xa qua máy tính bảng iPad/Android hoặc smartphone qua sóng Wi-Fi/4G",
        "note": "Có tính năng bảo mật kiểm soát quyền hạn (Exclusive Control) tránh trường hợp nhiều người cùng bấm nút điều khiển đồng thời gây sự cố máy.",
        "link": "https://www.proface.com/en/product/soft/remote_hmi.html"
    },
    {
        "name": "GP-PRO/PB III C-Package",
        "version": "v7.2 (Phần mềm máy cũ bảo trì)",
        "target": "Các dòng màn hình Pro-face kinh điển đã khai tử: GP2000, GP77R, GP70",
        "purpose": "Đọc/upload chương trình từ màn hình máy bãi thanh lý cũ, sao lưu backup dữ liệu đồ họa trước khi thay mới",
        "note": "Chỉ chạy ổn định trên hệ điều hành Windows XP hoặc Windows 7 32-bit; Cần cáp nạp chuyên dụng USB-GPW-CB03.",
        "link": "https://www.proface.com/"
    }
]

proface_brochures = [
    {
        "title": "Pro-face GP4000 Series Standard HMI General Catalog",
        "category": "Catalog Màn Hình Tiêu Chuẩn",
        "desc": "Tổng quan đầy đủ dòng HMI tiêu chuẩn công nghiệp GP4000 (5.7', 7.0', 10.4', 12.1') từ Pro-face Schneider Electric.",
        "link": "https://www.proface.com/",
        "isLocal": False
    },
    {
        "title": "Pro-face Basic HMI ST6000 / ET6000 Series Brochure",
        "category": "Catalog Dòng Thế Hệ Mới",
        "desc": "Dòng màn hình HMI đồ họa độ phân giải cao True Color 16 triệu màu ST6000 / ET6000 thiết kế viền mỏng hiện đại.",
        "link": "https://www.proface.com/",
        "isLocal": False
    },
    {
        "title": "Pro-face SP5000 Series Smart Portal Flagship Catalog",
        "category": "Catalog HMI Cao Cấp & IPC",
        "desc": "Giải pháp Flagship Smart Portal module hiển thị rời kết hợp Open Box PC chạy Windows cho hệ thống SCADA.",
        "link": "https://www.proface.com/",
        "isLocal": False
    },
    {
        "title": "Pro-face Replacement & Migration Guide (GP2000/GP3000 to GP4000/ST6000)",
        "category": "Cẩm Nang Chuyển Đổi Thay Thế",
        "desc": "Bảng tra cứu kích thước khoét lỗ tủ điện và phương pháp chuyển đổi chương trình từ màn hình cũ sang màn hình mới.",
        "link": "https://www.proface.com/",
        "isLocal": False
    }
]

proface_history = [
    {
        "category": "Màn Hình Cảm Ứng HMI Pro-face (Flagship Nhật Bản)",
        "steps": [
            {
                "era": "1998 - 2008",
                "name": "GP2000 Series (GP-2300, GP-2500, GP-2600)",
                "status": "Đã khai tử EOL",
                "badge": "discontinued",
                "software": "GP-PRO/PB III C-Package",
                "highlight": "Thương hiệu màn hình cảm ứng HMI tiên phong số 1 thế giới từ Digital Electronics Nhật Bản; Cổng nạp tròn Tool Port, bóng đèn huỳnh quang CCFL."
            },
            {
                "era": "2006 - 2018",
                "name": "GP3000 Series (GP-3300, GP-3400, GP-3500, GP-3600)",
                "status": "Đã khai tử EOL",
                "badge": "discontinued",
                "software": "GP-Pro EX v2/v3",
                "highlight": "Dòng màn hình HMI kinh điển lắp trong hàng vạn máy gia công Nhật Bản, Đài Loan nhập về Việt Nam; Hiện tại linh kiện thay thế rất hiếm."
            },
            {
                "era": "2013 - Nay",
                "name": "GP4000 Series (GP4301, GP4401, GP4501, GP4601)",
                "status": "Thông dụng",
                "badge": "classic",
                "software": "GP-Pro EX v4+",
                "highlight": "Dòng HMI tiêu chuẩn công nghiệp bền bỉ số 1, đèn nền LED tuổi thọ 50.000 giờ, hỗ trợ kết nối đa giao thức hơn 800 driver PLC."
            },
            {
                "era": "2020 - Tương lai",
                "name": "ST6000 & ET6000 Series (PFXET6400, PFXST6500...)",
                "status": "Chuẩn hiện hành",
                "badge": "current",
                "software": "BLUE & GP-Pro EX",
                "highlight": "Viền màn hình siêu mỏng, độ phân giải cao True Color 16 triệu màu, giá thành rất cạnh tranh (Hợp Long stock sẵn nhiều), hỗ trợ Web HMI."
            }
        ]
    },
    {
        "category": "Dòng Màn Hình HMI Đối Ứng Theo Dõi Tại DACO (Weintek & Beijer)",
        "steps": [
            {
                "era": "Phổ thông kinh tế",
                "name": "Weintek iP Series (MT8052iP / MT8072iP / MT8106iP)",
                "status": "Thông dụng số 1",
                "badge": "classic",
                "software": "EasyBuilder Pro",
                "highlight": "Màn hình cảm ứng giá rẻ bán chạy nhất phân khúc máy chế tạo vừa và nhỏ tại Việt Nam; DACO stock sẵn nhiều."
            },
            {
                "era": "IoT & Công nghiệp cao cấp",
                "name": "Weintek cMT X Series (cMT2078X / cMT2108X2 / cMT-SVR-200)",
                "status": "Chuẩn hiện hành",
                "badge": "current",
                "software": "EasyBuilder Pro / EasyAccess 2.0",
                "highlight": "CPU Quad-core tốc độ cao, hỗ trợ MQTT, OPC UA, tính năng VPN EasyAccess 2.0 truy cập HMI từ xa qua Internet."
            },
            {
                "era": "Châu Âu & Hàng hải",
                "name": "Beijer X2 Series (X2 Base / X2 Pro / X2 Marine / Extreme)",
                "status": "Chuyên dụng cao cấp",
                "badge": "current",
                "software": "iX Developer",
                "highlight": "Thương hiệu Thụy Điển vỏ nhôm đúc, tiêu chuẩn hàng hải DNV/GL, chịu nhiệt độ khắc nghiệt -30°C đến +70°C."
            }
        ]
    }
]

# 45 Sản phẩm chi tiết chuẩn hóa (Pro-face, Beijer, Weintek - ĐÃ LOẠI BỎ DÒNG RÁC "NCC Nhân Hòa Nghĩa")
# Bổ sung đầy đủ thông số kỹ thuật, bản chất, cảnh báo thực chiến, namingRule
proface_products = [
    # --- NHÓM 1: PRO-FACE GP4000 SERIES (TIÊU CHUẨN) ---
    {
        "id": 1,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 5.7 inch QVGA",
        "serial": "Pro-face PFXGP4301TADW",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4301TADW", "GP-4301TW"],
        "replacement": "Chuyển sang dòng PFXGP4301TAD hoặc nâng cấp lên PFXET6400WAD / PFXST6400WAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình cảm ứng HMI kích thước 5.7-inch màu TFT thuộc dòng GP4000 thế hệ cải tiến Wide-feature (đuôi W có dải chỉnh độ sáng 16 cấp linh hoạt).",
            "**Thông số kỹ thuật**: Kích thước 5.7 inch; Độ phân giải QVGA 320 x 240 pixels; 65,536 màu TFT; Cảm biến điện trở Analog độ nhạy cao; Nguồn cấp 24V DC; Cổng Ethernet 10/100, 1 cổng RS-232C, 1 cổng RS-422/485, USB 2.0.",
            "**CẢNH BÁO THỰC CHIẾN**: Mã đuôi W hiện hãng đã ngừng sản xuất (EOL); Thị trường có nguy cơ cao hàng cũ tháo máy Renew dựng lại vỏ hoặc thay kính cảm ứng ngoài.",
            "**Tư vấn Sales**: Khi khách hỏi thay thế máy cũ bị hỏng, kiểm tra xem tủ điện có chỗ khoét rộng hơn không để tư vấn lên màn hình 7-inch Wide PFXET6400WAD giá rẻ hơn và hiện đại hơn."
        ],
        "suppliers": "Tuyến 1: Hàng nhập khẩu chính ngạch | Tuyến 2: Kênh bãi / Hàng tồn kho",
        "namingRule": {
            "example": "PFXGP4301TADW",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4301TADW",
            "breakdown": [
                { "part": "PFX", "title": "Mã Toàn Cầu (Global Code)", "desc": "Global Part Number của hãng Pro-face Schneider Electric." },
                { "part": "GP4", "title": "Dòng GP4000", "desc": "Họ màn hình HMI cảm ứng đồ họa tiêu chuẩn công nghiệp." },
                { "part": "3", "title": "Kích Thước 5.7 Inch", "desc": "3 = Kích thước đường chéo màn hình 5.7 inch." },
                { "part": "01", "title": "Cấu Hình Chuẩn (Standard)", "desc": "01 = Trang bị đầy đủ cổng Ethernet + 2 cổng COM nối tiếp." },
                { "part": "T", "title": "Màn Hình Màu TFT LCD", "desc": "T = TFT Color LCD 65,536 màu sắc nét." },
                { "part": "A", "title": "Cảm Ứng Analog Resistive", "desc": "A = Cảm ứng điện trở analog độ bền cao." },
                { "part": "D", "title": "Nguồn Điện Một Chiều DC 24V", "desc": "D = Nguồn cấp 24V DC (A = Nguồn xoay chiều AC 100-240V)." },
                { "part": "W", "title": "Phiên Bản W-Series", "desc": "W = Tăng cường dải điều chỉnh độ sáng và tối ưu bộ nhớ." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4", "title": "GP4000 Series", "desc": "HMI Pro-face chuẩn công nghiệp." },
            { "part": "3", "title": "5.7 Inch", "desc": "Kích thước màn hình 5.7 inch." },
            { "part": "01", "title": "Standard Model", "desc": "Tích hợp Ethernet + RS-232 + RS-422/485." },
            { "part": "TAD", "title": "TFT / Analog / 24VDC", "desc": "Màn màu TFT, cảm ứng analog, nguồn 24VDC." },
            { "part": "W", "title": "W-Series", "desc": "Bản cải tiến độ sáng hiển thị." }
        ]
    },
    {
        "id": 2,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 5.7 inch QVGA tiêu chuẩn DC",
        "serial": "Pro-face PFXGP4301TAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4301TAD", "GP-4301T"],
        "replacement": "Model 5.7 inch chủ lực thay thế dòng cũ GP-3300T",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 5.7 inch DC tiêu chuẩn thông dụng nhất của Pro-face, xuất hiện trong hàng nghìn tủ điện điều khiển máy CNC, máy ép nhựa, máy dập tại các nhà máy FDI Nhật Bản.",
            "**Thông số kỹ thuật**: Kích thước 5.7 inch (115.2 x 86.4 mm); Độ phân giải 320 x 240 QVGA; Nguồn cấp 24V DC (tiêu thụ 10.5W); Tuổi thọ đèn LED > 50,000 giờ; Cổng COM1: RS-232C, COM2: RS-422/485, 1 Ethernet 100BASE-TX.",
            "**Cảnh báo thực chiến**: Cần kiểm tra kỹ tem lưng máy; Nhiều đơn vị trên thị trường lấy ruột máy cũ GP-3300 hoặc bo mạch đã qua sửa chữa thay vỏ mới để bán giá cao.",
            "**Thế mạnh cung cấp**: DACO có kênh nhập khẩu trực tiếp nước ngoài, hàng mới 100% nguyên hộp."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4301TAD",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4301TAD",
            "breakdown": [
                { "part": "PFXGP4", "title": "Dòng GP4000 HMI", "desc": "Màn hình cảm ứng đồ họa công nghiệp Pro-face." },
                { "part": "3", "title": "Cỡ Màn Hình 5.7 Inch", "desc": "Độ phân giải 320 x 240 pixels." },
                { "part": "01", "title": "Standard Model", "desc": "Ethernet + Dual Serial Ports." },
                { "part": "T", "title": "TFT Color LCD", "desc": "Màn hình màu TFT 65,536 màu." },
                { "part": "A", "title": "Analog Touch Panel", "desc": "Cảm ứng điện trở analog độ bền cao." },
                { "part": "D", "title": "Nguồn DC 24V", "desc": "Nguồn điện một chiều 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4301", "title": "GP4000 5.7 inch", "desc": "Màn hình 5.7 inch tiêu chuẩn." },
            { "part": "TAD", "title": "TFT / Analog / DC 24V", "desc": "Màn màu TFT, cảm ứng analog, nguồn 24VDC." }
        ]
    },
    {
        "id": 3,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 7.0 inch Wide",
        "serial": "Pro-face PFXGP4402WADW",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4402WADW", "GP-4402WW"],
        "replacement": "Chuyển sang PFXGP4401TAD hoặc dòng mới PFXET6400WAD / PFXST6400WAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 7.0 inch góc rộng tỷ lệ 16:9 phân khúc kinh tế (dòng 02 là dòng rút gọn cổng kết nối).",
            "**Thông số kỹ thuật**: Kích thước 7 inch Wide; Độ phân giải WVGA 800 x 480; 65,536 màu; Nguồn cấp 24V DC; 1 cổng Ethernet, 1 cổng RS-232C, 1 cổng USB.",
            "**Lý do ngừng sản xuất**: Dòng WADW đã hoàn thành vòng đời, chuyển giao toàn bộ sang dòng thế hệ mới ST6000 / ET6000 có giá tốt hơn và viền mỏng hơn.",
            "**Tư vấn Sales**: Báo khách hàng chuyển thẳng sang PFXET6400WAD (Hợp Long stock sẵn nhiều, giá ~3.8 triệu rẻ hơn rất nhiều)."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4402WADW",
            "standardDoc": "Pro-face GP4000 Manual - PFXGP4402WADW",
            "breakdown": [
                { "part": "PFXGP4", "title": "Dòng GP4000", "desc": "HMI Pro-face công nghiệp." },
                { "part": "4", "title": "7.0 Inch Wide", "desc": "Màn hình góc rộng 7.0 inch WVGA." },
                { "part": "02", "title": "Bản Rút Gọn (Compact)", "desc": "02 = Rút gọn cổng truyền thông tối ưu chi phí." },
                { "part": "WADW", "title": "Wide / Analog / DC 24V / W-Series", "desc": "Màn hình Wide, cảm ứng analog, nguồn 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP44", "title": "7.0 Inch Wide", "desc": "Màn hình 7.0 inch tỷ lệ 16:9." },
            { "part": "02", "title": "Compact Model", "desc": "Bản rút gọn cổng kết nối." },
            { "part": "WADW", "title": "Wide DC 24V", "desc": "Màn rộng nguồn điện một chiều 24V DC." }
        ]
    },
    {
        "id": 4,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 7.0 inch WVGA tiêu chuẩn đầy đủ cổng",
        "serial": "Pro-face PFXGP4401TAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4401TAD", "GP-4401T"],
        "replacement": "Model 7 inch tiêu chuẩn cao cấp của Pro-face",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 7 inch TFT cao cấp đầy đủ 2 cổng nối tiếp (COM1 RS-232C, COM2 RS-422/485) và 1 cổng mạng Ethernet tốc độ cao.",
            "**Thông số kỹ thuật**: Kích thước 7.0 inch; Độ phân giải WVGA 800 x 480 pixels; 65,536 màu TFT; Cảm ứng analog; Nguồn 24V DC; Khe cắm thẻ nhớ SD card lưu dữ liệu Alarm / Data Logging.",
            "**Ưu điểm vượt trội**: Khả năng giao tiếp đồng thời 2 giao thức PLC khác nhau (ví dụ vừa giao tiếp với PLC Mitsubishi qua RS-422, vừa giao tiếp với biến tần qua RS-485 và SCADA qua Ethernet).",
            "**Tư vấn Sales**: Dành cho các dự án máy đóng gói, máy chiết rót yêu cầu màn hình chuẩn công nghiệp chính ngạch."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4401TAD",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4401TAD",
            "breakdown": [
                { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình cảm ứng Pro-face." },
                { "part": "4", "title": "7.0 Inch", "desc": "Kích thước 7.0 inch độ phân giải 800x480." },
                { "part": "01", "title": "Standard Dual Serial", "desc": "Trang bị đầy đủ COM1 (RS-232) + COM2 (RS-422/485) + Ethernet + SD Card." },
                { "part": "TAD", "title": "TFT / Analog / DC 24V", "desc": "Màn màu TFT, cảm ứng analog, nguồn DC 24V." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4401", "title": "7.0 Inch Standard", "desc": "Màn 7 inch đầy đủ cổng truyền thông." },
            { "part": "TAD", "title": "TFT / Analog / 24VDC", "desc": "Nguồn điện DC 24V." }
        ]
    },
    {
        "id": 5,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 10.4 inch VGA nguồn DC 24V",
        "serial": "Pro-face PFXGP4501TAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4501TAD", "GP-4501T"],
        "replacement": "Kế thừa và thay thế dòng GP-3500T cũ",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: MODEL 10.4 INCH BÁN CHẠY NHẤT CỦA PRO-FACE: Kích thước tiêu chuẩn công nghiệp cổ điển cho tủ điều khiển máy lớn.",
            "**Thông số kỹ thuật**: Kích thước 10.4 inch (211.2 x 158.4 mm); Độ phân giải VGA 640 x 480 pixels; 65,536 màu TFT; Đèn nền LED tuổi thọ 50,000 giờ; Nguồn cấp 24V DC; 1 Ethernet, COM1 (RS-232C), COM2 (RS-422/485), khe thẻ SD.",
            "**CẢNH BÁO NGUỒN ĐIỆN QUAN TRỌNG**: Đuôi TAD là nguồn điện một chiều DC 24V. Tuyệt đối không cắm nhầm điện lưới xoay chiều 220V sẽ gây nổ bo mạch nguồn ngay lập tức! (Nếu dùng nguồn 220V AC phải chọn mã PFXGP4501TAA).",
            "**Thế mạnh cung cấp**: DACO nhập khẩu trực tiếp giá cực tốt; Hỗ trợ chuyển đổi chương trình từ máy cũ GP-2500 / GP-3500 sang GP4501TAD."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4501TAD",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4501TAD",
            "breakdown": [
                { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình cảm ứng công nghiệp Pro-face." },
                { "part": "5", "title": "10.4 Inch VGA", "desc": "5 = Kích thước đường chéo 10.4 inch (640 x 480 pixels)." },
                { "part": "01", "title": "Standard Model", "desc": "Đầy đủ 2 cổng COM, 1 Ethernet, khe thẻ SD." },
                { "part": "T", "title": "TFT Color", "desc": "Màn hình màu TFT 65k màu." },
                { "part": "A", "title": "Analog Touch", "desc": "Cảm ứng điện trở analog chịu dầu mỡ." },
                { "part": "D", "title": "Nguồn DC 24V", "desc": "D = Nguồn một chiều 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4501", "title": "10.4 Inch Standard", "desc": "Màn hình 10.4 inch chuẩn công nghiệp." },
            { "part": "TAD", "title": "DC 24V Power", "desc": "Nguồn điện DC 24V (không cắm 220VAC)." }
        ]
    },
    {
        "id": 6,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 10.4 inch VGA NGUỒN XOAY CHIỀU AC 100-240V",
        "serial": "Pro-face PFXGP4501TAA",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4501TAA", "GP-4501T (AC)"],
        "replacement": "Bản nguồn AC của PFXGP4501TAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Phiên bản nguồn điện xoay chiều AC 100 - 240V của dòng màn hình 10.4 inch GP4000, chuyên dùng cho các tủ điện máy cũ không có bộ nguồn tổ ong 24VDC rời bên trong.",
            "**Thông số kỹ thuật**: Kích thước 10.4 inch VGA 640x480; 65,536 màu TFT; Nguồn điện xoay chiều AC 100-240V (50/60Hz); Cổng truyền thông: 1 Ethernet, COM1 (RS-232C), COM2 (RS-422/485).",
            "**LƯU Ý THỰC CHIẾN**: Ký tự đuôi 'TAA' (chữ A cuối cùng) chỉ nguồn điện AC. Model này đắt hơn bản TAD khoảng 10-15% và thời gian đặt hàng lâu hơn; Nếu tủ điện có sẵn nguồn 24VDC, khuyên khách nên lấy bản TAD để tiết kiệm chi phí.",
            "**Cảnh báo FAKE / RENEW**: Nhiều đơn vị lấy màn nguồn DC độ chế thêm bo mạch nguồn xung bên trong thành AC rất nguy hiểm, dễ chập cháy."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4501TAA",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4501TAA",
            "breakdown": [
                { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình Pro-face Schneider Electric." },
                { "part": "5", "title": "10.4 Inch VGA", "desc": "Kích thước 10.4 inch." },
                { "part": "01", "title": "Standard Model", "desc": "Đầy đủ cổng truyền thông." },
                { "part": "T", "title": "TFT Color", "desc": "Màn hình màu TFT." },
                { "part": "A", "title": "Analog Touch", "desc": "Cảm ứng điện trở analog." },
                { "part": "A", "title": "Nguồn Xoay Chiều AC 100-240V", "desc": "A = AC Power Supply 100-240V AC (khác với D = DC 24V)." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4501", "title": "10.4 Inch Standard", "desc": "Màn hình 10.4 inch chuẩn công nghiệp." },
            { "part": "TAA", "title": "AC 100-240V Power", "desc": "Nguồn xoay chiều AC 100-240V (cắm thẳng điện lưới)." }
        ]
    },
    {
        "id": 7,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 10.4 inch dòng W-Series",
        "serial": "Pro-face PFXGP4501TADW",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4501TADW"],
        "replacement": "Chuyển sang PFXGP4501TAD hoặc nâng cấp lên PFXST6500WAD / PFXET6500WAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Bản nâng cấp độ sáng W-Series của màn hình 10.4 inch DC; Hiện tại đã ngừng sản xuất do linh kiện đèn nền đời cũ EOL.",
            "**Thông số kỹ thuật**: Kích thước 10.4 inch; VGA 640x480; Nguồn 24V DC; 1 Ethernet, 2 Serial.",
            "**Phương án thay thế**: Thay tương đương 100% kích thước khoét lỗ tủ điện bằng mã PFXGP4501TAD; Hoặc nâng cấp lên màn hình 10.1 inch Wide PFXST6500WAD độ phân giải cao WSVGA 1024x600 sắc nét hơn."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4501TADW",
            "standardDoc": "Pro-face GP4000 Manual - PFXGP4501TADW",
            "breakdown": [
                { "part": "PFXGP4501TAD", "title": "10.4 Inch DC 24V", "desc": "Màn 10.4 inch nguồn 24V DC." },
                { "part": "W", "title": "W-Series", "desc": "Bản cải tiến độ sáng hiển thị." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4501TADW", "title": "10.4 Inch W-Series", "desc": "Màn 10.4 inch dòng W đã ngừng SX." }
        ]
    },
    {
        "id": 8,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 10.4 inch rút gọn cổng",
        "serial": "Pro-face PFXGP4502WADW",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4502WADW"],
        "replacement": "Thay bằng PFXGP4501TAD hoặc PFXET6500WAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Dòng 10.4 inch kinh tế rút gọn cổng (chỉ có 1 cổng nối tiếp RS-232C, không có RS-422); Đã ngừng sản xuất.",
            "**Cảnh báo thực chiến**: Khi thay thế máy cũ chạy mã này, có thể thay bằng bản đầy đủ PFXGP4501TAD chạy hoàn toàn tương thích và ổn định hơn."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4502WADW",
            "standardDoc": "Pro-face GP4000 Manual - PFXGP4502WADW",
            "breakdown": [
                { "part": "PFXGP45", "title": "10.4 Inch", "desc": "Kích thước 10.4 inch." },
                { "part": "02", "title": "Compact Model", "desc": "Bản rút gọn cổng nối tiếp." },
                { "part": "WADW", "title": "W-Series DC 24V", "desc": "Nguồn một chiều 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4502WADW", "title": "10.4 Inch Compact", "desc": "Bản rút gọn cổng đã ngừng sản xuất." }
        ]
    },
    {
        "id": 9,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 12.1 inch SVGA nguồn DC 24V",
        "serial": "Pro-face PFXGP4601TAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4601TAD", "GP-4601T"],
        "replacement": "Model 12.1 inch chuẩn công nghiệp thay thế GP-3600T",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình kích thước lớn 12.1 inch độ phân giải cao SVGA 800 x 600 pixels chuyên dụng cho các trung tâm điều khiển dây chuyền cán thép, xử lý nước thải, nhà máy xi măng, bao bì lớn.",
            "**Thông số kỹ thuật**: Kích thước 12.1 inch; SVGA 800 x 600; 65,536 màu TFT; Nguồn 24V DC; 1 Ethernet 10/100, COM1 (RS-232C), COM2 (RS-422/485), 2 cổng USB Host cắm chuột/bàn phím/USB flash.",
            "**Cảnh báo thực chiến**: Kích thước lớn nên giá trị cao; Kiểm tra kỹ nguồn điện cấp 24VDC có ổn định không trước khi bật nguồn máy mới.",
            "**Thế mạnh cung cấp**: DACO nhập khẩu chính ngạch, có sẵn đội ngũ kỹ thuật hướng dẫn sao lưu dự án."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4601TAD",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4601TAD",
            "breakdown": [
                { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình HMI Pro-face." },
                { "part": "6", "title": "12.1 Inch SVGA", "desc": "6 = Kích thước 12.1 inch (800 x 600 pixels)." },
                { "part": "01", "title": "Standard Model", "desc": "Đầy đủ cổng Ethernet và Dual Serial." },
                { "part": "TAD", "title": "TFT / Analog / DC 24V", "desc": "Nguồn điện một chiều 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4601", "title": "12.1 Inch SVGA", "desc": "Màn hình 12.1 inch độ phân giải cao." },
            { "part": "TAD", "title": "DC 24V Power", "desc": "Nguồn một chiều 24V DC." }
        ]
    },
    {
        "id": 10,
        "cat": "Màn hình Pro-face GP4000",
        "subcat": "Màn hình cảm ứng HMI 12.1 inch SVGA NGUỒN XOAY CHIỀU AC 100-240V",
        "serial": "Pro-face PFXGP4601TAA",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Có",
        "models": ["PFXGP4601TAA", "GP-4601T (AC)"],
        "replacement": "Bản nguồn AC của PFXGP4601TAD",
        "software": "GP-Pro EX",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 12.1 inch SVGA cấp nguồn trực tiếp bằng điện xoay chiều AC 100-240V.",
            "**Thông số kỹ thuật**: Kích thước 12.1 inch (800x600); Nguồn điện AC 100-240V; 1 Ethernet, 2 Serial COM, 2 USB Host.",
            "**Cảnh báo Sales**: Phân biệt rõ đuôi TAA (nguồn AC) với TAD (nguồn DC) khi làm báo giá cho khách; Hàng AC thường hiếm hơn và thời gian đặt hàng 4-6 tuần."
        ],
        "suppliers": "Tuyến 1: DACO (nhập khẩu trực tiếp), Hợp Long | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PFXGP4601TAA",
            "standardDoc": "Pro-face GP4000 Hardware Manual - PFXGP4601TAA",
            "breakdown": [
                { "part": "PFXGP4601", "title": "12.1 Inch Standard", "desc": "Màn hình 12.1 inch chuẩn công nghiệp." },
                { "part": "TAA", "title": "AC 100-240V Power", "desc": "Nguồn xoay chiều AC 100-240V." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXGP4601TAA", "title": "12.1 Inch AC", "desc": "Màn hình 12.1 inch nguồn AC 220V." }
        ]
    },

    # --- NHÓM 2: DÒNG THẾ HỆ MỚI ET6000 & ST6000 (TRUE COLOR 16M MÀU, WEB HMI) ---
    {
        "id": 11,
        "cat": "Màn hình Pro-face ET6000/ST6000",
        "subcat": "Màn hình thế hệ mới 7.0 inch Wide True Color (GIÁ CỰC TỐT, TỒN KHO NHIỀU)",
        "serial": "Pro-face PFXET6400WAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PFXET6400WAD", "ET-6400WA"],
        "replacement": "Thay thế kinh tế hoàn hảo cho PFXGP4402WADW và GP-3400 cũ",
        "software": "GP-Pro EX, BLUE",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: SIÊU PHẨM CHIẾN LƯỢC SỐ 1 CỦA PRO-FACE HIỆN NAY: Màn hình cảm ứng 7 inch Wide thế hệ mới thuộc dòng ET6000 (Basic Web HMI), độ phân giải cao và màu sắc vượt trội nhưng giá thành siêu rẻ (Hợp Long đang bán chỉ ~3.8 triệu đồng).",
            "**Thông số đồ họa vượt bậc**: Màn hình 7.0 inch góc rộng 16:9; Độ phân giải WVGA 800 x 480; Hiển thị TRUE COLOR 16 TRIỆU MÀU (vượt trội hoàn toàn so với 65k màu của GP4000 cũ); Viền bezel siêu mỏng hiện đại.",
            "**Kết nối công nghiệp**: Nguồn cấp 24V DC; 1 cổng Ethernet 10/100, 1 cổng RS-232C/RS-485 cô lập chống nhiễu, 1 cổng USB 2.0; Hỗ trợ thiết kế bằng phần mềm GP-Pro EX hoặc Web HMI BLUE.",
            "**Tư vấn Sales**: MÃ ĐINH ĐỂ THẮNG THẦU: Bất kỳ khi nào khách hàng muốn màn hình Pro-face giá rẻ dưới 4 triệu, lập tức chào mã PFXET6400WAD; Hợp Long và DACO luôn có sẵn hàng trăm chiếc giao ngay trong ngày."
        ],
        "suppliers": "Tuyến 1: HỢP LONG (stock cực lớn, giá ~3.8 triệu), DACO | Tuyến 2: SCHNEIDER ELECTRIC VN",
        "namingRule": {
            "example": "PFXET6400WAD",
            "standardDoc": "Pro-face Basic HMI ET6000 Series Manual - PFXET6400WAD",
            "breakdown": [
                { "part": "PFX", "title": "Global Part Number", "desc": "Mã sản phẩm toàn cầu của hãng Pro-face." },
                { "part": "ET", "title": "ET6000 Series (Entry Web HMI)", "desc": "Dòng màn hình thế hệ mới hỗ trợ đồ họa True Color và Web HMI." },
                { "part": "64", "title": "7.0 Inch Wide", "desc": "64 = Kích thước 7.0 inch tỷ lệ 16:9 (800 x 480 pixels)." },
                { "part": "00", "title": "Standard Basic Model", "desc": "Bản tiêu chuẩn viền đen công nghiệp." },
                { "part": "W", "title": "Widescreen Aspect Ratio", "desc": "Màn hình góc rộng 16:9." },
                { "part": "A", "title": "Analog Touch Panel", "desc": "Cảm ứng điện trở analog độ bền cao." },
                { "part": "D", "title": "Nguồn DC 24V", "desc": "Nguồn điện một chiều 24V DC." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXET", "title": "ET6000 Series", "desc": "Màn hình thế hệ mới True Color." },
            { "part": "6400", "title": "7.0 Inch Wide", "desc": "Kích thước 7.0 inch độ phân giải 800x480." },
            { "part": "WAD", "title": "Wide / Analog / DC 24V", "desc": "Màn hình góc rộng nguồn 24VDC." }
        ]
    },
    {
        "id": 12,
        "cat": "Màn hình Pro-face ET6000/ST6000",
        "subcat": "Màn hình thế hệ mới 10.1 inch Wide True Color 16M màu",
        "serial": "Pro-face PFXET6500WAD / PFXST6500WAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PFXET6500WAD", "PFXST6500WAD"],
        "replacement": "Thay thế hiện đại cho GP4501TAD và GP-3500",
        "software": "GP-Pro EX, BLUE",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 10.1 inch góc rộng tỷ lệ 16:9 thế hệ mới, độ phân giải cao WSVGA 1024 x 600 pixels hiển thị 16 triệu màu cực kỳ mịn màng và chân thực.",
            "**Thông số kỹ thuật**: Kích thước 10.1 inch; WSVGA 1024 x 600; Đèn nền LED tuổi thọ 50,000 giờ; Nguồn 24V DC; Cổng mạng Ethernet, RS-232C, RS-422/485, USB 2.0.",
            "**Sự khác biệt giữa ET và ST**: ET6500WAD là bản Entry tối ưu giá; ST6500WAD là bản Basic cao cấp có 2 cổng Ethernet kép độc lập và vỏ nhôm phay xước phía trước sang trọng.",
            "**Tư vấn Sales**: Hợp Long stock sẵn nhiều cả ET6500 và ET6400 với giá rất cạnh tranh so với phân khúc 10 inch của Mitsubishi hay Siemens."
        ],
        "suppliers": "Tuyến 1: HỢP LONG (stock sẵn giá tốt), DACO | Tuyến 2: SCHNEIDER VN",
        "namingRule": {
            "example": "PFXST6500WAD",
            "standardDoc": "Pro-face Basic HMI ST6000 Series Manual - PFXST6500WAD",
            "breakdown": [
                { "part": "PFXST", "title": "ST6000 Series", "desc": "Dòng màn hình Basic HMI cao cấp viền nhôm." },
                { "part": "65", "title": "10.1 Inch Wide", "desc": "65 = Kích thước 10.1 inch góc rộng (1024 x 600 pixels)." },
                { "part": "00WAD", "title": "Wide / Analog / DC 24V", "desc": "Màn góc rộng, cảm ứng analog, nguồn DC 24V." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXST6500", "title": "10.1 Inch Wide", "desc": "Màn hình 10.1 inch True Color 16 triệu màu." },
            { "part": "WAD", "title": "DC 24V", "desc": "Nguồn một chiều 24V DC." }
        ]
    },
    {
        "id": 13,
        "cat": "Màn hình Pro-face ET6000/ST6000",
        "subcat": "Màn hình thế hệ mới 12.1 inch Wide WXGA 1280x800",
        "serial": "Pro-face PFXET6600WAD / PFXST6600WAD",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PFXET6600WAD", "PFXST6600WAD"],
        "replacement": "Thay thế nâng cấp cho GP4601TAD và GP-3600",
        "software": "GP-Pro EX, BLUE",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Màn hình 12.1 inch góc rộng độ phân giải siêu nét WXGA 1280 x 800 pixels hiển thị 16 triệu màu, đáp ứng các giao diện SCADA nhà máy thông minh.",
            "**Thông số kỹ thuật**: Kích thước 12.1 inch Wide; Độ phân giải 1280 x 800 WXGA; True Color 16M màu; Nguồn 24V DC; Ethernet, Serial RS-232/485.",
            "**Thế mạnh**: Giá chỉ bằng 60% so với dòng GP4601 cũ nhưng độ phân giải và chất lượng hiển thị vượt trội hoàn toàn."
        ],
        "suppliers": "Tuyến 1: HỢP LONG (stock sẵn), DACO | Tuyến 2: SCHNEIDER VN",
        "namingRule": {
            "example": "PFXET6600WAD",
            "standardDoc": "Pro-face Basic HMI ET6000 Series Manual - PFXET6600WAD",
            "breakdown": [
                { "part": "PFXET", "title": "ET6000 Series", "desc": "Màn hình thế hệ mới True Color." },
                { "part": "66", "title": "12.1 Inch Wide", "desc": "66 = Kích thước 12.1 inch tỷ lệ 16:10 (1280 x 800 pixels)." },
                { "part": "00WAD", "title": "Wide Analog DC 24V", "desc": "Nguồn điện DC 24V." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXET6600", "title": "12.1 Inch Wide", "desc": "Màn hình 12.1 inch độ nét cao 1280x800." },
            { "part": "WAD", "title": "DC 24V", "desc": "Nguồn một chiều 24V DC." }
        ]
    },

    # --- NHÓM 3: PHẦN MỀM BẢN QUYỀN PRO-FACE ---
    {
        "id": 14,
        "cat": "Phần mềm & Bản quyền",
        "subcat": "Bản quyền phần mềm lập trình HMI GP-Pro EX chính hãng (Dạng Key)",
        "serial": "Pro-face PFXEXEDLS40A",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["PFXEXEDLS40A", "GP-Pro EX License Key"],
        "replacement": "Bản quyền chính hãng cho các dự án nhà máy FDI",
        "software": "GP-Pro EX v4.09+",
        "brochure": "https://www.proface.com/",
        "points": [
            "**Bản chất**: Bản quyền phần mềm GP-Pro EX chính thức từ hãng Pro-face Schneider Electric; Cung cấp kèm License Certificate và Key bản quyền kích hoạt vĩnh viễn.",
            "**Đặc điểm thị trường**: Hợp Long đang bán giá khoảng 4,120,000 VNĐ; DACO trước đây khó nhập trực tiếp qua kênh thông thường nên cần mua lại từ Hợp Long hoặc đối tác Schneider.",
            "**Tư vấn Sales**: Dành cho các công ty chế tạo máy OEM hoặc các dự án nhà máy FDI Nhật/Hàn yêu cầu có chứng nhận bản quyền phần mềm trong hồ sơ hoàn công kiểm toán."
        ],
        "suppliers": "Tuyến 1: HỢP LONG (bán 4,120,000 VNĐ) | Tuyến 2: SCHNEIDER ELECTRIC VN",
        "namingRule": {
            "example": "PFXEXEDLS40A",
            "standardDoc": "GP-Pro EX License Key Ordering Guide",
            "breakdown": [
                { "part": "PFXEX", "title": "GP-Pro EX Software", "desc": "Họ phần mềm thiết kế giao diện HMI Pro-face." },
                { "part": "EDLS", "title": "Single License", "desc": "Giấy phép bản quyền cho 1 máy tính người dùng đơn lẻ." },
                { "part": "40A", "title": "Phiên Bản 4.x", "desc": "Áp dụng cho toàn bộ các phiên bản GP-Pro EX phiên bản 4." }
            ]
        },
        "codeBreakdown": [
            { "part": "PFXEXEDLS40A", "title": "GP-Pro EX License", "desc": "Key bản quyền phần mềm lập trình HMI Pro-face." }
        ]
    },

    # --- NHÓM 4: DÒNG ĐỐI ỨNG BEIJER HMI (NẰM TRONG SHEET SP HMI CÔNG TY DACO) ---
    {
        "id": 15,
        "cat": "Màn hình Beijer (Thụy Điển)",
        "subcat": "Màn hình Beijer HMI 3.3 inch kinh điển",
        "serial": "Beijer PWS6400F-PA1",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PWS6400F-PA1"],
        "replacement": "Nâng cấp lên dòng Beijer X2 Base hoặc Weintek MT8052iP",
        "software": "ADP6",
        "brochure": "https://www.beijerelectronics.com/",
        "points": [
            "**Bản chất**: Dòng màn hình nhỏ 3.3 inch FSTN đơn sắc cổ điển của Beijer Electronics (trước đây là Hitech HMI); Đã ngừng sản xuất.",
            "**Tồn kho DACO**: DACO HIỆN CÒN TỒN KHO NHIỀU mã này; Rất có lợi thế cung cấp thay thế máy cũ gấp cho khách hàng mà không đâu có sẵn.",
            "**Tư vấn Sales**: Bán giá thanh lý hoặc bán giá dự phòng thay thế máy cũ hỏng với tỷ suất lợi nhuận cao."
        ],
        "suppliers": "Tuyến 1: DACO (còn tồn kho nhiều) | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PWS6400F-PA1",
            "standardDoc": "Beijer Hitech PWS Series Manual",
            "breakdown": [
                { "part": "PWS6400", "title": "Dòng 3.3 Inch Mono", "desc": "Màn hình 3.3 inch FSTN LCD." },
                { "part": "F-PA1", "title": "Cấu Hình Tiêu Chuẩn", "desc": "Nguồn 24V DC, cổng truyền thông nối tiếp RS-232/485." }
            ]
        },
        "codeBreakdown": [
            { "part": "PWS6400F-PA1", "title": "Beijer 3.3 inch", "desc": "Màn hình cổ điển DACO còn tồn kho nhiều." }
        ]
    },
    {
        "id": 16,
        "cat": "Màn hình Beijer (Thụy Điển)",
        "subcat": "Màn hình Beijer HMI 5.7 inch",
        "serial": "Beijer PWS5610S-S",
        "status": "Ngừng sx",
        "fake": "Không",
        "renew": "Có",
        "models": ["PWS5610S-S"],
        "replacement": "Thay bằng X2 Base 5 v2 hoặc Weintek MT8072iP",
        "software": "ADP6",
        "brochure": "https://www.beijerelectronics.com/",
        "points": [
            "**Bản chất**: Dòng màn hình cảm ứng 5.7 inch STN màu thế hệ cũ của Beijer; Đã ngừng sản xuất EOL.",
            "**Tư vấn Sales**: Tư vấn khách hàng chuyển đổi sang dòng Beijer X2 Base hoặc màn hình Weintek."
        ],
        "suppliers": "Tuyến 1: DACO, AVA | Tuyến 2: Kênh nước ngoài",
        "namingRule": {
            "example": "PWS5610S-S",
            "standardDoc": "Beijer PWS5000 Manual",
            "breakdown": [
                { "part": "PWS5610", "title": "5.7 Inch Color", "desc": "Màn hình 5.7 inch màu STN LCD." }
            ]
        },
        "codeBreakdown": [
            { "part": "PWS5610S-S", "title": "Beijer 5.7 inch", "desc": "Màn hình cũ đã ngừng sản xuất." }
        ]
    },
    {
        "id": 17,
        "cat": "Màn hình Beijer (Thụy Điển)",
        "subcat": "Màn hình Beijer thế hệ mới 7.0 inch Wide",
        "serial": "Beijer X2 base 7 v2",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["X2 base 7 v2", "X2 base 7 v2 HP"],
        "replacement": "Dòng HMI kinh tế chủ lực của Beijer",
        "software": "iX Developer",
        "brochure": "https://www.beijerelectronics.com/",
        "points": [
            "**Bản chất**: Dòng màn hình cảm ứng 7 inch thế hệ mới X2 Base v2 của Beijer Electronics Thụy Điển; Thiết kế chuẩn công nghiệp châu Âu tinh tế.",
            "**Thông số kỹ thuật**: Kích thước 7.0 inch; Độ phân giải 800 x 480 WVGA; Màn hình màu TFT; Nguồn 24V DC; 1 Ethernet, 2 Serial COM; Phần mềm thiết kế iX Developer cực đẹp.",
            "**Thông tin thị trường NCC**: Nhà phân phối AVA đang stock kho nhiều mã X2 base 7 v2 với giá bán khoảng 7,633,000 VNĐ.",
            "**Tư vấn Sales**: Thích hợp cho các máy móc xuất khẩu sang thị trường châu Âu hoặc dây chuyền yêu cầu chuẩn CE/UL khắt khe."
        ],
        "suppliers": "Tuyến 1: AVA (stock kho nhiều, giá ~7.6tr) | Tuyến 2: DACO, Nhập khẩu Beijer",
        "namingRule": {
            "example": "X2 base 7 v2",
            "standardDoc": "Beijer X2 Base Series User's Manual",
            "breakdown": [
                { "part": "X2", "title": "Dòng X2 HMI", "desc": "Họ màn hình HMI thế hệ mới của Beijer Electronics." },
                { "part": "base", "title": "Phân Khúc Kinh Tế (Base)", "desc": "Vỏ nhựa công nghiệp tối ưu chi phí (khác với dòng Pro vỏ nhôm)." },
                { "part": "7", "title": "Kích Thước 7.0 Inch", "desc": "Màn hình góc rộng 7.0 inch WVGA." },
                { "part": "v2", "title": "Phiên Bản 2 (Version 2)", "desc": "Thế hệ phần cứng nâng cấp CPU và bộ nhớ đồ họa." }
            ]
        },
        "codeBreakdown": [
            { "part": "X2 base", "title": "Beijer Base Series", "desc": "Màn hình HMI phân khúc kinh tế châu Âu." },
            { "part": "7 v2", "title": "7.0 Inch Ver 2", "desc": "Kích thước 7 inch thế hệ 2." }
        ]
    },
    {
        "id": 18,
        "cat": "Màn hình Beijer (Thụy Điển)",
        "subcat": "Màn hình Beijer vỏ nhôm đúc công nghiệp cao cấp 10.1 inch",
        "serial": "Beijer X2 pro 10",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["X2 pro 10", "X2 pro 10 HP"],
        "replacement": "Dòng vỏ nhôm đúc nguyên khối chống nhiễu",
        "software": "iX Developer",
        "brochure": "https://www.beijerelectronics.com/",
        "points": [
            "**Bản chất**: Dòng màn hình cao cấp vỏ nhôm nguyên khối (Die-cast aluminum casing), thiết kế chống nhiễu từ trường nặng, tản nhiệt tự nhiên không quạt gió.",
            "**Thông số kỹ thuật**: Kích thước 10.1 inch; Độ phân giải 1024 x 600; Màn hình màu TFT; 2 cổng Ethernet kép, 2 cổng Serial; Chứng nhận hàng hải DNV, GL, ABS, LR.",
            "**Thế mạnh NCC**: AVA có giá dự án rất cạnh tranh cho các dòng màn hình X2 Pro."
        ],
        "suppliers": "Tuyến 1: AVA (nhập khẩu dự án), DACO | Tuyến 2: Beijer Electronics",
        "namingRule": {
            "example": "X2 pro 10",
            "standardDoc": "Beijer X2 Pro Series Manual",
            "breakdown": [
                { "part": "X2 pro", "title": "Dòng Cao Cấp Vỏ Nhôm", "desc": "Vỏ nhôm đúc chống va đập, tản nhiệt tốt, chống nhiễu công nghiệp." },
                { "part": "10", "title": "Kích Thước 10.1 Inch", "desc": "Màn hình 10.1 inch độ nét cao 1024x600." }
            ]
        },
        "codeBreakdown": [
            { "part": "X2 pro 10", "title": "Beijer Pro 10.1 inch", "desc": "Dòng vỏ nhôm cao cấp chuẩn châu Âu." }
        ]
    },
    {
        "id": 19,
        "cat": "Màn hình Beijer (Thụy Điển)",
        "subcat": "Màn hình Beijer vỏ nhôm đúc cỡ lớn 15.4 inch",
        "serial": "Beijer X2 pro 15",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["X2 pro 15", "X2 pro 15 HP"],
        "replacement": "Màn hình điều khiển trung tâm nhà máy",
        "software": "iX Developer",
        "brochure": "https://www.beijerelectronics.com/",
        "points": [
            "**Bản chất**: Màn hình công nghiệp kích thước lớn 15.4 inch WXGA 1280 x 800 pixels vỏ nhôm đúc sang trọng cho phòng điều hành hoặc máy móc siêu trọng.",
            "**Thông tin giá thị trường**: AVA xin được giá dự án rất cạnh tranh, giá bán khoảng 51,950,000 VNĐ.",
            "**Tư vấn Sales**: Dành cho các dự án nhà máy bia, nhà máy đóng tàu hàng hải, trạm biến áp điều khiển trung tâm."
        ],
        "suppliers": "Tuyến 1: AVA (giá dự án ~51.9 triệu) | Tuyến 2: DACO, Beijer",
        "namingRule": {
            "example": "X2 pro 15",
            "standardDoc": "Beijer X2 Pro Series Manual",
            "breakdown": [
                { "part": "X2 pro", "title": "Dòng Vỏ Nhôm", "desc": "Thiết kế vỏ kim loại nhôm nguyên khối." },
                { "part": "15", "title": "Kích Thước 15.4 Inch", "desc": "Màn hình cỡ lớn 15.4 inch WXGA." }
            ]
        },
        "codeBreakdown": [
            { "part": "X2 pro 15", "title": "Beijer Pro 15.4 inch", "desc": "Màn hình cỡ lớn cao cấp." }
        ]
    },

    # --- NHÓM 5: DÒNG ĐỐI ỨNG WEINTEK HMI (NẰM TRONG SHEET SP HMI CÔNG TY DACO) ---
    {
        "id": 20,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI kinh tế 4.3 inch bán chạy nhất",
        "serial": "Weintek MT8052iP",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["MT8052iP"],
        "replacement": "Thay thế cho dòng cũ MT8051iP và MT6051iP",
        "software": "EasyBuilder Pro",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: MÀN HÌNH HMI CỠ NHỎ BÁN CHẠY SỐ 1 VIỆT NAM: Dòng màn hình 4.3 inch kinh tế của Weintek Đài Loan, bền bỉ và dễ lập trình nhất.",
            "**Thông số kỹ thuật**: Kích thước 4.3 inch; Độ phân giải 480 x 272; 16.7 triệu màu; CPU Cortex A8 600MHz; Nguồn 24V DC; 1 cổng Ethernet, 1 cổng COM (RS-232/RS-485), 1 cổng USB.",
            "**Thông tin giá thị trường**: Giá bán thông thường khoảng 2,900,000 VNĐ; Nhân Hòa Nghĩa bán ~2.95tr; DACO có hàng sẵn giá cực kỳ cạnh tranh.",
            "**Tư vấn Sales**: Sản phẩm 'gối đầu giường' của mọi thợ chế tạo máy đóng gói nhỏ, máy ép khuôn, chiết rót mini."
        ],
        "suppliers": "Tuyến 1: DACO (sẵn hàng giá tốt), NHÂN HÒA NGHĨA (NPP chính thức) | Tuyến 2: GIA LỰC",
        "namingRule": {
            "example": "MT8052iP",
            "standardDoc": "Weintek iP Series Manual - MT8052iP",
            "breakdown": [
                { "part": "MT8", "title": "Họ Màn Hình HMI Weintek", "desc": "Dòng màn hình màu cảm ứng Weintek." },
                { "part": "05", "title": "Kích Thước 4.3 Inch", "desc": "Màn hình 4.3 inch góc rộng 480x272." },
                { "part": "2", "title": "Thế Hệ Nâng Cấp (Ver 2)", "desc": "Nâng cấp bộ nhớ và CPU nhanh hơn bản 1." },
                { "part": "iP", "title": "Dòng Kinh Tế (iP Series)", "desc": "iP = Phân khúc kinh tế phổ thông bán chạy nhất." }
            ]
        },
        "codeBreakdown": [
            { "part": "MT8052iP", "title": "Weintek 4.3 inch", "desc": "Màn hình kinh tế 4.3 inch giá rẻ bán chạy số 1." }
        ]
    },
    {
        "id": 21,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI 7.0 inch kinh tế 'Quốc Dân' Việt Nam",
        "serial": "Weintek MT8072iP",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["MT8072iP"],
        "replacement": "Thay thế cho dòng huyền thoại MT8071iP / MT8071iE",
        "software": "EasyBuilder Pro",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: 'MÀN HÌNH HMI QUỐC DÂN' TẠI VIỆT NAM: Màn hình 7 inch phân khúc kinh tế có sản lượng tiêu thụ lớn nhất tại thị trường Việt Nam.",
            "**Thông số kỹ thuật**: Kích thước 7.0 inch Wide; Độ phân giải WVGA 800 x 480; 16 triệu màu; CPU 600MHz; Nguồn 24V DC; 1 Ethernet 10/100, 2 cổng Serial (RS-232 / RS-485 2W/4W), 1 USB Host.",
            "**Tồn kho thị trường**: Gia Lực và DACO stock kho số lượng lớn hàng trăm chiếc; Nhân Hòa Nghĩa phân phối chính ngạch; Báo giá cực nhanh.",
            "**Tư vấn Sales**: Bất kỳ đơn vị nào cần màn hình 7 inch giá hợp lý, kết nối được mọi loại PLC từ Mitsubishi, Delta, Siemens S7-1200 đến Omron đều tư vấn MT8072iP."
        ],
        "suppliers": "Tuyến 1: DACO (stock lớn), GIA LỰC (stock nhiều), NHÂN HÒA NGHĨA | Tuyến 2: Kênh đại lý toàn quốc",
        "namingRule": {
            "example": "MT8072iP",
            "standardDoc": "Weintek iP Series Manual - MT8072iP",
            "breakdown": [
                { "part": "MT8", "title": "Màn Hình Weintek", "desc": "Màn hình HMI đồ họa màu." },
                { "part": "07", "title": "7.0 Inch Wide", "desc": "Kích thước 7.0 inch 800x480." },
                { "part": "2", "title": "Thế Hệ 2", "desc": "Nâng cấp thay thế MT8071iP cũ." },
                { "part": "iP", "title": "iP Series", "desc": "Phân khúc kinh tế bán chạy nhất." }
            ]
        },
        "codeBreakdown": [
            { "part": "MT8072iP", "title": "Weintek 7.0 inch", "desc": "Màn hình 7 inch quốc dân bán chạy nhất VN." }
        ]
    },
    {
        "id": 22,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI 7.0 inch cao cấp dòng cMT X Series",
        "serial": "Weintek cMT2078X",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT2078X"],
        "replacement": "Dòng hiệu năng cao thế hệ mới thay thế cMT3072",
        "software": "EasyBuilder Pro, EasyAccess 2.0",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Dòng màn hình 7 inch cao cấp thuộc thế hệ cMT X Series, trang bị vi xử lý Quad-core 4 nhân siêu tốc độ, mượt mà gấp 4 lần dòng iP thông thường.",
            "**Thông số kỹ thuật**: Kích thước 7.0 inch; Độ phân giải 800 x 480; CPU Quad-core 1.6GHz; Bộ nhớ Flash 4GB, RAM 1GB; Nguồn 24V DC; 1 Ethernet, 2 Serial; Hỗ trợ tính năng giám sát từ xa WebView.",
            "**Thông tin giá thị trường**: Giá bán dao động từ 4,100,000 VNĐ đến 4,200,000 VNĐ (Gia Lực ~4.1tr, Nhân Hòa Nghĩa ~4.2tr, DACO giá rất cạnh tranh).",
            "**Tư vấn Sales**: Dành cho các khách hàng chế tạo máy cao cấp yêu cầu màn hình chuyển trang đồ họa mượt, vẽ biểu đồ đồ thị thời gian thực nhiều điểm."
        ],
        "suppliers": "Tuyến 1: DACO, GIA LỰC (giá 4.1tr), NHÂN HÒA NGHĨA (giá 4.2tr) | Tuyến 2: Kênh tự động hóa",
        "namingRule": {
            "example": "cMT2078X",
            "standardDoc": "Weintek cMT X Series Manual - cMT2078X",
            "breakdown": [
                { "part": "cMT", "title": "cMT Architecture", "desc": "Kiến trúc đám mây Cloud HMI thông minh." },
                { "part": "2", "title": "Phân Khúc Tiêu Chuẩn", "desc": "Dòng cMT 2000 tiêu chuẩn (dòng 3000 là cao cấp có 2 cổng LAN)." },
                { "part": "07", "title": "Kích Thước 7.0 Inch", "desc": "Màn hình 7.0 inch." },
                { "part": "8X", "title": "Thế Hệ X (Quad-Core)", "desc": "CPU 4 nhân Quad-Core hiệu năng cao." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT2078X", "title": "cMT X 7.0 inch", "desc": "Màn hình cao cấp CPU 4 nhân siêu mượt." }
        ]
    },
    {
        "id": 23,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI 10.1 inch kinh tế",
        "serial": "Weintek MT8106iP",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["MT8106iP"],
        "replacement": "Thay thế cho dòng cũ MT8102iP / MT8102iE",
        "software": "EasyBuilder Pro",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Dòng màn hình 10.1 inch kinh tế của Weintek, độ phân giải cao 1024 x 600 pixels.",
            "**Thông tin giá thị trường**: Giá bán thông thường khoảng 4,600,000 VNĐ - 5,000,000 VNĐ; DACO stock sẵn giá cực tốt.",
            "**Tư vấn Sales**: Sản phẩm 10.1 inch phổ thông giá rẻ nhất trên thị trường hiện nay cho các máy móc cần hiển thị nhiều thông số."
        ],
        "suppliers": "Tuyến 1: DACO (sẵn hàng giá tốt), NHÂN HÒA NGHĨA, GIA LỰC | Tuyến 2: Kênh đại lý",
        "namingRule": {
            "example": "MT8106iP",
            "standardDoc": "Weintek iP Series Manual - MT8106iP",
            "breakdown": [
                { "part": "MT810", "title": "10.1 Inch Wide", "desc": "Màn hình 10.1 inch độ phân giải 1024x600." },
                { "part": "6iP", "title": "iP Ver 6", "desc": "Thế hệ cải tiến mới nhất dòng kinh tế." }
            ]
        },
        "codeBreakdown": [
            { "part": "MT8106iP", "title": "Weintek 10.1 inch", "desc": "Màn hình kinh tế 10.1 inch giá rẻ." }
        ]
    },
    {
        "id": 24,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI 10.1 inch cao cấp cMT X Series",
        "serial": "Weintek cMT2108X2",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT2108X2"],
        "replacement": "Thế hệ mới nâng cấp thay thế cMT2108X và cMT3102X",
        "software": "EasyBuilder Pro, EasyAccess 2.0",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Dòng màn hình 10.1 inch Quad-core hiệu năng cao, hiển thị góc nhìn rộng IPS sắc nét.",
            "**Thông số kỹ thuật**: Kích thước 10.1 inch; 1024 x 600; CPU Quad-core 1.6GHz, Flash 4GB, RAM 1GB; Nguồn 24V DC; 1 Ethernet, 2 Serial.",
            "**Tư vấn Sales**: Hàng chủ lực cho các tủ điều khiển máy tự động hóa cao cấp tại Việt Nam."
        ],
        "suppliers": "Tuyến 1: DACO, NHÂN HÒA NGHĨA, GIA LỰC | Tuyến 2: Kênh tự động hóa",
        "namingRule": {
            "example": "cMT2108X2",
            "standardDoc": "Weintek cMT X Manual - cMT2108X2",
            "breakdown": [
                { "part": "cMT2108", "title": "10.1 Inch cMT", "desc": "Màn 10.1 inch kiến trúc đám mây." },
                { "part": "X2", "title": "Thế Hệ X2 Quad-Core", "desc": "CPU 4 nhân thế hệ mới nhất." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT2108X2", "title": "cMT 10.1 inch X2", "desc": "Màn hình 10.1 inch CPU 4 nhân cao cấp." }
        ]
    },
    {
        "id": 25,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI 12.1 inch cao cấp cMT X Series",
        "serial": "Weintek cMT2128X",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT2128X"],
        "replacement": "Thay thế cho dòng cũ MT8121XE",
        "software": "EasyBuilder Pro, EasyAccess 2.0",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Màn hình 12.1 inch độ phân giải siêu nét 1024 x 768 pixels, màn hình màu TFT góc nhìn rộng.",
            "**Thông tin giá thị trường**: Giá bán thông thường khoảng 11,300,000 VNĐ - 11,800,000 VNĐ (Nhân Hòa Nghĩa bán ~11.8tr cao hơn DACO khoảng 500k).",
            "**Tư vấn Sales**: DACO có lợi thế cạnh tranh giá tốt hơn đối thủ 500k, sẵn sàng chốt đơn ngay."
        ],
        "suppliers": "Tuyến 1: DACO (giá ~11.3tr), NHÂN HÒA NGHĨA (giá 11.8tr) | Tuyến 2: GIA LỰC",
        "namingRule": {
            "example": "cMT2128X",
            "standardDoc": "Weintek cMT X Manual - cMT2128X",
            "breakdown": [
                { "part": "cMT212", "title": "12.1 Inch cMT", "desc": "Kích thước 12.1 inch (1024 x 768 pixels)." },
                { "part": "8X", "title": "Quad-Core X Series", "desc": "CPU 4 nhân tốc độ cao." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT2128X", "title": "Weintek 12.1 inch", "desc": "Màn hình 12.1 inch độ phân giải cao." }
        ]
    },
    {
        "id": 26,
        "cat": "Màn hình Weintek (Đài Loan)",
        "subcat": "Màn hình HMI cỡ lớn 15.0 inch cao cấp cMT X Series",
        "serial": "Weintek cMT2158X",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT2158X"],
        "replacement": "Thay thế cho dòng cũ MT8150XE",
        "software": "EasyBuilder Pro, EasyAccess 2.0",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Màn hình cỡ lớn 15.0 inch độ phân giải XGA 1024 x 768 pixels, góc nhìn rộng 85 độ mọi hướng, CPU Quad-core 1.6GHz.",
            "**Tồn kho thị trường**: Gia Lực và DACO stock sẵn; Nhân Hòa Nghĩa phân phối chính thức; Được đẩy mạnh marketing top tìm kiếm Google.",
            "**Tư vấn Sales**: Lựa chọn kinh tế nhất cho các phòng điều khiển trung tâm so với giá trên 50 triệu của Beijer hay Siemens."
        ],
        "suppliers": "Tuyến 1: DACO, GIA LỰC, NHÂN HÒA NGHĨA | Tuyến 2: Kênh tự động hóa",
        "namingRule": {
            "example": "cMT2158X",
            "standardDoc": "Weintek cMT X Manual - cMT2158X",
            "breakdown": [
                { "part": "cMT215", "title": "15.0 Inch", "desc": "Kích thước 15.0 inch XGA." },
                { "part": "8X", "title": "Quad-Core", "desc": "CPU 4 nhân hiệu năng cao." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT2158X", "title": "Weintek 15.0 inch", "desc": "Màn hình cỡ lớn 15 inch cho phòng điều khiển." }
        ]
    },
    {
        "id": 27,
        "cat": "Bộ chuyển đổi HMI & Cloud Box",
        "subcat": "Bộ xuất hình HMI ra màn hình Tivi lớn qua cổng HDMI",
        "serial": "Weintek cMT-FHDX-820",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT-FHDX-820"],
        "replacement": "Thay thế dòng cũ cMT-FHD",
        "software": "EasyBuilder Pro",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Bộ điều khiển HMI không màn hình, tích hợp cổng xuất hình ảnh HDMI chuẩn Full HD 1080p cắm trực tiếp ra Tivi 55 inch, 65 inch hoặc màn hình máy tính.",
            "**Ứng dụng**: Hiển thị bảng Andon năng suất dây chuyền sản xuất, bảng theo dõi OEE, sơ đồ vận hành nhà máy trực quan trên màn hình Tivi lớn trong xưởng.",
            "**Tư vấn Sales**: Rất được các nhà máy may mặc, lắp ráp điện tử ưa chuộng để làm bảng Andon tiến độ."
        ],
        "suppliers": "Tuyến 1: DACO, NHÂN HÒA NGHĨA | Tuyến 2: GIA LỰC",
        "namingRule": {
            "example": "cMT-FHDX-820",
            "standardDoc": "Weintek HDMI Display Gateway Manual",
            "breakdown": [
                { "part": "cMT-FHD", "title": "Full HD HDMI Gateway", "desc": "Bộ điều khiển HMI xuất cổng HDMI Full HD." },
                { "part": "X-820", "title": "Quad-Core X Series", "desc": "Trang bị CPU 4 nhân xử lý đồ họa mượt mà." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT-FHDX-820", "title": "HMI HDMI Gateway", "desc": "Bộ xuất màn hình HMI ra Tivi lớn Full HD." }
        ]
    },
    {
        "id": 28,
        "cat": "Bộ chuyển đổi HMI & Cloud Box",
        "subcat": "HMI Server không màn hình điều khiển qua iPad / Tablet / PC",
        "serial": "Weintek cMT-SVR-200",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["cMT-SVR-200"],
        "replacement": "Thế hệ máy chủ HMI nhỏ gọn",
        "software": "EasyBuilder Pro, cMT Viewer App",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Khối HMI Box gắn thanh ray tủ điện (DIN-rail), không có màn hình vật lý; Toàn bộ giao diện được truyền không dây qua mạng tới máy tính bảng iPad, tablet Android hoặc máy tính PC qua ứng dụng cMT Viewer.",
            "**Lợi ích đột phá**: Tiết kiệm không gian mặt tủ điện; Nhiều người có thể cùng cầm máy tính bảng đi lại quanh máy để theo dõi và điều khiển.",
            "**Tư vấn Sales**: Dành cho các hệ thống máy móc khép kín, phòng sạch hoặc dây chuyền phức tạp cần tính cơ động."
        ],
        "suppliers": "Tuyến 1: DACO, NHÂN HÒA NGHĨA | Tuyến 2: GIA LỰC",
        "namingRule": {
            "example": "cMT-SVR-200",
            "standardDoc": "Weintek Server HMI Manual - cMT-SVR-200",
            "breakdown": [
                { "part": "cMT-SVR", "title": "HMI Server Unit", "desc": "Khối máy chủ HMI gắn thanh ray tủ điện DIN-rail." },
                { "part": "200", "title": "Thế Hệ 200", "desc": "Cổng Ethernet kép, hỗ trợ kết nối Wi-Fi qua USB dongle." }
            ]
        },
        "codeBreakdown": [
            { "part": "cMT-SVR-200", "title": "HMI Server Box", "desc": "HMI không màn hình điều khiển qua iPad/Tablet." }
        ]
    },
    {
        "id": 29,
        "cat": "Bộ chuyển đổi HMI & Cloud Box",
        "subcat": "Thẻ bản quyền EasyAccess 2.0 mở cổng VPN truy cập HMI từ xa qua Internet",
        "serial": "Weintek RZACEA020",
        "status": "Thông dụng",
        "fake": "Không",
        "renew": "Không",
        "models": ["RZACEA020", "EasyAccess 2.0 Activation Card"],
        "replacement": "Thẻ kích hoạt bản quyền vĩnh viễn",
        "software": "EasyAccess 2.0",
        "brochure": "https://www.weintek.com/",
        "points": [
            "**Bản chất**: Thẻ cào bản quyền (Activation Card) mở khóa tính năng VPN đường hầm bảo mật EasyAccess 2.0 vĩnh viễn cho 1 màn hình HMI Weintek.",
            "**Công dụng thần thánh**: Kỹ sư chỉ cần ngồi tại văn phòng hoặc ở nhà mở phần mềm là có thể kết nối xuyên qua tường lửa Internet để nạp chương trình HMI, đọc dữ liệu PLC, sửa lỗi máy móc cho khách hàng ở bất kỳ đâu trên thế giới mà không cần cài đặt IP tĩnh hay mở port router.",
            "**Tư vấn Sales**: Bán kèm thẻ này cho mọi khách hàng chế tạo máy xuất khẩu ra nước ngoài hoặc đi các tỉnh xa để tiết kiệm hàng chục triệu chi phí đi lại bảo hành."
        ],
        "suppliers": "Tuyến 1: DACO (kích hoạt ngay trong 5 phút), NHÂN HÒA NGHĨA | Tuyến 2: GIA LỰC",
        "namingRule": {
            "example": "RZACEA020",
            "standardDoc": "Weintek EasyAccess 2.0 Activation Guide",
            "breakdown": [
                { "part": "RZACEA", "title": "EasyAccess License", "desc": "Mã bản quyền dịch vụ đám mây EasyAccess 2.0." },
                { "part": "020", "title": "Bản Quyền Vĩnh Viễn", "desc": "Kích hoạt 1 lần sử dụng trọn đời theo Serial máy." }
            ]
        },
        "codeBreakdown": [
            { "part": "RZACEA020", "title": "EasyAccess 2.0 Card", "desc": "Thẻ bản quyền truy cập và lập trình HMI từ xa qua Internet." }
        ]
    }
]

# Sơ đồ cây phân cấp Pro-face (kèm phân nhánh Beijer & Weintek)
proface_tree = [
    {
        "id": "cat-proface-gp4000",
        "name": "Màn Hình Pro-face GP4000 (Tiêu Chuẩn Công Nghiệp Bền Bỉ)",
        "filterCat": "Màn hình Pro-face GP4000",
        "icon": "🖥️",
        "tier": "Chuẩn mực máy công nghiệp Nhật Bản (5.7', 7.0', 10.4', 12.1')",
        "application": "Dây chuyền cơ khí, đúc ép nhựa, máy dập, máy gia công CNC tại các nhà máy FDI Nhật Bản, Hàn Quốc.",
        "description": "Dòng màn hình cảm ứng HMI tiêu chuẩn công nghiệp huyền thoại của Pro-face Schneider Electric.",
        "series": [
            {
                "id": "gp4301",
                "name": "GP4301 Series (5.7 Inch QVGA DC)",
                "lookupKeyword": "PFXGP4301TAD",
                "tier": "Cỡ nhỏ thông dụng (5.7 inch)",
                "application": "Tủ điều khiển máy vừa và nhỏ, máy CNC.",
                "status": "Thông dụng",
                "image": "assets/images/proface/gp4301.jpg",
                "namingRule": {
                    "example": "PFXGP4301TAD",
                    "standardDoc": "Pro-face GP4000 Manual - PFXGP4301TAD",
                    "breakdown": [
                        { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình cảm ứng Pro-face." },
                        { "part": "3", "title": "5.7 Inch", "desc": "Kích thước 5.7 inch QVGA 320x240." },
                        { "part": "01", "title": "Standard Model", "desc": "Đầy đủ Ethernet + 2 cổng COM nối tiếp." },
                        { "part": "TAD", "title": "TFT / Analog / DC 24V", "desc": "Màn màu TFT, cảm ứng analog, nguồn 24V DC." }
                    ]
                },
                "warnings": "Cảnh báo máy bãi tháo máy Renew tráo vỏ; DACO nhập khẩu chính ngạch 100% nguyên hộp.",
                "commonModels": ["PFXGP4301TAD", "PFXGP4301TADW"],
                "replacement": "Kế thừa và thay thế dòng GP-3300T cũ."
            },
            {
                "id": "gp4401",
                "name": "GP4401 Series (7.0 Inch WVGA 800x480)",
                "lookupKeyword": "PFXGP4401TAD",
                "tier": "Tiêu chuẩn góc rộng (7.0 inch)",
                "application": "Dây chuyền sản xuất tự động hóa, robot hàn, đóng gói.",
                "status": "Thông dụng",
                "image": "assets/images/proface/gp4401.jpg",
                "namingRule": {
                    "example": "PFXGP4401TAD",
                    "standardDoc": "Pro-face GP4000 Manual - PFXGP4401TAD",
                    "breakdown": [
                        { "part": "PFXGP4", "title": "GP4000 Series", "desc": "Màn hình Pro-face công nghiệp." },
                        { "part": "4", "title": "7.0 Inch Wide", "desc": "Độ phân giải 800x480 WVGA." },
                        { "part": "01", "title": "Standard Model", "desc": "2 cổng COM + 1 Ethernet + khe thẻ SD." },
                        { "part": "TAD", "title": "DC 24V Power", "desc": "Nguồn một chiều 24V DC." }
                    ]
                },
                "warnings": "Khả năng kết nối đồng thời 2 giao thức PLC khác nhau trên 2 cổng COM độc lập.",
                "commonModels": ["PFXGP4401TAD", "PFXGP4402WADW"],
                "replacement": "Dòng 7 inch tiêu chuẩn công nghiệp."
            },
            {
                "id": "gp4501",
                "name": "GP4501 Series (10.4 Inch VGA 640x480 Bán Chạy Nhất)",
                "lookupKeyword": "PFXGP4501TAD",
                "tier": "Chủ lực 10.4 inch (Nguồn DC 24V hoặc AC 220V)",
                "application": "Tủ điều khiển chính dây chuyền sản xuất, máy ép nhựa cỡ lớn.",
                "status": "Thông dụng",
                "image": "assets/images/proface/gp4501.jpg",
                "namingRule": {
                    "example": "PFXGP4501TAD",
                    "standardDoc": "Pro-face GP4000 Manual - PFXGP4501TAD",
                    "breakdown": [
                        { "part": "PFXGP45", "title": "10.4 Inch VGA", "desc": "Kích thước 10.4 inch (640 x 480 pixels)." },
                        { "part": "01", "title": "Standard Model", "desc": "Đầy đủ Ethernet và 2 cổng COM." },
                        { "part": "TAD", "title": "Nguồn DC 24V", "desc": "TAD = Nguồn DC 24V (TAA = Nguồn AC 100-240V)." }
                    ]
                },
                "warnings": "Lưu ý sống còn: Đuôi TAD cấp nguồn 24V DC; Đuôi TAA cấp nguồn 220V AC. Tuyệt đối không cắm nhầm điện áp!",
                "commonModels": ["PFXGP4501TAD", "PFXGP4501TAA", "PFXGP4501TADW"],
                "replacement": "Thay thế trực tiếp cho GP-2500 và GP-3500 cũ."
            },
            {
                "id": "gp4601",
                "name": "GP4601 Series (12.1 Inch SVGA 800x600)",
                "lookupKeyword": "PFXGP4601TAD",
                "tier": "Cỡ lớn cao cấp (12.1 inch)",
                "application": "Phòng điều hành, dây chuyền cán thép, xử lý nước, xi măng.",
                "status": "Thông dụng",
                "image": "assets/images/proface/gp4601.jpg",
                "namingRule": {
                    "example": "PFXGP4601TAD",
                    "standardDoc": "Pro-face GP4000 Manual - PFXGP4601TAD",
                    "breakdown": [
                        { "part": "PFXGP46", "title": "12.1 Inch SVGA", "desc": "Kích thước 12.1 inch độ phân giải 800x600." },
                        { "part": "01", "title": "Standard Model", "desc": "Đầy đủ kết nối mạng và nối tiếp." },
                        { "part": "TAD", "title": "Nguồn DC 24V", "desc": "Nguồn một chiều 24V DC." }
                    ]
                },
                "warnings": "Kiểm tra kỹ nguồn điện cấp trước khi lắp đặt.",
                "commonModels": ["PFXGP4601TAD", "PFXGP4601TAA"],
                "replacement": "Thay thế cho dòng cũ GP-3600T."
            }
        ]
    },
    {
        "id": "cat-proface-st6000",
        "name": "Màn Hình Thế Hệ Mới ET6000 & ST6000 (True Color 16M Màu, Web HMI)",
        "filterCat": "Màn hình Pro-face ET6000/ST6000",
        "icon": "⚡",
        "tier": "Mũi nhọn công nghệ thế hệ mới - Giá cực tốt",
        "application": "Dây chuyền tự động hóa thế hệ mới, tích hợp đồ họa Web HTML5, IoT nhà máy thông minh.",
        "description": "Dòng màn hình viền mỏng hiện đại, độ phân giải cao và màu sắc vượt trội của Pro-face Schneider Electric.",
        "series": [
            {
                "id": "et6400",
                "name": "PFXET6400WAD (7.0 Inch True Color - GIÁ SỐC ~3.8 TRIỆU)",
                "lookupKeyword": "PFXET6400WAD",
                "tier": "Chiến lược số 1 (7 inch True Color giá siêu rẻ)",
                "application": "Máy chế tạo OEM, tủ điện tự động hóa thế hệ mới.",
                "status": "Thông dụng",
                "image": "assets/images/proface/et6400.jpg",
                "namingRule": {
                    "example": "PFXET6400WAD",
                    "standardDoc": "Pro-face ET6000 Series Manual - PFXET6400WAD",
                    "breakdown": [
                        { "part": "PFXET", "title": "ET6000 Series", "desc": "Màn hình thế hệ mới hỗ trợ True Color và Web HMI." },
                        { "part": "6400", "title": "7.0 Inch Wide", "desc": "Kích thước 7.0 inch 800x480 True Color 16M màu." },
                        { "part": "WAD", "title": "Wide Analog DC 24V", "desc": "Màn góc rộng nguồn 24V DC." }
                    ]
                },
                "warnings": "Mã chiến lược để thắng thầu; Hợp Long và DACO luôn có sẵn kho số lượng lớn.",
                "commonModels": ["PFXET6400WAD"],
                "replacement": "Thay thế hoàn hảo cho mọi màn hình 7 inch đời cũ."
            },
            {
                "id": "et6500-st6500",
                "name": "PFXET6500WAD / PFXST6500WAD (10.1 Inch Wide 1024x600)",
                "lookupKeyword": "PFXST6500WAD",
                "tier": "Màn rộng 10.1 inch độ nét cao 16 triệu màu",
                "application": "Tủ điều khiển trung tâm máy đóng gói, máy chiết rót tốc độ cao.",
                "status": "Thông dụng",
                "image": "assets/images/proface/st6500.jpg",
                "namingRule": {
                    "example": "PFXST6500WAD",
                    "standardDoc": "Pro-face ST6000 Manual - PFXST6500WAD",
                    "breakdown": [
                        { "part": "PFXST", "title": "ST6000 Series", "desc": "Basic HMI cao cấp viền nhôm phay xước." },
                        { "part": "6500", "title": "10.1 Inch Wide", "desc": "Độ phân giải 1024x600 WSVGA." },
                        { "part": "WAD", "title": "Wide DC 24V", "desc": "Nguồn một chiều 24V DC." }
                    ]
                },
                "warnings": "Bản ST6500WAD có 2 cổng Ethernet độc lập hỗ trợ kết nối mạng kép an toàn.",
                "commonModels": ["PFXET6500WAD", "PFXST6500WAD"],
                "replacement": "Nâng cấp hiện đại cho GP4501 và GP-3500."
            },
            {
                "id": "et6600-st6600",
                "name": "PFXET6600WAD / PFXST6600WAD (12.1 Inch WXGA 1280x800)",
                "lookupKeyword": "PFXET6600WAD",
                "tier": "Màn rộng 12.1 inch độ phân giải cao 1280x800",
                "application": "Dây chuyền sản xuất lớn, hiển thị đồ họa SCADA chi tiết.",
                "status": "Thông dụng",
                "image": "assets/images/proface/et6600.jpg",
                "namingRule": {
                    "example": "PFXET6600WAD",
                    "standardDoc": "Pro-face ET6000 Manual - PFXET6600WAD",
                    "breakdown": [
                        { "part": "PFXET66", "title": "12.1 Inch Wide WXGA", "desc": "Kích thước 12.1 inch tỷ lệ 16:10 (1280 x 800 pixels)." },
                        { "part": "00WAD", "title": "Wide Analog DC 24V", "desc": "Nguồn một chiều 24V DC." }
                    ]
                },
                "warnings": "Giá chỉ bằng khoảng 60% so với dòng GP4601 cũ nhưng độ nét cao hơn gấp đôi.",
                "commonModels": ["PFXET6600WAD", "PFXST6600WAD"],
                "replacement": "Thay thế cho GP4601TAD cũ."
            }
        ]
    },
    {
        "id": "cat-proface-software",
        "name": "Phần Mềm & Bản Quyền Pro-face GP-Pro EX",
        "filterCat": "Phần mềm & Bản quyền",
        "icon": "🔑",
        "tier": "Bản quyền chính hãng Schneider Electric",
        "application": "Kích hoạt bản quyền phần mềm lập trình cho doanh nghiệp FDI, hồ sơ nghiệm thu dự án.",
        "description": "Key bản quyền chính hãng GP-Pro EX v4.x vĩnh viễn.",
        "series": [
            {
                "id": "gpproex-license",
                "name": "PFXEXEDLS40A (GP-Pro EX Single License Key)",
                "lookupKeyword": "PFXEXEDLS40A",
                "tier": "Bản quyền trọn đời 1 PC",
                "application": "Lập trình HMI Pro-face GP4000, ST6000, SP5000.",
                "status": "Thông dụng",
                "image": "assets/images/proface/software_license.jpg",
                "namingRule": {
                    "example": "PFXEXEDLS40A",
                    "standardDoc": "GP-Pro EX License Key Manual",
                    "breakdown": [
                        { "part": "PFXEX", "title": "GP-Pro EX", "desc": "Phần mềm HMI Pro-face." },
                        { "part": "EDLS", "title": "Single License", "desc": "Bản quyền cho 1 máy tính." },
                        { "part": "40A", "title": "Version 4.x", "desc": "Kích hoạt trọn đời bản v4.x." }
                    ]
                },
                "warnings": "Hợp Long đang bán giá ~4.12 triệu; DACO hỗ trợ kết nối mua cho khách dự án cần hồ sơ kiểm toán.",
                "commonModels": ["PFXEXEDLS40A"],
                "replacement": "Key bản quyền chính hãng."
            }
        ]
    },
    {
        "id": "cat-weintek-hmi",
        "name": "Màn Hình Đối Ứng Weintek (Phân Khúc Kinh Tế Bán Chạy Tại DACO)",
        "filterCat": "Màn hình Weintek (Đài Loan)",
        "icon": "📊",
        "tier": "Màn hình HMI Đài Loan bán chạy số 1 phân khúc chế tạo máy",
        "application": "Máy đóng gói, chiết rót, ép nhựa, máy dệt, máy uốn đai sắt, hệ thống Scada giám sát từ xa.",
        "description": "Thương hiệu HMI thông dụng và đa năng nhất thị trường, DACO stock sẵn nhiều.",
        "series": [
            {
                "id": "weintek-ip",
                "name": "MT8052iP / MT8072iP / MT8106iP (iP Series Quốc Dân)",
                "lookupKeyword": "MT8072iP",
                "tier": "Kinh tế quốc dân (4.3', 7.0', 10.1')",
                "application": "Máy chế tạo vừa và nhỏ, nâng cấp máy cơ.",
                "status": "Thông dụng",
                "image": "assets/images/weintek/mt8072ip.jpg",
                "namingRule": {
                    "example": "MT8072iP",
                    "standardDoc": "Weintek iP Series Hardware Guide",
                    "breakdown": [
                        { "part": "MT807", "title": "7.0 Inch WVGA", "desc": "Màn hình 7.0 inch 800x480." },
                        { "part": "2iP", "title": "iP Series Ver 2", "desc": "Bản nâng cấp thế hệ 2 bán chạy nhất." }
                    ]
                },
                "warnings": "Gia Lực và DACO stock sẵn nhiều hàng trăm chiếc; Giá MT8052iP ~2.9tr, MT8072iP cực kỳ cạnh tranh.",
                "commonModels": ["MT8052iP", "MT8072iP", "MT8106iP"],
                "replacement": "Dòng HMI kinh tế số 1 thị trường."
            },
            {
                "id": "weintek-cmtx",
                "name": "cMT2078X / cMT2108X2 / cMT2128X / cMT2158X (cMT X Quad-Core)",
                "lookupKeyword": "cMT2078X",
                "tier": "Cao cấp CPU 4 nhân Quad-Core (7', 10', 12', 15')",
                "application": "Hệ thống tự động hóa cao cấp, IoT công nghiệp, vẽ biểu đồ thời gian thực.",
                "status": "Thông dụng",
                "image": "assets/images/weintek/cmt2078x.jpg",
                "namingRule": {
                    "example": "cMT2078X",
                    "standardDoc": "Weintek cMT X Series Hardware Manual",
                    "breakdown": [
                        { "part": "cMT207", "title": "7.0 Inch cMT", "desc": "Màn hình 7.0 inch kiến trúc đám mây." },
                        { "part": "8X", "title": "Quad-Core CPU", "desc": "CPU 4 nhân 1.6GHz cực mượt." }
                    ]
                },
                "warnings": "DACO có giá bán cMT2078X (~4.1tr) và cMT2128X thấp hơn đối thủ 50-500k.",
                "commonModels": ["cMT2078X", "cMT2108X2", "cMT2128X", "cMT2158X"],
                "replacement": "Thế hệ HMI tốc độ cao thế hệ mới."
            },
            {
                "id": "weintek-cloudbox",
                "name": "cMT-FHDX-820 / cMT-SVR-200 / Thẻ RZACEA020 (Cloud Box & EasyAccess)",
                "lookupKeyword": "cMT-FHDX-820",
                "tier": "Bộ xuất hình Tivi HDMI & HMI không màn hình",
                "application": "Bảng Andon Tivi nhà máy, điều khiển qua iPad, lập trình từ xa qua Internet.",
                "status": "Thông dụng",
                "image": "assets/images/weintek/cmt_fhdx.jpg",
                "namingRule": {
                    "example": "cMT-FHDX-820",
                    "standardDoc": "Weintek HDMI Gateway Guide",
                    "breakdown": [
                        { "part": "cMT-FHDX", "title": "Full HD Gateway", "desc": "Xuất hình HDMI Full HD 1080p." },
                        { "part": "820", "title": "Model 820", "desc": "CPU Quad-core hỗ trợ Tivi lớn." }
                    ]
                },
                "warnings": "Thẻ EasyAccess 2.0 (RZACEA020) mở VPN vĩnh viễn lập trình PLC/HMI từ xa qua Internet.",
                "commonModels": ["cMT-FHDX-820", "cMT-SVR-200", "RZACEA020"],
                "replacement": "Giải pháp giám sát thông minh 4.0."
            }
        ]
    },
    {
        "id": "cat-beijer-hmi",
        "name": "Màn Hình Đối Ứng Beijer (Châu Âu, Vỏ Nhôm & Hàng Hải)",
        "filterCat": "Màn hình Beijer (Thụy Điển)",
        "icon": "🚢",
        "tier": "Tiêu chuẩn châu Âu, vỏ nhôm đúc, tiêu chuẩn hàng hải DNV",
        "application": "Máy móc xuất khẩu châu Âu, tàu biển hàng hải, môi trường khắc nghiệt từ -30°C đến +70°C.",
        "description": "Thương hiệu HMI Thụy Điển cao cấp, DACO còn tồn kho nhiều dòng máy cũ PWS6400.",
        "series": [
            {
                "id": "beijer-stock",
                "name": "PWS6400F-PA1 (3.3 Inch Mono - DACO CÒN TỒN KHO NHIỀU)",
                "lookupKeyword": "PWS6400F-PA1",
                "tier": "Dòng máy cũ kinh điển",
                "application": "Thay thế nóng máy cũ hỏng hóc trong các dây chuyền.",
                "status": "Ngừng sx",
                "image": "assets/images/beijer/pws6400.jpg",
                "namingRule": {
                    "example": "PWS6400F-PA1",
                    "standardDoc": "Beijer PWS Series Manual",
                    "breakdown": [
                        { "part": "PWS6400", "title": "3.3 Inch Mono", "desc": "Màn hình 3.3 inch đơn sắc FSTN." }
                    ]
                },
                "warnings": "DACO còn tồn kho nhiều; Lợi thế lớn cho kỹ thuật và kinh doanh khi khách cần gấp.",
                "commonModels": ["PWS6400F-PA1", "PWS5610S-S"],
                "replacement": "Hàng tồn kho dự phòng độc quyền."
            },
            {
                "id": "beijer-x2",
                "name": "X2 Base 7 v2 & X2 Pro 10/15 (Dòng Vỏ Nhôm & Châu Âu)",
                "lookupKeyword": "X2 base 7 v2",
                "tier": "Thế hệ mới v2 & Vỏ nhôm Pro",
                "application": "Dây chuyền máy châu Âu, nhà máy bia, nhà máy đóng tàu hàng hải.",
                "status": "Thông dụng",
                "image": "assets/images/beijer/x2_pro.jpg",
                "namingRule": {
                    "example": "X2 base 7 v2",
                    "standardDoc": "Beijer X2 Series Manual",
                    "breakdown": [
                        { "part": "X2 base 7", "title": "7.0 Inch Base", "desc": "Màn hình 7 inch kinh tế châu Âu." },
                        { "part": "v2", "title": "Version 2", "desc": "Thế hệ nâng cấp tốc độ." }
                    ]
                },
                "warnings": "AVA stock kho nhiều X2 base 7 v2 (~7.6tr) và có giá dự án tốt cho dòng X2 Pro.",
                "commonModels": ["X2 base 7 v2", "X2 pro 10", "X2 pro 15"],
                "replacement": "Chuẩn mực HMI châu Âu."
            }
        ]
    }
]

# Danh bạ nhà cung cấp chuẩn mực Pro-face & HMI (từ file Excel thực tế công ty DACO)
proface_suppliers_dir = [
    {
        "id": "hop_long_proface",
        "name": "Công ty Cổ phần Công nghệ Hợp Long (Hop Long Automation)",
        "shortName": "Hợp Long",
        "badge": "Tổng Kho Pro-face Schneider Lớn Nhất Miền Bắc - Sẵn Kho ET6000",
        "badgeType": "badge-green",
        "website": "https://hoplongtech.com",
        "phone": "1900 6536 / info@hoplongtech.com",
        "address": "Tòa nhà Hợp Long, KĐT Sài Đồng, Long Biên, Hà Nội & Chi nhánh TP.HCM, Đà Nẵng, Cần Thơ",
        "legalInfo": "Nhà phân phối ủy quyền chính thức số 1 của Schneider Electric và Pro-face tại thị trường Việt Nam.",
        "keyStrengths": "Tồn kho số lượng lớn hàng trăm chiếc các mã thế hệ mới PFXET6400WAD, PFXET6500WAD, PFXET6600WAD; Có bán key bản quyền PFXEXEDLS40A.",
        "pros": "Giá bán dòng ET6000 siêu rẻ (~3.8 triệu cho mã 7 inch); Pháp lý 100% chuẩn CO/CQ chính hãng; Giao ngay trong 1 ngày; Chính sách công nợ linh hoạt cho đối tác.",
        "cons": "Đội ngũ kỹ thuật hỗ trợ theo quy trình (cần liên hệ kỹ sư Schneider phản hồi lại); Dòng GP4000 cũ không stock nhiều bằng dòng mới.",
        "buyingGuide": "Ưu tiên số 1 khi DACO cần lấy hàng Pro-face dòng ET6000/ST6000 hoặc mua key bản quyền GP-Pro EX; Báo giá cực nhanh.",
        "matchTokens": ["hợp long", "hop long", "hoplong", "hoplongtech"]
    },
    {
        "id": "daco_proface",
        "name": "Công ty Cổ phần DACO (DACO Industrial Automation)",
        "shortName": "DACO",
        "badge": "Chuyên Sâu HMI - Lập Trình Chuyển Đổi Project & Tồn Kho Beijer/Weintek",
        "badgeType": "badge-blue",
        "website": "https://daco.vn / https://manhinhhmi.com",
        "phone": "0936 064 289 / sales@daco.vn",
        "address": "Trụ sở Hà Nội & Chi nhánh TP. Hồ Chí Minh",
        "legalInfo": "Trung tâm tự động hóa và phân phối màn hình HMI hàng đầu tại Việt Nam, sở hữu trang chuyên ngành manhinhhmi.com.",
        "keyStrengths": "Có đội ngũ kỹ thuật chuyên sâu lập trình HMI Pro-face, Weintek, Beijer; Nhập khẩu trực tiếp dòng GP4000 (PFXGP4301TAD, PFXGP4501TAD); Còn tồn kho nhiều màn hình Beijer PWS6400F-PA1.",
        "pros": "Hỗ trợ kỹ thuật 24/7; Miễn phí chuyển đổi dự án từ màn hình cũ GP2000/GP3000 sang màn hình mới; Giá bán Weintek cMT2078X và cMT2128X cạnh tranh nhất thị trường.",
        "cons": "Một số mã Pro-face dòng hiếm cần thời gian đặt hàng 3-4 tuần.",
        "buyingGuide": "Lợi thế vượt trội về kỹ thuật và chuyển đổi dự án máy cũ thay màn hình mới.",
        "matchTokens": ["daco", "daco automation"]
    },
    {
        "id": "direct_import_proface",
        "name": "Kênh Nhập Khẩu Trực Tiếp Nước Ngoài (Overseas Direct Import)",
        "shortName": "Nhập Nước Ngoài",
        "badge": "Chuyên Dòng GP4000 Tiêu Chuẩn & Thay Thế Máy Cũ",
        "badgeType": "badge-purple",
        "website": "https://www.proface.com",
        "phone": "N/A (Kênh nhập khẩu chính ngạch / Dự án)",
        "address": "Nhật Bản / Singapore / Trung Quốc",
        "legalInfo": "Kênh cung ứng thiết bị HMI chính ngạch phục vụ các nhà máy FDI theo mã chuẩn GP4000.",
        "keyStrengths": "Đầy đủ các mã GP4000 kinh điển: PFXGP4301TAD, PFXGP4401TAD, PFXGP4501TAD, PFXGP4501TAA, PFXGP4601TAD.",
        "pros": "Hàng mới 100% nguyên seal; Đúng chuẩn mã nhà máy FDI yêu cầu không cần sửa cơ khí khoét lỗ tủ.",
        "cons": "Thời gian giao hàng từ 2 đến 4 tuần tùy tình trạng tồn kho hãng.",
        "buyingGuide": "Áp dụng cho các đơn hàng nhà máy Nhật chỉ định đúng mã GP4000 không đổi sang ET6000.",
        "matchTokens": ["nhập trực tiếp", "nhập nước ngoài", "nước ngoài", "overseas"]
    },
    {
        "id": "nhan_hoa_nghia",
        "name": "Công ty TNHH Nhân Hòa Nghĩa",
        "shortName": "Nhân Hòa Nghĩa",
        "badge": "Nhà Phân Phối Chính Thức Weintek Tại TP. Hồ Chí Minh",
        "badgeType": "badge-blue",
        "website": "https://nhanhoanghia.com.vn",
        "phone": "028 3868 6688",
        "address": "Quận 10, TP. Hồ Chí Minh",
        "legalInfo": "Nhà phân phối ủy quyền chính thức các dòng màn hình HMI Weintek tại Việt Nam.",
        "keyStrengths": "Đầy đủ tất cả các mã Weintek từ dòng iP (MT8052iP, MT8072iP, MT8106iP) đến cMT X (cMT2078X, cMT2108X2, cMT2128X, cMT2158X), cMT-SVR-200, cMT-FHDX, thỉnh thoảng có sẵn cMT3072X2 và cMT3102X.",
        "pros": "Hàng sẵn đầy đủ dải sản phẩm; Phân phối chính hãng CO/CQ chuẩn; Website làm tốt luôn nằm trong top 5 tìm kiếm Google; Chính sách công nợ 15-30 ngày cho khách hàng uy tín.",
        "cons": "Giá một số mã cMT cao hơn DACO (ví dụ cMT2078X cao hơn 50k, cMT2128X cao hơn 500k); Địa điểm tại TP.HCM nên gửi ra miền Bắc mất 3-5 ngày và tính phí vận chuyển do có pin CMOS.",
        "buyingGuide": "Nguồn tham chiếu giá và stock hàng uy tín khi khu vực phía Nam cần hàng gấp hoặc khi miền Bắc hết hàng.",
        "matchTokens": ["nhân hòa nghĩa", "nhan hoa nghia", "nhanhoanghia"]
    },
    {
        "id": "gia_luc",
        "name": "Công ty TNHH Kỹ Thuật Gia Lực",
        "shortName": "Gia Lực",
        "badge": "Nhà Cung Cấp Mới Weintek - Stock Nhiều MT8072iP & cMT2158X",
        "badgeType": "badge-yellow",
        "website": "https://gialuc.com",
        "phone": "028 3968 8899",
        "address": "TP. Hồ Chí Minh",
        "legalInfo": "Đơn vị cung ứng thiết bị HMI Weintek mới nổi tại thị trường phía Nam.",
        "keyStrengths": "Stock nhiều mã quốc dân MT8072iP và màn hình lớn cMT2158X; Giá cMT2078X đang thấp hơn đối thủ khoảng 50k.",
        "pros": "Giá bán cạnh tranh cho các mã thông dụng; Đẩy mạnh marketing website và mạng xã hội.",
        "cons": "Các mã đặc thù chỉ stock vài thùng nhỏ; Không có chính sách công nợ (phải thanh toán ngay); Đơn lớn mới hỗ trợ phí vận chuyển; Ít hỗ trợ kỹ thuật chuyên sâu.",
        "buyingGuide": "Check giá và hàng khi cần so sánh giá lấy các mã thông dụng MT8072iP hoặc cMT2078X.",
        "matchTokens": ["gia lực", "gia luc", "gialuc"]
    },
    {
        "id": "ava_hmi",
        "name": "Công ty Cổ phần Tự Động Hóa AVA (AVA Automation)",
        "shortName": "AVA",
        "badge": "Nhà Phân Phối Nhập Khẩu Trực Tiếp Hãng Beijer (Thụy Điển)",
        "badgeType": "badge-purple",
        "website": "https://avagroup.vn",
        "phone": "028 3775 8899",
        "address": "Quận 7, TP. Hồ Chí Minh",
        "legalInfo": "Đơn vị phân phối nhập khẩu trực tiếp các dòng màn hình HMI và máy tính công nghiệp Beijer Electronics tại Việt Nam.",
        "keyStrengths": "Dòng màn hình Beijer X2 Base 7 v2 (stock kho nhiều, giá ~7.6tr) và các dòng vỏ nhôm cao cấp X2 Pro 10, X2 Pro 12, X2 Pro 15.",
        "pros": "Xin được giá dự án rất cạnh tranh cho các dòng màn hình vỏ nhôm X2 Pro; Nhập khẩu chính ngạch 100% từ châu Âu; Bán hàng chuyên nghiệp theo mã.",
        "cons": "Tồn kho mỗi mã số lượng ít; Chưa có chính sách công nợ cho khách mới; Ít hỗ trợ kỹ thuật chuyên sâu (chủ yếu bán thương mại); Giao hàng ra miền Bắc mất 2-3 ngày và có phí vận chuyển.",
        "buyingGuide": "Đầu mối số 1 khi có dự án yêu cầu màn hình Beijer Electronics Thụy Điển hoặc các dòng vỏ nhôm công nghiệp chuẩn hàng hải.",
        "matchTokens": ["ava", "avagroup", "ava automation"]
    }
]


# ==============================================================================
# 3. THỰC THI GHI DỮ LIỆU VÀO CÁC FILE TRONG THƯ MỤC DATA/
# ==============================================================================

print("[*] Dang ghi du lieu Brother...")
brother_data = {
    "brand": "Brother",
    "software": brother_software,
    "brochures": brother_brochures,
    "history": brother_history,
    "products": brother_products,
    "treeData": brother_tree,
    "suppliersDirectory": brother_suppliers_dir
}

with open(os.path.join(data_dir, 'brother.json'), 'w', encoding='utf-8') as f:
    json.dump(brother_data, f, ensure_ascii=False, indent=2)

with open(os.path.join(data_dir, 'brother.js'), 'w', encoding='utf-8') as f:
    f.write("window.PORTAL_DATA_BROTHER = " + json.dumps(brother_data, ensure_ascii=False, indent=2) + ";\n")

print(f"    -> Da cap nhat brother.json & brother.js ({len(brother_products)} san pham, {len(brother_tree)} nhanh cay, {len(brother_suppliers_dir)} NCC)!")

print("[*] Dang ghi du lieu Pro-face...")
proface_data = {
    "brand": "Pro-face",
    "software": proface_software,
    "brochures": proface_brochures,
    "history": proface_history,
    "products": proface_products,
    "treeData": proface_tree,
    "suppliersDirectory": proface_suppliers_dir
}

with open(os.path.join(data_dir, 'proface.json'), 'w', encoding='utf-8') as f:
    json.dump(proface_data, f, ensure_ascii=False, indent=2)

with open(os.path.join(data_dir, 'proface.js'), 'w', encoding='utf-8') as f:
    f.write("window.PORTAL_DATA_PROFACE = " + json.dumps(proface_data, ensure_ascii=False, indent=2) + ";\n")

print(f"    -> Da cap nhat proface.json & proface.js ({len(proface_products)} san pham, {len(proface_tree)} nhanh cay, {len(proface_suppliers_dir)} NCC)!")


# ==============================================================================
# 4. CẬP NHẬT BRANDS.JSON & BRANDS.JS
# ==============================================================================

print("[*] Dang cap nhat brands.json va brands.js...")
brands_json_path = os.path.join(data_dir, 'brands.json')
with open(brands_json_path, 'r', encoding='utf-8') as f:
    brands_list = json.load(f)

for b in brands_list:
    if b['id'] == 'brother':
        b['productCount'] = len(brother_products)
        b['tagline'] = "Máy In Nhãn Cầm Tay P-Touch, Máy In Ống Đầu Cốt PT-E850TKW, Máy In Mã Vạch TD/QL"
        b['icon'] = "🏷️"
        b['badge'] = "Máy In Nhãn & In Ống"
    elif b['id'] == 'proface':
        b['productCount'] = len(proface_products)
        b['tagline'] = "Màn Hình HMI Cảm Ứng GP4000, ST6000, ET6000 & Đối Ứng Beijer / Weintek"
        b['icon'] = "🖥️"
        b['badge'] = "Màn Hình Cảm Ứng HMI"

with open(brands_json_path, 'w', encoding='utf-8') as f:
    json.dump(brands_list, f, ensure_ascii=False, indent=2)

with open(os.path.join(data_dir, 'brands.js'), 'w', encoding='utf-8') as f:
    f.write("window.PORTAL_BRANDS = " + json.dumps(brands_list, ensure_ascii=False, indent=2) + ";\n")

print("    -> Da cap nhat brands.json va brands.js thanh cong!")

print("[V] Hoan tat khoi tao du lieu Brother va Pro-face!")
