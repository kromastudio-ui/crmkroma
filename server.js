import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSeed } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const STARTED_AT = Date.now();
const SCHEMA_VERSION = 2;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
};

let db;

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    db = buildSeed();
    persist();
    return;
  }
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!db.posts || !db.meta) throw new Error('Estructura inválida');
    if (Number(db.meta.schemaVersion) !== SCHEMA_VERSION) {
      console.log('[kroma] esquema anterior detectado, iniciando estado vacío');
      db = buildSeed();
      persist();
    }
  } catch (error) {
    console.error('[kroma] db.json inválido, regenerando:', error.message);
    db = buildSeed();
    persist();
  }
}

function persist() {
  db.meta.updatedAt = new Date().toISOString();
  const tmp = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tmp, DB_FILE);
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

function ok(res, data, status = 200) {
  json(res, status, { ok: true, data });
}

function fail(res, status, message, details = null) {
  json(res, status, { ok: false, error: message, details });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) {
        reject(new Error('Payload demasiado grande'));
        req.destroy();
        return;
      }
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

function freshPost(payload) {
  const now = new Date();
  const date = payload.date || now.toISOString();
  return {
    id: `p${Date.now().toString(36)}`,
    date,
    publishedAt: date,
    platform: payload.platform || 'instagram',
    formatKey: payload.formatKey || 'reel',
    format: payload.format || 'Reel 9:16',
    status: payload.status || 'Idea',
    pillar: payload.pillar || 'Cirugía visual',
    objective: payload.objective || 'Alcance',
    hook: (payload.hook || 'Nuevo contenido sin título').trim(),
    deck: payload.deck || 'Una idea nueva para el calendario de Kroma.',
    duration: payload.duration || '0:42',
    thumbTheme: Math.floor(Math.random() * 4) + 1,
    ideaScore: 0,
    caption: payload.caption || '',
    metrics: {
      views: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      follows: 0,
      dms: 0,
      leads: 0,
      er: 0,
      retention3s: 0,
      retention50: 0,
      watch: '0:00',
      profileVisits: 0,
    },
    script: [
      {
        id: 'hook',
        label: 'Hook',
        time: '00:00–00:03',
        title: 'Rompé el patrón',
        text: payload.hook || 'Tu contenido no vende porque estás editando el orden equivocado.',
        direction: 'Primer plano, mirada a cámara. Sin intro.',
        onScreen: 'HOOK',
        tone: 'yellow',
        retention: 0,
      },
      {
        id: 'context',
        label: 'Contexto',
        time: '00:03–00:10',
        title: 'Nombrá el dolor',
        text: 'Desarrollá el contexto con una situación concreta de tu cliente.',
        direction: 'B-roll + texto grande.',
        onScreen: 'EL PROBLEMA',
        tone: 'lavender',
        retention: 0,
      },
      {
        id: 'value',
        label: 'Valor',
        time: '00:10–00:31',
        title: 'Entregá el sistema',
        text: 'Explicá tu sistema en 3 pasos accionables.',
        direction: 'Screen recording y numeración.',
        onScreen: '1 · 2 · 3',
        tone: 'amber',
        retention: 0,
      },
      {
        id: 'cta',
        label: 'CTA',
        time: '00:31–00:42',
        title: 'Cerrá con una acción',
        text: 'Invitá a comentar una palabra clave para recibir el recurso.',
        direction: 'Plano medio y freeze frame.',
        onScreen: 'COMENTÁ «SISTEMA»',
        tone: 'coral',
        retention: 0,
      },
    ],
    notes: ['Definir una sola idea central.', 'Subtítulos con alto contraste.'],
    checklist: [
      { id: 'c1', text: 'Escribir guion', done: false },
      { id: 'c2', text: 'Grabar hook', done: false },
      { id: 'c3', text: 'Editar y programar', done: false },
    ],
    cta: {
      keyword: 'SISTEMA',
      text: 'Comentá SISTEMA y te envío el recurso por DM.',
      promise: 'Recurso descargable',
      leads: 0,
      conversion: 0,
    },
    comments: [],
    storyFrames: [],
  };
}

function findPost(id) {
  return db.posts.find((post) => post.id === id);
}

