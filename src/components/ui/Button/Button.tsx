import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ButtonBase } from '../styles'

type ButtonVariant = 'default' | 'primary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  iconOnly?: boolean
}

export default function Button({
  variant = 'default',
  iconOnly,
  className,
  ...props
}: ButtonProps) {
  return <ButtonBase className={className} $variant={variant} $iconOnly={Boolean(iconOnly)} {...props} />
}
