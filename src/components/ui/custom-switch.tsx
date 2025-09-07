import { cn } from '@/src/lib/utils'
import { motion } from 'framer-motion'
import * as React from 'react'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  className?: string
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      required,
      name,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : internalChecked

    const handleToggle = React.useCallback(() => {
      if (disabled) return

      const newChecked = !checked

      if (!isControlled) {
        setInternalChecked(newChecked)
      }

      onCheckedChange?.(newChecked)
    }, [checked, disabled, isControlled, onCheckedChange])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          handleToggle()
        }
      },
      [handleToggle],
    )

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input',
          className,
        )}
        {...props}
      >
        <motion.div
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          )}
          initial={false}
          animate={{
            x: checked ? 20 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {}} // Handled by button click
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </button>
    )
  },
)

Switch.displayName = 'Switch'
