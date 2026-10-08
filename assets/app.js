// Application Logic for Multi-Brand Knowledge Portal
let BRANDS = [];
let CURRENT_BRAND = 'mitsubishi';
let BRAND_DATA = {};
let ALL_PRODUCTS_CACHE = []; // For Universal Cross-Brand Search

// DOM Elements
const brandNavContainer = document.getElementById('brandNavContainer');
const subTabBar = document.getElementById('subTabBar');
const globalSearchInput = document.getElementById('globalSearchInput');
const searchDropdown = document.getElementById('searchDropdown');
const searchClearBtn = document.getElementById('searchClearBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const detailModal = document.getElementById('detailModal');
const modalContent = document.getElementById('modalContent');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const toastMessage = document.getElementById('toastMessage');

// Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  await loadBrands();
  await loadAllProductsForSearch();
  await switchBrand(CURRENT_BRAND);
  initEventListeners();
});

// Load Brand List
async function loadBrands() {
  if (window.PORTAL_BRANDS) {
    BRANDS = window.PORTAL_BRANDS;
    renderBrandNav();
    return;
  }
  try {
    const res = await fetch('data/brands.json');
    BRANDS = await res.json();
    renderBrandNav();
  } catch (err) {
    console.error('Error loading brands:', err);
  }
}

let CURRENT_VIEW = 'brand'; // 'brand', 'quotation', or 'admin'

function isBrandViewActive() {
  return CURRENT_VIEW === 'brand';
}

// Toggle Brand Accordion in Sidebar
function toggleBrandAccordion() {
  const accordion = document.getElementById('sidebarBrandAccordion');
  if (!accordion) return;
  const isCollapsed = accordion.classList.toggle('collapsed');
  localStorage.setItem('portal_brand_accordion_collapsed', isCollapsed ? 'true' : 'false');
}

// Render Brand Navigation in Sidebar
function renderBrandNav() {
  const brandListEl = document.getElementById('sidebarBrandList');
  const brandCountEl = document.getElementById('sidebarBrandCount');
  if (brandCountEl) brandCountEl.innerText = BRANDS.length;
  if (!brandListEl) return;

  brandListEl.innerHTML = BRANDS.map(b => `
    <button class="sidebar-nav-item brand-item ${b.id === CURRENT_BRAND && isBrandViewActive() ? 'active' : ''}" 
            onclick="switchBrand('${b.id}')"
            title="${b.name} (${b.productCount} dòng SP)">
      <span class="nav-label">${b.name}</span>
      <span class="nav-badge">${b.productCount}</span>
    </button>
  `).join('');

  // Update Accordion button active state
  const accordionToggle = document.getElementById('brandAccordionToggle');
  if (accordionToggle) {
    accordionToggle.classList.toggle('active', isBrandViewActive());
  }
}

// Switch To Global Views (Tập Làm Báo Giá hoặc Quản Trị Hệ Thống)
function switchToGlobalView(viewName) {
  // Guard Admin View: require login
  if (viewName === 'admin' && !isAdminLoggedIn()) {
    openAdminLoginModal('Tính năng Quản trị & Quy hoạch danh mục yêu cầu tài khoản Admin (daco.admin).');
    return;
  }

  CURRENT_VIEW = viewName;

  // 1. Hide Brand-specific wrapper
  const brandWrapper = document.getElementById('brandViewsWrapper');
  if (brandWrapper) brandWrapper.classList.add('hidden');

  // 2. Hide all view sections, show target global view
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
  const targetSec = document.getElementById(`view-${viewName}`);
  if (targetSec) targetSec.classList.remove('hidden');

  // 3. Update Sidebar active states
  const btnQuote = document.getElementById('sidebarNavQuotation');
  const btnNotes = document.getElementById('sidebarNavNotes');
  const btnAdmin = document.getElementById('sidebarNavAdmin');
  if (btnQuote) btnQuote.classList.toggle('active', viewName === 'quotation');
  if (btnNotes) btnNotes.classList.toggle('active', viewName === 'notes');
  if (btnAdmin) btnAdmin.classList.toggle('active', viewName === 'admin');

  const accordionToggle = document.getElementById('brandAccordionToggle');
  if (accordionToggle) accordionToggle.classList.remove('active');

  // 4. Update Breadcrumbs & trigger renders
  const bcCat = document.getElementById('bcCategory');
  const bcCur = document.getElementById('bcCurrent');
  if (viewName === 'quotation') {
    if (bcCat) bcCat.innerText = 'Công Cụ Hệ Thống';
    if (bcCur) bcCur.innerText = 'Tập Làm Báo Giá';
  } else if (viewName === 'notes') {
    if (bcCat) bcCat.innerText = 'Hệ Thống Phản Hồi';
    if (bcCur) bcCur.innerText = 'Hòm Thư Đề Xuất & Ghi Chú';
    renderProposalsList();
  } else if (viewName === 'admin') {
    if (bcCat) bcCat.innerText = 'Quản Trị Hệ Thống';
    if (bcCur) bcCur.innerText = 'Cập Nhật & Thêm Hãng';
  }

  // 5. Re-render brand list so no brand is highlighted as active
  renderBrandNav();

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Switch Active Brand
async function switchBrand(brandId) {
  CURRENT_BRAND = brandId;
  CURRENT_VIEW = 'brand';
  const brandMeta = BRANDS.find(b => b.id === brandId) || BRANDS[0];

  // 1. Show Brand Views Wrapper, Hide Global Views
  const brandWrapper = document.getElementById('brandViewsWrapper');
  if (brandWrapper) brandWrapper.classList.remove('hidden');
  const quoteSec = document.getElementById('view-quotation');
  if (quoteSec) quoteSec.classList.add('hidden');
  const adminSec = document.getElementById('view-admin');
  if (adminSec) adminSec.classList.add('hidden');

  // 2. Clear global sidebar active states
  const btnQuote = document.getElementById('sidebarNavQuotation');
  const btnAdmin = document.getElementById('sidebarNavAdmin');
  if (btnQuote) btnQuote.classList.remove('active');
  if (btnAdmin) btnAdmin.classList.remove('active');

  // 3. Update breadcrumb
  const bcCat = document.getElementById('bcCategory');
  const bcCur = document.getElementById('bcCurrent');
  if (bcCat) bcCat.innerText = 'Thương Hiệu';
  if (bcCur) bcCur.innerText = brandMeta.name;

  // 4. Update brand active theme color
  document.documentElement.style.setProperty('--brand-active', brandMeta.color);

  // 5. Update Active Brand Banner
  const brandNameEl = document.getElementById('currentBrandName');
  if (brandNameEl) brandNameEl.innerText = brandMeta.name;

  const brandBadgeEl = document.getElementById('currentBrandBadge');
  if (brandBadgeEl) brandBadgeEl.innerText = brandMeta.badge;

  const brandCountEl = document.getElementById('currentBrandCount');
  if (brandCountEl) brandCountEl.innerText = `${brandMeta.productCount} Dòng Sản Phẩm`;

  const brandTaglineEl = document.getElementById('currentBrandTagline');
  if (brandTaglineEl) brandTaglineEl.innerText = brandMeta.tagline;

  const activeBannerEl = document.getElementById('activeBrandBanner');
  if (activeBannerEl) activeBannerEl.style.borderLeftColor = brandMeta.color;

  // 6. Ensure active brand sub-tab is displayed
  const activeSubTab = document.querySelector('.sub-tab-btn.active');
  const activeViewName = activeSubTab ? activeSubTab.getAttribute('data-view') : 'tree';
  document.querySelectorAll('#brandViewsWrapper .view-section').forEach(sec => sec.classList.add('hidden'));
  const activeSec = document.getElementById(`view-${activeViewName}`);
  if (activeSec) activeSec.classList.remove('hidden');

  renderBrandNav();

  // 7. Check window global first for 100% offline without CORS
  const globalDataMap = {
    'mitsubishi': window.PORTAL_DATA_MITSUBISHI,
    'mitutoyo': window.PORTAL_DATA_MITUTOYO,
    'qlight': window.PORTAL_DATA_QLIGHT,
    'omron': window.PORTAL_DATA_OMRON,
    'autonics': window.PORTAL_DATA_AUTONICS,
    'patlite': window.PORTAL_DATA_PATLITE,
    'brother': window.PORTAL_DATA_BROTHER,
    'zebra': window.PORTAL_DATA_ZEBRA,
    'proface': window.PORTAL_DATA_PROFACE,
    'xenang': window.PORTAL_DATA_XENANG
  };

  if (globalDataMap[brandId]) {
    BRAND_DATA[brandId] = globalDataMap[brandId];
    renderBrandViews();
    return;
  }

  // Fallback to fetch if served via HTTP server
  try {
    const res = await fetch(`data/${brandId}.json`);
    BRAND_DATA[brandId] = await res.json();
    renderBrandViews();
  } catch (err) {
    console.error(`Error loading data for ${brandId}:`, err);
  }
}

// Pre-load all products from all brands for Universal Search
async function loadAllProductsForSearch() {
  ALL_PRODUCTS_CACHE = [];
  const globalDataMap = {
    'mitsubishi': window.PORTAL_DATA_MITSUBISHI,
    'mitutoyo': window.PORTAL_DATA_MITUTOYO,
    'qlight': window.PORTAL_DATA_QLIGHT,
    'omron': window.PORTAL_DATA_OMRON,
    'autonics': window.PORTAL_DATA_AUTONICS,
    'patlite': window.PORTAL_DATA_PATLITE,
    'brother': window.PORTAL_DATA_BROTHER,
    'zebra': window.PORTAL_DATA_ZEBRA,
    'proface': window.PORTAL_DATA_PROFACE,
    'xenang': window.PORTAL_DATA_XENANG
  };

  const brandIds = BRANDS && BRANDS.length ? BRANDS.map(b => b.id) : Object.keys(globalDataMap);

  for (const bid of brandIds) {
    let data = globalDataMap[bid];
    if (!data) {
      try {
        const res = await fetch(`data/${bid}.json`);
        data = await res.json();
      } catch (e) {
        console.warn('Preload search error for', bid, e);
      }
    }
    if (data && data.products) {
      const meta = BRANDS.find(b => b.id === bid);
      data.products.forEach(p => {
        ALL_PRODUCTS_CACHE.push({
          ...p,
          brandId: bid,
          brandName: meta ? meta.name : bid,
          brandColor: meta ? meta.color : '#e60012'
        });
      });
    }
  }
}

// Render Views for Active Brand
function renderBrandViews() {
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data) return;

  // Load custom products from localStorage if edited
  const savedProducts = localStorage.getItem(`portal_custom_products_${CURRENT_BRAND}`);
  if (savedProducts) {
    try { data.products = JSON.parse(savedProducts); } catch (e) {}
  }

  // Load custom suppliers from localStorage if edited
  const savedSuppliers = localStorage.getItem(`portal_custom_suppliers_${CURRENT_BRAND}`);
  if (savedSuppliers) {
    try { data.suppliersDirectory = JSON.parse(savedSuppliers); } catch (e) {}
  }

  // 0. Render Tree Hierarchy & Code Breakdown (Tab 1)
  renderBrandTree(data.treeData || []);
  renderDecoderSamples(CURRENT_BRAND);

  // 1. History Lineage
  renderHistory(data.history || []);

  // 2. Software Ecosystem (Filtered for Active Brand)
  renderSoftware(data.software || []);

  // 3. Brochure & Catalog Library (Filtered for Active Brand)
  renderBrochures(data.brochures || []);

  // 4. Catalog Products Table & Filters
  populateCategoryFilter(data.products || []);
  applyCatalogFilters();

  // 5. Excel-like Resizable Columns Initialization
  initResizableColumns();
}

// Check whether a product genuinely uses software (not "Không dùng", null, or empty)
function hasProductSoftware(software) {
  if (!software) return false;
  const s = String(software).trim().toLowerCase();
  if (
    s === '' ||
    s === 'none' ||
    s === 'n/a' ||
    s === '-' ||
    s === 'không' ||
    s === 'khong' ||
    s.includes('không dùng') ||
    s.includes('khong dung') ||
    s.includes('không sử dụng') ||
    s.includes('khong su dung') ||
    s.includes('không cần') ||
    s.includes('khong can')
  ) {
    return false;
  }
  return true;
}

// Populate Filter Dropdowns dynamically for the active brand
function populateCategoryFilter(products) {
  // 1. Populate Category dropdown
  const catSelect = document.getElementById('filterCategory');
  if (catSelect) {
    const catCountMap = {};
    products.forEach(p => {
      const cat = p.cat ? p.cat.trim() : 'Khác';
      catCountMap[cat] = (catCountMap[cat] || 0) + 1;
    });

    const categories = Object.keys(catCountMap).sort();
    catSelect.innerHTML = `<option value="all">Tất cả chủng loại (${products.length})</option>` +
      categories.map(c => `<option value="${c}">${c} (${catCountMap[c]})</option>`).join('');
    catSelect.value = 'all';
  }

  // 2. Populate Software dropdown with actual counts
  const swSelect = document.getElementById('filterSoftware');
  if (swSelect) {
    const hasSwCount = products.filter(p => hasProductSoftware(p.software)).length;
    const noSwCount = products.length - hasSwCount;
    swSelect.innerHTML = `
      <option value="all">Tất cả phần mềm (${products.length})</option>
      <option value="has_software">Có dùng phần mềm (${hasSwCount})</option>
      <option value="no_software">Không dùng phần mềm (${noSwCount})</option>
    `;
    swSelect.value = 'all';
  }
}

// Apply real-time multi-criteria filtering on catalog table
function applyCatalogFilters() {
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data || !data.products) return;

  const catVal = document.getElementById('filterCategory')?.value || 'all';
  const statusVal = document.getElementById('filterStatus')?.value || 'all';
  const swVal = document.getElementById('filterSoftware')?.value || 'all';
  const rawKeyword = (document.getElementById('filterKeyword')?.value || '').trim();
  const keyword = rawKeyword.toLowerCase();
  const qNorm = removeVietnameseTones(keyword);

  const allProducts = data.products;
  const filtered = allProducts.filter(p => {
    // 1. Chủng loại
    if (catVal !== 'all' && (p.cat || '').trim() !== catVal) {
      return false;
    }

    // 2. Trạng thái & Rủi ro đặc thù
    if (statusVal === 'thong_dung' && !(p.status || '').includes('Thông dụng')) return false;
    if (statusVal === 'ngung_sx' && !(p.status || '').includes('Ngừng')) return false;
    if (statusVal === 'hiem' && !(p.status || '').includes('Hiếm')) return false;
    if (statusVal === 'moi' && !(p.status || '').includes('Mới')) return false;
    if (statusVal === 'fake' && p.fake !== 'Có') return false;
    if (statusVal === 'renew' && p.renew !== 'Có') return false;

    // 3. Phần mềm đi kèm (Phân biệt chuẩn xác chuỗi "Không dùng" vs Phần mềm thực tế)
    const usesSoftware = hasProductSoftware(p.software);
    if (swVal === 'has_software' && !usesSoftware) return false;
    if (swVal === 'no_software' && usesSoftware) return false;

    // 4. Từ khóa nhanh (Chỉ lọc chính xác theo Model, Series, hoặc Chủng loại)
    // Tuyệt đối KHÔNG match vào points hay replacement để tránh tình trạng gõ FX5U lại ra Dòng A hay FX3U
    if (keyword) {
      const { score, matchType } = scoreProduct(p, keyword, qNorm);
      if (score <= 0 || matchType === 'context') {
        return false;
      }
    }

    return true;
  });

  // Update Result Count Badge
  const countBadge = document.getElementById('filterResultCount');
  if (countBadge) {
    countBadge.innerText = `${filtered.length} / ${allProducts.length} sản phẩm`;
  }

  // Render Table Rows
  renderProductsTable(filtered);
}

// Reset all catalog filters
function resetCatalogFilters() {
  const catSelect = document.getElementById('filterCategory');
  const statusSelect = document.getElementById('filterStatus');
  const swSelect = document.getElementById('filterSoftware');
  const kwInput = document.getElementById('filterKeyword');

  if (catSelect) catSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (swSelect) swSelect.value = 'all';
  if (kwInput) kwInput.value = '';

  applyCatalogFilters();
}

