import type { HTMLAttributes, ReactNode } from 'react';

export type ActivityDensity = 'compact' | 'comfortable' | 'spacious';
export type ActivityVariant = 'default' | 'muted' | 'outline';
export type ActivityTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type ActivityOrientation = 'horizontal' | 'vertical';
export type WorkflowStepState = 'complete' | 'active' | 'pending' | 'error' | 'paused';
export type RunQueueState = 'queued' | 'running' | 'complete' | 'blocked' | 'failed' | 'paused';
export type AuditTrailState = 'created' | 'updated' | 'approved' | 'blocked' | 'failed' | 'system';
export type ExecutionPhaseState = 'pending' | 'running' | 'complete' | 'failed' | 'skipped';

export type ActivityAction = {
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: ReactNode;
};

export type TimelineItem = {
  description?: ReactNode;
  id: string;
  label?: ReactNode;
  meta?: ReactNode;
  timestamp?: ReactNode;
  title: ReactNode;
  tone?: ActivityTone;
};

export type ActivityFeedItem = {
  description?: ReactNode;
  id: string;
  meta?: ReactNode;
  source?: ReactNode;
  status?: WorkflowStepState;
  timestamp?: ReactNode;
  title: ReactNode;
  tone?: ActivityTone;
};

export type WorkflowStep = {
  description?: ReactNode;
  id: string;
  label?: ReactNode;
  meta?: ReactNode;
  state?: WorkflowStepState;
  title: ReactNode;
};

export type RunQueueItem = {
  actions?: ActivityAction[];
  description?: ReactNode;
  id: string;
  meta?: ReactNode;
  progress?: number;
  state?: RunQueueState;
  title: ReactNode;
};

export type ExecutionTimelinePhase = {
  description?: ReactNode;
  duration?: ReactNode;
  id: string;
  label?: ReactNode;
  state?: ExecutionPhaseState;
  title: ReactNode;
};

export type AuditTrailEntry = {
  actor?: ReactNode;
  description?: ReactNode;
  id: string;
  state?: AuditTrailState;
  target?: ReactNode;
  timestamp?: ReactNode;
  title: ReactNode;
};

export type JobDetailMetric = {
  id: string;
  label: ReactNode;
  tone?: ActivityTone;
  value: ReactNode;
};

export type WorkflowDependencyNode = {
  dependsOn?: string[];
  id: string;
  label: ReactNode;
  state?: WorkflowStepState;
};

export type TimelineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  items?: TimelineItem[];
  orientation?: ActivityOrientation;
  selectable?: boolean;
  selectedId?: string;
  showTimestamps?: boolean;
  variant?: ActivityVariant;
  onItemSelect?: (itemId: string, item: TimelineItem) => void;
};

export type ActivityFeedProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  items?: ActivityFeedItem[];
  selectable?: boolean;
  selectedId?: string;
  showSource?: boolean;
  variant?: ActivityVariant;
  onItemSelect?: (itemId: string, item: ActivityFeedItem) => void;
};

export type WorkflowStepperProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  orientation?: ActivityOrientation;
  selectable?: boolean;
  selectedStepId?: string;
  steps?: WorkflowStep[];
  variant?: ActivityVariant;
  onStepSelect?: (stepId: string, step: WorkflowStep) => void;
};

export type RunQueueProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  items?: RunQueueItem[];
  selectable?: boolean;
  selectedId?: string;
  showProgress?: boolean;
  variant?: ActivityVariant;
  onActionSelect?: (actionId: string, itemId: string, item: RunQueueItem) => void;
  onItemSelect?: (itemId: string, item: RunQueueItem) => void;
};

export type ExecutionTimelineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  phases?: ExecutionTimelinePhase[];
  selectable?: boolean;
  selectedPhaseId?: string;
  variant?: ActivityVariant;
  onPhaseSelect?: (phaseId: string, phase: ExecutionTimelinePhase) => void;
};

export type AuditTrailProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  entries?: AuditTrailEntry[];
  selectable?: boolean;
  selectedEntryId?: string;
  showActors?: boolean;
  variant?: ActivityVariant;
  onEntrySelect?: (entryId: string, entry: AuditTrailEntry) => void;
};

export type JobDetailPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  density?: ActivityDensity;
  description?: ReactNode;
  metrics?: JobDetailMetric[];
  progress?: number;
  state?: RunQueueState;
  title?: ReactNode;
  variant?: ActivityVariant;
};

export type WorkflowDependencyGraphProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: ActivityDensity;
  nodes?: WorkflowDependencyNode[];
  selectable?: boolean;
  selectedNodeId?: string;
  variant?: ActivityVariant;
  onNodeSelect?: (nodeId: string, node: WorkflowDependencyNode) => void;
};
