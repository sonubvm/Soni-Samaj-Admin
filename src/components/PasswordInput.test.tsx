import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PasswordInput, { usePasswordVisibility } from './PasswordInput';
import { renderHook, act } from '@testing-library/react';

describe('usePasswordVisibility', () => {
  it('starts hidden and toggles type', () => {
    const { result } = renderHook(() => usePasswordVisibility());
    expect(result.current.visible).toBe(false);
    expect(result.current.inputType).toBe('password');
    act(() => result.current.toggle());
    expect(result.current.visible).toBe(true);
    expect(result.current.inputType).toBe('text');
  });
});

describe('PasswordInput', () => {
  it('renders password field masked by default', () => {
    render(<PasswordInput value="secret" onChange={() => {}} label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('shows password when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput value="secret" onChange={() => {}} label="Password" />);
    await user.click(screen.getByTestId('password-toggle'));
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('password-toggle')).toHaveAttribute('aria-label', 'Hide password');
  });

  it('calls onChange when typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PasswordInput value="" onChange={onChange} label="Password" />);
    await user.type(screen.getByLabelText('Password'), 'abc');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects disabled state on toggle', async () => {
    const user = userEvent.setup();
    render(<PasswordInput value="" onChange={() => {}} disabled label="Password" />);
    const toggle = screen.getByTestId('password-toggle');
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
});
