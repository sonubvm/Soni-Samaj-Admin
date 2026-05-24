'use client';

import { useId, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import clsx from 'clsx';

export interface PasswordInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
}

export function usePasswordVisibility(initialVisible = false) {
  const [visible, setVisible] = useState(initialVisible);
  const toggle = () => setVisible((v) => !v);
  const inputType = visible ? 'text' : 'password';
  return { visible, toggle, inputType, setVisible };
}

export default function PasswordInput({
  id: idProp,
  label = 'Password',
  value,
  onChange,
  placeholder = 'Enter password',
  required,
  disabled,
  autoComplete = 'current-password',
  className,
  inputClassName,
  showIcon = true,
}: PasswordInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const { visible, toggle, inputType } = usePasswordVisibility();

  return (
    <div className={className}>
      {label ? <label className="label" htmlFor={inputId}>{label}</label> : null}
      <div className="relative">
        {showIcon && (
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            aria-hidden
          />
        )}
        <input
          id={inputId}
          type={inputType}
          className={clsx('input', showIcon && 'pl-10', 'pr-11', inputClassName)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          data-testid="password-toggle"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-saffron-600 rounded-lg transition"
          onClick={toggle}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          tabIndex={0}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
