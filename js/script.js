/**
 * DO'A 6 EXECUTIVE CAMPING RETREAT 2026
 * Edisi Kehormatan Keluarga Besar Bengkel Las Do'a 6 (Sarjana Edition)
 * Gubuk Marawati, Pacet, Mojokerto (7 - 8 November 2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambil Nama Tamu Kehormatan dari URL (?to=Nama+Tamu atau ?nama=Nama+Tamu)
  initGuestName();

  // 2. Efek Bintang Keemasan di Cover
  generateStars();

  // 3. Audio & Aksi Buka Undangan Resmi + Gold Confetti
  initAudioAndCover();

  // 4. Live Countdown Timer (Target: 7 November 2026, 13:00 WIB)
  initCountdown();

  // 5. Mini Game Interaktif: Kocok Peran Kehormatan (Sarjana Edition)
  initRoleRandomizer();

  // 6. Interactive Expedition Checklist
  initChecklist();

  // 7. RSVP & Live Dinding Ucapan Kehormatan (Bersih dari dummy)
  initRSVP();

  // 8. Salin Alamat & Simpan ke Kalender
  initLocationActions();

  // 9. Floating Dock Active Scroll Spy
  initScrollSpy();
});

/* -------------------------------------------------------------
 * 1. Personalize Guest Name from URL
 * ----------------------------------------------------------- */
function initGuestName() {
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to') || params.get('nama') || params.get('kpd') || 'Keluarga Besar Do\'a 6';

  const coverGuestEl = document.getElementById('ticket-guest-name');
  const heroGuestEl = document.getElementById('hero-guest-name');
  const rsvpNameInput = document.getElementById('rsvp-name');

  if (coverGuestEl) coverGuestEl.textContent = guest;
  if (heroGuestEl) heroGuestEl.textContent = guest;
  if (rsvpNameInput && (params.get('to') || params.get('nama'))) {
    rsvpNameInput.value = guest;
  }
}

/* -------------------------------------------------------------
 * 2. Background Stars Generator
 * ----------------------------------------------------------- */
