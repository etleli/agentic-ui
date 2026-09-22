import type { HTMLAttributes } from 'react';

export type CodeEditorLanguage = 'yaml' | 'json' | 'typescript' | 'javascript' | 'python' | 'sql' | 'plaintext';
export type CodeEditorDiagnosticSeverity = 'info' | 'warning' | 'error';

export type CodeEditorDiagnostic = {
  column?: number;
  id: string;
  line: number;
  message: string;
  severity?: CodeEditorDiagnosticSeverity;
};

export type CodeEditorProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  ariaLabel?: string;
  diagnostics?: CodeEditorDiagnostic[];
  disabled?: boolean;
  enableSearch?: boolean;
  formatActionLabel?: string;
  language?: CodeEditorLanguage;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  maxHeight?: string;
  minHeight?: string;
  placeholder?: string;
  readOnly?: boolean;
  showDiagnostics?: boolean;
  showActiveLine?: boolean;
  value?: string;
  onFormat?: (value: string) => string | void;
  onValueChange?: (value: string) => void;
};
