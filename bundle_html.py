import os, re, sys

sys.stdout.reconfigure(encoding='utf-8')

base_dir = r'e:\sp\Mitutoyo\cam_nang_san_pham'
index_path = os.path.join(base_dir, 'index.html')
output_path = os.path.join(base_dir, 'DACO_PORTAL_STANDALONE.html')

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Inline CSS
css_path = os.path.join(base_dir, 'assets', 'style.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

html = re.sub(
    r'<link\s+rel=["\']stylesheet["\']\s+href=["\']assets/style\.css["\']\s*\/?>',
    f'<style>\n{css_content}\n</style>',
    html,
    flags=re.IGNORECASE
)

# 2. Scripts to inline in order
scripts_to_inline = [
    os.path.join(base_dir, 'data', 'brands.js'),
    os.path.join(base_dir, 'data', 'mitsubishi.js'),
    os.path.join(base_dir, 'data', 'mitutoyo.js'),
    os.path.join(base_dir, 'data', 'qlight.js'),
    os.path.join(base_dir, 'data', 'omron.js'),
    os.path.join(base_dir, 'data', 'autonics.js'),
    os.path.join(base_dir, 'data', 'patlite.js'),
    os.path.join(base_dir, 'data', 'brother.js'),
    os.path.join(base_dir, 'data', 'zebra.js'),
    os.path.join(base_dir, 'data', 'proface.js'),
    os.path.join(base_dir, 'data', 'xenang.js'),
    os.path.join(base_dir, 'data', 'quotation_scenarios.js'),
    os.path.join(base_dir, 'assets', 'app.js')
]

# Read all script contents
inlined_scripts = []
for s_path in scripts_to_inline:
    if os.path.exists(s_path):
        with open(s_path, 'r', encoding='utf-8') as sf:
            inlined_scripts.append(f"// --- INLINED: {os.path.basename(s_path)} ---\n" + sf.read())
    else:
        print(f"Warning: Script {s_path} not found!")

combined_js = "\n\n".join(inlined_scripts)

# Replace the block of script tags at the bottom
script_pattern = r'<!-- Data Bundles.*?\n(\s*<script src=".*?<\/script>\s*\n?)+'
replacement_text = f'<!-- Single-File Bundled Scripts (All 10 Brands + CSS + Logic Inlined) -->\n<script>\n{combined_js}\n</script>\n'
html = re.sub(
    script_pattern,
    lambda m: replacement_text,
    html,
    flags=re.DOTALL
)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"Successfully generated standalone bundle: {output_path}")
print(f"File size: {file_size_mb:.2f} MB")
