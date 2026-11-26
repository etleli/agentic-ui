import { Button } from '../../inputs/Button';
import '../Layout.css';
import './RecordHeader.css';
import { getLayoutClassName } from '../Layout.utils';
import type { PageHeaderProps } from '../Layout.types';

export function PageHeader({
  actions = [],
  className,
  density = 'comfortable',
  description,
  eyebrow,
  meta,
  record,
  title = 'Workspace',
  variant = 'default',
  onActionSelect,
  ...headerProps
}: PageHeaderProps) {
  const actionButtons = actions.map((action) => <Button disabled={action.disabled} icon={action.icon} key={action.id}
    showToggleIndicator={false} size={density} variant={action.active ? 'primary' : 'secondary'} onClick={() => onActionSelect?.(action.id)}>
    {action.label}
  </Button>);

  if (record) {
    const Heading = record.headingLevel === 2 ? 'h2' : record.headingLevel === 3 ? 'h3' : 'h1';
    return <header {...headerProps} className={getLayoutClassName('page-header page-header--record', className)} data-density={density} data-variant={variant}>
      <div className="page-header__record-main">
        <div className="page-header__record-title">
          {record.back ? <div>{record.back}</div> : null}
          {record.id || eyebrow ? <span className="page-header__eyebrow">{record.id ?? eyebrow}</span> : null}
          {title ? <Heading className="page-header__title">{title}</Heading> : null}
        </div>
        {record.badges ? <div className="page-header__record-badges">{record.badges}</div> : null}
      </div>
      {description || meta || record.media ? <div className="page-header__record-detail">
        {description || meta ? <div className="page-header__record-meta">
          {description ? <div className="page-header__description">{description}</div> : null}
          {meta ? <div className="page-header__meta">{meta}</div> : null}
        </div> : null}
        {record.media}
      </div> : null}
      {actions.length || record.actionContent ? <div className="page-header__record-actions">{actionButtons}{record.actionContent}</div> : null}
      {record.tabs ? <div className="page-header__record-tabs">{record.tabs}</div> : null}
    </header>;
  }

  return (
    <section {...headerProps} className={getLayoutClassName('page-header', className)} data-density={density} data-variant={variant}>
      <span className="page-header__copy">
        {eyebrow ? <span className="page-header__eyebrow">{eyebrow}</span> : null}
        {title ? <h2 className="page-header__title">{title}</h2> : null}
        {description ? <span className="page-header__description">{description}</span> : null}
        {meta ? <span className="page-header__meta">{meta}</span> : null}
      </span>
      {actions.length > 0 ? (
        <span className="page-header__actions">
          {actionButtons}
        </span>
      ) : null}
    </section>
  );
}

export type { PageHeaderProps };
