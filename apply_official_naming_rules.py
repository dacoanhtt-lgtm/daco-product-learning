import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# Chuẩn hóa 100% theo Catalog & User's Manual chính thức của Mitsubishi Electric
official_naming_rules = {
    "fx5u": {
        "example": "FX5U-32MT/ES",
        "standardDoc": "MELSEC iQ-F FX5U User's Manual (Hardware) - JY997D55301",
        "breakdown": [
            { "part": "FX5U-", "title": "Dòng CPU (Series)", "desc": "Khối CPU cơ bản MELSEC iQ-F thế hệ mới, tích hợp Ethernet & 2 kênh Analog vào / 1 kênh Analog ra." },
            { "part": "32", "title": "Tổng Số Điểm I/O", "desc": "Tổng 32 điểm I/O tích hợp sẵn trên khối CPU (16 ngõ vào Input / 16 ngõ ra Output)." },
            { "part": "M", "title": "Loại Khối (Unit Type)", "desc": "M = Khối CPU chính (Main Unit) tích hợp sẵn vi xử lý và bộ nguồn." },
            { "part": "T", "title": "Loại Ngõ Ra (Output Type)", "desc": "T = Transistor tốc độ cao (phát xung điều khiển vị trí); R = Relay tiếp điểm cơ khí (chịu dòng 2A)." },
            { "part": "/ES", "title": "Nguồn & Logic Ngõ Vào/Ra", "desc": "E = Nguồn AC 100-240V; S = Ngõ vào 24VDC hỗ trợ cả Sink/Source, ngõ ra Transistor Sink (NPN). (/ESS = Transistor Source PNP; /DS = Nguồn DC 24V Sink)." }
        ]
    },
    "fx3u": {
        "example": "FX3U-48MR/ES-A",
        "standardDoc": "MELSEC-F FX3U Series Hardware Manual - JY997D16501",
        "breakdown": [
            { "part": "FX3U-", "title": "Dòng CPU (Series)", "desc": "Họ vi điều khiển Compact PLC MELSEC-F thế hệ 3 kinh điển." },
            { "part": "48", "title": "Tổng Điểm I/O", "desc": "Tổng cộng 48 điểm Vào/Ra trên khối chính (24 Input / 24 Output)." },
            { "part": "M", "title": "Khối Cơ Bản (Unit Type)", "desc": "M = Main Unit (Khối CPU chính tích hợp nguồn)." },
            { "part": "R", "title": "Kiểu Ngõ Ra (Output)", "desc": "R = Ngõ ra Relay (tiếp điểm khô chịu dòng); T = Ngõ ra Transistor." },
            { "part": "/ES-A", "title": "Nguồn & Tiêu Chuẩn Quốc Tế", "desc": "E = Nguồn điện lưới AC 100-240V; S = Ngõ vào Sink/Source; -A = Bản đạt chuẩn quốc tế CE/UL." }
        ]
    },
    "q_series": {
        "example": "Q03UDVCPU",
        "standardDoc": "QCPU User's Manual (Hardware Design and Maintenance) - SH-080483ENG",
        "breakdown": [
            { "part": "Q", "title": "Họ MELSEC-Q", "desc": "Hệ thống điều khiển tự động hóa dạng thanh Rack cắm Module ghép linh hoạt." },
            { "part": "03", "title": "Dung Lượng Bộ Nhớ (Memory)", "desc": "03 = 30k bước lệnh chương trình (00J = 8k, 01 = 15k, 02 = 20k, 04 = 40k, 06 = 60k, 13 = 130k bước)." },
            { "part": "UD", "title": "Kiểu CPU (Universal QCPU)", "desc": "Universal Model QCPU đa năng tốc độ cao, hỗ trợ đa CPU (tối đa 4 CPU trên cùng 1 rack base)." },
            { "part": "V", "title": "Thế Hệ Tốc Độ Cao (High-Speed)", "desc": "V = High-speed generation (chu kỳ lệnh cơ bản chỉ 1.9ns), tích hợp sẵn cổng Ethernet 100BASE-TX & mini-USB." },
            { "part": "CPU", "title": "Module Xử Lý Trung Tâm", "desc": "Module CPU tính toán điều khiển độc lập gắn trên Base Unit." }
        ]
    },
    "fx1n_fx2n": {
        "example": "FX2N-48MT-001",
        "standardDoc": "FX2N Series Hardware Manual - JY992D66301",
        "breakdown": [
            { "part": "FX2N-", "title": "Dòng Cũ Khai Tử", "desc": "Thế hệ PLC ra đời năm 1997, chính thức ngừng sản xuất (EOL) từ 2015." },
            { "part": "48", "title": "Tổng Số Điểm I/O", "desc": "48 điểm I/O tích hợp (24 Input / 24 Output)." },
            { "part": "M", "title": "Khối CPU Chính", "desc": "Main Unit tích hợp CPU và cổng nạp RS-422 tròn Mini-DIN 8 chân." },
            { "part": "T", "title": "Ngõ Ra Transistor", "desc": "T = Transistor Sink (NPN); R = Relay cơ khí." }
        ]
    },
    "gs2000": {
        "example": "GS2107-WTBD-N",
        "standardDoc": "GOT SIMPLE Series User's Manual (Hardware) - JY997D52901",
        "breakdown": [
            { "part": "GS", "title": "Dòng Màn Hình (Series)", "desc": "GOT SIMPLE Series - Màn hình cảm ứng công nghiệp phân khúc kinh tế của Mitsubishi." },
            { "part": "21", "title": "Thế Hệ Phần Cứng", "desc": "Thế hệ 21 hiệu năng cao, tích hợp cổng Ethernet, RS-232, RS-422/485 và khe thẻ nhớ SD." },
            { "part": "07", "title": "Kích Thước Màn Hình (Display Size)", "desc": "07 = 7.0 inch (độ phân giải WVGA 800x480); 10 = 10.1 inch (độ phân giải WSVGA 1024x600)." },
            { "part": "-W", "title": "Tỉ Lệ Khung Hình (Aspect Ratio)", "desc": "W = Widescreen (màn hình góc rộng tỉ lệ 16:9)." },
            { "part": "T", "title": "Công Nghệ Màn Hình", "desc": "T = TFT color LCD (hiển thị 65,536 màu sắc nét, đèn nền LED tuổi thọ 50,000 giờ)." },
            { "part": "B", "title": "Màu Viền Mặt Trước (Bezel Color)", "desc": "B = Màu đen (Black); W = Màu trắng (White)." },
            { "part": "D", "title": "Nguồn Điện Cấp (Power Supply)", "desc": "D = Nguồn điện một chiều 24V DC (A = Nguồn điện xoay chiều 100-240V AC)." },
            { "part": "-N", "title": "Bản Cải Tiến (New Release)", "desc": "Phiên bản phần cứng nâng cấp mới nhất, thay thế cho mã không có đuôi -N cũ." }
        ]
    },
    "gt25": {
        "example": "GT2508-VTBA",
        "standardDoc": "GOT2000 Series User's Manual (Hardware) - SH-081194ENG",
        "breakdown": [
            { "part": "GT", "title": "Dòng GOT (Graphic Terminal)", "desc": "Graphic Operation Terminal - Màn hình giao diện vận hành đồ họa Mitsubishi." },
            { "part": "25", "title": "Phân Khúc Model (Model Group)", "desc": "GT25 = Dòng tiêu chuẩn hiệu năng cao Standard Model (kế thừa dòng GT23 đã ngừng SX; GT27 = Cao cấp nhất; GT21 = Nhỏ gọn)." },
            { "part": "08", "title": "Kích Thước Màn Hình", "desc": "05 = 5.7 inch; 08 = 8.4 inch; 10 = 10.4 inch; 12 = 12.1 inch." },
            { "part": "V", "title": "Độ Phân Giải (Resolution)", "desc": "V = VGA (640x480 pixels); S = SVGA (800x600 pixels); X = XGA (1024x768 pixels)." },
            { "part": "T", "title": "Màn Hình Hiển Thị", "desc": "T = Màn hình màu TFT LCD 65k màu." },
            { "part": "B", "title": "Màu Khung Mặt Trước", "desc": "B = Khung màu đen công nghiệp (Black); W = Khung màu trắng phòng sạch (White)." },
            { "part": "A", "title": "Nguồn Cấp (Power Supply)", "desc": "A = Nguồn xoay chiều AC 100-240V (D = Nguồn một chiều DC 24V)." }
        ]
    },
    "gt27": {
        "example": "GT2710-STBD",
        "standardDoc": "GOT2000 Series User's Manual (Hardware) - SH-081194ENG",
        "breakdown": [
            { "part": "GT", "title": "Họ Graphic Terminal", "desc": "Màn hình giao diện điều khiển HMI cao cấp nhất của Mitsubishi Electric." },
            { "part": "27", "title": "Phân Khúc Flagship Cao Cấp", "desc": "GT27 = Dòng cao cấp nhất hỗ trợ thao tác cảm ứng đa điểm (Multi-touch / Gesture), tích hợp cổng ngõ ra HDMI/Video." },
            { "part": "10", "title": "Kích Thước Màn Hình", "desc": "08 = 8.4 inch; 10 = 10.4 inch; 12 = 12.1 inch; 15 = 15.0 inch." },
            { "part": "S", "title": "Độ Phân Giải Màn Hình", "desc": "S = SVGA (800x600 pixels); X = XGA (1024x768 pixels); V = VGA (640x480 pixels)." },
            { "part": "T", "title": "Hiển Thị Màu TFT", "desc": "TFT LCD màu 65,536 màu với bộ lọc chống chói bề mặt." },
            { "part": "BD", "title": "Khung & Nguồn Cấp", "desc": "B = Màu viền đen (Black); D = Nguồn cấp DC 24V (BA = Nguồn AC 100-240V)." }
        ]
    },
    "fr_e800": {
        "example": "FR-E820-0.75K-1",
        "standardDoc": "FREQROL-E800 Instruction Manual (Detailed) - IB-0600868ENG",
        "breakdown": [
            { "part": "FR-E8", "title": "Dòng Biến Tần (Series)", "desc": "FREQROL-E800 thế hệ mới - Dòng biến tần đa năng nhỏ gọn thông minh thay thế cho FR-E700." },
            { "part": "2", "title": "Cấp Điện Áp (Voltage Class)", "desc": "2 = Cấp điện áp 200V (3P 200-240V); 4 = Cấp điện áp 400V (3P 380-480V); 1 = Cấp 100V." },
            { "part": "0", "title": "Pha Nguồn Vào (Input Phase)", "desc": "0 = Nguồn vào 3 pha (Three-phase); S = Nguồn vào 1 pha 200V (Single-phase 200V); W = 1 pha 100V." },
            { "part": "-0.75K", "title": "Công Suất Định Mức (Capacity)", "desc": "0.75 kW (tương đương 1 HP; chuẩn quốc tế ký hiệu bằng 10 lần dòng định mức: 0030 = 3.0A ND)." },
            { "part": "-1", "title": "Giao Tiếp & Tiêu Chuẩn", "desc": "-1 = Bản tiêu chuẩn trang bị cổng RS-485 Modbus RTU (Terminal FM); -E = Bản tích hợp 2 cổng Ethernet kép (CC-Link IE TSN / Modbus TCP / EtherNet/IP); -SCE = Bản an toàn Safety." }
        ]
    },
    "fr_d700": {
        "example": "FR-D740-2.2K-CHT",
        "standardDoc": "FREQROL-D700 Instruction Manual (Detailed) - IB-0600403ENG",
        "breakdown": [
            { "part": "FR-D7", "title": "Dòng Biến Tần (Series)", "desc": "FREQROL-D700 - Dòng biến tần tải nhẹ cỡ nhỏ kinh tế bán chạy số 1 của Mitsubishi." },
            { "part": "4", "title": "Cấp Điện Áp (Voltage)", "desc": "4 = 3 Pha 380V - 480V AC; 2 = 3 Pha 200V - 240V AC; 1 = 1 Pha 100V." },
            { "part": "0", "title": "Số Pha Nguồn Vào", "desc": "0 = Nguồn vào 3 pha; S = Nguồn vào 1 pha 200-240V (FR-D720S)." },
            { "part": "-2.2K", "title": "Công Suất Motor (kW)", "desc": "Công suất định mức động cơ 2.2 kW (3 HP)." },
            { "part": "-CHT", "title": "Thị Trường & Phiên Bản", "desc": "-CHT = Phiên bản sản xuất cho thị trường Châu Á/Trung Quốc; -EC = Phiên bản Châu Âu; -NA = Bắc Mỹ; -60 = Bản có phủ keo chống ẩm bo mạch." }
        ]
    },
    "fr_a800": {
        "example": "FR-A840-3.7K",
        "standardDoc": "FREQROL-A800 Instruction Manual (Detailed) - IB-0600503ENG",
        "breakdown": [
            { "part": "FR-A8", "title": "Dòng Flagship Tải Nặng", "desc": "FREQROL-A800 - Dòng biến tần điều khiển Vector tải nặng cao cấp nhất của Mitsubishi Electric." },
            { "part": "4", "title": "Cấp Điện Áp Nguồn", "desc": "4 = 3 Pha 380V - 500V AC (50/60Hz); 2 = 3 Pha 200V - 240V AC." },
            { "part": "0", "title": "Số Pha Nguồn Vào", "desc": "0 = Nguồn cấp 3 pha công nghiệp." },
            { "part": "-3.7K", "title": "Công Suất Động Cơ (kW)", "desc": "3.7 kW (tải nặng ND), hỗ trợ 4 cấp tải (SLD/LD/ND/HND), khả năng chịu quá tải lên tới 250% trong 3 giây." }
        ]
    },
    "mr_j4": {
        "example": "MR-J4-40B",
        "standardDoc": "MELSERVO-J4 Servo Amplifier Instruction Manual - SH-030106ENG",
        "breakdown": [
            { "part": "MR-J4-", "title": "Dòng Servo Driver (Series)", "desc": "Hệ thống truyền động xoay chiều AC Servo MELSERVO-J4 thế hệ 4 chủ lực đa năng." },
            { "part": "40", "title": "Công Suất Định Mức Driver", "desc": "40 = 400 Watt (0.4 kW) (10 = 100W, 20 = 200W, 60 = 600W, 70 = 750W, 100 = 1.0 kW, 200 = 2.0 kW, 350 = 3.5 kW, 500 = 5.0 kW, 700 = 7.0 kW)." },
            { "part": "B", "title": "Phương Thức Giao Tiếp Điều Khiển", "desc": "B = Điều khiển mạng cáp quang tốc độ cao SSCNET III/H (0.222ms); A = Điều khiển Xung / Điện áp Analog (Pulse train / Analog); GF = Mạng CC-Link IE Field; TM = Đa mạng mở (EtherCAT/Profinet)." }
        ]
    },
    "hg_kr": {
        "example": "HG-KR43B",
        "standardDoc": "HG-KR/HG-SR Rotary Servo Motor Instruction Manual - SH-030113ENG",
        "breakdown": [
            { "part": "HG-KR", "title": "Dòng Động Cơ Servo (Series)", "desc": "HG-KR = Dòng động cơ quán tính thấp (Low Inertia), gia tốc cực nhanh (HG-SR = Quán tính trung bình Medium Inertia)." },
            { "part": "4", "title": "Công Suất Định Mức Motor", "desc": "4 = 400 Watt (05 = 50W, 1 = 100W, 2 = 200W, 4 = 400W, 7 = 750W)." },
            { "part": "3", "title": "Tốc Độ Định Mức (Rated Speed)", "desc": "3 = Tốc độ quay định mức 3000 vòng/phút (r/min) (tốc độ tối đa lên đến 6000 r/min)." },
            { "part": "B", "title": "Tùy Chọn Phanh Giữ (Brake)", "desc": "B = Tích hợp phanh điện từ hãm giữ trục khi mất nguồn; Trống (không có B) = Trục trơn tiêu chuẩn không có phanh." }
        ]
    },
    "mccb_nf": {
        "example": "NF125-CV 3P 100A",
        "standardDoc": "Mitsubishi Low Voltage Circuit Breakers Catalog - Y-0694",
        "breakdown": [
            { "part": "NF", "title": "Dòng Aptomat Khối (No-Fuse Breaker)", "desc": "NF = No-Fuse Breaker (Aptomat khối MCCB chống quá tải & ngắn mạch; NV = ELCB chống dòng rò; BH-D = MCB tép)." },
            { "part": "125", "title": "Khung Dòng Điện Định Mức (AF - Ampere Frame)", "desc": "125 AF = Kích thước khung dòng tối đa 125A (các cỡ khung chuẩn: 30AF, 63AF, 125AF, 250AF, 400AF, 630AF, 800AF)." },
            { "part": "-CV", "title": "Phân Khúc Hiệu Năng (Class Type)", "desc": "-CV = Dòng kinh tế tiêu chuẩn (Economy Class, dòng cắt Icu 30kA); -SV = Dòng tiêu chuẩn công nghiệp (Standard); -HV = Dòng cắt ngắn mạch cao (High-fault)." },
            { "part": "3P", "title": "Số Cực Pha (Poles)", "desc": "3P = 3 Cực bảo vệ lưới điện 3 pha (2P = 2 Cực 1 pha; 4P = 4 Cực 3 pha 4 dây có trung tính)." },
            { "part": "100A", "title": "Dòng Cắt Định Mức (In / AT - Ampere Trip)", "desc": "Dòng định mức bảo vệ tác động nhiệt-từ: 100A (dải dòng chế tạo: 16A, 20A, 32A, 40A, 50A, 63A, 80A, 100A, 125A)." }
        ]
    },
    "contactor_st": {
        "example": "S-T21 AC220V",
        "standardDoc": "Mitsubishi Magnetic Motor Starters MS-T Series Catalog - L-02035",
        "breakdown": [
            { "part": "S-T", "title": "Dòng Khởi Động Từ (Magnetic Contactor)", "desc": "S-T = Dòng khởi động từ nhỏ gọn thế hệ mới (thay thế dòng S-N cũ); M-T = Cụm khởi động từ có gắn sẵn rơ le nhiệt TH-T." },
            { "part": "21", "title": "Cỡ Khung Định Mức (Frame Size)", "desc": "21 = Cỡ khung dòng làm việc định mức 22A (tải AC-3 động cơ 11kW ở 380V) (các cỡ: 10, 11, 12, 20, 21, 25, 35, 50, 65, 80, 100)." },
            { "part": "AC220V", "title": "Điện Áp Định Mức Cuộn Hút (Coil Voltage)", "desc": "AC220V 50/60Hz = Cuộn hút kích hoạt bằng điện áp AC 200-240V (các cấp điện áp khác: AC110V, AC380V, DC24V)." }
        ]
    }
}

# 1. Update data/mitsubishi.json
json_path = 'e:/sp/Mitutoyo/cam_nang_san_pham/data/mitsubishi.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'treeData' in data:
    for cat in data['treeData']:
        for s in cat.get('series', []):
            sid = s.get('id')
            if sid in official_naming_rules:
                s['namingRule'] = official_naming_rules[sid]

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated data/mitsubishi.json with 100% official naming rules!")

# 2. Update data/mitsubishi.js
js_path = 'e:/sp/Mitutoyo/cam_nang_san_pham/data/mitsubishi.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace treeData in js_content with updated data['treeData']
tree_json_str = json.dumps(data['treeData'], ensure_ascii=False, indent=2)
# Find and replace "treeData": [ ... ]
import re
js_content = re.sub(r'"treeData":\s*\[[\s\S]*?\n  \],', f'"treeData": {tree_json_str},', js_content, count=1)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated data/mitsubishi.js with 100% official naming rules!")
