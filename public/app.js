/* ================================================================
   KROMA CONTENT OS · frontend
   Vanilla ES modules · local API first, cached offline fallback
   ================================================================ */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const CACHE_KEY = 'kroma.contentos.v2';
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const PILLARS = ['Verdades incómodas', 'Humor caos operativo', 'Cirugía visual', 'Bastidores'];
const OBJECTIVES = ['Alcance', 'Autoridad', 'Conversión al DM', 'Comunidad', 'Ventas'];
const STATUSES = ['Idea', 'Guionando', 'Por Grabar', 'Programado', 'Publicado'];

const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16" rx="4"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>',
  reel: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m10 8 6 4-6 4V8Z"/><path d="M3 8h3M18 8h3M8 3v3M16 3v3"/>',
  story: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5" stroke-dasharray="2 3"/><path d="M12 1.5v2M22.5 12h-2M12 22.5v-2M1.5 12h2"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M12 13v4M8.5 21h7M10 17h4v4h-4z"/>',
  chat: '<path d="M20.5 11.2a8.5 8.5 0 0 1-12.6 7.5L3 20l1.4-4.4A8.5 8.5 0 1 1 20.5 11.2Z"/><path d="M8 10.5h8M8 14h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  sparkles: '<path d="m12 3 1.3 4.2L17.5 8.5l-4.2 1.3L12 14l-1.3-4.2-4.2-1.3 4.2-1.3L12 3Z"/><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z"/><path d="m5 14 .7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  flame: '<path d="M12 22c4 0 7-2.8 7-6.8 0-3.3-1.9-5.5-4.2-7.6C13 5.9 12.4 3.9 12.5 2c-2.7 1.9-4 4.5-4 6.8 0 1.4.4 2.5 1.1 3.5-1.3-.4-2.2-1.5-2.7-2.7-.5 1-.9 2.2-.9 3.6C6 18.2 8 22 12 22Z"/><path d="M12 22c-1.8 0-3-1.4-3-3.2 0-2.2 2-3.2 3-5.8 1 2.6 3 3.6 3 5.8 0 1.8-1.2 3.2-3 3.2Z"/>',
  thermometer: '<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="3"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-5.3a8.4 8.4 0 1 1 16.1-4.2Z"/>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4.5L5 22V4a1 1 0 0 1 1-1Z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  tiktok: '<path d="M14.5 3v10.2a4.6 4.6 0 1 1-4-4.5"/><path d="M14.5 3c.4 3 2.2 4.8 5 5.1"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  trendUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  alert: '<path d="M10.3 3.7 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  dollar: '<path d="M12 2v20M17 6.5h-6a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7H7"/>',
  zap: '<path d="M13 2 3 14h7l-1 8 11-13h-7l1-7Z"/>',
  poll: '<path d="M8 20V10M12 20V4M16 20v-7M4 20h16"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>',
  more: '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M7 3v6h9V3M7 21v-7h10v7"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 10v7M14 10v7"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
  plug: '<path d="M9 3v6M15 3v6M6 9h12v3a6 6 0 0 1-12 0V9ZM12 18v3"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="m8 5 11 7-11 7V5Z"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  command: '<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 0 0 0-6Z"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  video: '<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
};

const icon = (name, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;

/* ----------------------------------------------------------------
   Utilities
   ---------------------------------------------------------------- */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-VE').format(Number(value) || 0);
}

function formatCompact(value) {
  const n = Number(value) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (n >= 10_000) return `${Math.round(n / 1000).toLocaleString('es-VE')}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace('.', ',')}K`;
  return formatNumber(n);
}