function generateStars() {
  const container = document.getElementById('night-stars');
  if (!container) return;

  const count = 40;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'night-star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    const sz = Math.random() * 2.5 + 1.2;
    star.style.width = `${sz}px`;
    star.style.height = `${sz}px`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${Math.random() * 2 + 2}s`;
    container.appendChild(star);
  }
}

/* -------------------------------------------------------------
 * 3. Audio & Aksi Buka Undangan + Gold Confetti
 * ----------------------------------------------------------- */
let audioContext = null;
let isAudioPlaying = false;
let ambientSynthInterval = null;

function initAudioAndCover() {
  const cover = document.getElementById('invitation-cover');
  const btnOpen = document.getElementById('btn-open-fest');
  const btnMusic = document.getElementById('floating-music-btn');
  const audioEl = document.getElementById('camp-audio');

  btnOpen.addEventListener('click', () => {
    // 1. Tembakkan Confetti Mewah Bernuansa Emas & Emerald
    fireGoldConfetti();

    // 2. Buka Cover dengan transisi halus
    cover.classList.add('opened');
    document.body.style.overflow = 'auto';

    // 3. Putar Alunan Musik Alam
    playMusic(audioEl, btnMusic);
  });

  if (btnMusic) {
    btnMusic.addEventListener('click', () => {
      toggleMusic(audioEl, btnMusic);
    });
  }
}

function fireGoldConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f3cf65', '#ffffff', '#2a9d8f']
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#f6d365', '#ffffff']
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#f6d365', '#ffffff']
      });
    }, 280);
  }
}

function playMusic(audioEl, btn) {
  if (audioEl) {
    audioEl.play().then(() => {
      isAudioPlaying = true;
      updateMusicUI(btn, true);
    }).catch(err => {
      console.log('Browser membatasi audio, mengaktifkan synth harmoni...', err);
      startAmbientSynth();
      isAudioPlaying = true;
      updateMusicUI(btn, true);
    });
  } else {
    startAmbientSynth();
    isAudioPlaying = true;
    updateMusicUI(btn, true);
  }
}

function toggleMusic(audioEl, btn) {
  if (isAudioPlaying) {
    if (audioEl && !audioEl.paused) audioEl.pause();
    stopAmbientSynth();
    isAudioPlaying = false;
    updateMusicUI(btn, false);
  } else {
    if (audioEl && audioEl.src) {
      audioEl.play().catch(() => startAmbientSynth());
    } else {
      startAmbientSynth();
    }
    isAudioPlaying = true;
    updateMusicUI(btn, true);
  }
}

function updateMusicUI(btn, playing) {
  if (!btn) return;
  const icon = btn.querySelector('i');
  if (playing) {
    btn.classList.add('playing');
    if (icon) icon.className = 'bi bi-disc-fill text-gold';
    btn.setAttribute('title', 'Jeda Musik');
  } else {
    btn.classList.remove('playing');
    if (icon) icon.className = 'bi bi-volume-mute-fill';
    btn.setAttribute('title', 'Putar Musik');
  }
}

function startAmbientSynth() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();

    const notes = [261.63, 329.63, 392.00, 523.25];
    let noteIdx = 0;

    ambientSynthInterval = setInterval(() => {
      if (!isAudioPlaying || !audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], audioContext.currentTime);
      noteIdx++;
      gain.gain.setValueAtTime(0.03, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.6);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 1.6);
    }, 2400);
  } catch (e) {
    console.log(e);
  }
}

function stopAmbientSynth() {
  if (ambientSynthInterval) clearInterval(ambientSynthInterval);
}

/* -------------------------------------------------------------
 * 4. Live Countdown Timer
 * Target: Sabtu, 7 November 2026, 13:00 WIB di Gubuk Marawati
 * ----------------------------------------------------------- */
function initCountdown() {
  const target = new Date('2026-11-07T13:00:00+07:00').getTime();

  const dEl = document.getElementById('c-days');
  const hEl = document.getElementById('c-hours');
  const mEl = document.getElementById('c-mins');
  const sEl = document.getElementById('c-secs');

  function tick() {
    const diff = target - new Date().getTime();
    if (diff <= 0) {
      if (dEl) dEl.textContent = '00';
      if (hEl) hEl.textContent = '00';
      if (mEl) mEl.textContent = '00';
      if (sEl) sEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
    if (sEl) sEl.textContent = String(secs).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* -------------------------------------------------------------
 * 5. MINI GAME: PERAN KEHORMATAN DI PACET (SARJANA EDITION)
 * ----------------------------------------------------------- */
const CAMP_ROLES = [
  {
    icon: '🎓',
    title: 'Doktor Filosofi Pop Mie',
    desc: 'Spesialis analisis waktu seduh 3 menit dengan akurasi termal presisi, penyelamat nutrisi keluarga di dinginnya malam Pacet!'
  },
  {
    icon: '🏛️',
    title: 'Profesor Pindah Tidur',
    desc: 'Pakar riset ergonomi rebahan di dalam tenda alam bebas. Meneliti gelombang tidur nyenyak diiringi suara aliran sungai!'
  },
  {
    icon: '⚖️',
    title: 'Magister Refleksi & Orator Keluarga',
    desc: 'Lihai merangkai narasi inspiratif dari hati ke hati, membakar semangat dan mempererat komitmen persaudaraan keluarga besar.'
  },
  {
    icon: '🧭',
    title: 'Komandan Ekspedisi Sungai Pacet',
    desc: 'Ahli navigasi bebatuan kali dan arus air jernih, memimpin generasi muda bereksplorasi alam dengan gagah dan aman.'
  },
  {
    icon: '📷',
    title: 'Direktur Sinematografi & Arsiparis',
    desc: 'Merekam momentum bersejarah keluarga dengan lensa sinematik berkelas untuk arsip kebanggaan generasi mendatang.'
  },
  {
    icon: '🛡️',
    title: 'Insinyur Ketahanan Tenda',
    desc: 'Memastikan seluruh pasak dan konstruksi tenda dome riverside berdiri kokoh sesuai kaidah mekanika teknik bengkel las!'
  },
  {
    icon: '🏆',
    title: 'Ketua Dewan Doorprize & Diplomasi',
    desc: 'Sosok karismatik pencair suasana, mengawal sesi apresiasi dan pembagian doorprize keluarga dengan penuh tawa berbobot.'
  }
];

function initRoleRandomizer() {
  const btnRoll = document.getElementById('btn-roll-role');
  const iconEl = document.getElementById('role-icon');
  const titleEl = document.getElementById('role-title');
  const descEl = document.getElementById('role-desc');

  if (!btnRoll) return;

  btnRoll.addEventListener('click', () => {
    btnRoll.disabled = true;
    btnRoll.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Mengalkulasi...';

    let count = 0;
    const interval = setInterval(() => {
      const tempRole = CAMP_ROLES[Math.floor(Math.random() * CAMP_ROLES.length)];
      iconEl.textContent = tempRole.icon;
      titleEl.textContent = tempRole.title;
      count++;

      if (count > 8) {
        clearInterval(interval);
        const finalRole = CAMP_ROLES[Math.floor(Math.random() * CAMP_ROLES.length)];
        iconEl.textContent = finalRole.icon;
        titleEl.textContent = finalRole.title;
        descEl.textContent = finalRole.desc;
        btnRoll.disabled = false;
        btnRoll.innerHTML = '<i class="bi bi-shuffle me-1"></i> Kocok Ulang Peran Kehormatan';

        if (typeof confetti === 'function') {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#d4af37', '#f3cf65', '#ffffff']
          });
        }
      }
    }, 110);
  });
}

/* -------------------------------------------------------------
 * 6. Interactive Expedition Checklist
 * ----------------------------------------------------------- */
const DEFAULT_CHECKLIST = [
  { id: 'c1', text: 'Jaket tebal / Coat hangat (Hawa malam lereng Pacet cukup dingin)', checked: true },
  { id: 'c2', text: 'Pop Mie cup favorit pilihan + bekal santap malam', checked: true },
  { id: 'c3', text: 'Pakaian ganti nyaman & pakaian outdoor santai', checked: true },
  { id: 'c4', text: 'Tumbler air minum pribadi / botol minum keluarga', checked: false },
  { id: 'c5', text: 'Selimut ekstra / bantal travel untuk ritual "pindah tidur"', checked: false },
  { id: 'c6', text: 'Footwear outdoor / sandal gunung anti selip bebatuan kali', checked: true },
  { id: 'c7', text: 'Obat-obatan pribadi & suplemen daya tahan tubuh', checked: false },
  { id: 'c8', text: 'Keluasan hati, wawasan refleksi & keceriaan keluarga!', checked: true }
];

function initChecklist() {
  const listEl = document.getElementById('fest-checklist-list');
  const fillEl = document.getElementById('fest-checklist-progress-fill');
  const textEl = document.getElementById('fest-checklist-progress-text');
  if (!listEl) return;

  let items = JSON.parse(localStorage.getItem('doa6_exec_checklist_clean')) || DEFAULT_CHECKLIST;

  function render() {
    listEl.innerHTML = '';
    let done = 0;

    items.forEach((item, index) => {
      if (item.checked) done++;

      const div = document.createElement('div');
      div.className = `checklist-exec-item ${item.checked ? 'done' : ''}`;
      div.innerHTML = `
        <div class="checklist-exec-box-check">
          ${item.checked ? '<i class="bi bi-check-lg"></i>' : ''}
        </div>
        <span class="fw-semibold">${item.text}</span>
      `;

      div.addEventListener('click', () => {
        items[index].checked = !items[index].checked;
        localStorage.setItem('doa6_exec_checklist_clean', JSON.stringify(items));
        render();

        if (items.every(i => i.checked) && typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 75,
            colors: ['#d4af37', '#ffffff']
          });
        }
      });

      listEl.appendChild(div);
    });

    const percent = Math.round((done / items.length) * 100);
    if (textEl) textEl.textContent = `${done} dari ${items.length} siap (${percent}%)`;
    if (fillEl) fillEl.style.width = `${percent}%`;
  }

  render();
}

/* -------------------------------------------------------------
 * 7. RSVP & Live Guestbook Kehormatan (BERSIH DARI DUMMY)
 * ----------------------------------------------------------- */
function initRSVP() {
  const form = document.getElementById('fest-rsvp-form');
  const streamEl = document.getElementById('fest-guestbook-stream');
  const totalCountEl = document.getElementById('total-wishes-badge');
  const btnWA = document.getElementById('btn-forward-wa');

  if (!streamEl) return;

  // Bersihkan data dummy lama bila ada, mulai dari data murni user
  // Simpan pada key baru doa6_guestbook_pure
  let comments = JSON.parse(localStorage.getItem('doa6_guestbook_pure')) || [];

  function renderComments() {
    streamEl.innerHTML = '';

    // Jika belum ada pesan, tampilkan Empty State yang bersih & berwibawa
    if (comments.length === 0) {
      streamEl.innerHTML = `
        <div class="guestbook-empty-state text-center py-4 px-3">
          <div class="mb-3 fs-1 text-gold opacity-75">
            <i class="bi bi-chat-square-quote"></i>
          </div>
          <h5 class="font-title text-white mb-2 fs-6">Belum Ada Pesan Kehormatan</h5>
          <p class="small text-secondary mb-0" style="max-width: 340px; margin: 0 auto; line-height: 1.6;">
            Jadilah yang pertama menyampaikan konfirmasi kehadiran dan doa restu untuk seluruh civitas keluarga besar.
          </p>
        </div>
      `;
      if (totalCountEl) totalCountEl.textContent = '0 Konfirmasi';
      return;
    }

    comments.forEach(c => {
      const card = document.createElement('div');
      card.className = 'guestbook-exec-card';

      let pill = '';
      if (c.status === 'hadir') {
        pill = `<span class="guest-pill-exec pill-hadir"><i class="bi bi-check-circle-fill me-1"></i>Pasti Hadir (${c.pax || '1'})</span>`;
      } else if (c.status === 'ragu') {
        pill = `<span class="guest-pill-exec pill-ragu"><i class="bi bi-question-circle-fill me-1"></i>Menyesuaikan Jadwal</span>`;
      } else {
        pill = `<span class="guest-pill-exec pill-tidak"><i class="bi bi-x-circle-fill me-1"></i>Berhalangan Hadir</span>`;
      }

      card.innerHTML = `
        <div class="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-1">
          <strong class="font-title text-white fs-6"><i class="bi bi-award-fill text-gold me-2"></i>${escapeHtml(c.name)}</strong>
          <span class="text-secondary small font-monospace">${c.time}</span>
        </div>
        <div class="mb-2">${pill}</div>
        <p class="mb-0 text-light small" style="line-height: 1.6;">${escapeHtml(c.message)}</p>
      `;

      streamEl.appendChild(card);
    });

    if (totalCountEl) totalCountEl.textContent = `${comments.length} Konfirmasi`;
  }

  renderComments();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const pax = document.getElementById('rsvp-pax').value;
      const msg = document.getElementById('rsvp-message').value.trim();

      if (!name || !msg) {
        alert('Mohon lengkapi nama dan pesan kehormatan Anda!');
        return;
      }

      const now = new Date();
      const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ', ' + 
                      String(now.getHours()).padStart(2, '0') + '.' + 
                      String(now.getMinutes()).padStart(2, '0') + ' WIB';

      const newC = {
        name: name,
        status: status,
        pax: `${pax} Orang`,
        time: timeStr,
        message: msg
      };

      comments.unshift(newC);
      localStorage.setItem('doa6_guestbook_pure', JSON.stringify(comments));
      renderComments();

      // Gold Confetti
      fireGoldConfetti();

      // WhatsApp Forward Button
      if (btnWA) {
        const statLabel = status === 'hadir' ? `Pasti Hadir (${pax} Orang)` : status === 'ragu' ? 'Masih Menyesuaikan Jadwal' : 'Berhalangan Hadir';
        const waMsg = encodeURIComponent(
          `Halo Panitia Retreat Do'a 6!\n\nSaya *${name}* mengonfirmasi:\nKehadiran: *${statLabel}*\nPesan Kehormatan: "${msg}"\n\nSampai jumpa di Gubuk Marawati Pacet!`
        );
        btnWA.href = `https://api.whatsapp.com/send?phone=6281234567890&text=${waMsg}`;
        btnWA.classList.remove('d-none');
      }

      document.getElementById('rsvp-message').value = '';
      alert('🏛️ Terima kasih! Konfirmasi kehormatan Anda berhasil dicatat.');
    });
  }
}

