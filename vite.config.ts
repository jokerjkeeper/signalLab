import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// 正式資料檔（git 追蹤）：dev 伺服器會把前端的變更寫進這裡
const DATA_FILE = fileURLToPath(new URL('./data/projects.json', import.meta.url));

/**
 * 開發伺服器專用的檔案儲存層。
 * 提供 GET/POST /api/projects：
 *   - GET  讀回 data/projects.json
 *   - POST 把 body（Project[]）寫回 data/projects.json（內容相同則略過，避免 git 雜訊）
 * 僅在 `npm run dev` 生效；靜態 build 不含後端，前端會自動退回 localStorage。
 */
function fileStorePlugin(): Plugin {
  return {
    name: 'signal-lab-file-store',
    configureServer(server) {
      server.middlewares.use('/api/projects', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const buf = await readFile(DATA_FILE, 'utf8');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(buf);
            return;
          }

          if (req.method === 'POST') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const body = Buffer.concat(chunks).toString('utf8');

            const parsed = JSON.parse(body);
            if (!Array.isArray(parsed)) throw new Error('payload 必須是陣列');

            const next = JSON.stringify(parsed, null, 2) + '\n';
            let current = '';
            try {
              current = await readFile(DATA_FILE, 'utf8');
            } catch {
              // 檔案還不存在，視為要新建
            }
            if (current !== next) await writeFile(DATA_FILE, next, 'utf8');

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ ok: true, count: parsed.length }));
            return;
          }

          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'method not allowed' }));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: String(err) }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fileStorePlugin()],
  server: {
    // 綁所有介面，讓 localhost / 127.0.0.1 / 區網 IP 都連得到（避免 IPv6 ::1 與 IPv4 不一致）
    host: true,
    port: 5179,
    strictPort: true, // 端口被占用時直接報錯，不自動跳號
    // 寫回 data/projects.json 時不要觸發 HMR 全頁重載（前端記憶體狀態已是最新）
    watch: { ignored: ['**/data/projects.json'] },
  },
  preview: {
    host: true,
    port: 5179,
    strictPort: true,
  },
});
