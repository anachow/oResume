/**
 * Checkbox Component
 * Checkbox with label
 */

import React from 'react'
import { cn } from '@/utils/helpers'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | React.ReactNode
  error?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substring(7)}`

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'mt-0.5 w-4 h-4 text-primary bg-white border-gray-300 rounded',
              'focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'cursor-pointer',
              error && 'border-red-500',
              className
            )}
            {...props}
          />

          {label && (
            <label
              htmlFor={checkboxId}
              className="text-sm text-text cursor-pointer select-none"
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 ml-6">{error}</p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
