import { createInterface } from 'readline';

const rl = createInterface({ input: process.stdin });
const lines = [];

rl.on('line', (line) => {
  lines.push(line.trim());
});

rl.on('close', () => {
  const standards = [];
  const seen = new Set();

  for (const line of lines) {
    // Format: oss://yrhsl/标准库/path/file.pdf|||https://signed-url
    const parts = line.split('|||');
    const ossPath = parts[0];
    const signedUrl = parts[1] || '';

    if (!ossPath || !ossPath.startsWith('oss://')) continue;

    // Extract file path after bucket prefix
    const path = ossPath.replace(/^oss:\/\/[^/]+\/标准库\//, '');
    if (!path) continue;

    // Get filename from path
    const fileName = path.split('/').pop();
    if (!fileName) continue;

    // Skip non-standard files
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'doc', 'docx'].includes(ext)) continue;
    if (fileName === 'desktop.ini') continue;

    // Try to parse standard ID and name
    let id = '';
    let name = '';

    // Try to extract name from 《》
    const nameMatch = fileName.match(/《(.+?)》/);
    if (nameMatch) {
      name = nameMatch[1];
    }

    // Try to extract standard ID (everything before 《 or before the extension)
    const idMatch = fileName.match(/^(.+?)(?:\s*《|\.(?:pdf|doc|docx)$)/i);
    if (idMatch) {
      id = idMatch[1].trim();
    }

    // If no 《》 found, use filename without extension as name
    if (!name) {
      name = fileName.replace(/\.(?:pdf|doc|docx)$/i, '').trim();
    }

    // If no ID parsed, use the name
    if (!id) {
      id = name;
    }

    // Clean up ID - remove trailing dots, spaces
    id = id.replace(/[\s.]+$/, '');

    // Deduplicate by fileName
    if (seen.has(fileName)) continue;
    seen.add(fileName);

    // All files are viewable as PDF (DOC files have been converted)
    standards.push({ id, name, fileName, type: 'pdf', url: signedUrl });
  }

  // Sort by id
  standards.sort((a, b) => a.id.localeCompare(b, 'zh'));

  process.stdout.write(JSON.stringify(standards, null, 2));
});
