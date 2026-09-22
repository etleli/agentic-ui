import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { bracketMatching, foldGutter, HighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { Compartment, EditorSelection, EditorState, type Extension } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers as codeMirrorLineNumbers,
  placeholder as codeMirrorPlaceholder,
} from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { Search, WandSparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from '../../inputs/Button/Button';
import { TextInput } from '../../inputs/TextInput/TextInput';
import './CodeEditor.css';
import type { CodeEditorDiagnostic, CodeEditorLanguage, CodeEditorProps } from './CodeEditor.types';

const codeEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-code-background)',
    color: 'var(--color-code-foreground)',
    fontSize: 'var(--type-body-small-size)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-content': {
    caretColor: 'var(--color-accent)',
    padding: 'var(--space-3) 0 0',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--color-accent)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-code-gutter-background)',
    borderRight: '1px solid var(--color-code-gutter-border)',
    color: 'var(--color-code-gutter-foreground)',
    minHeight: '100%',
  },
  '.cm-foldGutter': {
    minWidth: '30px',
  },
  '.cm-foldGutter .cm-gutterElement': {
    alignItems: 'center',
    borderRadius: 'var(--radius-xs)',
    color: 'var(--color-code-gutter-foreground)',
    display: 'flex',
    fontSize: 'var(--type-label-small-size)',
    justifyContent: 'center',
    minWidth: '30px',
    padding: '0 var(--space-2) 0 var(--space-1)',
  },
  '.cm-foldGutter .cm-gutterElement span': {
    borderRadius: 'var(--radius-xs)',
    display: 'inline-grid',
    height: '18px',
    placeItems: 'center',
    width: '18px',
  },
  '.cm-line': {
    padding: '0 var(--space-3)',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 var(--space-2) 0 var(--space-3)',
    textAlign: 'right',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--color-code-active-line)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--color-code-active-line)',
    color: 'var(--color-code-foreground)',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
    backgroundColor: 'var(--color-code-selection)',
  },
  '.cm-matchingBracket, .cm-nonmatchingBracket': {
    backgroundColor: 'var(--color-code-active-line)',
    outline: '1px solid var(--color-code-selection)',
  },
  '.cm-placeholder': {
    color: 'var(--color-muted)',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-code)',
    lineHeight: '1.55',
  },
  '.code-editor__diagnostic-line-error': {
    backgroundColor: 'color-mix(in srgb, var(--color-trading-negative) 10%, transparent)',
    boxShadow: '3px 0 0 var(--color-trading-negative) inset',
  },
  '.code-editor__diagnostic-line-warning': {
    backgroundColor: 'color-mix(in srgb, var(--color-trading-warning) 10%, transparent)',
    boxShadow: '3px 0 0 var(--color-trading-warning) inset',
  },
  '.code-editor__diagnostic-line-info': {
    backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
    boxShadow: '3px 0 0 var(--color-accent) inset',
  },
  '.code-editor__search-match': {
    backgroundColor: 'color-mix(in srgb, var(--color-accent) 28%, transparent)',
    borderRadius: 'var(--radius-xs)',
  },
});

const codeEditorHighlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier, tags.operatorKeyword], color: 'var(--color-code-keyword)' },
  { tag: [tags.atom, tags.bool, tags.null], color: 'var(--color-code-constant)' },
  { tag: [tags.number, tags.integer, tags.float], color: 'var(--color-code-number)' },
  { tag: [tags.string, tags.regexp, tags.special(tags.string)], color: 'var(--color-code-string)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--color-code-comment)', fontStyle: 'italic' },
  { tag: [tags.variableName, tags.self, tags.propertyName], color: 'var(--color-code-variable)' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--color-code-function)' },
  { tag: [tags.className, tags.typeName, tags.namespace], color: 'var(--color-code-type)' },
  { tag: [tags.definition(tags.variableName), tags.definition(tags.propertyName)], color: 'var(--color-code-definition)' },
  { tag: [tags.heading, tags.strong], color: 'var(--color-code-heading)', fontWeight: '700' },
  { tag: [tags.link, tags.url], color: 'var(--color-code-link)', textDecoration: 'underline' },
  { tag: tags.invalid, color: 'var(--color-trading-negative)' },
]);

function getLanguageExtension(language: CodeEditorLanguage): Extension {
  switch (language) {
    case 'yaml':
      return yaml();
    case 'json':
      return json();
    case 'typescript':
      return javascript({ jsx: true, typescript: true });
    case 'javascript':
      return javascript({ jsx: true });
    case 'python':
      return python();
    case 'sql':
      return sql();
    case 'plaintext':
    default:
      return [];
  }
}

