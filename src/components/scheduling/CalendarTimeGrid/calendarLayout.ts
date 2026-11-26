import { civilMinute, minutesPerDay } from '../dateMath';
import type { CalendarTimeGridEvent } from './CalendarTimeGrid.types';

type TimedSlot = {
  event: CalendarTimeGridEvent;
  start: number;
  end: number;
  lane: number;
  laneCount: number;
};

export function layoutTimedSlots(events: CalendarTimeGridEvent[], day: number): TimedSlot[] {
  const slots: TimedSlot[] = events.flatMap((event) => {
    if (event.kind !== 'timed') return [];
    const start = civilMinute(event.start), end = civilMinute(event.end);
    if (start === undefined || end === undefined) return [];
    const localStart = Math.max(0, start - day), localEnd = Math.min(minutesPerDay, end - day);
    if (localEnd <= localStart) return [];
    return [{ event, start: localStart, end: localEnd, lane: 0, laneCount: 1 }];
  });
  slots.sort((first, second) => first.start - second.start || second.end - first.end);

  let group: TimedSlot[] = [], laneEnds: number[] = [], groupEnd = -1;
  const finishGroup = () => { for (const slot of group) slot.laneCount = laneEnds.length; };
  for (const slot of slots) {
    if (slot.start >= groupEnd) {
      finishGroup();
      group = [];
      laneEnds = [];
    }
    const available = laneEnds.findIndex((end) => end <= slot.start);
    slot.lane = available === -1 ? laneEnds.length : available;
    laneEnds[slot.lane] = slot.end;
    group.push(slot);
    groupEnd = Math.max(groupEnd, slot.end);
  }
  finishGroup();
  return slots;
}
