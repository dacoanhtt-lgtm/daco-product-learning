# -*- coding: utf-8 -*-
import sys

app_js_path = r'assets/app.js'
with open(app_js_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update sampleMap for proface
old_sample = "'proface': ['PFXGP4301TADW', 'PFXGP4501TAD', 'PFXGP4501TAA', 'PFXGP4401TAD', 'PFXET6400WAD', 'PFXST6500WAD', 'MT8072iP', 'cMT2078X', 'X2 base 7 v2']"
new_sample = "'proface': ['PFXGP4301TAD', 'PFXGP4501TAD', 'PFXGP4501TAA', 'PFXGP4401TAD', 'PFXET6400WAD', 'PFXST6400WAD', 'PFXSTM6400WAD', 'PFXSP5500TPD']"

if old_sample in code:
    code = code.replace(old_sample, new_sample, 1)
    print('[V] Updated sampleMap for Pro-face')
else:
    print('[!] Warning: old_sample not found')

# 2. Replace Weintek & Beijer decoders with Pro-face STM6000 & SP5000 / GP4100 / PS IPC decoders
old_weintek_beijer = """  // 23. Màn Hình Đối Ứng Weintek (MT8052iP, MT8072iP, cMT2078X, cMT2128X...)
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
  }"""

new_proface_modular = """  // 23. Màn Hình Gắn Lỗ Tròn Ø22mm Pro-face STM6000 (PFXSTM6200WAD, PFXSTM6400WAD)
  if (!decoded && (upper.startsWith('PFXSTM') || upper.startsWith('STM6'))) {
    decoded = {
      model: code,
      category: 'Màn hình Module Pro-face STM6000',
      standardDoc: 'Pro-face Modular HMI STM6000 Series Hardware Manual',
      familyDesc: 'HMI dạng module độc đáo lắp đặt nhanh bằng lỗ tròn tiêu chuẩn Ø22mm không cần khoét lỗ vuông tủ điện',
      chunks: [
        { part: 'PFXSTM6', title: 'Dòng STM6000', desc: 'Modular HMI viền mỏng hiện đại, True Color 16 triệu màu, chuẩn bảo vệ IP65F.' },
        { part: upper.includes('62') ? '6200' : '6400', title: 'Kích Thước Màn Hình', desc: upper.includes('62') ? '4.0 inch Wide (480x272) TFT' : '7.0 inch Wide (800x480) TFT' },
        { part: 'Ø22mm Mount', title: 'Kiểu Lắp Đặt Đột Phá', desc: 'Bắt trực tiếp vào lỗ nút ấn Ø22mm, cố định bằng đai ốc siết tay, tiết kiệm 80% thời gian gia công tủ điện.' },
        { part: 'WAD', title: 'Nguồn & Cảm Ứng', desc: 'Màn hình Wide, cảm ứng điện trở Analog, nguồn 24V DC tiêu chuẩn.' }
      ]
    };
  }

  // 24. Smart Portal Cao Cấp Pro-face SP5000 & IPC PS5000/PS6000 (PFXSP5, PFXPS5, PFXPS6)
  if (!decoded && (upper.startsWith('PFXSP5') || upper.startsWith('PFXPS') || upper.startsWith('SP5000') || upper.startsWith('PS5000') || upper.startsWith('PS6000'))) {
    const isBox = upper.includes('5B') || upper.includes('BOX');
    const isIPC = upper.startsWith('PFXPS') || upper.includes('PS5') || upper.includes('PS6');
    decoded = {
      model: code,
      category: isIPC ? 'Máy tính công nghiệp Pro-face IPC PS5000/PS6000' : (isBox ? 'Khối Xử Lý Box Unit Pro-face SP5000' : 'Màn Hình Smart Portal Pro-face SP5000'),
      standardDoc: 'Pro-face Smart Portal SP5000 / Industrial PC Hardware Manual',
      familyDesc: isIPC ? 'Máy tính công nghiệp Panel PC & Box PC chuyên dụng vận hành 24/7 tải nặng Scada' : 'Hệ thống Smart Portal Module tách rời màn hình hiển thị (Display Module) và khối xử lý (Box Unit)',
      chunks: [
        { part: upper.slice(0, 7), title: 'Dòng Sản Phẩm', desc: isIPC ? 'Industrial PC hiệu năng cao Intel Core i3/i5/i7, fanless chống bụi' : 'Flagship Smart Portal kết nối đồng thời OT (PLC máy móc) và IT (Mạng doanh nghiệp/Cloud)' },
        { part: code, title: 'Cấu Hình Module', desc: isBox ? 'Khối Box Unit: PFXSP5B41 (Open Box Windows 10 IoT Core) hoặc PFXSP5B10 (Power Box chuyên HMI)' : 'Màn hình Premium Display hoặc Advanced Display hỗ trợ đa điểm chạm Multi-touch vuốt chạm mượt mà' },
        { part: 'Kết Nối Mạng', desc: '2 cổng Gigabit Ethernet độc lập phân tách mạng OT và mạng IT an toàn bảo mật, cổng NVRAM lưu trữ dữ liệu an toàn' }
      ]
    };
  }"""

if old_weintek_beijer in code:
    code = code.replace(old_weintek_beijer, new_proface_modular, 1)
    print('[V] Updated Weintek/Beijer to Pure Pro-face STM6000 and SP5000 decoders')
else:
    print('[!] Warning: old_weintek_beijer block not matched exactly')

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(code)
print('[V] Done patching app.js!')
