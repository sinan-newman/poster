// Scholarship Poster Studio Application Logic

document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selectors ---
  const posterContainer = document.getElementById('posterContainer');
  const canvasDimLabel = document.getElementById('canvasDimLabel');

  // Input Elements
  const inputBadge = document.getElementById('inputBadge');
  const inputQrLabel = document.getElementById('inputQrLabel');
  const inputTitle = document.getElementById('inputTitle');
  const inputTagline = document.getElementById('inputTagline');
  const inputEligibility = document.getElementById('inputEligibility');
  const inputDeadline = document.getElementById('inputDeadline');
  const inputAmount = document.getElementById('inputAmount');
  const inputWebsite = document.getElementById('inputWebsite');
  const toggleLogo = document.getElementById('toggleLogo');
  const toggleQr = document.getElementById('toggleQr');

  // Display Elements in Canvas
  const displayBadge = document.getElementById('displayBadge');
  const displayQrLabelTop = document.getElementById('displayQrLabelTop');
  const topQrContainer = document.getElementById('topQrContainer');
  const displayTitle = document.getElementById('displayTitle');
  const displayTagline = document.getElementById('displayTagline');
  const displayEligibility = document.getElementById('displayEligibility');
  const displayDeadline = document.getElementById('displayDeadline');
  const displayAmount = document.getElementById('displayAmount');
  const displayWebsite = document.getElementById('displayWebsite');
  const brandLogoContainer = document.getElementById('brandLogoContainer');
  const displayLogoImg = document.getElementById('displayLogoImg');
  const displayQrImgTop = document.getElementById('displayQrImgTop');

  // Pre-load offline Base64 brand assets to prevent CORS/permission blocks
  if (window.SCHOLARISE_ASSETS) {
    if (displayLogoImg && window.SCHOLARISE_ASSETS.logoPng) {
      displayLogoImg.src = window.SCHOLARISE_ASSETS.logoPng;
    }
    if (displayQrImgTop && window.SCHOLARISE_ASSETS.whatsappQrJpg) {
      displayQrImgTop.src = window.SCHOLARISE_ASSETS.whatsappQrJpg;
    }
  }

  // Top Search Combobox (A to Z)
  const topSearchWrapper = document.getElementById('topSearchWrapper');
  const topSearchInput = document.getElementById('topSearchInput');
  const btnClearTopSearch = document.getElementById('btnClearTopSearch');
  const topSearchResults = document.getElementById('topSearchResults');

  // Controls & Modals
  const btnReset = document.getElementById('btnReset');
  const btnExportPng = document.getElementById('btnExportPng');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const btnCopyImage = document.getElementById('btnCopyImage');
  const exportModal = document.getElementById('exportModal');
  const customImageInput = document.getElementById('customImageInput');
  const customImagePreview = document.getElementById('customImagePreview');

  // Live Database Modal Elements
  const btnBrowseDb = document.getElementById('btnBrowseDb');
  const browseModal = document.getElementById('browseModal');
  const btnCloseBrowseModal = document.getElementById('btnCloseBrowseModal');
  const dbSearchInput = document.getElementById('dbSearchInput');
  const dbCategoryFilter = document.getElementById('dbCategoryFilter');
  const dbScholarshipList = document.getElementById('dbScholarshipList');
  const scholarshipCountBadge = document.getElementById('scholarshipCountBadge');

  // Theme & Aspect Ratio buttons
  const themeButtons = document.querySelectorAll('.theme-card');
  const ratioButtons = document.querySelectorAll('.ratio-btn');
  const graphicButtons = document.querySelectorAll('.graphic-choice');

  // Graphic items in DOM
  const graphicItems = {
    'books-cap': document.getElementById('graphicBooksCap'),
    'diploma': document.getElementById('graphicDiploma'),
    'library-arch': document.getElementById('graphicArch'),
    'custom': document.getElementById('graphicCustom')
  };

  // --- Full Date Formatter ("23 November 2026") ---
  function formatFullDate(raw) {
    if (!raw) return 'Open / Ongoing';
    const str = String(raw).trim();
    if (str.toLowerCase().includes('open') || str.toLowerCase().includes('ongoing')) {
      return str;
    }

    // 1. If ISO date or YYYY-MM-DD
    const isoMatch = str.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, y, m, d] = isoMatch;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = months[parseInt(m, 10) - 1] || m;
      return `${parseInt(d, 10)} ${monthName} ${y}`;
    }

    // 2. If DD MMM YYYY (e.g. 23 NOV 2026)
    const dmmmyMatch = str.match(/(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
    if (dmmmyMatch) {
      const [, d, monStr, y] = dmmmyMatch;
      const mLow = monStr.toLowerCase().slice(0, 3);
      const mNames = {
        jan: 'January', feb: 'February', mar: 'March', apr: 'April', may: 'May', jun: 'June',
        jul: 'July', aug: 'August', sep: 'September', oct: 'October', nov: 'November', dec: 'December'
      };
      const monthName = mNames[mLow] || monStr;
      return `${parseInt(d, 10)} ${monthName} ${y}`;
    }

    return str;
  }

  // Helper to convert HTML into clean multi-line text with bullets
  function cleanHtmlText(htmlStr) {
    if (!htmlStr) return '';
    const str = String(htmlStr).trim();
    if (!str.includes('<') && !str.includes('>')) return str;

    const div = document.createElement('div');
    div.innerHTML = str;

    div.querySelectorAll('li').forEach(li => {
      li.prepend(document.createTextNode('• '));
      li.append(document.createTextNode('\n'));
    });

    div.querySelectorAll('p, br, div, h1, h2, h3, h4').forEach(el => {
      el.append(document.createTextNode('\n'));
    });

    const rawText = div.innerText || div.textContent || '';
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    return lines.join('\n');
  }

  // --- Real-Time Input Binding ---
  function bindInput(inputEl, displayEl) {
    if (!inputEl || !displayEl) return;
    inputEl.addEventListener('input', () => {
      displayEl.textContent = inputEl.value;
    });
  }

  bindInput(inputBadge, displayBadge);
  inputBadge.addEventListener('change', () => {
    displayBadge.textContent = inputBadge.value;
  });
  bindInput(inputQrLabel, displayQrLabelTop);
  bindInput(inputTitle, displayTitle);

  // Sub-tagline binding (hides element when blank to keep layout tight)
  inputTagline.addEventListener('input', () => {
    displayTagline.textContent = inputTagline.value;
    if (!inputTagline.value.trim()) {
      displayTagline.classList.add('hidden');
    } else {
      displayTagline.classList.remove('hidden');
    }
  });

  bindInput(inputDeadline, displayDeadline);
  bindInput(inputAmount, displayAmount);
  bindInput(inputWebsite, displayWebsite);

  inputEligibility.addEventListener('input', () => {
    displayEligibility.textContent = inputEligibility.value;
  });

  // Logo Toggle
  toggleLogo.addEventListener('change', () => {
    if (toggleLogo.checked) {
      brandLogoContainer.classList.remove('hidden');
    } else {
      brandLogoContainer.classList.add('hidden');
    }
  });

  // Top WhatsApp QR Toggle
  toggleQr.addEventListener('change', () => {
    if (toggleQr.checked) {
      topQrContainer.classList.remove('hidden');
    } else {
      topQrContainer.classList.add('hidden');
    }
  });

  // --- Theme Selection ---
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    posterContainer.classList.remove('theme-teal', 'theme-lavender', 'theme-editorial', 'theme-navy-yellow');
    posterContainer.classList.add(`theme-${theme}`);

    themeButtons.forEach(btn => {
      if (btn.dataset.theme === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Aspect Ratio Selection ---
  ratioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const ratio = btn.dataset.ratio;
      setRatio(ratio);
    });
  });

  function setRatio(ratio) {
    posterContainer.classList.remove('ratio-portrait', 'ratio-square', 'ratio-story');
    posterContainer.classList.add(`ratio-${ratio}`);

    ratioButtons.forEach(btn => {
      if (btn.dataset.ratio === ratio) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (ratio === 'portrait') {
      canvasDimLabel.textContent = '1080 × 1350 px (4:5)';
    } else if (ratio === 'square') {
      canvasDimLabel.textContent = '1080 × 1080 px (1:1)';
    } else if (ratio === 'story') {
      canvasDimLabel.textContent = '1080 × 1920 px (9:16)';
    }
  }

  // --- Graphic Selection ---
  graphicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const graphic = btn.dataset.graphic;
      setGraphic(graphic);
    });
  });

  function setGraphic(graphic) {
    Object.keys(graphicItems).forEach(key => {
      if (key === graphic) {
        graphicItems[key].classList.remove('hidden');
      } else {
        graphicItems[key].classList.add('hidden');
      }
    });

    graphicButtons.forEach(btn => {
      if (btn.dataset.graphic === graphic) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Custom Image Upload
  customImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        customImagePreview.src = event.target.result;
        setGraphic('custom');
        graphicButtons.forEach(btn => btn.classList.remove('active'));
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Load Scholarship into Editor & Canvas ---
  window.loadScholarship = function(item) {
    if (!item) return;

    // Display the full name clearly at top search bar
    topSearchInput.value = item.name || '';
    btnClearTopSearch.classList.remove('hidden');

    const validBadges = ['NEW SCHOLARSHIP', 'SCHOLARSHIP UPDATE', 'CLOSES SOON', 'DATE EXTENDED'];
    const itemBadgeUpper = (item.badge || '').toUpperCase().trim();
    if (validBadges.includes(itemBadgeUpper)) {
      inputBadge.value = itemBadgeUpper;
    }
    displayBadge.textContent = inputBadge.value;

    inputTitle.value = item.name || '';
    displayTitle.textContent = inputTitle.value;

    inputAmount.value = item.amount || '₹ 50,000';
    displayAmount.textContent = inputAmount.value;

    const formattedDl = formatFullDate(item.deadline || '23 November 2026');
    inputDeadline.value = formattedDl;
    displayDeadline.textContent = formattedDl;

    inputWebsite.value = item.website || 'scholarise.in';
    displayWebsite.textContent = inputWebsite.value;

    inputEligibility.value = item.eligibility || 'Check official guidelines for complete eligibility.';
    displayEligibility.textContent = inputEligibility.value;

    // Sub-tagline: Blank by default
    inputTagline.value = '';
    displayTagline.textContent = '';
    displayTagline.classList.add('hidden');

    // Close modals and dropdowns
    topSearchResults.classList.add('hidden');
    browseModal.classList.add('hidden');
  };

  // --- Alphabetical Scholarship Database ---
  const rawList = window.SCHOLARISE_LIVE_DATA || [];
  const liveList = [...rawList].sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));

  // --- Top Searchable Combobox Logic ---
  function renderTopDropdown(items) {
    topSearchResults.innerHTML = '';
    if (items.length === 0) {
      topSearchResults.innerHTML = `
        <div class="p-3 text-center text-xs text-slate-400">
          No matching scholarships found.
        </div>
      `;
      topSearchResults.classList.remove('hidden');
      return;
    }

    items.forEach(s => {
      const row = document.createElement('div');
      row.className = 'p-2.5 hover:bg-teal-50 cursor-pointer transition flex items-center justify-between gap-2 group';
      
      const categoryColor = (s.category === 'GOVERNMENT') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            (s.category === 'FELLOWSHIP') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-teal-50 text-teal-700 border-teal-200';

      row.innerHTML = `
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${categoryColor}">
              ${s.badge}
            </span>
            <span class="text-[9px] text-slate-400 font-medium">
              <i class="fa-regular fa-clock mr-0.5"></i>${s.deadline}
            </span>
          </div>
          <div class="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
            ${s.name}
          </div>
          <div class="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
            💰 ${s.amount.split('\n')[0]}
          </div>
        </div>
        <div class="text-teal-600 opacity-0 group-hover:opacity-100 transition text-xs pr-1">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
      `;

      row.addEventListener('click', () => {
        window.loadScholarship(s);
      });

      topSearchResults.appendChild(row);
    });

    topSearchResults.classList.remove('hidden');
  }

  // Filter top search on input
  topSearchInput.addEventListener('input', () => {
    const q = topSearchInput.value.trim().toLowerCase();
    if (q) {
      btnClearTopSearch.classList.remove('hidden');
      const filtered = liveList.filter(s => 
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.amount && s.amount.toLowerCase().includes(q)) ||
        (s.eligibility && s.eligibility.toLowerCase().includes(q)) ||
        (s.website && s.website.toLowerCase().includes(q))
      );
      renderTopDropdown(filtered);
    } else {
      btnClearTopSearch.classList.add('hidden');
      renderTopDropdown(liveList);
    }
  });

  // Open dropdown on focus
  topSearchInput.addEventListener('focus', () => {
    const q = topSearchInput.value.trim().toLowerCase();
    if (q) {
      const filtered = liveList.filter(s => s.name.toLowerCase().includes(q));
      renderTopDropdown(filtered.length ? filtered : liveList);
    } else {
      renderTopDropdown(liveList);
    }
  });

  // Clear button
  btnClearTopSearch.addEventListener('click', (e) => {
    e.stopPropagation();
    topSearchInput.value = '';
    btnClearTopSearch.classList.add('hidden');
    renderTopDropdown(liveList);
    topSearchInput.focus();
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!topSearchWrapper.contains(e.target)) {
      topSearchResults.classList.add('hidden');
    }
  });

  // --- Modal List Renderer & Filters ---
  function renderModalList(items) {
    dbScholarshipList.innerHTML = '';
    scholarshipCountBadge.textContent = `${items.length} Available (A–Z)`;

    if (items.length === 0) {
      dbScholarshipList.innerHTML = `
        <div class="text-center py-10 text-slate-400">
          <i class="fa-solid fa-folder-open text-3xl mb-2"></i>
          <p class="text-xs">No scholarships found matching your criteria.</p>
        </div>
      `;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl p-3.5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-3';
      
      const categoryColor = item.category === 'GOVERNMENT' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            item.category === 'FELLOWSHIP' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-teal-50 text-teal-700 border-teal-200';

      card.innerHTML = `
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${categoryColor}">
              ${item.badge}
            </span>
            <span class="text-[10px] text-slate-400 font-medium">
              <i class="fa-regular fa-clock mr-1"></i>${item.deadline}
            </span>
          </div>
          <h4 class="text-xs font-bold text-slate-900 truncate">${item.name}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">${item.eligibility}</p>
          <div class="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-semibold text-slate-600">
            <span class="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 break-words">
              💰 ${item.amount.split('\n')[0]}
            </span>
            <span class="text-slate-500 font-normal break-all">
              🌐 ${item.website}
            </span>
          </div>
        </div>
        <button type="button" class="btn-use-scholarship flex-shrink-0 flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition active:scale-95">
          <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
          <span>Generate Poster</span>
        </button>
      `;

      card.querySelector('.btn-use-scholarship').addEventListener('click', () => {
        window.loadScholarship(item);
      });

      dbScholarshipList.appendChild(card);
    });
  }

  // Filter Handler for Modal
  function applyFilters() {
    const q = (dbSearchInput.value || '').toLowerCase();
    const cat = dbCategoryFilter.value;

    const filtered = liveList.filter(s => {
      const matchQ = s.name.toLowerCase().includes(q) || 
                     s.eligibility.toLowerCase().includes(q) || 
                     s.amount.toLowerCase().includes(q) ||
                     s.website.toLowerCase().includes(q);
      const matchCat = cat === 'all' || (s.category && s.category.toUpperCase().includes(cat));
      return matchQ && matchCat;
    });

    renderModalList(filtered);
  }

  dbSearchInput.addEventListener('input', applyFilters);
  dbCategoryFilter.addEventListener('change', applyFilters);

  // Modal Open / Close
  btnBrowseDb.addEventListener('click', () => {
    browseModal.classList.remove('hidden');
    dbSearchInput.focus();
  });

  btnCloseBrowseModal.addEventListener('click', () => {
    browseModal.classList.add('hidden');
  });

  browseModal.addEventListener('click', (e) => {
    if (e.target === browseModal) {
      browseModal.classList.add('hidden');
    }
  });

  // Reset Button
  btnReset.addEventListener('click', () => {
    if (liveList.length > 0) {
      window.loadScholarship(liveList[0]);
    }
  });

  // --- Real-Time Background Sync with ScholaRise Supabase Database ---
  async function syncLiveDatabase() {
    const supabaseUrl = 'https://vlnedcuhctgncpqbcbkh.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmVkY3VoY3RnbmNwcWJjYmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTcwNzEsImV4cCI6MjA1OTMzMzA3MX0.n1yFf3I-fwt7wozqcwqXF3Dl6c3MK7mv6qakw_xEebc';

    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/scholarships?select=*&order=created_at.desc&limit=200`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      });
      if (!resp.ok) return;

      const freshRecords = await resp.json();
      if (!Array.isArray(freshRecords) || freshRecords.length === 0) return;

      const updatedItems = [];
      const seen = new Set();

      freshRecords.forEach(s => {
        const name = (s.name || '').trim();
        if (!name || seen.has(name.toLowerCase())) return;
        seen.add(name.toLowerCase());

        const cleanAmount = cleanHtmlText(s.amount) || 'Up to ₹ 50,000';
        const cleanEligibility = cleanHtmlText(s.description) || cleanHtmlText(s.eligibility) || 'Check official guidelines for complete eligibility.';
        const deadline = formatFullDate(s.deadline);
        const website = (s.website_url || 'scholarise.in').replace('https://', '').replace('http://', '').replace(/\/+$/, '');
        const badge = (s.category || 'SCHOLARSHIP UPDATE').replace('_', ' ').toUpperCase();

        updatedItems.push({
          id: s.id,
          name: name,
          badge: badge.length <= 22 ? badge : 'SCHOLARSHIP UPDATE',
          amount: cleanAmount,
          deadline: deadline,
          website: website,
          full_website: s.website_url,
          eligibility: cleanEligibility,
          category: s.category || 'SCHOLARSHIP'
        });
      });

      // Sort A to Z
      updatedItems.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

      // Update in-memory list
      liveList.length = 0;
      liveList.push(...updatedItems);
      renderModalList(liveList);
      console.log(`[ScholaRise Live Sync] Successfully synchronized ${liveList.length} scholarships from live database.`);
    } catch (err) {
      console.log('[ScholaRise Live Sync] Working from local database snapshot:', err);
    }
  }

  // --- Export Functions (Pixel-Perfect Browser Native Capture) ---
  async function generatePosterDataUrl() {
    exportModal.classList.remove('hidden');

    try {
      // 1. Ensure custom fonts are loaded
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (fontErr) {
          console.warn('[Export] Font ready wait skipped:', fontErr);
        }
      }

      // Small tick to ensure DOM is settled
      await new Promise(resolve => setTimeout(resolve, 80));

      const posterNode = posterContainer;

      // Ensure inline base64 assets are active to prevent any CORS/tainted-canvas blocks
      if (window.SCHOLARISE_ASSETS) {
        if (displayLogoImg && window.SCHOLARISE_ASSETS.logoPng && !displayLogoImg.src.startsWith('data:')) {
          displayLogoImg.src = window.SCHOLARISE_ASSETS.logoPng;
        }
        if (displayQrImgTop && window.SCHOLARISE_ASSETS.whatsappQrJpg && !displayQrImgTop.src.startsWith('data:')) {
          displayQrImgTop.src = window.SCHOLARISE_ASSETS.whatsappQrJpg;
        }
      }

      // 2. Primary Engine: html-to-image (Uses native browser foreignObject - 100% identical to preview)
      if (window.htmlToImage) {
        const h2iOptions = {
          pixelRatio: 2.5,
          skipFonts: true,      // Bypass cross-origin CSS rule reading to prevent DOMSecurityError
          fontEmbedCSS: '',      // Do not attempt to download/embed external Google font files
          cacheBust: false,      // Prevent unnecessary network fetch requests on base64 assets
          backgroundColor: null,
          style: {
            margin: '0',
            transform: 'none'
          }
        };

        if (window.htmlToImage.toPng) {
          try {
            const dataUrl = await window.htmlToImage.toPng(posterNode, h2iOptions);
            if (dataUrl && dataUrl.length > 500) {
              return dataUrl;
            }
          } catch (h2iPngErr) {
            console.warn('[Export] htmlToImage.toPng encountered an issue, trying toCanvas...', h2iPngErr);
          }
        }

        if (window.htmlToImage.toCanvas) {
          try {
            const canvas = await window.htmlToImage.toCanvas(posterNode, h2iOptions);
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            if (dataUrl && dataUrl.length > 500) {
              return dataUrl;
            }
          } catch (h2iCanvasErr) {
            console.warn('[Export] htmlToImage.toCanvas failed, falling back to html2canvas...', h2iCanvasErr);
          }
        }
      }

      // 3. Fallback Engine: html2canvas with explicit dimensions and no scroll offset
      if (window.html2canvas) {
        console.log('[Export] Using html2canvas fallback renderer...');
        const canvas = await window.html2canvas(posterNode, {
          scale: 2.5,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          width: posterNode.offsetWidth,
          height: posterNode.offsetHeight,
          backgroundColor: null,
          logging: false
        });
        return canvas.toDataURL('image/png', 1.0);
      }

      throw new Error('No supported export library available in this environment.');
    } finally {
      exportModal.classList.add('hidden');
    }
  }

  // Download High-Res PNG
  btnExportPng.addEventListener('click', async () => {
    try {
      const dataUrl = await generatePosterDataUrl();
      const filename = `Scholarship-${(inputTitle.value || 'Poster').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.png`;
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('[Export PNG Error]', err);
      alert('Error generating PNG export: ' + (err.message || 'Please check browser settings.'));
    }
  });

  // Download Print-Ready PDF
  btnExportPdf.addEventListener('click', async () => {
    try {
      const dataUrl = await generatePosterDataUrl();
      
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [img.width / 2.5, img.height / 2.5]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 2.5, img.height / 2.5);
      pdf.save(`Scholarship-${(inputTitle.value || 'Poster').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`);
    } catch (err) {
      console.error('[Export PDF Error]', err);
      alert('Error creating PDF export: ' + (err.message || 'Please check browser settings.'));
    }
  });

  // Copy Image to Clipboard
  btnCopyImage.addEventListener('click', async () => {
    try {
      const dataUrl = await generatePosterDataUrl();
      const resp = await fetch(dataUrl);
      const blob = await resp.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      
      const originalIcon = btnCopyImage.innerHTML;
      btnCopyImage.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i>';
      setTimeout(() => {
        btnCopyImage.innerHTML = originalIcon;
      }, 2000);
    } catch (err) {
      console.warn('Clipboard write warning:', err);
      alert('Direct clipboard copy is not permitted by your browser security. You can use "Download PNG" instead!');
    }
  });

  // Initialize
  renderModalList(liveList);
  if (liveList.length > 0) {
    window.loadScholarship(liveList[0]);
  }

  // Trigger live background sync with Supabase
  syncLiveDatabase();

});