// Render History Lineages
function renderHistory(histories) {
  const container = document.getElementById('historyContainer');
  if (!histories.length) {
    container.innerHTML = `<div style="padding: 2rem; color: var(--text-dim); text-align: center;">Chưa có sơ đồ tiến hóa dòng thời gian cho thương hiệu này.</div>`;
    return;
  }

  container.innerHTML = histories.map(h => `
    <div class="history-group">
      <div class="history-group-title">
        <span>📜</span>
        <span>${h.category}</span>
      </div>
      <div class="timeline-track">
        ${h.steps.map((s, idx) => `
          <div class="timeline-node" style="border-top: 3px solid ${s.badge === 'discontinued' ? 'var(--status-discontinued)' : s.badge === 'current' ? 'var(--status-active)' : 'var(--accent-blue)'};">
            <div class="timeline-era">${s.era}</div>
            <div class="timeline-name">${s.name}</div>
            <div style="margin-bottom: 0.35rem;">
              <span class="badge ${s.badge === 'discontinued' ? 'badge-red' : s.badge === 'current' ? 'badge-green' : 'badge-blue'}">
                ${s.status}
              </span>
            </div>
            ${s.software ? `<div class="timeline-software">💻 ${s.software}</div>` : ''}
            <div class="timeline-highlight">💡 ${s.highlight}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Render Software Ecosystem
function renderSoftware(softwares) {
  const container = document.getElementById('softwareContainer');
  if (!softwares.length) {
    container.innerHTML = `<div style="padding: 2.5rem; color: var(--text-dim); text-align: center; grid-column: 1 / -1;">Thương hiệu này không sử dụng phần mềm chuyên dụng.</div>`;
    return;
  }

  container.innerHTML = softwares.map(s => `
    <div class="software-card" style="display: flex; flex-direction: column;">
      <div class="software-header">
        <div class="software-name">💻 ${s.name}</div>
        <div class="software-ver">${s.version}</div>
      </div>
      <div class="software-target">🎯 Dòng hỗ trợ: <span style="color: var(--accent-cyan); font-weight: normal;">${s.target}</span></div>
      <div class="software-purpose">⚙️ <strong>Chức năng chính:</strong> ${s.purpose}</div>
      <div class="software-note" style="margin-bottom: 0.85rem;">💡 <strong>Lưu ý:</strong> ${s.note}</div>
      
      ${s.link ? `
        <div style="margin-top: auto; padding-top: 0.85rem; border-top: 1px dashed var(--border-color); display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <a href="${s.link}" target="_blank" rel="noopener noreferrer" class="btn-primary btn-sm" style="flex: 1; text-align: center; text-decoration: none; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.5rem 0.75rem;">
            <span>⬇️</span> <span>Tải Phần Mềm / Mở Link</span>
          </a>
          <button class="btn-secondary btn-sm" onclick="copySoftwareLink('${s.link.replace(/'/g, "\\'")}', event)" title="Sao chép link gửi nhanh cho khách hoặc đồng nghiệp" style="padding: 0.5rem 0.75rem; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 0.3rem;">
            <span>📋</span> <span>Copy Link</span>
          </button>
        </div>
      ` : `
        <div style="margin-top: auto; padding-top: 0.75rem; border-top: 1px dashed var(--border-color); font-size: 0.78rem; color: var(--text-dim); display: flex; align-items: center; gap: 0.4rem; font-style: italic;">
          <span>🔒</span> <span>Bản quyền nội bộ — Liên hệ DACO Tech Team để nhận file cài đặt.</span>
        </div>
      `}
    </div>
  `).join('');
}

// Render Brochure Library (Filtered for Active Brand)
function renderBrochures(brochures) {
  const container = document.getElementById('brochureContainer');
  if (!container) return;
  if (!brochures || !brochures.length) {
    container.innerHTML = `<div style="padding: 2.5rem; color: var(--text-dim); text-align: center; grid-column: 1 / -1;">Chưa có tài liệu hoặc catalog nào cho thương hiệu này. Bạn có thể cập nhật trong tab <strong>Quản Trị</strong>.</div>`;
    return;
  }

  container.innerHTML = brochures.map(b => {
    const isPdfOrLocal = b.isLocal || (b.link && (b.link.endsWith('.pdf') || b.link.startsWith('../') || b.link.startsWith('data:')));
    return `
      <div class="software-card">
        <div class="software-header">
          <div class="software-name" style="font-size: 1.05rem;">📄 ${b.title}</div>
          <span class="badge badge-blue" style="font-size: 0.72rem;">${b.category || 'Catalog'}</span>
        </div>
        <div style="font-size: 0.83rem; color: var(--text-muted); margin: 0.6rem 0; line-height: 1.45; flex: 1;">${b.desc || ''}</div>
        <a href="${b.link}" target="_blank" class="brochure-link" style="margin-top: auto;">
          ${isPdfOrLocal ? '📄 Mở File Tài Liệu Nội Bộ' : '🌐 Mở Trang Catalog Online'}
        </a>
      </div>
    `;
  }).join('');
}

// Smart Supplier Formatter for Table & Modal (Click Exact Tier to Inspect)
function formatSuppliersCell(raw, prodId = null) {
  if (!raw || !String(raw).trim()) {
    return `<span style="color: var(--text-dim); font-size: 0.78rem; font-style: italic;">Đang cập nhật</span>`;
  }
  const str = String(raw).trim();
  
  // Trường hợp có phân tuyến (Tuyến 1, Tuyến 2 hoặc dấu |)
  if (str.includes('|') || /tuyến\s*\d/i.test(str)) {
    const parts = str.split('|').map(s => s.trim()).filter(Boolean);
    return `
      <div class="supplier-cell-wrap">
        ${parts.map(part => {
          const m = part.match(/^(\s*tuyến\s*(\d+|[^\:]+))\s*\:\s*(.*)$/i);
          if (m) {
            const tierLabel = m[1].trim();
            const tierNum = m[2].trim();
            const content = m[3].trim();
            const tierClass = tierNum === '1' ? 'tier-1' : tierNum === '2' ? 'tier-2' : 'tier-other';
            const clickAttr = prodId !== null 
              ? `onclick="event.stopPropagation(); openSupplierModalForTier(${prodId}, '${tierNum}')"`
              : `onclick="event.stopPropagation(); openAllSuppliersDirectory()"`;
            return `
              <div class="supplier-tier-card" ${clickAttr} title="Bấm để xem hồ sơ riêng cho ${tierLabel}: ${content}">
                <div class="supplier-tier-row">
                  <span class="tier-tag ${tierClass}">${tierLabel}</span>
                  <span class="tier-vendor-text">${content}</span>
                </div>
              </div>
            `;
          } else {
            const clickAttr = prodId !== null 
              ? `onclick="event.stopPropagation(); openSupplierModalForProduct(${prodId})"`
              : `onclick="event.stopPropagation(); openAllSuppliersDirectory()"`;
            return `
              <div class="supplier-tier-card" ${clickAttr} title="Bấm để xem chi tiết đối tác cung ứng">
                <span class="tier-vendor-text">${part}</span>
              </div>
            `;
          }
        }).join('')}
      </div>
    `;
  }

  // Trường hợp danh sách đối tác phân tách bằng dấu phẩy
  const partners = str.split(/[,;]/).map(p => p.trim()).filter(Boolean);
  const clickAttr = prodId !== null 
    ? `onclick="event.stopPropagation(); openSupplierModalForProduct(${prodId})"`
    : `onclick="event.stopPropagation(); openAllSuppliersDirectory()"`;

  if (partners.length > 1) {
    return `
      <div class="supplier-partner-list" ${clickAttr} title="Bấm để xem hồ sơ chi tiết đối tác">
        ${partners.map(p => `
          <div class="supplier-partner-chip" style="cursor: pointer;">
            <span style="font-size: 0.7rem;">🏢</span>
            <span>${p}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="supplier-partner-chip" ${clickAttr} style="display: flex; cursor: pointer;" title="Bấm để xem hồ sơ chi tiết đối tác">
      <span style="font-size: 0.7rem;">🏢</span>
      <span>${str}</span>
    </div>
  `;
}

// Smart Software Formatter for Table & Modal
function formatSoftwareCell(software) {
  if (!hasProductSoftware(software)) {
    return `<span style="color: var(--text-dim); font-size: 0.78rem; opacity: 0.75;">Không dùng</span>`;
  }
  const items = String(software).split(',').map(s => s.trim()).filter(Boolean);
  return `
    <div class="software-cell-wrap">
      ${items.map(s => `
        <span class="software-chip">
          <span style="font-size: 0.72rem;">💻</span>
          <span>${s}</span>
        </span>
      `).join('')}
    </div>
  `;
}

let _rowClickTimer = null;
function handleRowClick(id) {
  if (_rowClickTimer) {
    clearTimeout(_rowClickTimer);
    _rowClickTimer = null;
    closeModal();
    if (isAdminLoggedIn()) {
      openEditProductModal(id);
    } else {
      const p = (BRAND_DATA[CURRENT_BRAND]?.products || []).find(x => x.id === id);
      openNoteProposalModal(id, p ? p.serial : '', p ? p.cat : '');
    }
  } else {
    _rowClickTimer = setTimeout(() => {
      _rowClickTimer = null;
      openDetailModal(id);
    }, 220);
  }
}

// Helper to clean model code for display, stripping any trailing explanatory descriptions
function cleanModelTag(m) {
  if (!m) return '';
  let s = String(m).trim();
  // Strip trailing parenthetical description: "MODEL (desc...)" -> "MODEL"
  s = s.replace(/\s*\([^)]*\)$/, '').trim();
  // If "MODEL: desc...", strip desc
  if (s.includes(':')) {
    const parts = s.split(':');
    const prefix = parts[0].trim();
    if (!/^(nguồn|đế|module|motion|mccb|mcb|elcb|cp|contactor|rơ le|dòng|chiều dài|bản|đèn)/i.test(prefix)) {
      s = prefix;
    } else if (parts[1]) {
      s = parts[1].trim();
    }
  }
  return s;
}

// Render Catalog Table
function renderProductsTable(products) {
  const tbody = document.getElementById('catalogTableBody');
  if (!products.length) {
    const colCount = document.querySelectorAll('#catalogTable thead th').length || 7;
    tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align: center; padding: 2.5rem; color: var(--text-dim);">Chưa có sản phẩm nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map((p, idx) => {
    // Format bullet points with visual hierarchy (Cảnh báo đỏ, Tư vấn sales)
    const pointsHtml = (p.points || []).map(pt => {
      let icon = '•';
      let itemClass = '';
      if (pt.toLowerCase().includes('cảnh báo')) {
        icon = '⚠️';
        itemClass = 'style="color: #ef4444; font-weight: 600;"';
      } else if (pt.toLowerCase().includes('tư vấn sales') || pt.toLowerCase().includes('tư vấn:')) {
        icon = '💡';
        itemClass = 'style="color: var(--accent-green); font-weight: 600;"';
      } else if (pt.toLowerCase().includes('ứng dụng')) {
        icon = '⚙️';
      }
      return `<li><span style="margin-right: 4px;">${icon}</span><span ${itemClass}>${formatMarkdownBold(pt)}</span></li>`;
    }).join('');

    return `
      <tr onclick="handleRowClick(${p.id})" title="Nhấp 1 lần để xem chi tiết • Nhấp đúp để sửa nhanh" style="cursor: pointer;">
        <!-- Col 1: STT -->
        <td class="text-center font-mono" style="font-weight: 700; color: var(--text-dim); width: 40px;">${idx + 1}</td>

        <!-- Col 2: Chủng Loại, Dòng, Hình Ảnh & Trạng Thái -->
        <td style="width: 290px; min-width: 250px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            ${p.image ? `
              <div class="product-table-thumb-wrap" title="Nhấp xem chi tiết ${p.serial}">
                <img src="${p.image}" alt="${p.serial}" class="product-table-thumb" loading="lazy" onerror="this.parentElement.style.display='none';" />
              </div>
            ` : ''}
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 800; font-size: 0.96rem; color: var(--text-main); margin-bottom: 0.25rem;">${p.serial}</div>
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
                <span style="font-weight: 700; font-size: 0.74rem; color: var(--accent-blue); text-transform: uppercase; background: rgba(59,130,246,0.12); padding: 2px 6px; border-radius: 4px;">${p.cat}</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.35; margin-bottom: 0.5rem;">${p.subcat}</div>
              
              <!-- STATUS BADGES DIRECTLY UNDER DESCRIPTION -->
              <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                ${getStatusBadge(p.status)}
                ${p.fake === 'Có' ? '<span class="badge badge-red" style="font-size: 0.7rem;">⚠️ Fake</span>' : ''}
                ${p.renew === 'Có' ? '<span class="badge badge-amber" style="font-size: 0.7rem;">🔄 Renew</span>' : ''}
              </div>
            </div>
          </div>
        </td>

        <!-- Col 3: Model Thông Dụng (Clean tags without Copy button or extra text) -->
        <td style="width: 190px; min-width: 165px;">
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${(p.models || []).map(m => {
              const cm = cleanModelTag(m);
              return `<span class="code-tag" style="max-width: 100%; white-space: normal; word-break: break-all; font-size: 0.76rem;" title="${cm}">${cm}</span>`;
            }).join('')}
          </div>
        </td>

        <!-- Col 4: Đặc Điểm & Cảnh Báo Kỹ Thuật (Bullet Points) -->
        <td style="min-width: 280px;">
          <ul class="bullet-list" style="list-style: none; padding-left: 0;">
            ${pointsHtml}
          </ul>
        </td>

        <!-- Col 5: Nhà Cung Cấp Thế Mạnh (Clickable Tiers) -->
        <td style="width: 240px; min-width: 220px;">
          ${formatSuppliersCell(p.suppliers, p.id)}
        </td>

        <!-- Col 6: Phần Mềm Đi Kèm -->
        <td style="width: 135px; min-width: 115px; vertical-align: middle;">
          ${formatSoftwareCell(p.software)}
        </td>

        <!-- Col 7: Tài Liệu / Brochure -->
        <td style="width: 120px; min-width: 100px; text-align: center; vertical-align: middle;">
          ${p.brochure ? `
            <a href="${p.brochure}" target="_blank" class="brochure-link" onclick="event.stopPropagation();">
              📄 Xem Catalog
            </a>
          ` : '<span style="color: var(--text-dim); font-size: 0.78rem;">Đang cập nhật</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

// Helpers
function getStatusBadge(status) {
  if (!status) return '';
  if (status.includes('Ngừng')) return `<span class="badge badge-red">🛑 ${status}</span>`;
  if (status.includes('Thông dụng')) return `<span class="badge badge-green">✅ ${status}</span>`;
  if (status.includes('Hiếm')) return `<span class="badge badge-amber">⚡ ${status}</span>`;
  if (status.includes('Mới')) return `<span class="badge badge-blue">✨ ${status}</span>`;
  return `<span class="badge">${status}</span>`;
}

function formatMarkdownBold(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Vietnamese tone stripper for smart search
function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str);
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  try {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {}
  return str;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function highlightText(text, query) {
  if (!text || !query) return escapeHtml(text);
  const qClean = query.trim();
  if (!qClean) return escapeHtml(text);

  try {
    const escapedQuery = qClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    if (regex.test(text)) {
      return escapeHtml(text).replace(regex, '<mark style="background: rgba(250, 204, 21, 0.45); color: inherit; padding: 1px 3px; border-radius: 2px; font-weight: bold;">$1</mark>');
    }
  } catch (e) {}
  return escapeHtml(text);
}

// Relevance scoring engine for product search with strict match classification
function scoreProduct(p, q, qNorm) {
  let score = 0;
  let matchType = ''; // 'model' | 'serial' | 'category' | 'context'
  let matchedModel = '';
  let matchSnippet = '';

  const isOneChar = qNorm.length === 1;
  const isTwoChars = qNorm.length === 2;

  // 1. Check MODELS (Mã model là mục tiêu tra cứu quan trọng nhất)
  const models = p.models || [];
  for (const m of models) {
    const mLower = m.toLowerCase();
    const mNorm = removeVietnameseTones(mLower);

    if (mLower === q || mNorm === qNorm) {
      score += 400;
      matchType = 'model';
      matchedModel = m;
      break;
    } else if (mLower.startsWith(q) || mNorm.startsWith(qNorm)) {
      score += 260;
      matchType = 'model';
      matchedModel = m;
      break;
    } else if (!isOneChar && (mLower.includes(q) || mNorm.includes(qNorm))) {
      score += 180;
      if (!matchType) matchType = 'model';
      if (!matchedModel) matchedModel = m;
    }
  }

  // 2. Check SERIAL (Tên dòng sản phẩm)
  const serialLower = (p.serial || '').toLowerCase();
  const serialNorm = removeVietnameseTones(serialLower);
  if (serialLower === q || serialNorm === qNorm) {
    score += 350;
    if (!matchType) matchType = 'serial';
  } else if (serialLower.startsWith(q) || serialNorm.startsWith(qNorm)) {
    score += 240;
    if (!matchType) matchType = 'serial';
  } else {
    // Tách từ theo khoảng trắng, dấu gạch chéo, dấu gạch ngang, ngoặc
    const serialWords = serialNorm.split(/[\s\/\-\(\)]+/).filter(Boolean);
    if (serialWords.some(w => w === qNorm)) {
      score += 200;
      if (!matchType) matchType = 'serial';
    } else if (serialWords.some(w => w.startsWith(qNorm))) {
      score += 150;
      if (!matchType) matchType = 'serial';
    } else if (!isOneChar && (serialLower.includes(q) || serialNorm.includes(qNorm))) {
      score += 90;
      if (!matchType) matchType = 'serial';
    }
  }

  // 3. Check CHỦNG LOẠI (CAT)
  const catLower = (p.cat || '').toLowerCase();
  const catNorm = removeVietnameseTones(catLower);
  if (catLower === q || catNorm === qNorm) {
    score += 160;
    if (!matchType) matchType = 'category';
  } else if (catNorm.startsWith(qNorm)) {
    score += 110;
    if (!matchType) matchType = 'category';
  } else {
    const catWords = catNorm.split(/\s+/).filter(Boolean);
    if (catWords.some(w => w.startsWith(qNorm))) {
      score += 80;
      if (!matchType) matchType = 'category';
    } else if (!isOneChar && (catLower.includes(q) || catNorm.includes(qNorm))) {
      score += 40;
      if (!matchType) matchType = 'category';
    }
  }

  // 4. Check REPLACEMENT (Chỉ tính là context)
  if (p.replacement && !isOneChar) {
    const repLower = p.replacement.toLowerCase();
    const repNorm = removeVietnameseTones(repLower);
    if (repLower.includes(q) || repNorm.includes(qNorm)) {
      score += 30;
      if (!matchType) matchType = 'context';
    }
  }

  // 5. Check SUBCAT (Mô tả phân loại ngắn)
  if (!isOneChar) {
    const subLower = (p.subcat || '').toLowerCase();
    const subNorm = removeVietnameseTones(subLower);
    const subWords = subNorm.split(/[\s\/\-\(\)\,\.]+/).filter(Boolean);
    if (subWords.some(w => w.startsWith(qNorm))) {
      score += 25;
      if (!matchType) matchType = 'context';
    } else if (!isTwoChars && (subLower.includes(q) || subNorm.includes(qNorm))) {
      score += 15;
      if (!matchType) matchType = 'context';
    }
  }

  // 6. Check SOFTWARE
  if (hasProductSoftware(p.software) && !isOneChar) {
    const swLower = p.software.toLowerCase();
    const swNorm = removeVietnameseTones(swLower);
    if (swLower.startsWith(q) || swNorm.startsWith(qNorm)) {
      score += 35;
      if (!matchType) matchType = 'context';
    } else if (swLower.includes(q) || swNorm.includes(qNorm)) {
      score += 20;
      if (!matchType) matchType = 'context';
    }
  }

  // 7. Check POINTS (Đặc điểm kỹ thuật dài)
  // CHỈ xét khi từ khóa từ 3 ký tự trở lên để tránh nhiễu
  if (qNorm.length >= 3 && (p.points || []).length) {
    for (const pt of p.points) {
      const ptLower = pt.toLowerCase();
      const ptNorm = removeVietnameseTones(ptLower);
      if (ptLower.includes(q) || ptNorm.includes(qNorm)) {
        score += 10;
        if (!matchType) matchType = 'context';
        if (!matchSnippet) matchSnippet = pt;
        break;
      }
    }
  }

  return { score, matchType, matchedModel, matchSnippet };
}

// Universal Global Search Across ALL Brands with Smart Scoring & Strict Isolation
function handleGlobalSearch(query) {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();
  const qNorm = removeVietnameseTones(q);

  if (!q) {
    searchDropdown.style.display = 'none';
    searchClearBtn.style.display = 'none';
    return;
  }

  searchClearBtn.style.display = 'block';

  // Lọc và tính điểm cho tất cả sản phẩm
  let scoredList = [];
  for (const p of ALL_PRODUCTS_CACHE) {
    const { score, matchType, matchedModel, matchSnippet } = scoreProduct(p, q, qNorm);
    if (score > 0) {
      scoredList.push({
        ...p,
        _searchScore: score,
        _matchType: matchType,
        _matchedModel: matchedModel,
        _matchSnippet: matchSnippet
      });
    }
  }

  // NGUYÊN TẮC CÔ LẬP ĐỘ CHÍNH XÁC CAO:
  // Nếu có bất kỳ kết quả nào khớp trực tiếp MODEL hoặc SERIAL (Ví dụ gõ FX5U, 500-196...):
  // LỌC BỎ TOÀN BỘ các sản phẩm chỉ khớp gián tiếp qua context (points, replacement...)!
  const hasDirectModelOrSerial = scoredList.some(x => x._matchType === 'model' || x._matchType === 'serial');
  if (hasDirectModelOrSerial) {
    scoredList = scoredList.filter(x => x._matchType === 'model' || x._matchType === 'serial');
  } else {
    // Nếu không có Model/Serial nhưng có khớp Chủng loại (Category, ví dụ gõ plc, bien tan...):
    const hasCategoryMatch = scoredList.some(x => x._matchType === 'category');
    if (hasCategoryMatch) {
      scoredList = scoredList.filter(x => x._matchType === 'category');
    }
  }

  // Sắp xếp theo điểm giảm dần (sản phẩm khớp Model/Series lên trước)
  scoredList.sort((a, b) => b._searchScore - a._searchScore);

  const matches = scoredList.slice(0, 10);

  if (!matches.length) {
    searchDropdown.innerHTML = `<div style="padding: 1.25rem; color: var(--text-dim); text-align: center; font-size: 0.88rem;">Không tìm thấy model hoặc từ khóa nào khớp với "<strong>${escapeHtml(rawQ)}</strong>".</div>`;
    searchDropdown.style.display = 'block';
    return;
  }

  searchDropdown.innerHTML = `
    <div style="padding: 0.5rem 1rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); font-size: 0.74rem; font-weight: 700; color: var(--text-dim); display: flex; justify-content: space-between; align-items: center;">
      <span>KẾT QUẢ TÌM KIẾM TOÀN HỆ THỐNG</span>
      <span style="color: var(--accent-blue);">${scoredList.length} kết quả phù hợp</span>
    </div>
  ` + matches.map(m => {
    const modelPreview = m._matchedModel
      ? `<span class="code-tag" style="font-size: 0.82rem; background: rgba(59,130,246,0.18); border-color: var(--accent-blue); font-weight: 700;">${highlightText(cleanModelTag(m._matchedModel), rawQ)}</span>`
      : m.models.slice(0, 3).map(x => `<span class="code-tag">${cleanModelTag(x)}</span>`).join(' ') + (m.models.length > 3 ? '...' : '');

    return `
      <div class="search-result-item" onclick="selectSearchResult('${m.brandId}', ${m.id})">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem; flex-wrap: wrap;">
            <span style="font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: ${m.brandColor}; color: #fff;">${m.brandName}</span>
            <span style="font-weight: 800; color: var(--text-main); font-size: 0.94rem;">${highlightText(m.serial, rawQ)}</span>
            ${getStatusBadge(m.status)}
            ${m.fake === 'Có' ? '<span class="badge badge-red" style="font-size: 0.68rem;">⚠️ Fake</span>' : ''}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">
            <span style="font-weight: 600; color: var(--accent-blue);">${highlightText(m.cat, rawQ)}</span> • ${m.subcat}
          </div>
          <div style="font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
            <span style="color: var(--text-dim); font-size: 0.72rem; text-transform: uppercase; font-weight: 700;">Model:</span>
            ${modelPreview}
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; padding-left: 0.5rem;">
          <span style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 600; white-space: nowrap;">Xem chi tiết ➔</span>
        </div>
      </div>
    `;
  }).join('');

  searchDropdown.style.display = 'block';
}

function selectSearchResult(brandId, productId) {
  searchDropdown.style.display = 'none';
  if (CURRENT_BRAND !== brandId) {
    switchBrand(brandId).then(() => {
      openDetailModal(productId);
    });
  } else {
    openDetailModal(productId);
  }
}

// Detail Modal (Includes full replacement details, copy buttons & Edit button)
function openDetailModal(id) {
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data || !data.products) return;
  const p = data.products.find(x => x.id === id);
  if (!p) return;

  modalContent.innerHTML = `
    <div style="display: flex; gap: 1.25rem; align-items: flex-start; margin-bottom: 1.25rem; background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); flex-wrap: wrap;">
      ${p.image ? `
        <div style="flex-shrink: 0; width: 140px; height: 140px; border-radius: 10px; border: 1px solid var(--border-color); background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          <img src="${p.image}" alt="${p.serial}" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: zoom-in;" onclick="window.open('${p.image}', '_blank')" title="Nhấp để phóng to ảnh gốc sắc nét" />
        </div>
      ` : ''}
      <div style="flex: 1; min-width: 240px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; padding-right: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-blue); text-transform: uppercase;">${p.cat} • STT ${p.id}</span>
            ${getStatusBadge(p.status)}
            ${p.fake === 'Có' ? '<span class="badge badge-red">⚠️ Fake</span>' : ''}
            ${p.renew === 'Có' ? '<span class="badge badge-amber">🔄 Renew</span>' : ''}
          </div>
          ${isAdminLoggedIn() ? `
            <button type="button" class="btn-primary btn-sm" onclick="closeModal(); openEditProductModal(${p.id});" style="font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 0.9rem; box-shadow: 0 2px 8px rgba(59,130,246,0.35); font-size: 0.82rem;">
              ✏️ Chỉnh Sửa Thông Tin SP
            </button>
          ` : `
            <button type="button" class="btn-secondary btn-sm" onclick="closeModal(); openNoteProposalModal(${p.id}, '${escapeHtml(p.serial)}', '${escapeHtml(p.cat)}');" style="font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.45rem 0.9rem; font-size: 0.82rem; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4);" title="Gửi ghi chú đề xuất cần chỉnh sửa cho Admin phê duyệt">
              📝 Gửi Ghi Chú / Đề Xuất Sửa
            </button>
          `}
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.35rem; color: var(--text-main);">${p.serial}</h2>
        <div style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4;">${p.subcat}</div>
      </div>
    </div>

    <!-- MODEL THAY THẾ / NÂNG CẤP CHI TIẾT (ĐƯA VÀO POPUP) -->
    ${p.replacement ? `
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); border-left: 4px solid var(--accent-green); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
        <div style="font-size: 0.76rem; font-weight: 700; color: var(--accent-green); text-transform: uppercase;">Phương Án Thay Thế & Nâng Cấp:</div>
        <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); margin-top: 0.25rem;">${p.replacement}</div>
      </div>
    ` : ''}

    <div style="background: var(--bg-secondary); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1rem;">
      <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.4rem;">Danh Sách Model Thông Dụng (Bấm Copy Mã):</div>
      <div>
        ${(p.models || []).map(m => {
          const cm = cleanModelTag(m);
          return `
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; background: var(--bg-card); padding: 4px 8px; border-radius: 4px;">
            <span class="code-tag" style="font-size: 0.88rem; max-width: 100%;">${cm}</span>
            <button class="copy-btn" onclick="copyText('${cm}', this)">Copy Mã</button>
          </div>
        `;}).join('')}
      </div>
    </div>

    ${p.codeBreakdown && p.codeBreakdown.length ? `
      <div style="background: var(--bg-secondary); padding: 0.9rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
          <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">📐 Quy Chuẩn Đọc Mã (Ordering Specification):</span>
          ${p.namingRule && p.namingRule.example ? `<span class="naming-example-tag" style="background: rgba(59,130,246,0.12); color: var(--accent-blue); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">${p.namingRule.example}</span>` : ''}
        </div>
        <div class="naming-pills-flow" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${p.codeBreakdown.map(b => `
            <div class="naming-pill-item" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.4rem 0.65rem;" title="${escapeHtml(b.desc)}">
              <span class="pill-part" style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent-blue); display: block; font-size: 0.82rem;">${b.part}</span>
              <span class="pill-label" style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 2px;">${b.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div style="margin-bottom: 1rem;">
      <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.35rem;">Đặc Điểm & Cảnh Báo Kỹ Thuật (Bullet Points):</div>
      <ul class="bullet-list" style="background: var(--bg-secondary); padding: 0.75rem 1rem 0.75rem 2rem; border-radius: var(--radius-md);">
        ${(p.points || []).map(pt => `<li>${formatMarkdownBold(pt)}</li>`).join('')}
      </ul>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
      <div style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.35rem;">Phần mềm đi kèm:</div>
        <div>
          ${formatSoftwareCell(p.software)}
        </div>
      </div>
      <div style="background: var(--bg-secondary); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.35rem;">Tài liệu kỹ thuật:</div>
        <div>
          ${p.brochure ? `<a href="${p.brochure}" target="_blank" class="brochure-link">📄 Mở Brochure / Catalog</a>` : '<span style="color: var(--text-dim); font-size: 0.8rem;">Đang cập nhật</span>'}
        </div>
      </div>
    </div>

    ${p.suppliers ? `
      <div style="background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; margin-bottom: 0.4rem;">Nhà Cung Cấp Thế Mạnh:</div>
        <div>
          ${formatSuppliersCell(p.suppliers, p.id)}
        </div>
      </div>
    ` : ''}
  `;

  detailModal.classList.add('active');
}

function closeModal() {
  detailModal.classList.remove('active');
}

// Copy to clipboard
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép: ${text}`);
    if (btn) {
      const orig = btn.innerText;
      btn.innerText = 'Đã chép!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerText = orig;
        btn.classList.remove('copied');
      }, 1500);
    }
  });
}

function showToast(msg) {
  toastMessage.innerText = msg;
  toastMessage.classList.add('show');
  setTimeout(() => {
    toastMessage.classList.remove('show');
  }, 2500);
}

// Event Listeners
function initEventListeners() {
  // Theme Setup (Default Light, remember via localStorage)
  const savedTheme = localStorage.getItem('portal_theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  if (savedTheme === 'dark') {
    if (themeIcon) themeIcon.innerText = '☀️';
    if (themeText) themeText.innerText = 'Sáng';
  } else {
    if (themeIcon) themeIcon.innerText = '🌙';
    if (themeText) themeText.innerText = 'Tối';
  }

  // Theme Toggle Button
  themeToggleBtn.addEventListener('click', () => {
    const cur = document.body.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('portal_theme', next);
    if (next === 'dark') {
      if (themeIcon) themeIcon.innerText = '☀️';
      if (themeText) themeText.innerText = 'Sáng';
    } else {
      if (themeIcon) themeIcon.innerText = '🌙';
      if (themeText) themeText.innerText = 'Tối';
    }
  });

  // Catalog Table Filter Bar Listeners
  const filterCat = document.getElementById('filterCategory');
  const filterStatus = document.getElementById('filterStatus');
  const filterSw = document.getElementById('filterSoftware');
  const filterKw = document.getElementById('filterKeyword');
  const filterReset = document.getElementById('btnFilterReset');

  if (filterCat) filterCat.addEventListener('change', applyCatalogFilters);
  if (filterStatus) filterStatus.addEventListener('change', applyCatalogFilters);
  if (filterSw) filterSw.addEventListener('change', applyCatalogFilters);
  if (filterKw) filterKw.addEventListener('input', applyCatalogFilters);
  if (filterReset) filterReset.addEventListener('click', resetCatalogFilters);

  // Init Tree & Model Decoder Listeners
  initTreeDecoderListeners();

  // Global Search Input
  globalSearchInput.addEventListener('input', (e) => {
    handleGlobalSearch(e.target.value);
  });

  searchClearBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchDropdown.style.display = 'none';
    searchClearBtn.style.display = 'none';
  });

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.global-search-wrapper')) {
      searchDropdown.style.display = 'none';
    }
  });

  // Sub Tab Buttons (Brand-specific: catalog, history, software, brochure)
  const subTabBtns = document.querySelectorAll('.sub-tab-btn');
  subTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetView = btn.getAttribute('data-view');
      document.querySelectorAll('#brandViewsWrapper .view-section').forEach(sec => {
        sec.classList.add('hidden');
      });
      const targetSec = document.getElementById(`view-${targetView}`);
      if (targetSec) targetSec.classList.remove('hidden');

      // Tối ưu trạng thái màn hình Google Sheets cho Catalog Table
      document.body.classList.toggle('view-catalog-active', targetView === 'catalog');
    });
  });

  // Sidebar Collapse Toggle
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('portal_sidebar_collapsed', isCollapsed ? 'true' : 'false');
      sidebarToggleBtn.innerText = isCollapsed ? '▶' : '◀';

      // Cập nhật lại độ rộng bảng để co dãn trọn vẹn 100% khi menu thu gọn/mở rộng
      setTimeout(() => {
        const table = document.getElementById('catalogTable');
        if (table) {
          const ths = Array.from(table.querySelectorAll('thead th'));
          fitColumnsToContainer(table, ths);
        }
      }, 250);
    });
    if (localStorage.getItem('portal_sidebar_collapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
      sidebarToggleBtn.innerText = '▶';
    }
  }

  // Tự động căn chỉnh bảng khi thay đổi kích thước cửa sổ
  window.addEventListener('resize', () => {
    const table = document.getElementById('catalogTable');
    if (table) {
      const ths = Array.from(table.querySelectorAll('thead th'));
      fitColumnsToContainer(table, ths);
    }
  });

  // Modal Close
  modalCloseBtn.addEventListener('click', closeModal);
  detailModal.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') closeModal();
  });
  const supModal = document.getElementById('supplierDetailModal');
  if (supModal) {
    supModal.addEventListener('click', (e) => {
      if (e.target.id === 'supplierDetailModal') closeSupplierModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeSupplierModal();
      closeTreeEditModal();
    }
  });

  // Initialize Quotation and Admin Modules
  initQuotationModule();
  initAdminModule();
  initResizableColumns();
}

// ==============================================================
// MODULE: TẬP LÀM BÁO GIÁ & ĐÁNH GIÁ TỰ ĐỘNG (QUOTATION SIMULATOR)
// ==============================================================
function initQuotationModule() {
  const scenarioSelect = document.getElementById('scenarioSelect');
  if (!scenarioSelect) return;

  const scenarios = window.PORTAL_QUOTATION_SCENARIOS || [];
  scenarioSelect.innerHTML = scenarios.map(s => `
    <option value="${s.id}">${s.name}</option>
  `).join('') + `<option value="custom">➕ Kịch bản tự do (Tự nhập mặt hàng)</option>`;

  scenarioSelect.addEventListener('change', (e) => {
    loadScenario(e.target.value);
  });

  // Load first scenario by default
  if (scenarios.length > 0) {
    loadScenario(scenarios[0].id);
  }

  // Add Row Button
  document.getElementById('btnAddQuoteRow').addEventListener('click', () => {
    addQuoteRow({
      model: '',
      name: '',
      qty: 1,
      unit: 'Cái',
      supplier: 'Phạm Dương / Kovi',
      origin: 'Japan',
      leadTime: 'Hàng sẵn',
      defaultCost: 1000000,
      targetPrice: 1200000
    });
  });

  // VAT rate change
  const vatRateEl = document.getElementById('quoteVatRate');
  if (vatRateEl) vatRateEl.addEventListener('change', calcQuoteTotals);
}

function loadScenario(scenarioId) {
  const scenarios = window.PORTAL_QUOTATION_SCENARIOS || [];
  const s = scenarios.find(x => x.id === scenarioId);

  const rawTextEl = document.getElementById('rawInquiryText');
  const checkpointsEl = document.getElementById('scenarioCheckpoints');
  const custTypeEl = document.getElementById('quoteCustomerType');

  if (s) {
    rawTextEl.innerText = s.rawInquiry;
    custTypeEl.value = s.customerType || 'Thương Mại';
    checkpointsEl.innerHTML = (s.keyCheckpoints || []).map(cp => `
      <span class="badge badge-amber" style="font-size: 0.76rem;">💡 ${cp}</span>
    `).join('');

    renderQuoteRows(s.items || []);
  } else {
    rawTextEl.innerText = "Khách hàng gửi yêu cầu tự do. Hãy tự điền danh sách mặt hàng và thiết lập báo giá bên dưới.";
    checkpointsEl.innerHTML = `<span class="badge badge-blue">Tùy biến tự do</span>`;
    renderQuoteRows([
      { model: 'FX5U-32MT/ES', name: 'PLC Mitsubishi FX5U', qty: 1, unit: 'Cái', supplier: 'Phạm Dương', origin: 'Japan', leadTime: 'Hàng sẵn', defaultCost: 4500000, targetPrice: 5200000 }
    ]);
  }
}

function renderQuoteRows(items) {
  const tbody = document.getElementById('quoteItemsBody');
  tbody.innerHTML = '';
  items.forEach((item, idx) => {
    addQuoteRow(item, idx + 1);
  });
  calcQuoteTotals();
}

function addQuoteRow(item, stt) {
  const tbody = document.getElementById('quoteItemsBody');
  const rowCount = tbody.querySelectorAll('tr').length;
  const rowIdx = rowCount + 1;
  const tr = document.createElement('tr');
  tr.id = `quoteRow_${rowIdx}`;

  const cost = item.defaultCost || 0;
  const price = item.targetPrice || 0;
  const qty = item.qty || 1;
  const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(1) : '0';
  const total = qty * price;

  tr.innerHTML = `
    <td class="text-center font-mono" style="color: var(--text-dim); width: 35px;">${stt || rowIdx}</td>
    <td><input type="text" class="form-input q-model" value="${item.model || ''}" style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent-cyan);"></td>
    <td><input type="text" class="form-input q-name" value="${item.name || ''}"></td>
    <td><input type="number" class="form-input q-qty text-center" value="${qty}" min="1" style="width: 60px;"></td>
    <td><input type="text" class="form-input q-unit text-center" value="${item.unit || 'Cái'}" style="width: 60px;"></td>
    <td><input type="text" class="form-input q-supp" value="${item.supplier || 'Phạm Dương'}"></td>
    <td>
      <select class="form-input q-origin">
        <option value="Japan" ${item.origin && item.origin.includes('Japan') ? 'selected' : ''}>Japan</option>
        <option value="China" ${item.origin && item.origin.includes('China') ? 'selected' : ''}>China</option>
        <option value="VN" ${item.origin && item.origin.includes('VN') ? 'selected' : ''}>Việt Nam</option>
        <option value="Khác">Khác</option>
      </select>
    </td>
    <td>
      <select class="form-input q-lead">
        <option value="Hàng sẵn" ${item.leadTime === 'Hàng sẵn' || item.leadTime === 'Có sẵn' ? 'selected' : ''}>Hàng sẵn</option>
        <option value="7-12 ngày" ${item.leadTime === '7-12 ngày' ? 'selected' : ''}>7-12 ngày</option>
        <option value="3-4 tuần" ${item.leadTime === '3-4 tuần' ? 'selected' : ''}>3-4 tuần</option>
      </select>
    </td>
    <td><input type="number" class="form-input q-cost text-right" value="${cost}" step="10000"></td>
    <td><input type="number" class="form-input q-price text-right" value="${price}" step="10000" style="font-weight: 700; color: var(--accent-green);"></td>
    <td class="text-center font-mono q-margin" style="font-weight: 700;">${margin}%</td>
    <td class="text-right font-mono q-subtotal" style="font-weight: 700;">${total.toLocaleString('vi-VN')} ₫</td>
    <td><button class="copy-btn" style="color: var(--status-discontinued); font-size: 0.9rem;" onclick="this.closest('tr').remove(); calcQuoteTotals();">&times;</button></td>
  `;

  // Attach auto recalculate event
  const inputs = tr.querySelectorAll('.q-qty, .q-cost, .q-price');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      const q = parseFloat(tr.querySelector('.q-qty').value) || 0;
      const c = parseFloat(tr.querySelector('.q-cost').value) || 0;
      const p = parseFloat(tr.querySelector('.q-price').value) || 0;
      const m = p > 0 ? (((p - c) / p) * 100).toFixed(1) : '0';
      const sub = q * p;

      const mEl = tr.querySelector('.q-margin');
      mEl.innerText = `${m}%`;
      if (parseFloat(m) < 8) mEl.style.color = 'var(--status-discontinued)';
      else if (parseFloat(m) > 25) mEl.style.color = 'var(--accent-amber)';
      else mEl.style.color = 'var(--accent-green)';

      tr.querySelector('.q-subtotal').innerText = `${sub.toLocaleString('vi-VN')} ₫`;
      calcQuoteTotals();
    });
  });

  tbody.appendChild(tr);
}

