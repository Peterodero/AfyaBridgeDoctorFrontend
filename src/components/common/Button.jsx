// src/components/common/Button.jsx
const VARIANT = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  teal:      'btn-teal',
  danger:    'btn-danger',
  ghost:     'btn-ghost',
}

const SIZE = {
  sm:   'btn-sm',
  md:   'btn-md',
  lg:   'btn-lg',
  xl:   'btn-xl',
  icon: 'btn-icon',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  fullWidth = false,
  className = '',
  onClick,
  disabled  = false,
  type      = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${VARIANT[variant] ?? VARIANT.primary}
        ${SIZE[size] ?? SIZE.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </button>
  )
}
