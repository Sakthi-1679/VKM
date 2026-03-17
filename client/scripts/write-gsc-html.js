import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = process.env.GSC_HTML_FILENAME;
const content = process.env.GSC_HTML_CONTENT;

if (!filename || !content) {
  console.log('GSC HTML verification env vars not set; skipping file creation.');
  process.exit(0);
}

if (!filename.endsWith('.html')) {
  throw new Error('GSC_HTML_FILENAME must end with .html (e.g., google12345abc.html)');
}

if (/[^A-Za-z0-9._-]/.test(filename) || filename.includes('..')) {
  throw new Error('GSC_HTML_FILENAME may only contain letters, numbers, dots, underscores, and hyphens.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');
const targetPath = path.join(publicDir, filename);

await mkdir(publicDir, { recursive: true });
await writeFile(targetPath, content, 'utf8');

console.log(`Google verification file written to ${targetPath}`);
