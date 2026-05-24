'use client';

import { useCallback, useState } from 'react';

export interface DeleteModalConfig {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void | Promise<void>;
}

export function useDeleteModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DeleteModalConfig | null>(null);

  const requestDelete = useCallback((next: DeleteModalConfig) => {
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
    requestDelete,
    close,
    confirm,
  };
}
