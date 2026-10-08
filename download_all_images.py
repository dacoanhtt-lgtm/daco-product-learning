# -*- coding: utf-8 -*-
import os
import urllib.request
import ssl

ssl_context = ssl._create_unverified_context()

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

base_dir = r'e:\sp\Mitutoyo\cam_nang_san_pham\assets\images'
brother_dir = os.path.join(base_dir, 'brother')
proface_dir = os.path.join(base_dir, 'proface')

os.makedirs(brother_dir, exist_ok=True)
os.makedirs(proface_dir, exist_ok=True)

brother_images = {
    'pt_p900w.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/pt-p900w/pt_p900w.webp',
    'ql_1110nwb.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/ql-1100/pdp---ql-1100.png',
    'td_2310d.png': 'https://www.brother.com.vn/-/media/ap2/vietnam/products/td-2310d/td-2310d.jpg',
    'tze_tape.png': 'https://www.brother.com.vn/-/media/ap2/global/products/tze/resize-20241008/tze-231_pack_co.webp',
    'hse_tube.png': 'https://sieuthivienthong.com/images/products/2021/04/17/large/ong-co-nhiet-brother-hse-231.jpg'
}

proface_images = {
    'gp4301.png': 'https://ple.vn/plchmi/images/virtuemart/product/200727-proface-pfxgp4301tad.jpg',
    'gp4401.png': 'https://ple.vn/plchmi/images/virtuemart/product/200732-proface-pfxgp4401tad.jpg',
    'gp4501.png': 'https://ple.vn/plchmi/images/virtuemart/product/200736-proface-pfxgp4501tad.jpg',
    'gp4601.png': 'https://ple.vn/plchmi/images/virtuemart/product/200746-proface-pfxgp4601tad.jpg',
    'st6400.png': 'https://ple.vn/plchmi/images/virtuemart/product/200777-proface-pfxst6400wad.jpg',
    'st6500.png': 'https://mm.digikey.com/Volume0/opasdata/d220001/derivates/1/003/184/158/MFG_PFXST6500WADE_sml(200x200).jpg',
    'et6400.png': 'https://sacnamson.com/product/watermark/product/550x550x1/upload/product/pfxet6400wad-1468.webp',
    'sp5000.png': 'https://ple.vn/plchmi/images/virtuemart/product/200766-proface-pfxsp5500tpd.jpg',
    'gp4100.png': 'https://ple.vn/plchmi/images/virtuemart/product/200718-pfxgp4114t2d.jpg',
    'stm6000.png': 'https://ple.vn/plchmi/images/virtuemart/product/200782-pfxstm6400wad.jpg',
    'gp4000h.png': 'https://ple.vn/plchmi/images/virtuemart/product/200754-proface-pfxgp4311htad.jpg',
    'ps5000.png': 'https://ple.vn/plchmi/images/virtuemart/product/200810-proface-ps5000.jpg',
    'software_license.png': 'https://ple.vn/plchmi/images/virtuemart/product/200850-proface-gpproex.jpg'
}

def download_dict(d, out_dir):
    for fname, url in d.items():
        dest = os.path.join(out_dir, fname)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12, context=ssl_context) as resp:
                data = resp.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                print(f"  [V] Downloaded {fname}: {len(data)} bytes")
        except Exception as e:
            print(f"  [X] Failed {fname} ({url}): {e}")

print("[*] Downloading Brother missing images...")
download_dict(brother_images, brother_dir)

print("\n[*] Downloading Pro-face images...")
download_dict(proface_images, proface_dir)
