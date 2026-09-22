import { Check, Copy } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import './TextOutput.css';
import type { TextOutputProps, TextOutputVariant } from './TextOutput.types';

function getTextOutputClassName(className: TextOutputProps['className']) {
  return ['text-output', className].filter(Boolean).join(' ');
}

async function copyText(value: string): Promise<boolean> {
  if (!navigator.clipboard) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

export function TextOutput({
  ariaLabel,
  className,
  description,
  emptyText = 'No output',
  label,
  maxHeight,
  showCopyAction = true,
  value = '',
  variant = 'panel',
  wrap = true,
  ...outputProps
}: TextOutputProps) {
  const [copied, setCopied] = useState(false);
  const displayValue = value.length > 0 ? value : emptyText;
  const outputStyle = maxHeight ? ({ '--text-output-max-height': maxHeight } as CSSProperties) : undefined;

  async function handleCopy() {
    const didCopy = await copyText(value);

    if (!didCopy) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <section {...outputProps} className={getTextOutputClassName(className)} data-variant={variant}>
      {label || description || showCopyAction ? (
        <header className="text-output__header">
          <span className="text-output__copy">
            {label ? <strong className="text-output__label">{label}</strong> : null}
            {description ? <span className="text-output__description">{description}</span> : null}
          </span>
          {showCopyAction ? (
            <Tooltip content={copied ? 'Copied to clipboard' : 'Copy output'} placement="left" size="compact">
              <button className="text-output__copy-button" disabled={!value} type="button" onClick={() => void handleCopy()}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </Tooltip>
          ) : null}
        </header>
      ) : null}

      <div
        aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Text output')}
        aria-readonly="true"
        className="text-output__body"
        data-empty={value.length === 0 ? 'true' : undefined}
        data-wrap={wrap ? 'true' : undefined}
        role="textbox"
        style={outputStyle}
      >
        {displayValue}
      </div>
    </section>
  );
}

export type { TextOutputProps, TextOutputVariant };
