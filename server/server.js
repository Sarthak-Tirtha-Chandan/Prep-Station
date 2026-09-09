import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { configRouter, connectToDatabase } from './routes/config.js';
import { notesRouter } from './routes/notes.js';
import { pyqsRouter } from './routes/pyqs.js';
import { todosRouter } from './routes/todos.js';
import { remindersRouter } from './routes/reminders.js';
import { ecePapersRouter } from './routes/ecePapers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Support up to 50MB for PDF uploads in base64 format
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/config', configRouter);
app.use('/api/notes', notesRouter);
app.use('/api/pyqs', pyqsRouter);
app.use('/api/todos', todosRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/ece-papers', ecePapersRouter);

// Practice proxy to rewrite target="_blank" and keep all practice papers inside iframe
app.get('/api/practice-proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || (!targetUrl.startsWith('https://practicepaper.in') && !targetUrl.startsWith('https://www.practicepaper.in'))) {
    return res.status(400).send('Invalid practice portal URL');
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    let html = await response.text();

    // 1. Remove all target="_blank" and target='_blank' so links never open in a new tab
    html = html.replace(/target\s*=\s*["']_blank["']/gi, 'target="_self"');

    // 2. Rewrite practicepaper.in links to route through proxy so subsequent clicks also stay inside iframe
    html = html.replace(/href=["'](https?:\/\/(?:www\.)?practicepaper\.in\/gate-ec\/[^"']+)["']/gi, (match, url) => {
      return `href="/api/practice-proxy?url=${encodeURIComponent(url)}"`;
    });
    html = html.replace(/href=["'](\/gate-ec\/[^"']+)["']/gi, (match, path) => {
      return `href="/api/practice-proxy?url=${encodeURIComponent('https://practicepaper.in' + path)}"`;
    });

    // 3. Inject base href and safety script to intercept any dynamic click or window.open
    const scriptToInject = `
      <base href="https://practicepaper.in/" target="_self">
      <script>
        (function() {
          function forceSelf(el) {
            if (el && el.removeAttribute) {
              el.removeAttribute('target');
              el.setAttribute('target', '_self');
            }
          }
          document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('a').forEach(forceSelf);
          });
          document.addEventListener('click', function(e) {
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (a) {
              forceSelf(a);
            }
          }, true);
          window.open = function(url) {
            if (url) window.location.href = url;
            return window;
          };
        })();
      </script>
    `;

    if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + scriptToInject);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head[^>]*>/i, '$&' + scriptToInject);
    } else {
      html = scriptToInject + html;
    }

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(html);
  } catch (err) {
    console.error('[Practice Proxy Error]', err);
    res.status(500).send('Failed to load practice portal: ' + err.message);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GATE PrepStation API' });
});

// Serve frontend static build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Auto-connect if MONGODB_URI is provided in environment
if (process.env.MONGODB_URI) {
  connectToDatabase(process.env.MONGODB_URI);
}

app.listen(PORT, () => {
  console.log(`[Server] GATE PrepStation backend running on http://localhost:${PORT}`);
});
