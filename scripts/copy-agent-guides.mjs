import { copyFile, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const componentRoot = resolve(workspaceRoot, 'src', 'components');
const outputRoot = resolve(workspaceRoot, 'dist-library', 'agent-guides');
const rulebookPath = resolve(workspaceRoot, 'docs', 'ui-generation-rulebook.md');
const rulebookOutputPath = 'UI-GENERATION-RULEBOOK.md';

async function findAgentGuideFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const guideFiles = [];

  for (const entry of entries) {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      guideFiles.push(...await findAgentGuideFiles(entryPath));
    } else if (entry.isFile() && basename(entryPath) === 'AGENT.md') {
      guideFiles.push(entryPath);
    }
  }

  return guideFiles;
}

function readComponentId(source, guidePath) {
  const frontMatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const componentId = frontMatterMatch?.[1].match(/^componentId:\s*(.+?)\s*$/m)?.[1]?.trim();

  if (!componentId) {
    throw new Error(`AGENT.md requires a componentId front-matter value: ${relative(workspaceRoot, guidePath)}`);
  }

  return componentId;
}

const guideFiles = await findAgentGuideFiles(componentRoot);
const guides = [];

await rm(outputRoot, { force: true, recursive: true });

for (const guidePath of guideFiles) {
  const source = await readFile(guidePath, 'utf8');
  const componentId = readComponentId(source, guidePath);
  const relativePath = relative(componentRoot, guidePath).split(sep).join('/');
  const outputPath = resolve(outputRoot, relativePath);

  await mkdir(dirname(outputPath), { recursive: true });
  await copyFile(guidePath, outputPath);
  guides.push({ componentId, path: relativePath });
}

guides.sort((firstGuide, secondGuide) => firstGuide.componentId.localeCompare(secondGuide.componentId));
await mkdir(outputRoot, { recursive: true });
await copyFile(rulebookPath, resolve(outputRoot, rulebookOutputPath));
await writeFile(
  resolve(outputRoot, 'index.json'),
  `${JSON.stringify({ contract: 'agentic-ui-agent-guides/v1', globalRulebook: rulebookOutputPath, guides }, null, 2)}\n`,
);
