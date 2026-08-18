/**
 * Renders scripts/resume-pdf/resume.html to src/assets/Patterson_Resume.pdf
 * using headless Chrome. Run with: npm run resume-pdf
 *
 * The HTML is the print-only mirror of src/pages/Resume.jsx — keep them in sync.
 */
import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, copyFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const source = path.join(projectRoot, 'scripts', 'resume-pdf', 'resume.html');
const output = path.join(projectRoot, 'src', 'assets', 'Patterson_Resume.pdf');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser'
].filter(Boolean);

function findChrome() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      execFileSync('which', [candidate], { stdio: 'pipe' });
      return candidate;
    } catch {
      // try the next one
    }
  }
  throw new Error(
    'No Chrome/Chromium binary found. Install one or set CHROME_PATH to its location.'
  );
}

if (!existsSync(source)) {
  console.error(`Resume source not found: ${source}`);
  process.exit(1);
}

const chrome = findChrome();
const workDir = mkdtempSync(path.join(tmpdir(), 'resume-pdf-'));
const tempPdf = path.join(workDir, 'resume.pdf');

console.log(`Rendering ${path.relative(projectRoot, source)} with ${chrome}...`);

try {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--user-data-dir=${path.join(workDir, 'profile')}`,
      `--print-to-pdf=${tempPdf}`,
      `file://${source}`
    ],
    { stdio: 'pipe' }
  );

  if (!existsSync(tempPdf)) {
    throw new Error('Chrome exited without producing a PDF.');
  }

  copyFileSync(tempPdf, output);
  console.log(`Wrote ${path.relative(projectRoot, output)}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
