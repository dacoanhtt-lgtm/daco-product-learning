# -*- coding: utf-8 -*-
import sys

app_js_path = r'e:\sp\Mitutoyo\cam_nang_san_pham\assets\app.js'

with open(app_js_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Cập nhật sampleMap
old_sample_target = "'autonics': ['TK4S-14RN', 'PR18-8DN', 'BEN5M-MFR', 'E50S8-1000-3-T-24', 'CT6S-1P4']\n  };"
new_sample_replacement = """'autonics': ['TK4S-14RN', 'PR18-8DN', 'BEN5M-MFR', 'E50S8-1000-3-T-24', 'CT6S-1P4'],
    'brother': ['PT-E850TKW', 'PT-E560BT', 'PT-E310BT', 'PT-E110VP', 'PT-P950W', 'QL-820NWB', 'TD-4420DN', 'TZe-231', 'HSe-231'],
    'proface': ['PFXGP4301TADW', 'PFXGP4501TAD', 'PFXGP4501TAA', 'PFXGP4401TAD', 'PFXET6400WAD', 'PFXST6500WAD', 'MT8072iP', 'cMT2078X', 'X2 base 7 v2']
  };"""

if old_sample_target in code:
    code = code.replace(old_sample_target, new_sample_replacement, 1)
    print("[V] Da cap nhat sampleMap thanh cong!")
else:
    print("[!] Chu y: Khong tim thay old_sample_target, co the da cap nhat roi.")

# 2. Bổ sung các Decoder Rules cho Brother và Pro-face
decoder_insert_target = "  // Fallback nếu không khớp mẫu cụ thể\n  if (!decoded) {"

brother_proface_decoders = """  // ===== BROTHER OFFICIAL INDUSTRIAL LABEL PRINTER DECODERS =====
  // 17. Máy In Cầm Tay & Ống Lồng Brother (PT-E, PT-P, PT-D)
  if (!decoded && (upper.startsWith('PT-E') || upper.startsWith('PT-P') || upper.startsWith('PT-D') || upper.startsWith('PTE') || upper.startsWith('PTP'))) {
    const m = upper.match(/^(PT[-_]?[EPD])(\d{3})([A-Z0-9\-_]+)?/i);
    if (m) {
      const family = m[1].toUpperCase();
      const modelNum = m[2];
      const suffix = (m[3] || '').toUpperCase();
      let fDesc = 'Máy in nhãn công nghiệp P-Touch';
      if (family.includes('E')) fDesc = 'Dòng máy in nhãn chuyên dụng tủ điện & viễn thông (Electrical & Datacom)';
      else if (family.includes('P')) fDesc = 'Dòng máy in để bàn kết nối máy tính (PC-Connectable Desktop)';

      const chunks = [
        { part: family, title: 'Họ Máy In (Series)', desc: fDesc },
        { part: modelNum, title: 'Cấp Độ Model & Khổ In', desc: modelNum === '850' ? 'Flagship 36mm: Tích hợp 2 động cơ Twin-Engine vừa in ống lồng PVC (Ø2.5-6.5mm) vừa in nhãn TZe 36mm.' : modelNum === '560' ? 'Cầm tay cao cấp 24mm: Tích hợp dao cắt tự động & cắt nửa Half-Cut thông minh.' : modelNum === '310' ? 'Cầm tay tầm trung 18mm: Bàn phím QWERTY, in được ống co nhiệt HSe.' : modelNum === '110' ? 'Cầm tay phổ thông 12mm: Cắt thủ công cơ khí.' : `Dòng máy in nhãn model ${modelNum}.` }
      ];

      if (suffix) {
        let sufDesc = suffix;
        if (suffix.includes('TKW')) sufDesc = 'TK = Động cơ in ống lồng PVC (Tube) + Bàn phím cơ tháo rời (Keyboard); W = Mạng Wi-Fi không dây.';
        else if (suffix.includes('BT')) sufDesc = 'BT = Kết nối Bluetooth tốc độ cao in trực tiếp từ smartphone qua Pro Label Tool.';
        else if (suffix.includes('VP')) sufDesc = 'VP = Gói Value Pack (kèm vali cứng chống va đập, adapter sạc và cuộn nhãn mẫu).';
        else if (suffix.includes('W')) sufDesc = 'W = Mạng không dây Wi-Fi in chia sẻ đa người dùng.';
        chunks.push({ part: suffix, title: 'Tính Năng Mở Rộng', desc: sufDesc });
      }

      decoded = {
        model: code,
        category: 'Máy in nhãn Brother P-Touch',
        standardDoc: 'Brother Industrial P-Touch & Tube Printer Specification Guide',
        familyDesc: fDesc,
        chunks: chunks
      };
    }
  }

  // 18. Máy In Nhãn Giấy QL Series (QL-800, QL-810W, QL-820NWB, QL-1100, QL-1110NWB)
  if (!decoded && (upper.startsWith('QL-') || upper.startsWith('QL'))) {
    const m = upper.match(/^(QL[-_]?)(\d{3,4})([A-Z0-9\-_]+)?/i);
    if (m) {
      const family = m[1].toUpperCase();
      const modelNum = m[2];
      const suffix = (m[3] || '').toUpperCase();

      const chunks = [
        { part: family, title: 'Dòng Quick Label (QL)', desc: 'Máy in nhãn giấy in nhiệt trực tiếp tốc độ cao của Brother.' },
        { part: modelNum, title: 'Phân Khúc Model', desc: modelNum.startsWith('11') ? 'Khổ rộng 4-inch (103.6mm) chuyên dụng in vận đơn thương mại điện tử, logistics, kho bãi.' : 'Khổ chuẩn 62mm: Công nghệ độc quyền in được 2 màu ĐEN & ĐỎ không cần mực.' }
      ];

      if (suffix || modelNum.length >= 3) {
        let descSuf = 'Bản tiêu chuẩn USB.';
        if (suffix.includes('NWB')) descSuf = 'N = Mạng có dây LAN; W = Wi-Fi không dây; B = Bluetooth không dây.';
        else if (suffix.includes('W')) descSuf = 'W = Kết nối không dây Wi-Fi & AirPrint.';
        if (modelNum.endsWith('20')) descSuf += ' Tích hợp màn hình LCD và đồng hồ thời gian thực RTC in độc lập không cần máy tính.';
        chunks.push({ part: suffix || modelNum.slice(2), title: 'Kết Nối & Tính Năng', desc: descSuf });
      }

      decoded = {
        model: code,
        category: 'Máy in nhãn giấy Brother QL',
        standardDoc: 'Brother QL Series Thermal Label Printer Manual',
        familyDesc: 'Dòng máy in nhãn giấy in nhiệt trực tiếp tốc độ cao in 2 màu Đen & Đỏ',
        chunks: chunks
      };
    }
  }

  // 19. Máy In Mã Vạch Để Bàn TD Series (TD-2310D, TD-4420DN, TD-4550DNWB)
  if (!decoded && (upper.startsWith('TD-') || upper.startsWith('TD'))) {
    const m = upper.match(/^(TD[-_]?)(\d)(\d)(\d{2})([A-Z0-9\-_]+)?/i);
    if (m) {
      const family = m[1].toUpperCase();
      const widthCode = m[2];
      const speedCode = m[3];
      const resCode = m[4];
      const suffix = (m[5] || '').toUpperCase();

      decoded = {
        model: code,
        category: 'Máy in mã vạch để bàn Brother TD',
        standardDoc: 'Brother TD Series Industrial Desktop Barcode Printer Guide',
        familyDesc: 'Máy in mã vạch để bàn công nghiệp siêu bền, tương thích tập lệnh ZPL II / EPL / DPL',
        chunks: [
          { part: family, title: 'Thermal Desktop (TD)', desc: 'Dòng máy in mã vạch để bàn công nghệ in nhiệt Brother.' },
          { part: widthCode, title: 'Khổ Giấy Tối Đa', desc: widthCode === '2' ? '2 = Khổ 2-inch (63mm) chuyên dụng y tế, xét nghiệm, quầy thuốc.' : '4 = Khổ rộng 4-inch (118mm) chuẩn công nghiệp dán thùng carton, kho bãi.' },
          { part: `${speedCode}${resCode}`, title: 'Tốc Độ & Độ Phân Giải', desc: resCode === '10' ? 'Độ phân giải 203 dpi, tốc độ in cao 203mm/s (8 ips).' : 'Độ phân giải siêu nét 300 dpi cho mã vạch nhỏ 2D QR Code.' },
          { part: suffix || 'D', title: 'Cấu Hình Mạng & Tính Năng', desc: suffix.includes('DNWB') ? 'Full Option: In nhiệt trực tiếp (D), mạng LAN (N), Wi-Fi (W), Bluetooth (B), màn hình LCD.' : suffix.includes('DN') ? 'In nhiệt trực tiếp (D) + Cổng mạng LAN có dây Ethernet (N).' : 'In nhiệt trực tiếp (D) cổng USB.' }
        ]
      };
    }
  }

  // 20. Vật Tư Tiêu Hao Băng Nhãn TZe / HSe Brother
  if (!decoded && (upper.startsWith('TZE') || upper.startsWith('HSE') || upper.startsWith('TZ-'))) {
    const m = upper.match(/^(TZE|HSE)[-_]?([A-Z]*)(\d)(\d)(\d)/i);
    if (m) {
      const typePart = m[1].toUpperCase();
      const specialPart = m[2].toUpperCase();
      const bgPart = m[3];
      const widthPart = m[4];
      const inkPart = m[5];

      const widthMap = { '1': '6mm', '2': '9mm', '3': '12mm', '4': '18mm', '5': '24mm', '6': '36mm' };
      const bgMap = { '1': 'Trong suốt', '2': 'Trắng', '3': 'Xanh lam', '4': 'Đỏ', '5': 'Vàng', '6': 'Vàng/Cam' };
      const inkMap = { '1': 'Chữ Đen', '2': 'Chữ Đỏ', '3': 'Chữ Xanh', '4': 'Chữ Vàng', '5': 'Chữ Trắng' };

      decoded = {
        model: code,
        category: 'Vật tư tiêu hao chính hãng Brother',
        standardDoc: 'Brother Genuine TZe & HSe Consumables Standard Guide',
        familyDesc: typePart === 'TZE' ? 'Băng nhãn công nghệ màng phủ Laminated 6 lớp siêu bền chịu nhiệt -80°C đến +150°C' : 'Ống co nhiệt bọc dây cáp điện tiêu chuẩn chống cháy UL224',
        chunks: [
          { part: typePart, title: 'Loại Vật Tư', desc: typePart === 'TZE' ? 'TZe = Băng nhãn Laminated chống bay màu, chống hóa chất, chống nước 100%.' : 'HSe = Ống co nhiệt Heat Shrink Tube co nhiệt 2:1 hoặc 3:1.' },
          { part: specialPart || '-', title: 'Đặc Tính Keo Dán', desc: specialPart === 'S' ? 'S = Siêu dính (Strong Adhesive) tăng gấp 3 lần độ bám trên bề mặt nhám.' : specialPart === 'FX' ? 'FX = Màng dẻo (Flexible ID) chuyên quấn cờ dây điện.' : 'Keo dán tiêu chuẩn công nghiệp.' },
          { part: bgPart, title: 'Màu Nền', desc: bgMap[bgPart] || `Nền màu mã ${bgPart}` },
          { part: widthPart, title: 'Bản Rộng', desc: widthMap[widthPart] || `${widthPart}mm` },
          { part: inkPart, title: 'Màu Chữ In', desc: inkMap[inkPart] || `Chữ mã ${inkPart}` }
        ]
      };
    }
  }

  // ===== PRO-FACE OFFICIAL INDUSTRIAL HMI DECODERS =====
  // 21. Màn Hình HMI Pro-face GP4000 (PFXGP4301, PFXGP4401, PFXGP4501, PFXGP4601)
  if (!decoded && (upper.startsWith('PFXGP4') || upper.startsWith('GP4') || upper.startsWith('GP-4'))) {
    const m = upper.match(/^(?:PFX)?(GP[-_]?4)(\d)(\d{2})([TMW])([AM])([DA])(W|C)?/i);
    if (m) {
      const seriesPart = m[1].toUpperCase();
      const sizeCode = m[2];
      const modelCode = m[3];
      const displayType = m[4].toUpperCase();
      const touchType = m[5].toUpperCase();
      const powerType = m[6].toUpperCase();
      const suffix = (m[7] || '').toUpperCase();

      const sizeMap = { '1': '3.4/4.3 inch', '2': '3.5 inch', '3': '5.7 inch QVGA (320x240)', '4': '7.0 inch WVGA (800x480)', '5': '10.4 inch VGA (640x480)', '6': '12.1 inch SVGA (800x600)' };

      decoded = {
        model: code,
        category: 'Màn hình HMI Pro-face GP4000',
        standardDoc: 'Pro-face GP4000 Series Hardware Manual (Global Code)',
        familyDesc: 'Màn hình cảm ứng HMI tiêu chuẩn công nghiệp Nhật Bản từ Pro-face Schneider Electric',
        chunks: [
          { part: 'PFXGP4', title: 'Họ GP4000 Series', desc: 'Dòng HMI cảm ứng đồ họa công nghiệp tiêu chuẩn quốc tế.' },
          { part: sizeCode, title: 'Kích Thước Màn Hình', desc: sizeMap[sizeCode] || `${sizeCode} inch` },
          { part: modelCode, title: 'Cấu Hình Cổng Giao Tiếp', desc: modelCode === '01' ? 'Standard Model: Đầy đủ 1 Ethernet 10/100, COM1 (RS-232C), COM2 (RS-422/485), khe thẻ SD.' : 'Compact Model: Bản rút gọn cổng kết nối.' },
          { part: displayType, title: 'Công Nghệ Màn Hình', desc: displayType === 'T' ? 'T = Màn hình màu TFT LCD 65,536 màu sắc nét, đèn nền LED > 50,000 giờ.' : 'Màn hình hiển thị tinh thể lỏng.' },
          { part: touchType, title: 'Cảm Ứng Bề Mặt', desc: touchType === 'A' ? 'A = Cảm ứng điện trở Analog Resistive độ nhạy cao, thao tác được cả khi đeo găng tay.' : 'Matrix Touch Panel.' },
          { part: powerType, title: 'Nguồn Điện Cấp (LƯU Ý)', desc: powerType === 'D' ? 'D = Nguồn điện một chiều 24V DC (Tuyệt đối không cắm nhầm 220VAC!).' : 'A = Nguồn điện xoay chiều AC 100-240V (cắm trực tiếp điện lưới).' },
          { part: suffix || '-', title: 'Phiên Bản Đặc Biệt', desc: suffix === 'W' ? 'W = Dòng W-Series cải tiến dải điều chỉnh độ sáng 16 cấp.' : suffix === 'C' ? 'C = Phủ keo bảo vệ chống ăn mòn hóa chất (Coated).' : 'Bản tiêu chuẩn.' }
        ]
      };
    }
  }

  // 22. Màn Hình HMI Pro-face Thế Hệ Mới ET6000 & ST6000 (PFXET6400, PFXST6500...)
  if (!decoded && (upper.startsWith('PFXET') || upper.startsWith('PFXST') || upper.startsWith('ET6') || upper.startsWith('ST6'))) {
    const m = upper.match(/^(?:PFX)?([ES]T)(6[4-7])(\d{2})([WACD]+)?/i);
    if (m) {
      const familyPart = m[1].toUpperCase();
      const sizeCode = m[2];
      const modelCode = m[3];
      const suffix = (m[4] || '').toUpperCase();

      const sizeMap = { '64': '7.0 inch Wide (800x480)', '65': '10.1 inch Wide (1024x600)', '66': '12.1 inch Wide (1280x800)', '67': '15.6 inch Wide (1366x768)' };

      decoded = {
        model: code,
        category: familyPart === 'ET' ? 'Màn hình Pro-face ET6000 (Entry Web HMI)' : 'Màn hình Pro-face ST6000 (Basic HMI)',
        standardDoc: 'Pro-face Basic HMI ST6000 / ET6000 Series Hardware Manual',
        familyDesc: 'Màn hình thế hệ mới viền mỏng hiện đại, độ phân giải cao TRUE COLOR 16 TRIỆU MÀU, hỗ trợ Web HMI',
        chunks: [
          { part: familyPart, title: 'Dòng Màn Hình', desc: familyPart === 'ET' ? 'ET = Entry Web HMI: Giá siêu rẻ (~3.8 triệu), tối ưu chi phí, Hợp Long stock lớn.' : 'ST = Basic HMI cao cấp: Mặt trước viền nhôm phay xước, 2 cổng Ethernet kép.' },
          { part: sizeCode, title: 'Kích Thước Góc Rộng 16:9', desc: sizeMap[sizeCode] || `${sizeCode} Wide` },
          { part: modelCode, title: 'Cấu Hình Model', desc: 'Bản tiêu chuẩn đồ họa True Color 16 triệu màu sắc nét.' },
          { part: suffix || 'WAD', title: 'Thông Số Phần Cứng', desc: 'W = Màn hình Wide; A = Cảm ứng Analog; D = Nguồn điện một chiều 24V DC.' }
        ]
      };
    }
  }

  // 23. Màn Hình Đối Ứng Weintek (MT8052iP, MT8072iP, cMT2078X, cMT2128X...)
  if (!decoded && (upper.startsWith('MT8') || upper.startsWith('CMT'))) {
    decoded = {
      model: code,
      category: 'Màn hình Weintek HMI',
      standardDoc: 'Weintek HMI Product Specification Guide',
      familyDesc: 'Dòng màn hình cảm ứng HMI đa năng Đài Loan bán chạy số 1 tại Việt Nam',
      chunks: [
        { part: upper.slice(0, 4), title: 'Dòng Weintek', desc: upper.startsWith('CMT') ? 'cMT X Architecture: Kiến trúc đám mây Cloud HMI, CPU Quad-core 4 nhân siêu mượt.' : 'iP Series: Phân khúc kinh tế quốc dân bán chạy nhất.' },
        { part: code, title: 'Mã Model Chi Tiết', desc: 'Hỗ trợ kết nối đồng thời với hơn 400 driver PLC, nạp code qua mạng Ethernet hoặc USB.' }
      ]
    };
  }

  // 24. Màn Hình Đối Ứng Beijer (X2 base, X2 pro, PWS)
  if (!decoded && (upper.startsWith('X2') || upper.startsWith('PWS'))) {
    decoded = {
      model: code,
      category: 'Màn hình Beijer HMI (Thụy Điển)',
      standardDoc: 'Beijer Electronics X2 / PWS Series Hardware Manual',
      familyDesc: 'Màn hình HMI tiêu chuẩn châu Âu vỏ nhôm đúc, tiêu chuẩn hàng hải DNV',
      chunks: [
        { part: upper.slice(0, 6), title: 'Dòng Beijer', desc: upper.startsWith('X2 PRO') ? 'X2 Pro: Vỏ nhôm đúc nguyên khối chống va đập, tản nhiệt tự nhiên.' : upper.startsWith('X2 BASE') ? 'X2 Base: Dòng kinh tế châu Âu 7 inch (AVA stock kho nhiều).' : 'PWS Series: Màn hình cổ điển (DACO còn tồn kho nhiều PWS6400).' },
        { part: code, title: 'Chi Tiết Model', desc: 'Thiết kế theo tiêu chuẩn công nghiệp châu Âu, phần mềm iX Developer đồ họa vector.' }
      ]
    };
  }
"""

if decoder_insert_target in code:
    code = code.replace(decoder_insert_target, brother_proface_decoders + "\n" + decoder_insert_target, 1)
    print("[V] Da chen cac Decoder Rules cho Brother va Pro-face thanh cong!")
else:
    print("[!] Chu y: Khong tim thay decoder_insert_target, co the da chen roi.")

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("[V] Hoan tat cap nhat assets/app.js!")
