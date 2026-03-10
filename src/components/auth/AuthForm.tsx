import type { AuthScope } from '../../types'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import ui from '../ui/ui.module.css'
import styles from './AuthForm.module.css'

type AuthFormProps = {
  credentials: string
  scope: AuthScope
  error: string | null
  onCredentialsChange: (value: string) => void
  onScopeChange: (scope: AuthScope) => void
  onSubmit: () => void
}

export default function AuthForm({
  credentials,
  scope,
  error,
  onCredentialsChange,
  onScopeChange,
  onSubmit,
}: AuthFormProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Введите Credentials и выберите Scope. Данные не сохраняются.</p>

        <div className={styles.grid}>
          <div>
            <label className={ui.fieldLabel} htmlFor="credentials">
              Credentials (Base64)
            </label>
            <input
              id="credentials"
              className={ui.input}
              type="password"
              value={credentials}
              onChange={(e) => onCredentialsChange(e.target.value)}
              placeholder="base64..."
              autoComplete="off"
            />
          </div>

          {error ? <ErrorMessage message={error} /> : null}

          <div>
            <div className={ui.fieldLabel}>Scope</div>
            <div className={styles.radios}>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_PERS'}
                  onChange={() => onScopeChange('GIGACHAT_API_PERS')}
                />
                <span>GIGACHAT_API_PERS</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_B2B'}
                  onChange={() => onScopeChange('GIGACHAT_API_B2B')}
                />
                <span>GIGACHAT_API_B2B</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_CORP'}
                  onChange={() => onScopeChange('GIGACHAT_API_CORP')}
                />
                <span>GIGACHAT_API_CORP</span>
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" type="button" onClick={onSubmit}>
              Войти
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
