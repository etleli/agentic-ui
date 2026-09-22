import type { ActivityDensity, ActivityTone, RunQueueState, WorkflowStepState } from './Activity.types';

export function getActivityClassName(baseClassName: string, className?: string) {
  return [baseClassName, className].filter(Boolean).join(' ');
}

export function getActivityToneClass(tone: ActivityTone | undefined, state?: WorkflowStepState | RunQueueState) {
  if (tone && tone !== 'default') {
    return tone;
  }

  if (state === 'complete') {
    return 'positive';
  }

  if (state === 'active' || state === 'running') {
    return 'accent';
  }

  if (state === 'blocked' || state === 'paused' || state === 'queued') {
    return 'warning';
  }

  if (state === 'error' || state === 'failed') {
    return 'negative';
  }

  return tone ?? 'default';
}

export function getStatusLabel(state: WorkflowStepState | RunQueueState | undefined) {
  if (!state) {
    return undefined;
  }

  return state.charAt(0).toUpperCase() + state.slice(1);
}

export function getStatusBadgeStatus(state: WorkflowStepState | RunQueueState | undefined) {
  if (state === 'complete') {
    return 'online';
  }

  if (state === 'active' || state === 'running') {
    return 'watching';
  }

  if (state === 'error' || state === 'failed') {
    return 'error';
  }

  if (state === 'paused') {
    return 'paused';
  }

  return state ? 'disabled' : undefined;
}

export function getProgressTone(state: RunQueueState | undefined) {
  if (state === 'complete') {
    return 'positive';
  }

  if (state === 'failed') {
    return 'negative';
  }

  if (state === 'blocked' || state === 'paused' || state === 'queued') {
    return 'warning';
  }

  return 'accent';
}

export function getActivityIconSize(density: ActivityDensity) {
  return density === 'compact' ? 14 : density === 'spacious' ? 18 : 16;
}
