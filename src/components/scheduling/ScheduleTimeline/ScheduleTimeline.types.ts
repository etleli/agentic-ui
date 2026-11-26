import type { HTMLAttributes, ReactNode } from 'react';

export type ScheduleTimelineItem = {
  id: string;
  title: string;
  /** A milestone or interval start. YYYY-MM-DD or local YYYY-MM-DDTHH:mm. */
  start?: string;
  /** Optional exclusive interval end using the same format as start. */
  end?: string;
  description?: string;
  status?: string;
  color?: string;
};

export type ScheduleTimelineGroup = { id: string; label: string; items: ScheduleTimelineItem[] };

export type ScheduleTimelineProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  groups: ScheduleTimelineGroup[];
  range?: { start: string; end: string };
  now?: string;
  locale?: string;
  collapsedGroupIds?: readonly string[];
  defaultCollapsedGroupIds?: readonly string[];
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void;
  onItemSelect?: (item: ScheduleTimelineItem) => void;
  renderItem?: (item: ScheduleTimelineItem) => ReactNode;
  labels?: Partial<{ item: string; unscheduled: string }>;
};
