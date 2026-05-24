import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmModal open={false} onClose={() => {}} onConfirm={() => {}} title="T" message="M" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows title and message when open', () => {
    render(
      <ConfirmModal
        open
        onClose={() => {}}
        onConfirm={() => {}}
        title="Deactivate User"
        message="Are you sure"
        itemName="John"
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Deactivate User')).toBeInTheDocument();
    expect(screen.getByText(/"John"/)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ConfirmModal open onClose={onClose} onConfirm={() => {}} title="T" message="M" />
    );
    await user.click(screen.getByTestId('confirm-modal-cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open
        onClose={() => {}}
        onConfirm={onConfirm}
        title="T"
        message="M"
        confirmLabel="Deactivate"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Deactivate' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows loading label on confirm button', () => {
    render(
      <ConfirmModal
        open
        onClose={() => {}}
        onConfirm={() => {}}
        title="T"
        message="M"
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        loading
      />
    );
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled();
  });
});
