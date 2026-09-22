import { useEffect, useState } from 'react';
import { WorkflowStepper } from './WorkflowStepper';
import type { WorkflowStep, WorkflowStepperProps } from '../Activity.types';

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    description: 'Inputs and parameter schema passed validation.',
    id: 'validate',
    label: '01',
    state: 'complete',
    title: 'Validate',
  },
  {
    description: 'Runtime is calculating candidate allocations.',
    id: 'simulate',
    label: '02',
    state: 'active',
    title: 'Simulate',
  },
  {
    description: 'Risk limits will gate the generated order plan.',
    id: 'risk',
    label: '03',
    state: 'pending',
    title: 'Risk gate',
  },
  {
    description: 'Paper order submission waits for approval.',
    id: 'submit',
    label: '04',
    state: 'pending',
    title: 'Submit',
  },
];

export type WorkflowStepperExampleProps = WorkflowStepperProps;

export function WorkflowStepperExample({
  density = 'comfortable',
  orientation = 'horizontal',
  selectable = true,
  selectedStepId = 'simulate',
  variant = 'default',
}: WorkflowStepperExampleProps) {
  const [activeStepId, setActiveStepId] = useState(selectedStepId);

  useEffect(() => {
    setActiveStepId(selectedStepId);
  }, [selectedStepId]);

  return (
    <WorkflowStepper
      density={density}
      orientation={orientation}
      selectable={selectable}
      selectedStepId={activeStepId}
      steps={WORKFLOW_STEPS}
      variant={variant}
      onStepSelect={setActiveStepId}
    />
  );
}
