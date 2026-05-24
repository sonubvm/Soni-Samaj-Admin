'use client';

import { AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';

export type ConfirmModalVariant = 'danger' | 'warning' | 'primary';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: ConfirmModalVariant;
  hint?: string;
}

const variantStyles: Record<
  ConfirmModalVariant,
  { iconBg: string; iconColor: string; confirmClass: string }
> = {
  danger: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    confirmClass: 'btn-danger',
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    confirmClass: 'btn-primary',
  },
  primary: {
    iconBg: 'bg-saffron-50',
    iconColor: 'text-saffron-600',
    confirmClass: 'btn-primary',
  },
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmLabel = 'Confirm',
  loadingLabel,
  cancelLabel = 'Cancel',
  loading = false,
  variant = 'primary',
  hint,
}: ConfirmModalProps) {
  if (!open) return null;

  const styles = variantStyles[variant];
  const Icon = variant === 'danger' ? AlertTriangle : Info;

  const handleBackdropClick = () => {
    if (!loading) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-message"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-default"
        onClick={handleBackdropClick}
        aria-label="Close dialog"
        tabIndex={-1}
      />
      <div className="relative card max-w-md w-full border-saffron-200 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={clsx(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
              styles.iconBg
            )}
          >
            <Icon className={clsx('w-5 h-5', styles.iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
            <p id="confirm-modal-message" className="text-sm text-gray-600 mt-2">
              {message}
              {itemName ? (
                <>
                  {' '}
                  <span className="font-semibold text-saffron-800">&quot;{itemName}&quot;</span>?
                </>
              ) : null}
            </p>
            {hint ? <p className="text-xs text-gray-400 mt-2">{hint}</p> : null}
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <button
            type="button"
            data-testid="confirm-modal-cancel"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={clsx(styles.confirmClass, 'disabled:opacity-60')}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (loadingLabel ?? `${confirmLabel}...`) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
