declare module 'node:fs/promises' {
  export function readFile(filePath: string, encoding: string): Promise<string>;
  export function mkdir(filePath: string, options?: { recursive?: boolean }): Promise<void>;
  export function writeFile(filePath: string, data: string, encoding?: string): Promise<void>;
}

declare module 'node:path' {
  export function dirname(filePath: string): string;
  export function join(...paths: string[]): string;
}

declare module 'node:url' {
  export function fileURLToPath(url: string): string;
}

interface ImportMeta {
  readonly url: string;
}
