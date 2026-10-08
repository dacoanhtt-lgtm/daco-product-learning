# -*- coding: utf-8 -*-
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. BROTHER MAPPING
brother_img_map = {
    1: 'assets/images/brother/pt_e110.png',
    2: 'assets/images/brother/pt_e310bt.png',
    3: 'assets/images/brother/pt_e560bt.png',
    4: 'assets/images/brother/pt_e850tkw.png',
    5: 'assets/images/brother/pt_p900w.png',
    6: 'assets/images/brother/pt_p900w.png',
    7: 'assets/images/brother/ql_820nwb.png',
    8: 'assets/images/brother/ql_820nwb.png',
    9: 'assets/images/brother/ql_820nwb.png',
    10: 'assets/images/brother/ql_1110nwb.png',
    11: 'assets/images/brother/ql_1110nwb.png',
    12: 'assets/images/brother/td_2310d.png',
    13: 'assets/images/brother/td_2310d.png',
    14: 'assets/images/brother/td_4420dn.png',
    15: 'assets/images/brother/td_4420dn.png',
    16: 'assets/images/brother/td_4420dn.png',
    17: 'assets/images/brother/tze_tape.png',
}

# 2. PRO-FACE MAPPING
proface_img_map = {
    1: 'assets/images/proface/gp4301.png',
    2: 'assets/images/proface/gp4301.png',
    3: 'assets/images/proface/gp4301.png',
    4: 'assets/images/proface/gp4401.png',
    5: 'assets/images/proface/gp4401.png',
    6: 'assets/images/proface/gp4501.png',
    7: 'assets/images/proface/gp4501.png',
    8: 'assets/images/proface/gp4601.png',
    9: 'assets/images/proface/gp4601.png',
    10: 'assets/images/proface/gp4601.png',
    11: 'assets/images/proface/gp4501.png',
    12: 'assets/images/proface/gp4301.png',
    13: 'assets/images/proface/gp4100.png',
    14: 'assets/images/proface/st6400.png',
    15: 'assets/images/proface/st6500.png',
    16: 'assets/images/proface/st6500.png',
    17: 'assets/images/proface/st6500.png',
    18: 'assets/images/proface/stm6000.png',
    19: 'assets/images/proface/et6400.png',
    20: 'assets/images/proface/et6400.png',
    21: 'assets/images/proface/et6400.png',
    22: 'assets/images/proface/sp5000.png',
    23: 'assets/images/proface/sp5000.png',
    24: 'assets/images/proface/sp5000.png',
    25: 'assets/images/proface/ps5000.png',
    26: 'assets/images/proface/gp4501.png',
    27: 'assets/images/proface/gp4301.png',
}

# 3. MITSUBISHI MAPPING
mitsubishi_img_map = {
    1: 'assets/images/mitsubishi/plc_fx3u.jpg',
    2: 'assets/images/mitsubishi/plc_fx3u.jpg',
    3: 'assets/images/mitsubishi/plc_fx3u.jpg',
    4: 'assets/images/mitsubishi/plc_fx5u.jpg',
    5: 'assets/images/mitsubishi/plc_q_series.jpg',
    6: 'assets/images/mitsubishi/plc_q_series.jpg',
    7: 'assets/images/mitsubishi/plc_q_series.jpg',
    8: 'assets/images/mitsubishi/comm_module.jpg',
    9: 'assets/images/mitsubishi/comm_module.jpg',
    10: 'assets/images/mitsubishi/plc_fx3u.jpg',
    11: 'assets/images/mitsubishi/plc_q_series.jpg',
    12: 'assets/images/mitsubishi/inv_fr_d700.jpg',
    13: 'assets/images/mitsubishi/inv_fr_e800.jpg',
    14: 'assets/images/mitsubishi/inv_fr_a800.jpg',
    15: 'assets/images/mitsubishi/inv_fr_a800.jpg',
    16: 'assets/images/mitsubishi/hmi_gs2000.jpg',
    17: 'assets/images/mitsubishi/hmi_gs2000.jpg',
    18: 'assets/images/mitsubishi/hmi_gt25.jpg',
    19: 'assets/images/mitsubishi/hmi_gt25.jpg',
    20: 'assets/images/mitsubishi/servo_mr_j4.jpg',
    21: 'assets/images/mitsubishi/servo_mr_j4.jpg',
    22: 'assets/images/mitsubishi/servo_mr_j4.jpg',
    23: 'assets/images/mitsubishi/servo_motor_hg.jpg',
    24: 'assets/images/mitsubishi/servo_motor_hg.jpg',
    25: 'assets/images/mitsubishi/mccb_nf.jpg',
}

# 4. QLIGHT MAPPING
qlight_img_map = {
    201: 'assets/images/qlight/st45l.png',
    202: 'assets/images/qlight/st56el.png',
    203: 'assets/images/qlight/st56el.png',
    204: 'assets/images/qlight/est56l.png',
    205: 'assets/images/qlight/qtg50l.png',
    206: 'assets/images/qlight/st45l.png',
    207: 'assets/images/qlight/qtc60l_iol.png',
    208: 'assets/images/qlight/swte.png',
    209: 'assets/images/qlight/s100d.png',
    210: 'assets/images/qlight/s100d.png',
    211: 'assets/images/qlight/s100d.png',
    212: 'assets/images/qlight/srn_sen.png',
    213: 'assets/images/qlight/sehn.png',
    214: 'assets/images/qlight/qwcd.png',
    215: 'assets/images/qlight/sea.png',
    216: 'assets/images/qlight/qmcl_qcml.png',
    217: 'assets/images/qlight/qel.png',
    218: 'assets/images/qlight/qel.png',
    219: 'assets/images/qlight/snes_shd.png',
    220: 'assets/images/qlight/sea.png',
    221: 'assets/images/qlight/st45l.png',
    222: 'assets/images/qlight/saol.png',
}

brand_configs = [
    ('brother', 'window.PORTAL_DATA_BROTHER', brother_img_map),
    ('proface', 'window.PORTAL_DATA_PROFACE', proface_img_map),
    ('mitsubishi', 'window.PORTAL_DATA_MITSUBISHI', mitsubishi_img_map),
    ('qlight', 'window.PORTAL_DATA_QLIGHT', qlight_img_map),
]

for b_id, var_name, img_map in brand_configs:
    json_path = f'data/{b_id}.json'
    js_path = f'data/{b_id}.js'
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    for p in data.get('products', []):
        pid = p.get('id')
        if pid in img_map:
            p['image'] = img_map[pid]
            updated_count += 1
        else:
            print(f'Warning: {b_id} product id {pid} ({p.get("serial")}) not in map!')
    
    # Save JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Save JS
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(f"{var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n")
    
    print(f'[V] {b_id.capitalize()}: Updated image for {updated_count}/{len(data.get("products", []))} products!')

print('\nAll 4 brands successfully updated with image field!')
