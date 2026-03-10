import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './ui.module.css'

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
  const variantClass =
    variant === 'primary' ? styles.btnPrimary : variant === 'ghost' ? styles.btnGhost : undefined

  const iconClass = iconOnly ? styles.btnIcon : undefined

  const cls = [styles.btn, variantClass, iconClass, className].filter(Boolean).join(' ')
  return <button className={cls} {...props} />
}