function getCodeEditorClassName(className: CodeEditorProps['className']) {
  return ['code-editor', className].filter(Boolean).join(' ');
}

function escapeSearchExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getDiagnosticDecorations(diagnostics: CodeEditorDiagnostic[]): Extension {
  return EditorView.decorations.compute([], (state): DecorationSet => {
    const decorations = diagnostics
      .filter((diagnostic) => diagnostic.line > 0 && diagnostic.line <= state.doc.lines)
      .map((diagnostic) => Decoration.line({ class: `code-editor__diagnostic-line-${diagnostic.severity ?? 'info'}` }).range(state.doc.line(diagnostic.line).from));

    return Decoration.set(decorations, true);
  });
}

function getSearchDecorations(query: string): Extension {
  return EditorView.decorations.compute([], (state): DecorationSet => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return Decoration.none;
    }

    const matches = Array.from(state.doc.toString().matchAll(new RegExp(escapeSearchExpression(normalizedQuery), 'gi'))).slice(0, 500);
    const decoration = Decoration.mark({ class: 'code-editor__search-match' });

    return Decoration.set(matches.map((match) => decoration.range(match.index ?? 0, (match.index ?? 0) + match[0].length)), true);
  });
}

function getDiagnosticSummary(diagnostics: CodeEditorDiagnostic[]) {
  const errors = diagnostics.filter((diagnostic) => diagnostic.severity === 'error').length;
  const warnings = diagnostics.filter((diagnostic) => diagnostic.severity === 'warning').length;

  if (errors > 0) {
    return `${errors} error${errors === 1 ? '' : 's'}`;
  }

  if (warnings > 0) {
    return `${warnings} warning${warnings === 1 ? '' : 's'}`;
  }

  return diagnostics.length > 0 ? `${diagnostics.length} note${diagnostics.length === 1 ? '' : 's'}` : 'No diagnostics';
}

