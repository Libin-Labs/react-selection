'use client';
import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
export type SelectionId = string | number;
export interface Modifiers {
  shiftKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  additive?: boolean;
}
export function useSelection(
  ids: readonly SelectionId[],
  options: {
    selectedIds?: readonly SelectionId[];
    defaultSelectedIds?: readonly SelectionId[];
    onChange?: (ids: SelectionId[]) => void;
    multiple?: boolean;
    disabledIds?: readonly SelectionId[];
  } = {},
) {
  if (
    ids.length > 100000 ||
    new Set(ids).size !== ids.length ||
    ids.some(
      (id) =>
        !['string', 'number'].includes(typeof id) ||
        (typeof id === 'number' && !Number.isFinite(id)),
    )
  )
    throw new TypeError('Supply at most 100000 unique finite numeric/string ids.');
  const [internal, setInternal] = useState<readonly SelectionId[]>(
    options.defaultSelectedIds ?? [],
  );
  const selectedIds = [
    ...new Set((options.selectedIds ?? internal).filter((id) => ids.includes(id))),
  ];
  const selected = useRef(selectedIds);
  selected.current = selectedIds;
  const anchor = useRef<SelectionId | null>(null);
  const disabled = new Set(options.disabledIds ?? []);
  const commit = (next: SelectionId[]) => {
    selected.current = next;
    if (options.selectedIds === undefined) setInternal(next);
    options.onChange?.(next);
  };
  const select = (id: SelectionId, modifiers: Modifiers = {}) => {
    const index = ids.indexOf(id);
    if (index < 0 || disabled.has(id)) return;
    let next = new Set(selected.current);
    const previous = anchor.current === null ? -1 : ids.indexOf(anchor.current);
    if (options.multiple === false) next = new Set([id]);
    else if (modifiers.shiftKey && previous >= 0) {
      if (!modifiers.ctrlKey && !modifiers.metaKey && !modifiers.additive) next.clear();
      for (let cursor = Math.min(index, previous); cursor <= Math.max(index, previous); cursor += 1)
        if (!disabled.has(ids[cursor]!)) next.add(ids[cursor]!);
    } else if (modifiers.ctrlKey || modifiers.metaKey || modifiers.additive) {
      if (next.has(id)) next.delete(id);
      else next.add(id);
    } else next = new Set([id]);
    if (!modifiers.shiftKey) anchor.current = id;
    commit([...next]);
  };
  const onKeyDown = (event: KeyboardEvent, activeId: SelectionId): SelectionId => {
    if (event.isDefaultPrevented() || event.nativeEvent.isComposing) return activeId;
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'a' &&
      options.multiple !== false
    ) {
      event.preventDefault();
      commit(ids.filter((id) => !disabled.has(id)));
      return activeId;
    }
    if (event.key === ' ') {
      event.preventDefault();
      select(activeId, { additive: true });
      return activeId;
    }
    const step = ['ArrowDown', 'ArrowRight'].includes(event.key)
      ? 1
      : ['ArrowUp', 'ArrowLeft'].includes(event.key)
        ? -1
        : 0;
    if (!step && !['Home', 'End'].includes(event.key)) return activeId;
    event.preventDefault();
    let next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? ids.length - 1
          : ids.indexOf(activeId) + step;
    const direction = event.key === 'End' ? -1 : step || 1;
    while (next >= 0 && next < ids.length && disabled.has(ids[next]!)) next += direction;
    const id = ids[next];
    if (id === undefined) return activeId;
    if (event.shiftKey) {
      if (anchor.current === null) anchor.current = activeId;
      select(id, event);
    }
    return id;
  };
  return {
    selectedIds,
    isSelected: (id: SelectionId) => selected.current.includes(id),
    select,
    toggle: (id: SelectionId) => select(id, { additive: true }),
    clear: () => commit([]),
    selectAll: () =>
      commit(
        options.multiple === false
          ? ids.filter((id) => !disabled.has(id)).slice(0, 1)
          : ids.filter((id) => !disabled.has(id)),
      ),
    onKeyDown,
    getItemProps: (id: SelectionId) => ({
      'aria-selected': selectedIds.includes(id),
      onClick: (event: MouseEvent) => select(id, event),
    }),
  };
}
export default useSelection;
