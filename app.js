/**
 * 2DoList — Futuristic Task Manager
 * Vanilla JavaScript — Modüler, Açıklamalı
 *
 * Özellikler:
 *  - Görev ekleme / silme / tamamlama
 *  - Kategori: İş, Kişisel, Eğitim, Sağlık, Genel
 *  - Öncelik: Yüksek, Orta, Düşük
 *  - Deadline + aciliyet glowları
 *  - Durum + kategori çift filtre
 *  - Dark / Light tema
 *  - LocalStorage kalıcılığı
 *  - Canlı saat
 *  - Toast bildirimleri
 */

/* ===========================================================
   1. DURUM
   =========================================================== */

/**
 * @typedef {Object} Task
 * @property {string}  id
 * @property {string}  text
 * @property {string}  priority   - 'low' | 'medium' | 'high'
 * @property {string}  category   - 'is' | 'kisisel' | 'egitim' | 'saglik' | 'genel'
 * @property {string}  deadline   - ISO date string 'YYYY-MM-DD' veya ''
 * @property {boolean} done
 * @property {number}  createdAt  - timestamp
 */

/** @type {Task[]} */
let tasks = [];

/** @type {'all'|'active'|'done'} */
let statusFilter = 'all';

/** @type {'all'|'is'|'kisisel'|'egitim'|'saglik'|'genel'} */
let catFilter = 'all';

/* ===========================================================
   2. DOM REFERANSLARI
   =========================================================== */
const taskInput      = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const deadlineInput  = document.getElementById('deadlineInput');
const addBtn         = document.getElementById('addBtn');
const taskList       = document.getElementById('taskList');
const emptyState     = document.getElementById('emptyState');
const themeToggle    = document.getElementById('themeToggle');
const themeIcon      = document.getElementById('themeIcon');
const toast          = document.getElementById('toast');
const liveClock      = document.getElementById('liveClock');
const clearDoneBtn   = document.getElementById('clearDone');

// İstatistikler
const stTotal  = document.getElementById('stTotal');
const stActive = document.getElementById('stActive');
const stDone   = document.getElementById('stDone');
const stUrgent = document.getElementById('stUrgent');
const progFill = document.getElementById('progFill');
const progPct  = document.getElementById('progPct');
const progBar  = document.getElementById('progBar');

/* ===========================================================
   3. BAŞLANGIÇ
   =========================================================== */
function init() {
  loadFromStorage();
  loadTheme();
  renderAll();
  bindEvents();
  startClock();
  // Aciliyet sınıflarını her dakika güncelle
  setInterval(updateUrgencyClasses, 60_000);
  // Deadline input için minimum bugün tarihi
  deadlineInput.min = getTodayStr();
}

/* ===========================================================
   4. OLAY DİNLEYİCİLERİ
   =========================================================== */
function bindEvents() {
  addBtn.addEventListener('click', handleAdd);
  taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAdd(); });

  // Durum filtreleri
  document.querySelectorAll('.ftab-status').forEach(btn => {
    btn.addEventListener('click', () => {
      statusFilter = btn.dataset.status;
      document.querySelectorAll('.ftab-status').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderAll();
    });
  });

  // Kategori filtreleri
  document.querySelectorAll('.ftab-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      catFilter = btn.dataset.cat;
      document.querySelectorAll('.ftab-cat').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderAll();
    });
  });

  // Tamamlananları temizle
  clearDoneBtn.addEventListener('click', () => {
    const n = tasks.filter(t => t.done).length;
    if (!n) { showToast('// temizlenecek görev yok'); return; }
    tasks = tasks.filter(t => !t.done);
    saveToStorage();
    renderAll();
    showToast(`// ${n} görev silindi`);
  });

  // Tema
  themeToggle.addEventListener('click', toggleTheme);
}

/* ===========================================================
   5. GÖREV EKLEME
   =========================================================== */
