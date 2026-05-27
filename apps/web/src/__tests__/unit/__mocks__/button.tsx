export const Button = ({
  children,
  onClick,
  disabled,
  className,
  type,
  'aria-label': ariaLabel,
  variant: _variant,
  size: _size,
  asChild: _asChild,
}: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={className}
    type={type}
    aria-label={ariaLabel}
  >
    {children}
  </button>
)
