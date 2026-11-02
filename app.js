// Sook Jai Pix - Balance Summary Generator Logic
// Minimal Luxury Studio Edition

document.addEventListener('DOMContentLoaded', () => {
  // 1. Data Definitions for Packages
  const PACKAGE_DETAILS = {
    express: {
      name: 'ส่งงานด่วน',
      badge: 'ส่งงานด่วน (Express)',
      badgeClass: 'bg-stone-900 text-white border-stone-800',
      icon: 'zap',
      items: [
        'ถ่ายภาพไม่จำกัดจำนวนภาพ',
        'ปรับแสงสีทุกภาพที่ส่ง',
        'ส่งภาพทาง Google Photos',
        'หลังจากจบงานรับภาพทั้งหมดไม่เกิน 5 วัน'
      ]
    },
    normal: {
      name: 'ส่งงานปกติ',
      badge: 'ส่งงานปกติ (Standard)',
      badgeClass: 'bg-stone-100 text-stone-800 border-stone-200',
      icon: 'camera',
      items: [
        'ถ่ายภาพไม่จำกัดจำนวนภาพ',
        'ปรับแสงสีทุกภาพที่ส่ง',
        'ส่งภาพทาง Google Photos',
        'ชุดไฟส่องสว่างบริเวณจุดถ่ายภาพ',
        'หลังจากจบงาน 2-3 วัน ได้รับภาพตัวอย่าง',
        'หลังจากจบงานไม่เกิน 2 สัปดาห์ รับภาพทั้งหมด'
      ]
    }
  };

  // State
  const state = {
    customerName: 'คุณกมลวรรณ & คุณพิชญะ',
    customerPhone: '081-987-6543',
    photographerContact: '092 975 4919 แบงค์',
    eventType: 'งานมงคลสมรส (พิธีเช้า - ฉลองเที่ยง)',
    location: 'โรงแรม The Athenee Hotel Bangkok',
    timePeriod: '06:30 - 12:00 น.',
    photographerCount: 'ช่างภาพหลัก 2 ท่าน พร้อมผู้ช่วยและชุดไฟ',
    eventDate: '2026-11-30',
    customerFacebook: 'https://www.facebook.com/kamonwan.p',
    selectedPackage: 'express', // 'express' or 'normal'
    customPackageItems: null,
    totalAmount: 18500,
    depositAmount: 5000,
    remainingAmount: 13500,
    activeTheme: 'clean' // Default to Atelier White (Clean Minimal)
  };

  // DOM Elements - Inputs
  const elCustomerName = document.getElementById('inputCustomerName');
  const elCustomerPhone = document.getElementById('inputCustomerPhone');
  const elPhotographerPhone = document.getElementById('inputPhotographerPhone');
  const elEventType = document.getElementById('inputEventType');
  const elLocation = document.getElementById('inputLocation');
  const elTimePeriod = document.getElementById('inputTimePeriod');
  const elPhotographerCount = document.getElementById('inputPhotographerCount');
  const elEventDate = document.getElementById('inputEventDate');
  const elCustomerFacebook = document.getElementById('inputCustomerFacebook');
  const linkOpenFacebook = document.getElementById('linkOpenFacebook');
  const elTotalAmount = document.getElementById('inputTotalAmount');
  const elDepositAmount = document.getElementById('inputDepositAmount');
  const elRadioPackages = document.querySelectorAll('input[name="deliveryPackage"]');
  const labelPkgExpress = document.getElementById('labelPkgExpress');
  const labelPkgNormal = document.getElementById('labelPkgNormal');
  const packageItemsList = document.getElementById('packageItemsList');
  const btnResetPackageText = document.getElementById('btnResetPackageText');

  // DOM Elements - Live Card Preview
  const summaryCard = document.getElementById('summaryCardToExport');
  const cardCustomerName = document.getElementById('cardCustomerName');
  const cardCustomerPhone = document.getElementById('cardCustomerPhone');
  const cardPhotographerContact = document.getElementById('cardPhotographerContact');
  const cardEventType = document.getElementById('cardEventType');
  const cardLocation = document.getElementById('cardLocation');
  const cardDateTime = document.getElementById('cardDateTime');
  const cardPhotographerCount = document.getElementById('cardPhotographerCount');
  const cardPackageBadge = document.getElementById('cardPackageBadge');
  const cardDeliveryItems = document.getElementById('cardDeliveryItems');
  const cardTotalAmount = document.getElementById('cardTotalAmount');
  const cardDepositAmount = document.getElementById('cardDepositAmount');
  const cardRemainingAmount = document.getElementById('cardRemainingAmount');
  const displayRemainingAmount = document.getElementById('displayRemainingAmount');
  const badgePaymentStatus = document.getElementById('badgePaymentStatus');
  const cardDocNo = document.getElementById('cardDocNo');
  const cardDateGenerated = document.getElementById('cardDateGenerated');

  // Buttons
  const btnSaveJpeg = document.getElementById('btnSaveJpeg');
  const btnTopSaveJpeg = document.getElementById('btnTopSaveJpeg');
  const btnCopyImage = document.getElementById('btnCopyImage');
  const btnGoogleCalendar = document.getElementById('btnGoogleCalendar');
  const btnQuickAddToCalendar = document.getElementById('btnQuickAddToCalendar');
  const btnQuickSample = document.getElementById('btnQuickSample');
  const btnClearForm = document.getElementById('btnClearForm');
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // Format currency
  function formatMoney(amount) {
    if (isNaN(amount) || amount === null || amount === '') return '฿0';
    return '฿' + Number(amount).toLocaleString('th-TH');
  }

  // Format date Thai (Short Clean)
  function formatThaiDate(dateString) {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const day = d.getDate();
      const month = thaiMonths[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    } catch (e) {
      return dateString;
    }
  }

  // Format English Date for Header
  function formatEnglishDate(dateObj) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const d = dateObj.getDate();
    const m = months[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    return `${d} ${m} ${y}`;
  }

  // Generate Unique Doc No
  function generateDocNo() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    return `SJP-${y}${m}-${random}`;
  }

  // Update Facebook quick open link button UI
  function updateFacebookLinkUI() {
    if (!elCustomerFacebook || !linkOpenFacebook) return;
    const val = elCustomerFacebook.value.trim();
    if (val && (val.startsWith('http://') || val.startsWith('https://') || val.includes('facebook.com'))) {
      const url = val.startsWith('http') ? val : `https://${val}`;
      linkOpenFacebook.href = url;
      linkOpenFacebook.classList.remove('hidden');
    } else {
      linkOpenFacebook.classList.add('hidden');
    }
  }

  // Initialize Form with State
  function populateForm() {
    elCustomerName.value = state.customerName;
    if (elCustomerPhone) elCustomerPhone.value = state.customerPhone || '';
    if (elPhotographerPhone) elPhotographerPhone.value = state.photographerContact || '092 975 4919 แบงค์';
    elEventType.value = state.eventType;
    elLocation.value = state.location;
    elTimePeriod.value = state.timePeriod;
    elPhotographerCount.value = state.photographerCount;
    elEventDate.value = state.eventDate;
    if (elCustomerFacebook) {
      elCustomerFacebook.value = state.customerFacebook || '';
      updateFacebookLinkUI();
    }
    elTotalAmount.value = state.totalAmount;
    elDepositAmount.value = state.depositAmount;

    // Check correct radio
    elRadioPackages.forEach(radio => {
      radio.checked = (radio.value === state.selectedPackage);
    });

    updatePackageSelectionUI();
    renderPackageEditorList();
  }

  // Calculate & Update Balance
  function updateFinancials() {
    const total = parseFloat(elTotalAmount.value) || 0;
    const deposit = parseFloat(elDepositAmount.value) || 0;
    const remaining = Math.max(0, total - deposit);

    state.totalAmount = total;
    state.depositAmount = deposit;
    state.remainingAmount = remaining;

    // Update Left panel display
    displayRemainingAmount.textContent = formatMoney(remaining);

    if (remaining === 0 && total > 0) {
      badgePaymentStatus.textContent = 'PAID IN FULL • ชำระครบถ้วน';
      badgePaymentStatus.className = 'inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-100';
    } else if (deposit > total) {
      badgePaymentStatus.textContent = 'มัดจำเกินยอดรวม';
      badgePaymentStatus.className = 'inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800';
    } else {
      badgePaymentStatus.textContent = 'รอชำระวันงาน';
      badgePaymentStatus.className = 'inline-block text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700';
    }

    // Update Right Card
    cardTotalAmount.textContent = formatMoney(total);
    cardDepositAmount.textContent = '-' + formatMoney(deposit);
    cardRemainingAmount.textContent = formatMoney(remaining);
  }

  // Render Package Items in Editor
  function renderPackageEditorList() {
    const pkg = PACKAGE_DETAILS[state.selectedPackage];
    const items = state.customPackageItems || pkg.items;

    packageItemsList.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'flex items-center gap-2 text-stone-600';
      li.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0"></span>
        <span class="flex-1">${escapeHtml(item)}</span>
      `;
      packageItemsList.appendChild(li);
    });
  }

  // Update Package Radio Visuals (Minimalist Luxury)
  function updatePackageSelectionUI() {
    const checkIconHtml = '<i data-lucide="check" class="w-2.5 h-2.5 stroke-[2.5]"></i>';

    if (state.selectedPackage === 'express') {
      labelPkgExpress.className = 'group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 border border-stone-900 bg-stone-900 text-white shadow-sm';
      const checkEl = labelPkgExpress.querySelector('.pkg-check');
      checkEl.className = 'pkg-check w-4 h-4 rounded-full border border-stone-600 flex items-center justify-center bg-white text-stone-900 text-[10px]';
      checkEl.innerHTML = checkIconHtml;

      labelPkgNormal.className = 'group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 border border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-800';
      const normCheckEl = labelPkgNormal.querySelector('.pkg-check');
      normCheckEl.className = 'pkg-check w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center bg-transparent text-transparent text-[10px]';
      normCheckEl.innerHTML = '';
    } else {
      labelPkgNormal.className = 'group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 border border-stone-900 bg-stone-900 text-white shadow-sm';
      const normCheckEl = labelPkgNormal.querySelector('.pkg-check');
      normCheckEl.className = 'pkg-check w-4 h-4 rounded-full border border-stone-600 flex items-center justify-center bg-white text-stone-900 text-[10px]';
      normCheckEl.innerHTML = checkIconHtml;

      labelPkgExpress.className = 'group relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 border border-stone-200 hover:border-stone-300 bg-stone-50/50 text-stone-800';
      const expCheckEl = labelPkgExpress.querySelector('.pkg-check');
      expCheckEl.className = 'pkg-check w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center bg-transparent text-transparent text-[10px]';
      expCheckEl.innerHTML = '';
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Render the Preview Card
  function renderCard() {
    // 1. Customer & Event
    cardCustomerName.textContent = elCustomerName.value.trim() || 'คุณลูกค้า';

    // Optional customer phone display
    if (cardCustomerPhone) {
      const cPhone = elCustomerPhone ? elCustomerPhone.value.trim() : '';
      if (cPhone) {
        cardCustomerPhone.textContent = `(${cPhone})`;
        cardCustomerPhone.classList.remove('hidden');
      } else {
        cardCustomerPhone.classList.add('hidden');
      }
    }
    
    if (elEventType.value.trim()) {
      cardEventType.textContent = elEventType.value.trim();
      cardEventType.classList.remove('hidden');
    } else {
      cardEventType.classList.add('hidden');
    }

    cardLocation.textContent = elLocation.value.trim() || 'สถานที่ตามนัดหมาย';

    // Combine Date and Time
    const dateFormatted = formatThaiDate(elEventDate.value);
    const timeFormatted = elTimePeriod.value.trim();
    if (dateFormatted && timeFormatted) {
      cardDateTime.textContent = `${dateFormatted} (${timeFormatted})`;
    } else if (dateFormatted) {
      cardDateTime.textContent = dateFormatted;
    } else if (timeFormatted) {
      cardDateTime.textContent = timeFormatted;
    } else {
      cardDateTime.textContent = 'ตามกำหนดการ';
    }

    cardPhotographerCount.textContent = elPhotographerCount.value.trim() || '1 ท่าน';

    // Photographer contact at the bottom of the card
    if (cardPhotographerContact) {
      cardPhotographerContact.textContent = elPhotographerPhone && elPhotographerPhone.value.trim() ? elPhotographerPhone.value.trim() : '092 975 4919 แบงค์';
    }

    // 2. Package Details
    const pkg = PACKAGE_DETAILS[state.selectedPackage];
    const items = state.customPackageItems || pkg.items;

    cardPackageBadge.textContent = pkg.badge;

    cardDeliveryItems.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2.5 text-stone-700';
      li.innerHTML = `
        <span class="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0"></span>
        <span class="leading-relaxed">${escapeHtml(item)}</span>
      `;
      cardDeliveryItems.appendChild(li);
    });

    // 3. Financials
    updateFinancials();

    // Refresh Lucide Icons in dynamically created elements
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Theme Switcher (Clean Minimal Presets)
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => {
        b.classList.remove('active', 'border-stone-900', 'bg-white', 'shadow-sm');
        b.classList.add('border-stone-200', 'bg-stone-50/60');
      });
      btn.classList.add('active', 'border-stone-900', 'bg-white', 'shadow-sm');
      btn.classList.remove('border-stone-200', 'bg-stone-50/60');

      const theme = btn.getAttribute('data-theme');
      state.activeTheme = theme;
      summaryCard.classList.remove('theme-warm', 'theme-dark', 'theme-clean');
      summaryCard.classList.add(`theme-${theme}`);

      // Switch logo variant based on theme
      const cardLogoImg = document.getElementById('cardLogoImg');
      if (cardLogoImg) {
        cardLogoImg.src = (theme === 'dark') ? 'logo-white.png' : 'logo-dark.png';
      }
    });
  });

  // Package Switcher Change
  elRadioPackages.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.selectedPackage = e.target.value;
      state.customPackageItems = null; // reset to template default
      updatePackageSelectionUI();
      renderPackageEditorList();
      renderCard();
    });
  });

  // Reset Package Text button
  btnResetPackageText.addEventListener('click', () => {
    state.customPackageItems = null;
    renderPackageEditorList();
    renderCard();
    showToast('รีเซ็ตเงื่อนไขการส่งงานเป็นค่าเริ่มต้นแล้ว');
  });

  // Live Input Listeners for all fields
  const inputsToListen = [
    elCustomerName, elCustomerPhone, elPhotographerPhone, elEventType, 
    elLocation, elTimePeriod, elPhotographerCount, elEventDate, 
    elTotalAmount, elDepositAmount
  ];

  inputsToListen.forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        renderCard();
      });
    }
  });

  // Facebook link listener
  if (elCustomerFacebook) {
    elCustomerFacebook.addEventListener('input', () => {
      state.customerFacebook = elCustomerFacebook.value.trim();
      updateFacebookLinkUI();
    });
  }

  // Google Calendar Integration
  function openGoogleCalendar() {
    const customer = elCustomerName.value.trim() || 'ลูกค้า';
    const customerPhone = elCustomerPhone ? elCustomerPhone.value.trim() : '';
    const photographerContact = elPhotographerPhone ? elPhotographerPhone.value.trim() || '092 975 4919 แบงค์' : '092 975 4919 แบงค์';
    const eventType = elEventType.value.trim() || 'งานถ่ายภาพ';
    const location = elLocation.value.trim() || '';
    const dateVal = elEventDate.value; // e.g. "2026-11-30"
    const timeVal = elTimePeriod.value.trim(); // e.g. "06:30 - 12:00 น."
    const photographers = elPhotographerCount.value.trim() || '1 ท่าน';
    const fbLink = elCustomerFacebook ? elCustomerFacebook.value.trim() : '';
    const pkg = PACKAGE_DETAILS[state.selectedPackage];
    const items = state.customPackageItems || pkg.items;

    if (!dateVal) {
      alert('กรุณาระบุ "วันที่จัดงาน" ในฟอร์มก่อนกดบันทึกลง Google Calendar ครับ');
      elEventDate.focus();
      return;
    }

    // Parse time ranges (e.g. "06:30 - 12:00 น.")
    const timeMatches = [...timeVal.matchAll(/(\d{1,2})[:.](\d{2})/g)];
    let startDateTimeStr = '';
    let endDateTimeStr = '';
    const pad = (n) => String(n).padStart(2, '0');

    if (timeMatches.length >= 2) {
      const sh = parseInt(timeMatches[0][1], 10);
      const sm = parseInt(timeMatches[0][2], 10);
      const eh = parseInt(timeMatches[1][1], 10);
      const em = parseInt(timeMatches[1][2], 10);

      const [y, m, d] = dateVal.split('-').map(Number);
      const startDate = new Date(y, m - 1, d, sh, sm, 0);
      const endDate = new Date(y, m - 1, d, eh, em, 0);

      const toUTC = (dt) => {
        return dt.getUTCFullYear() +
          pad(dt.getUTCMonth() + 1) +
          pad(dt.getUTCDate()) + 'T' +
          pad(dt.getUTCHours()) +
          pad(dt.getUTCMinutes()) +
          pad(dt.getUTCSeconds()) + 'Z';
      };

      startDateTimeStr = toUTC(startDate);
      endDateTimeStr = toUTC(endDate);
    } else if (timeMatches.length === 1) {
      const sh = parseInt(timeMatches[0][1], 10);
      const sm = parseInt(timeMatches[0][2], 10);
      const [y, m, d] = dateVal.split('-').map(Number);
      const startDate = new Date(y, m - 1, d, sh, sm, 0);
      const endDate = new Date(y, m - 1, d, sh + 4, sm, 0); // default 4 hrs

      const toUTC = (dt) => {
        return dt.getUTCFullYear() +
          pad(dt.getUTCMonth() + 1) +
          pad(dt.getUTCDate()) + 'T' +
          pad(dt.getUTCHours()) +
          pad(dt.getUTCMinutes()) +
          pad(dt.getUTCSeconds()) + 'Z';
      };

      startDateTimeStr = toUTC(startDate);
      endDateTimeStr = toUTC(endDate);
    } else {
      // Whole day event
      const [y, m, d] = dateVal.split('-').map(Number);
      const nextDay = new Date(y, m - 1, d + 1);
      startDateTimeStr = `${y}${pad(m)}${pad(d)}`;
      endDateTimeStr = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;
    }

    const title = `📸 [Sook Jai Pix] ${customer} — ${eventType}`;

    const descLines = [
      `📸 Sook Jai Pix — รายละเอียดนัดหมายงานถ่ายภาพ`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 ลูกค้า: ${customer}`,
      `🎉 ประเภทงาน: ${eventType}`
    ];

    if (customerPhone) {
      descLines.push(`📞 เบอร์ลูกค้า: ${customerPhone}`);
    }

    if (fbLink) {
      descLines.push(`🔗 Facebook ลูกค้า: ${fbLink}`);
    }

    descLines.push(
      `📍 สถานที่: ${location || 'ตามนัดหมาย'}`,
      `⏰ กำหนดการ: ${timeVal || 'ตามกำหนดการ'}`,
      `👥 ทีมช่างภาพ: ${photographers}`,
      `📸 เบอร์ติดต่อช่างภาพ: ${photographerContact}`,
      ``,
      `📦 รายละเอียดการส่งงาน (${pkg.name}):`,
      ...items.map(item => `  • ${item}`),
      ``,
      `💰 ข้อมูลค่าบริการ:`,
      `  • ยอดรวมสุทธิ: ${formatMoney(state.totalAmount)}`,
      `  • ยอดมัดจำ: ${formatMoney(state.depositAmount)}`,
      `  • ยอดคงเหลือ: ${formatMoney(state.remainingAmount)}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `บันทึกโดยระบบ Sook Jai Pix App`
    );

    const description = descLines.join('\n');

    const gCalUrl = new URL('https://calendar.google.com/calendar/render');
    gCalUrl.searchParams.set('action', 'TEMPLATE');
    gCalUrl.searchParams.set('text', title);
    gCalUrl.searchParams.set('dates', `${startDateTimeStr}/${endDateTimeStr}`);
    gCalUrl.searchParams.set('details', description);
    if (location) {
      gCalUrl.searchParams.set('location', location);
    }

    window.open(gCalUrl.toString(), '_blank');
    showToast('กำลังเปิด Google Calendar เพื่อบันทึกนัดหมาย...');
  }

  // Quick Sample Button
  btnQuickSample.addEventListener('click', () => {
    elCustomerName.value = 'คุณพิมลดา & คุณกิตติศักดิ์';
    if (elCustomerPhone) elCustomerPhone.value = '081-987-6543';
    if (elPhotographerPhone) elPhotographerPhone.value = '092 975 4919 แบงค์';
    elEventType.value = 'งานฉลองมงคลสมรส (Evening Reception)';
    elLocation.value = 'ห้องฉัตรา บอลรูม โรงแรมสยามเคมปินสกี้ กรุงเทพฯ';
    elTimePeriod.value = '17:30 - 22:30 น.';
    elPhotographerCount.value = 'ช่างภาพหลัก 2 ท่าน + ช่างภาพแคนดิด 1 ท่าน';
    
    // Set date to 2 weeks from now
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 14);
    elEventDate.value = nextDate.toISOString().split('T')[0];

    if (elCustomerFacebook) {
      elCustomerFacebook.value = 'https://www.facebook.com/pimlada.k';
      updateFacebookLinkUI();
    }
    
    elTotalAmount.value = 22000;
    elDepositAmount.value = 7000;
    
    // switch to normal or express
    state.selectedPackage = 'normal';
    elRadioPackages.forEach(r => r.checked = (r.value === 'normal'));
    updatePackageSelectionUI();
    renderPackageEditorList();
    renderCard();

    showToast('โหลดข้อมูลตัวอย่างเรียบร้อยแล้ว');
  });

  // Clear Form Button
  btnClearForm.addEventListener('click', () => {
    if (!confirm('ต้องการล้างข้อมูลทั้งหมดในฟอร์มเพื่อกรอกใหม่หรือไม่?')) return;
    elCustomerName.value = '';
    if (elCustomerPhone) elCustomerPhone.value = '';
    if (elPhotographerPhone) elPhotographerPhone.value = '092 975 4919 แบงค์';
    elEventType.value = '';
    elLocation.value = '';
    elTimePeriod.value = '';
    elPhotographerCount.value = '1 ท่าน';
    elEventDate.value = '';
    if (elCustomerFacebook) {
      elCustomerFacebook.value = '';
      updateFacebookLinkUI();
    }
    elTotalAmount.value = 0;
    elDepositAmount.value = 0;
    renderCard();
    showToast('ล้างข้อมูลเรียบร้อย');
  });

  // JPEG Export Logic using html2canvas
  async function generateJpegBlob() {
    if (!window.html2canvas) {
      alert('ระบบบันทึกภาพกำลังโหลด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
      return null;
    }

    // Ensure all web fonts are loaded
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Ensure logo image is loaded
    const cardLogoImg = document.getElementById('cardLogoImg');
    if (cardLogoImg && !cardLogoImg.complete) {
      await new Promise(r => {
        cardLogoImg.onload = r;
        cardLogoImg.onerror = r;
      });
    }

    // Determine background color based on theme
    let bg = '#ffffff';
    if (state.activeTheme === 'warm') bg = '#f7f5f0';
    if (state.activeTheme === 'dark') bg = '#121316';

    const canvas = await html2canvas(summaryCard, {
      scale: 3, // Ultra-crisp 3x resolution for retina display
      useCORS: true,
      backgroundColor: bg,
      logging: false,
      allowTaint: true,
      windowWidth: document.body.scrollWidth,
    });

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve({ blob, canvas });
      }, 'image/jpeg', 0.95);
    });
  }

  // Save as JPEG File
  async function saveAsJpeg() {
    const btn = btnSaveJpeg;
    const topBtn = btnTopSaveJpeg;
    const originalText = btn.innerHTML;
    const originalTopText = topBtn.innerHTML;

    btn.disabled = true;
    topBtn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>กำลังประมวลผล...</span>`;
    topBtn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>กำลังบันทึก...</span>`;
    if (window.lucide) lucide.createIcons();

    try {
      const result = await generateJpegBlob();
      if (!result) return;

      const { blob } = result;
      const customer = elCustomerName.value.trim().replace(/[/\\?%*:|"<>]/g, '') || 'ลูกค้า';
      const filename = `SookJaiPix_สรุปยอดคงเหลือ_${customer}.jpeg`;

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`บันทึกไฟล์ภาพเรียบร้อย: ${filename}`);
    } catch (err) {
      console.error('Export error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกภาพ: ' + err.message);
    } finally {
      btn.disabled = false;
      topBtn.disabled = false;
      btn.innerHTML = originalText;
      topBtn.innerHTML = originalTopText;
      if (window.lucide) lucide.createIcons();
    }
  }

  // Copy Image to Clipboard
  async function copyImageToClipboard() {
    if (!navigator.clipboard || !window.ClipboardItem) {
      alert('เบราว์เซอร์ของคุณยังไม่รองรับการคัดลอกรูปภาพลงคลิปบอร์ดโดยตรง กรุณากดปุ่ม "บันทึกภาพ JPEG" แทนครับ');
      return;
    }

    const originalText = btnCopyImage.innerHTML;
    btnCopyImage.disabled = true;
    btnCopyImage.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin text-stone-500"></i><span>กำลังคัดลอก...</span>`;
    if (window.lucide) lucide.createIcons();

    try {
      const result = await generateJpegBlob();
      if (!result) return;

      const { blob } = result;
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      showToast('คัดลอกรูปภาพแล้ว! สามารถกดวาง (Cmd+V / Ctrl+V) ใน LINE หรือแชทได้ทันที');
    } catch (err) {
      console.warn('Direct image copy fallback:', err);
      try {
        const result = await generateJpegBlob();
        const item = new ClipboardItem({ [result.blob.type]: result.blob });
        await navigator.clipboard.write([item]);
        showToast('คัดลอกรูปภาพแล้ว! สามารถวางในแชทได้ทันที');
      } catch (err2) {
        showToast('ไม่สามารถคัดลอกลงคลิปบอร์ดได้ กรุณากดปุ่ม "บันทึกภาพ JPEG"');
      }
    } finally {
      btnCopyImage.disabled = false;
      btnCopyImage.innerHTML = originalText;
      if (window.lucide) lucide.createIcons();
    }
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastText.textContent = message;
    toastMessage.classList.remove('hidden');
    toastMessage.classList.add('flex');

    toastTimer = setTimeout(() => {
      toastMessage.classList.add('hidden');
      toastMessage.classList.remove('flex');
    }, 3500);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event Listeners for Export & Calendar
  btnSaveJpeg.addEventListener('click', saveAsJpeg);
  btnTopSaveJpeg.addEventListener('click', saveAsJpeg);
  btnCopyImage.addEventListener('click', copyImageToClipboard);

  if (btnGoogleCalendar) {
    btnGoogleCalendar.addEventListener('click', openGoogleCalendar);
  }
  if (btnQuickAddToCalendar) {
    btnQuickAddToCalendar.addEventListener('click', openGoogleCalendar);
  }

  // Set Today's Document Number and Generation Date
  cardDocNo.textContent = `NO: ${generateDocNo()}`;
  const now = new Date();
  cardDateGenerated.textContent = `DATE: ${formatEnglishDate(now)}`;

  // Initial Run
  populateForm();
  renderCard();
  if (window.lucide) {
    lucide.createIcons();
  }
});