function formatDateShort(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function dateKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  return `${MONTHS_LONG[month - 1]} ${year}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatFullDate(iso) {
  const d = new Date(iso);
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()} · ${formatTime(iso)}`;
}

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date = new Date()) {
  const d = startOfDay(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d;
}

function toInputDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function nextSundayDate() {
  const date = new Date();
  const days = (7 - date.getDay()) % 7 || 7;
  date.setDate(date.getDate() + days);
  return toInputDate(date);
}

function statusMeta(status) {
  switch (status) {
    case 'Guionando': return { cls: 'status-writing', label: 'Guionando' };
    case 'Por Grabar': return { cls: 'status-ready', label: 'Por Grabar' };
    case 'Programado': return { cls: 'status-scheduled', label: 'Programado' };
    case 'Publicado': return { cls: 'status-published', label: 'Publicado' };
    default: return { cls: 'status-idea', label: 'Idea' };
  }
}

function performanceFor(post) {
  const metrics = metricsFor(post);
  if (post.status !== 'Publicado' || metrics.views === 0) {
    return { cls: 'state-none', label: 'Sin datos', icon: 'poll' };
  }
  const peers = publishedPosts().map((item) => metricsFor(item).views).filter((views) => views > 0);
  if (peers.length < 2) {
    return { cls: 'state-average', label: 'Con datos', icon: 'trendUp' };
  }
  const average = peers.reduce((sum, views) => sum + views, 0) / peers.length;
  if (metrics.views >= average * 1.3) return { cls: 'state-top', label: 'Top ganador', icon: 'flame' };
  if (metrics.views <= average * 0.7) return { cls: 'state-low', label: 'Bajo', icon: 'arrowDown' };
  return { cls: 'state-average', label: 'Promedio', icon: 'poll' };
}

function temperatureFor(post) {
  const metrics = metricsFor(post);
  if (post.status !== 'Publicado' || metrics.views === 0 || metrics.dms === 0) {
    return { cls: 'temp-none', label: 'Sin clasificar' };
  }
  const peers = publishedPosts().map((item) => metricsFor(item).dms).filter((dms) => dms > 0);
  if (!peers.length) return { cls: 'temp-none', label: 'Sin clasificar' };
  const average = peers.reduce((sum, dms) => sum + dms, 0) / peers.length;
  if (metrics.dms >= average * 1.2) return { cls: 'temp-hot', label: 'Caliente' };
  if (metrics.dms >= average * 0.8) return { cls: 'temp-warm', label: 'Tibia' };
  return { cls: 'temp-cold', label: 'Fría' };
}

function platformInfo(post) {
  if (post.platform === 'tiktok') return { label: 'TikTok', icon: 'tiktok' };
  if (post.formatKey === 'story') return { label: 'IG Story', icon: 'story' };
  if (post.formatKey === 'carousel') return { label: 'IG Carrusel', icon: 'image' };
  return { label: 'IG Reel', icon: 'instagram' };
}

function formatIcon(formatKey) {
  if (formatKey === 'story') return 'story';
  if (formatKey === 'carousel') return 'image';
  return 'video';
}

function delta(value, suffix = '%') {
  const up = Number(value) >= 0;
  return `<span class="delta ${up ? '' : 'is-down'}">${icon(up ? 'arrowUp' : 'arrowDown')}${up ? '+' : ''}${String(value).replace('.', ',')}${suffix}</span>`;
}

function toast(message, type = 'success') {
  const region = $('#toasts');
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'is-error' : ''}`;
  el.innerHTML = `<span class="toast-icon">${icon(type === 'error' ? 'alert' : 'check')}</span><span>${esc(message)}</span>`;
  region.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-out');
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

function safeCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(state.db));
  } catch {
    /* storage can be unavailable */
  }
}

function cachedState() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ----------------------------------------------------------------
   API client
   ---------------------------------------------------------------- */
const api = {
  async request(path, options = {}) {
    const response = await fetch(path, {
      cache: 'no-store',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      throw new Error('La API devolvió una respuesta que no es JSON.');
    }
    if (!response.ok || payload.ok === false) {
      throw new Error(payload.error || `API ${response.status}`);
    }
    return payload.data;
  },
  state() { return this.request('/api/state'); },
  health() { return this.request('/api/health'); },
  createPost(payload) {
    return this.request('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
  },
  patchPost(id, patch) {
    return this.request(`/api/posts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
  duplicatePost(id) {
    return this.request(`/api/posts/${encodeURIComponent(id)}/duplicate`, { method: 'POST' });
  },
  addComment(id, payload) {
    return this.request(`/api/posts/${encodeURIComponent(id)}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  patchProspect(id, patch) {
    return this.request(`/api/prospects/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },
  sendMessage(id, text) {
    return this.request(`/api/prospects/${encodeURIComponent(id)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  createProspect(payload) {
    return this.request('/api/prospects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  reset() { return this.request('/api/reset', { method: 'POST' }); },
};

/* ----------------------------------------------------------------
   State
   ---------------------------------------------------------------- */
const state = {
  db: null,
  loading: true,
  fatal: null,
  apiOnline: false,
  apiHealth: null,
  view: 'dashboard',
  activeNav: 'dashboard',
  selectedPostId: null,
  selectedProspectId: null,
  storyPostId: null,
  activeTab: 'script',
  channel: 'all',
  period: 'month',
  month: '2026-10',
  search: '',
  searchOpen: false,
  hookFilter: 'all',
  leadsFilter: 'all',
  editingScript: false,
  likedComments: new Set(),
  modalOpen: false,
  mobileQueue: false,
  insightsOpen: false,
  scrollPreserve: false,
};

const metricsSaveTimers = new Map();
const postMutationSeq = new Map();

/* ----------------------------------------------------------------
   Data helpers
   ---------------------------------------------------------------- */
function posts() {
  return state.db?.posts || [];
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function metricsFor(post) {
  const metrics = post?.metrics || {};
  return {
    views: number(metrics.views),
    comments: number(metrics.comments),
    saves: number(metrics.saves),
    dms: number(metrics.dms ?? metrics.leads),
    leads: number(metrics.leads ?? metrics.dms),
    likes: number(metrics.likes),
    shares: number(metrics.shares),
  };
}

function publishedPosts() {
  return posts().filter((post) => post.status === 'Publicado');
}

function globalMetrics() {
  return publishedPosts().reduce((total, post) => {
    const metrics = metricsFor(post);
    total.views += metrics.views;
    total.comments += metrics.comments;
    total.saves += metrics.saves;
    total.dms += metrics.dms;
    total.leads += metrics.leads;
    total.likes += metrics.likes;
    total.shares += metrics.shares;
    total.count += 1;
    return total;
  }, { views: 0, comments: 0, saves: 0, dms: 0, leads: 0, likes: 0, shares: 0, count: 0 });
}

function conversionRate() {
  const global = globalMetrics();
  return global.views ? (global.dms / global.views) * 100 : 0;
}

function performanceScore(post) {
  const metrics = metricsFor(post);
  if (post.status !== 'Publicado' || metrics.views === 0) return null;
  const maxViews = Math.max(...publishedPosts().map((item) => metricsFor(item).views), 0);
  return maxViews ? Math.round((metrics.views / maxViews) * 100) : null;
}

function engagementRate(post) {
  const metrics = metricsFor(post);
  return metrics.views ? ((metrics.comments + metrics.saves) / metrics.views) * 100 : 0;
}

function hooksFromPosts() {
  const all = posts();
  const maxViews = Math.max(...all.map((post) => metricsFor(post).views), 0);
  return all.map((post) => {
    const metrics = metricsFor(post);
    return {
      id: post.id,
      text: post.hook,
      score: maxViews ? Math.round((metrics.views / maxViews) * 100) : 0,
      views: metrics.views,
      dms: metrics.dms,
      status: post.status,
      platform: platformInfo(post).label,
      pillar: post.pillar,
      cta: post.cta?.keyword || '—',
    };
  });
}

function weeklyViewSeries() {
  const series = [0, 0, 0, 0, 0, 0, 0];
  for (const post of publishedPosts()) {
    const metrics = metricsFor(post);
    const date = new Date(post.date);
    const index = (date.getDay() + 6) % 7;
    series[index] += metrics.views;
  }
  return series;
}

function heatmapFromPosts() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const slots = ['08–10', '12–14', '18–20', '21–23'];
  const values = slots.map(() => days.map(() => 0));
  for (const post of publishedPosts()) {
    const date = new Date(post.date);
    const dayIndex = (date.getDay() + 6) % 7;
    const hour = date.getHours();
    const slotIndex = hour <= 10 ? 0 : hour <= 14 ? 1 : hour <= 20 ? 2 : 3;
    values[slotIndex][dayIndex] += metricsFor(post).views;
  }
  return { days, slots, values };
}

function bestTimeWindows() {
  const map = new Map();
  for (const post of publishedPosts()) {
    const date = new Date(post.date);
    const day = WEEKDAYS_SHORT[date.getDay()];
    const hour = `${String(date.getHours()).padStart(2, '0')}:00`;
    const key = `${day}-${hour}`;
    const total = map.get(key) || { day, time: hour, views: 0, count: 0 };
    total.views += metricsFor(post).views;
    total.count += 1;
    map.set(key, total);
  }
  return [...map.values()].sort((a, b) => b.views - a.views).slice(0, 3);
}

function notificationsFromState() {
  const pendingMetrics = publishedPosts().filter((post) => metricsFor(post).views === 0);
  const scheduledToday = posts().filter((post) => post.status === 'Programado' && dateKey(post.date) === toInputDate(new Date()));
  const unread = (state.db?.prospects || []).filter((lead) => lead.unread > 0);
  const notifications = [];
  if (pendingMetrics.length) {
    notifications.push({
      id: 'pending-metrics',
      tone: 'coral',
      title: `${pendingMetrics.length} ${pendingMetrics.length === 1 ? 'publicación publicada' : 'publicaciones publicadas'} sin métricas`,
      text: 'Completá Vistas, Comentarios, Guardados y DMs para que el panel global se actualice.',
      action: 'Completar registro',
      targetId: pendingMetrics[0].id,
    });
  }
  if (scheduledToday.length) {
    notifications.push({
      id: 'scheduled-today',
      tone: 'yellow',
      title: `${scheduledToday.length} ${scheduledToday.length === 1 ? 'pieza programada' : 'piezas programadas'} para hoy`,
      text: `${scheduledToday[0].hook} · ${formatTime(scheduledToday[0].date)}`,
      action: 'Abrir pieza',
      targetId: scheduledToday[0].id,
    });
  }
  if (unread.length) {
    notifications.push({
      id: 'unread-dms',
      tone: 'coral',
      title: `${unread.length} ${unread.length === 1 ? 'DM sin leer' : 'DMs sin leer'}`,
      text: 'Hay conversaciones esperando respuesta en Prospectos.',
      action: 'Ir a Prospectos',
      targetId: unread[0].id,
    });
  }
  if (!notifications.length) {
    notifications.push({
      id: 'clean',
      tone: 'yellow',
      title: 'Sin alertas pendientes',
      text: posts().length ? 'Tus métricas están completas. Seguí creando contenido.' : 'Creá tu primera pieza para empezar a medir.',
      action: posts().length ? 'Nueva pieza' : 'Crear primera pieza',
      targetId: null,
    });
  }
  return notifications;
}

function selectedPost() {
  return posts().find((post) => post.id === state.selectedPostId) || posts()[0] || null;
}

function selectedProspect() {
  return state.db?.prospects?.find((prospect) => prospect.id === state.selectedProspectId)
    || state.db?.prospects?.[0]
    || null;
}

function storyPost() {
  const stories = posts().filter((post) => post.formatKey === 'story');
  return stories.find((post) => post.id === state.storyPostId)
    || stories.find((post) => (post.storyFrames || []).length)
    || stories[0]
    || null;
}

function monthlyPosts() {
  return posts().filter((post) => monthKey(post.date) === state.month);
}

function publishedCount() {
  return monthlyPosts().filter((post) => post.status === 'Publicado').length;
}

function monthOptions() {
  const values = new Set([...posts().map((post) => monthKey(post.date)), state.month]);
  if (state.db?.meta?.currentMonth) values.add(state.db.meta.currentMonth);
  return [...values].sort();
}

function filteredPosts() {
  let result = posts().filter((post) => {
    const d = new Date(post.date);
    if (state.period === 'week') {
      const start = startOfWeek();
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return d >= start && d < end;
    }
    return monthKey(post.date) === state.month;
  });

  if (state.channel !== 'all') {
    result = result.filter((post) => post.formatKey === state.channel);
  }

  if (state.search.trim()) {
    const query = state.search.trim().toLowerCase();
    result = result.filter((post) =>
      [post.hook, post.pillar, post.status, post.objective, post.platform, post.format]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }
  return result;
}

function groupedPosts(list) {
  const today = startOfDay();
  const todayKey = toInputDate(today);
  const todayItems = [];
  const upcoming = [];
  const past = [];

  for (const post of list) {
    const key = dateKey(post.date);
    if (key === todayKey) todayItems.push(post);
    else if (new Date(post.date) >= today) upcoming.push(post);
    else past.push(post);
  }

  const byTime = (a, b) => new Date(a.date) - new Date(b.date);
  const byTimeDesc = (a, b) => new Date(b.date) - new Date(a.date);
  return [
    {
      label: `Hoy · ${today.getDate()} ${MONTHS_SHORT[today.getMonth()]}`,
      items: todayItems.sort(byTime),
    },
    { label: 'Próximos', items: upcoming.sort(byTime) },
    { label: 'Anteriores', items: past.sort(byTimeDesc) },
  ].filter((group) => group.items.length);
}

/* ----------------------------------------------------------------
   Render · rail
   ---------------------------------------------------------------- */
const NAV = [
  { route: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { route: 'calendar', label: 'Calendario', icon: 'calendar' },
  { route: 'reels', label: 'Reels / TikTok', icon: 'reel' },
  { route: 'stories', label: 'Historias', icon: 'story' },
  { route: 'hooks', label: 'Hook lab', icon: 'trophy' },
  { route: 'leads', label: 'Prospectos / DMs', icon: 'chat' },
];

function renderRail() {
  const active = state.activeNav;
  const monthPosts = monthlyPosts();
  const published = monthPosts.filter((post) => post.status === 'Publicado').length;
  const completion = monthPosts.length ? Math.round((published / monthPosts.length) * 100) : 0;
  $('#rail').innerHTML = `
    <button class="rail-logo" data-action="nav" data-route="dashboard" aria-label="Kroma Studio · Inicio">
      <strong>K</strong>
    </button>
    <span class="rail-rule"></span>
    <nav class="rail-nav">
      ${NAV.map((item) => `
        <button class="rail-link ${active === item.route ? 'is-active' : ''}" data-action="nav" data-route="${item.route}" aria-label="${item.label}" aria-current="${active === item.route ? 'page' : 'false'}">
          ${icon(item.icon)}
          <span class="rail-tip">${item.label}</span>
        </button>
      `).join('')}
    </nav>
    <div class="rail-bottom">
      <div class="rail-ring" title="${completion}% del contenido del mes está publicado" style="background:conic-gradient(var(--yellow) 0 ${completion}%, rgba(255,255,255,.1) ${completion}% 100%)"><span>${completion}%</span></div>
      <button class="rail-avatar" data-action="account" aria-label="Cuenta de Kroma">
        <strong>K</strong>
      </button>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · queue
   ---------------------------------------------------------------- */
function kpiCard({ label, value, sub, iconName, color = 'var(--yellow)', bg = 'rgba(255,214,0,.1)', glow = 'rgba(255,214,0,.06)', raw = false }) {
  return `
    <div class="kpi-card" style="--kpi-color:${color};--kpi-bg:${bg};--kpi-glow:${glow}" title="${esc(label)}">
      <div class="kpi-card-top">
        <span class="kpi-label">${label}</span>
        <span class="kpi-icon">${icon(iconName)}</span>
      </div>
      <div class="kpi-value">${raw ? value : esc(value)}</div>
      <div class="kpi-foot">${sub}</div>
    </div>
  `;
}

function renderKpis() {
  const all = posts();
  const global = globalMetrics();
  const ideas = all.filter((post) => ['Idea', 'Guionando'].includes(post.status)).length;
  const ready = all.filter((post) => post.status === 'Por Grabar').length;
  const writing = all.filter((post) => post.status === 'Guionando').length;
  const scheduled = all.filter((post) => post.status === 'Programado').length;
  const published = publishedCount();
  $('#kpiGrid').innerHTML = [
    kpiCard({
      label: 'Ideas / grabar',
      value: ideas + ready,
      sub: `<b>${ready}</b> por grabar · <b>${writing}</b> guionando`,
      iconName: 'sparkles',
    }),
    kpiCard({
      label: 'Programados',
      value: scheduled,
      sub: `<b>${monthlyPosts().filter((p) => p.status === 'Programado').length}</b> en ${MONTHS_SHORT[Number(state.month.slice(5)) - 1]}`,
      iconName: 'calendar',
      color: 'var(--lavender)',
      bg: 'rgba(197,180,227,.1)',
      glow: 'rgba(197,180,227,.08)',
    }),
    kpiCard({
      label: 'Publicados',
      value: published,
      sub: `<b>${global.count}</b> ${global.count === 1 ? 'publicado' : 'publicados'} en total`,
      iconName: 'check',
      color: 'var(--amber)',
      bg: 'rgba(255,176,32,.1)',
      glow: 'rgba(255,176,32,.07)',
    }),
    kpiCard({
      label: 'DMs / Leads',
      value: formatNumber(global.dms),
      sub: `<b>${formatNumber(global.leads)}</b> leads · ${global.count} ${global.count === 1 ? 'post' : 'posts'}`,
      iconName: 'chat',
      color: 'var(--coral)',
      bg: 'rgba(255,107,107,.1)',
      glow: 'rgba(255,107,107,.07)',
    }),
  ].join('');
}

function renderChannelFilters() {
  const counts = {
    all: filteredByPeriodOnly().length,
    reel: filteredByPeriodOnly().filter((post) => post.formatKey === 'reel').length,
    story: filteredByPeriodOnly().filter((post) => post.formatKey === 'story').length,
    carousel: filteredByPeriodOnly().filter((post) => post.formatKey === 'carousel').length,
  };
  const labels = {
    all: 'Todos',
    reel: 'Reels / TikTok',
    story: 'Historias',
    carousel: 'Carrusel',
  };
  $('#channelFilters').innerHTML = Object.entries(labels).map(([key, label]) => `
    <button class="chip chip-dark ${state.channel === key ? 'is-active' : ''}" data-action="channel" data-channel="${key}">
      ${label}${key === 'all' ? ` <span>${counts.all}</span>` : ''}
    </button>
  `).join('');
  const countAll = $('#countAll');
  if (countAll) countAll.textContent = counts.all;
}

function filteredByPeriodOnly() {
  return posts().filter((post) => {
    if (state.period === 'week') {
      const start = startOfWeek();
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const d = new Date(post.date);
      return d >= start && d < end;
    }
    return monthKey(post.date) === state.month;
  });
}

function renderMonthSelect() {
  const select = $('#monthSelect');
  const options = monthOptions();
  select.innerHTML = options.map((month) => `
    <option value="${month}" ${state.month === month ? 'selected' : ''}>${monthLabel(month)}</option>
  `).join('');
}

function contentCard(post) {
  const status = statusMeta(post.status);
  const platform = platformInfo(post);
  const d = new Date(post.date);
  return `
    <button class="content-card ${state.selectedPostId === post.id ? 'is-selected' : ''}" data-action="select-post" data-id="${esc(post.id)}" aria-pressed="${state.selectedPostId === post.id}">
      <span class="content-date">
        <b>${String(d.getDate()).padStart(2, '0')}</b>
        <span>${MONTHS_SHORT[d.getMonth()]}</span>
      </span>
      <span class="content-main">
        <span class="content-topline">
          <span class="content-platform">${icon(platform.icon)} ${platform.label}</span>
          <span class="content-time">${formatTime(post.date)}</span>
        </span>
        <span class="content-hook">${esc(post.hook)}</span>
        <span class="content-meta">
          <span class="content-pillar">${esc(post.pillar)}</span>
          <span class="status-chip ${status.cls}">${status.label}</span>
        </span>
      </span>
    </button>
  `;
}

function renderWorklist() {
  const list = filteredPosts();
  const groups = groupedPosts(list);
  const worklist = $('#worklist');
  const empty = $('#queueEmpty');
  $('#worklistCount').textContent = `${list.length} ${list.length === 1 ? 'pieza' : 'piezas'}`;
  if (!list.length) {
    worklist.innerHTML = '';
    worklist.hidden = true;
    empty.hidden = false;
    const total = posts().length;
    const title = empty.querySelector('strong');
    const copy = empty.querySelector('p');
    if (title) title.textContent = total ? 'Nada por acá' : 'Tu worklist está vacío';
    if (copy) {
      copy.textContent = total
        ? 'Probá otro filtro o creá una pieza nueva para esta semana.'
        : 'Creá tu primera pieza para empezar a alimentar el Content OS con datos reales.';
    }
    return;
  }
  worklist.hidden = false;
  empty.hidden = true;
  worklist.innerHTML = groups.map((group) => `
    <div class="worklist-group-label">${esc(group.label)}</div>
    ${group.items.map(contentCard).join('')}
  `).join('');
}

function renderQueue() {
  renderKpis();
  renderChannelFilters();
  renderMonthSelect();
  $$('#periodToggle button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.period === state.period);
  });
  $('#queueSearchWrap').hidden = !(state.searchOpen || state.search);
  const search = $('#queueSearch');
  if (search && search.value !== state.search) search.value = state.search;
  renderWorklist();
  updateApiUi();
}

function updateApiUi() {
  const online = state.apiOnline;
  $$('.api-dot').forEach((dot) => dot.classList.toggle('is-offline', !online));
  const queueLabel = $('#apiLabel');
  if (queueLabel) queueLabel.textContent = online ? 'API local conectada' : 'API offline · modo caché';
  const pill = $('#apiPill');
  if (pill) {
    pill.querySelector('span:last-child').textContent = online ? 'API live' : 'API offline';
    pill.style.color = online ? '#6f6f78' : '#b33f37';
  }
  const dot = $('#apiDot');
  if (dot) dot.classList.toggle('is-offline', !online);
}

/* ----------------------------------------------------------------
   Render · topbar and main
   ---------------------------------------------------------------- */
function breadcrumbData() {
  if (state.view === 'detail') {
    const post = selectedPost();
    return {
      home: 'Contenido',
      parent: post ? platformInfo(post).label : 'Biblioteca',
      current: post ? (post.formatKey === 'story' ? 'Historia' : post.formatKey === 'carousel' ? 'Carrusel' : 'Detalle') : 'Detalle',
      badge: 'Guardado',
    };
  }
  if (state.view === 'dashboard') return { home: 'Workspace', parent: 'Resumen', current: 'Dashboard' };
  if (state.view === 'calendar') return { home: 'Editorial', parent: 'Calendario', current: monthLabel(state.month) };
  if (state.view === 'stories') return { home: 'Contenido', parent: 'Historias', current: 'Secuencia' };
  if (state.view === 'hooks') return { home: 'Inteligencia', parent: 'Hook lab', current: 'Ranking' };
  if (state.view === 'leads') return { home: 'CRM', parent: 'Prospectos', current: 'Bandeja de DMs' };
  return { home: 'Kroma', parent: 'Workspace', current: 'Content OS' };
}

function renderTopbar() {
  const crumb = breadcrumbData();
  const hasNotifications = notificationsFromState().some((notification) => notification.id !== 'clean');
  const notifDot = $('.notif-dot');
  if (notifDot) notifDot.style.display = hasNotifications ? 'block' : 'none';
  $('#breadcrumb').innerHTML = `
    <span class="crumb-home">${esc(crumb.home)}</span>
    <span class="crumb-sep">/</span>
    <span>${esc(crumb.parent)}</span>
    <span class="crumb-sep">/</span>
    <strong>${esc(crumb.current)}</strong>
    ${crumb.badge ? `<span class="crumb-badge">${icon('check')} ${esc(crumb.badge)}</span>` : ''}
  `;
}

function renderMain(options = {}) {
  const scroller = $('#mainScroll');
  const previous = scroller.scrollTop;
  const container = $('#mainView');
  if (state.loading) {
    container.innerHTML = `<div class="card card-pad"><div class="skeleton" style="height:220px"></div></div>`;
    return;
  }
  if (state.fatal) {
    container.innerHTML = `
      <div class="state-card">
        <span class="state-icon">${icon('plug')}</span>
        <h2>La API local no responde</h2>
        <p>El frontend está listo, pero no pudo leer los datos. Arrancá el servidor con <b>npm start</b> y verificá el puerto <b>4173</b>.</p>
        <div class="api-code"><span># terminal</span><br>npm start<br><br><span># healthcheck</span><br>curl http://127.0.0.1:4173/api/health</div>
        <div style="display:flex;gap:7px;margin-top:16px">
          <button class="pill pill-dark" data-action="retry-load">${icon('refresh')} Reintentar conexión</button>
          <button class="pill pill-light" data-action="api-status">Ver diagnóstico</button>
        </div>
      </div>
    `;
    return;
  }

  container.style.animation = 'none';
  void container.offsetWidth;
  container.style.animation = '';
  switch (state.view) {
    case 'dashboard': container.innerHTML = renderDashboard(); break;
    case 'calendar': container.innerHTML = renderCalendarView(); break;
    case 'stories': container.innerHTML = renderStories(); break;
    case 'hooks': container.innerHTML = renderHooks(); break;
    case 'leads': container.innerHTML = renderLeads(); break;
    case 'detail':
    default:
      container.innerHTML = renderDetail();
      break;
  }

  if (options.preserveScroll !== false) {
    scroller.scrollTop = previous;
  } else {
    scroller.scrollTop = 0;
  }

  if (state.view === 'leads') {
    requestAnimationFrame(() => {
      const chat = $('.chat-body');
      if (chat) chat.scrollTop = chat.scrollHeight;
    });
  }
}

function renderAll(options = {}) {
  renderRail();
  renderTopbar();
  renderQueue();
  renderMain(options);
  renderInsights();
}

function refreshGlobals() {
  renderKpis();
  renderInsights();
}

function scheduleMetricsSave(post) {
  const current = metricsSaveTimers.get(post.id);
  if (current) clearTimeout(current);
  const saveState = $('.performance-save-state');
  if (saveState) saveState.innerHTML = `${icon('refresh')} Guardando…`;
  const timer = setTimeout(async () => {
    metricsSaveTimers.delete(post.id);
    const seq = (postMutationSeq.get(post.id) || 0) + 1;
    postMutationSeq.set(post.id, seq);
    const updated = await makeRequest(() => api.patchPost(post.id, { metrics: post.metrics }), { silent: true });
    if (updated && postMutationSeq.get(post.id) === seq) {
      Object.assign(post, updated);
      safeCache();
      if (saveState && document.body.contains(saveState)) {
        saveState.innerHTML = `${icon('check')} Guardado`;
      }
    } else if (!updated && postMutationSeq.get(post.id) === seq && saveState && document.body.contains(saveState)) {
      saveState.innerHTML = `${icon('alert')} Sin conexión`;
    }
  }, 450);
  metricsSaveTimers.set(post.id, timer);
}

/* ----------------------------------------------------------------
   Render · detail
   ---------------------------------------------------------------- */
function renderDetail() {
  const post = selectedPost();
  if (!post) {
    return `
      <div class="state-card">
        <span class="state-icon">${icon('layers')}</span>
        <h2>Tu Content OS está vacío</h2>
        <p>No hay publicaciones todavía. Creá tu primera pieza, cargá su guion y registrá métricas reales cuando la publiques.</p>
        <button class="pill pill-dark" data-action="new-post">${icon('plus')} Crear primera pieza</button>
      </div>
    `;
  }
  return `
    ${renderPostHero(post)}
    ${renderPerformanceLog(post)}
    ${renderTabs(post)}
    <div class="tab-panel">${renderTabContent(post)}</div>
  `;
}

function renderPerformanceLog(post) {
  const metrics = metricsFor(post);
  const fields = [
    { key: 'views', label: 'Vistas Reales', value: metrics.views, icon: 'eye' },
    { key: 'comments', label: 'Comentarios', value: metrics.comments, icon: 'message' },
    { key: 'saves', label: 'Guardados', value: metrics.saves, icon: 'bookmark' },
    { key: 'dms', label: 'DMs / Leads', value: metrics.dms, icon: 'chat' },
  ];
  return `
    <section class="performance-log" aria-label="Registro de rendimiento">
      <div class="performance-log-head">
        <div class="performance-log-copy">
          <span class="micro-label">${icon('poll')} Registro de rendimiento</span>
          <h3>Datos reales de esta pieza</h3>
          <p>Se guardan automáticamente. Solo las piezas en <b>Publicado</b> suman al panel global.</p>
        </div>
        <label class="status-select-wrap" for="post-status-${esc(post.id)}">
          <span>Estado</span>
          <select id="post-status-${esc(post.id)}" data-perf-status data-id="${esc(post.id)}">
            ${STATUSES.map((status) => `<option value="${esc(status)}" ${post.status === status ? 'selected' : ''}>${esc(status)}</option>`).join('')}
          </select>
          ${icon('chevronDown')}
        </label>
      </div>
      <div class="performance-inputs">
        ${fields.map((field) => `
          <label class="performance-field" for="perf-${field.key}-${esc(post.id)}">
            <span>${icon(field.icon)} ${field.label}</span>
            <input id="perf-${field.key}-${esc(post.id)}" type="number" min="0" step="1" inputmode="numeric" value="${field.value}" data-perf-field="${field.key}" data-id="${esc(post.id)}" />
          </label>
        `).join('')}
      </div>
      <div class="performance-log-foot">
        <span class="performance-save-state">${icon('check')} Autoguardado activo</span>
        <span>${post.status === 'Publicado' ? 'Esta pieza está sumando al radar global' : 'Cambiá el estado a Publicado para sumar estos datos'}</span>
      </div>
    </section>
  `;
}

function renderPostHero(post) {
  const performance = performanceFor(post);
  const temp = temperatureFor(post);
  const status = statusMeta(post.status);
  const platform = platformInfo(post);
  const platformFormat = post.format?.toLowerCase().startsWith(platform.label.toLowerCase())
    ? post.format
    : `${platform.label} · ${post.format}`;
  const isPublished = post.status === 'Publicado';
  return `
    <section class="post-hero">
      <div class="hero-grid">
        <div class="kroma-thumb" data-theme="${post.thumbTheme || 1}" aria-label="Miniatura de ${esc(post.hook)}">
          <span class="thumb-orb"></span>
          <span class="thumb-k">K</span>
          <span class="thumb-caption"><span>Kroma Studio</span><b>${post.formatKey === 'story' ? '9:16' : post.formatKey === 'carousel' ? '4:5' : '9:16'}</b></span>
        </div>
        <div class="hero-copy">
          <div class="hero-overline">
            <span class="format-icon">${icon(platform.icon)}</span>
            ${esc(platformFormat)}
            <span style="color:#d0d0d6">/</span>
            <span style="color:#b0b0b8">${status.label}</span>
          </div>
          <h1 class="hero-title">${esc(post.hook)}</h1>
          <p class="hero-deck">${esc(post.deck || '')}</p>
          <div class="hero-meta">
            <span class="hero-meta-item">${icon('calendar')} ${formatFullDate(post.date)}</span>
            <span class="hero-meta-item">${icon('layers')} <b>${esc(post.pillar)}</b></span>
            <span class="hero-meta-item">${icon('target')} ${esc(post.objective)}</span>
            <span class="hero-meta-item">${icon('clock')} ${esc(post.duration)}</span>
          </div>
        </div>
        <div class="hero-aside">
          <div class="hero-pills">
            <span class="state-pill ${performance.cls}">${icon(performance.icon)} ${performance.label}</span>
            <span class="state-pill ${temp.cls}">${icon('thermometer')} ${temp.label}</span>
          </div>
          <div class="hero-actions">
            ${isPublished
              ? `<button class="hero-icon-btn" data-action="share-post" aria-label="Copiar caption">${icon('share')}</button>`
              : `<button class="hero-edit" data-action="mark-published">${icon('check')} Publicar</button>`}
            <button class="hero-icon-btn" data-action="duplicate-post" aria-label="Duplicar contenido">${icon('copy')}</button>
            <button class="hero-icon-btn" data-action="more-post" aria-label="Más opciones">${icon('more')}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTabs(post) {
  const tabs = [
    { key: 'script', label: 'Guion & estructura', icon: 'edit' },
    { key: 'calendar', label: 'Calendario', icon: 'calendar' },
    { key: 'metrics', label: 'Métricas & evolución', icon: 'trendUp' },
    { key: 'comments', label: 'Comentarios clave', icon: 'message', count: (post.comments || []).length },
  ];
  return `
    <div class="tab-bar" role="tablist" aria-label="Secciones del contenido">
      ${tabs.map((tab) => `
        <button class="tab ${state.activeTab === tab.key ? 'is-active' : ''}" role="tab" aria-selected="${state.activeTab === tab.key}" data-action="tab" data-tab="${tab.key}">
          ${icon(tab.icon)} ${tab.label}
          ${tab.count ? `<span class="tab-count">${tab.count}</span>` : ''}
        </button>
      `).join('')}
    </div>
  `;
}

function renderTabContent(post) {
  switch (state.activeTab) {
    case 'calendar': return renderCalendarPanel();
    case 'metrics': return renderMetrics(post);
    case 'comments': return renderComments(post);
    default: return renderScript(post);
  }
}

function renderScript(post) {
  const script = post.script || [];
  const toneMap = {
    yellow: { soft: '#FFF0A8' },
    lavender: { soft: '#f0eaf9' },
    amber: { soft: '#FFF0CD' },
    coral: { soft: '#ffe4e2' },
  };
  const checkDone = (post.checklist || []).filter((item) => item.done).length;
  const checkTotal = (post.checklist || []).length;
  return `
    <div class="section-head">
      <div>
        <h3>Estructura del contenido</h3>
        <p>La arquitectura que sostiene el hook · ${esc(post.duration)}</p>
      </div>
      <span class="state-pill state-average" style="background:#fff;box-shadow:var(--shadow-sm)">4 bloques · ${esc(post.duration)}</span>
    </div>
    <div class="timeline-scroll">
      <div class="timeline">
        ${script.map((beat, index) => `
          <article class="beat-card" style="--tone:${beat.tone === 'yellow' ? 'var(--yellow)' : beat.tone === 'lavender' ? 'var(--lavender)' : beat.tone === 'amber' ? 'var(--amber)' : 'var(--coral)'};--tone-soft:${(toneMap[beat.tone] || toneMap.yellow).soft}">
            <div class="beat-top">
              <span class="beat-label"><span class="beat-index">${String(index + 1).padStart(2, '0')}</span> ${esc(beat.label)}</span>
              <span class="beat-time">${esc(beat.time)}</span>
            </div>
            <h4>${esc(beat.title)}</h4>
            <p>${esc(beat.text)}</p>
            <span class="beat-on-screen">${esc(beat.onScreen)}</span>
          </article>
        `).join('')}
      </div>
    </div>

    <div class="script-layout">
      <section class="script-card">
        <div class="script-card-head">
          <div>
            <h3>Guion palabra por palabra</h3>
            <p>Editá, copiá o llevá esto directo a grabación.</p>
          </div>
          <div class="script-tools">
            <button class="script-tool" data-action="copy-script">${icon('copy')} Copiar</button>
            ${state.editingScript
              ? `<button class="script-tool" data-action="cancel-edit">Cancelar</button>
                 <button class="script-tool is-active" data-action="save-script">${icon('save')} Guardar</button>`
              : `<button class="script-tool" data-action="edit-script">${icon('edit')} Editar</button>`}
          </div>
        </div>
        ${script.map((beat) => `
          <div class="script-row" style="--tone-soft:${(toneMap[beat.tone] || toneMap.yellow).soft};--tone:${beat.tone === 'yellow' ? 'var(--yellow)' : beat.tone === 'lavender' ? 'var(--lavender)' : beat.tone === 'amber' ? 'var(--amber)' : 'var(--coral)'}">
            <div class="script-time">
              <span>${esc(beat.time)}</span>
              <span class="script-step"><i></i>${esc(beat.label)}</span>
            </div>
            <div class="script-body">
              <p class="script-text" data-script-id="${esc(beat.id)}" ${state.editingScript ? 'contenteditable="true" spellcheck="false"' : ''}>${esc(beat.text)}</p>
              <div class="script-direction">${icon('volume')} ${esc(beat.direction)}</div>
              <span class="script-onscreen"><b>En pantalla</b> ${esc(beat.onScreen)}</span>
            </div>
          </div>
        `).join('')}
      </section>

      <div class="side-stack">
        <section class="production-card">
          <h4>Checklist de producción <span>${checkDone}/${checkTotal}</span></h4>
          <div class="check-list">
            ${(post.checklist || []).map((item) => `
              <button class="check-item ${item.done ? 'is-done' : ''}" data-action="toggle-check" data-id="${esc(item.id)}">
                <span class="check-box">${icon('check')}</span>
                <span>${esc(item.text)}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="mini-score">
          <div class="score-top"><span>Score de rendimiento</span><b>${performanceScore(post) === null ? 'Sin datos' : `${performanceScore(post)}/100`}</b></div>
          <div class="score-value">${performanceScore(post) === null ? '—' : performanceScore(post)}<span>/100</span></div>
          <div class="score-bar"><span style="width:${performanceScore(post) || 0}%"></span></div>
          <p>${performanceScore(post) === null ? 'Cargá vistas reales para calcularlo.' : 'Comparado con tus publicaciones con más vistas.'}</p>
        </section>

        <section class="production-card">
          <h4>Notas de producción <span>${(post.notes || []).length}</span></h4>
          <ul class="notes-list">
            ${(post.notes || []).map((note) => `<li>${esc(note)}</li>`).join('')}
          </ul>
        </section>
      </div>
    </div>

    <section class="cta-card">
      <div class="cta-card-copy">
        <span class="cta-eyebrow">${icon('zap')} CTA de conversión</span>
        <h4>${esc(post.cta?.text || 'Cerrá con una acción clara.')}</h4>
        <p>${esc(post.cta?.promise || '')} · ${formatNumber(post.cta?.leads || 0)} leads atribuidos a esta pieza.</p>
      </div>
      <div class="cta-keyword">
        <b>${esc(post.cta?.keyword || 'SISTEMA')}</b>
        <span><b>${String(post.cta?.conversion || 0).replace('.', ',')}%</b> conversión</span>
      </div>
    </section>
  `;
}

/* ----------------------------------------------------------------
   Render · calendar
   ---------------------------------------------------------------- */
function calendarCells() {
  const [year, month] = state.month.split('-').map(Number);
  const first = new Date(year, month - 1, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const previousMonthDays = new Date(year, month - 1, 0).getDate();
  const total = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells = [];
  for (let i = 0; i < total; i += 1) {
    let day;
    let inMonth = true;
    let cellMonth = month;
    let cellYear = year;
    if (i < startOffset) {
      day = previousMonthDays - startOffset + i + 1;
      cellMonth = month - 1;
      inMonth = false;
      if (cellMonth === 0) { cellMonth = 12; cellYear -= 1; }
    } else if (i >= startOffset + daysInMonth) {
      day = i - startOffset - daysInMonth + 1;
      cellMonth = month + 1;
      inMonth = false;
      if (cellMonth === 13) { cellMonth = 1; cellYear += 1; }
    } else {
      day = i - startOffset + 1;
    }
    cells.push({ day, month: cellMonth, year: cellYear, inMonth });
  }
  return cells;
}

function calendarEventsFor(year, month, day) {
  return posts()
    .filter((post) => {
      const d = new Date(post.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month && d.getDate() === day;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderCalendarMarkup({ compact = false } = {}) {
  const today = new Date();
  const cells = calendarCells();
  const [year, month] = state.month.split('-').map(Number);
  return `
    <div class="calendar-scroll">
    <div class="calendar-weekdays">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => `<span>${day}</span>`).join('')}</div>
    <div class="calendar-grid">
      ${cells.map((cell) => {
        const events = calendarEventsFor(cell.year, cell.month, cell.day);
        const isToday = today.getFullYear() === cell.year && today.getMonth() + 1 === cell.month && today.getDate() === cell.day;
        const selectedDate = selectedPost() ? new Date(selectedPost().date) : null;
        const isSelected = selectedDate && selectedDate.getFullYear() === cell.year && selectedDate.getMonth() + 1 === cell.month && selectedDate.getDate() === cell.day;
        const dateString = `${cell.year}-${String(cell.month).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
        return `
          <div class="calendar-day ${cell.inMonth ? '' : 'is-outside'} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}">
            <div class="calendar-day-head">
              <span class="calendar-day-num">${cell.day}</span>
              <button class="calendar-day-add" data-action="new-post" data-date="${dateString}" aria-label="Crear contenido el ${cell.day} de ${MONTHS_LONG[cell.month - 1]}">+</button>
            </div>
            <div class="calendar-events">
              ${events.slice(0, compact ? 1 : 2).map((post) => {
                return `
                  <button class="calendar-event ${post.status === 'Publicado' ? 'is-published' : post.status === 'Programado' ? 'is-scheduled' : post.status === 'Por Grabar' ? 'is-ready' : post.status === 'Guionando' ? 'is-writing' : 'is-idea'} ${post.id === state.selectedPostId ? 'is-selected' : ''}" data-action="select-post" data-id="${esc(post.id)}" title="${esc(post.hook)} · ${esc(post.pillar)}">
                    <span class="cal-event-top"><i></i><b>${formatTime(post.date)}</b></span>
                    <span class="cal-event-title">${esc(post.hook)}</span>
                  </button>
                `;
              }).join('')}
              ${events.length > (compact ? 1 : 2) ? `<span class="calendar-extra">+${events.length - (compact ? 1 : 2)} más</span>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    </div>
    <p class="calendar-swipe-hint">Deslizá para ver el mes completo ${icon('arrowRight')}</p>
  `;
}

function renderCalendarHeader() {
  return `
    <div class="calendar-top">
      <div>
        <span class="micro-label">Calendario editorial</span>
        <div class="calendar-title-row">
          <h2>${monthLabel(state.month)}</h2>
          <div class="calendar-nav">
            <button class="cal-square" data-action="change-month" data-direction="-1" aria-label="Mes anterior">${icon('chevronLeft')}</button>
            <button class="cal-square" data-action="change-month" data-direction="1" aria-label="Mes siguiente">${icon('chevronRight')}</button>
          </div>
        </div>
        <div class="calendar-legend">
          <span><i class="legend-dot" style="--c:var(--yellow)"></i>Publicado</span>
          <span><i class="legend-dot" style="--c:var(--lavender)"></i>Programado</span>
          <span><i class="legend-dot" style="--c:var(--amber)"></i>Por Grabar</span>
          <span><i class="legend-dot" style="--c:#b9b9c1"></i>Idea</span>
        </div>
      </div>
      <div style="display:flex;gap:5px;align-items:center">
        <button class="pill pill-light pill-sm" data-action="calendar-today">Hoy</button>
        <button class="pill pill-dark pill-sm" data-action="new-post">${icon('plus')} Programar</button>
      </div>
    </div>
  `;
}

function renderCalendarView() {
  const windows = bestTimeWindows();
  const maxWindow = Math.max(...windows.map((slot) => slot.views), 1);
  const top = windows[0];
  return `
    <section class="calendar-shell">
      ${renderCalendarHeader()}
      ${renderCalendarMarkup()}
      <div class="calendar-bottom">
        <section class="card card-pad">
          <div class="section-head" style="margin-bottom:4px">
            <div><h3>Mejores ventanas</h3><p>Deduciadas de tus posts publicados</p></div>
            <span class="micro-label">Vistas</span>
          </div>
          <div class="time-windows">
            ${windows.length ? windows.map((slot) => `
              <div class="time-window">
                <span class="time-window-day">${esc(slot.day)}</span>
                <span class="time-window-time">${esc(slot.time)}</span>
                <span class="window-score"><span style="width:${Math.max(3, (slot.views / maxWindow) * 100)}%"></span></span>
                <small>${formatCompact(slot.views)}</small>
              </div>
            `).join('') : `<div class="empty-inline compact"><strong>Sin ventanas todavía</strong><span>Publicá y registrá vistas para descubrir tus mejores horarios.</span></div>`}
          </div>
        </section>
        <section class="calendar-insight">
          <div>
            <span class="micro-label">Kroma insight</span>
            ${top ? `
              <strong>Tu mejor ventana: ${esc(top.day)} ${esc(top.time)}.</strong>
              <p>Allí acumulás ${formatNumber(top.views)} vistas reales en ${top.count} ${top.count === 1 ? 'publicación' : 'publicaciones'}.</p>
            ` : `
              <strong>Sin recomendaciones todavía.</strong>
              <p>El calendario se vuelve inteligente cuando registrás métricas de piezas publicadas.</p>
            `}
          </div>
          <button class="pill pill-dark pill-sm" data-action="new-post" style="align-self:flex-start">${icon('plus')} ${top ? 'Programar pieza' : 'Crear pieza'}</button>
        </section>
      </div>
    </section>
  `;
}

function renderCalendarPanel() {
  return `
    <section class="calendar-shell">
      ${renderCalendarHeader()}
      ${renderCalendarMarkup()}
    </section>
  `;
}

/* ----------------------------------------------------------------
   Render · metrics
   ---------------------------------------------------------------- */
function smoothPath(points) {
  if (!points.length) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const current = points[i];
    const midX = (prev[0] + current[0]) / 2;
    d += ` C ${midX} ${prev[1]}, ${midX} ${current[1]}, ${current[0]} ${current[1]}`;
  }
  return d;
}

function lineChart(values, id = 'chart', color = '#0F0F12', fill = '#FFD600') {
  const width = 600;
  const height = 166;
  const left = 28;
  const right = 10;
  const top = 12;
  const bottom = 30;
  const max = Math.max(...values, 1) * 1.12;
  const stepX = (width - left - right) / Math.max(values.length - 1, 1);
  const points = values.map((value, index) => [
    left + index * stepX,
    top + (height - top - bottom) * (1 - value / max),
  ]);
  const plotBottom = height - bottom;
  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1][0]} ${plotBottom} L ${points[0][0]} ${plotBottom} Z`;
  const grid = [0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = top + (height - top - bottom) * ratio;
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#f0f0f2" stroke-width="1" stroke-dasharray="2 4"/><text x="${left - 6}" y="${y + 2}" text-anchor="end">${formatCompact(max * (1 - ratio))}</text>`;
  }).join('');
  const labels = values.map((_, index) => index).filter((index) => index === 0 || index === values.length - 1 || index % Math.ceil(values.length / 4) === 0).map((index) => `
    <text x="${points[index][0]}" y="${height - 10}" text-anchor="middle">D${index + 1}</text>
  `).join('');
  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolución de vistas">
      <defs>
        <linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="${fill}" stop-opacity=".45"/>
          <stop offset="100%" stop-color="${fill}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${grid}
      <path d="${area}" fill="url(#${id})"/>
      <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="${index === points.length - 1 ? 3.2 : 1.7}" fill="${index === points.length - 1 ? color : '#fff'}" stroke="${color}" stroke-width="1.2"><title>Día ${index + 1}: ${formatCompact(values[index])} vistas</title></circle>`).join('')}
      ${labels}
    </svg>
  `;
}

function sparkline(values, id = 'spark', color = '#0F0F12', fill = '#FFD600') {
  const width = 280;
  const height = 40;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = 4 + (height - 8) * (1 - (value - min) / Math.max(max - min, 1));
    return [x, y];
  });
  const line = smoothPath(points);
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return `
    <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${fill}" stop-opacity=".45"/><stop offset="100%" stop-color="${fill}" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#${id})"/>
      <path d="${line}" fill="none" stroke="${fill}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${points[points.length - 1][0]}" cy="${points[points.length - 1][1]}" r="2.4" fill="${fill}"/>
    </svg>
  `;
}

function renderMetrics(post) {
  const metrics = metricsFor(post);
  const global = globalMetrics();
  const hasMetrics = metrics.views || metrics.comments || metrics.saves || metrics.dms;
  const engagement = engagementRate(post);
  const conv = metrics.views ? (metrics.dms / metrics.views) * 100 : 0;
  const included = post.status === 'Publicado';

  if (!hasMetrics) {
    return `
      <div class="state-card" style="min-height:310px">
        <span class="state-icon">${icon('poll')}</span>
        <h2>Sin métricas registradas</h2>
        <p>Completá las vistas, comentarios, guardados y DMs en el Registro de rendimiento. Esos valores alimentan este panel y el radar global.</p>
        <button class="pill pill-dark" data-action="focus-performance">${icon('edit')} Ir al registro de rendimiento</button>
      </div>
    `;
  }

  const totalShare = (field) => global[field] ? Math.min(100, (metrics[field] / global[field]) * 100) : 0;
  return `
    <div class="metric-kpis">
      ${[
        { label: 'Vistas reales', value: formatCompact(metrics.views), meta: `${totalShare('views').toFixed(1).replace('.', ',')}% del total`, icon: 'eye' },
        { label: 'Comentarios', value: formatNumber(metrics.comments), meta: `${totalShare('comments').toFixed(1).replace('.', ',')}% del total`, icon: 'message' },
        { label: 'Guardados', value: formatNumber(metrics.saves), meta: `${totalShare('saves').toFixed(1).replace('.', ',')}% del total`, icon: 'bookmark' },
        { label: 'DMs / Leads', value: formatNumber(metrics.dms), meta: `${totalShare('dms').toFixed(1).replace('.', ',')}% del total`, icon: 'chat' },
      ].map((item) => `
        <div class="metric-kpi">
          <span class="micro-label">${item.label}</span>
          <strong>${item.value}</strong>
          <div class="metric-kpi-meta"><b>${item.meta}</b></div>
        </div>
      `).join('')}
    </div>

    <div class="media-grid" style="margin-top:8px">
      <section class="card card-pad">
        <div class="section-head" style="margin-bottom:0">
          <div><h3>Engagement del post</h3><p>Comentarios + guardados sobre vistas</p></div>
          <span class="api-row-status">${included ? 'En el global' : 'No publicado'}</span>
        </div>
        <div class="source-donut-wrap">
          <div class="sentiment-ring" style="background:conic-gradient(var(--yellow) 0 ${Math.min(engagement, 100)}%, var(--lavender) ${Math.min(engagement, 100)}% 100%)">
            <div><b>${engagement.toFixed(1).replace('.', ',')}%</b><span>engagement</span></div>
          </div>
          <div class="source-list">
            <span><i style="--c:var(--yellow)"></i>Comentarios <b>${formatNumber(metrics.comments)}</b></span>
            <span><i style="--c:var(--lavender)"></i>Guardados <b>${formatNumber(metrics.saves)}</b></span>
            <span><i style="--c:var(--coral)"></i>Conversión a DM <b>${conv.toFixed(1).replace('.', ',')}%</b></span>
            <span><i style="--c:var(--amber)"></i>Vistas <b>${formatCompact(metrics.views)}</b></span>
          </div>
        </div>
      </section>
      <section class="card card-pad">
        <div class="section-head" style="margin-bottom:0">
          <div><h3>Aporte al panel global</h3><p>Participación de esta pieza en el total</p></div>
        </div>
        <div class="performance-share-list">
          ${[
            { label: 'Vistas', value: metrics.views, total: global.views, color: 'var(--yellow)' },
            { label: 'Comentarios', value: metrics.comments, total: global.comments, color: 'var(--lavender)' },
            { label: 'Guardados', value: metrics.saves, total: global.saves, color: 'var(--amber)' },
            { label: 'DMs', value: metrics.dms, total: global.dms, color: 'var(--coral)' },
          ].map((row) => {
            const pct = row.total ? Math.min(100, (row.value / row.total) * 100) : 0;
            return `
              <div class="performance-share-row">
                <span>${row.label}</span>
                <div class="performance-share-track"><i style="width:${pct}%;background:${row.color}"></i></div>
                <b>${pct.toFixed(1).replace('.', ',')}%</b>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    </div>

    <div class="benchmark-strip">
      <span class="bench-icon">${icon('database')}</span>
      <p>Estos números salen únicamente del <b>Registro de rendimiento</b> de esta pieza. ${included ? 'Como está Publicado, suma al radar global.' : 'Cambiá el estado a Publicado para que sume al radar global.'}</p>
      <span class="bench-badge state-pill ${included ? 'state-top' : 'state-none'}">${included ? 'Sumando' : 'Fuera del global'}</span>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · comments
   ---------------------------------------------------------------- */
function renderComments(post) {
  const comments = post.comments || [];
  const total = comments.length;
  const replies = comments.filter((comment) => comment.reply).length;
  const answeredPct = total ? Math.round((replies / total) * 100) : 0;
  const leads = comments.filter((comment) => /lead|caliente/i.test(comment.tag || '')).length;
  const questions = comments.filter((comment) => /pregunta|consulta/i.test(comment.tag || '')).length;
  return `
    <div class="comments-layout">
      <aside class="comments-summary">
        <div class="sentiment-ring"><div><b>${answeredPct}%</b><span>respondidos</span></div></div>
        <div class="sentiment-list">
          <div><span><i style="--c:var(--yellow)"></i>Respondidos</span><b>${replies}</b></div>
          <div><span><i style="--c:var(--lavender)"></i>Preguntas</span><b>${questions}</b></div>
          <div><span><i style="--c:var(--coral)"></i>Leads</span><b>${leads}</b></div>
          <div style="margin-top:5px;padding-top:7px;border-top:1px solid #f0f0f2"><span>Comentarios</span><b>${total}</b></div>
        </div>
      </aside>
      <section class="comment-list-card">
        ${comments.length ? comments.map((comment) => {
          const tagClass = /caliente|lead/i.test(comment.tag || '') ? 'is-hot' : /idea/i.test(comment.tag || '') ? 'is-idea' : '';
          const liked = state.likedComments.has(comment.id);
          return `
            <div class="comment-row">
              <span class="avatar" style="--avatar:${esc(comment.color || '#C5B4E3')}">${esc(comment.initials || 'KS')}</span>
              <div class="comment-body">
                <div class="comment-head">
                  <b>${esc(comment.name)}</b>
                  <span>${esc(comment.handle || '')}</span>
                  <span>· ${esc(comment.time || '')}</span>
                  ${comment.tag ? `<span class="comment-tag ${tagClass}">${esc(comment.tag)}</span>` : ''}
                </div>
                <p class="comment-text">${esc(comment.text)}</p>
                ${comment.reply ? `<div class="reply-bubble"><b>Kroma</b><p>${esc(comment.reply)}</p></div>` : ''}
                <div class="comment-actions">
                  <button class="comment-action" data-action="reply-comment" data-id="${esc(comment.id)}">${icon('message')} Responder</button>
                  <span class="comment-action" style="cursor:default">${icon('heart')} ${liked ? 'Te gusta' : 'Me gusta'}</span>
                </div>
              </div>
              <button class="comment-like ${liked ? 'is-liked' : ''}" data-action="like-comment" data-id="${esc(comment.id)}" aria-label="Me gusta">
                ${icon('heart')}
                <span>${Number(comment.likes || 0) + (liked ? 1 : 0)}</span>
              </button>
            </div>
          `;
        }).join('') : `<div style="padding:30px 4px;text-align:center;font-size:8px;color:#9b9ba4">Todavía no hay comentarios. Cuando publiques, aparecerán acá.</div>`}
        <form class="comment-compose" data-form="comment">
          <input type="text" name="text" placeholder="Escribí una respuesta o nota interna…" autocomplete="off" required />
          <button class="send-btn" type="submit" aria-label="Enviar comentario">${icon('send')}</button>
        </form>
      </section>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · dashboard
   ---------------------------------------------------------------- */
function renderDashboard() {
  const all = posts();
  const published = publishedPosts();
  const global = globalMetrics();
  const conv = conversionRate();
  const monthly = monthlyPosts();
  const ideas = all.filter((post) => post.status === 'Idea');
  const writing = all.filter((post) => post.status === 'Guionando');
  const ready = all.filter((post) => post.status === 'Por Grabar');
  const scheduled = all.filter((post) => post.status === 'Programado');
  const publishedMonth = monthly.filter((post) => post.status === 'Publicado');
  const today = startOfDay();
  const upcoming = all
    .filter((post) => post.status !== 'Publicado' && new Date(post.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);
  const weekly = weeklyViewSeries();
  const maxWeek = Math.max(...weekly, 1);
  const bestIndex = weekly.some((value) => value > 0) ? weekly.indexOf(Math.max(...weekly)) : -1;
  const recent = [...all].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const pipeline = [
    { label: 'Idea', count: ideas.length, tone: 'var(--lavender)' },
    { label: 'Guionando', count: writing.length, tone: 'var(--yellow)' },
    { label: 'Por Grabar', count: ready.length, tone: 'var(--amber)' },
    { label: 'Programado', count: scheduled.length, tone: 'var(--coral)' },
    { label: 'Publicado', count: published.length, tone: 'var(--yellow-deep)' },
  ];
  const maxPipeline = Math.max(...pipeline.map((row) => row.count), 1);
  const heroTitle = all.length
    ? `${all.length} ${all.length === 1 ? 'pieza en marcha' : 'piezas en marcha'}.<br><em>${global.views ? `${formatCompact(global.views)} vistas reales.` : 'Cargá tu primer registro.'}</em>`
    : 'Tu Content OS está listo.<br><em>Empezá por una pieza.</em>';
  const heroCopy = all.length
    ? `${global.count} ${global.count === 1 ? 'publicada' : 'publicadas'} · ${formatNumber(global.dms)} DMs · ${scheduled.length} programadas. Sin datos de relleno: todo sale de tus posts.`
    : 'Sin métricas inventadas. Creá contenido, marcalo como Publicado y cargá sus números para activar el radar.';

  return `
    <section class="dashboard-hero">
      <div class="dashboard-hero-copy">
        <span class="eyebrow"><span class="live-dot"></span> ${esc(capitalize(new Intl.DateTimeFormat('es-VE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())))}</span>
        <h2>${heroTitle}</h2>
        <p>${heroCopy}</p>
        <div class="dashboard-hero-actions">
          <button class="pill pill-yellow" data-action="new-post">${icon('plus')} Nueva pieza</button>
          <button class="pill pill-ghost" data-action="nav" data-route="calendar">${icon('calendar')} Ver calendario</button>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <span class="big-orb"></span>
        <span class="orbit-dot"></span>
        <span class="orbit-label">Kroma<br>Content OS</span>
      </div>
    </section>

    <div class="dashboard-kpis">
      ${[
        { label: 'Vistas reales', value: formatCompact(global.views), foot: `${global.count} ${global.count === 1 ? 'post publicado' : 'posts publicados'}`, icon: 'eye', accent: 'var(--amber)', soft: 'rgba(255,176,32,.16)' },
        { label: 'DMs / Leads', value: formatNumber(global.dms), foot: `${formatNumber(global.leads)} leads registrados`, icon: 'chat', accent: 'var(--lavender)', soft: 'rgba(197,180,227,.2)' },
        { label: 'Conversión a DM', value: `${conv.toFixed(1).replace('.', ',')}%`, foot: 'DMs sobre vistas reales', icon: 'target', accent: 'var(--coral)', soft: 'rgba(255,107,107,.12)' },
        { label: 'Guardados', value: formatNumber(global.saves), foot: `${formatNumber(global.comments)} comentarios`, icon: 'bookmark', accent: 'var(--yellow)', soft: 'rgba(255,214,0,.3)' },
      ].map((item) => `
        <div class="dash-kpi" style="--accent:${item.accent};--accent-soft:${item.soft}">
          <span class="micro-label">${icon(item.icon)} ${item.label}</span>
          <strong>${item.value}</strong>
          <div class="dash-kpi-foot">${item.foot}</div>
        </div>
      `).join('')}
    </div>

    <div class="dash-grid">
      <section class="dash-pulse">
        <div class="section-head">
          <div><h3>Pulso semanal</h3><p>Vistas reales por día de publicación</p></div>
          <span class="state-pill ${global.views ? 'state-top' : 'state-none'}">${icon(global.views ? 'trendUp' : 'poll')} ${global.views ? 'Con datos' : 'Sin datos'}</span>
        </div>
        <div class="pulse-bars">
          ${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => `
            <div class="pulse-bar ${index === bestIndex ? 'is-best' : ''}">
              <i style="--h:${weekly[index] ? Math.max(6, (weekly[index] / maxWeek) * 100) : 2}%"></i>
              <span>${day}</span>
            </div>
          `).join('')}
        </div>
        <div class="insight-foot" style="margin-top:7px">
          <div class="insight-mini"><span>Mejor día</span><b>${bestIndex >= 0 ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][bestIndex] : 'Sin datos'}</b></div>
          <div class="insight-mini"><span>Piezas</span><b>${all.length} en total</b></div>
          <div class="insight-mini"><span>Publicadas</span><b>${published.filter((post) => metricsFor(post).views > 0).length} con métricas</b></div>
        </div>
      </section>
      <section class="pipeline-card">
        <div class="section-head">
          <div><h3>Pipeline editorial</h3><p>${MONTHS_SHORT[Number(state.month.slice(5)) - 1].toUpperCase()} ${state.month.slice(0, 4)} · ${monthly.length} ${monthly.length === 1 ? 'pieza' : 'piezas'}</p></div>
          <span class="state-pill" style="background:rgba(255,255,255,.08);color:var(--yellow);font-size:6px">${icon('layers')} ${publishedMonth.length} ${publishedMonth.length === 1 ? 'publicada' : 'publicadas'}</span>
        </div>
        <div class="pipeline-list">
          ${pipeline.map((row) => `
            <div class="pipeline-row">
              <span>${row.label}</span>
              <div class="pipeline-track"><i style="width:${row.count ? Math.max(4, (row.count / maxPipeline) * 100) : 0}%;background:${row.tone}"></i></div>
              <b>${row.count}</b>
            </div>
          `).join('')}
        </div>
      </section>
    </div>

    <div class="dashboard-lower">
      <section class="card card-pad">
        <div class="section-head">
          <div><h3>Lo que viene</h3><p>Piezas que todavía no están publicadas</p></div>
          <button class="text-link" data-action="nav" data-route="calendar">Ver todo ${icon('arrowRight')}</button>
        </div>
        <div class="upcoming-list">
          ${upcoming.length ? upcoming.map((post) => {
            const d = new Date(post.date);
            const platform = platformInfo(post);
            return `
              <button class="upcoming-row" data-action="select-post" data-id="${esc(post.id)}" style="border:0;background:transparent;width:100%;text-align:left;cursor:pointer">
                <span class="upcoming-date"><b>${String(d.getDate()).padStart(2, '0')}</b><span>${MONTHS_SHORT[d.getMonth()]}</span></span>
                <span class="upcoming-copy"><b>${esc(post.hook)}</b><span>${platform.label} · ${formatTime(post.date)} · ${esc(post.pillar)}</span></span>
                <span class="status-chip ${statusMeta(post.status).cls}">${statusMeta(post.status).label}</span>
              </button>
            `;
          }).join('') : `<div class="empty-inline"><strong>No hay piezas próximas</strong><span>Creá contenido o cambiá la fecha de una pieza existente.</span><button class="pill pill-dark pill-sm" data-action="new-post">${icon('plus')} Crear pieza</button></div>`}
        </div>
      </section>
      <section class="card card-pad">
        <div class="section-head">
          <div><h3>Últimas piezas</h3><p>Tu actividad editorial, sin datos de relleno</p></div>
          <span class="live-dot"></span>
        </div>
        <div class="activity-list">
          ${recent.length ? recent.map((post) => {
            const metrics = metricsFor(post);
            return `
              <button class="activity-item activity-button" data-action="select-post" data-id="${esc(post.id)}">
                <i class="activity-dot" style="--c:${post.status === 'Publicado' ? 'var(--yellow)' : post.status === 'Programado' ? 'var(--lavender)' : 'var(--coral)'}"></i>
                <p><b>${esc(post.hook)}</b><span>${statusMeta(post.status).label} · ${formatDateShort(post.date)}${post.status === 'Publicado' ? ` · ${formatCompact(metrics.views)} vistas · ${formatNumber(metrics.dms)} DMs` : ''}</span></p>
              </button>
            `;
          }).join('') : `<div class="empty-inline"><strong>Sin actividad todavía</strong><span>Tu primera pieza va a aparecer acá.</span><button class="pill pill-dark pill-sm" data-action="new-post">${icon('plus')} Crear primera pieza</button></div>`}
        </div>
      </section>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · stories
   ---------------------------------------------------------------- */
function renderStories() {
  const post = storyPost();
  if (!post) {
    return `
      <div class="state-card">
        <span class="state-icon">${icon('story')}</span>
        <h2>Sin historias todavía</h2>
        <p>Creá la primera secuencia del día y planificá stickers, encuestas y CTA.</p>
        <button class="pill pill-dark" data-action="new-story">${icon('plus')} Nueva historia</button>
      </div>
    `;
  }
  const frames = post.storyFrames?.length ? post.storyFrames : [
    {
      id: 's1',
      theme: 'yellow',
      label: 'Historia',
      title: post.hook,
      sub: post.deck || '',
      sticker: 'Desliza',
      options: [],
      views: metricsFor(post).views,
      interactions: metricsFor(post).comments,
      completion: 0,
    },
  ];
  const storyPosts = posts()
    .filter((item) => item.formatKey === 'story' && new Date(item.date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return `
    <section class="stories-hero">
      <div>
        <span class="micro-label">Secuencia destacada · ${formatDateShort(post.date)}</span>
        <h2>${esc(post.hook)}</h2>
        <p>${esc(post.deck || '')} · ${frames.length} ${frames.length === 1 ? 'frame' : 'frames'} · audiencia ${temperatureFor(post).label.toLowerCase()}.</p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="pill pill-light" data-action="preview-story" data-id="${esc(post.id)}" data-frame="${esc(frames[0].id)}">${icon('eye')} Previsualizar</button>
        <button class="pill pill-dark" data-action="new-story">${icon('plus')} Nueva historia</button>
      </div>
    </section>

    <div class="storyboard ${frames.length === 1 ? 'is-single' : ''}">
      ${frames.map((frame) => `
        <article class="story-card">
          <button class="story-frame theme-${esc(frame.theme || 'noir')}" data-action="preview-story" data-id="${esc(post.id)}" data-frame="${esc(frame.id)}" aria-label="Previsualizar ${esc(frame.title)}">
            <div class="story-ui"><i></i><i></i><i></i></div>
            <div class="story-top">
              <span class="story-brand"><span><b>K</b></span> kroma.studio</span>
              ${icon('more')}
            </div>
            <div class="story-content">
              <span class="story-label">${esc(frame.label)}</span>
              <h3>${esc(frame.title)}</h3>
              <p>${esc(frame.sub)}</p>
              ${frame.sticker ? `<span class="story-sticker">${icon(frame.sticker === 'Encuesta' ? 'poll' : frame.sticker === 'DM' ? 'message' : 'arrowRight')} ${esc(frame.sticker)}</span>` : ''}
              ${(frame.options || []).length ? `<div class="story-options">${frame.options.map((option) => `<span>${esc(option)}</span>`).join('')}</div>` : ''}
            </div>
            <div class="story-reply">${icon('send')} Responder…</div>
          </button>
          <div class="story-meta">
            <span><b>${formatCompact(frame.views)}</b> vistas</span>
            <div class="story-stat-row">
              <span>${icon('heart')} ${formatCompact(frame.interactions)}</span>
              <span>${icon('check')} ${frame.completion}%</span>
            </div>
          </div>
        </article>
      `).join('')}
    </div>

    <section class="sequence-card">
      <div class="section-head">
        <div><h3>Secuencia de historias</h3><p>Todas las secuencias · rendimiento por pieza</p></div>
        <span class="state-pill ${storyPosts.some((story) => story.status === 'Publicado') ? 'state-top' : 'state-none'}">${icon('layers')} ${storyPosts.filter((story) => story.status === 'Publicado').length} ${storyPosts.filter((story) => story.status === 'Publicado').length === 1 ? 'publicada' : 'publicadas'}</span>
      </div>
      ${storyPosts.map((story, index) => {
        const views = metricsFor(story).views;
        return `
          <button class="sequence-row ${story.id === post.id ? 'is-live' : ''}" data-action="select-post" data-id="${esc(story.id)}" style="background:transparent;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left;cursor:pointer">
            <span class="sequence-num">${String(index + 1).padStart(2, '0')}</span>
            <span class="sequence-copy"><b>${esc(story.hook)}</b><span>${formatDateShort(story.date)} · ${(story.storyFrames || []).length || 1} frames · ${esc(story.pillar)}</span></span>
            <span class="sequence-metric"><b>${formatCompact(views)}</b><span>vistas</span></span>
            <span class="sequence-metric"><b>${formatCompact(metricsFor(story).dms)}</b><span>DMs</span></span>
          </button>
        `;
      }).join('')}
    </section>
  `;
}

/* ----------------------------------------------------------------
   Render · hooks
   ---------------------------------------------------------------- */
function renderHooks() {
  const filter = state.hookFilter;
  let hooks = hooksFromPosts().sort((a, b) => b.views - a.views || a.text.localeCompare(b.text));
  if (filter === 'published') hooks = hooks.filter((hook) => hook.status === 'Publicado');
  if (filter === 'metrics') hooks = hooks.filter((hook) => hook.views > 0);
  if (filter === 'unpublished') hooks = hooks.filter((hook) => hook.status !== 'Publicado');
  const scored = hooksFromPosts().filter((hook) => hook.status === 'Publicado' && hook.views > 0);
  const average = scored.length ? scored.reduce((sum, hook) => sum + hook.score, 0) / scored.length : 0;
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'published', label: 'Publicados' },
    { key: 'metrics', label: 'Con métricas' },
    { key: 'unpublished', label: 'Sin publicar' },
  ];
  return `
    <section class="hooks-hero">
      <div class="hooks-hero-copy">
        <span class="eyebrow"><span class="live-dot"></span> Hook intelligence</span>
        <h2>Ganchos que detienen<br>el scroll.</h2>
        <p>Ranking calculado con las vistas reales de tus publicaciones. Sin datos de ejemplo.</p>
      </div>
      <div class="hooks-score">
        <b>${average.toFixed(1).replace('.', ',')}</b>
        <span>score relativo<br>${hooks.length} hooks en vista</span>
      </div>
    </section>

    <div class="hooks-toolbar">
      ${filters.map((item) => `<button class="hook-filter ${filter === item.key ? 'is-active' : ''}" data-action="hook-filter" data-filter="${item.key}">${item.label}</button>`).join('')}
    </div>

    <section class="hook-table">
      ${hooks.length ? hooks.map((hook, index) => `
        <button class="hook-row" data-action="select-post" data-id="${esc(hook.id)}" style="background:transparent;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left;cursor:pointer">
          <span class="hook-rank">${String(index + 1).padStart(2, '0')}</span>
          <span class="hook-copy"><b>${esc(hook.text)}</b><span>${esc(hook.platform)} · ${esc(hook.pillar)} · ${esc(hook.status)}${hook.cta !== '—' ? ` · CTA ${esc(hook.cta)}` : ''}</span></span>
          <span class="hook-meter"><b>${hook.score}</b><span class="meter"><i style="width:${hook.score}%"></i></span></span>
          <span class="hook-retention">${formatCompact(hook.views)}<span>vistas</span></span>
          <span class="hook-uses">${formatCompact(hook.dms)}<span>DMs</span></span>
          <span class="hook-open">${icon('arrowUpRight')}</span>
        </button>
      `).join('') : `
        <div class="empty-inline" style="margin:7px">
          <strong>No hay hooks todavía</strong>
          <span>Creá una pieza y registrá sus vistas para construir tu ranking real.</span>
          <button class="pill pill-dark pill-sm" data-action="new-post">${icon('plus')} Crear pieza</button>
        </div>
      `}
    </section>

    <div class="patterns">
      <article class="pattern-card">
        <span class="pattern-icon" style="--accent:var(--yellow)">${icon('zap')}</span>
        <h4>Tensión antes de la promesa</h4>
        <p>Abrí con una contradicción o un dolor concreto antes de explicar tu solución.</p>
      </article>
      <article class="pattern-card">
        <span class="pattern-icon" style="--accent:var(--lavender)">${icon('smile')}</span>
        <h4>El caos también acerca</h4>
        <p>Los errores propios suelen generar más conversación que los tips perfectos.</p>
      </article>
      <article class="pattern-card">
        <span class="pattern-icon" style="--accent:var(--coral)">${icon('target')}</span>
        <h4>Una palabra, un DM</h4>
        <p>Cerrá con una sola palabra clave y medí los DMs reales de cada pieza.</p>
      </article>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · leads
   ---------------------------------------------------------------- */
function renderLeads() {
  const all = state.db.prospects || [];
  const selected = selectedProspect();
  let leads = all;
  if (state.leadsFilter === 'unread') leads = all.filter((lead) => lead.unread > 0);
  if (state.leadsFilter === 'hot') leads = all.filter((lead) => ['Caliente', 'Propuesta'].includes(lead.stage));
  if (state.leadsFilter === 'closed') leads = all.filter((lead) => lead.stage === 'Cerrado');
  const piped = all.filter((lead) => lead.stage !== 'Cerrado').reduce((sum, lead) => sum + (lead.value || 0), 0);
  const stageClass = selected?.stage === 'Caliente' ? 'is-hot' : selected?.stage === 'Nuevo' ? '' : 'is-warm';
  return `
    <section class="leads-hero">
      <div class="leads-hero-copy">
        <span class="micro-label">CRM de conversación</span>
        <h2>De comentario a cliente.</h2>
        <p>${all.length} ${all.length === 1 ? 'prospecto' : 'prospectos'} · ${all.filter((lead) => lead.unread > 0).length} sin leer</p>
      </div>
      <div class="leads-hero-stats">
        <div class="leads-stat"><b>${all.length}</b><span>prospectos</span></div>
        <div class="leads-stat is-accent"><b>$${formatCompact(piped)}</b><span>pipeline</span></div>
        <div class="leads-stat"><b>${all.filter((lead) => lead.stage === 'Cerrado').length}</b><span>cerrados</span></div>
        <button class="pill pill-dark pill-sm" data-action="new-prospect">${icon('plus')} Prospecto</button>
      </div>
    </section>

    <div class="leads-board">
      <aside class="leads-list-card">
        <div class="leads-tabs">
          ${[
            { key: 'all', label: 'Todos' },
            { key: 'unread', label: 'Sin leer' },
            { key: 'hot', label: 'Calientes' },
            { key: 'closed', label: 'Cerrados' },
          ].map((tab) => `<button class="leads-tab ${state.leadsFilter === tab.key ? 'is-active' : ''}" data-action="leads-filter" data-filter="${tab.key}">${tab.label}</button>`).join('')}
        </div>
        <div class="leads-list">
          ${leads.length ? leads.map((lead) => {
            const stageColor = lead.stage === 'Caliente' ? 'var(--coral)' : lead.stage === 'Propuesta' ? 'var(--lavender)' : lead.stage === 'Cerrado' ? 'var(--amber)' : 'var(--yellow)';
            return `
              <button class="lead-item ${lead.id === selected?.id ? 'is-selected' : ''}" data-action="select-lead" data-id="${esc(lead.id)}">
                <span class="lead-avatar" style="--avatar:${esc(lead.color)}">${esc(lead.initials)}${lead.unread ? `<span class="lead-unread">${lead.unread}</span>` : ''}</span>
                <span class="lead-copy">
                  <b><i style="--stage-color:${stageColor}"></i>${esc(lead.name)}</b>
                  <span>${esc(lead.last)}</span>
                </span>
                <span class="lead-time">${esc(lead.time)}</span>
              </button>
            `;
          }).join('') : `<div class="empty-inline compact" style="margin:8px 2px"><strong>Sin conversaciones</strong><span>${all.length ? 'No hay prospectos en este filtro.' : 'Agregá tu primer prospecto para empezar a medir conversiones.'}</span>${all.length ? '' : `<button class="pill pill-dark pill-sm" data-action="new-prospect">${icon('plus')} Agregar prospecto</button>`}</div>`}
        </div>
      </aside>

      ${selected ? `
        <section class="chat-card">
          <header class="chat-head">
            <span class="lead-avatar" style="--avatar:${esc(selected.color)}">${esc(selected.initials)}</span>
            <div class="chat-head-copy"><b>${esc(selected.name)}</b><span>${esc(selected.handle)} · ${esc(selected.source)}</span></div>
            <span class="chat-stage ${stageClass}">${esc(selected.stage)} · $${formatNumber(selected.value || 0)}</span>
            ${selected.stage !== 'Cerrado' ? `<button class="pill pill-light pill-sm" data-action="convert-lead" data-id="${esc(selected.id)}">${icon('check')} Convertir</button>` : ''}
          </header>
          <div class="chat-body">
            <span class="chat-day">Hoy</span>
            ${(selected.messages || []).length ? '' : `<div class="chat-empty">${icon('message')}<strong>Sin mensajes todavía</strong><span>Enviá el primer DM para iniciar la conversación.</span></div>`}
            ${(selected.messages || []).map((message) => `
              <div class="chat-bubble ${message.from === 'me' ? 'is-mine' : ''}">
                ${esc(message.text)}
                <small>${esc(message.time || '')}</small>
              </div>
            `).join('')}
          </div>
          <div class="chat-quick">
            ${['Te paso la propuesta hoy', '¿Agendamos una llamada?', 'Te envío el caso completo', '¿Qué te gustaría resolver primero?'].map((reply) => `<button class="quick-reply" data-action="quick-reply" data-text="${esc(reply)}">${esc(reply)}</button>`).join('')}
          </div>
          <form class="chat-compose" data-form="dm">
            <input type="text" name="text" placeholder="Escribí un DM como Kroma…" autocomplete="off" required />
            <button class="send-btn" type="submit" aria-label="Enviar DM">${icon('send')}</button>
          </form>
        </section>
      ` : `
        <section class="state-card" style="min-height:400px">
          <span class="state-icon">${icon('chat')}</span>
          <h2>${all.length ? 'Elegí una conversación' : 'Tu CRM está listo'}</h2>
          <p>${all.length ? 'Respondé, calificá y convertí prospectos desde un solo lugar.' : 'Agregá tu primer prospecto y empezá a registrar el pipeline real de Kroma.'}</p>
          ${all.length ? '' : `<button class="pill pill-dark" data-action="new-prospect">${icon('plus')} Agregar prospecto</button>`}
        </section>
      `}
    </div>
  `;
}

/* ----------------------------------------------------------------
   Render · insights
   ---------------------------------------------------------------- */
function renderInsights() {
  if (!state.db) return;
  const global = globalMetrics();
  const conv = conversionRate();
  const published = publishedPosts();
  const topHooks = hooksFromPosts().filter((hook) => hook.status === 'Publicado' && hook.views > 0).sort((a, b) => b.views - a.views).slice(0, 3);
  const heatmap = heatmapFromPosts();
  const maxHeat = Math.max(...heatmap.values.flat(), 1);
  const weekly = weeklyViewSeries();
  const notifications = notificationsFromState();
  const alert = notifications[0];
  const engagement = global.views ? ((global.comments + global.saves) / global.views) * 100 : 0;
  const dmsBars = published
    .map((post) => metricsFor(post).dms)
    .sort((a, b) => b - a)
    .slice(0, 8);
  const maxDms = Math.max(...dmsBars, 1);

  const alertMarkup = alert.tone === 'coral'
    ? `
      <section class="alert-card">
        <span class="micro-label">${icon('alert')} Necesita tu atención</span>
        <h3>${esc(alert.title)}</h3>
        <p>${esc(alert.text)}</p>
        ${alert.id === 'pending-metrics'
          ? `<button class="pill" data-action="alert-to-metrics">${esc(alert.action)} ${icon('arrowRight')}</button>`
          : alert.id === 'unread-dms'
            ? `<button class="pill" data-action="nav" data-route="leads">${esc(alert.action)} ${icon('arrowRight')}</button>`
            : `<button class="pill" data-action="new-post">${esc(alert.action)} ${icon('arrowRight')}</button>`}
      </section>
    `
    : `
      <section class="insight-card radar-clear">
        <div class="insight-head">
          <div><h3>${esc(alert.title)}</h3><p>${alert.id === 'clean' ? 'Sin alertas pendientes' : 'En tu calendario'}</p></div>
          <span class="insight-badge">${icon(alert.id === 'clean' ? 'check' : 'calendar')} ${alert.id === 'clean' ? 'OK' : 'HOY'}</span>
        </div>
        <p class="radar-clear-copy">${esc(alert.text)}</p>
        ${alert.id === 'scheduled-today'
          ? `<button class="pill pill-dark pill-sm" data-action="select-post" data-id="${esc(alert.targetId)}" style="margin-top:9px">${icon('arrowRight')} Abrir pieza</button>`
          : `<button class="pill pill-dark pill-sm" data-action="new-post" style="margin-top:9px">${icon('plus')} Nueva pieza</button>`}
      </section>
    `;

  $('#insightsView').innerHTML = `
    <section class="insight-card">
      <div class="insight-head">
        <div><h3>Rendimiento del mes</h3><p>Solo posts con estado Publicado</p></div>
        <span class="insight-badge">${global.count} ${global.count === 1 ? 'post' : 'posts'}</span>
      </div>
      <div class="insight-big">${formatCompact(global.views)}<small>vistas reales</small></div>
      <div style="margin-top:7px"><span class="delta">${icon('database')} Suma automática</span> <span style="font-size:6px;color:#a2a2aa;margin-left:3px">sin datos precargados</span></div>
      <div class="insight-chart">${weekly.some((value) => value > 0) ? sparkline(weekly, 'views-spark', '#0F0F12', '#FFD600') : `<div class="sparkline-empty">${icon('poll')} Sin datos publicados</div>`}</div>
      <div class="insight-foot">
        <div class="insight-mini"><span>Comentarios</span><b>${formatNumber(global.comments)}</b></div>
        <div class="insight-mini"><span>Guardados</span><b>${formatNumber(global.saves)}</b></div>
        <div class="insight-mini"><span>Engagement</span><b>${engagement.toFixed(1).replace('.', ',')}%</b></div>
      </div>
    </section>

    <section class="conversion-card">
      <div class="insight-head">
        <div><h3>Conversión a DM</h3><p>DMs reales sobre vistas reales</p></div>
        <span class="insight-badge">${icon('trendUp')} Manual</span>
      </div>
      <div class="insight-big">${conv.toFixed(1).replace('.', ',')}%<small>de conversión</small></div>
      ${dmsBars.length ? `
        <div class="conversion-bars">
          ${dmsBars.map((value, index) => `<i class="${index >= Math.max(dmsBars.length - 3, 0) && value > 0 ? 'is-hot' : ''}" style="--h:${value ? Math.max(8, (value / maxDms) * 100) : 2}%"></i>`).join('')}
        </div>
      ` : `<p class="conversion-empty">Sin DMs registrados todavía.</p>`}
      <div class="conversion-foot">
        <div><span>DMs</span><b>${formatNumber(global.dms)}</b></div>
        <div><span>Leads</span><b>${formatNumber(global.leads)}</b></div>
        <div><span>Posts</span><b>${global.count}</b></div>
      </div>
    </section>

    ${alertMarkup}

    <section class="insight-card">
      <div class="insight-head">
        <div><h3>Top ganchos</h3><p>Ordenados por vistas reales</p></div>
        <button class="text-link" data-action="nav" data-route="hooks">Ver lab ${icon('arrowUpRight')}</button>
      </div>
      <div class="ranking-list">
        ${topHooks.length ? topHooks.map((hook, index) => `
          <button class="ranking-row rank-button" data-action="select-post" data-id="${esc(hook.id)}">
            <span class="rank-num">${String(index + 1).padStart(2, '0')}</span>
            <div class="rank-copy"><b>${esc(hook.text)}</b><div class="rank-meter"><i style="width:${hook.score}%"></i></div></div>
            <span class="rank-score">${formatCompact(hook.views)}</span>
          </button>
        `).join('') : `<div class="empty-inline compact"><strong>Sin ganchos medidos</strong><span>Publicá una pieza y cargá sus vistas para ver el ranking.</span></div>`}
      </div>
    </section>

    <section class="insight-card heatmap-card">
      <div class="insight-head">
        <div><h3>Mejores horarios</h3><p>Vistas por día y franja horaria</p></div>
        <span class="insight-badge">${icon('clock')} GMT-4</span>
      </div>
      <div class="heatmap">
        <span class="heatmap-label"></span>
        ${heatmap.days.map((day) => `<span class="heatmap-day">${day}</span>`).join('')}
        ${heatmap.values.map((row, rowIndex) => `
          <span class="heatmap-label">${heatmap.slots[rowIndex]}</span>
          ${row.map((value) => `<span class="heatmap-cell" data-level="${value ? Math.ceil((value / maxHeat) * 5) : 0}" title="${formatNumber(value)} vistas"></span>`).join('')}
        `).join('')}
      </div>
      <div class="heatmap-legend"><span>Menos</span><i style="background:#FFF9CC"></i><i style="background:#FFF3A3"></i><i style="background:#FFE97A"></i><i style="background:#FFD600"></i><span>Más</span></div>
    </section>

    <p class="insight-note">Datos calculados en vivo · ${state.apiOnline ? 'sincronizado con la API local' : 'leyendo caché local'} · última act. ${formatTime(state.db.meta.updatedAt || new Date().toISOString())}</p>
  `;
}

/* ----------------------------------------------------------------
   Navigation and interactions
   ---------------------------------------------------------------- */
function navigate(route) {
  state.view = route;
  state.activeNav = route;
  state.editingScript = false;
  closeMobileQueue();
  closeInsights();
  if (route === 'dashboard' || route === 'calendar' || route === 'hooks' || route === 'leads') {
    state.channel = 'all';
  }
  if (route === 'reels') {
    state.channel = 'reel';
    state.view = 'detail';
    if (!state.selectedPostId && posts().length) state.selectedPostId = posts()[0].id;
    const current = selectedPost();
    if (!current || current.formatKey !== 'reel') {
      const reel = posts().find((post) => post.formatKey === 'reel');
      if (reel) state.selectedPostId = reel.id;
    }
    state.activeTab = 'script';
  }
  if (route === 'stories') {
    state.channel = 'story';
    const story = storyPost();
    if (story) {
      state.storyPostId = story.id;
      state.selectedPostId = story.id;
    }
    state.view = 'stories';
  }
  state.scrollPreserve = false;
  renderAll({ preserveScroll: false });
}

function selectPost(id, options = {}) {
  const post = posts().find((item) => item.id === id);
  if (!post) return;
  state.selectedPostId = id;
  state.view = 'detail';
  state.activeTab = 'script';
  state.editingScript = false;
  if (options.keepOrigin !== true) {
    state.activeNav = post.formatKey === 'story' ? 'stories' : post.formatKey === 'reel' ? 'reels' : state.activeNav;
  }
  closeMobileQueue();
  renderAll({ preserveScroll: false });
}

function setTab(tab) {
  state.activeTab = tab;
  state.editingScript = false;
  renderAll({ preserveScroll: true });
}

function closeMobileQueue() {
  state.mobileQueue = false;
  $('.queue')?.classList.remove('is-open');
  $('#mobileOverlay')?.classList.remove('is-open');
  document.body.classList.remove('queue-open');
}

function closeInsights() {
  if (!state.insightsOpen) return;
  state.insightsOpen = false;
  $('.insights')?.classList.remove('is-open');
  $('#insightsOverlay')?.classList.remove('is-open');
}

function toggleMobileQueue() {
  state.mobileQueue = !state.mobileQueue;
  $('.queue')?.classList.toggle('is-open', state.mobileQueue);
  $('#mobileOverlay')?.classList.toggle('is-open', state.mobileQueue);
}

function toggleInsights() {
  state.insightsOpen = !state.insightsOpen;
  $('.insights')?.classList.toggle('is-open', state.insightsOpen);
  $('#insightsOverlay')?.classList.toggle('is-open', state.insightsOpen);
}

function openModal(html) {
  const backdrop = $('#modalBackdrop');
  $('#modal').innerHTML = html;
  backdrop.hidden = false;
  state.modalOpen = true;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const focusTarget = $('#modal input, #modal select, #modal textarea, #modal button');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  });
}

function closeModal() {
  $('#modalBackdrop').hidden = true;
  $('#modal').innerHTML = '';
  state.modalOpen = false;
  document.body.style.overflow = '';
}

function modalHead(kicker, title, subtitle) {
  return `
    <div class="modal-head">
      <div>
        <span class="micro-label">${kicker}</span>
        <h2 id="modalTitle">${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
      <button class="modal-close" data-action="close-modal" aria-label="Cerrar">${icon('close')}</button>
    </div>
  `;
}

function openNewPost(prefill = {}) {
  const baseDate = prefill.date || toInputDate(new Date());
  const selected = selectedPost();
  openModal(`
    <form class="form-modal" data-form="new-post">
      ${modalHead('Nueva pieza', 'Crear contenido', 'Definí el gancho y el hueco. El guion se genera automáticamente.')}
      <div class="form-grid">
        <div class="form-field full">
          <label for="new-hook">Gancho / Hook</label>
          <input id="new-hook" name="hook" type="text" required minlength="3" maxlength="140" placeholder="Ej: Tu contenido no vende por esto…" value="${esc(prefill.hook || '')}" />
        </div>
        <div class="form-field full">
          <label for="new-deck">Contexto o nota interna</label>
          <textarea id="new-deck" name="deck" placeholder="Una línea que explique la idea central…">${esc(prefill.deck || '')}</textarea>
        </div>
        <div class="form-field">
          <label for="new-date">Fecha</label>
          <input id="new-date" name="date" type="date" required value="${esc(baseDate)}" />
        </div>
        <div class="form-field">
          <label for="new-time">Hora</label>
          <input id="new-time" name="time" type="time" required value="${esc(prefill.time || '19:30')}" />
        </div>
        <div class="form-field">
          <label for="new-platform">Canal</label>
          <select id="new-platform" name="platform">
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <div class="form-field">
          <label for="new-format">Formato</label>
          <select id="new-format" name="formatKey">
            <option value="reel">Reel 9:16</option>
            <option value="story">Historia interactiva</option>
            <option value="carousel">Carrusel</option>
          </select>
        </div>
        <div class="form-field">
          <label for="new-pillar">Pilar</label>
          <select id="new-pillar" name="pillar">
            ${PILLARS.map((pillar) => `<option>${pillar}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label for="new-objective">Objetivo</label>
          <select id="new-objective" name="objective">
            ${OBJECTIVES.map((objective) => `<option>${objective}</option>`).join('')}
          </select>
        </div>
        <div class="form-field">
          <label for="new-status">Estado</label>
          <select id="new-status" name="status">
            ${STATUSES.map((status) => `<option ${status === 'Idea' ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-actions">
        <span class="form-hint">Se guarda en la API local y aparece en tu calendario.</span>
        <button type="button" class="pill pill-light" data-action="close-modal">Cancelar</button>
        <button type="submit" class="pill pill-dark">${icon('plus')} Crear pieza</button>
      </div>
    </form>
  `);
  if (prefill.hook) {
    setTimeout(() => {
      const format = $('#new-format');
      if (format && prefill.formatKey) format.value = prefill.formatKey;
      const platform = $('#new-platform');
      if (platform && prefill.platform) platform.value = prefill.platform;
    }, 0);
  }
}

function openNewProspect() {
  openModal(`
    <form data-form="new-prospect">
      ${modalHead('CRM', 'Nuevo prospecto', 'Cargá el contacto y su etapa real en el pipeline.')}
      <div class="form-grid">
        <div class="form-field full">
          <label for="prospect-name">Nombre</label>
          <input id="prospect-name" name="name" type="text" required placeholder="Ej: Ana Torres" />
        </div>
        <div class="form-field">
          <label for="prospect-handle">Usuario</label>
          <input id="prospect-handle" name="handle" type="text" placeholder="@ana.torres" />
        </div>
        <div class="form-field">
          <label for="prospect-source">Origen</label>
          <input id="prospect-source" name="source" type="text" placeholder="Reel · SISTEMA" />
        </div>
        <div class="form-field">
          <label for="prospect-value">Valor estimado (USD)</label>
          <input id="prospect-value" name="value" type="number" min="0" step="1" value="0" />
        </div>
        <div class="form-field">
          <label for="prospect-stage">Etapa</label>
          <select id="prospect-stage" name="stage">
            ${['Nuevo', 'Conversando', 'Caliente', 'Propuesta', 'Cerrado'].map((stage) => `<option>${stage}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-actions">
        <span class="form-hint">Se guarda en la API local y se suma al pipeline real.</span>
        <button type="button" class="pill pill-light" data-action="close-modal">Cancelar</button>
        <button type="submit" class="pill pill-dark">${icon('plus')} Agregar prospecto</button>
      </div>
    </form>
  `);
}

function openReplyModal(commentId) {
  const post = selectedPost();
  const comment = post?.comments?.find((item) => item.id === commentId);
  if (!comment) return;
  openModal(`
    <form data-form="reply">
      ${modalHead('Responder comentario', `@${esc(comment.name)}`, esc(comment.text))}
      <div class="form-field">
        <label for="reply-text">Tu respuesta</label>
        <textarea id="reply-text" name="text" required placeholder="Respondé con contexto, sin sonar a plantilla…"></textarea>
      </div>
      <input type="hidden" name="commentId" value="${esc(commentId)}" />
      <div class="form-actions">
        <span class="form-hint">La respuesta queda en la bitácora del post.</span>
        <button type="button" class="pill pill-light" data-action="close-modal">Cancelar</button>
        <button type="submit" class="pill pill-dark">${icon('send')} Enviar respuesta</button>
      </div>
    </form>
  `);
}

function openApiModal() {
  const health = state.apiHealth;
  const integrations = state.db?.integrations || [];
  openModal(`
    ${modalHead('Sistema', 'Estado de la API', 'La app corre con una API local sin claves. Todo se guarda en <code>data/db.json</code>.')}
    <div class="api-hero">
      <span class="api-hero-icon">${icon(state.apiOnline ? 'plug' : 'alert')}</span>
      <div class="api-hero-copy">
        <b>Kroma Content API <span class="api-status-pill ${state.apiOnline ? '' : 'is-offline'}">${state.apiOnline ? 'Operativa' : 'Offline'}</span></b>
        <span>${state.apiOnline ? `v${esc(health?.version || '1.0.0')} · ${esc(health?.storage || 'JSON local')} · ${esc(String(health?.posts || posts().length))} piezas` : 'Revisá que el servidor esté corriendo en el puerto 4173.'}</span>
      </div>
    </div>
    <div class="api-list">
      <div class="api-row">
        <span class="api-row-icon">${icon('database')}</span>
        <div class="api-row-copy"><b>Persistencia</b><span>${esc(health?.storageFile || 'data/db.json')} · escritura atómica</span></div>
        <span class="api-row-status ${state.apiOnline ? '' : 'is-offline'}">${state.apiOnline ? 'OK' : 'ERROR'}</span>
      </div>
      ${integrations.map((integration) => `
        <div class="api-row">
          <span class="api-row-icon">${icon(integration.icon)}</span>
          <div class="api-row-copy"><b>${esc(integration.name)}</b><span>${esc(integration.detail)}</span></div>
          <span class="api-row-status ${integration.status === 'demo' ? 'is-demo' : 'is-off'}">${integration.status === 'demo' ? 'DEMO' : 'OFF'}</span>
        </div>
      `).join('')}
    </div>
    <div class="api-code"><span>GET</span> /api/health ${state.apiOnline ? '→ 200 OK' : '→ sin conexión'}<br><span>GET</span> /api/state<br><span>POST</span> /api/posts · <span>PATCH</span> /api/posts/:id<br><span>POST</span> /api/prospects/:id/messages</div>
    <p class="api-help">Para arreglar la API: ejecutá <code>npm start</code> dentro de <code>crm kroma</code>. Si el puerto está ocupado, usá <code>PORT=4174 npm start</code>. Las redes no están conectadas: el registro es manual y no requiere tokens.</p>
    <div class="form-actions">
      <button class="pill pill-light" data-action="reset-demo">${icon('trash')} Borrar todos los datos</button>
      <button class="pill pill-light" data-action="close-modal">Cerrar</button>
      <button class="pill pill-dark" data-action="test-api">${icon('zap')} Probar conexión</button>
    </div>
  `);
}

function openAccountModal() {
  openModal(`
    ${modalHead('Cuenta', 'Kroma Studio', 'Creative Director · Content OS')}
    <div class="api-hero">
      <span class="rail-avatar" style="width:44px;height:44px"><strong>K</strong></span>
      <div class="api-hero-copy"><b>Kroma</b><span>@kroma.studio · Creative Director</span></div>
    </div>
    <div class="api-list">
      <button class="api-row" data-action="api-status" style="text-align:left;background:#fff;cursor:pointer">
        <span class="api-row-icon">${icon('plug')}</span>
        <div class="api-row-copy"><b>Estado de la API</b><span>Diagnóstico, endpoints y modo manual</span></div>
        <span class="api-row-status ${state.apiOnline ? '' : 'is-offline'}">${state.apiOnline ? 'LIVE' : 'OFF'}</span>
      </button>
      <div class="api-row">
        <span class="api-row-icon">${icon('lock')}</span>
        <div class="api-row-copy"><b>Datos locales</b><span>Sin cookies de terceros. Todo vive en tu servidor.</span></div>
      </div>
    </div>
    <div class="form-actions">
      <button class="pill pill-light" data-action="close-modal">Cerrar</button>
      <button class="pill pill-dark" data-action="api-status">${icon('plug')} Ver API</button>
    </div>
  `);
}

function openNotificationsModal() {
  const notifications = notificationsFromState();
  openModal(`
    ${modalHead('Inbox', 'Notificaciones', 'Alertas calculadas con el estado real de tu contenido y tus DMs.')}
    <div class="api-list">
      ${notifications.map((notification) => {
        let action = 'new-post';
        let targetId = '';
        if (notification.id === 'pending-metrics') action = 'alert-to-metrics';
        else if (notification.id === 'scheduled-today') { action = 'select-post'; targetId = notification.targetId || ''; }
        else if (notification.id === 'unread-dms') action = 'nav';
        return `
          <button class="api-row" data-action="${action}" ${action === 'nav' ? 'data-route="leads"' : ''} ${targetId ? `data-id="${esc(targetId)}"` : ''} style="text-align:left;background:#fff;cursor:pointer;border-color:${notification.tone === 'coral' ? 'var(--coral-soft)' : 'var(--yellow)'}">
            <span class="api-row-icon" style="background:${notification.tone === 'coral' ? 'var(--coral-soft)' : 'var(--yellow)'};color:${notification.tone === 'coral' ? '#b33f37' : '#0f0f12'}">${icon(notification.tone === 'coral' ? 'alert' : notification.id === 'clean' ? 'check' : 'bell')}</span>
            <div class="api-row-copy"><b>${esc(notification.title)}</b><span>${esc(notification.text)}</span></div>
            ${icon('chevronRight')}
          </button>
        `;
      }).join('')}
    </div>
    <div class="form-actions"><button class="pill pill-dark" data-action="close-modal">Entendido</button></div>
  `);
}

function openStoryPreview(postId, frameId) {
  const post = posts().find((item) => item.id === postId);
  if (!post) return;
  const metrics = metricsFor(post);
  const frame = post.storyFrames?.find((item) => item.id === frameId) || post.storyFrames?.[0] || {
    id: 'preview',
    theme: 'noir',
    label: 'Historia',
    title: post.hook,
    sub: post.deck || '',
    sticker: null,
    options: [],
    views: metrics.views,
    interactions: metrics.comments,
    completion: 0,
  };
  openModal(`
    ${modalHead('Vista previa · 9:16', 'Historia interactiva', `${esc(frame.label)} · ${formatCompact(frame.views)} vistas · ${frame.completion}% completadas`)}
    <div style="display:flex;justify-content:center;margin:2px 0 10px">
      <div class="story-frame theme-${esc(frame.theme || 'noir')}" style="width:230px;box-shadow:var(--shadow-md);border-radius:22px">
        <div class="story-ui"><i></i><i></i><i></i></div>
        <div class="story-top"><span class="story-brand"><span><b>K</b></span> kroma.studio</span>${icon('more')}</div>
        <div class="story-content">
          <span class="story-label">${esc(frame.label)}</span>
          <h3>${esc(frame.title)}</h3>
          <p>${esc(frame.sub)}</p>
          ${frame.sticker ? `<span class="story-sticker">${icon('poll')} ${esc(frame.sticker)}</span>` : ''}
          ${(frame.options || []).length ? `<div class="story-options">${frame.options.map((option) => `<span>${esc(option)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="story-reply">${icon('send')} Responder…</div>
      </div>
    </div>
    <div class="api-code"><span>views</span> ${formatNumber(frame.views)} · <span>interactions</span> ${formatNumber(frame.interactions)} · <span>completion</span> ${frame.completion}%</div>
    <div class="form-actions">
      <button class="pill pill-light" data-action="close-modal">Cerrar</button>
      <button class="pill pill-dark" data-action="select-post" data-id="${esc(post.id)}">Abrir post ${icon('arrowRight')}</button>
    </div>
  `);
}


/* ----------------------------------------------------------------
   Mutations
   ---------------------------------------------------------------- */
async function makeRequest(task, options = {}) {
  try {
    const result = await task();
    state.apiOnline = true;
    updateApiUi();
    return result;
  } catch (error) {
    state.apiOnline = false;
    updateApiUi();
    if (!options.silent) toast(error.message || 'No se pudo conectar con la API.', 'error');
    return null;
  }
}

async function updatePost(id, patch, options = {}) {
  const post = posts().find((item) => item.id === id);
  if (!post) return null;
  const previous = structuredClone(post);
  const seq = (postMutationSeq.get(id) || 0) + 1;
  postMutationSeq.set(id, seq);
  Object.assign(post, patch);
  const payload = { ...patch, metrics: patch.metrics ?? post.metrics ?? {} };
  state.db.meta.updatedAt = new Date().toISOString();
  safeCache();
  renderAll({ preserveScroll: options.preserveScroll !== false });
  const updated = await makeRequest(() => api.patchPost(id, payload));
  if (postMutationSeq.get(id) !== seq) return updated;
  if (!updated) {
    Object.assign(post, previous);
    safeCache();
    renderAll({ preserveScroll: true });
    return null;
  }
  Object.assign(post, updated);
  safeCache();
  renderAll({ preserveScroll: true });
  if (options.success) toast(options.success);
  return updated;
}

async function createPostFromForm(form) {
  const fd = new FormData(form);
  const date = fd.get('date');
  const time = fd.get('time');
  const platform = fd.get('platform');
  const formatKey = fd.get('formatKey');
  let format = 'Reel 9:16';
  if (formatKey === 'story') format = 'Historia interactiva';
  if (formatKey === 'carousel') format = 'Carrusel · 7 slides';
  if (formatKey === 'reel' && platform === 'tiktok') format = 'TikTok 9:16';
  if (formatKey === 'reel' && platform === 'instagram') format = 'Reel 9:16';
  const payload = {
    hook: String(fd.get('hook') || '').trim(),
    deck: String(fd.get('deck') || '').trim(),
    date: `${date}T${time}:00-04:00`,
    platform,
    formatKey,
    format,
    pillar: fd.get('pillar'),
    objective: fd.get('objective'),
    status: fd.get('status'),
  };
  if (!payload.hook) return;
  const submit = form.querySelector('button[type="submit"]');
  if (submit) { submit.disabled = true; submit.textContent = 'Creando…'; }
  const post = await makeRequest(() => api.createPost(payload));
  if (!post) {
    if (submit) { submit.disabled = false; submit.innerHTML = `${icon('plus')} Crear pieza`; }
    return;
  }
  state.db.posts.unshift(post);
  state.selectedPostId = post.id;
  state.view = 'detail';
  state.activeNav = post.formatKey === 'story' ? 'stories' : 'reels';
  state.activeTab = 'script';
  state.channel = 'all';
  state.month = monthKey(post.date);
  state.editingScript = false;
  closeModal();
  safeCache();
  renderAll({ preserveScroll: false });
  toast('Pieza creada. Ya está en tu calendario.');
}

/* ----------------------------------------------------------------
   Event handlers
   ---------------------------------------------------------------- */
async function handleAction(action, el) {
  switch (action) {
    case 'nav':
      closeModal();
      navigate(el.dataset.route);
      break;
    case 'select-post':
      selectPost(el.dataset.id);
      closeModal();
      break;
    case 'tab':
      setTab(el.dataset.tab);
      break;
    case 'channel': {
      state.channel = el.dataset.channel;
      renderChannelFilters();
      renderWorklist();
      break;
    }
    case 'period': {
      state.period = el.dataset.period;
      $$('#periodToggle button').forEach((button) => button.classList.toggle('is-active', button.dataset.period === state.period));
      renderChannelFilters();
      renderWorklist();
      break;
    }
    case 'change-month': {
      const [year, month] = state.month.split('-').map(Number);
      const direction = Number(el.dataset.direction);
      const next = new Date(year, month - 1 + direction, 1);
      state.month = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
      renderQueue();
      renderMain({ preserveScroll: false });
      break;
    }
    case 'calendar-today': {
      const now = new Date();
      state.month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      renderQueue();
      renderMain({ preserveScroll: false });
      break;
    }
    case 'new-post':
      openNewPost(el.dataset.date ? { date: el.dataset.date } : {});
      break;
    case 'new-story':
      openNewPost({ date: toInputDate(new Date()), time: '11:00', formatKey: 'story', hook: '' });
      break;
    case 'new-prospect':
      openNewProspect();
      break;
    case 'focus-search':
      state.searchOpen = true;
      if (window.innerWidth <= 900 && !state.mobileQueue) toggleMobileQueue();
      $('#queueSearchWrap').hidden = false;
      $('#queueSearch')?.focus();
      break;
    case 'clear-search':
      state.search = '';
      state.searchOpen = false;
      $('#queueSearch').value = '';
      $('#queueSearchWrap').hidden = true;
      renderWorklist();
      break;
    case 'api-status':
      closeModal();
      openApiModal();
      break;
    case 'test-api': {
      const button = el;
      button.disabled = true;
      button.textContent = 'Probando…';
      const health = await makeRequest(() => api.health(), { silent: true });
      state.apiHealth = health;
      if (health) toast('API local operativa. Todo en orden.');
      else toast('No se pudo alcanzar la API local.', 'error');
      openApiModal();
      break;
    }
    case 'reset-demo': {
      if (!window.confirm('¿Borrar todos los posts y prospectos? Esta acción deja la app en cero.')) return;
      const db = await makeRequest(() => api.reset());
      if (db) {
        state.db = db;
        state.selectedPostId = db.posts[0]?.id || null;
        state.selectedProspectId = db.prospects?.[0]?.id || null;
        state.month = db.meta.currentMonth;
        state.channel = 'all';
        state.view = 'dashboard';
        state.activeNav = 'dashboard';
        state.activeTab = 'script';
        closeModal();
        safeCache();
        renderAll({ preserveScroll: false });
        toast('Datos eliminados. Estado inicial vacío.');
      }
      break;
    }
    case 'notifications':
      openNotificationsModal();
      break;
    case 'account':
      openAccountModal();
      break;
    case 'close-modal':
      closeModal();
      break;
    case 'toggle-queue':
      toggleMobileQueue();
      break;
    case 'toggle-insights':
      toggleInsights();
      break;
    case 'retry-load':
      await loadFromApi();
      break;
    case 'focus-performance': {
      const log = $('.performance-log');
      if (log) log.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => $('[data-perf-field="views"]')?.focus(), 250);
      break;
    }
    case 'edit-script':
      state.editingScript = true;
      state.activeTab = 'script';
      renderMain({ preserveScroll: true });
      break;
    case 'cancel-edit':
      state.editingScript = false;
      renderMain({ preserveScroll: true });
      break;
    case 'save-script': {
      const post = selectedPost();
      if (!post) break;
      const rows = $$('[data-script-id]', $('#mainView'));
      if (!rows.length) break;
      const nextScript = post.script.map((beat) => {
        const el = rows.find((row) => row.dataset.scriptId === beat.id);
        return { ...beat, text: el ? el.innerText.trim() : beat.text };
      });
      state.editingScript = false;
      await updatePost(post.id, { script: nextScript }, { success: 'Guion guardado.' });
      break;
    }
    case 'copy-script': {
      const post = selectedPost();
      if (!post) break;
      const text = (post.script || []).map((beat) => `${beat.label} (${beat.time})\n${beat.text}\nEn pantalla: ${beat.onScreen}\nDirección: ${beat.direction}`).join('\n\n');
      try {
        await navigator.clipboard.writeText(`${post.hook}\n\n${text}`);
        toast('Guion copiado al portapapeles.');
      } catch {
        toast('Tu navegador bloqueó el portapapeles.', 'error');
      }
      break;
    }
    case 'toggle-check': {
      const post = selectedPost();
      if (!post) break;
      const checklist = (post.checklist || []).map((item) => item.id === el.dataset.id ? { ...item, done: !item.done } : item);
      await updatePost(post.id, { checklist }, { preserveScroll: true });
      break;
    }
    case 'duplicate-post': {
      const post = selectedPost();
      if (!post) break;
      closeModal();
      const copy = await makeRequest(() => api.duplicatePost(post.id));
      if (!copy) break;
      state.db.posts.unshift(copy);
      state.selectedPostId = copy.id;
      state.activeTab = 'script';
      state.month = monthKey(copy.date);
      state.channel = 'all';
      safeCache();
      renderAll({ preserveScroll: false });
      toast('Pieza duplicada como idea.');
      break;
    }
    case 'mark-published': {
      const post = selectedPost();
      if (!post) break;
      const pending = metricsSaveTimers.get(post.id);
      if (pending) {
        clearTimeout(pending);
        metricsSaveTimers.delete(post.id);
      }
      await updatePost(post.id, { status: 'Publicado', metrics: post.metrics || {} }, { success: 'Pieza marcada como publicada. Ya suma al panel global.' });
      break;
    }
    case 'share-post': {
      const post = selectedPost();
      if (!post) break;
      closeModal();
      try {
        await navigator.clipboard.writeText(`${post.hook}\n\n${post.caption || ''}`);
        toast('Caption copiado. Listo para publicar.');
      } catch {
        toast('No se pudo copiar el caption.', 'error');
      }
      break;
    }
    case 'more-post': {
      const post = selectedPost();
      openModal(`
        ${modalHead('Acciones', 'Más opciones', esc(post?.hook || ''))}
        <div class="api-list">
          <button class="api-row" data-action="select-tab-metrics" style="text-align:left;background:#fff;cursor:pointer"><span class="api-row-icon">${icon('trendUp')}</span><div class="api-row-copy"><b>Ver métricas completas</b><span>Retención, fuentes y benchmark</span></div>${icon('chevronRight')}</button>
          <button class="api-row" data-action="duplicate-post" style="text-align:left;background:#fff;cursor:pointer"><span class="api-row-icon">${icon('copy')}</span><div class="api-row-copy"><b>Duplicar como idea</b><span>Mantiene guion, notas y checklist</span></div>${icon('chevronRight')}</button>
          <button class="api-row" data-action="share-post" style="text-align:left;background:#fff;cursor:pointer"><span class="api-row-icon">${icon('copy')}</span><div class="api-row-copy"><b>Copiar caption</b><span>Para publicar manualmente</span></div>${icon('chevronRight')}</button>
        </div>
        <div class="form-actions"><button class="pill pill-light" data-action="close-modal">Cerrar</button></div>
      `);
      break;
    }
    case 'select-tab-metrics':
      closeModal();
      state.activeTab = 'metrics';
      renderMain({ preserveScroll: true });
      break;
    case 'reply-comment':
      openReplyModal(el.dataset.id);
      break;
    case 'like-comment': {
      const id = el.dataset.id;
      if (state.likedComments.has(id)) state.likedComments.delete(id);
      else state.likedComments.add(id);
      renderMain({ preserveScroll: true });
      break;
    }
    case 'hook-filter':
      state.hookFilter = el.dataset.filter;
      renderMain({ preserveScroll: true });
      break;
    case 'leads-filter':
      state.leadsFilter = el.dataset.filter;
      renderMain({ preserveScroll: true });
      break;
    case 'select-lead':
      state.selectedProspectId = el.dataset.id;
      renderMain({ preserveScroll: true });
      break;
    case 'quick-reply': {
      const input = $('.chat-compose input');
      if (input) {
        input.value = el.dataset.text;
        input.focus();
      }
      break;
    }
    case 'convert-lead': {
      const lead = selectedProspect();
      if (!lead) break;
      const updated = await makeRequest(() => api.patchProspect(lead.id, { stage: 'Cerrado', temperature: 'Caliente' }));
      if (!updated) break;
      Object.assign(lead, updated);
      safeCache();
      renderAll({ preserveScroll: true });
      toast('Prospecto convertido en cliente. 🎉');
      break;
    }
    case 'preview-story':
      openStoryPreview(el.dataset.id, el.dataset.frame);
      break;
    case 'show-alert':
      openNotificationsModal();
      break;
    case 'alert-to-metrics': {
      closeModal();
      const target = publishedPosts().find((post) => metricsFor(post).views === 0) || publishedPosts()[0] || posts()[0];
      if (target) {
        state.selectedPostId = target.id;
        state.view = 'detail';
        state.activeNav = 'reels';
        state.activeTab = 'metrics';
        renderAll({ preserveScroll: false });
      } else {
        openNewPost();
      }
      break;
    }
    default:
      break;
  }
}

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
    event.preventDefault();
  }
  handleAction(el.dataset.action, el);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (state.modalOpen) closeModal();
    else if (state.insightsOpen) toggleInsights();
    else if (state.mobileQueue) closeMobileQueue();
  }
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[role="button"][data-action]')) {
    event.preventDefault();
    handleAction(event.target.dataset.action, event.target);
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    handleAction('focus-search');
  }
});

document.addEventListener('change', async (event) => {
  if (event.target.matches('[data-perf-status]')) {
    const post = posts().find((item) => item.id === event.target.dataset.id);
    if (!post) return;
    const nextStatus = event.target.value;
    const pending = metricsSaveTimers.get(post.id);
    if (pending) {
      clearTimeout(pending);
      metricsSaveTimers.delete(post.id);
    }
    const patch = { status: nextStatus, metrics: post.metrics || {} };
    const updated = await updatePost(post.id, patch, { preserveScroll: true });
    if (updated) toast(`Estado actualizado a ${nextStatus}.`);
    return;
  }
  if (event.target.id === 'monthSelect') {
    state.month = event.target.value;
    renderKpis();
    renderChannelFilters();
    renderWorklist();
    if (state.view === 'calendar' || state.view === 'detail') renderMain({ preserveScroll: true });
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'queueSearch') {
    state.search = event.target.value;
    renderWorklist();
    return;
  }
  if (event.target.matches('[data-perf-field]')) {
    const post = posts().find((item) => item.id === event.target.dataset.id);
    if (!post) return;
    const field = event.target.dataset.perfField;
    const value = Math.max(0, Math.floor(Number(event.target.value) || 0));
    post.metrics = post.metrics || {};
    post.metrics[field] = value;
    if (field === 'dms') post.metrics.leads = value;
    postMutationSeq.set(post.id, (postMutationSeq.get(post.id) || 0) + 1);
    state.db.meta.updatedAt = new Date().toISOString();
    safeCache();
    refreshGlobals();
    scheduleMetricsSave(post);
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('form');
  if (!form) return;
  event.preventDefault();
  const type = form.dataset.form;

  if (type === 'new-post') {
    await createPostFromForm(form);
    return;
  }

  if (type === 'new-prospect') {
    const fd = new FormData(form);
    const prospect = await makeRequest(() => api.createProspect({
      name: fd.get('name'),
      handle: fd.get('handle'),
      source: fd.get('source'),
      value: Number(fd.get('value')) || 0,
      stage: fd.get('stage'),
    }));
    if (!prospect) return;
    state.db.prospects.unshift(prospect);
    state.selectedProspectId = prospect.id;
    state.view = 'leads';
    state.activeNav = 'leads';
    closeModal();
    safeCache();
    renderAll({ preserveScroll: false });
    toast('Prospecto agregado al CRM.');
    return;
  }

  if (type === 'comment') {
    const post = selectedPost();
    if (!post) return;
    const text = String(new FormData(form).get('text') || '').trim();
    if (!text) return;
    const comment = await makeRequest(() => api.addComment(post.id, {
      name: 'Kroma Studio',
      handle: '@kroma.studio',
      initials: 'KS',
      color: '#FFD600',
      text,
      tag: 'Nota de Kroma',
    }));
    if (!comment) return;
    post.comments = [comment, ...(post.comments || [])];
    form.reset();
    safeCache();
    renderMain({ preserveScroll: true });
    toast('Comentario guardado en la bitácora.');
    return;
  }

  if (type === 'reply') {
    const post = selectedPost();
    if (!post) return;
    const fd = new FormData(form);
    const text = String(fd.get('text') || '').trim();
    if (!text) return;
    const comment = await makeRequest(() => api.addComment(post.id, {
      name: 'Kroma Studio',
      handle: '@kroma.studio',
      initials: 'KS',
      color: '#FFD600',
      text,
      tag: 'Respuesta de Kroma',
    }));
    if (!comment) return;
    post.comments = [comment, ...(post.comments || [])];
    closeModal();
    safeCache();
    state.activeTab = 'comments';
    renderMain({ preserveScroll: true });
    toast('Respuesta publicada en la bitácora.');
    return;
  }

  if (type === 'dm') {
    const prospect = selectedProspect();
    if (!prospect) return;
    const text = String(new FormData(form).get('text') || '').trim();
    if (!text) return;
    const result = await makeRequest(() => api.sendMessage(prospect.id, text));
    if (!result) return;
    Object.assign(prospect, result.prospect);
    form.reset();
    safeCache();
    renderMain({ preserveScroll: true });
    return;
  }
});

/* ----------------------------------------------------------------
   Boot
   ---------------------------------------------------------------- */
async function loadFromApi() {
  state.loading = true;
  state.fatal = null;
  renderMain();
  try {
    const db = await api.state();
    state.db = db;
    state.apiOnline = true;
    state.fatal = null;
    state.loading = false;
    if (state.selectedPostId && !db.posts.some((post) => post.id === state.selectedPostId)) {
      state.selectedPostId = null;
    }
    state.selectedProspectId = db.prospects?.[0]?.id || null;
    state.month = db.meta.currentMonth || monthKey(new Date().toISOString());
    state.apiHealth = await api.health().catch(() => null);
    safeCache();
    renderAll({ preserveScroll: false });
  } catch (error) {
    const cached = cachedState();
    state.apiOnline = false;
    state.loading = false;
    if (cached) {
      state.db = cached;
      state.fatal = null;
      state.month = cached.meta?.currentMonth || state.month;
      state.selectedPostId = cached.posts?.some((post) => post.id === state.selectedPostId) ? state.selectedPostId : cached.posts?.[0]?.id;
      renderAll({ preserveScroll: false });
      toast('API offline. Estás viendo la última copia local.', 'error');
    } else {
      state.fatal = error.message || 'No se pudo cargar la API.';
      renderRail();
      renderTopbar();
      updateApiUi();
      renderMain({ preserveScroll: false });
      renderInsights();
    }
  }
}

async function boot() {
  document.body.style.overflow = 'hidden';
  await loadFromApi();
  document.body.style.overflow = '';
  $('#appShell')?.classList.remove('is-loading');
  setTimeout(() => $('#boot')?.classList.add('is-hidden'), 380);
  setTimeout(() => {
    if ($('#boot')) $('#boot').style.display = 'none';
  }, 1000);
}

boot();