export function CodeEditor({
  ariaLabel = 'Code editor',
  className,
  diagnostics = [],
  disabled = false,
  enableSearch = false,
  formatActionLabel = 'Format',
  language = 'plaintext',
  lineNumbers = true,
  lineWrapping = false,
  maxHeight = '520px',
  minHeight = 'fit-content',
  placeholder = 'Write code',
  readOnly = false,
  showActiveLine = true,
  showDiagnostics = false,
  style,
  value = '',
  onFormat,
  onValueChange,
  ...editorProps
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorMountRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const initialValueRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);
  const isApplyingExternalValueRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const compartmentsRef = useRef({
    activeLine: new Compartment(),
    diagnostics: new Compartment(),
    language: new Compartment(),
    lineNumbers: new Compartment(),
    lineWrapping: new Compartment(),
    placeholder: new Compartment(),
    readOnly: new Compartment(),
    search: new Compartment(),
  });
  const editorStyle = {
    '--code-editor-max-height': maxHeight,
    '--code-editor-min-height': minHeight,
    ...style,
  } as CSSProperties;
  const diagnosticSummary = useMemo(() => getDiagnosticSummary(diagnostics), [diagnostics]);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    if (!editorMountRef.current) {
      return undefined;
    }

    const compartments = compartmentsRef.current;
    const state = EditorState.create({
      doc: initialValueRef.current,
      extensions: [
        codeEditorTheme,
        syntaxHighlighting(codeEditorHighlightStyle),
        history(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        EditorState.tabSize.of(2),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged || isApplyingExternalValueRef.current) {
            return;
          }

          onValueChangeRef.current?.(update.state.doc.toString());
        }),
        compartments.activeLine.of([]),
        compartments.diagnostics.of([]),
        compartments.language.of([]),
        compartments.lineNumbers.of([]),
        foldGutter(),
        compartments.lineWrapping.of([]),
        compartments.placeholder.of([]),
        compartments.readOnly.of([EditorState.readOnly.of(false), EditorView.editable.of(true)]),
        compartments.search.of([]),
      ],
    });

    const view = new EditorView({
      parent: editorMountRef.current,
      state,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;

    if (!view) {
      return;
    }

    const compartments = compartmentsRef.current;
    const isReadOnly = readOnly || disabled;

    view.dispatch({
      effects: [
        compartments.activeLine.reconfigure(showActiveLine ? [highlightActiveLine(), highlightActiveLineGutter()] : []),
        compartments.diagnostics.reconfigure(showDiagnostics ? getDiagnosticDecorations(diagnostics) : []),
        compartments.language.reconfigure(getLanguageExtension(language)),
        compartments.lineNumbers.reconfigure(lineNumbers ? codeMirrorLineNumbers() : []),
        compartments.lineWrapping.reconfigure(lineWrapping ? EditorView.lineWrapping : []),
        compartments.placeholder.reconfigure(placeholder ? codeMirrorPlaceholder(placeholder) : []),
        compartments.readOnly.reconfigure([EditorState.readOnly.of(isReadOnly), EditorView.editable.of(!isReadOnly)]),
        compartments.search.reconfigure(enableSearch ? getSearchDecorations(searchQuery) : []),
      ],
    });
  }, [diagnostics, disabled, enableSearch, language, lineNumbers, lineWrapping, placeholder, readOnly, searchQuery, showActiveLine, showDiagnostics]);

  useEffect(() => {
    const view = viewRef.current;

    if (!view || view.state.doc.toString() === value) {
      return;
    }

    isApplyingExternalValueRef.current = true;
    view.dispatch({
      changes: {
        from: 0,
        insert: value,
        to: view.state.doc.length,
      },
    });
    isApplyingExternalValueRef.current = false;
  }, [value]);

  function jumpToLine(line: number, column = 1) {
    const view = viewRef.current;

    if (!view || line < 1 || line > view.state.doc.lines) {
      return;
    }

    const lineInfo = view.state.doc.line(line);
    const position = Math.min(lineInfo.to, lineInfo.from + Math.max(0, column - 1));
    view.dispatch({
      effects: EditorView.scrollIntoView(position, { y: 'center' }),
      selection: EditorSelection.cursor(position),
    });
    view.focus();
  }

  function findFirstSearchMatch(query: string) {
    const view = viewRef.current;
    const normalizedQuery = query.trim();

    if (!view || !normalizedQuery) {
      return;
    }

    const matchIndex = view.state.doc.toString().toLocaleLowerCase().indexOf(normalizedQuery.toLocaleLowerCase());
    if (matchIndex >= 0) {
      view.dispatch({
        effects: EditorView.scrollIntoView(matchIndex, { y: 'center' }),
        selection: EditorSelection.range(matchIndex, matchIndex + normalizedQuery.length),
      });
      view.focus();
    }
  }

  function runFormatAction() {
    const view = viewRef.current;

    if (!view || !onFormat) {
      return;
    }

    const currentValue = view.state.doc.toString();
    const nextValue = onFormat(currentValue);

    if (typeof nextValue === 'string' && nextValue !== currentValue) {
      view.dispatch({ changes: { from: 0, insert: nextValue, to: view.state.doc.length } });
      onValueChangeRef.current?.(nextValue);
    }
  }

  return (
    <div
      {...editorProps}
      aria-label={ariaLabel}
      className={getCodeEditorClassName(className)}
      data-disabled={disabled ? 'true' : undefined}
      data-language={language}
      data-readonly={readOnly ? 'true' : undefined}
      ref={containerRef}
      role="application"
      style={editorStyle}
    >
      {enableSearch || onFormat ? (
        <div className="code-editor__toolbar">
          {enableSearch ? (
            <TextInput
              ariaLabel="Search code"
              placeholder="Search"
              value={searchQuery}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  findFirstSearchMatch(searchQuery);
                }
              }}
              onValueChange={setSearchQuery}
            />
          ) : null}
          {enableSearch ? (
            <Button icon={<Search size={15} aria-hidden="true" />} size="compact" variant="secondary" onClick={() => findFirstSearchMatch(searchQuery)}>
              Find
            </Button>
          ) : null}
          {onFormat ? (
            <Button icon={<WandSparkles size={15} aria-hidden="true" />} size="compact" variant="secondary" onClick={runFormatAction}>
              {formatActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
      <div className="code-editor__mount" ref={editorMountRef} />
      {showDiagnostics ? (
        <div className="code-editor__diagnostics" aria-label="Diagnostics">
          <strong className="code-editor__diagnostics-summary">{diagnosticSummary}</strong>
          {diagnostics.map((diagnostic) => (
            <button
              className="code-editor__diagnostic"
              data-severity={diagnostic.severity ?? 'info'}
              key={diagnostic.id}
              type="button"
              onClick={() => jumpToLine(diagnostic.line, diagnostic.column)}
            >
              <span className="code-editor__diagnostic-location">
                {diagnostic.line}:{diagnostic.column ?? 1}
              </span>
              <span>{diagnostic.message}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type { CodeEditorDiagnostic, CodeEditorDiagnosticSeverity, CodeEditorLanguage, CodeEditorProps } from './CodeEditor.types';