function calcQuoteTotals() {
  const rows = document.querySelectorAll('#quoteItemsBody tr');
  let subtotal = 0;
  let totalCost = 0;

  rows.forEach(tr => {
    const q = parseFloat(tr.querySelector('.q-qty').value) || 0;
    const c = parseFloat(tr.querySelector('.q-cost').value) || 0;
    const p = parseFloat(tr.querySelector('.q-price').value) || 0;
    subtotal += q * p;
    totalCost += q * c;
  });

  const vatRate = parseFloat(document.getElementById('quoteVatRate').value) || 0;
  const vatAmount = subtotal * (vatRate / 100);
  const grandTotal = subtotal + vatAmount;
  const grossProfit = subtotal - totalCost;
  const overallMargin = subtotal > 0 ? ((grossProfit / subtotal) * 100).toFixed(1) : 0;

  const totalsBox = document.getElementById('quoteSummaryTotals');
  totalsBox.innerHTML = `
    <div>Tiền hàng (chưa VAT): <strong>${subtotal.toLocaleString('vi-VN')} ₫</strong></div>
    <div>Thuế VAT (${vatRate}%): <strong>${vatAmount.toLocaleString('vi-VN')} ₫</strong></div>
    <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-green); margin-top: 0.2rem;">
      Tổng cộng thanh toán: ${grandTotal.toLocaleString('vi-VN')} ₫
    </div>
    <div style="font-size: 0.8rem; color: var(--accent-cyan); margin-top: 0.2rem;">
      Lợi nhuận gộp ước tính: ${grossProfit.toLocaleString('vi-VN')} ₫ (Biên LN: <strong>${overallMargin}%</strong>)
    </div>
  `;
}

// Practical Quotation Actions
function resetQuoteTable() {
  if (confirm('Bạn có chắc chắn muốn làm mới bảng báo giá không?')) {
    document.getElementById('quoteItemsBody').innerHTML = '';
    calcQuoteTotals();
    showToast('Đã làm mới bảng báo giá!');
  }
}

function downloadQuoteCsv() {
  const rows = document.querySelectorAll('#quoteItemsBody tr');
  if (!rows.length) {
    alert('Bảng báo giá hiện đang trống! Vui lòng thêm mặt hàng trước khi tải CSV.');
    return;
  }

  const custName = (document.getElementById('quoteCustomerName') || {}).value || 'Khach_Hang';
  const BOM = '\uFEFF';
  const headers = 'STT,Model,Ten Thiet Bi,So Luong,DVT,Nha Cung Cap,Xuat Xu,Tien Do,Gia Von (VND),Gia Ban (VND),Margin (%),Thanh Tien (VND)';
  
  const csvRows = [];
  rows.forEach((tr, idx) => {
    const model = (tr.querySelector('.q-model').value || '').replace(/"/g, '""');
    const name = (tr.querySelector('.q-name').value || '').replace(/"/g, '""');
    const q = tr.querySelector('.q-qty').value || 1;
    const unit = tr.querySelector('.q-unit').value || 'Cái';
    const supp = (tr.querySelector('.q-supp').value || '').replace(/"/g, '""');
    const origin = tr.querySelector('.q-origin').value || '';
    const lead = tr.querySelector('.q-lead').value || '';
    const cost = tr.querySelector('.q-cost').value || 0;
    const price = tr.querySelector('.q-price').value || 0;
    const margin = tr.querySelector('.q-margin').innerText.replace('%', '');
    const sub = parseFloat(q) * parseFloat(price);

    csvRows.push(`${idx + 1},"${model}","${name}",${q},"${unit}","${supp}","${origin}","${lead}",${cost},${price},${margin},${sub}`);
  });

  const blob = new Blob([BOM + [headers, ...csvRows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bao_gia_${custName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Đã tải file CSV báo giá!');
}

function copyQuotationToClipboard() {
  const rows = document.querySelectorAll('#quoteItemsBody tr');
  const custName = document.getElementById('quoteCustomerName').value;
  let text = `BẢNG BÁO GIÁ THIẾT BỊ\nKính gửi: ${custName}\n------------------------------------------\n`;

  rows.forEach((tr, idx) => {
    const model = tr.querySelector('.q-model').value;
    const name = tr.querySelector('.q-name').value;
    const q = tr.querySelector('.q-qty').value;
    const unit = tr.querySelector('.q-unit').value;
    const origin = tr.querySelector('.q-origin').value;
    const lead = tr.querySelector('.q-lead').value;
    const p = parseFloat(tr.querySelector('.q-price').value) || 0;
    const sub = q * p;
    text += `${idx + 1}. ${model} - ${name} | SL: ${q} ${unit} | XX: ${origin} | Tiến độ: ${lead} | Đơn giá: ${p.toLocaleString('vi-VN')} đ | T.Tiền: ${sub.toLocaleString('vi-VN')} đ\n`;
  });

  const totalsBox = document.getElementById('quoteSummaryTotals').innerText;
  text += `------------------------------------------\n${totalsBox}\nBảo hành: 12 tháng chính hãng.\nTrân trọng cảm ơn!`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Đã sao chép bảng báo giá vào bộ nhớ tạm!');
  });
}

// ==============================================================
// MODULE: QUẢN TRỊ DỮ LIỆU & THÊM HÃNG / SẢN PHẨM MỚI
// ==============================================================
function initAdminModule() {
  const selectBrandEl = document.getElementById('adminProductBrand');
  if (!selectBrandEl) return;

  function refreshAdminBrandSelect() {
    selectBrandEl.innerHTML = BRANDS.map(b => `
      <option value="${b.id}">${b.name} (${b.badge})</option>
    `).join('');
  }
  refreshAdminBrandSelect();
  refreshAdminDocBrandSelect();
  renderAdminDocsAndSoftwareList();

  // Wire up CSV upload events
  initCsvUpload();
  initNewBrandCsvUpload();

  // Save Product to Existing Brand
  document.getElementById('btnAdminSaveProduct').addEventListener('click', () => {
    const brandId = selectBrandEl.value;
    const cat = document.getElementById('adminProdCat').value.trim();
    const serial = document.getElementById('adminProdSerial').value.trim();
    const subcat = document.getElementById('adminProdSubcat').value.trim();
    const status = document.getElementById('adminProdStatus').value;
    const fake = document.getElementById('adminProdFake').value;
    const renew = document.getElementById('adminProdRenew').value;
    const modelsRaw = document.getElementById('adminProdModels').value.trim();
    const replacement = document.getElementById('adminProdReplacement').value.trim();
    const pointsRaw = document.getElementById('adminProdPoints').value.trim();
    const software = document.getElementById('adminProdSoftware').value.trim();
    const brochure = document.getElementById('adminProdBrochure').value.trim();
    const suppliers = document.getElementById('adminProdSuppliers').value.trim();

    if (!cat || !serial || !modelsRaw) {
      alert('Vui lòng điền tối thiểu: Chủng loại, Tên dòng và Model thông dụng!');
      return;
    }

    const modelsList = modelsRaw.split(/[\n,]/).map(m => m.trim()).filter(m => m);
    const pointsList = pointsRaw.split('\n').map(p => p.trim()).filter(p => p);

    const brandData = BRAND_DATA[brandId] || { products: [] };
    const newId = (brandData.products.length ? Math.max(...brandData.products.map(p => p.id)) : 0) + 1;

    const newProd = {
      id: newId,
      cat,
      subcat: subcat || cat,
      serial,
      status,
      fake,
      renew,
      models: modelsList,
      replacement: replacement || 'Dòng hiện hành',
      software,
      brochure,
      points: pointsList.length ? pointsList : [`**Thông số**: ${serial} - ${cat}`],
      suppliers: suppliers || 'Đại lý phân phối chính thức'
    };

    brandData.products.push(newProd);
    BRAND_DATA[brandId] = brandData;

    // Update product count on brand
    const bMeta = BRANDS.find(b => b.id === brandId);
    if (bMeta) bMeta.productCount = brandData.products.length;

    renderBrandNav();
    if (CURRENT_BRAND === brandId) {
      renderBrandViews();
    }

    showToast(`Đã thêm sản phẩm "${serial}" vào hãng ${bMeta ? bMeta.name : brandId}!`);

    // Reset Form
    document.getElementById('adminProdCat').value = '';
    document.getElementById('adminProdSerial').value = '';
    document.getElementById('adminProdSubcat').value = '';
    document.getElementById('adminProdModels').value = '';
    document.getElementById('adminProdPoints').value = '';
  });

  // Create Brand-New Brand
  document.getElementById('btnAdminCreateBrand').addEventListener('click', () => {
    const name = document.getElementById('adminBrandName').value.trim();
    const id = document.getElementById('adminBrandId').value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const color = document.getElementById('adminBrandColor').value;
    const icon = document.getElementById('adminBrandIcon').value.trim() || '🏷️';
    const badge = document.getElementById('adminBrandBadge').value.trim() || 'Thiết Bị Công Nghiệp';
    const tagline = document.getElementById('adminBrandTagline').value.trim() || 'Tra cứu thông số & tài liệu kỹ thuật';

    if (!name || !id) {
      alert('Vui lòng nhập Tên thương hiệu và Mã định danh (Slug)!');
      return;
    }

    if (BRANDS.some(b => b.id === id)) {
      alert(`Mã định danh "${id}" đã tồn tại! Vui lòng chọn mã khác.`);
      return;
    }

    const newBrand = {
      id,
      name,
      code: id.toUpperCase(),
      badge,
      color,
      icon,
      tagline,
      productCount: 0,
      hasSoftware: true,
      hasHistory: false
    };

    BRANDS.push(newBrand);
    BRAND_DATA[id] = { brand: name, products: [], software: [], history: [], brochures: [] };

    refreshAdminBrandSelect();
    refreshAdminDocBrandSelect();
    renderBrandNav();
    switchBrand(id);

    showToast(`Đã khởi tạo thành công thương hiệu mới "${name}"!`);

    // Reset Form
    document.getElementById('adminBrandName').value = '';
    document.getElementById('adminBrandId').value = '';
    document.getElementById('adminBrandBadge').value = '';
    document.getElementById('adminBrandTagline').value = '';
  });
}
// ==============================================================
// MODULE: CSV UPLOAD - BULK IMPORT SẢN PHẨM TỪ FILE
// ==============================================================

let _csvParsedRows = []; // Temp storage for parsed CSV before confirmation

// Toggle between Manual form and Upload form
function switchAdminMode(mode) {
  const manualForm = document.getElementById('adminManualForm');
  const uploadForm = document.getElementById('adminUploadForm');
  if (!manualForm || !uploadForm) return;

  document.querySelectorAll('.admin-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (mode === 'manual') {
    manualForm.classList.remove('hidden');
    uploadForm.classList.add('hidden');
  } else {
    manualForm.classList.add('hidden');
    uploadForm.classList.remove('hidden');
    // Sync brand dropdown for CSV
    const csvBrandEl = document.getElementById('adminCsvBrand');
    if (csvBrandEl) {
      csvBrandEl.innerHTML = BRANDS.map(b =>
        `<option value="${b.id}">${b.name} (${b.badge})</option>`
      ).join('');
    }
  }
}

// Initialize CSV drag-and-drop & file input events
function initCsvUpload() {
  const dropZone = document.getElementById('csvDropZone');
  const fileInput = document.getElementById('csvFileInput');
  const confirmBtn = document.getElementById('btnConfirmCsvImport');
  if (!dropZone || !fileInput) return;

  // Drag & Drop events
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processCsvFile(file);
  });

  // Click-to-select file
  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processCsvFile(e.target.files[0]);
  });

  // Confirm import button
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmCsvImport);
  }
}

// Read and parse CSV file
function processCsvFile(file) {
  if (!file.name.match(/\.(csv|txt)$/i)) {
    alert('⚠️ Vui lòng chọn file .csv hoặc .txt!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const parsed = parseCsv(text);
    if (parsed.rows.length === 0) {
      alert('⚠️ File CSV không có dữ liệu hợp lệ. Hãy kiểm tra lại format!');
      return;
    }
    _csvParsedRows = parsed.rows;
    renderCsvPreview(parsed.headers, parsed.rows);
  };
  reader.readAsText(file, 'UTF-8');
}

// Parse CSV text → {headers, rows}
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };

  const sep = lines[0].includes('\t') ? '\t' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = smartSplitCsv(lines[i], sep);
    if (cells.length < 2) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = (cells[idx] || '').trim().replace(/^"|"$/g, '');
    });
    rows.push(row);
  }
  return { headers, rows };
}

// Handle quoted CSV cells correctly
function smartSplitCsv(line, sep) {
  const result = [];
  let cur = '';
  let inQ = false;
  for (let c of line) {
    if (c === '"') { inQ = !inQ; continue; }
    if (c === sep && !inQ) { result.push(cur); cur = ''; continue; }
    cur += c;
  }
  result.push(cur);
  return result;
}

// Render preview table
function renderCsvPreview(headers, rows) {
  const head = document.getElementById('csvPreviewHead');
  const body = document.getElementById('csvPreviewBody');
  const countEl = document.getElementById('csvPreviewCount');
  const previewArea = document.getElementById('csvPreviewArea');
  if (!head || !body) return;

  head.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
  body.innerHTML = rows.map(row =>
    `<tr>${headers.map(h => `<td title="${row[h] || ''}">${row[h] || ''}</td>`).join('')}</tr>`
  ).join('');

  if (countEl) countEl.textContent = `✅ ${rows.length} sản phẩm đã đọc từ file`;
  previewArea.classList.remove('hidden');
}

// Confirm CSV import → push into BRAND_DATA
function confirmCsvImport() {
  const brandId = (document.getElementById('adminCsvBrand') || {}).value;
  if (!brandId || !_csvParsedRows.length) return;

  const brandData = BRAND_DATA[brandId] || { products: [] };
  let maxId = brandData.products.length ? Math.max(...brandData.products.map(p => p.id)) : 0;
  let addedCount = 0;

  _csvParsedRows.forEach(row => {
    // Map CSV column names (flexible — tries multiple header name variants)
    const cat = row['cat'] || row['Cat'] || row['Chủng Loại'] || row['chung_loai'] || '';
    const serial = row['serial'] || row['Serial'] || row['Tên Dòng'] || row['ten_dong'] || '';
    const models = (row['models'] || row['Models'] || row['Model'] || '').split(/[,|]/).map(m => m.trim()).filter(Boolean);
    const points = (row['points'] || row['Points'] || row['Đặc Điểm'] || '').split('|').map(p => p.trim()).filter(Boolean);

    if (!cat && !serial) return; // Skip empty rows

    maxId++;
    brandData.products.push({
      id: maxId,
      cat: cat || 'Chưa phân loại',
      subcat: row['subcat'] || row['Subcat'] || cat,
      serial: serial || `SP-${maxId}`,
      status: row['status'] || row['Trạng Thái'] || 'Thông dụng',
      fake: row['fake'] || row['Fake'] || 'Không',
      renew: row['renew'] || row['Renew'] || 'Không',
      models: models.length ? models : [serial],
      replacement: row['replacement'] || row['Thay Thế'] || 'Dòng hiện hành',
      software: row['software'] || row['Phần Mềm'] || '',
      brochure: row['brochure'] || row['Brochure'] || '',
      points: points.length ? points : [`**Thông số**: ${serial}`],
      suppliers: row['suppliers'] || row['Nhà Cung Cấp'] || 'Đại lý phân phối'
    });
    addedCount++;
  });

  BRAND_DATA[brandId] = brandData;
  const bMeta = BRANDS.find(b => b.id === brandId);
  if (bMeta) bMeta.productCount = brandData.products.length;

  renderBrandNav();
  if (CURRENT_BRAND === brandId) renderBrandViews();

  showToast(`🎉 Đã import thành công ${addedCount} sản phẩm vào ${bMeta ? bMeta.name : brandId}!`);
  clearCsvUpload();
}

// Reset upload form
function clearCsvUpload() {
  _csvParsedRows = [];
  const previewArea = document.getElementById('csvPreviewArea');
  if (previewArea) previewArea.classList.add('hidden');
  const fileInput = document.getElementById('csvFileInput');
  if (fileInput) fileInput.value = '';
}

// Download template CSV file
function downloadCsvTemplate() {
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compat
  const headers = 'cat,serial,subcat,status,fake,renew,models,replacement,points,software,brochure,suppliers';
  const example1 = 'PLC,FX5U,PLC thế hệ mới iQ-F,Thông dụng,Không,Có,"FX5U-32MT/ES, FX5U-64MT/ES","Thay thế FX3U","**Bản chất**: CPU 64-bit tích hợp Ethernet|**Ứng dụng**: Máy dệt - máy đóng gói|**Cảnh báo**: FX3U đã ngừng sản xuất",GX Works3,https://mitsubishifa.vn/plc-fx5u,"Tuyến 1: Phạm Dương | Tuyến 2: Hợp Long"';
  const example2 = 'Biến Tần,FR-E800,Biến tần nhỏ gọn 0.1~15kW,Thông dụng,Không,Không,"FR-E800-0.4K, FR-E800-1.5K","Thay thế FR-E700","**Bản chất**: Biến tần vector sensorless|**Ứng dụng**: Bơm - quạt - băng tải",FR Configurator2,,"Tuyến 1: Phạm Dương"';

  const csvContent = BOM + [headers, example1, example2].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template_san_pham_mau.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 Đã tải template CSV mẫu!');
}

// ==============================================================
// MODULE: CREATE NEW BRAND VIA CSV FILE OR MANUAL
// ==============================================================
let _newBrandCsvParsedRows = [];

function switchNewBrandMode(mode) {
  const uploadForm = document.getElementById('newBrandUploadForm');
  const manualForm = document.getElementById('newBrandManualForm');
  const btnUpload = document.getElementById('btnModeNewBrandUpload');
  const btnManual = document.getElementById('btnModeNewBrandManual');
  if (!uploadForm || !manualForm) return;

  if (mode === 'manual') {
    uploadForm.classList.add('hidden');
    manualForm.classList.remove('hidden');
    if (btnUpload) btnUpload.classList.remove('active');
    if (btnManual) btnManual.classList.add('active');
  } else {
    uploadForm.classList.remove('hidden');
    manualForm.classList.add('hidden');
    if (btnUpload) btnUpload.classList.add('active');
    if (btnManual) btnManual.classList.remove('active');
  }
}

function initNewBrandCsvUpload() {
  const dropZone = document.getElementById('newBrandCsvDropZone');
  const fileInput = document.getElementById('newBrandCsvFileInput');
  const confirmBtn = document.getElementById('btnConfirmNewBrandCsvImport');
  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processNewBrandCsvFile(file);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) processNewBrandCsvFile(e.target.files[0]);
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmNewBrandCsvImport);
  }
}

function processNewBrandCsvFile(file) {
  if (!file.name.match(/\.(csv|txt)$/i)) {
    alert('⚠️ Vui lòng chọn file .csv hoặc .txt!');
    return;
  }

  // Auto-detect brand name and slug from file name (e.g., "Omron.csv" -> "Omron")
  const rawFileName = file.name.replace(/\.[^/.]+$/, '').trim();
  const nameInput = document.getElementById('newBrandCsvName');
  const slugInput = document.getElementById('newBrandCsvSlug');

  if (nameInput && (!nameInput.value || nameInput.value.trim() === '')) {
    nameInput.value = rawFileName.charAt(0).toUpperCase() + rawFileName.slice(1);
  }
  if (slugInput && (!slugInput.value || slugInput.value.trim() === '')) {
    slugInput.value = rawFileName.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  const brandDisplayName = nameInput ? nameInput.value : rawFileName;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const parsed = parseCsv(text);
    if (parsed.rows.length === 0) {
      alert('⚠️ File CSV không có dữ liệu hợp lệ. Hãy kiểm tra lại format!');
      return;
    }
    _newBrandCsvParsedRows = parsed.rows;
    renderNewBrandCsvPreview(parsed.headers, parsed.rows, brandDisplayName);
  };
  reader.readAsText(file, 'UTF-8');
}

function renderNewBrandCsvPreview(headers, rows, brandName) {
  const head = document.getElementById('newBrandCsvPreviewHead');
  const body = document.getElementById('newBrandCsvPreviewBody');
  const countEl = document.getElementById('newBrandCsvPreviewCount');
  const previewArea = document.getElementById('newBrandCsvPreviewArea');
  if (!head || !body) return;

  head.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
  body.innerHTML = rows.map(row =>
    `<tr>${headers.map(h => `<td title="${row[h] || ''}">${row[h] || ''}</td>`).join('')}</tr>`
  ).join('');

  if (countEl) countEl.textContent = `✅ Đã nhận diện ${rows.length} sản phẩm của thương hiệu "${brandName}"`;
  if (previewArea) previewArea.classList.remove('hidden');
}

