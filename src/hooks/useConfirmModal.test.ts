import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useConfirmModal } from './useConfirmModal';

describe('useConfirmModal', () => {
  it('opens with config and closes', () => {
    const { result } = renderHook(() => useConfirmModal());
    act(() => {
      result.current.requestConfirm({
        title: 'Test',
        message: 'Message',
        onConfirm: vi.fn(),
      });
    });
    expect(result.current.open).toBe(true);
    expect(result.current.title).toBe('Test');
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
  });

  it('runs onConfirm and closes on success', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useConfirmModal());
    act(() => {
      result.current.requestConfirm({
        title: 'Delete',
        message: 'Sure?',
        onConfirm,
      });
    });
    await act(async () => {
      await result.current.confirm();
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(result.current.open).toBe(false);
  });
});
