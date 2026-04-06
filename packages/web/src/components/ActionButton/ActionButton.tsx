import type { ReactNode } from 'react';

export type ButtonVariant = 'default' | 'primary' | 'destructive';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:     'bg-bg-elevated border border-border-default text-text-primary hover:bg-bg-hover hover:border-border-strong',
  primary:     'bg-accent-red border-0 text-text-primary hover:opacity-90',
  destructive: 'bg-accent-red-subtle border border-accent-red-muted text-red-300 hover:bg-negative-muted',
};

interface ActionButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function ActionButton({ variant = 'default', disabled, onClick, children, className = '' }: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm
        transition-colors duration-fast cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