function confirmNewBrandCsvImport() {
  const nameInput = document.getElementById('newBrandCsvName');
  const slugInput = document.getElementById('newBrandCsvSlug');
  const colorInput = document.getElementById('newBrandCsvColor');
  const iconInput = document.getElementById('newBrandCsvIcon');
  const badgeInput = document.getElementById('newBrandCsvBadge');

  const name = (nameInput ? nameInput.value : '').trim();
  const slug = (slugInput ? slugInput.value : '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const color = colorInput ? colorInput.value : '#005bac';
  const icon = (iconInput && iconInput.value.trim()) ? iconInput.value.trim() : '🏢';
  const badge = (badgeInput && badgeInput.value.trim()) ? badgeInput.value.trim() : 'Thiết Bị Công Nghiệp';

  if (!name || !slug) {
    alert('Vui lòng nhập Tên thương hiệu và Mã định danh (Slug) trước khi import!');
    return;
  }

  if (!_newBrandCsvParsedRows.length) {
    alert('Chưa có file CSV nào được nạp! Vui lòng kéo thả hoặc chọn file CSV.');
    return;
  }

  // Parse products from CSV
  const productsList = [];
  let pId = 0;
  _newBrandCsvParsedRows.forEach(row => {
    const cat = row['cat'] || row['Cat'] || row['Chủng Loại'] || row['chung_loai'] || '';
    const serial = row['serial'] || row['Serial'] || row['Tên Dòng'] || row['ten_dong'] || '';
    const models = (row['models'] || row['Models'] || row['Model'] || '').split(/[,|]/).map(m => m.trim()).filter(Boolean);
    const points = (row['points'] || row['Points'] || row['Đặc Điểm'] || '').split('|').map(p => p.trim()).filter(Boolean);

    if (!cat && !serial) return;

    pId++;
    productsList.push({
      id: pId,
      cat: cat || 'Chưa phân loại',
      subcat: row['subcat'] || row['Subcat'] || cat,
      serial: serial || `${name}-${pId}`,
      status: row['status'] || row['Trạng Thái'] || 'Thông dụng',
      fake: row['fake'] || row['Fake'] || 'Không',
      renew: row['renew'] || row['Renew'] || 'Không',
      models: models.length ? models : [serial],
      replacement: row['replacement'] || row['Thay Thế'] || 'Dòng hiện hành',
      software: row['software'] || row['Phần Mềm'] || '',
      brochure: row['brochure'] || row['Brochure'] || '',
      points: points.length ? points : [`**Thông số**: ${serial} - ${cat}`],
      suppliers: row['suppliers'] || row['Nhà Cung Cấp'] || 'Đại lý phân phối chính thức'
    });
  });

  // Check if brand already exists
  let brandMeta = BRANDS.find(b => b.id === slug);
  if (!brandMeta) {
    brandMeta = {
      id: slug,
      name,
      code: slug.toUpperCase(),
      badge,
      color,
      icon,
      tagline: `Tra cứu thông số & tài liệu kỹ thuật ${name}`,
      productCount: productsList.length,
      hasSoftware: true,
      hasHistory: false
    };
    BRANDS.push(brandMeta);
    BRAND_DATA[slug] = {
      brand: name,
      products: productsList,
      software: [],
      history: [],
      brochures: []
    };
  } else {
    // Append to existing
    const brandData = BRAND_DATA[slug] || { products: [] };
    let curMax = brandData.products.length ? Math.max(...brandData.products.map(p => p.id)) : 0;
    productsList.forEach(p => {
      curMax++;
      p.id = curMax;
      brandData.products.push(p);
    });
    brandMeta.productCount = brandData.products.length;
    BRAND_DATA[slug] = brandData;
  }

  // Update ALL_PRODUCTS_CACHE for universal search
  productsList.forEach(p => {
    ALL_PRODUCTS_CACHE.push({
      ...p,
      brandId: slug,
      brandName: name,
      brandColor: color
    });
  });

  // Refresh All UI Selectors
  const selectBrandEl = document.getElementById('adminProductBrand');
  if (selectBrandEl) {
    selectBrandEl.innerHTML = BRANDS.map(b => `<option value="${b.id}">${b.name} (${b.badge})</option>`).join('');
  }
  const csvBrandEl = document.getElementById('adminCsvBrand');
  if (csvBrandEl) {
    csvBrandEl.innerHTML = BRANDS.map(b => `<option value="${b.id}">${b.name} (${b.badge})</option>`).join('');
  }
  refreshAdminDocBrandSelect();
  renderBrandNav();

  // Switch to new brand view
  switchBrand(slug);

  showToast(`🎉 Đã khởi tạo thành công thương hiệu "${name}" với ${productsList.length} sản phẩm!`);
  clearNewBrandCsvUpload();
}

function clearNewBrandCsvUpload() {
  _newBrandCsvParsedRows = [];
  const previewArea = document.getElementById('newBrandCsvPreviewArea');
  if (previewArea) previewArea.classList.add('hidden');
  const fileInput = document.getElementById('newBrandCsvFileInput');
  if (fileInput) fileInput.value = '';
}

function downloadNewBrandCsvTemplate() {
  const BOM = '\uFEFF';
  const headers = 'cat,serial,subcat,status,fake,renew,models,replacement,points,software,brochure,suppliers';
  const example1 = 'Cảm Biến Quang,E3Z Series,Cảm biến quang điện nhỏ gọn phổ thông,Thông dụng,Không,Không,"E3Z-T61, E3Z-D61, E3Z-R61","Thay thế dòng E3S cũ","**Bản chất**: Khoảng cách phát hiện tới 15m|**Ứng dụng**: Phát hiện bao bì, linh kiện cơ khí",Không dùng,https://omron.com,"Tuyến 1: Đại Hòa Phú"';
  const example2 = 'Bộ Nguồn,S8FS-C,Bộ nguồn tổ ong công nghiệp 24VDC,Thông dụng,Không,Không,"S8FS-C05024, S8FS-C10024, S8FS-C35024","Kế thừa S8JC","**Bản chất**: Nguồn xung chống nhiễu cao cấp|**Ứng dụng**: Cấp nguồn tủ điện tự động hóa",Không dùng,https://omron.com,"Tuyến 1: Hợp Long"';

  const csvContent = BOM + [headers, example1, example2].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template_tao_hang_moi.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 Đã tải template CSV tạo hãng mới!');
}

// ==============================================================
// MODULE: ADMIN 2 TABS & DOCUMENTS / SOFTWARE MANAGEMENT
// ==============================================================
function switchAdminMainTab(tabName) {
  const btnProducts = document.getElementById('btnAdminTabProducts');
  const btnDocs = document.getElementById('btnAdminTabDocs');
  const contentProducts = document.getElementById('adminTabContentProducts');
  const contentDocs = document.getElementById('adminTabContentDocs');

  if (!btnProducts || !btnDocs) return;

  if (tabName === 'products') {
    btnProducts.classList.add('active');
    btnDocs.classList.remove('active');
    contentProducts.classList.remove('hidden');
    contentDocs.classList.add('hidden');
  } else {
    btnDocs.classList.add('active');
    btnProducts.classList.remove('active');
    contentDocs.classList.remove('hidden');
    contentProducts.classList.add('hidden');
    refreshAdminDocBrandSelect();
    renderAdminDocsAndSoftwareList();
  }
}

let _pickedDocDataUrl = '';
let _pickedDocFileName = '';

function toggleDocInputMode(mode) {
  const linkGroup = document.getElementById('adminDocLinkGroup');
  const fileGroup = document.getElementById('adminDocFileGroup');
  if (mode === 'upload') {
    linkGroup.classList.add('hidden');
    fileGroup.classList.remove('hidden');
  } else {
    fileGroup.classList.add('hidden');
    linkGroup.classList.remove('hidden');
  }
}

function handleAdminDocFilePicked(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  _pickedDocFileName = file.name;
  const nameDisplay = document.getElementById('adminDocFileNameDisplay');
  if (nameDisplay) {
    nameDisplay.innerText = `📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  }

  // Pre-fill Title if empty
  const titleInput = document.getElementById('adminDocTitle');
  if (titleInput && !titleInput.value) {
    titleInput.value = file.name.replace(/\.[^/.]+$/, '');
  }

  // Read file into Data URL
  const reader = new FileReader();
  reader.onload = (e) => {
    _pickedDocDataUrl = e.target.result;
  };
  reader.readAsDataURL(file);
}

let ADMIN_DOC_PREVIEW_BRAND = '';

// Helper to ensure data for a brand is loaded (works 100% offline via globals or fetch)
async function ensureBrandDataLoaded(brandId) {
  if (BRAND_DATA[brandId]) return;
  const globalDataMap = {
    'mitsubishi': window.PORTAL_DATA_MITSUBISHI,
    'mitutoyo': window.PORTAL_DATA_MITUTOYO,
    'qlight': window.PORTAL_DATA_QLIGHT
  };
  if (globalDataMap[brandId]) {
    BRAND_DATA[brandId] = globalDataMap[brandId];
    return;
  }
  try {
    const res = await fetch(`data/${brandId}.json`);
    BRAND_DATA[brandId] = await res.json();
  } catch (err) {
    console.warn(`Error loading data for ${brandId}:`, err);
  }
}

function refreshAdminDocBrandSelect() {
  // 1. Target brand selector in upload form
  const sel = document.getElementById('adminDocTargetBrand');
  if (sel) {
    const currVal = sel.value || CURRENT_BRAND;
    sel.innerHTML = BRANDS.map(b => `
      <option value="${b.id}" ${b.id === currVal ? 'selected' : ''}>
        ${b.name} (${b.badge || 'Thiết bị'})
      </option>
    `).join('');
  }

  // 2. Interactive Drop List for previewing docs & software of ANY brand
  const previewSel = document.getElementById('adminDocPreviewBrandSelect');
  if (previewSel) {
    if (!ADMIN_DOC_PREVIEW_BRAND) ADMIN_DOC_PREVIEW_BRAND = CURRENT_BRAND;
    previewSel.innerHTML = BRANDS.map(b => `
      <option value="${b.id}" ${b.id === ADMIN_DOC_PREVIEW_BRAND ? 'selected' : ''}>
        ${b.name} (${b.badge || 'Thiết bị'})
      </option>
    `).join('');
  }
}

async function onAdminDocPreviewBrandChange(brandId) {
  ADMIN_DOC_PREVIEW_BRAND = brandId;
  await ensureBrandDataLoaded(brandId);
  renderAdminDocsAndSoftwareList();
}

function toggleAdminDocScope(scope) {
  const group = document.getElementById('adminDocProductSelectGroup');
  if (!group) return;
  if (scope === 'product' || scope === 'both') {
    group.classList.remove('hidden');
    const sel = document.getElementById('adminDocTargetBrand');
    const brandId = sel ? sel.value : CURRENT_BRAND;
    updateAdminDocTargetProductOptions(brandId);
  } else {
    group.classList.add('hidden');
  }
}
window.toggleAdminDocScope = toggleAdminDocScope;

async function updateAdminDocTargetProductOptions(brandId) {
  await ensureBrandDataLoaded(brandId);
  const prodSelect = document.getElementById('adminDocTargetProduct');
  if (!prodSelect) return;
  const data = BRAND_DATA[brandId];
  const prods = data ? (data.products || []) : [];
  if (!prods.length) {
    prodSelect.innerHTML = '<option value="">(Chưa có sản phẩm nào cho hãng này)</option>';
    return;
  }
  prodSelect.innerHTML = prods.map(p => `
    <option value="${p.id}">
      [${p.cat || 'SP'}] ${p.serial || p.name} ${p.models && p.models.length ? `(${p.models.slice(0, 2).join(', ')})` : ''}
    </option>
  `).join('');
}
window.updateAdminDocTargetProductOptions = updateAdminDocTargetProductOptions;

function handleAdminDocBrandChange(brandId) {
  ADMIN_DOC_PREVIEW_BRAND = brandId;
  const previewSel = document.getElementById('adminDocPreviewBrandSelect');
  if (previewSel) previewSel.value = brandId;
  updateAdminDocTargetProductOptions(brandId);
  renderAdminDocsAndSoftwareList();
}

async function renderAdminDocsAndSoftwareList() {
  const previewSel = document.getElementById('adminDocPreviewBrandSelect');
  const brandId = (previewSel && previewSel.value) ? previewSel.value : (ADMIN_DOC_PREVIEW_BRAND || CURRENT_BRAND);

  await ensureBrandDataLoaded(brandId);

  const data = BRAND_DATA[brandId] || {};
  const meta = BRANDS.find(b => b.id === brandId);

  // 1. Documents
  const docs = data.brochures || [];
  const docsCount = document.getElementById('adminDocsCount');
  if (docsCount) docsCount.innerText = `${docs.length} mục`;
  const docsContainer = document.getElementById('adminDocsListContainer');
  if (docsContainer) {
    if (!docs.length) {
      docsContainer.innerHTML = `<div style="padding: 1.75rem; color: var(--text-dim); font-size: 0.85rem; text-align: center; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">Chưa có tài liệu nào cho <b>${meta ? meta.name : brandId}</b>.</div>`;
    } else {
      docsContainer.innerHTML = docs.map((d, idx) => `
        <div class="admin-item-row">
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 0.5rem; flex: 1;">
            <div style="font-weight: 700; color: var(--text-main);">${d.title}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${d.category || 'Catalog'} • <a href="${d.link}" target="_blank" style="color: var(--accent); font-weight: 600;">Mở xem</a></div>
          </div>
          <button class="btn-del-mini" onclick="deleteAdminDoc(${idx})" title="Xóa tài liệu">🗑️ Xóa</button>
        </div>
      `).join('');
    }
  }

  // 2. Software
  const softs = data.software || [];
  const softCount = document.getElementById('adminSoftCount');
  if (softCount) softCount.innerText = `${softs.length} mục`;
  const softContainer = document.getElementById('adminSoftListContainer');
  if (softContainer) {
    if (!softs.length) {
      softContainer.innerHTML = `<div style="padding: 1.75rem; color: var(--text-dim); font-size: 0.85rem; text-align: center; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">Chưa có phần mềm nào cho <b>${meta ? meta.name : brandId}</b>.</div>`;
    } else {
      softContainer.innerHTML = softs.map((s, idx) => `
        <div class="admin-item-row" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
          <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 0.5rem; flex: 1;">
            <div style="font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
              <span>${s.name}</span>
              <span style="font-size: 0.72rem; color: var(--accent); font-family: monospace; font-weight: 700;">${s.version || ''}</span>
              ${s.link ? `<a href="${s.link}" target="_blank" rel="noopener noreferrer" title="Mở link tải thử" style="text-decoration: none; font-size: 0.8rem;">🔗 Mở</a>` : ''}
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${s.target || ''}</div>
            ${s.link ? `<div style="font-size: 0.7rem; color: var(--accent-cyan); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px;">📥 ${s.link}</div>` : ''}
          </div>
          <div style="display: flex; gap: 0.35rem; align-items: center; flex-shrink: 0;">
            ${s.link ? `<button class="btn-del-mini" style="background: rgba(14, 165, 233, 0.15); color: var(--accent-cyan); border-color: rgba(14, 165, 233, 0.3);" onclick="copySoftwareLink('${s.link.replace(/'/g, "\\'")}', event)" title="Sao chép link tải">📋 Copy</button>` : ''}
            <button class="btn-del-mini" onclick="deleteAdminSoft(${idx})" title="Xóa phần mềm">🗑️ Xóa</button>
          </div>
        </div>
      `).join('');
    }
  }
}

function saveAdminDocument() {
  const sel = document.getElementById('adminDocTargetBrand');
  const brandId = sel ? sel.value : CURRENT_BRAND;
  const title = document.getElementById('adminDocTitle').value.trim();
  const category = document.getElementById('adminDocCategory').value;
  const desc = document.getElementById('adminDocDesc').value.trim();
  const type = document.getElementById('adminDocType').value;
  const scope = document.getElementById('adminDocScope') ? document.getElementById('adminDocScope').value : 'brand';
  const targetProductId = document.getElementById('adminDocTargetProduct')?.value;
  let link = document.getElementById('adminDocLink').value.trim();

  if (type === 'upload') {
    if (!_pickedDocDataUrl) {
      alert('Vui lòng chọn file tài liệu từ máy tính!');
      return;
    }
    link = _pickedDocDataUrl;
  } else {
    if (!link) {
      alert('Vui lòng nhập đường dẫn file hoặc link web!');
      return;
    }
  }

  if (!title) {
    alert('Vui lòng nhập tiêu đề tài liệu / catalog!');
    return;
  }

  if (!BRAND_DATA[brandId]) BRAND_DATA[brandId] = { products: [], software: [], history: [], brochures: [] };
  if (!BRAND_DATA[brandId].brochures) BRAND_DATA[brandId].brochures = [];

  // A. Thêm vào thư viện tài liệu chung (nếu chọn 'brand' hoặc 'both')
  if (scope === 'brand' || scope === 'both') {
    BRAND_DATA[brandId].brochures.push({
      title,
      category,
      desc,
      link,
      isLocal: type === 'upload' || link.startsWith('../') || link.endsWith('.pdf')
    });
  }

  // B. Gán trực tiếp vào dòng/Series sản phẩm cụ thể (nếu chọn 'product' hoặc 'both')
  let assignedProductName = '';
  if ((scope === 'product' || scope === 'both') && targetProductId) {
    const products = BRAND_DATA[brandId].products || [];
    const prod = products.find(p => String(p.id) === String(targetProductId));
    if (prod) {
      prod.brochure = link;
      assignedProductName = prod.serial || prod.name;
    }
  }

  renderAdminDocsAndSoftwareList();
  if (CURRENT_BRAND === brandId) renderBrandViews();

  // Reset form
  document.getElementById('adminDocTitle').value = '';
  document.getElementById('adminDocDesc').value = '';
  document.getElementById('adminDocLink').value = '';
  _pickedDocDataUrl = '';
  _pickedDocFileName = '';
  const nameDisplay = document.getElementById('adminDocFileNameDisplay');
  if (nameDisplay) nameDisplay.innerText = 'Click để chọn file từ máy tính';
  const fileInput = document.getElementById('adminDocFileInput');
  if (fileInput) fileInput.value = '';

  if (assignedProductName) {
    showToast(`🎉 Đã gán nút [Xem Catalog] cho dòng "${assignedProductName}" thành công!`);
  } else {
    showToast('🎉 Đã thêm tài liệu mới vào thư viện thành công!');
  }
}

function saveAdminSoftware() {
  const sel = document.getElementById('adminDocTargetBrand');
  const brandId = sel ? sel.value : CURRENT_BRAND;
  const name = document.getElementById('adminSoftName').value.trim();
  const version = document.getElementById('adminSoftVer').value.trim();
  const target = document.getElementById('adminSoftTarget').value.trim();
  const purpose = document.getElementById('adminSoftPurpose').value.trim();
  const note = document.getElementById('adminSoftNote').value.trim();
  const link = document.getElementById('adminSoftLink') ? document.getElementById('adminSoftLink').value.trim() : '';

  if (!name) {
    alert('Vui lòng nhập tên phần mềm!');
    return;
  }

  if (!BRAND_DATA[brandId]) BRAND_DATA[brandId] = { products: [], software: [], history: [], brochures: [] };
  if (!BRAND_DATA[brandId].software) BRAND_DATA[brandId].software = [];

  BRAND_DATA[brandId].software.push({
    name,
    version: version || 'Tiêu chuẩn',
    target: target || 'Toàn bộ thiết bị của hãng',
    purpose: purpose || 'Cấu hình và lập trình thiết bị',
    note: note || 'Tra cứu tài liệu đi kèm trước khi cài đặt.',
    link: link
  });

  renderAdminDocsAndSoftwareList();
  if (CURRENT_BRAND === brandId) renderBrandViews();

  // Reset form
  document.getElementById('adminSoftName').value = '';
  document.getElementById('adminSoftVer').value = '';
  document.getElementById('adminSoftTarget').value = '';
  document.getElementById('adminSoftPurpose').value = '';
  document.getElementById('adminSoftNote').value = '';
  if (document.getElementById('adminSoftLink')) document.getElementById('adminSoftLink').value = '';

  showToast('🎉 Đã thêm phần mềm kỹ thuật vào hệ thống thành công!');
}

function copySoftwareLink(link, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!link) {
    showToast('⚠️ Phần mềm này chưa được gán link tải!');
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('📋 Đã sao chép link tải phần mềm!');
    }).catch(() => {
      prompt('Sao chép link tải phần mềm:', link);
    });
  } else {
    prompt('Sao chép link tải phần mềm:', link);
  }
}
window.copySoftwareLink = copySoftwareLink;

function deleteAdminDoc(index) {
  const previewSel = document.getElementById('adminDocPreviewBrandSelect');
  const sel = document.getElementById('adminDocTargetBrand');
  const brandId = (previewSel && previewSel.value) ? previewSel.value : (sel ? sel.value : CURRENT_BRAND);
  if (BRAND_DATA[brandId] && BRAND_DATA[brandId].brochures) {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      BRAND_DATA[brandId].brochures.splice(index, 1);
      renderAdminDocsAndSoftwareList();
      if (CURRENT_BRAND === brandId) renderBrandViews();
      showToast('🗑️ Đã xóa tài liệu khỏi danh sách.');
    }
  }
}

function deleteAdminSoft(index) {
  const previewSel = document.getElementById('adminDocPreviewBrandSelect');
  const sel = document.getElementById('adminDocTargetBrand');
  const brandId = (previewSel && previewSel.value) ? previewSel.value : (sel ? sel.value : CURRENT_BRAND);
  if (BRAND_DATA[brandId] && BRAND_DATA[brandId].software) {
    if (confirm('Bạn có chắc chắn muốn xóa phần mềm này?')) {
      BRAND_DATA[brandId].software.splice(index, 1);
      renderAdminDocsAndSoftwareList();
      if (CURRENT_BRAND === brandId) renderBrandViews();
      showToast('🗑️ Đã xóa phần mềm khỏi danh sách.');
    }
  }
}



// =============================================================================
// PHÂN HỆ SƠ ĐỒ CÂY (TREE HIERARCHY), GIẢI MÃ MÃ HÀNG & DEEP-LINKING TRA CỨU
// =============================================================================

// 1. Render Sơ Đồ Cây & Bố Cục Danh Mục (Tab 1 Mặc Định)
function renderBrandTree(treeData) {
  const container = document.getElementById('treeCategoriesContainer');
  if (!container) return;

  const brandMeta = BRANDS.find(b => b.id === CURRENT_BRAND) || { name: CURRENT_BRAND, tagline: '' };
  const brandTitleEl = document.getElementById('treeBrandTitle');
  const brandSubEl = document.getElementById('treeBrandSub');
  if (brandTitleEl) brandTitleEl.innerHTML = `Bản Đồ Danh Mục: <span style="color: var(--brand-active, var(--accent-blue));">${brandMeta.name}</span>`;
  if (brandSubEl) brandSubEl.innerText = brandMeta.tagline || 'Bố cục hệ thống chuẩn hóa theo Catalog hãng • Có ảnh thực tế & quy chuẩn đọc mã';

  // Kiểm tra nếu có dữ liệu lưu tùy biến riêng trong LocalStorage
  const savedCustomTree = localStorage.getItem(`portal_custom_tree_${CURRENT_BRAND}`);
  let effectiveTree = treeData;
  if (savedCustomTree) {
    try {
      effectiveTree = JSON.parse(savedCustomTree);
    } catch (e) {
      console.warn('Lỗi đọc cây tùy biến:', e);
    }
  }

  // Nếu hãng này chưa được cấu hình treeData, tự động sinh khung từ danh sách sản phẩm hiện có
  if (!effectiveTree || !effectiveTree.length) {
    const curBrandData = BRAND_DATA[CURRENT_BRAND];
    const products = (curBrandData && curBrandData.products) ? curBrandData.products : [];
    if (!products.length) {
      container.innerHTML = `<div style="padding: 2.5rem; text-align: center; color: var(--text-dim);">Chưa có dữ liệu danh mục cho thương hiệu này. Bấm nút <strong>➕ Thêm Nhóm Danh Mục Mới</strong> bên trên để bắt đầu.</div>`;
      return;
    }
    // Tự động gom nhóm theo p.cat
    const catMap = {};
    products.forEach(p => {
      const c = p.cat ? p.cat.trim() : 'Tổng hợp';
      if (!catMap[c]) catMap[c] = [];
      catMap[c].push(p);
    });

    effectiveTree = Object.keys(catMap).map((catName, idx) => ({
      id: `gen-cat-${idx}`,
      name: catName,
      filterCat: catName,
      icon: '📁',
      tier: 'Tiêu chuẩn',
      application: `Phục vụ trong các ứng dụng điều khiển, giám sát và vận hành thiết bị ${catName}.`,
      description: `Nhóm sản phẩm ${catName} thuộc thương hiệu ${brandMeta.name}.`,
      series: catMap[catName].slice(0, 6).map((p, pidx) => ({
        id: `gen-series-${p.id || pidx}`,
        name: p.serial || `Dòng ${p.id}`,
        lookupKeyword: p.models && p.models.length ? p.models[0] : (p.serial || ''),
        tier: p.status || 'Thông dụng',
        application: p.subcat || '',
        status: p.status || 'Thông dụng',
        image: 'assets/images/mitsubishi/plc_fx5u.webp',
        commonModels: p.models || [],
        warnings: p.fake === 'Có' ? '⚠️ Thị trường có nguy cơ hàng FAKE / Bo mạch copy nhái.' : ''
      }))
    }));
  }

  // Lấy dữ liệu sản phẩm của hãng hiện tại để đếm số lượng SP tương ứng
  const curProducts = (BRAND_DATA[CURRENT_BRAND] && BRAND_DATA[CURRENT_BRAND].products) ? BRAND_DATA[CURRENT_BRAND].products : [];

  container.innerHTML = effectiveTree.map(cat => {
    // Đếm số lượng sản phẩm thực tế thuộc nhóm này
    const matchCount = curProducts.filter(p => {
      const pcat = (p.cat || '').toLowerCase().trim();
      const targetCat = (cat.filterCat || cat.name || '').toLowerCase().trim();
      return pcat === targetCat || pcat.includes(targetCat) || targetCat.includes(pcat);
    }).length;

    return `
      <div class="tree-cat-card" id="treeCatCard_${cat.id}">
        <!-- Category Header -->
        <div class="tree-cat-header">
          <div class="tree-cat-title-wrap">
            <span class="tree-cat-icon">${cat.icon || '📦'}</span>
            <div>
              <h3 class="tree-cat-name">${cat.name}</h3>
              <p class="tree-cat-desc">${cat.description || ''}</p>
              <div class="tree-cat-meta-row">
                <span class="cat-meta-pill pill-tier">🎯 Phân khúc: <strong>${cat.tier || 'Tiêu chuẩn'}</strong></span>
                <span class="cat-meta-pill pill-app">⚙️ Ứng dụng: ${cat.application || 'Công nghiệp & Tự động hóa'}</span>
              </div>
            </div>
          </div>
          <div class="tree-cat-actions">
            <!-- DEEP-LINK NÚT TRA CỨU TOÀN BỘ NHÓM -->
            <button type="button" class="btn-cat-lookup" onclick="quickLookupCategory('${escapeHtml(cat.filterCat || cat.name)}')" title="Xem bảng thông số và danh sách toàn bộ model thuộc nhóm này">
              <span>🔍</span> <span>Tra Cứu Toàn Bộ Nhóm (${matchCount || (cat.series ? cat.series.length : 0)} SP)</span>
            </button>
            <button type="button" class="btn-secondary btn-sm" onclick="openEditCategoryModal('${cat.id}')" title="Sửa thông tin nhóm, phân khúc, ứng dụng">
              <span>✏️</span> <span>Sửa Nhóm</span>
            </button>
            <button type="button" class="btn-secondary btn-sm" onclick="openAddSeriesModal('${cat.id}')" title="Thêm dòng sản phẩm (Series) con vào nhóm này">
              <span>➕</span> <span>Thêm Series</span>
            </button>
          </div>
        </div>

        <!-- Series Cards Grid -->
        <div class="tree-series-grid">
          ${(cat.series || []).map(s => {
            // Naming breakdown visualization
            let namingHtml = '';
            if (s.namingRule && s.namingRule.breakdown && s.namingRule.breakdown.length) {
              namingHtml = `
                <div class="series-naming-box">
                  <div class="naming-box-title">
                    <span>📐 Quy Chuẩn Đọc Mã:</span>
                    <span class="naming-example-tag">${s.namingRule.example || ''}</span>
                  </div>
                  <div class="naming-pills-flow">
                    ${s.namingRule.breakdown.map(b => `
                      <div class="naming-pill-item" title="${escapeHtml(b.desc)}">
                        <span class="pill-part">${b.part}</span>
                        <span class="pill-label">${b.title}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }

            // Common models tags
            let modelsHtml = '';
            if (s.commonModels && s.commonModels.length) {
              modelsHtml = `
                <div style="font-size: 0.74rem; color: var(--text-dim); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                  <span style="font-weight: 700;">Model thông dụng:</span>
                  ${s.commonModels.slice(0, 4).map(m => `<span class="code-tag" style="font-size: 0.72rem; padding: 1px 5px;">${m}</span>`).join(' ')}
                  ${s.commonModels.length > 4 ? `<span style="font-size: 0.7rem; color: var(--text-dim);">+${s.commonModels.length - 4} mã</span>` : ''}
                </div>
              `;
            }

            return `
              <div class="tree-series-card" id="treeSeriesCard_${s.id}">
                <!-- Thumbnail Image with Fallback -->
                <div class="series-media-box">
                  <img src="${s.image || 'assets/images/mitsubishi/plc_fx5u.webp'}" alt="${s.name}" onerror="this.onerror=null; this.src='assets/images/mitsubishi/plc_fx5u.webp';" loading="lazy" />
                  <div class="series-status-overlay">
                    ${getStatusBadge(s.status || 'Thông dụng')}
                  </div>
                </div>

                <!-- Content -->
                <div class="series-content-box">
                  <div class="series-title-row">
                    <h4 class="series-title">${s.name}</h4>
                  </div>
                  <span class="series-tier-badge">🎯 ${s.tier || 'Tiêu chuẩn'}</span>
                  <div class="series-app-desc"><strong>Ứng dụng:</strong> ${s.application || ''}</div>

                  ${modelsHtml}
                  ${namingHtml}

                  ${s.warnings ? `<div class="series-warning-card">${formatMarkdownBold(s.warnings)}</div>` : ''}

                  <!-- Footer Actions: Deep-Link Tra cứu & Edit -->
                  <div class="series-footer-actions">
                    <!-- DEEP-LINK NÚT TRA CỨU CHI TIẾT SERIES -->
                    <button type="button" class="btn-series-lookup" onclick="quickLookupSeries('${escapeHtml(cat.filterCat || cat.name)}', '${escapeHtml(s.lookupKeyword || s.name)}')">
                      <span>🔍</span> <span>Tra Cứu Chi Tiết Dòng Này ➔</span>
                    </button>
                    <button type="button" class="btn-secondary btn-sm" onclick="openEditSeriesModal('${cat.id}', '${s.id}')" title="Chỉnh sửa phân khúc, quy chuẩn đọc mã, ảnh">
                      <span>✏️</span>
                    </button>
                    <button type="button" class="btn-del-mini" onclick="deleteSeriesFromTree('${cat.id}', '${s.id}')" title="Xóa dòng này khỏi cây">
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// 2. TÍNH NĂNG DEEP-LINKING 1-CLICK: Tra cứu Toàn Bộ Nhóm
function quickLookupCategory(catName) {
  if (!catName) return;

  // 1. Chuyển tab sang tab Tra Cứu Danh Mục
  const subTabBtns = document.querySelectorAll('.sub-tab-bar .sub-tab-btn');
  subTabBtns.forEach(b => b.classList.remove('active'));
  const catalogBtn = document.querySelector('.sub-tab-bar .sub-tab-btn[data-view="catalog"]');
  if (catalogBtn) catalogBtn.classList.add('active');

  // Ẩn tất cả section, hiển thị view-catalog
  document.querySelectorAll('#brandViewsWrapper .view-section').forEach(sec => sec.classList.add('hidden'));
  const catalogSec = document.getElementById('view-catalog');
  if (catalogSec) catalogSec.classList.remove('hidden');
  document.body.classList.add('view-catalog-active');

  // 2. Điền bộ lọc Chủng Loại
  const filterCat = document.getElementById('filterCategory');
  if (filterCat) {
    let matchedOption = '';
    for (const opt of filterCat.options) {
      if (opt.value.toLowerCase() === catName.toLowerCase() || opt.value.toLowerCase().includes(catName.toLowerCase()) || catName.toLowerCase().includes(opt.value.toLowerCase())) {
        matchedOption = opt.value;
        break;
      }
    }
    if (matchedOption) {
      filterCat.value = matchedOption;
    } else {
      filterCat.value = 'all';
    }
  }

  // 3. Xóa từ khóa tìm kiếm để hiện trọn vẹn nhóm
  const filterKw = document.getElementById('filterKeyword');
  if (filterKw) filterKw.value = '';

  // 4. Kích hoạt lọc bảng
  applyCatalogFilters();

  // 5. Cuộn mượt đến bảng
  if (catalogSec) {
    catalogSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`📋 Đang lọc danh mục: ${catName}`);
}

// 3. TÍNH NĂNG DEEP-LINKING 1-CLICK: Tra cứu Chi Tiết Dòng Series
function quickLookupSeries(catName, seriesKeyword) {
  // 1. Chuyển tab sang tab Tra Cứu Danh Mục
  const subTabBtns = document.querySelectorAll('.sub-tab-bar .sub-tab-btn');
  subTabBtns.forEach(b => b.classList.remove('active'));
  const catalogBtn = document.querySelector('.sub-tab-bar .sub-tab-btn[data-view="catalog"]');
  if (catalogBtn) catalogBtn.classList.add('active');

  // Ẩn tất cả section, hiển thị view-catalog
  document.querySelectorAll('#brandViewsWrapper .view-section').forEach(sec => sec.classList.add('hidden'));
  const catalogSec = document.getElementById('view-catalog');
  if (catalogSec) catalogSec.classList.remove('hidden');

  // 2. Điền bộ lọc Chủng Loại
  const filterCat = document.getElementById('filterCategory');
  if (filterCat && catName) {
    let matchedOption = '';
    for (const opt of filterCat.options) {
      if (opt.value.toLowerCase() === catName.toLowerCase() || opt.value.toLowerCase().includes(catName.toLowerCase()) || catName.toLowerCase().includes(opt.value.toLowerCase())) {
        matchedOption = opt.value;
        break;
      }
    }
    if (matchedOption) filterCat.value = matchedOption;
    else filterCat.value = 'all';
  }

  // 3. Điền từ khóa tìm kiếm đúng mã Series (ví dụ: FX5U, FR-E800, GS2107...)
  const filterKw = document.getElementById('filterKeyword');
  if (filterKw) {
    filterKw.value = seriesKeyword;
  }

  // 4. Kích hoạt lọc bảng
  applyCatalogFilters();

  // 5. Cuộn mượt đến bảng
  if (catalogSec) {
    catalogSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showToast(`🔍 Đang tra cứu chi tiết dòng: ${seriesKeyword}`);
}

// 4. TRÌNH GIẢI MÃ MÃ HÀNG TỨC THÌ (INSTANT MODEL DECODER)
function renderDecoderSamples(brandId) {
  const container = document.getElementById('treeDecoderSamples');
  if (!container) return;

  const sampleMap = {
    'mitsubishi': ['FX5U-32MT/ES', 'FR-E820-0.75K-1', 'GS2107-WTBD-N', 'MR-J4-40B', 'HG-KR43B', 'NF125-CV 3P 100A', 'S-T21 AC220V'],
    'qlight': ['ST56EL-WS-3-24-RAG-LB18', 'ST45L-3-24-RAG', 'EST56L-3-24-RAG', 'S100D-24-R', 'SWTE-3-24-RAG', 'SEN15-24-WS', 'QMCL-200-24', 'SNES-24-R'],
    'mitutoyo': ['500-196-30', '293-240-30', '2046S', '513-404-10E', '192-613-10', '547-401'],
    'omron': ['CP1E-N40DR-A', 'E2E-X3D1-N', 'E3Z-T61', 'MY2N-GS AC220', 'E5CC-RX2ASM-800'],
    'autonics': ['TK4S-14RN', 'PR18-8DN', 'BEN5M-MFR', 'E50S8-1000-3-T-24', 'CT6S-1P4'],
    'brother': ['PT-E850TKW', 'PT-E560BT', 'PT-E310BT', 'PT-E110VP', 'PT-P950W', 'QL-820NWB', 'TD-4420DN', 'TZe-231', 'HSe-231'],
    'proface': ['PFXGP4301TAD', 'PFXGP4501TAD', 'PFXGP4501TAA', 'PFXGP4401TAD', 'PFXET6400WAD', 'PFXST6400WAD', 'PFXSTM6400WAD', 'PFXSP5500TPD']
  };

  const samples = sampleMap[brandId] || ['ST56EL-WS-3-24-RAG-LB18', 'FX5U-32MT/ES', '500-196-30'];
  container.innerHTML = `
    <span class="sample-label">Mã thử nhanh:</span>
    ${samples.map(code => `<button type="button" class="sample-chip" onclick="quickFillDecoder('${code}')">${code}</button>`).join('')}
  `;
}

function initTreeDecoderListeners() {
  const input = document.getElementById('modelDecoderInput');
  const btn = document.getElementById('btnExecuteDecode');
  const clearBtn = document.getElementById('modelDecoderClearBtn');

  if (input) {
    input.addEventListener('input', () => {
      if (clearBtn) clearBtn.style.display = input.value.trim() ? 'block' : 'none';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleExecuteDecode(input.value);
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      if (input) handleExecuteDecode(input.value);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        clearBtn.style.display = 'none';
        const resBox = document.getElementById('modelDecoderResultBox');
        if (resBox) resBox.classList.add('hidden');
      }
    });
  }
}

function quickFillDecoder(val) {
  const input = document.getElementById('modelDecoderInput');
  const clearBtn = document.getElementById('modelDecoderClearBtn');
  if (input) {
    input.value = val;
    if (clearBtn) clearBtn.style.display = 'block';
    handleExecuteDecode(val);
  }
}

// Bộ máy phân tích bóc tách quy chuẩn đọc mã (100% Khớp Theo Catalog & User's Manual Chính Thức)
function handleExecuteDecode(rawInput) {
  const code = (rawInput || '').trim();
  const resBox = document.getElementById('modelDecoderResultBox');
  if (!resBox) return;

  if (!code) {
    resBox.classList.add('hidden');
    return;
  }

  const upper = code.toUpperCase();
  let decoded = null;

  // 1. PLC FX5U / FX5UC (Chuẩn JY997D55301 - MELSEC iQ-F Hardware Manual)
  if (upper.startsWith('FX5U') || upper.startsWith('FX5UC')) {
    const m = upper.match(/^(FX5U[C]?)[-_]?(\d+)(M)([TR])[\/]?([A-Z0-9\-_]+)?/);
    if (m) {
      const family = m[1];
      const io = m[2];
      const unitType = m[3];
      const outType = m[4];
      const suffix = m[5] || 'ES';
      decoded = {
        model: code,
        category: 'PLC',
        standardDoc: 'MELSEC iQ-F FX5U User\'s Manual (Hardware) - JY997D55301',
        familyDesc: 'Dòng CPU vi điều khiển Compact PLC MELSEC iQ-F thế hệ mới (tích hợp Ethernet, 2 kênh Analog vào, 1 kênh Analog ra)',
        chunks: [
          { part: family, title: 'Dòng CPU (Series)', desc: 'MELSEC iQ-F Series - Dòng CPU hiệu năng cao thế hệ mới, bus truyền thông tốc độ cao gấp 150 lần FX3U.' },
          { part: io, title: 'Tổng Điểm I/O (I/O Points)', desc: `Tổng cộng ${io} điểm I/O tích hợp sẵn (${parseInt(io)/2} Input / ${parseInt(io)/2} Output).` },
          { part: unitType, title: 'Loại Khối (Unit Type)', desc: 'M = Main Unit (Khối CPU cơ bản tích hợp vi xử lý và bộ nguồn).' },
          { part: outType, title: 'Kiểu Ngõ Ra (Output Type)', desc: outType === 'T' ? 'T = Transistor Output (độ bền vĩnh cửu, phát xung tốc độ cao 200kHz điều khiển vị trí).' : 'R = Relay Output (tiếp điểm cơ khí khô, chịu tải dòng xoay chiều lên đến 2A/điểm).' },
          { part: `/${suffix}`, title: 'Nguồn & Logic Ngõ Vào/Ra', desc: suffix.includes('ESS') ? 'Nguồn AC 100-240V, Ngõ vào DC 24V Sink/Source, Ngõ ra Transistor Source (PNP).' : suffix.includes('DS') ? 'Nguồn điện một chiều DC 24V, Ngõ vào Sink/Source, Ngõ ra Transistor Sink (NPN).' : 'Nguồn điện xoay chiều AC 100-240V, Ngõ vào DC 24V Sink/Source, Ngõ ra Transistor Sink (NPN) hoặc Relay.' }
        ]
      };
    }
  }

  // 2. PLC FX3U / FX3G / FX3S (Chuẩn JY997D16501 - MELSEC-F Hardware Manual)
  if (!decoded && (upper.startsWith('FX3U') || upper.startsWith('FX3G') || upper.startsWith('FX3S'))) {
    const m = upper.match(/^(FX3[UGS])[-_]?(\d+)(M)([TR])[\/]?([A-Z0-9\-_]+)?/);
    if (m) {
      const family = m[1];
      const io = m[2];
      const unitType = m[3];
      const outType = m[4];
      const suffix = m[5] || 'ES-A';
      decoded = {
        model: code,
        category: 'PLC',
        standardDoc: 'MELSEC-F FX3U Series Hardware Manual - JY997D16501',
        familyDesc: 'Họ vi điều khiển Compact PLC MELSEC-F thế hệ 3 kinh điển',
        chunks: [
          { part: family, title: 'Dòng CPU (Series)', desc: 'MELSEC-F FX3 Series kinh điển, cổng nạp chuẩn RS-422 tròn Mini-DIN.' },
          { part: io, title: 'Tổng Điểm I/O', desc: `${io} điểm I/O tích hợp sẵn trên thân máy (${parseInt(io)/2} In / ${parseInt(io)/2} Out).` },
          { part: unitType, title: 'Khối Cơ Bản (Unit Type)', desc: 'M = Main Unit (Khối CPU chính tích hợp nguồn và I/O).' },
          { part: outType, title: 'Kiểu Ngõ Ra (Output)', desc: outType === 'T' ? 'T = Transistor Output NPN' : 'R = Relay Output (tiếp điểm rơ le khô)' },
          { part: `/${suffix}`, title: 'Nguồn & Chuẩn Quốc Tế', desc: suffix.includes('DS') ? 'Nguồn cấp DC 24V' : 'E = Nguồn AC 100-240V, S = Ngõ vào Sink/Source, -A = Bản chứng nhận tiêu chuẩn quốc tế CE/UL.' }
        ]
      };
    }
  }

  // 3. PLC Q-Series (Chuẩn SH-080483ENG - QCPU Hardware Manual)
  if (!decoded && upper.startsWith('Q0')) {
    const m = upper.match(/^Q(\d+)(UD[V]?)(CPU)?/);
    if (m) {
      const memCode = m[1];
      const typeCode = m[2];
      decoded = {
        model: code,
        category: 'PLC',
        standardDoc: 'QCPU User\'s Manual (Hardware Design and Maintenance) - SH-080483ENG',
        familyDesc: 'Hệ thống điều khiển tự động hóa quy mô lớn MELSEC-Q Series dạng Rack cắm Module',
        chunks: [
          { part: 'Q', title: 'Họ MELSEC-Q', desc: 'Dòng PLC công nghiệp dạng thanh Rack cắm Module ghép linh hoạt.' },
          { part: memCode, title: 'Dung Lượng Bộ Nhớ (Memory)', desc: `${memCode} = ${parseInt(memCode)*10}k bước lệnh chương trình (03 = 30k, 04 = 40k, 06 = 60k, 13 = 130k, 26 = 260k bước).` },
          { part: typeCode, title: 'Thế Hệ High-Speed CPU', desc: typeCode.includes('V') ? 'UDV = Universal High-Speed Model (chu kỳ lệnh 1.9ns, tích hợp sẵn cổng Ethernet 100M & mini-USB).' : 'UD = Universal Model QCPU tốc độ cao.' },
          { part: 'CPU', title: 'Module Xử Lý Trung Tâm', desc: 'Module CPU độc lập gắn trên thanh Base Unit (hỗ trợ tối đa 4 CPU chạy song song).' }
        ]
      };
    }
  }

  // 4. Biến tần FR-E800 (Chuẩn IB-0600868ENG - FREQROL-E800 Manual)
  if (!decoded && upper.startsWith('FR-E8')) {
    const m = upper.match(/^FR[-_]?E8([241])([0SW])[-_]?([0-9\.]+K|\d{4})[-_]?([A-Z0-9\-_]+)?/);
    if (m) {
      const voltCode = m[1];
      const phaseCode = m[2];
      const capCode = m[3];
      const suffix = m[4] || '1';
      decoded = {
        model: code,
        category: 'Biến tần',
        standardDoc: 'FREQROL-E800 Instruction Manual (Detailed) - IB-0600868ENG',
        familyDesc: 'FREQROL-E800 Series - Biến tần đa năng tải trung thông minh thế hệ mới thay thế FR-E700',
        chunks: [
          { part: 'FR-E8', title: 'Dòng Biến Tần (Series)', desc: 'FREQROL-E800 thế hệ mới đa năng nhỏ gọn.' },
          { part: voltCode, title: 'Cấp Điện Áp (Voltage Class)', desc: voltCode === '2' ? '2 = Cấp điện áp 200V (200-240V)' : voltCode === '4' ? '4 = Cấp điện áp 400V (380-480V)' : '1 = Cấp điện áp 100V' },
          { part: phaseCode, title: 'Pha Nguồn Vào (Input Phase)', desc: phaseCode === '0' ? '0 = Nguồn vào 3 pha (Three-phase)' : phaseCode === 'S' ? 'S = Nguồn vào 1 pha 200V (Single-phase 200V)' : 'W = Nguồn vào 1 pha 100V' },
          { part: capCode, title: 'Công Suất Định Mức (Capacity)', desc: capCode.includes('K') ? `${capCode} (Công suất motor tương đương ${(parseFloat(capCode)*1.34).toFixed(1)} HP).` : `${capCode} = 10 lần dòng định mức ND (${(parseInt(capCode)/10).toFixed(1)}A).` },
          { part: `-${suffix}`, title: 'Giao Tiếp & Tiêu Chuẩn', desc: suffix === '1' ? '-1 = Bản tiêu chuẩn cổng truyền thông RS-485 Modbus RTU.' : suffix.includes('E') ? '-E = Bản tích hợp 2 cổng Ethernet kép (CC-Link IE TSN / Modbus TCP / EtherNet/IP).' : suffix.includes('SCE') ? '-SCE = Bản an toàn mạng Safety SIL3/PLe.' : suffix }
        ]
      };
    }
  }

  // 5. Biến tần FR-D700 (Chuẩn IB-0600403ENG - FREQROL-D700 Manual)
  if (!decoded && (upper.startsWith('FR-D7') || upper.startsWith('FR-D8'))) {
    const m = upper.match(/^FR[-_]?D[78]([241])([0S])[-_]?([0-9\.]+K|\d{3,4})[-_]?([A-Z0-9\-_]+)?/);
    if (m) {
      const voltCode = m[1];
      const phaseCode = m[2];
      const capCode = m[3];
      const suffix = m[4] || 'STD';
      decoded = {
        model: code,
        category: 'Biến tần',
        standardDoc: 'FREQROL-D700 Instruction Manual (Detailed) - IB-0600403ENG',
        familyDesc: 'FREQROL-D Series - Biến tần tải nhẹ cỡ nhỏ kinh tế bán chạy số 1',
        chunks: [
          { part: upper.slice(0, 6), title: 'Dòng Biến Tần', desc: 'FREQROL-D Series vi biến tần kích thước cực nhỏ.' },
          { part: voltCode, title: 'Cấp Điện Áp', desc: voltCode === '4' ? '4 = 3 Pha 380-480V AC' : voltCode === '2' ? '2 = 3 Pha 200-240V AC' : '1 = 1 Pha 100V' },
          { part: phaseCode, title: 'Pha Nguồn Vào', desc: phaseCode === '0' ? '0 = 3 Pha' : 'S = 1 Pha 200V' },
          { part: capCode, title: 'Công Suất Motor', desc: `${capCode} (Công suất động cơ ${(parseFloat(capCode)*1.34).toFixed(1)} HP).` },
          { part: suffix, title: 'Thị Trường / Phiên Bản', desc: suffix === 'CHT' ? 'Bản xuất thị trường Châu Á/Trung Quốc' : suffix === 'EC' ? 'Bản thị trường Châu Âu' : suffix.includes('60') ? 'Bản phủ keo chống ẩm bo mạch (-60)' : 'Bản tiêu chuẩn' }
        ]
      };
    }
  }

  // 6. HMI GS2000 (Chuẩn JY997D52901 - GOT SIMPLE Hardware Manual)
  if (!decoded && upper.startsWith('GS21')) {
    const m = upper.match(/^GS21(\d{2})[-_]?(W)(T)(B)(D)[-_]?([A-Z0-9]+)?/);
    if (m) {
      const sizeCode = m[1];
      const revCode = m[6] || 'N';
      decoded = {
        model: code,
        category: 'HMI',
        standardDoc: 'GOT SIMPLE Series User\'s Manual (Hardware) - JY997D52901',
        familyDesc: 'GOT SIMPLE Series - Màn hình cảm ứng công nghiệp kinh tế (DACO nhập trực tiếp giá cực tốt)',
        chunks: [
          { part: 'GS21', title: 'Họ Màn Hình (Series)', desc: 'GOT SIMPLE Series thế hệ 21 kinh tế.' },
          { part: sizeCode, title: 'Kích Thước Màn Hình', desc: sizeCode === '07' ? '07 = 7.0 inch Widescreen WVGA (800x480 pixels)' : '10 = 10.1 inch Widescreen WSVGA (1024x600 pixels)' },
          { part: '-W', title: 'Tỉ Lệ Khung Hình', desc: 'W = Widescreen (màn hình góc rộng 16:9).' },
          { part: 'T', title: 'Công Nghệ Màn Hình', desc: 'T = TFT color LCD (hiển thị 65,536 màu sắc nét, đèn nền LED tuổi thọ 50,000 giờ).' },
          { part: 'B', title: 'Màu Viền Mặt Trước', desc: 'B = Khung viền màu đen công nghiệp (Black).' },
          { part: 'D', title: 'Nguồn Điện Cấp', desc: 'D = Nguồn điện một chiều 24V DC (A = Nguồn điện xoay chiều 100-240V AC).' },
          { part: `-${revCode}`, title: 'Bản Cải Tiến (New Release)', desc: 'Phiên bản phần cứng nâng cấp mới nhất, thay thế dòng cũ.' }
        ]
      };
    }
  }

  // 7. HMI GT25 / GT27 (Chuẩn SH-081194ENG - GOT2000 Hardware Manual)
  if (!decoded && (upper.startsWith('GT25') || upper.startsWith('GT27'))) {
    const m = upper.match(/^GT(2[57])(\d{2})[-_]?([VSX])(T)([BW])([AD])/);
    if (m) {
      const groupCode = m[1];
      const sizeCode = m[2];
      const resCode = m[3];
      const dispCode = m[4];
      const bezelCode = m[5];
      const pwrCode = m[6];
      decoded = {
        model: code,
        category: 'HMI',
        standardDoc: 'GOT2000 Series User\'s Manual (Hardware) - SH-081194ENG',
        familyDesc: `GOT2000 Series - Màn hình HMI ${groupCode === '27' ? 'Flagship cao cấp cảm ứng đa điểm' : 'tiêu chuẩn Standard (thay thế GT23)'}`,
        chunks: [
          { part: `GT${groupCode}`, title: 'Phân Khúc Model', desc: groupCode === '27' ? 'GT27 = Dòng cao cấp nhất, hỗ trợ cử chỉ đa điểm, cổng HDMI/Video.' : 'GT25 = Dòng tiêu chuẩn hiệu năng cao Standard Model kế thừa GT23.' },
          { part: sizeCode, title: 'Kích Thước Màn Hình', desc: sizeCode === '08' ? '08 = 8.4 inch' : sizeCode === '10' ? '10 = 10.4 inch' : sizeCode === '12' ? '12 = 12.1 inch' : sizeCode === '05' ? '05 = 5.7 inch' : '15 = 15.0 inch' },
          { part: resCode, title: 'Độ Phân Giải', desc: resCode === 'V' ? 'V = VGA (640x480 pixels)' : resCode === 'S' ? 'S = SVGA (800x600 pixels)' : 'X = XGA (1024x768 pixels)' },
          { part: dispCode, title: 'Hiển Thị Màu', desc: 'T = TFT color LCD 65k màu.' },
          { part: bezelCode, title: 'Màu Khung', desc: bezelCode === 'B' ? 'B = Khung đen (Black)' : 'W = Khung trắng phòng sạch (White)' },
          { part: pwrCode, title: 'Nguồn Điện Cấp', desc: pwrCode === 'A' ? 'A = Nguồn xoay chiều AC 100-240V' : 'D = Nguồn một chiều DC 24V' }
        ]
      };
    }
  }

  // 8. AC Servo Driver MR-J4 (Chuẩn SH-030106ENG - MELSERVO-J4 Manual)
  if (!decoded && upper.startsWith('MR-J4')) {
    const m = upper.match(/^MR[-_]?J4[-_]?(\d+)([A-Z0-9]+)?/);
    if (m) {
      const capVal = m[1];
      const iface = m[2] || 'A';
      decoded = {
        model: code,
        category: 'Servo',
        standardDoc: 'MELSERVO-J4 Servo Amplifier Instruction Manual - SH-030106ENG',
        familyDesc: 'MELSERVO-J4 Series - Bộ khuếch đại AC Servo thế hệ 4 chủ lực đa năng',
        chunks: [
          { part: 'MR-J4-', title: 'Dòng Servo Driver', desc: 'MELSERVO-J4 Series hiệu năng cao, tần số đáp ứng 2.5kHz.' },
          { part: capVal, title: 'Công Suất Định Mức Driver', desc: `${capVal} = ${parseInt(capVal) >= 100 ? parseInt(capVal)/100 + ' kW' : parseInt(capVal)*10 + ' Watt'} (10 = 100W, 20 = 200W, 40 = 400W, 70 = 750W, 100 = 1kW, 200 = 2kW, 350 = 3.5kW).` },
          { part: iface, title: 'Phương Thức Giao Tiếp Điều Khiển', desc: iface === 'B' ? 'B = Điều khiển mạng cáp quang tốc độ cao SSCNET III/H (0.222ms).' : iface === 'A' ? 'A = Điều khiển Xung / Điện áp Analog (Pulse train / Analog).' : iface === 'GF' ? 'GF = Mạng CC-Link IE Field.' : iface }
        ]
      };
    }
  }

  // 9. AC Servo Motor HG-KR (Chuẩn SH-030113ENG - Rotary Servo Motor Manual)
  if (!decoded && (upper.startsWith('HG-KR') || upper.startsWith('HG-SR') || upper.startsWith('HG-KN'))) {
    const m = upper.match(/^HG[-_]?([A-Z]+)(\d)(\d)([B]?)/);
    if (m) {
      const seriesType = m[1];
      const capDigit = m[2];
      const speedDigit = m[3];
      const brakeCode = m[4];
      const capWatt = capDigit === '0' ? '50W' : capDigit === '1' ? '100W' : capDigit === '2' ? '200W' : capDigit === '4' ? '400W' : capDigit === '7' ? '750W' : `${capDigit}00W`;
      decoded = {
        model: code,
        category: 'Servo',
        standardDoc: 'HG-KR/HG-SR Rotary Servo Motor Instruction Manual - SH-030113ENG',
        familyDesc: `Động cơ AC Servo ${seriesType === 'KR' ? 'quán tính thấp (Low Inertia) gia tốc cực nhanh' : 'quán tính trung bình (Medium Inertia)'}`,
        chunks: [
          { part: `HG-${seriesType}`, title: 'Dòng Động Cơ (Series)', desc: seriesType === 'KR' ? 'HG-KR = Dòng động cơ quán tính thấp, góc xoay siêu mượt 22-bit.' : 'HG-SR = Dòng động cơ quán tính trung bình.' },
          { part: capDigit, title: 'Công Suất Định Mức', desc: `${capDigit} = ${capWatt} (0 = 50W, 1 = 100W, 2 = 200W, 4 = 400W, 7 = 750W).` },
          { part: speedDigit, title: 'Tốc Độ Định Mức (Rated Speed)', desc: `${speedDigit} = Tốc độ quay định mức 3000 vòng/phút (r/min) (tốc độ tối đa lên đến 6000 r/min).` },
          { part: brakeCode || 'Không phanh', title: 'Tùy Chọn Phanh Giữ (Brake)', desc: brakeCode === 'B' ? 'B = Tích hợp phanh điện từ hãm giữ trục khi mất nguồn.' : 'Trục trơn tiêu chuẩn không phanh.' }
        ]
      };
    }
  }

  // 10. Aptomat MCCB NF Series (Chuẩn Catalog Y-0694 Low Voltage Circuit Breakers)
  if (!decoded && (upper.startsWith('NF') || upper.startsWith('BH-D') || upper.startsWith('NV'))) {
    const m = upper.match(/^(NF|NV|BH-D)(\d+)?[-_]?([A-Z]+)?\s*(\d+P)?\s*(\d+A)?/);
    if (m) {
      const typeCode = m[1];
      const frameCode = m[2] || '125';
      const perfCode = m[3] || 'CV';
      const poleCode = m[4] || '3P';
      const ampCode = m[5] || '100A';
      decoded = {
        model: code,
        category: 'Đóng cắt',
        standardDoc: 'Mitsubishi Low Voltage Circuit Breakers Catalog - Y-0694',
        familyDesc: 'Thiết bị đóng cắt hạ thế chính hãng Mitsubishi Electric (100% không có hàng FAKE)',
        chunks: [
          { part: typeCode, title: 'Dòng Thiết Bị (Device Line)', desc: typeCode === 'NF' ? 'NF = No-Fuse Breaker (Aptomat khối MCCB chống quá tải & ngắn mạch).' : typeCode === 'NV' ? 'NV = ELCB chống dòng rò bảo vệ người.' : 'BH-D = MCB tép bảo vệ nhánh.' },
          { part: frameCode, title: 'Khung Dòng Điện (AF - Ampere Frame)', desc: `${frameCode} AF = Kích thước khung dòng tối đa ${frameCode}A (các cỡ: 30AF, 63AF, 125AF, 250AF, 400AF...).` },
          { part: `-${perfCode}`, title: 'Phân Khúc Hiệu Năng (Class Type)', desc: perfCode === 'CV' ? '-CV = Dòng kinh tế tiêu chuẩn (Economy Class, dòng cắt Icu 30kA).' : perfCode === 'SV' ? '-SV = Dòng tiêu chuẩn công nghiệp (Standard).' : '-HV = Dòng cắt ngắn mạch cao (High-fault).' },
          { part: poleCode, title: 'Số Cực Pha (Poles)', desc: `${poleCode} = ${poleCode.replace('P', ' Cực')} bảo vệ lưới điện (${poleCode.includes('3') ? '3 Pha' : '1 Pha'}).` },
          { part: ampCode, title: 'Dòng Cắt Định Mức (In / AT)', desc: `Dòng định mức bảo vệ tác động nhiệt-từ: ${ampCode}.` }
        ]
      };
    }
  }

  // 11. Khởi Động Từ Contactor S-T (Chuẩn Catalog L-02035 MS-T Series)
  if (!decoded && upper.startsWith('S-T')) {
    const m = upper.match(/^S[-_]?T(\d+)\s*([A-Z0-9]+)?/);
    if (m) {
      const frameVal = m[1];
      const coilVal = m[2] || 'AC220V';
      decoded = {
        model: code,
        category: 'Đóng cắt',
        standardDoc: 'Mitsubishi Magnetic Motor Starters MS-T Series Catalog - L-02035',
        familyDesc: 'Khởi động từ (Magnetic Contactor) nhỏ gọn thế hệ mới S-T Series',
        chunks: [
          { part: 'S-T', title: 'Họ Contactor', desc: 'Dòng khởi động từ nhỏ gọn thế hệ mới thay thế dòng S-N cũ.' },
          { part: frameVal, title: 'Cỡ Khung Định Mức (Frame Size)', desc: `${frameVal} = Cỡ khung dòng làm việc định mức ${frameVal}A (tải AC-3 động cơ ở 380V).` },
          { part: coilVal, title: 'Điện Áp Định Mức Cuộn Hút', desc: `Điện áp cuộn hút kích hoạt tiếp điểm: ${coilVal} 50/60Hz.` }
        ]
      };
    }
  }

  // ===== QLIGHT OFFICIAL ORDERING SPECIFICATION DECODERS =====
  // 12. Đèn Tháp Tín Hiệu Qlight (ST56EL, ST45L, ST80EL, EST56L, QTG, QTC)
  if (!decoded && (upper.startsWith('ST') || upper.startsWith('EST') || upper.startsWith('QTG') || upper.startsWith('QTC'))) {
    const m = upper.match(/^(ST[458][056][A-Z]*|EST56[A-Z]*|QT[GC]\d+[A-Z]*)(?:[-_](WS|BZ|WA|WM|IOL))?(?:[-_](\d))?(?:[-_](\d{2,3}))?(?:[-_]([A-Z]+))?(?:[-_]([A-Z0-9]+))?/i);
    if (m) {
      const seriesPart = m[1];
      const sounderPart = m[2];
      const tierPart = m[3] || '3';
      const voltPart = m[4] || '24';
      const colorPart = m[5] || 'RAG';
      const mountPart = m[6];
      
      const chunks = [
        { part: seriesPart, title: 'Dòng Đèn Tháp (Series)', desc: seriesPart.includes('56') ? 'Đèn tháp LED Ø56mm module tháo lắp xoay khóa (dòng bán chạy nhất).' : seriesPart.includes('45') ? 'Đèn tháp LED Ø45mm siêu nhỏ gọn cho máy tự động hóa.' : seriesPart.includes('80') ? 'Đèn tháp LED Ø80mm đường kính lớn độ sáng cực cao cho nhà xưởng lớn.' : 'Đèn tháp tín hiệu chuẩn công nghiệp.' }
      ];
      if (sounderPart) {
        chunks.push({ part: `-${sounderPart}`, title: 'Tùy Chọn Còi Báo', desc: sounderPart === 'WS' ? 'WS = Còi báo động đa âm 5 kiểu báo động (90dB).' : sounderPart === 'BZ' ? 'BZ = Còi buzzer đơn âm ngắt quãng (85dB).' : `${sounderPart} = Tùy chọn âm thanh cảnh báo.` });
      }
      chunks.push({ part: `-${tierPart}`, title: 'Số Tầng Màu (Tiers)', desc: `${tierPart} tầng hiển thị (${tierPart} Tier). Tùy chọn từ 1 đến 5 tầng.` });
      chunks.push({ part: `-${voltPart}`, title: 'Điện Áp Hoạt Động (Voltage)', desc: voltPart === '24' ? '24V DC (Nguồn an toàn tiêu chuẩn tủ điện)' : voltPart === '220' ? '220V AC (Điện lưới xoay chiều)' : voltPart === '12' ? '12V DC' : voltPart === '110' ? '110V AC' : `${voltPart}V` });
      chunks.push({ part: `-${colorPart}`, title: 'Màu Sắc Các Tầng (Colors)', desc: `Tổ hợp màu: ${colorPart.split('').map(c => c === 'R' ? 'Đỏ' : c === 'A' ? 'Vàng Hổ Phách' : c === 'G' ? 'Xanh Lá' : c === 'B' ? 'Xanh Dương' : 'Trắng').join(' - ')} (theo thứ tự từ trên xuống dưới).` });
      if (mountPart) {
        chunks.push({ part: `-${mountPart}`, title: 'Chân Đế & Gá Lắp', desc: mountPart.startsWith('LB') ? `${mountPart} = Bát gá chân đế chữ L bắt vít thành tủ.` : mountPart.startsWith('MP') ? `${mountPart} = Ống nhôm nối dài gắn mặt bích.` : `${mountPart} = Phụ kiện gá lắp chân đế.` });
      }

      decoded = {
        model: code,
        category: 'Đèn tháp tín hiệu',
        standardDoc: 'Qlight Signal Tower Lights Catalog 2026 - Ordering Specification',
        familyDesc: 'Đèn tháp tín hiệu chính hãng Qlight (Hàn Quốc) - Tiêu chuẩn chống bụi nước IP65',
        chunks: chunks
      };
    }
  }

  // 13. Đèn Chớp & Đèn Xoay Cảnh Báo Qlight (S100, S125, S150, SWTE)
  if (!decoded && (upper.startsWith('S1') || upper.startsWith('SWTE'))) {
    const m = upper.match(/^(S1[0258]0[A-Z]+|SWTE(?:[-_]BZ)?)(?:[-_](\d{2,3}|\d))?(?:[-_]([A-Z]+))?/i);
    if (m) {
      const seriesPart = m[1];
      const voltOrTier = m[2] || '24';
      const colorPart = m[3] || 'R';
      decoded = {
        model: code,
        category: 'Đèn cảnh báo',
        standardDoc: 'Qlight Signal Beacons and Sounders Catalog 2026',
        familyDesc: 'Đèn xoay & đèn chớp cảnh báo công nghiệp Qlight - Chống nước IP54/IP65',
        chunks: [
          { part: seriesPart, title: 'Dòng Đèn (Series)', desc: seriesPart.startsWith('S100D') ? 'Đèn chớp nháy LED Ø100mm tuổi thọ cao.' : seriesPart.startsWith('S100R') ? 'Đèn xoay gương phản xạ Ø100mm.' : seriesPart.startsWith('SWTE') ? 'Đèn bán nguyệt LED ốp tường tiết kiệm không gian.' : 'Đèn tín hiệu cảnh báo công nghiệp.' },
          { part: `-${voltOrTier}`, title: 'Điện Áp Cấp / Tầng', desc: voltOrTier.length <= 1 ? `${voltOrTier} tầng hiển thị.` : voltOrTier === '24' ? 'Nguồn điện 24V DC.' : voltOrTier === '220' ? 'Nguồn điện 220V AC.' : `${voltOrTier}V.` },
          { part: `-${colorPart}`, title: 'Màu Sắc Thấu Kính', desc: `Màu: ${colorPart.split('').map(c => c === 'R' ? 'Đỏ' : c === 'A' ? 'Vàng Hổ Phách' : c === 'G' ? 'Xanh Lá' : c === 'B' ? 'Xanh Dương' : 'Trắng').join(' - ')}.` }
        ]
      };
    }
  }

  // 14. Còi Báo Động & Loa Còi Qlight (SRN, SEN, SEHN, SM, SPNA, QWCD)
  if (!decoded && (upper.startsWith('SRN') || upper.startsWith('SEN') || upper.startsWith('SEHN') || upper.startsWith('SM') || upper.startsWith('QWCD'))) {
    const m = upper.match(/^(SRN|SEN\d+|SEHN\d*|SM\d+|SPNA|QWCD\d+|QAD\d+)(?:[-_](\d{2,3}))?(?:[-_]([A-Z0-9]+))?/i);
    if (m) {
      const seriesPart = m[1];
      const voltPart = m[2] || '24';
      const soundPart = m[3] || 'WS';
      decoded = {
        model: code,
        category: 'Còi báo động',
        standardDoc: 'Qlight Electronic Sounders & Horns Catalog 2026',
        familyDesc: 'Còi báo động điện tử & Loa còi nhôm công nghiệp Qlight - Âm lượng 105dB-125dB',
        chunks: [
          { part: seriesPart, title: 'Dòng Còi Báo (Series)', desc: seriesPart.startsWith('SEHN') ? 'Loa còi nhôm đúc chịu thời tiết khắc nghiệt ngoài trời (115-120dB).' : seriesPart.startsWith('SEN') ? 'Còi báo động điện tử gắn tường đa âm điệu 105dB.' : seriesPart.startsWith('SRN') ? 'Còi báo động nhỏ gọn vỏ ABS âm lượng lớn.' : 'Thiết bị cảnh báo âm thanh công nghiệp.' },
          { part: `-${voltPart}`, title: 'Điện Áp Hoạt Động', desc: voltPart === '24' ? '24V DC an toàn trong tủ điện.' : voltPart === '220' ? '220V AC điện xoay chiều công nghiệp.' : `${voltPart}V.` },
          { part: `-${soundPart}`, title: 'Kiểu Âm Thanh (Sound Pattern)', desc: soundPart === 'WS' ? 'WS = 5 âm thanh cảnh báo nguy hiểm (Còi hú, còi cứu thương, còi sự cố).' : soundPart === 'WM' ? 'WM = 5 giai điệu âm nhạc êm dịu.' : soundPart === 'WA' ? 'WA = 5 âm báo động khẩn cấp tốc độ cao.' : `${soundPart} = Kiểu âm thanh.` }
        ]
      };
    }
  }

  // 15. Đèn LED Máy CNC & Tủ Điện Qlight (QMCL, QCML, QEL, QMFL)
  if (!decoded && (upper.startsWith('QMC') || upper.startsWith('QCM') || upper.startsWith('QEL') || upper.startsWith('QMF'))) {
    const m = upper.match(/^(QMCL|QCML|QEL[TS]*|QMFL|QFL)(?:[-_](\d{3,4}))?(?:[-_](\d{2,3}))?/i);
    if (m) {
      const seriesPart = m[1];
      const lenPart = m[2] || '300';
      const voltPart = m[3] || '24';
      decoded = {
        model: code,
        category: 'Đèn LED máy CNC',
        standardDoc: 'Qlight Industrial LED Work Lights Catalog 2026',
        familyDesc: 'Đèn LED chiếu sáng máy công cụ CNC & Tủ điện Qlight - Chống nước làm mát IP67/IP69K',
        chunks: [
          { part: seriesPart, title: 'Dòng Đèn LED (Series)', desc: seriesPart.startsWith('QCML') || seriesPart.startsWith('QMCL') ? 'Đèn LED thanh chống dầu mỡ & hóa chất làm mát áp lực cao IP67/IP69K cho máy CNC.' : seriesPart.startsWith('QEL') ? 'Đèn thanh LED chiếu sáng tủ điện công nghiệp siêu mỏng.' : 'Đèn LED công nghiệp chuyên dụng.' },
          { part: `-${lenPart}`, title: 'Chiều Dài Thân Đèn', desc: `${lenPart}mm (Kích thước chiều dài chuẩn: 200mm, 300mm, 400mm, 500mm, 600mm).` },
          { part: `-${voltPart}`, title: 'Điện Áp Cấp', desc: voltPart === '24' ? '24V DC an toàn trong buồng gia công cắt gọt.' : '220V AC.' }
        ]
      };
    }
  }

  // 16. Thiết Bị Tín Hiệu Chống Nổ Qlight (SNES, SHD, SEA, SEAL)
  if (!decoded && (upper.startsWith('SNES') || upper.startsWith('SHD') || upper.startsWith('SEA'))) {
    const m = upper.match(/^(SNES|SHD\w*|SEA\w*)(?:[-_](\d{2,3}))?(?:[-_]([A-Z]))?/i);
    if (m) {
      const seriesPart = m[1];
      const voltPart = m[2] || '24';
      const colorPart = m[3] || 'R';
      decoded = {
        model: code,
        category: 'Tín hiệu chống cháy nổ',
        standardDoc: 'Qlight Heavy-Duty & Explosion Proof Signalings Catalog 2026',
        familyDesc: 'Thiết bị báo hiệu chống cháy nổ tiêu chuẩn quốc tế IECEx / ATEX / NEPSI Zone 1, 2 (Ex d IIC T6)',
        chunks: [
          { part: seriesPart, title: 'Dòng Thiết Bị Chống Nổ', desc: seriesPart.startsWith('SNES') ? 'Đèn chớp chống nổ vỏ nhôm đúc siêu bền, kính cường lực bảo vệ.' : seriesPart.startsWith('SEA') ? 'Đèn tháp tín hiệu chống nổ đa tầng chuyên dụng giàn khoan & trạm chiết gas.' : 'Thiết bị tín hiệu chống nổ tải nặng.' },
          { part: `-${voltPart}`, title: 'Điện Áp Hoạt Động', desc: `${voltPart} = Nguồn ${voltPart}V (${voltPart === '24' ? 'DC' : 'AC'}).` },
          { part: `-${colorPart}`, title: 'Màu Sắc Đèn Báo', desc: `Màu thấu kính: ${colorPart === 'R' ? 'Đỏ' : colorPart === 'A' ? 'Vàng Hổ Phách' : colorPart === 'G' ? 'Xanh Lá' : 'Xanh Dương'}.` }
        ]
      };
    }
  }

  // ===== BROTHER OFFICIAL INDUSTRIAL LABEL PRINTER DECODERS =====
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

  // 23. Màn Hình Gắn Lỗ Tròn Ø22mm Pro-face STM6000 (PFXSTM6200WAD, PFXSTM6400WAD)
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
  }

  // Fallback nếu không khớp mẫu cụ thể
  if (!decoded) {
    const activeBrandMeta = BRANDS.find(b => b.id === CURRENT_BRAND) || { name: 'Thiết Bị Công Nghiệp' };
    decoded = {
      model: code,
      category: activeBrandMeta.name,
      standardDoc: `${activeBrandMeta.name} Technical Ordering Standards`,
      familyDesc: `Mã sản phẩm chính hãng ${activeBrandMeta.name} tra cứu theo Catalog`,
      chunks: [
        { part: code.slice(0, Math.min(code.length, 6)), title: 'Tiền Tố Dòng Sản Phẩm', desc: 'Định danh họ thiết bị và tính năng cơ bản.' },
        { part: code.length > 6 ? code.slice(6) : '-', title: 'Hậu Tố Cấu Hình Chi Tiết', desc: 'Mã điện áp, kích thước, ngõ ra hoặc màu sắc theo quy chuẩn hãng.' }
      ]
    };
  }

  // Render kết quả ra giao diện
  resBox.innerHTML = `
    <div class="decoder-res-header">
      <div>
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">
          KẾT QUẢ GIẢI MÃ QUY CHUẨN KÝ TỰ • <span style="color: var(--accent-green); font-family: sans-serif;">${escapeHtml(decoded.standardDoc || 'Mitsubishi Official Standard')}</span>:
        </div>
        <div class="decoder-res-model">${decoded.model}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">${decoded.familyDesc}</div>
      </div>
      <button type="button" class="btn-primary btn-sm" onclick="quickLookupSeries('${escapeHtml(decoded.category)}', '${escapeHtml(decoded.model.split(/[-_\s]/)[0])}')">
        <span>🔍</span> <span>Tra Cứu Mã Này Trong Danh Mục ➔</span>
      </button>
    </div>
    <div class="decoder-chips-grid">
      ${decoded.chunks.map(c => `
        <div class="decoder-chunk-card">
          <div class="chunk-code">${c.part}</div>
          <div class="chunk-title">${c.title}</div>
          <div class="chunk-desc">${c.desc}</div>
        </div>
      `).join('')}
    </div>
  `;
  resBox.classList.remove('hidden');
}

// 5. CÁC HÀM QUẢN TRỊ TRỰC TIẾP TẠI TAB SƠ ĐỒ CÂY (IN-PLACE MODALS)
let CURRENT_EDIT_TREE_CAT_ID = null;
let CURRENT_EDIT_TREE_SERIES_ID = null;

function closeTreeEditModal() {
  const modal = document.getElementById('treeEditModal');
  if (modal) modal.classList.remove('active');
}

// Mở modal thêm Nhóm Danh Mục mới
function openAddCategoryModal() {
  CURRENT_EDIT_TREE_CAT_ID = null;
  const content = document.getElementById('treeEditModalContent');
  if (!content) return;

  content.innerHTML = `
    <h3 style="margin-bottom: 1rem; font-size: 1.15rem; font-weight: 800; color: var(--brand-active, var(--accent-blue));">
      ➕ THÊM NHÓM DANH MỤC MỚI VÀO SƠ ĐỒ CÂY
    </h3>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Tên Nhóm Danh Mục:</label>
      <input type="text" id="modalCatName" class="form-input" placeholder="Ví dụ: Cảm Biến Quang & Tiệm Cận">
    </div>
    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
      <div>
        <label class="form-label">Icon:</label>
        <input type="text" id="modalCatIcon" class="form-input text-center" value="⚡">
      </div>
      <div>
        <label class="form-label">Tên Chủng Loại Tra Cứu (Filter Cat):</label>
        <input type="text" id="modalCatFilter" class="form-input" placeholder="Ví dụ: Cảm biến (khớp với cột Danh mục của bảng)">
      </div>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Phân Khúc Sản Phẩm:</label>
      <input type="text" id="modalCatTier" class="form-input" placeholder="Ví dụ: Kinh tế / Tiêu chuẩn / Cao cấp">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Ứng Dụng Tiêu Biểu:</label>
      <textarea id="modalCatApp" class="form-input" rows="2" placeholder="Ví dụ: Phát hiện vật thể trên băng tải, định vị phôi gia công..."></textarea>
    </div>
    <div style="margin-bottom: 1.25rem;">
      <label class="form-label">Mô Tả Cốt Lõi:</label>
      <input type="text" id="modalCatDesc" class="form-input" placeholder="Mô tả ngắn gọn về vai trò của nhóm này trong hệ thống.">
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="closeTreeEditModal()">Hủy</button>
      <button type="button" class="btn-primary" onclick="saveCategoryModal(true)">💾 Lưu Nhóm Mới</button>
    </div>
  `;

  document.getElementById('treeEditModal').classList.add('active');
}

// Mở modal sửa Nhóm Danh Mục
function openEditCategoryModal(catId) {
  CURRENT_EDIT_TREE_CAT_ID = catId;
  const tree = getActiveBrandTreeData();
  const cat = tree.find(c => c.id === catId);
  if (!cat) return;

  const content = document.getElementById('treeEditModalContent');
  if (!content) return;

  content.innerHTML = `
    <h3 style="margin-bottom: 1rem; font-size: 1.15rem; font-weight: 800; color: var(--brand-active, var(--accent-blue));">
      ✏️ CHỈNH SỬA THÔNG TIN NHÓM DANH MỤC
    </h3>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Tên Nhóm Danh Mục:</label>
      <input type="text" id="modalCatName" class="form-input" value="${escapeHtml(cat.name || '')}">
    </div>
    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
      <div>
        <label class="form-label">Icon:</label>
        <input type="text" id="modalCatIcon" class="form-input text-center" value="${escapeHtml(cat.icon || '📦')}">
      </div>
      <div>
        <label class="form-label">Tên Chủng Loại Tra Cứu (Filter Cat):</label>
        <input type="text" id="modalCatFilter" class="form-input" value="${escapeHtml(cat.filterCat || cat.name || '')}">
      </div>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Phân Khúc Sản Phẩm:</label>
      <input type="text" id="modalCatTier" class="form-input" value="${escapeHtml(cat.tier || '')}">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Ứng Dụng Tiêu Biểu:</label>
      <textarea id="modalCatApp" class="form-input" rows="2">${escapeHtml(cat.application || '')}</textarea>
    </div>
    <div style="margin-bottom: 1.25rem;">
      <label class="form-label">Mô Tả Cốt Lõi:</label>
      <input type="text" id="modalCatDesc" class="form-input" value="${escapeHtml(cat.description || '')}">
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="closeTreeEditModal()">Hủy</button>
      <button type="button" class="btn-primary" onclick="saveCategoryModal(false)">💾 Lưu Thay Đổi</button>
    </div>
  `;

  document.getElementById('treeEditModal').classList.add('active');
}

// Lưu modal Category
function saveCategoryModal(isNew) {
  const name = document.getElementById('modalCatName').value.trim();
  const icon = document.getElementById('modalCatIcon').value.trim() || '📦';
  const filterCat = document.getElementById('modalCatFilter').value.trim() || name;
  const tier = document.getElementById('modalCatTier').value.trim();
  const application = document.getElementById('modalCatApp').value.trim();
  const description = document.getElementById('modalCatDesc').value.trim();

  if (!name) {
    alert('Vui lòng nhập tên nhóm danh mục!');
    return;
  }

  const tree = getActiveBrandTreeData();

  if (isNew) {
    const newCat = {
      id: `custom-cat-${Date.now()}`,
      name,
      icon,
      filterCat,
      tier,
      application,
      description,
      series: []
    };
    tree.push(newCat);
  } else {
    const cat = tree.find(c => c.id === CURRENT_EDIT_TREE_CAT_ID);
    if (cat) {
      cat.name = name;
      cat.icon = icon;
      cat.filterCat = filterCat;
      cat.tier = tier;
      cat.application = application;
      cat.description = description;
    }
  }

  saveActiveBrandTreeData(tree);
  closeTreeEditModal();
  renderBrandTree(tree);
  showToast(isNew ? '✅ Đã thêm nhóm danh mục mới vào Sơ đồ cây!' : '✅ Đã cập nhật thông tin nhóm!');
}

// Mở modal thêm Series con
function openAddSeriesModal(catId) {
  CURRENT_EDIT_TREE_CAT_ID = catId;
  CURRENT_EDIT_TREE_SERIES_ID = null;
  const content = document.getElementById('treeEditModalContent');
  if (!content) return;

  content.innerHTML = `
    <h3 style="margin-bottom: 1rem; font-size: 1.15rem; font-weight: 800; color: var(--brand-active, var(--accent-blue));">
      ➕ THÊM DÒNG SẢN PHẨM (SERIES) VÀO SƠ ĐỒ
    </h3>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Tên Dòng / Series:</label>
      <input type="text" id="modalSeriesName" class="form-input" placeholder="Ví dụ: FX5S Series hoặc FR-A800...">
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
      <div>
        <label class="form-label">Từ Khóa Tra Cứu (Lookup Keyword):</label>
        <input type="text" id="modalSeriesKw" class="form-input" placeholder="Ví dụ: FX5S hoặc A800">
      </div>
      <div>
        <label class="form-label">Trạng Thái:</label>
        <select id="modalSeriesStatus" class="form-input">
          <option value="Thông dụng">✅ Thông dụng</option>
          <option value="Mới">✨ Mới ra mắt</option>
          <option value="Ngừng sx">🛑 Ngừng sản xuất</option>
          <option value="Hiếm">⚡ Hiếm</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Phân Khúc Dòng Này:</label>
      <input type="text" id="modalSeriesTier" class="form-input" placeholder="Ví dụ: Dòng kinh tế thay thế FX3S...">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Ứng Dụng Tiêu Biểu:</label>
      <textarea id="modalSeriesApp" class="form-input" rows="2" placeholder="Ví dụ: Máy dán nhãn, máy chiết rót, đóng gói mini..."></textarea>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Đường Dẫn Ảnh Sản Phẩm (File SVG/PNG hoặc URL):</label>
      <input type="text" id="modalSeriesImg" class="form-input" placeholder="Ví dụ: assets/images/mitsubishi/plc_fx5u.webp hoặc https://...">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Mã Ví Dụ Quy Chuẩn Đọc Mã (Example):</label>
      <input type="text" id="modalSeriesRuleEx" class="form-input" placeholder="Ví dụ: FX5S-30MT/ES">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Cảnh Báo Thực Chiến & Lưu Ý:</label>
      <input type="text" id="modalSeriesWarning" class="form-input" placeholder="Ví dụ: ⚠️ Thị trường có nguy cơ hàng cũ tháo máy Renew...">
    </div>
    <div style="margin-bottom: 1.25rem;">
      <label class="form-label">Model Thông Dụng (Phân cách dấu phẩy):</label>
      <input type="text" id="modalSeriesModels" class="form-input" placeholder="FX5S-30MT/ES, FX5S-40MT/ES, FX5S-60MT/ES">
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="closeTreeEditModal()">Hủy</button>
      <button type="button" class="btn-primary" onclick="saveSeriesModal(true)">💾 Lưu Dòng Mới</button>
    </div>
  `;

  document.getElementById('treeEditModal').classList.add('active');
}

// Mở modal sửa Series con
function openEditSeriesModal(catId, seriesId) {
  CURRENT_EDIT_TREE_CAT_ID = catId;
  CURRENT_EDIT_TREE_SERIES_ID = seriesId;
  const tree = getActiveBrandTreeData();
  const cat = tree.find(c => c.id === catId);
  if (!cat) return;
  const series = (cat.series || []).find(s => s.id === seriesId);
  if (!series) return;

  const content = document.getElementById('treeEditModalContent');
  if (!content) return;

  const ruleEx = (series.namingRule && series.namingRule.example) ? series.namingRule.example : '';
  const modelsStr = (series.commonModels && series.commonModels.length) ? series.commonModels.join(', ') : '';

  content.innerHTML = `
    <h3 style="margin-bottom: 1rem; font-size: 1.15rem; font-weight: 800; color: var(--brand-active, var(--accent-blue));">
      ✏️ CHỈNH SỬA DÒNG SẢN PHẨM: ${escapeHtml(series.name)}
    </h3>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Tên Dòng / Series:</label>
      <input type="text" id="modalSeriesName" class="form-input" value="${escapeHtml(series.name || '')}">
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
      <div>
        <label class="form-label">Từ Khóa Tra Cứu (Lookup Keyword):</label>
        <input type="text" id="modalSeriesKw" class="form-input" value="${escapeHtml(series.lookupKeyword || '')}">
      </div>
      <div>
        <label class="form-label">Trạng Thái:</label>
        <select id="modalSeriesStatus" class="form-input">
          <option value="Thông dụng" ${series.status === 'Thông dụng' ? 'selected' : ''}>✅ Thông dụng</option>
          <option value="Mới" ${series.status === 'Mới' ? 'selected' : ''}>✨ Mới ra mắt</option>
          <option value="Ngừng sx" ${series.status === 'Ngừng sx' ? 'selected' : ''}>🛑 Ngừng sản xuất</option>
          <option value="Hiếm" ${series.status === 'Hiếm' ? 'selected' : ''}>⚡ Hiếm</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Phân Khúc Dòng Này:</label>
      <input type="text" id="modalSeriesTier" class="form-input" value="${escapeHtml(series.tier || '')}">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Ứng Dụng Tiêu Biểu:</label>
      <textarea id="modalSeriesApp" class="form-input" rows="2">${escapeHtml(series.application || '')}</textarea>
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Đường Dẫn Ảnh Sản Phẩm (File SVG/PNG hoặc URL):</label>
      <input type="text" id="modalSeriesImg" class="form-input" value="${escapeHtml(series.image || '')}">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Mã Ví Dụ Quy Chuẩn Đọc Mã (Example):</label>
      <input type="text" id="modalSeriesRuleEx" class="form-input" value="${escapeHtml(ruleEx)}">
    </div>
    <div style="margin-bottom: 0.75rem;">
      <label class="form-label">Cảnh Báo Thực Chiến & Lưu Ý:</label>
      <input type="text" id="modalSeriesWarning" class="form-input" value="${escapeHtml(series.warnings || '')}">
    </div>
    <div style="margin-bottom: 1.25rem;">
      <label class="form-label">Model Thông Dụng (Phân cách dấu phẩy):</label>
      <input type="text" id="modalSeriesModels" class="form-input" value="${escapeHtml(modelsStr)}">
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
      <button type="button" class="btn-secondary" onclick="closeTreeEditModal()">Hủy</button>
      <button type="button" class="btn-primary" onclick="saveSeriesModal(false)">💾 Lưu Thay Đổi</button>
    </div>
  `;

  document.getElementById('treeEditModal').classList.add('active');
}

// Lưu modal Series
function saveSeriesModal(isNew) {
  const name = document.getElementById('modalSeriesName').value.trim();
  const kw = document.getElementById('modalSeriesKw').value.trim() || name;
  const status = document.getElementById('modalSeriesStatus').value;
  const tier = document.getElementById('modalSeriesTier').value.trim();
  const application = document.getElementById('modalSeriesApp').value.trim();
  const image = document.getElementById('modalSeriesImg').value.trim() || 'assets/images/mitsubishi/plc_fx5u.webp';
  const ruleEx = document.getElementById('modalSeriesRuleEx').value.trim();
  const warnings = document.getElementById('modalSeriesWarning').value.trim();
  const modelsStr = document.getElementById('modalSeriesModels').value.trim();
  const commonModels = modelsStr ? modelsStr.split(/[,;\n]+/).map(m => m.trim()).filter(Boolean) : [];

  if (!name) {
    alert('Vui lòng nhập tên dòng sản phẩm!');
    return;
  }

  const tree = getActiveBrandTreeData();
  const cat = tree.find(c => c.id === CURRENT_EDIT_TREE_CAT_ID);
  if (!cat) return;

  if (!cat.series) cat.series = [];

  if (isNew) {
    const newSeries = {
      id: `custom-series-${Date.now()}`,
      name,
      lookupKeyword: kw,
      status,
      tier,
      application,
      image,
      warnings,
      commonModels,
      namingRule: ruleEx ? {
        example: ruleEx,
        breakdown: [
          { part: ruleEx.split(/[-_\/]/)[0] || ruleEx, title: 'Tiền Tố Dòng', desc: `Dòng sản phẩm ${name}` }
        ]
      } : null
    };
    cat.series.push(newSeries);
  } else {
    const s = cat.series.find(item => item.id === CURRENT_EDIT_TREE_SERIES_ID);
    if (s) {
      s.name = name;
      s.lookupKeyword = kw;
      s.status = status;
      s.tier = tier;
      s.application = application;
      s.image = image;
      s.warnings = warnings;
      s.commonModels = commonModels;
      if (ruleEx) {
        if (!s.namingRule) s.namingRule = { example: ruleEx, breakdown: [] };
        s.namingRule.example = ruleEx;
      }
    }
  }

  saveActiveBrandTreeData(tree);
  closeTreeEditModal();
  renderBrandTree(tree);
  showToast(isNew ? '✅ Đã thêm dòng Series mới!' : '✅ Đã cập nhật dòng Series!');
}

// Xóa một Series khỏi cây
function deleteSeriesFromTree(catId, seriesId) {
  if (!confirm('Bạn có chắc chắn muốn xóa dòng sản phẩm này khỏi Sơ đồ cây?')) return;
  const tree = getActiveBrandTreeData();
  const cat = tree.find(c => c.id === catId);
  if (cat && cat.series) {
    cat.series = cat.series.filter(s => s.id !== seriesId);
    saveActiveBrandTreeData(tree);
    renderBrandTree(tree);
    showToast('🗑️ Đã xóa dòng sản phẩm khỏi Sơ đồ cây.');
  }
}

// Lấy treeData đang hoạt động
function getActiveBrandTreeData() {
  const saved = localStorage.getItem(`portal_custom_tree_${CURRENT_BRAND}`);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  const cur = BRAND_DATA[CURRENT_BRAND];
  return (cur && cur.treeData) ? cur.treeData : [];
}

// Lưu treeData vào bộ nhớ
function saveActiveBrandTreeData(tree) {
  localStorage.setItem(`portal_custom_tree_${CURRENT_BRAND}`, JSON.stringify(tree));
  if (BRAND_DATA[CURRENT_BRAND]) {
    BRAND_DATA[CURRENT_BRAND].treeData = tree;
  }
}

// Khôi phục cấu trúc gốc của hãng
function resetBrandTreeData() {
  if (!confirm('Khôi phục cấu trúc Sơ đồ cây về thiết lập mặc định của nhà sản xuất?')) return;
  localStorage.removeItem(`portal_custom_tree_${CURRENT_BRAND}`);
  const cur = BRAND_DATA[CURRENT_BRAND];
  if (cur) {
    renderBrandTree(cur.treeData || []);
    showToast('🔄 Đã khôi phục Sơ đồ cây chuẩn mặc định!');
  }
}


// =============================================================================
// PHÂN HỆ HỒ SƠ NHÀ CUNG CẤP & KHUYẾN NGHỊ MUA HÀNG THỰC CHIẾN (SUPPLIER DIRECTORY)
// =============================================================================

function closeSupplierModal() {
  const modal = document.getElementById('supplierDetailModal');
  if (modal) modal.classList.remove('active');
}

// Mở modal khi người dùng bấm vào một Tuyến cụ thể (VD: Tuyến 1 chỉ hiện Kovi, Phạm Dương)
function openSupplierModalForTier(prodId, tierNum) {
  const curBrandData = BRAND_DATA[CURRENT_BRAND];
  const products = (curBrandData && curBrandData.products) ? curBrandData.products : [];
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;
  renderSupplierModalForProductTier(prod, String(tierNum));
}

// Mở modal cho toàn bộ dòng sản phẩm
function openSupplierModalForProduct(prodId) {
  const curBrandData = BRAND_DATA[CURRENT_BRAND];
  const products = (curBrandData && curBrandData.products) ? curBrandData.products : [];
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;
  renderSupplierModalForProductTier(prod, 'all');
}

// Mở modal danh bạ tất cả NCC của thương hiệu hiện tại
function openAllSuppliersDirectory() {
  renderSupplierModalForProductTier(null, 'directory');
}

// Tìm các NCC khớp trong danh bạ dựa trên chuỗi văn bản
function matchSuppliersFromText(text, directory) {
  if (!text || !directory || !directory.length) return [];
  const textLower = text.toLowerCase();
  return directory.filter(sup => {
    return sup.matchTokens && sup.matchTokens.some(token => textLower.includes(token.toLowerCase()));
  });
}

// Hiển thị nội dung Modal theo đúng Tuyến được chọn (Strict Tier Filtering)
function renderSupplierModalForProductTier(prod, activeTier = '1') {
  const modal = document.getElementById('supplierDetailModal');
  const container = document.getElementById('supplierModalContent');
  if (!modal || !container) return;

  window._lastSupplierModalProd = prod;
  window._lastSupplierModalTier = activeTier;

  const curBrandData = BRAND_DATA[CURRENT_BRAND] || {};
  const brandMeta = BRANDS.find(b => b.id === CURRENT_BRAND) || { name: CURRENT_BRAND };
  const directory = curBrandData.suppliersDirectory || [];

  let titleText = '';
  let subText = '';
  let contextHtml = '';
  let suppliersToShow = [];

  if (!prod || activeTier === 'directory') {
    // Chế độ xem toàn bộ danh bạ hãng
    titleText = `Danh Bạ & Đánh Giá Đối Tác Cung Ứng: <span style="color: var(--brand-active, var(--accent-blue));">${brandMeta.name}</span>`;
    subText = 'Toàn bộ mạng lưới đại lý cấp 1, tổng kho, kênh nhập khẩu & đơn vị cung ứng thực chiến';
    suppliersToShow = [...directory];

    contextHtml = `
      <div class="supplier-search-bar">
        <input type="text" id="supplierSearchInput" class="filter-input" placeholder="🔍 Gõ tên nhà cung cấp, mặt hàng thế mạnh (VD: Kovi, Hợp Long, Phạm Dương, Servo, Đóng cắt...)" oninput="filterSupplierCardsInModal(this.value)" style="flex: 1; padding: 0.6rem 0.9rem; font-size: 0.85rem;" />
        <button type="button" class="btn-secondary btn-sm" onclick="filterSupplierCardsInModal('')">Đặt Lại</button>
      </div>
    `;
  } else {
    // Chế độ xem theo sản phẩm cụ thể
    const rawSuppliers = prod.suppliers || '';
    const parts = rawSuppliers.split('|').map(s => s.trim()).filter(Boolean);

    let tier1Content = '';
    let tier2Content = '';
    let tier1Vendors = [];
    let tier2Vendors = [];
    let allProductVendors = [];

    parts.forEach(part => {
      const m = part.match(/^(\s*tuyến\s*(\d+|[^\:]+))\s*\:\s*(.*)$/i);
      if (m) {
        const num = m[2].trim();
        const content = m[3].trim();
        const matched = matchSuppliersFromText(content, directory);
        if (num === '1') {
          tier1Content = content;
          tier1Vendors = matched;
        } else if (num === '2') {
          tier2Content = content;
          tier2Vendors = matched;
        }
        allProductVendors = allProductVendors.concat(matched);
      } else {
        const matched = matchSuppliersFromText(part, directory);
        allProductVendors = allProductVendors.concat(matched);
      }
    });

    // Lọc trùng ID
    const uniqueIds = new Set();
    allProductVendors = allProductVendors.filter(s => {
      if (uniqueIds.has(s.id)) return false;
      uniqueIds.add(s.id);
      return true;
    });

    // Quyết định danh sách NCC hiển thị CHÍNH XÁC theo Tuyến
    if (activeTier === '1') {
      titleText = `Nhà Cung Cấp Được Chỉ Định: <span style="color: #f59e0b;">TUYẾN 1</span>`;
      subText = `Đang xem ${tier1Vendors.length} đơn vị ưu tiên số 1 cho dòng <strong>${prod.serial}</strong>`;
      suppliersToShow = tier1Vendors.length ? tier1Vendors : allProductVendors;
    } else if (activeTier === '2') {
      titleText = `Nhà Cung Cấp Được Chỉ Định: <span style="color: #3b82f6;">TUYẾN 2</span>`;
      subText = `Đang xem ${tier2Vendors.length} kênh dự phòng / hàng bãi / giá cạnh tranh cho dòng <strong>${prod.serial}</strong>`;
      suppliersToShow = tier2Vendors.length ? tier2Vendors : allProductVendors;
    } else {
      titleText = `Đối Tác Cung Ứng Dòng: <span style="color: var(--brand-active, var(--accent-blue));">${prod.serial}</span>`;
      subText = `Tổng cộng ${allProductVendors.length} đơn vị được chỉ định cho cả 2 tuyến`;
      suppliersToShow = allProductVendors;
    }

    const currentTierContent = activeTier === '1' ? tier1Content : activeTier === '2' ? tier2Content : rawSuppliers;

    contextHtml = `
      <div class="supplier-context-banner">
        <div class="supplier-context-title">
          📦 Dòng sản phẩm: <strong>${prod.serial}</strong> (${prod.cat}) • ${prod.subcat || ''}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
          • Kênh được chọn: <strong style="color: var(--text-main);">${activeTier === '1' ? 'Tuyến 1' : activeTier === '2' ? 'Tuyến 2' : 'Tất cả'}:</strong> ${escapeHtml(currentTierContent)}
        </div>

        <!-- Thanh chuyển đổi nhanh giữa các Tuyến của sản phẩm này -->
        <div class="supplier-tier-tabs">
          ${tier1Vendors.length ? `
            <button type="button" class="supplier-tier-tab-btn ${activeTier === '1' ? 'active' : ''}" onclick="openSupplierModalForTier(${prod.id}, '1')">
              ⭐ Tuyến 1 (${tier1Vendors.length} NCC)
            </button>
          ` : ''}
          ${tier2Vendors.length ? `
            <button type="button" class="supplier-tier-tab-btn ${activeTier === '2' ? 'active' : ''}" onclick="openSupplierModalForTier(${prod.id}, '2')">
              ⚡ Tuyến 2 (${tier2Vendors.length} NCC)
            </button>
          ` : ''}
          <button type="button" class="supplier-tier-tab-btn ${activeTier === 'all' ? 'active' : ''}" onclick="openSupplierModalForProduct(${prod.id})">
            📋 Cả 2 Tuyến (${allProductVendors.length} NCC)
          </button>
          <button type="button" class="supplier-tier-tab-btn" onclick="openAllSuppliersDirectory()" style="margin-left: auto;">
            🌐 Xem Toàn Bộ Danh Bạ Hãng ➔
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="supplier-modal-header">
      <div class="supplier-modal-title">
        <span>🏢</span>
        <span>${titleText}</span>
      </div>
      <div class="supplier-modal-sub">
        ${subText}
      </div>
    </div>

    ${contextHtml}

    <div class="supplier-cards-grid" id="supplierModalCardsList">
      ${renderSupplierCardsHtml(suppliersToShow, prod, activeTier)}
    </div>
  `;

  modal.classList.add('active');
}

// Render danh sách các thẻ nhà cung cấp (chỉ hiển thị đúng các đơn vị được truyền vào)
function renderSupplierCardsHtml(suppliersList, prod = null, activeTier = null) {
  if (!suppliersList || !suppliersList.length) {
    return `<div style="padding: 2.5rem; text-align: center; color: var(--text-dim); background: var(--bg-secondary); border-radius: var(--radius-md);">Chưa có thông tin đối tác cho tuyến này.</div>`;
  }

  return suppliersList.map(sup => {
    let badgeClass = sup.badgeType || 'badge-blue';
    let tierBadge = '';

    if (activeTier === '1') {
      tierBadge = '<span class="badge badge-amber" style="font-weight: 800;">⭐ Ưu Tiên Số 1 (Tuyến 1)</span>';
    } else if (activeTier === '2') {
      tierBadge = '<span class="badge badge-blue" style="font-weight: 800;">⚡ Kênh Dự Phòng / Bãi (Tuyến 2)</span>';
    }

    return `
      <div class="supplier-card-item" id="supCard_${sup.id}">
        <div class="supplier-card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
              <span class="supplier-company-name">${sup.name}</span>
              <span class="badge ${badgeClass}">${sup.badge}</span>
              ${tierBadge}
            </div>
            <div class="supplier-contact-row">
              ${sup.website && sup.website.startsWith('http') ? `<span>🌐 <a href="${sup.website}" target="_blank" rel="noopener noreferrer">${sup.website.replace('https://', '').replace('http://', '')}</a></span>` : ''}
              ${sup.phone ? `<span>📞 <strong>Hotline:</strong> ${sup.phone}</span>` : ''}
              ${sup.address ? `<span>📍 ${sup.address}</span>` : ''}
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <button type="button" class="btn-secondary btn-sm" onclick="openEditSupplierModal('${sup.id}')" title="Chỉnh sửa nội dung hồ sơ nhà cung cấp này" style="font-weight: 700;">
              <span>✏️</span> <span>Sửa NCC</span>
            </button>
            <button type="button" class="btn-secondary btn-sm" onclick="copySupplierFullInfo('${sup.id}')" title="Sao chép toàn bộ thông tin nhà cung cấp gửi qua Zalo/Email">
              <span>📋</span> <span>Copy</span>
            </button>
          </div>
        </div>

        ${sup.legalInfo ? `
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; background: var(--bg-secondary); padding: 0.45rem 0.75rem; border-radius: var(--radius-sm); border: 1px dashed var(--border-color);">
            🏛️ <strong>Pháp lý & Đại diện:</strong> ${sup.legalInfo}
          </div>
        ` : ''}

        <div class="supplier-details-grid">
          <div class="supplier-detail-box box-strengths">
            <div class="supplier-detail-label">🎯 Mặt Hàng Thế Mạnh Cho Hãng Này:</div>
            <div>${sup.keyStrengths || 'Đang cập nhật'}</div>
          </div>

          <div class="supplier-detail-box box-pros">
            <div class="supplier-detail-label">✅ Ưu Điểm & Chính Sách Giá / Giao Hàng:</div>
            <div>${sup.pros || 'Đang cập nhật'}</div>
          </div>

          <div class="supplier-detail-box box-cons">
            <div class="supplier-detail-label">⚠️ Rủi Ro & Điểm Yếu Cần Chú Ý:</div>
            <div>${sup.cons || 'Đang cập nhật'}</div>
          </div>
        </div>

        <div class="supplier-guide-box">
          <div class="supplier-guide-title">
            <span>💡</span>
            <span>Khuyến Nghị Mua Hàng & Bí Quyết Thực Chiến:</span>
          </div>
          <div>${sup.buyingGuide || 'Trao đổi kỹ mã hàng, yêu cầu CO/CQ và ảnh chụp tem trước khi chốt đơn.'}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Lọc thẻ nhà cung cấp trong modal toàn danh bạ
function filterSupplierCardsInModal(keyword) {
  const q = (keyword || '').toLowerCase().trim();
  const curBrandData = BRAND_DATA[CURRENT_BRAND] || {};
  const directory = curBrandData.suppliersDirectory || [];
  const cardsContainer = document.getElementById('supplierModalCardsList');
  if (!cardsContainer) return;

  if (!q) {
    cardsContainer.innerHTML = renderSupplierCardsHtml(directory);
    return;
  }

  const filtered = directory.filter(s => {
    const hay = [
      s.name, s.shortName, s.badge, s.legalInfo, s.keyStrengths, s.pros, s.cons, s.buyingGuide, s.phone, s.address
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });

  cardsContainer.innerHTML = renderSupplierCardsHtml(filtered);
}

// Copy toàn bộ thông tin nhà cung cấp ra clipboard
function copySupplierFullInfo(supplierId) {
  const curBrandData = BRAND_DATA[CURRENT_BRAND] || {};
  const directory = curBrandData.suppliersDirectory || [];
  const s = directory.find(x => x.id === supplierId);
  if (!s) return;

  const infoText = `[HỒ SƠ NHÀ CUNG CẤP - ${s.name}]\n` +
    `• Phân loại: ${s.badge}\n` +
    (s.website ? `• Website: ${s.website}\n` : '') +
    (s.phone ? `• Hotline: ${s.phone}\n` : '') +
    (s.address ? `• Địa chỉ: ${s.address}\n` : '') +
    `• Thế mạnh: ${s.keyStrengths}\n` +
    `• Ưu điểm: ${s.pros}\n` +
    `• Lưu ý rủi ro: ${s.cons}\n` +
    `• Khuyến nghị mua hàng: ${s.buyingGuide}`;

  navigator.clipboard.writeText(infoText).then(() => {
    showToast(`📋 Đã copy thông tin NCC: ${s.shortName || s.name}`);
  }).catch(() => {
    showToast('Lỗi khi copy thông tin');
  });
}


// =============================================================================
// PHÂN HỆ CHỈNH SỬA TOÀN BỘ CỘT VÀ POPUP (IN-PLACE PRODUCT & SUPPLIER EDITORS)
// =============================================================================

function closeProductEditModal() {
  const modal = document.getElementById('productEditModal');
  if (modal) modal.classList.remove('active');
}

function closeSupplierEditModal() {
  const modal = document.getElementById('supplierEditModal');
  if (modal) modal.classList.remove('active');
}

// 1. Mở Modal chỉnh sửa nội dung Sản Phẩm (Dòng bảng)
function openEditProductModal(id) {
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data || !data.products) return;
  const p = data.products.find(x => x.id === id);
  if (!p) return;

  const modal = document.getElementById('productEditModal');
  const container = document.getElementById('productEditModalContent');
  if (!modal || !container) return;

  container.innerHTML = `
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
        <span>✏️</span> <span>Chỉnh Sửa Dòng Sản Phẩm: <span style="color: var(--accent-blue);">${p.serial}</span></span>
      </h3>
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
        Chỉnh sửa tất cả các cột, trạng thái, danh sách model và khuyến nghị kỹ thuật
      </div>
    </div>

    <form onsubmit="handleSaveProductEdit(event, ${p.id})">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <label class="form-label">Tên Dòng / Series (Cột 2):</label>
          <input type="text" id="editProdSerial" class="form-input" value="${escapeHtml(p.serial)}" required />
        </div>
        <div>
          <label class="form-label">Chủng Loại (Cat):</label>
          <input type="text" id="editProdCat" class="form-input" value="${escapeHtml(p.cat)}" required />
        </div>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Mô Tả Phân Loại Ngắn (Subcat):</label>
        <input type="text" id="editProdSubcat" class="form-input" value="${escapeHtml(p.subcat)}" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <label class="form-label">Trạng Thái:</label>
          <select id="editProdStatus" class="form-input">
            <option value="Thông dụng" ${p.status === 'Thông dụng' ? 'selected' : ''}>✅ Thông dụng</option>
            <option value="Ngừng sx" ${p.status === 'Ngừng sx' ? 'selected' : ''}>🛑 Ngừng sx</option>
            <option value="Hiếm" ${p.status === 'Hiếm' ? 'selected' : ''}>⚡ Hiếm</option>
            <option value="Mới" ${p.status === 'Mới' ? 'selected' : ''}>✨ Mới</option>
          </select>
        </div>
        <div>
          <label class="form-label">Cảnh báo Fake?</label>
          <select id="editProdFake" class="form-input">
            <option value="Không" ${p.fake !== 'Có' ? 'selected' : ''}>Không</option>
            <option value="Có" ${p.fake === 'Có' ? 'selected' : ''}>⚠️ Có Fake</option>
          </select>
        </div>
        <div>
          <label class="form-label">Cảnh báo Renew?</label>
          <select id="editProdRenew" class="form-input">
            <option value="Không" ${p.renew !== 'Có' ? 'selected' : ''}>Không</option>
            <option value="Có" ${p.renew === 'Có' ? 'selected' : ''}>🔄 Có Renew</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Danh Sách Model Thông Dụng (Cột 3 - Cách nhau bằng dấu phẩy):</label>
        <textarea id="editProdModels" class="form-input" rows="2" placeholder="Ví dụ: FX5U-32MT/ES, FX5U-32MR/ES, FX5U-64MT/ES">${(p.models || []).join(', ')}</textarea>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Phương Án Thay Thế & Nâng Cấp (Hiển thị trong popup):</label>
        <input type="text" id="editProdReplacement" class="form-input" value="${escapeHtml(p.replacement || '')}" placeholder="Ví dụ: Nâng cấp thẳng lên FX5U..." />
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Đặc Điểm & Cảnh Báo Kỹ Thuật (Cột 4 - Mỗi dòng 1 ý gạch đầu dòng):</label>
        <textarea id="editProdPoints" class="form-input" rows="3" placeholder="**Bản chất**: ...&#10;**Ứng dụng**: ...&#10;**Cảnh báo**: ...&#10;**Tư vấn Sales**: ...">${(p.points || []).join('\n')}</textarea>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Nhà Cung Cấp Thế Mạnh (Cột 5 - Tuyến 1 | Tuyến 2):</label>
        <input type="text" id="editProdSuppliers" class="form-input" value="${escapeHtml(p.suppliers || '')}" placeholder="Tuyến 1: Kovi, Phạm Dương | Tuyến 2: Kênh bãi TQ, Toàn Cầu" />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
        <div>
          <label class="form-label">Phần Mềm Đi Kèm (Cột 6):</label>
          <input type="text" id="editProdSoftware" class="form-input" value="${escapeHtml(p.software || '')}" placeholder="Ví dụ: GX Works3" />
        </div>
        <div>
          <label class="form-label">Link Brochure / Catalog (Cột 7):</label>
          <input type="text" id="editProdBrochure" class="form-input" value="${escapeHtml(p.brochure || '')}" placeholder="https://..." />
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
        <button type="button" class="btn-del-mini" onclick="handleDeleteProduct(${p.id})" style="margin-right: auto; padding: 0.5rem 0.85rem;" title="Xóa dòng sản phẩm này khỏi bảng">
          🗑️ Xóa Dòng
        </button>
        <button type="button" class="btn-secondary" onclick="closeProductEditModal()">Hủy Bỏ</button>
        <button type="submit" class="btn-primary" style="font-weight: 700;">💾 LƯU THAY ĐỔI</button>
      </div>
    </form>
  `;

  modal.classList.add('active');
}

// Lưu chỉnh sửa sản phẩm
function handleSaveProductEdit(e, id) {
  e.preventDefault();
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data || !data.products) return;
  const p = data.products.find(x => x.id === id);
  if (!p) return;

  p.serial = document.getElementById('editProdSerial').value.trim();
  p.cat = document.getElementById('editProdCat').value.trim();
  p.subcat = document.getElementById('editProdSubcat').value.trim();
  p.status = document.getElementById('editProdStatus').value;
  p.fake = document.getElementById('editProdFake').value;
  p.renew = document.getElementById('editProdRenew').value;

  const rawModels = document.getElementById('editProdModels').value;
  p.models = rawModels.split(/[,;\n]/).map(m => m.trim()).filter(Boolean);

  p.replacement = document.getElementById('editProdReplacement').value.trim();

  const rawPoints = document.getElementById('editProdPoints').value;
  p.points = rawPoints.split('\n').map(pt => pt.trim()).filter(Boolean);

  p.suppliers = document.getElementById('editProdSuppliers').value.trim();
  p.software = document.getElementById('editProdSoftware').value.trim();
  p.brochure = document.getElementById('editProdBrochure').value.trim();

  // Lưu vào localStorage
  localStorage.setItem(`portal_custom_products_${CURRENT_BRAND}`, JSON.stringify(data.products));

  closeProductEditModal();
  applyCatalogFilters();

  // Nếu detailModal đang mở, cập nhật lại luôn
  const detailModalEl = document.getElementById('detailModal');
  if (detailModalEl && detailModalEl.classList.contains('active')) {
    openDetailModal(p.id);
  }

  showToast(`✅ Đã lưu chỉnh sửa dòng: ${p.serial}`);
}

// Xóa sản phẩm
function handleDeleteProduct(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa dòng sản phẩm này khỏi hệ thống?')) return;
  const data = BRAND_DATA[CURRENT_BRAND];
  if (!data || !data.products) return;

  data.products = data.products.filter(x => x.id !== id);
  localStorage.setItem(`portal_custom_products_${CURRENT_BRAND}`, JSON.stringify(data.products));

  closeProductEditModal();
  closeModal();
  applyCatalogFilters();
  showToast('🗑️ Đã xóa dòng sản phẩm.');
}

// 2. Chỉnh sửa hồ sơ Nhà Cung Cấp trực tiếp trong Popup
function openEditSupplierModal(supId) {
  const curBrandData = BRAND_DATA[CURRENT_BRAND] || {};
  const directory = curBrandData.suppliersDirectory || [];
  const s = directory.find(x => x.id === supId);
  if (!s) return;

  const modal = document.getElementById('supplierEditModal');
  const container = document.getElementById('supplierEditModalContent');
  if (!modal || !container) return;

  container.innerHTML = `
    <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
      <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
        <span>✏️</span> <span>Sửa Hồ Sơ NCC: <span style="color: var(--accent-blue);">${s.shortName || s.name}</span></span>
      </h3>
    </div>

    <form onsubmit="handleSaveSupplierEdit(event, '${s.id}')">
      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Tên Pháp Lý Đầy Đủ:</label>
        <input type="text" id="editSupName" class="form-input" value="${escapeHtml(s.name)}" required />
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <label class="form-label">Tên Gọi Ngắn Gọn:</label>
          <input type="text" id="editSupShort" class="form-input" value="${escapeHtml(s.shortName || '')}" />
        </div>
        <div>
          <label class="form-label">Phân Loại / Badge:</label>
          <input type="text" id="editSupBadge" class="form-input" value="${escapeHtml(s.badge || '')}" />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <label class="form-label">Website:</label>
          <input type="text" id="editSupWeb" class="form-input" value="${escapeHtml(s.website || '')}" />
        </div>
        <div>
          <label class="form-label">Hotline / Điện Thoại:</label>
          <input type="text" id="editSupPhone" class="form-input" value="${escapeHtml(s.phone || '')}" />
        </div>
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Địa Chỉ Trụ Sở / Kho Hàng:</label>
        <input type="text" id="editSupAddr" class="form-input" value="${escapeHtml(s.address || '')}" />
      </div>

      <div style="margin-bottom: 0.75rem;">
        <label class="form-label">Mặt Hàng Thế Mạnh Cho Hãng Này:</label>
        <textarea id="editSupStrengths" class="form-input" rows="2">${escapeHtml(s.keyStrengths || '')}</textarea>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
        <div>
          <label class="form-label">Ưu Điểm & Chính Sách Giá:</label>
          <textarea id="editSupPros" class="form-input" rows="2">${escapeHtml(s.pros || '')}</textarea>
        </div>
        <div>
          <label class="form-label">Rủi Ro & Điểm Yếu Cần Chú Ý:</label>
          <textarea id="editSupCons" class="form-input" rows="2">${escapeHtml(s.cons || '')}</textarea>
        </div>
      </div>

      <div style="margin-bottom: 1.25rem;">
        <label class="form-label">Khuyến Nghị Mua Hàng & Bí Quyết Thực Chiến:</label>
        <textarea id="editSupGuide" class="form-input" rows="2">${escapeHtml(s.buyingGuide || '')}</textarea>
      </div>

      <div style="display: flex; gap: 0.75rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
        <button type="button" class="btn-secondary" onclick="closeSupplierEditModal()">Hủy Bỏ</button>
        <button type="submit" class="btn-primary" style="font-weight: 700;">💾 LƯU HỒ SƠ NCC</button>
      </div>
    </form>
  `;

  modal.classList.add('active');
}

// Lưu chỉnh sửa nhà cung cấp
function handleSaveSupplierEdit(e, supId) {
  e.preventDefault();
  const curBrandData = BRAND_DATA[CURRENT_BRAND] || {};
  const directory = curBrandData.suppliersDirectory || [];
  const s = directory.find(x => x.id === supId);
  if (!s) return;

  s.name = document.getElementById('editSupName').value.trim();
  s.shortName = document.getElementById('editSupShort').value.trim();
  s.badge = document.getElementById('editSupBadge').value.trim();
  s.website = document.getElementById('editSupWeb').value.trim();
  s.phone = document.getElementById('editSupPhone').value.trim();
  s.address = document.getElementById('editSupAddr').value.trim();
  s.keyStrengths = document.getElementById('editSupStrengths').value.trim();
  s.pros = document.getElementById('editSupPros').value.trim();
  s.cons = document.getElementById('editSupCons').value.trim();
  s.buyingGuide = document.getElementById('editSupGuide').value.trim();

  // Lưu vào localStorage
  localStorage.setItem(`portal_custom_suppliers_${CURRENT_BRAND}`, JSON.stringify(directory));

  closeSupplierEditModal();

  const supModal = document.getElementById('supplierDetailModal');
  if (supModal && supModal.classList.contains('active')) {
    renderSupplierModalForProductTier(window._lastSupplierModalProd, window._lastSupplierModalTier);
  }

  showToast(`✅ Đã cập nhật hồ sơ NCC: ${s.shortName || s.name}`);
}

// ==============================================================
// ==============================================================
// MODULE: EXCEL-LIKE RESIZABLE TABLE COLUMNS WITH DYNAMIC COLUMNS & HORIZONTAL SCROLL
// ==============================================================
const DEFAULT_CATALOG_COL_WIDTHS = [50, 260, 200, 380, 260, 140, 130];

function initResizableColumns() {
  const table = document.getElementById('catalogTable');
  if (!table) return;

  const thead = table.querySelector('thead');
  if (!thead) return;

  const ths = Array.from(thead.querySelectorAll('th'));
  if (!ths.length) return;

  // Ghi nhớ kích thước ban đầu từ HTML vào attribute để phục vụ reset động khi thêm/bớt cột
  ths.forEach((th, idx) => {
    if (!th.getAttribute('data-init-width')) {
      const initW = parseInt(th.style.width, 10) || DEFAULT_CATALOG_COL_WIDTHS[idx] || th.offsetWidth || 150;
      th.setAttribute('data-init-width', initW);
    }
  });

  // 1. Áp dụng kích thước đã lưu hoặc mặc định, đồng thời cân chỉnh vừa khít 100% màn hình
  applySavedColumnWidths(table, ths);

  // 2. Chèn handle resizer vào mỗi cột (trừ cột cuối cùng giáp mép phải)
  ths.forEach((th, idx) => {
    // Tránh chèn trùng lặp nếu hàm được gọi lại
    if (th.querySelector('.col-resizer')) return;

    // Cột cuối cùng không cần handle resizer bên phải
    if (idx === ths.length - 1) return;

    const resizer = document.createElement('span');
    resizer.className = 'col-resizer';
    resizer.title = 'Kéo chuột để chỉnh độ rộng cột (Nhấp đúp để tự căn chỉnh)';

    // Bắt đầu kéo thả
    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.pageX;
      const container = table.closest('.table-container');
      const containerW = container ? container.clientWidth : 0;

      // Đọc kích thước hiện tại của tất cả các cột
      const initialWidths = ths.map(h => parseInt(h.style.width, 10) || h.offsetWidth);
      const startTotalW = initialWidths.reduce((a, b) => a + b, 0);

      const minW_current = parseInt(th.style.minWidth, 10) || 45;
      const nextTh = ths[idx + 1];

      resizer.classList.add('is-resizing');
      document.body.classList.add('is-resizing-table-col');

      const onMouseMove = (moveEvt) => {
        const dx = moveEvt.pageX - startX;

        if (dx < 0) {
          // KỊCH BẢN 1: CO NHỎ CỘT (kéo sang trái)
          // Cột hiện tại co lại nhưng không nhỏ hơn minWidth
          const targetW = Math.max(minW_current, initialWidths[idx] + dx);
          const actualShrink = initialWidths[idx] - targetW;
          th.style.width = targetW + 'px';

          if (startTotalW > containerW) {
            // Nếu trước đó bảng đang cuộn ngang (rộng hơn container):
            const newTotal = startTotalW - actualShrink;
            if (newTotal >= containerW) {
              // Vẫn lớn hơn hoặc bằng container: cột kế bên giữ nguyên kích thước, thanh cuộn co lại
              if (nextTh) nextTh.style.width = initialWidths[idx + 1] + 'px';
            } else {
              // Bị hụt dưới container: Cột kế bên mở rộng phần bù thiếu để tổng bảng luôn bảo toàn 100%
              const overflow = containerW - newTotal;
              if (nextTh) nextTh.style.width = (initialWidths[idx + 1] + overflow) + 'px';
            }
          } else {
            // Nếu bảng đang vừa khít 100% màn hình: Cột kế bên tự động mở rộng đúng bằng lượng co lại
            if (nextTh) {
              nextTh.style.width = (initialWidths[idx + 1] + actualShrink) + 'px';
            }
          }
        } else {
          // KỊCH BẢN 2: KÉO RỘNG CỘT (kéo sang phải)
          // Cột hiện tại nở to ra, giữ nguyên các cột khác và đẩy chúng dạt sang phải
          th.style.width = (initialWidths[idx] + dx) + 'px';
          if (nextTh) {
            nextTh.style.width = initialWidths[idx + 1] + 'px';
          }
        }

        updateTableLayout(table, ths);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        resizer.classList.remove('is-resizing');
        document.body.classList.remove('is-resizing-table-col');

        // Lưu kích thước vào localStorage
        saveColumnWidths(table, ths);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    // Double click: Tự động căn chỉnh theo nội dung
    resizer.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      autoFitColumn(table, th, idx);
    });

    th.appendChild(resizer);
  });

  // 3. Tự động cập nhật khi container thay đổi kích thước (thu/phóng sidebar, resize cửa sổ)
  const container = table.closest('.table-container');
  if (container && !window._tableContainerObserver) {
    window._tableContainerObserver = new ResizeObserver(() => {
      if (container.clientWidth > 0) {
        fitColumnsToContainer(table, ths);
      }
    });
    window._tableContainerObserver.observe(container);
  }
}

// Cân đối các cột tự động giãn đều để phủ kín 100% container (không bao giờ hở khoảng trắng)
function fitColumnsToContainer(table, ths) {
  const container = table.closest('.table-container');
  if (!container) return;
  const containerW = container.clientWidth;
  if (!containerW || containerW <= 0) return;

  const currentWidths = ths.map(h => parseInt(h.style.width, 10) || h.offsetWidth);
  const totalW = currentWidths.reduce((sum, w) => sum + w, 0);

  // Nếu tổng bề rộng các cột nhỏ hơn bề rộng container: Tự động kéo dãn để vừa khít 100% màn hình
  if (totalW < containerW && totalW > 0) {
    const scale = containerW / totalW;
    let distributedSum = 0;
    const newWidths = currentWidths.map((w, idx) => {
      if (idx === currentWidths.length - 1) {
        return Math.max(parseInt(ths[idx].style.minWidth, 10) || 45, containerW - distributedSum);
      }
      const minW = parseInt(ths[idx].style.minWidth, 10) || 45;
      const nw = Math.max(minW, Math.round(w * scale));
      distributedSum += nw;
      return nw;
    });

    ths.forEach((th, idx) => {
      th.style.width = newWidths[idx] + 'px';
    });
  }

  updateTableLayout(table, ths);
}

// Cập nhật chế độ hiển thị của bảng: 100% nếu vừa màn hình, hoặc Pixel cụ thể nếu nở rộng vượt màn hình (cuộn ngang)
function updateTableLayout(table, ths) {
  const container = table.closest('.table-container');
  const containerW = container ? container.clientWidth : 0;
  const totalW = ths.reduce((sum, h) => sum + (parseInt(h.style.width, 10) || h.offsetWidth), 0);

  if (containerW > 0 && totalW > containerW) {
    // Kích hoạt chế độ cuộn ngang Google Sheets
    table.style.width = totalW + 'px';
    table.style.minWidth = totalW + 'px';
  } else {
    // Giữ nguyên 100% vừa khít màn hình
    table.style.width = '100%';
    table.style.minWidth = '100%';
  }

  if (container) {
    container.style.removeProperty('width');
    container.style.removeProperty('min-width');
  }
}

function saveColumnWidths(table, ths) {
  const widths = ths.map(h => parseInt(h.style.width, 10) || h.offsetWidth);
  try {
    localStorage.setItem(`portal_col_widths_${CURRENT_BRAND}`, JSON.stringify(widths));
    localStorage.setItem('portal_col_widths_default', JSON.stringify(widths));
  } catch (err) {}
}

function applySavedColumnWidths(table, ths) {
  let saved = null;
  try {
    const raw = localStorage.getItem(`portal_col_widths_${CURRENT_BRAND}`) || localStorage.getItem('portal_col_widths_default');
    if (raw) saved = JSON.parse(raw);
  } catch (err) {}

  // Chỉ áp dụng nếu số cột đã lưu trùng khớp số cột thực tế của bảng (hỗ trợ động thêm/bớt cột)
  if (saved && Array.isArray(saved) && saved.length === ths.length) {
    ths.forEach((th, idx) => {
      if (saved[idx]) {
        th.style.width = saved[idx] + 'px';
      }
    });
  } else {
    // Lấy kích thước mặc định từ HTML data-init-width hoặc style ban đầu
    ths.forEach((th, idx) => {
      const initW = parseInt(th.getAttribute('data-init-width'), 10) || DEFAULT_CATALOG_COL_WIDTHS[idx] || (th.offsetWidth || 150);
      th.style.width = initW + 'px';
    });
  }

  fitColumnsToContainer(table, ths);
}

function resetColumnWidths() {
  const table = document.getElementById('catalogTable');
  if (!table) return;
  const ths = Array.from(table.querySelectorAll('thead th'));
  if (!ths.length) return;

  try {
    localStorage.removeItem(`portal_col_widths_${CURRENT_BRAND}`);
    localStorage.removeItem('portal_col_widths_default');
  } catch (err) {}

  ths.forEach((th, idx) => {
    const initW = parseInt(th.getAttribute('data-init-width'), 10) || DEFAULT_CATALOG_COL_WIDTHS[idx] || 150;
    th.style.width = initW + 'px';
  });

  fitColumnsToContainer(table, ths);
  showToast('🔄 Đã khôi phục độ rộng các cột về chuẩn mặc định!');
}

function autoFitColumn(table, th, colIdx) {
  const rows = table.querySelectorAll('tbody tr');
  let maxLen = (th.innerText || '').length;
  rows.forEach(tr => {
    const td = tr.children[colIdx];
    if (td) {
      const text = td.innerText || '';
      const lines = text.split('\n');
      lines.forEach(l => {
        if (l.trim().length > maxLen) maxLen = l.trim().length;
      });
    }
  });

  const minW = parseInt(th.style.minWidth, 10) || 45;
  let fitW = Math.min(600, Math.max(minW, Math.round(maxLen * 8.2) + 28));
  th.style.width = fitW + 'px';

  const ths = Array.from(table.querySelectorAll('thead th'));
  updateTableLayout(table, ths);
  saveColumnWidths(table, ths);
  showToast(`📐 Đã căn chỉnh cột "${th.innerText.replace('▼', '').replace('▲', '').trim()}": ${fitW}px`);
}



// =========================================================================
// ===== ADMIN AUTHENTICATION & PROPOSALS / NOTES MANAGEMENT SYSTEM =====
// =========================================================================

const ADMIN_CREDENTIALS = {
  username: 'daco.admin',
  password: 'Daco@1915'
};

function isAdminLoggedIn() {
  return sessionStorage.getItem('DACO_ADMIN_LOGGED_IN') === 'true';
}

function updateAuthUI() {
  const container = document.getElementById('headerAuthContainer');
  if (!container) return;

  if (isAdminLoggedIn()) {
    container.innerHTML = `
      <div class="admin-badge-pill" title="Đang đăng nhập với quyền Quản trị viên">
        <span>👑</span> <span>daco.admin</span>
        <button class="btn-logout-small" onclick="handleAdminLogout()">[Đăng xuất]</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-auth-login" id="btnHeaderLogin" onclick="openAdminLoginModal()" title="Đăng nhập dành cho Quản trị viên">
        <span>🔐</span> <span class="auth-btn-text">Đăng Nhập Admin</span>
      </button>
    `;
  }
}

function openAdminLoginModal(customMessage) {
  const modal = document.getElementById('adminLoginModal');
  const err = document.getElementById('adminLoginError');
  if (err) {
    if (customMessage) {
      err.innerText = customMessage;
      err.style.display = 'block';
      err.style.color = 'var(--accent-blue)';
    } else {
      err.style.display = 'none';
      err.style.color = '#ef4444';
    }
  }
  if (modal) modal.classList.add('active');
  const userInp = document.getElementById('adminUsernameInput');
  if (userInp) setTimeout(() => userInp.focus(), 150);
}

function closeAdminLoginModal() {
  const modal = document.getElementById('adminLoginModal');
  if (modal) modal.classList.remove('active');
  const err = document.getElementById('adminLoginError');
  if (err) err.style.display = 'none';
}

function submitAdminLogin(e) {
  if (e) e.preventDefault();
  const u = (document.getElementById('adminUsernameInput').value || '').trim();
  const p = (document.getElementById('adminPasswordInput').value || '').trim();
  const err = document.getElementById('adminLoginError');

  if (u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem('DACO_ADMIN_LOGGED_IN', 'true');
    sessionStorage.setItem('DACO_ADMIN_USER', u);
    closeAdminLoginModal();
    updateAuthUI();
    showToast('👑 Đăng nhập Quản trị viên (Admin) thành công!');

    // Re-render views to unlock admin controls
    if (CURRENT_VIEW === 'brand') {
      const data = BRAND_DATA[CURRENT_BRAND];
      if (data && data.products) renderProductsTable(data.products);
    } else if (CURRENT_VIEW === 'notes') {
      renderProposalsList();
    } else if (CURRENT_VIEW === 'admin') {
      // Refresh admin view
    }
  } else {
    if (err) {
      err.innerText = '❌ Sai tài khoản hoặc mật khẩu! (Lưu ý: Mật khẩu có chữ D viết hoa: Daco@1915)';
      err.style.display = 'block';
      err.style.color = '#ef4444';
    }
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem('DACO_ADMIN_LOGGED_IN');
  sessionStorage.removeItem('DACO_ADMIN_USER');
  updateAuthUI();
  showToast('Đã đăng xuất khỏi tài khoản Quản trị viên.');

  if (CURRENT_VIEW === 'admin') {
    switchBrand(CURRENT_BRAND);
  } else if (CURRENT_VIEW === 'brand') {
    const data = BRAND_DATA[CURRENT_BRAND];
    if (data && data.products) renderProductsTable(data.products);
  } else if (CURRENT_VIEW === 'notes') {
    renderProposalsList();
  }
}

// ===== PROPOSALS & NOTES MANAGEMENT =====

const DEFAULT_PROPOSALS = [
  {
    id: 1,
    author: 'Hải (Sales Hà Nội)',
    brand: 'proface',
    productSerial: 'Pro-face PFXET6400WAD',
    type: 'price_supplier',
    typeText: 'Ghi chú Giá & Tồn kho NCC',
    content: 'Đại lý Hợp Long báo tồn kho ET6400WAD hiện còn hơn 25 bộ tại kho Long Biên, chiết khấu thêm 3.5% cho đơn dự án số lượng từ 3 bộ trở lên. Đề xuất cập nhật vào hồ sơ nhà cung cấp để anh em Sales chào giá cạnh tranh.',
    link: '',
    status: 'approved',
    date: '07/10/2026 14:15',
    adminComment: 'Admin đã duyệt: Đã ghi nhận vào hồ sơ thế mạnh Hợp Long.'
  },
  {
    id: 2,
    author: 'Lan (Thu Mua - Purchasing)',
    brand: 'brother',
    productSerial: 'PT-E850TKW',
    type: 'spec',
    typeText: 'Sửa thông số / Model',
    content: 'Khách hàng tủ điện hỏi nhiều về việc máy in ống lồng PT-E850TKW có in được ống co nhiệt và ống PVC Max LM không. Đề xuất bổ sung ghi chú kỹ thuật: Máy tương thích cả ống lồng Brother và ống PVC tiêu chuẩn Ø2.5 - 6.5mm.',
    link: '',
    status: 'pending',
    date: '08/10/2026 09:30',
    adminComment: ''
  },
  {
    id: 3,
    author: 'Minh (Kỹ Thuật Hỗ Trợ Dự Án)',
    brand: 'mitsubishi',
    productSerial: 'FX5U / FX5UC (MELSEC iQ-F)',
    type: 'catalog',
    typeText: 'Cập nhật Catalogue / File',
    content: 'Gửi Admin file tài liệu hướng dẫn đấu nối & lập trình PLC FX5U tiếng Việt bản chuẩn từ Mitsubishi Electric VN để bổ sung vào mục Tài Liệu cho khách hàng tải.',
    link: 'https://www.mitsubishielectric.com/fa/products/cnt/plc/pmerit/iq-f/',
    status: 'pending',
    date: '08/10/2026 11:20',
    adminComment: ''
  }
];

function getProposals() {
  const saved = localStorage.getItem('DACO_PORTAL_PROPOSALS');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {
      return DEFAULT_PROPOSALS;
    }
  }
  localStorage.setItem('DACO_PORTAL_PROPOSALS', JSON.stringify(DEFAULT_PROPOSALS));
  return DEFAULT_PROPOSALS;
}

function saveProposals(list) {
  localStorage.setItem('DACO_PORTAL_PROPOSALS', JSON.stringify(list));
  updateNotesBadges();
}

function updateNotesBadges() {
  const list = getProposals();
  const pendingCount = list.filter(p => p.status === 'pending').length;
  
  const sidebarBadge = document.getElementById('sidebarNotesBadge');
  if (sidebarBadge) {
    sidebarBadge.innerText = pendingCount;
    sidebarBadge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
  }

  const headerCounter = document.getElementById('notesHeaderCounter');
  if (headerCounter) {
    headerCounter.innerText = `${list.length} ghi chú (${pendingCount} chờ duyệt)`;
  }
}

function renderProposalsList() {
  const container = document.getElementById('proposalsListContainer');
  if (!container) return;

  const brandFilter = document.getElementById('notesFilterBrand')?.value || 'all';
  const statusFilter = document.getElementById('notesFilterStatus')?.value || 'all';
  const typeFilter = document.getElementById('notesFilterType')?.value || 'all';

  let list = getProposals();

  // Apply filters
  if (brandFilter !== 'all') {
    list = list.filter(item => item.brand === brandFilter);
  }
  if (statusFilter !== 'all') {
    list = list.filter(item => item.status === statusFilter);
  }
  if (typeFilter !== 'all') {
    list = list.filter(item => item.type === typeFilter);
  }

  if (!list.length) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color); color: var(--text-dim);">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📭</div>
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Chưa có ghi chú nào phù hợp bộ lọc</div>
        <p style="font-size: 0.82rem;">Hãy gửi ghi chú mới nếu bạn có thông tin cần cập nhật hoặc đổi tiêu chí lọc.</p>
      </div>
    `;
    return;
  }

  const brandNameMap = {
    'mitsubishi': 'Mitsubishi Electric',
    'qlight': 'Qlight',
    'brother': 'Brother',
    'proface': 'Pro-face',
    'mitutoyo': 'Mitutoyo',
    'omron': 'Omron',
    'autonics': 'Autonics',
    'patlite': 'Patlite',
    'zebra': 'Zebra',
    'other': 'Toàn Hệ Thống'
  };

  const statusLabelMap = {
    'pending': { text: '⏳ Chờ Admin Duyệt', cls: 'pending' },
    'approved': { text: '✅ Đã Duyệt & Áp Dụng', cls: 'approved' },
    'rejected': { text: '❌ Đã Từ Chối', cls: 'rejected' }
  };

  const isAdmin = isAdminLoggedIn();

  container.innerHTML = list.map(item => {
    const sInfo = statusLabelMap[item.status] || { text: item.status, cls: 'pending' };
    const bName = brandNameMap[item.brand] || (item.brand ? item.brand.toUpperCase() : 'Hệ Thống');

    return `
      <div class="proposal-card ${sInfo.cls}" id="proposalCard-${item.id}">
        <div class="proposal-top-row">
          <div class="proposal-meta-left">
            <span class="proposal-status-badge ${sInfo.cls}">${sInfo.text}</span>
            <span class="proposal-type-badge">${escapeHtml(item.typeText || item.type)}</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent-blue);">${escapeHtml(bName)}</span>
            ${item.productSerial ? `<span style="font-size: 0.82rem; font-weight: 800; color: var(--text-main);">• ${escapeHtml(item.productSerial)}</span>` : ''}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">
            <span>${escapeHtml(item.date)}</span>
          </div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.45rem;">
          Người đề xuất: <b style="color: var(--text-main);">${escapeHtml(item.author)}</b>
        </div>

        <div class="proposal-content">${escapeHtml(item.content)}</div>

        ${item.link ? `
          <div class="proposal-link-box">
            <span>🔗 Tài liệu đính kèm:</span>
            <a href="${escapeHtml(item.link)}" target="_blank" style="color: var(--accent-blue); word-break: break-all; text-decoration: underline;">${escapeHtml(item.link)}</a>
          </div>
        ` : ''}

        ${item.adminComment ? `
          <div class="proposal-admin-feedback">
            <b>🛡️ Ý kiến Quản trị viên:</b> ${escapeHtml(item.adminComment)}
          </div>
        ` : ''}

        ${isAdmin ? `
          <div class="proposal-actions-row">
            <span style="font-size: 0.76rem; color: var(--text-dim); margin-right: auto;">Quyền Admin:</span>
            ${item.status === 'pending' ? `
              <button class="btn-primary btn-sm" onclick="adminApproveProposal(${item.id})" style="background: var(--gradient-success); font-weight: 700; font-size: 0.78rem; padding: 4px 10px;">
                ✅ Duyệt & Cập Nhật
              </button>
              <button class="btn-secondary btn-sm" onclick="adminRejectProposal(${item.id})" style="color: #ef4444; font-weight: 700; font-size: 0.78rem; padding: 4px 10px;">
                ❌ Từ Chối
              </button>
            ` : ''}
            <button class="btn-secondary btn-sm" onclick="adminDeleteProposal(${item.id})" style="color: var(--text-muted); font-size: 0.78rem; padding: 4px 8px;">
              🗑️ Xóa
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function openNoteProposalModal(productId, productSerial, cat) {
  const modal = document.getElementById('noteProposalModal');
  if (!modal) return;

  const brandSelect = document.getElementById('proposalBrandSelect');
  const serialInp = document.getElementById('proposalProductSerialInput');
  const idInp = document.getElementById('proposalProductId');
  const authorInp = document.getElementById('proposalAuthorInput');

  if (brandSelect && CURRENT_BRAND) brandSelect.value = CURRENT_BRAND;
  if (serialInp) serialInp.value = productSerial || '';
  if (idInp) idInp.value = productId || '';

  // Remember author name in session
  const lastAuthor = sessionStorage.getItem('DACO_LAST_PROPOSAL_AUTHOR') || '';
  if (authorInp && lastAuthor) authorInp.value = lastAuthor;

  modal.classList.add('active');
  const contentInp = document.getElementById('proposalContentInput');
  if (contentInp) setTimeout(() => contentInp.focus(), 150);
}

function closeNoteProposalModal() {
  const modal = document.getElementById('noteProposalModal');
  if (modal) modal.classList.remove('active');
}

function submitNoteProposal(e) {
  if (e) e.preventDefault();

  const author = (document.getElementById('proposalAuthorInput')?.value || '').trim();
  const brand = document.getElementById('proposalBrandSelect')?.value || CURRENT_BRAND || 'other';
  const productSerial = (document.getElementById('proposalProductSerialInput')?.value || '').trim();
  const typeSelect = document.getElementById('proposalTypeSelect');
  const type = typeSelect?.value || 'spec';
  const typeText = typeSelect?.options[typeSelect.selectedIndex]?.text || 'Ghi chú';
  const content = (document.getElementById('proposalContentInput')?.value || '').trim();
  const link = (document.getElementById('proposalLinkInput')?.value || '').trim();

  if (!author || !content) {
    alert('Vui lòng điền họ tên/bộ phận và nội dung đề xuất!');
    return;
  }

  sessionStorage.setItem('DACO_LAST_PROPOSAL_AUTHOR', author);

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const list = getProposals();
  const newId = list.length ? Math.max(...list.map(x => x.id || 0)) + 1 : 1;

  const newProposal = {
    id: newId,
    author: author,
    brand: brand,
    productSerial: productSerial,
    type: type,
    typeText: typeText,
    content: content,
    link: link,
    status: 'pending',
    date: dateStr,
    adminComment: ''
  };

  list.unshift(newProposal);
  saveProposals(list);

  closeNoteProposalModal();
  document.getElementById('noteProposalForm')?.reset();

  showToast('📨 Đề xuất của bạn đã được gửi thành công! Admin sẽ duyệt và cập nhật sớm.');

  if (CURRENT_VIEW === 'notes') {
    renderProposalsList();
  }
}

function adminApproveProposal(id) {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal('Bạn cần đăng nhập Admin để thực hiện thao tác này.');
    return;
  }
  const comment = prompt('Nhập phản hồi/ghi chú của Admin khi duyệt (có thể để trống):', 'Admin đã duyệt và cập nhật vào hệ thống.');
  if (comment === null) return; // user cancelled

  const list = getProposals();
  const item = list.find(x => x.id === id);
  if (item) {
    item.status = 'approved';
    item.adminComment = comment || 'Admin đã duyệt thành công.';
    saveProposals(list);
    renderProposalsList();
    showToast(`✅ Đã phê duyệt đề xuất #${id}!`);
  }
}

function adminRejectProposal(id) {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal('Bạn cần đăng nhập Admin để thực hiện thao tác này.');
    return;
  }
  const comment = prompt('Lý do từ chối đề xuất này:', 'Thông tin chưa đủ căn cứ hoặc đã có phương án thay thế.');
  if (comment === null) return;

  const list = getProposals();
  const item = list.find(x => x.id === id);
  if (item) {
    item.status = 'rejected';
    item.adminComment = comment || 'Admin đã từ chối đề xuất này.';
    saveProposals(list);
    renderProposalsList();
    showToast(`❌ Đã từ chối đề xuất #${id}!`);
  }
}

function adminDeleteProposal(id) {
  if (!isAdminLoggedIn()) {
    openAdminLoginModal('Bạn cần đăng nhập Admin để thực hiện thao tác này.');
    return;
  }
  if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú #${id} này không?`)) return;

  let list = getProposals();
  list = list.filter(x => x.id !== id);
  saveProposals(list);
  renderProposalsList();
  showToast(`🗑️ Đã xóa ghi chú #${id}!`);
}


  // Khởi tạo Auth UI và Badge Ghi chú
  updateAuthUI();
  updateNotesBadges();
