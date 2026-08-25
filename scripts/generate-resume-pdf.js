/**
 * Renders a resume HTML source to PDF using headless Chrome.
 *
 *   npm run resume-pdf             -> resume.html, published on the site
 *   npm run resume-pdf -- <name>   -> resume-<name>.html, kept local
 *
 * resume.html is the print-only mirror of src/pages/Resume.jsx — keep them in
 * sync. Variants are standalone, intentionally diverge, and are gitignored
 * along with every PDF this writes into scripts/resume-pdf/.
 */
import { execFileSync } from 'child_process';
import { existsSync, mkdtempSync, copyFileSync, rmSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'scripts', 'resume-pdf');

const requested = process.argv[2];

const source = requested
  ? path.join(sourceDir, `resume-${requested}.html`)
  : path.join(sourceDir, 'resume.html');

const output = requested
  ? path.join(sourceDir, `Patterson_Resume_${titleCase(requested)}.pdf`)
  : path.join(projectRoot, 'src', 'assets', 'Patterson_Resume.pdf');

function titleCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function listVariants() {
  return readdirSync(sourceDir)
    .map(file => file.match(/^resume-(.+)\.html$/))
    .filter(Boolean)
    .map(match => match[1]);
}

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
  console.error(`Resume source not found: ${path.relative(projectRoot, source)}`);
  const available = listVariants();
  if (available.length > 0) {
    console.error(`Available variants: ${available.join(', ')}`);
  }
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