function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) {
    shakeEl(taskInput);
    showToast('// görev metni boş olamaz');
    taskInput.focus();
    return;
  }
  if (text.length > 120) {
    showToast('// max 120 karakter');
    return;
  }

  /** @type {Task} */
  const task = {
    id:        `task_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    text,
    priority:  prioritySelect.value,
    category:  categorySelect.value,
    deadline:  deadlineInput.value,   // 'YYYY-MM-DD' veya ''
    done:      false,
    createdAt: Date.now()
  };

  tasks.unshift(task);
  saveToStorage();
  renderAll();

  taskInput.value    = '';
  deadlineInput.value = '';
  taskInput.focus();
  showToast('// görev eklendi ✓');
}

/* ===========================================================
   6. TAMAMLAMA / SİLME
   =========================================================== */

/** @param {string} id */
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  t.done = !t.done;
  saveToStorage();
  renderAll();
  showToast(t.done ? '// tamamlandı ✓' : '// geri alındı');
}

/** @param {string} id */
function deleteTask(id) {
  const el = taskList.querySelector(`[data-id="${id}"]`);

  const removeAndRender = () => {
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage();
    renderAll();
  };

  if (el) {
    el.style.transition = 'all 0.28s cubic-bezier(0.22,1,0.36,1)';
    el.style.transform  = 'translateX(20px) scale(0.97)';
    el.style.opacity    = '0';
    setTimeout(removeAndRender, 280);
  } else {
    removeAndRender();
  }
  showToast('// görev silindi');
}

/* ===========================================================
   7. RENDER
   =========================================================== */
function renderAll() {
  const filtered = getFiltered();
  taskList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    filtered.forEach(t => taskList.appendChild(createTaskEl(t)));
  }

  updateStats();
}

/** Aktif filtrelere göre görevleri döndürür */
function getFiltered() {
  return tasks.filter(t => {
    const matchStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'active' ? !t.done : t.done;
    const matchCat    = catFilter === 'all' || t.category === catFilter;
    return matchStatus && matchCat;
  });
}

/* ===========================================================
   8. GÖREV ELEMENTI
   =========================================================== */

/**
 * Tek görev için <li> oluşturur
 * @param {Task} t
 * @returns {HTMLLIElement}
 */
function createTaskEl(t) {
  const li = document.createElement('li');
  li.className = `task-item${t.done ? ' done' : ''}`;
  li.dataset.id  = t.id;
  li.dataset.cat = t.category;
  li.setAttribute('role', 'listitem');
  applyUrgencyClass(li, t);

  /* --- Checkbox --- */
  const chk = document.createElement('div');
  chk.className = `task-check${t.done ? ' checked' : ''}`;
  chk.setAttribute('role', 'checkbox');
  chk.setAttribute('aria-checked', String(t.done));
  chk.setAttribute('tabindex', '0');
  chk.setAttribute('aria-label', t.done ? 'Görevi geri al' : 'Görevi tamamla');
  chk.addEventListener('click', () => toggleTask(t.id));
  chk.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(t.id); }
  });

  /* --- Metin --- */
  const txt = document.createElement('span');
  txt.className   = 'task-text';
  txt.textContent = t.text;
  txt.title       = t.text;

  /* --- Kategori badge --- */
  const catBadge = document.createElement('span');
  catBadge.className = `cat-badge cb-${t.category}`;
  catBadge.textContent = catLabel(t.category);

  /* --- Öncelik etiketi --- */
  const priTag = document.createElement('span');
  priTag.className   = `priority-tag ${t.priority}`;
  priTag.textContent = priLabel(t.priority);

  /* --- Deadline badge --- */
  const dlBadge = document.createElement('span');
  if (t.deadline) {
    const { label, cls } = deadlineInfo(t.deadline);
    dlBadge.className   = `deadline-badge ${cls}`;
    dlBadge.textContent = label;
    dlBadge.setAttribute('aria-label', `Son tarih: ${label}`);
  }

  /* --- Sil butonu --- */
  const delBtn = document.createElement('button');
  delBtn.className  = 'del-btn';
  delBtn.innerHTML  = '✕';
  delBtn.setAttribute('aria-label', 'Görevi sil');
  delBtn.addEventListener('click', e => { e.stopPropagation(); deleteTask(t.id); });

  li.appendChild(chk);
  li.appendChild(txt);
  if (t.category !== 'genel') li.appendChild(catBadge);
  li.appendChild(priTag);
  if (t.deadline) li.appendChild(dlBadge);
  li.appendChild(delBtn);

  return li;
}

/* ===========================================================
   9. DEADLINE ACİLİYET HESAPLAMA
   =========================================================== */

/**
 * Deadline'a kaç gün kaldığını ve ilgili CSS sınıfını döndürür.
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @returns {{ daysLeft: number, urgency: string, label: string, cls: string }}
 */
function deadlineInfo(dateStr) {
  if (!dateStr) return { daysLeft: Infinity, urgency: 'none', label: '', cls: '' };

  const now      = new Date();
  const today    = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadline = new Date(dateStr);
  const diffMs   = deadline - today;
  const daysLeft = Math.round(diffMs / 86_400_000); // ms → gün

  let urgency, label, cls;

  if (daysLeft < 0) {
    urgency = 'overdue';
    label   = `⚠ ${Math.abs(daysLeft)}g gecikti`;
    cls     = 'bd-overdue';
  } else if (daysLeft === 0) {
    urgency = 'critical';
    label   = '🔴 BUGÜN';
    cls     = 'bd-critical';
  } else if (daysLeft === 1) {
    urgency = 'critical';
    label   = '🟠 yarın';
    cls     = 'bd-critical';
  } else if (daysLeft <= 3) {
    urgency = 'warning';
    label   = `🟡 ${daysLeft}g kaldı`;
    cls     = 'bd-warning';
  } else if (daysLeft <= 7) {
    urgency = 'soon';
    label   = `🔵 ${daysLeft}g kaldı`;
    cls     = 'bd-soon';
  } else {
    urgency = 'normal';
    label   = `📅 ${fmtDate(dateStr)}`;
    cls     = 'bd-normal';
  }

  return { daysLeft, urgency, label, cls };
}

/**
 * Göreve aciliyet CSS sınıfını uygular
 * @param {HTMLElement} el
 * @param {Task} t
 */
function applyUrgencyClass(el, t) {
  if (t.done || !t.deadline) return;
  const { urgency } = deadlineInfo(t.deadline);
  if (urgency !== 'none' && urgency !== 'normal') {
    el.classList.add(`urgency-${urgency}`);
  }
}

/** Tüm task item'larının urgency sınıflarını günceller (zamanlayıcı için) */
function updateUrgencyClasses() {
  taskList.querySelectorAll('.task-item').forEach(el => {
    const id = el.dataset.id;
    const t  = tasks.find(t => t.id === id);
    if (!t) return;
    el.classList.remove('urgency-overdue','urgency-critical','urgency-warning','urgency-soon');
    applyUrgencyClass(el, t);
  });
  updateStats();
}

/* ===========================================================
   10. İSTATİSTİKLER
   =========================================================== */
function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const active  = total - done;
  const urgent  = tasks.filter(t => {
    if (t.done || !t.deadline) return false;
    const { urgency } = deadlineInfo(t.deadline);
    return urgency === 'overdue' || urgency === 'critical';
  }).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  animateNum(stTotal,  parseInt(stTotal.textContent)  || 0, total);
  animateNum(stActive, parseInt(stActive.textContent) || 0, active);
  animateNum(stDone,   parseInt(stDone.textContent)   || 0, done);
  animateNum(stUrgent, parseInt(stUrgent.textContent) || 0, urgent);

  progFill.style.width = pct + '%';
  progPct.textContent  = pct + '%';
  progBar.setAttribute('aria-valuenow', pct);
}

/** Sayıyı animasyonlu olarak günceller */
function animateNum(el, from, to) {
  if (from === to) { el.textContent = to; return; }
  const dur = 400;
  const t0  = performance.now();
  const step = now => {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to;
  };
  requestAnimationFrame(step);
}

/* ===========================================================
   11. TEMA
   =========================================================== */
function toggleTheme() {
  const isLight = document.documentElement.dataset.theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'dark' : 'light';
  themeIcon.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('2dl_theme', isLight ? 'dark' : 'light');
}

function loadTheme() {
  const saved = localStorage.getItem('2dl_theme') || 'dark';
  document.documentElement.dataset.theme = saved;
  themeIcon.textContent = saved === 'light' ? '🌙' : '☀️';
}

/* ===========================================================
   12. CANLÝ SAAT
   =========================================================== */
function startClock() {
  function tick() {
    const now = new Date();
    const h   = String(now.getHours()).padStart(2,'0');
    const m   = String(now.getMinutes()).padStart(2,'0');
    const s   = String(now.getSeconds()).padStart(2,'0');
    liveClock.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ===========================================================
   13. LOCAL STORAGE
   =========================================================== */
function saveToStorage() {
  try { localStorage.setItem('2dl_tasks', JSON.stringify(tasks)); }
  catch(e) { console.warn('LS write error:', e); }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('2dl_tasks');
    if (raw) tasks = JSON.parse(raw);
  } catch(e) {
    tasks = [];
    console.warn('LS read error:', e);
  }
}

/* ===========================================================
   14. TOAST
   =========================================================== */
let _toastTimer;

/**
 * @param {string} msg
 * @param {number} [ms=2400]
 */
function showToast(msg, ms = 2400) {
  clearTimeout(_toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  _toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

/* ===========================================================
   15. YARDIMCILAR
   =========================================================== */

/** Input'a sallama animasyonu uygular */
function shakeEl(el) {
  el.style.animation = 'none';
  void el.offsetWidth; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
}

/** Bugünün tarihini 'YYYY-MM-DD' formatında döndürür */
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

/** 'YYYY-MM-DD' → 'DD.MM.YYYY' */
function fmtDate(str) {
  if (!str) return '';
  const [y,m,d] = str.split('-');
  return `${d}.${m}.${y}`;
}

/** Öncelik değerini etiket metnine çevirir */
function priLabel(v) {
  return { low:'↓ Düşük', medium:'→ Orta', high:'↑ Yüksek' }[v] || v;
}

/** Kategori değerini etiket metnine çevirir */
function catLabel(v) {
  return { is:'💼 İş', kisisel:'👤 Kişisel', egitim:'📚 Eğitim', saglik:'💪 Sağlık', genel:'📌 Genel' }[v] || v;
}

/* Shake keyframe */
(function() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes shake {
      0%,100%{ transform:translateX(0); }
      20%    { transform:translateX(-7px); }
      40%    { transform:translateX(7px); }
      60%    { transform:translateX(-4px); }
      80%    { transform:translateX(4px); }
    }`;
  document.head.appendChild(s);
})();

/* ===========================================================
   16. ÇALIŞTIR
   =========================================================== */
document.addEventListener('DOMContentLoaded', init);
