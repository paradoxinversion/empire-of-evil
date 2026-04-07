import type { ReactNode } from 'react';

export type TagVariant =
  | 'operative' | 'scientist' | 'troop' | 'admin' | 'unassigned'
  | 'active' | 'traveling' | 'injured' | 'plot' | 'activity'
  | 'stable' | 'unrest' | 't1' | 't2' | 't3' | 't4'
  | 'ready' | 'research' | 'hostile' | 'neutral';

const VARIANT_CLASSES: Record<TagVariant, string> = {
  operative:  'bg-info-muted text-blue-300',
  scientist:  'bg-positive-muted text-green-300',
  troop:      'bg-negative-muted text-red-300',
  admin:      'bg-warning-muted text-orange-300',
  unassigned: 'bg-bg-elevated text-text-muted',
  active:     'bg-positive-muted text-green-300',
  traveling:  'bg-info-muted text-blue-300',
  injured:    'bg-negative-muted text-red-300',
  plot:       'bg-accent-red-subtle text-accent-red',
  activity:   'bg-info-muted text-blue-300',
  stable:     'bg-positive-muted text-green-300',
  unrest:     'bg-warning-muted text-orange-300',
  t1:         'bg-bg-elevated text-text-secondary',
  t2:         'bg-info-muted text-blue-300',
  t3:         'bg-warning-muted text-orange-300',
  t4:         'bg-accent-red-muted text-red-300',
  ready:      'bg-positive-muted text-green-300',
  research:   'bg-bg-elevated text-text-muted',
  hostile:    'bg-negative-muted text-red-300',
  neutral:    'bg-bg-elevated text-text-muted',
};

interface TagProps {
  variant: TagVariant;
  children: ReactNode;
}

export function Tag({ variant, children }: TagProps) {
  return (
    <span
      data-variant={variant}
      className={`inline-block font-mono text-[9px] tracking-[0.08em] px-1.5 py-0.5 rounded-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
