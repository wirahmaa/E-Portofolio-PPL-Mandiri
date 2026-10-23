/* =====================================================
   E-PORTFOLIO PRAKTIK MENGAJAR MANDIRI — SCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- INIT AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hide');
    }, 500);
  });
  // safety fallback in case load event is delayed
  setTimeout(function () { loader.classList.add('hide'); }, 2500);

  /* ---------- ELEMENTS ---------- */
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.getElementById('mainWrapper');
  const collapseBtn = document.getElementById('collapseBtn');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const siteHeader = document.getElementById('siteHeader');
  const themeToggle = document.getElementById('themeToggle');
  const scrollProgress = document.getElementById('scrollProgress');
  const fabTop = document.getElementById('fabTop');
  const fabHelp = document.getElementById('fabHelp');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  let isDesktop = window.innerWidth > 768;

  /* ---------- SIDEBAR COLLAPSE (desktop) ---------- */
  collapseBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    mainWrapper.classList.toggle('collapsed');
  });

  /* ---------- MOBILE NAV ---------- */
  function openMobileNav() {
    sidebar.classList.add('mobile-open');
    mobileOverlay.classList.add('show');
  }
  function closeMobileNav() {
    sidebar.classList.remove('mobile-open');
    mobileOverlay.classList.remove('show');
  }
  hamburgerBtn.addEventListener('click', openMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', function () {
    isDesktop = window.innerWidth > 768;
    if (isDesktop) closeMobileNav();
  });

  /* ---------- SMOOTH SCROLL + ACTIVE LINK ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');
      const target = document.getElementById(targetId);
      if (target) {
        const headerOffset = 96;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      if (!isDesktop) closeMobileNav();
    });
  });

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('data-section') === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------- THEME TOGGLE (in-memory, no storage) ---------- */
  let darkMode = false;
  themeToggle.addEventListener('click', function () {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    themeToggle.innerHTML = darkMode
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  });

  /* ---------- SCROLL EVENTS: progress bar, sticky header, fab top ---------- */
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    siteHeader.classList.toggle('scrolled', scrollTop > 10);
    fabTop.classList.toggle('show', scrollTop > 400);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  fabTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  fabHelp.addEventListener('click', function () {
    const target = document.getElementById('refleksi');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = 1200;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- EFFECTIVENESS BARS ---------- */
  const bars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(function (b) { barObserver.observe(b); });

  /* ---------- ACCORDION ---------- */
  document.querySelectorAll('.accordion-header').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- MODAL (dokumentasi placeholder) ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      modalOverlay.classList.add('show');
    });
  });
  function closeModal() { modalOverlay.classList.remove('show'); }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });

  /* ---------- MODUL AJAR: upload, embed & tampilkan langsung ---------- */
  // Kotak pembungkus modul selalu elemen .modul-box, apa pun posisi iframe di dalamnya
  function boxOf(el) {
    return el.closest ? el.closest('.modul-box') : null;
  }

  /* ---------- PENYIMPANAN PERMANEN (IndexedDB) ----------
     File yang diunggah disimpan di browser sebagai Blob, sehingga tetap ada
     walaupun halaman di-refresh atau browser ditutup. */
  var DB_NAMA = 'eportfolio-berkas';
  var DB_STORE = 'unggahan';
  var dbJanji = null;

  function bukaDB() {
    if (dbJanji) return dbJanji;
    dbJanji = new Promise(function (selesai) {
      if (!('indexedDB' in window)) { selesai(null); return; }
      var req;
      try { req = indexedDB.open(DB_NAMA, 1); } catch (e) { selesai(null); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
      };
      req.onsuccess = function () { selesai(req.result); };
      req.onerror = function () { selesai(null); };
    });
    return dbJanji;
  }

  // Simpan file menurut id input (mis. "media-u1")
  function simpanBerkas(kunci, file) {
    return bukaDB().then(function (db) {
      if (!db) return false;
      return new Promise(function (selesai) {
        try {
          var tx = db.transaction(DB_STORE, 'readwrite');
          tx.objectStore(DB_STORE).put({ nama: file.name, tipe: file.type, blob: file, waktu: Date.now() }, kunci);
          tx.oncomplete = function () { selesai(true); };
          tx.onerror = function () { selesai(false); };
        } catch (e) { selesai(false); }
      });
    });
  }

  // Ambil file menurut id input
  function ambilBerkas(kunci) {
    return bukaDB().then(function (db) {
      if (!db) return null;
      return new Promise(function (selesai) {
        try {
          var tx = db.transaction(DB_STORE, 'readonly');
          var req = tx.objectStore(DB_STORE).get(kunci);
          req.onsuccess = function () { selesai(req.result || null); };
          req.onerror = function () { selesai(null); };
        } catch (e) { selesai(null); }
      });
    });
  }

  // Hapus file tersimpan (dipakai tombol Ganti/Hapus)
  function hapusBerkas(kunci) {
    return bukaDB().then(function (db) {
      if (!db) return false;
      return new Promise(function (selesai) {
        try {
          var tx = db.transaction(DB_STORE, 'readwrite');
          tx.objectStore(DB_STORE).delete(kunci);
          tx.oncomplete = function () { selesai(true); };
          tx.onerror = function () { selesai(false); };
        } catch (e) { selesai(false); }
      });
    });
  }

  function jenisFile(file) {
    var n = (file.name || '').toLowerCase();
    var t = file.type || '';
    if (t.indexOf('image/') === 0 || /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/.test(n)) return 'gambar';
    if (t.indexOf('video/') === 0 || /\.(mp4|webm|ogg|ogv|mov|m4v)$/.test(n)) return 'video';
    if (/\.(ppt|pptx|pps|ppsx)$/.test(n) || t.indexOf('presentation') === 0) return 'ppt';
    return 'dokumen';
  }

  // Viewer PowerPoint Online (Office) — hanya jalan untuk file yang bisa diakses lewat link publik (http/https)
  function bisaOffice(url) {
    return /^https?:/i.test(url);
  }

  function urlOffice(url) {
    // Buka lewat viewer Microsoft agar PPT bisa tampil di iframe.
    // Dipakai lewat Office Web Viewer agar tidak bergantung pada referer halaman.
    return 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url);
  }

  // Hapus pratinjau gambar/video lama (kalau ada)
  function hapusPratinjau(frame) {
    var wrap = frame.parentNode;
    if (!wrap) return;
    var lama = wrap.querySelector('.modul-preview');
    if (lama) lama.remove();
  }

  // Hapus kartu pengganti (khusus PPT lokal) kalau ada
  function hapusFallback(frame) {
    var wrap = frame.parentNode;
    if (!wrap) return;
    var lama = wrap.querySelector('.modul-ppt-card[data-untuk="' + frame.id + '"]');
    if (lama) lama.remove();
  }

  // PPT lokal tidak bisa dirender langsung di halaman (viewer Office butuh link publik).
  // Tampilkan kartu pengganti berisi nama file + tombol buka, tanpa ruang kosong.
  function tampilkanFallbackPpt(frame, file, url) {
    var card = document.createElement('div');
    card.className = 'modul-ppt-card';
    card.setAttribute('data-untuk', frame.id);
    card.innerHTML =
      '<div class="modul-ppt-slide"><i class="fa-solid fa-file-powerpoint"></i></div>' +
      '<div class="modul-ppt-body">' +
        '<h5></h5>' +
        '<p>Slide PowerPoint siap dipakai. Buka untuk menjalankan presentasi.</p>' +
        '<a class="btn-full btn-ppt-buka" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka PPT</a>' +
      '</div>';
    card.querySelector('h5').textContent = file.name;
    card.querySelector('.btn-ppt-buka').href = url;
    frame.parentNode.insertBefore(card, frame);
  }

  function urlPratinjau(frame, url) {
    // Untuk media PowerPoint (PDF hasil ekspor slide), tampilkan halaman sampul
    // saja dan sesuaikan dengan ukuran satu slide.
    if (frame.getAttribute('data-tampilan') === 'ppt') {
      return url + '#page=1&view=Fit&toolbar=0&navpanes=0&statusbar=0&messages=0&scrollbar=0';
    }
    return url + '#view=FitH&toolbar=0&navpanes=0&statusbar=0';
  }

  function buatEmbed(frame) {
    var box = boxOf(frame);
    if (!box) return null;

    // Panel embed modul (dibuat sekali saja per modul)
    var embed = box.querySelector('.modul-embed');
    if (embed) return embed;

    embed = document.createElement('div');
    embed.className = 'modul-embed';
    frame.parentNode.insertBefore(embed, frame);
    embed.appendChild(frame);

    return embed;
  }

  function resetModul(frame) {
    var box = boxOf(frame);
    if (!box) return;

    var hint = box.querySelector('.modul-hint');
    var actions = box.querySelector('.modul-actions');
    var input = box.querySelector('.upload-input');
    var embed = box.querySelector('.modul-embed');

    if (frame.dataset.objectUrl) {
      URL.revokeObjectURL(frame.dataset.objectUrl);
      delete frame.dataset.objectUrl;
    }
    hapusPratinjau(frame);
    hapusFallback(frame);
    frame.removeAttribute('src');
    frame.hidden = true;
    if (embed) embed.hidden = true;
    if (input) input.value = '';
    if (actions) actions.hidden = false;
    var lblReset = actions ? actions.querySelector('.btn-upload') : null;
    var jenisR = input ? input.getAttribute('data-jenis') : '';
    if (lblReset) {
      lblReset.innerHTML = jenisR === 'media'
        ? '<i class="fa-solid fa-cloud-arrow-up"></i> Upload Media'
        : (jenisR === 'kegiatan'
            ? '<i class="fa-solid fa-cloud-arrow-up"></i> Upload Foto'
            : (jenisR === 'dokumen'
                ? '<i class="fa-solid fa-cloud-arrow-up"></i> Upload Dokumen'
                : '<i class="fa-solid fa-cloud-arrow-up"></i> Upload Modul'));
    }
    if (hint) {
      hint.hidden = false;
      var jenis = input ? input.getAttribute('data-jenis') : '';
      if (jenis === 'media') {
        hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Media belum diunggah. Klik ' +
          '<strong>Upload Media</strong> untuk memilih file (PPT, PDF, gambar, atau video) dari komputer/HP Anda.';
      } else if (jenis === 'kegiatan') {
        hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Foto belum diunggah. Klik ' +
          '<strong>Upload Foto</strong> untuk memilih gambar dari komputer/HP Anda.';
      } else if (jenis === 'dokumen') {
        hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Dokumen belum diunggah. Klik ' +
          '<strong>Upload Dokumen</strong> untuk memilih file dari komputer/HP Anda.';
      } else {
        hint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Modul belum diunggah. Klik ' +
          '<strong>Upload Modul</strong> untuk memilih file dari komputer/HP Anda.';
      }
    }
  }

  /* ---------- Tampilkan berkas (dipakai untuk unggahan baru & yang tersimpan) ---------- */
  function tampilkanBerkas(frame, file) {
    var box = boxOf(frame);
    if (!box) return;

    var hint = box.querySelector('.modul-hint');
    var actions = box.querySelector('.modul-actions');

    // Bersihkan URL objek & elemen pratinjau/kartu sebelumnya
    if (frame.dataset.objectUrl) URL.revokeObjectURL(frame.dataset.objectUrl);
    hapusPratinjau(frame);
    hapusFallback(frame);

    var url = URL.createObjectURL(file);
    frame.dataset.objectUrl = url;

    var jenis = jenisFile(file);

    if (jenis === 'gambar' || jenis === 'video') {
      // Gambar/video: buat elemen pratinjau, iframe disembunyikan
      var prev = document.createElement(jenis === 'gambar' ? 'img' : 'video');
      prev.className = 'modul-preview';
      prev.src = url;
      prev.dataset.objectUrl = url;
      prev.setAttribute('data-preview-for', frame.id);
      if (jenis === 'video') {
        prev.controls = true;
        prev.playsInline = true;
      } else {
        prev.alt = file.name;
      }
      frame.parentNode.insertBefore(prev, frame);
      frame.removeAttribute('src');
      frame.hidden = true;
    } else if (jenis === 'ppt') {
      // PowerPoint: browser tidak bisa merender .pptx langsung.
      // Tampilkan kartu slide + tombol buka.
      frame.removeAttribute('src');
      frame.hidden = true;
      tampilkanFallbackPpt(frame, file, url);
    } else {
      frame.src = urlPratinjau(frame, url);
      frame.hidden = false;
    }

    // Siapkan panel embed & catatan, lalu tampilkan
    var embed = buatEmbed(frame);
    if (embed) embed.hidden = false;

    // Tombol Upload disembunyikan karena berkas sudah tampil.
    // Berkas tetap bisa diganti lewat tombol "Hapus" lalu unggah ulang.
    if (actions) actions.hidden = true;
    if (hint) hint.hidden = true;
  }

  document.querySelectorAll('.upload-input').forEach(function (input) {
    // Supaya memilih file yang sama (nama sama) tetap memicu 'change' saat mengganti
    input.addEventListener('click', function () { input.value = ''; });
    input.addEventListener('change', function () {
      const file = input.files && input.files[0];
      if (!file) return;

      const frame = document.getElementById(input.getAttribute('data-target'));
      if (!frame) return;

      // Tampilkan segera, lalu simpan permanen agar tidak hilang saat di-refresh
      tampilkanBerkas(frame, file);
      simpanBerkas(input.id, file);
    });
  });

  document.querySelectorAll('.btn-hapus').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const frame = document.getElementById(btn.getAttribute('data-target'));
      if (!frame) return;
      var box = boxOf(frame);
      var input = box ? box.querySelector('.upload-input') : null;
      if (input) hapusBerkas(input.id);
      resetModul(frame);
    });
  });

  /* ---------- Muat ulang berkas yang tersimpan (setelah refresh/tutup browser) ---------- */
  function pulihkanBerkas() {
    document.querySelectorAll('.upload-input').forEach(function (input) {
      var frame = document.getElementById(input.getAttribute('data-target'));
      if (!frame) return;
      ambilBerkas(input.id).then(function (simpanan) {
        if (!simpanan || !simpanan.blob) return;
        var file = simpanan.blob instanceof File
          ? simpanan.blob
          : new File([simpanan.blob], simpanan.nama || 'berkas', { type: simpanan.tipe || '' });
        tampilkanBerkas(frame, file);
      });
    });
  }
  pulihkanBerkas();

  /* ---------- Muat otomatis modul yang sudah tersimpan (data-src) ---------- */
  function tampilkanModul(frame, src) {
    var box = boxOf(frame);
    if (!box) return;

    frame.src = src;
    var embed = buatEmbed(frame);
    if (embed) embed.hidden = false;
    frame.hidden = false;

    // Sembunyikan tombol upload & petunjuk karena modul sudah tampil sendiri
    var actions = box.querySelector('.modul-actions');
    var hint = box.querySelector('.modul-hint');
    if (actions) actions.hidden = true;
    if (hint) hint.hidden = true;
  }

  document.querySelectorAll('.modul-frame[data-src]').forEach(function (frame) {
    tampilkanModul(frame, frame.getAttribute('data-src') + '#view=FitH&toolbar=1');
  });

  /* ---------- MODAL MODUL AJAR: tampilan besar / full ---------- */
  var modulModal = document.getElementById('modulModal');
  var modulModalFrame = document.getElementById('modulModalFrame');
  var modulModalTitle = document.getElementById('modulModalTitle');
  var modulModalTab = document.getElementById('modulModalTab');
  var modulModalDownload = document.getElementById('modulModalDownload');
  var modulModalClose = document.getElementById('modulModalClose');

  function tutupModalModul() {
    if (!modulModal) return;
    modulModal.classList.remove('show');
    document.body.style.overflow = '';
    // hentikan pemuatan media saat ditutup
    modulModalFrame.removeAttribute('src');
    var pv = document.getElementById('modulModalPreview');
    if (pv) { pv.innerHTML = ''; pv.hidden = true; pv.classList.remove('page-fill'); }
  }

  function bukaModalModul(srcFrame, nama) {
    if (!modulModal || !srcFrame) return;

    var pv = document.getElementById('modulModalPreview');
    var prev = srcFrame.parentNode
      ? srcFrame.parentNode.querySelector('.modul-preview[data-preview-for="' + srcFrame.id + '"]')
      : null;

    modulModalTitle.innerHTML = '<i class="fa-solid fa-file-lines"></i> ' + (nama || 'Modul Ajar');

    if (prev) {
      // Gambar atau video: tampilkan di elemen aslinya
      var sumber = prev.getAttribute('src');
      modulModalFrame.removeAttribute('src');
      modulModalFrame.hidden = true;
      pv.hidden = false;
      pv.classList.remove('page-fill');
      if (prev.tagName === 'VIDEO') {
        pv.innerHTML = '<video class="modal-media" src="' + sumber + '" controls autoplay playsinline></video>';
      } else {
        pv.innerHTML = '<img class="modal-media" src="' + sumber + '" alt="' + (nama || 'Media') + '">';
      }
      modulModalTab.href = sumber;
      modulModalDownload.href = sumber;
    } else {
      var src = srcFrame.getAttribute('src');
      var kartuPpt = srcFrame.parentNode
        ? srcFrame.parentNode.querySelector('.modul-ppt-card[data-untuk="' + srcFrame.id + '"]')
        : null;
      if (!src) {
        if (kartuPpt) {
          // PPT lokal: tampilkan keterangan + tombol buka, tanpa ruang kosong
          var tautan = kartuPpt.querySelector('.btn-ppt-buka');
          var href = tautan ? tautan.getAttribute('href') : '';
          modulModalFrame.removeAttribute('src');
          modulModalFrame.hidden = true;
          pv.hidden = false;
          pv.classList.add('page-fill');
          pv.innerHTML =
            '<div class="modal-ppt">' +
              '<i class="fa-solid fa-file-powerpoint"></i>' +
              '<h4></h4>' +
              '<p>File PowerPoint tidak dapat dipratinjau langsung di dalam halaman. ' +
              'Klik tombol di bawah untuk membuka dan menjalankan slide.</p>' +
              '<a class="btn-full" target="_blank" rel="noopener" href="' + href + '">' +
                '<i class="fa-solid fa-arrow-up-right-from-square"></i> Buka PowerPoint</a>' +
            '</div>';
          pv.querySelector('h4').textContent = nama || 'Media';
          modulModalTab.href = href;
          modulModalDownload.href = href;
          modulModal.classList.add('show');
          document.body.style.overflow = 'hidden';
        }
        return;
      }
      if (pv) { pv.innerHTML = ''; pv.hidden = true; pv.classList.remove('page-fill'); }
      modulModalFrame.hidden = false;
      modulModalFrame.src = src;
      modulModalTab.href = src;
      modulModalDownload.href = src;
    }

    modulModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  document.querySelectorAll('.btn-full').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = document.getElementById(btn.getAttribute('data-zoom'));
      if (!frame) return;
      var box = boxOf(frame);
      var nama = box && box.querySelector('.modul-actions')
        ? box.querySelector('.modul-actions').getAttribute('data-nama')
        : 'Modul Ajar';
      bukaModalModul(frame, nama);
    });
  });

  if (modulModalClose) modulModalClose.addEventListener('click', tutupModalModul);
  if (modulModal) {
    modulModal.addEventListener('click', function (e) {
      if (e.target === modulModal) tutupModalModul();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modulModal && modulModal.classList.contains('show')) tutupModalModul();
  });

  /* ---------- VIDEO GOOGLE DRIVE PER SIKLUS ---------- */
  function idDrive(url) {
    if (!url) return null;
    var pola = [
      /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
      /[?&]id=([a-zA-Z0-9_-]{10,})/,
      /\/d\/([a-zA-Z0-9_-]{10,})/
    ];
    for (var i = 0; i < pola.length; i++) {
      var m = url.match(pola[i]);
      if (m) return m[1];
    }
    return null;
  }

  function tautanDrivePreview(url) {
    var id = idDrive(url);
    return id ? 'https://drive.google.com/file/d/' + id + '/preview' : null;
  }

  var KUNCI_DRIVE = 'eportfolio-drive-video';

  function bacaSemuaDrive() {
    try { return JSON.parse(localStorage.getItem(KUNCI_DRIVE) || '{}'); }
    catch (e) { return {}; }
  }
  function simpanDrive(id, url) {
    var semua = bacaSemuaDrive();
    if (url) semua[id] = url; else delete semua[id];
    try { localStorage.setItem(KUNCI_DRIVE, JSON.stringify(semua)); } catch (e) {}
  }

  function tampilkanDrive(inputId, url) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var frame = document.getElementById(input.getAttribute('data-target'));
    var box = input.closest('.video-drive');
    if (!frame || !box) return;
    var embed = box.querySelector('.video-drive-embed');
    var hint = box.querySelector('.video-drive-hint');
    var tautan = tautanDrivePreview(url);
    if (!tautan) return false;
    frame.src = tautan;
    frame.hidden = false;
    if (embed) embed.hidden = false;
    if (hint) hint.hidden = true;
    input.value = url;

    // Video sudah disematkan -> sisakan HANYA video (tanpa ikon, label, atau kolom link)
    var barisLink = box.querySelector('.video-drive-input');
    if (barisLink) barisLink.hidden = true;
    var barisTombol = embed ? embed.querySelector('.btn-row') : null;
    if (barisTombol) barisTombol.hidden = true;
    var label = box.parentNode ? box.parentNode.querySelector('.pair-label') : null;
    if (label) label.hidden = true;

    return true;
  }

  document.querySelectorAll('[data-drive]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var inputId = btn.getAttribute('data-drive');
      var input = document.getElementById(inputId);
      if (!input) return;
      var url = (input.value || '').trim();
      if (!tampilkanDrive(inputId, url)) {
        alert('Link Google Drive tidak dikenali. Pastikan link berbentuk seperti:\nhttps://drive.google.com/file/d/xxxxxxxx/view');
        return;
      }
      simpanDrive(inputId, url);
    });
  });

  document.querySelectorAll('[data-hapus-drive]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var inputId = btn.getAttribute('data-hapus-drive');
      var input = document.getElementById(inputId);
      if (!input) return;
      var frame = document.getElementById(input.getAttribute('data-target'));
      var box = input.closest('.video-drive');
      if (frame) { frame.removeAttribute('src'); frame.hidden = true; }
      if (box) {
        var embed = box.querySelector('.video-drive-embed');
        var hint = box.querySelector('.video-drive-hint');
        if (embed) embed.hidden = true;
        if (hint) hint.hidden = false;
      }
      input.value = '';
      simpanDrive(inputId, '');
    });
  });

  /* ---------- Kembalikan kolom link video (klik judul blok) ----------
     Saat video sudah disematkan, area video hanya menampilkan videonya.
     Klik judul blok (mis. "Video Praktik Mengajar Siklus 1") untuk
     memunculkan kembali kolom link, tombol, dan petunjuk. */
  document.querySelectorAll('#video-mengajar .media-pair-head').forEach(function (head) {
    head.style.cursor = 'pointer';
    head.setAttribute('title', 'Klik untuk mengubah link video');
    head.addEventListener('click', function () {
      var pair = head.closest('.media-pair');
      var kiri = pair ? pair.querySelector('.media-pair-kiri') : null;
      var box = kiri ? kiri.querySelector('.video-drive') : null;
      if (!box) return;
      var label = kiri.querySelector('.pair-label');
      var barisLink = box.querySelector('.video-drive-input');
      var hint = box.querySelector('.video-drive-hint');
      var embed = box.querySelector('.video-drive-embed');
      var barisTombol = embed ? embed.querySelector('.btn-row') : null;
      var adaVideo = !!(embed && !embed.hidden);
      if (label) label.hidden = false;
      if (barisLink) barisLink.hidden = false;
      if (barisTombol) barisTombol.hidden = false;
      if (hint) hint.hidden = adaVideo;
    });
  });

  document.querySelectorAll('[data-zoom-frame]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = document.getElementById(btn.getAttribute('data-zoom-frame'));
      if (frame) bukaModalModul(frame, 'Video Praktik Mengajar');
    });
  });

  // Muat ulang link Drive yang sudah pernah disimpan
  (function pulihkanDrive() {
    var semua = bacaSemuaDrive();
    Object.keys(semua).forEach(function (inputId) {
      if (document.getElementById(inputId)) tampilkanDrive(inputId, semua[inputId]);
    });
  })();

  /* ---------- HERO: teks mengetik ---------- */
  (function typedHero() {
    var el = document.getElementById('typedText');
    if (!el) return;
    var kata = ['kuliner', 'kreatif', 'reflektif', 'inspiratif', 'siap mengabdi'];
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var i = 0, j = 0, hapus = false;
    function ketik() {
      var k = kata[i];
      el.textContent = k.slice(0, j);
      var jeda = hapus ? 45 : 95;
      if (!hapus && j === k.length) { hapus = true; jeda = 1500; }
      else if (hapus && j === 0) { hapus = false; i = (i + 1) % kata.length; jeda = 350; }
      else { j += hapus ? -1 : 1; }
      setTimeout(ketik, jeda);
    }
    setTimeout(ketik, 1800);
  })();

  /* ---------- HERO: foto miring mengikuti kursor (desktop) ---------- */
  (function tiltHero() {
    var hero = document.getElementById('hero');
    var stage = document.getElementById('visualStage');
    if (!hero || !stage) return;
    if (!window.matchMedia || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 6) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { stage.style.transform = ''; });
  })();

  /* ---------- RIPPLE EFFECT ---------- */
  document.querySelectorAll('.ripple-target').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.style.position = 'relative';
      el.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

});