function routeApi(req, res, pathname) {
  const method = req.method;

  if (pathname === '/api/health' && method === 'GET') {
    return ok(res, {
      status: 'ok',
      service: 'kroma-content-os',
      version: '1.1.0',
      uptime: Math.round((Date.now() - STARTED_AT) / 1000),
      storage: 'JSON local',
      storageFile: 'data/db.json',
      posts: db.posts.length,
      aiConfigured: Boolean(process.env.AI_API_KEY || process.env.OPENAI_API_KEY),
      aiProvider: process.env.AI_API_KEY ? 'OpenAI-compatible' : 'Plantillas locales',
      timestamp: new Date().toISOString(),
    });
  }

  if (pathname === '/api/state' && method === 'GET') {
    return ok(res, db);
  }

  if (pathname === '/api/prospects' && method === 'POST') {
    return (async () => {
      const payload = await readBody(req);
      const name = String(payload.name || '').trim();
      if (!name) return fail(res, 422, 'El nombre del prospecto es obligatorio.');
      const prospect = {
        id: `d${Date.now().toString(36)}`,
        name,
        handle: String(payload.handle || '').trim() || `@${name.toLowerCase().replace(/\s+/g, '')}`,
        initials: name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'KS',
        color: payload.color || '#C5B4E3',
        stage: payload.stage || 'Nuevo',
        unread: 0,
        last: String(payload.last || 'Prospecto agregado manualmente.').trim(),
        time: 'ahora',
        value: Number(payload.value) || 0,
        source: String(payload.source || 'Entrada manual').trim(),
        temperature: 'warm',
        email: String(payload.email || '').trim(),
        messages: [],
      };
      db.prospects.unshift(prospect);
      persist();
      return ok(res, prospect, 201);
    })().catch((error) => fail(res, 400, error.message));
  }

  if (pathname === '/api/posts' && method === 'POST') {
    return (async () => {
      const payload = await readBody(req);
      if (!payload.hook || String(payload.hook).trim().length < 3) {
        return fail(res, 422, 'El gancho debe tener al menos 3 caracteres.');
      }
      const post = freshPost(payload);
      db.posts.unshift(post);
      persist();
      return ok(res, post, 201);
    })().catch((error) => fail(res, 400, error.message));
  }

  const postMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (postMatch) {
    const post = findPost(decodeURIComponent(postMatch[1]));
    if (!post) return fail(res, 404, 'Publicación no encontrada.');
    if (method === 'GET') return ok(res, post);
    if (method === 'PATCH') {
      return (async () => {
        const payload = await readBody(req);
        const allowed = [
          'hook',
          'deck',
          'caption',
          'status',
          'performance',
          'temperature',
          'pillar',
          'objective',
          'date',
          'format',
          'formatKey',
          'platform',
          'script',
          'notes',
          'checklist',
          'cta',
          'metrics',
          'ideaScore',
          'duration',
        ];
        for (const key of allowed) {
          if (payload[key] !== undefined) {
            post[key] = payload[key];
          }
        }
        if (payload.status === 'Publicado' && !post.publishedAt) {
          post.publishedAt = new Date().toISOString();
        }
        persist();
        return ok(res, post);
      })().catch((error) => fail(res, 400, error.message));
    }
    if (method === 'DELETE') {
      db.posts = db.posts.filter((item) => item.id !== post.id);
      persist();
      return ok(res, { id: post.id, deleted: true });
    }
  }

  const duplicateMatch = pathname.match(/^\/api\/posts\/([^/]+)\/duplicate$/);
  if (duplicateMatch && method === 'POST') {
    const post = findPost(decodeURIComponent(duplicateMatch[1]));
    if (!post) return fail(res, 404, 'Publicación no encontrada.');
    const copy = structuredClone(post);
    copy.id = `p${Date.now().toString(36)}`;
    copy.hook = `${post.hook} (copia)`;
    copy.status = 'Idea';
    copy.metrics = {
      views: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      follows: 0,
      dms: 0,
      leads: 0,
      er: 0,
      retention3s: 0,
      retention50: 0,
      watch: '0:00',
      profileVisits: 0,
    };
    copy.comments = [];
    copy.checklist = (copy.checklist || []).map((item) => ({ ...item, done: false }));
    const next = new Date(post.date);
    next.setDate(next.getDate() + 3);
    copy.date = next.toISOString();
    db.posts.unshift(copy);
    persist();
    return ok(res, copy, 201);
  }

  const commentMatch = pathname.match(/^\/api\/posts\/([^/]+)\/comments$/);
  if (commentMatch && method === 'POST') {
    const post = findPost(decodeURIComponent(commentMatch[1]));
    if (!post) return fail(res, 404, 'Publicación no encontrada.');
    return (async () => {
      const payload = await readBody(req);
      if (!payload.text || !String(payload.text).trim()) {
        return fail(res, 422, 'El comentario no puede estar vacío.');
      }
      const comment = {
        id: `cm${Date.now().toString(36)}`,
        name: payload.name || 'Kroma Studio',
        handle: payload.handle || '@kroma.studio',
        initials: payload.initials || 'KS',
        color: payload.color || '#FFD600',
        text: String(payload.text).trim(),
        likes: 0,
        time: 'ahora',
        tag: payload.tag || 'Respuesta de Kroma',
        reply: null,
        mine: true,
      };
      post.comments = post.comments || [];
      post.comments.unshift(comment);
      persist();
      return ok(res, comment, 201);
    })().catch((error) => fail(res, 400, error.message));
  }

  const messageMatch = pathname.match(/^\/api\/prospects\/([^/]+)\/messages$/);
  if (messageMatch && method === 'POST') {
    const prospect = db.prospects.find(
      (item) => item.id === decodeURIComponent(messageMatch[1])
    );
    if (!prospect) return fail(res, 404, 'Prospecto no encontrado.');
    return (async () => {
      const payload = await readBody(req);
      if (!payload.text || !String(payload.text).trim()) {
        return fail(res, 422, 'El mensaje no puede estar vacío.');
      }
      const message = {
        id: `m${Date.now().toString(36)}`,
        from: 'me',
        text: String(payload.text).trim(),
        time: new Date().toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      prospect.messages = prospect.messages || [];
      prospect.messages.push(message);
      prospect.last = message.text;
      prospect.time = 'ahora';
      prospect.unread = 0;
      persist();
      return ok(res, { prospect, message }, 201);
    })().catch((error) => fail(res, 400, error.message));
  }

  const prospectMatch = pathname.match(/^\/api\/prospects\/([^/]+)$/);
  if (prospectMatch && method === 'PATCH') {
    const prospect = db.prospects.find(
      (item) => item.id === decodeURIComponent(prospectMatch[1])
    );
    if (!prospect) return fail(res, 404, 'Prospecto no encontrado.');
    return (async () => {
      const payload = await readBody(req);
      if (payload.stage) prospect.stage = payload.stage;
      if (payload.unread !== undefined) prospect.unread = Number(payload.unread);
      if (payload.temperature) prospect.temperature = payload.temperature;
      if (payload.value !== undefined) prospect.value = Number(payload.value);
      persist();
      return ok(res, prospect);
    })().catch((error) => fail(res, 400, error.message));
  }

  if (pathname === '/api/reset' && method === 'POST') {
    db = buildSeed();
    persist();
    return ok(res, db);
  }

  return fail(res, 404, `Ruta de API no encontrada: ${method} ${pathname}`);
}

function serveStatic(req, res, pathname) {
  let safePath;
  try {
    safePath = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }
  if (safePath === '/') safePath = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));
  if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (error, stat) => {
    if (!error && stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control':
          ext === '.html' ? 'no-cache' : 'public, max-age=3600, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    // SPA fallback
    const indexPath = path.join(PUBLIC_DIR, 'index.html');
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(indexPath).pipe(res);
  });
}

ensureDb();

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  const pathname = url.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    try {
      return routeApi(req, res, pathname);
    } catch (error) {
      console.error('[kroma] API error:', error);
      return fail(res, 500, 'Error interno del servidor.');
    }
  }
  return serveStatic(req, res, pathname);
});

server.listen(PORT, HOST, () => {
  console.log(`\n  KROMA CONTENT OS  ·  http://${HOST}:${PORT}\n`);
  console.log(`  API health        ·  http://${HOST}:${PORT}/api/health`);
  console.log(`  Datos             ·  ${DB_FILE}\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `\n  El puerto ${PORT} está ocupado. Prueba: PORT=4174 npm start\n`
    );
    process.exit(1);
  }
  throw error;
});
