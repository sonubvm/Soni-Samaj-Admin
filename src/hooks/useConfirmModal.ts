'use client';

import { useCallback, useState } from 'react';
import type { ConfirmModalVariant } from '@/components/ConfirmModal';

export interface ConfirmModalConfig {
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
  hint?: string;
  onConfirm: () => void | Promise<void>;
}

export function useConfirmModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmModalConfig | null>(null);

  const requestConfirm = useCallback((next: ConfirmModalConfig) => {
    setConfig(next);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    if (loading) return;
    setOpen(false);
    setConfig(null);
  }, [loading]);

  const confirm = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      await config.onConfirm();
      setOpen(false);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  }, [config]);

  return {
    open,
    loading,
    title: config?.title ?? '',
    message: config?.message ?? '',
    itemName: config?.itemName,
    confirmLabel: config?.confirmLabel ?? 'Confirm',
    cancelLabel: config?.cancelLabel ?? 'Cancel',
    variant: config?.variant ?? 'primary',
    hint: config?.hint,
    requestConfirm,
    close,
    confirm,
  };
}
