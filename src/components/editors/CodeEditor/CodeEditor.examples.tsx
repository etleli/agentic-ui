import { useEffect, useMemo, useState } from 'react';
import { CodeEditor } from './CodeEditor';
import './CodeEditor.examples.css';
import type { CodeEditorLanguage } from './CodeEditor.types';

export type CodeEditorExampleProps = {
  disabled?: boolean;
  enableSearch?: boolean;
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
};

function countLines(value: string): number {
  return value.length === 0 ? 0 : value.split('\n').length;
}

export function CodeEditorExample({
  disabled = false,
  enableSearch = true,
  language = 'yaml',
  lineNumbers = true,
  lineWrapping = false,
  maxHeight = '520px',
  minHeight = 'fit-content',
  placeholder = 'Write code',
  readOnly = false,
  showDiagnostics = true,
  showActiveLine = true,
  value = 'strategy:\n  name: Demo Momentum\n  mode: simulate\nrisk:\n  max_exposure: 0.42\n  halt_on_disconnect: true',
}: CodeEditorExampleProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const lineCount = useMemo(() => countLines(currentValue), [currentValue]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="code-editor-example">
      <header className="code-editor-example__header">
        <span>
          <strong>Strategy config</strong>
          <small>{language}</small>
        </span>
        <span className="code-editor-example__meta" role="status">
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
      </header>

      <CodeEditor
        ariaLabel="Strategy config editor"
        diagnostics={[
          { id: 'risk-limit', line: 5, message: 'Exposure is above the default review threshold.', severity: 'warning' },
          { id: 'mode-note', line: 3, message: 'Simulation mode can be changed before submit.', severity: 'info' },
        ]}
        disabled={disabled}
        enableSearch={enableSearch}
        language={language}
        lineNumbers={lineNumbers}
        lineWrapping={lineWrapping}
        maxHeight={maxHeight}
        minHeight={minHeight}
        placeholder={placeholder}
        readOnly={readOnly}
        showDiagnostics={showDiagnostics}
        showActiveLine={showActiveLine}
        value={currentValue}
        onFormat={(nextValue) => nextValue.split('\n').map((line) => line.trimEnd()).join('\n')}
        onValueChange={setCurrentValue}
      />
    </div>
  );
}
