import { AlertTriangle, Check, Circle, Pause, Play } from 'lucide-react';
import '../Activity.css';
import { getActivityClassName, getActivityIconSize, getActivityToneClass, getStatusLabel } from '../Activity.utils';
import type { WorkflowStep, WorkflowStepperProps, WorkflowStepState } from '../Activity.types';

function getStepIcon(state: WorkflowStepState | undefined, size: number) {
  if (state === 'complete') {
    return <Check size={size} aria-hidden="true" />;
  }

  if (state === 'active') {
    return <Play size={size} aria-hidden="true" />;
  }

  if (state === 'error') {
    return <AlertTriangle size={size} aria-hidden="true" />;
  }

  if (state === 'paused') {
    return <Pause size={size} aria-hidden="true" />;
  }

  return <Circle size={size} aria-hidden="true" />;
}

export function WorkflowStepper({
  className,
  density = 'comfortable',
  orientation = 'horizontal',
  selectable = true,
  selectedStepId,
  steps = [],
  variant = 'default',
  onStepSelect,
  ...stepperProps
}: WorkflowStepperProps) {
  const iconSize = getActivityIconSize(density);

  return (
    <div
      {...stepperProps}
      className={getActivityClassName('workflow-stepper', className)}
      data-density={density}
      data-orientation={orientation}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="workflow-stepper__list">
        {steps.map((step: WorkflowStep) => {
          const state = step.state ?? 'pending';
          const isSelected = step.id === selectedStepId;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="workflow-stepper__step"
              data-selected={isSelected ? 'true' : undefined}
              data-tone={getActivityToneClass(undefined, state)}
              key={step.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onStepSelect?.(step.id, step) : undefined}
            >
              <span className="workflow-stepper__icon">{getStepIcon(state, iconSize)}</span>
              <span className="activity-copy">
                {step.label ? <span className="activity-label">{step.label}</span> : null}
                <strong className="activity-title">{step.title}</strong>
                {step.description ? <span className="activity-description">{step.description}</span> : null}
                <span className="activity-meta">{step.meta ?? getStatusLabel(state)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { WorkflowStep, WorkflowStepperProps, WorkflowStepState } from '../Activity.types';