/* -------------------------------------------------------------
 * 8. Location & Calendar Actions
 * ----------------------------------------------------------- */
function initLocationActions() {
  const btnCopy = document.getElementById('btn-copy-loc');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const addr = "Gubuk Marawati, Sajen, Kec. Pacet, Kabupaten Mojokerto, Jawa Timur 61374";
      navigator.clipboard.writeText(addr).then(() => {
        alert('📍 Koordinat & alamat lengkap Gubuk Marawati Pacet berhasil disalin!');
      }).catch(() => {
        alert('Alamat: ' + addr);
      });
    });
  }

  const btnCal = document.getElementById('btn-save-cal');
  if (btnCal) {
    btnCal.addEventListener('click', (e) => {
      e.preventDefault();
      const title = encodeURIComponent("Retreat Kehormatan Keluarga Besar Bengkel Las Do'a 6 - Pacet");
      const details = encodeURIComponent("Kumpul akbar keluarga, santai tepi sungai, pindah tidur, refleksi keluarga, & tradisi Pop Mie bersama di Gubuk Marawati Pacet.");
      const loc = encodeURIComponent("Gubuk Marawati, Pacet, Mojokerto");
      const dates = "20261107T060000Z/20261108T050000Z";
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${loc}`, '_blank');
    });
  }
}

/* -------------------------------------------------------------
 * 9. ScrollSpy for Bottom Dock
 * ----------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const items = document.querySelectorAll('.quick-dock-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(s => {
      if (scrollY >= s.offsetTop - 150 && scrollY < s.offsetTop + s.offsetHeight) {
        current = s.getAttribute('id');
      }
    });

    items.forEach(it => {
      it.classList.remove('active');
      if (it.getAttribute('href') === `#${current}`) {
        it.classList.add('active');
      }
    });
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
