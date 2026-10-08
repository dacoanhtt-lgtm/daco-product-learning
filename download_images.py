# -*- coding: utf-8 -*-
"""
Script tìm kiếm và tải hình ảnh chính hãng chuẩn cho Brother và Pro-face
Lưu trực tiếp vào:
assets/images/brother/
assets/images/proface/
"""

import os
import urllib.request
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

base_dir = r'e:\sp\Mitutoyo\cam_nang_san_pham\assets\images'
brother_img_dir = os.path.join(base_dir, 'brother')
proface_img_dir = os.path.join(base_dir, 'proface')

os.makedirs(brother_img_dir, exist_ok=True)
os.makedirs(proface_img_dir, exist_ok=True)

# 1. BROTHER IMAGES
brother_urls = {
    'pt_e110.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/pt-e110/pt_e110.png',
    'pt_e310bt.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/pt-e310btvp/pdp---pt-e310bt.png',
    'pt_e560bt.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/pt-e560btvp/pdp---pt-e560bt.png',
    'pt_e850tkw.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/pt-e850tkw/pt_e850tkw_v2.webp',
    'pt_p900w.png': 'https://www.brother.com.vn/-/media/ap2/products/labeller/pt-p900w/pt-p900w-front.png',
    'ql_820nwb.png': 'https://www.brother.com.vn/-/media/9d4ea819e2bf4a71a88f4e2bf9503632.png',
    'ql_1110nwb.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/ql-1110nwb/ql-1110nwb-front.png',
    'td_2310d.png': 'https://www.brother.com.vn/-/media/ap2/products/labeller/td-2310d/td-2310d-front.png',
    'td_4420dn.png': 'https://www.brother.com.vn/-/media/ap2/products/labeller/td-4410d_4420dn_4520dn/td4410d_4420dn_4520dn_r.webp',
    'tze_tape.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/supplies/tape/tze/tze-231.png',
    'hse_tube.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/supplies/tape/hse/hse-231.png'
}

print("[*] Dang tai anh Brother tu brother.com.vn...")
for fname, url in brother_urls.items():
    dest = os.path.join(brother_img_dir, fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            print(f"  [V] Brother: {fname} ({len(data)} bytes)")
    except Exception as e:
        print(f"  [X] Loi {fname} ({url}): {e}")

# 2. PRO-FACE IMAGES
proface_pages = [
    ('gp4000', 'https://www.proface.com/en/product/hmi/gp4000'),
    ('st6000', 'https://www.proface.com/en/product/hmi/st6000'),
    ('sp5000', 'https://www.proface.com/en/product/hmi/sp5000'),
    ('gp4100', 'https://www.proface.com/en/product/hmi/gp4100'),
    ('stm6000', 'https://www.proface.com/en/product/hmi/stm6000'),
    ('et6000', 'https://www.proface.com/en/product/hmi/et6000')
]

print("\n[*] Dang quet va tai anh Pro-face tu proface.com...")
for key, page_url in proface_pages:
    try:
        req = urllib.request.Request(page_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # tim anh san pham
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+\.(?:png|jpg|webp))["\']', html)
            product_imgs = [img for img in imgs if any(k in img.lower() for k in ['product', 'hmi', 'gp', 'st', 'sp', 'et']) and not any(k in img.lower() for k in ['logo', 'icon', 'banner', 'footer'])]
            print(f"Page {key} tim thay {len(product_imgs)} anh ung cu vien:")
            for pimg in product_imgs[:5]:
                print("  ", pimg)
            if product_imgs:
                target_url = product_imgs[0]
                if target_url.startswith('/'):
                    target_url = 'https://www.proface.com' + target_url
                elif not target_url.startswith('http'):
                    target_url = 'https://www.proface.com/en/product/hmi/' + target_url
                dest = os.path.join(proface_img_dir, f"{key}.png")
                try:
                    req_img = urllib.request.Request(target_url, headers=headers)
                    with urllib.request.urlopen(req_img, timeout=15) as img_resp:
                        data = img_resp.read()
                        with open(dest, 'wb') as out_f:
                            out_f.write(data)
                        print(f"  -> Da luu: {dest} ({len(data)} bytes)")
                except Exception as ie:
                    print(f"  -> Loi tai anh {target_url}: {ie}")
    except Exception as e:
        print(f"Loi doc trang {page_url}: {e}")
