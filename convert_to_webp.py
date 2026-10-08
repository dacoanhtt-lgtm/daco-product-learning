# -*- coding: utf-8 -*-
import os, sys, json
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

image_root = 'assets/images'
converted_map = {} # old_path -> new_path

old_total_bytes = 0
new_total_bytes = 0

print("=== BẮT ĐẦU CHUYỂN ĐỔI ẢNH SANG ĐỊNH DẠNG WEBP TỐI ƯU ===")

for root, dirs, files in os.walk(image_root):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in ['.png', '.jpg', '.jpeg']:
            old_path = os.path.join(root, f).replace('\\', '/')
            base_name = os.path.splitext(f)[0]
            new_path = os.path.join(root, f"{base_name}.webp").replace('\\', '/')
            
            old_size = os.path.getsize(old_path)
            old_total_bytes += old_size
            
            try:
                with Image.open(old_path) as img:
                    # Convert to RGBA if palette with transparency
                    if img.mode in ('P', 'LA') and 'transparency' in img.info:
                        img = img.convert('RGBA')
                    elif img.mode == 'P':
                        img = img.convert('RGB')
                        
                    # Save as WebP
                    img.save(new_path, 'WEBP', quality=82, method=6)
                    
                new_size = os.path.getsize(new_path)
                new_total_bytes += new_size
                savings = (1 - new_size / old_size) * 100
                print(f"[{ext} -> .webp] {f}: {old_size//1024} KB -> {new_size//1024} KB (Giảm {savings:.1f}%)")
                
                converted_map[old_path] = new_path
                # Remove old uncompressed file
                os.remove(old_path)
            except Exception as e:
                print(f"Lỗi chuyển {old_path}: {e}")

print("\n=== TỔNG KẾT DUNG LƯỢNG HÌNH ẢNH ===")
print(f"Dung lượng ban đầu: {old_total_bytes / 1024:.1f} KB ({old_total_bytes / (1024*1024):.2f} MB)")
print(f"Dung lượng WebP:    {new_total_bytes / 1024:.1f} KB ({new_total_bytes / (1024*1024):.2f} MB)")
print(f"Tiết kiệm:          {(1 - new_total_bytes / old_total_bytes)*100:.1f}% băng thông tải web!\n")

# Cập nhật các tệp dữ liệu trong thư mục data/
print("=== CẬP NHẬT ĐƯỜNG DẪN ẢNH TRONG DATA ===")
for root, dirs, files in os.walk('data'):
    for f in files:
        if f.endswith('.json') or f.endswith('.js'):
            f_path = os.path.join(root, f)
            with open(f_path, 'r', encoding='utf-8') as fp:
                content = fp.read()
            
            modified = False
            for old_p, new_p in converted_map.items():
                if old_p in content:
                    content = content.replace(old_p, new_p)
                    modified = True
                    
            if modified:
                with open(f_path, 'w', encoding='utf-8') as fp:
                    fp.write(content)
                print(f"Đã cập nhật đường dẫn ảnh trong: {f}")

# Cập nhật trong index.html và assets/app.js nếu có
for extra_file in ['index.html', 'assets/app.js']:
    if os.path.exists(extra_file):
        with open(extra_file, 'r', encoding='utf-8') as fp:
            content = fp.read()
        modified = False
        for old_p, new_p in converted_map.items():
            if old_p in content:
                content = content.replace(old_p, new_p)
                modified = True
        if modified:
            with open(extra_file, 'w', encoding='utf-8') as fp:
                fp.write(content)
            print(f"Đã cập nhật đường dẫn ảnh trong: {extra_file}")

print("\nHoàn tất chuyển đổi WebP và cập nhật toàn bộ đường dẫn!")
