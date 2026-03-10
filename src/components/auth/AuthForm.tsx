import type { AuthScope } from '../../types'
import Button from '../ui/Button'
import ErrorMessage from '../ui/ErrorMessage'
import { FieldLabel, Input } from '../ui/styles'
import { Actions, Card, Grid, Radio, Radios, Subtitle, Title, Wrap } from './styles'

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
    <Wrap>
      <Card>
        <Title>Вход</Title>
        <Subtitle>Введите Credentials и выберите Scope. Данные не сохраняются.</Subtitle>

        <Grid>
          <div>
            <FieldLabel htmlFor="credentials">
              Credentials (Base64)
            </FieldLabel>
            <Input
              id="credentials"
              type="password"
              value={credentials}
              onChange={(e) => onCredentialsChange(e.target.value)}
              placeholder="base64..."
              autoComplete="off"
            />
          </div>

          {error ? <ErrorMessage message={error} /> : null}

          <div>
            <FieldLabel as="span">Scope</FieldLabel>
            <Radios>
              <Radio>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_PERS'}
                  onChange={() => onScopeChange('GIGACHAT_API_PERS')}
                />
                <span>GIGACHAT_API_PERS</span>
              </Radio>
              <Radio>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_B2B'}
                  onChange={() => onScopeChange('GIGACHAT_API_B2B')}
                />
                <span>GIGACHAT_API_B2B</span>
              </Radio>
              <Radio>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'GIGACHAT_API_CORP'}
                  onChange={() => onScopeChange('GIGACHAT_API_CORP')}
                />
                <span>GIGACHAT_API_CORP</span>
              </Radio>
            </Radios>
          </div>

          <Actions>
            <Button variant="primary" type="button" onClick={onSubmit}>
              Войти
            </Button>
          </Actions>
        </Grid>
      </Card>
    </Wrap>
  )
}
