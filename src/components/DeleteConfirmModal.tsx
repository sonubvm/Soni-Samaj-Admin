'use client';

import ConfirmModal from '@/components/ConfirmModal';
import type { DeleteConfirmModalProps } from './DeleteConfirmModal.types';

export type { DeleteConfirmModalProps } from './DeleteConfirmModal.types';

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={message}
      itemName={itemName}
      loading={loading}
      variant="danger"
      confirmLabel="Delete"
      loadingLabel="Deleting..."
      cancelLabel="Cancel"
      hint="This action cannot be undone."
    />
  );
}
