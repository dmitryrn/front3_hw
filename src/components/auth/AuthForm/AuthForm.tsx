import Button from '../../ui/Button/Button'
import ErrorMessage from '../../ui/ErrorMessage/ErrorMessage'
import { FieldLabel, Input } from '../../ui/styles'
import { Actions, Card, Grid, Subtitle, Title, Wrap } from '../styles'

type AuthFormProps = {
  apiKey: string
  error: string | null
  onApiKeyChange: (value: string) => void
  onSubmit: () => void
}

export default function AuthForm({
  apiKey,
  error,
  onApiKeyChange,
  onSubmit,
}: AuthFormProps) {
  return (
    <Wrap>
      <Card>
        <Title>Вход</Title>
        <Subtitle>Введите OpenAI API key. Данные не сохраняются.</Subtitle>

        <Grid>
          <div>
            <FieldLabel htmlFor="apiKey">OpenAI API Key</FieldLabel>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
          </div>

          {error ? <ErrorMessage message={error} /> : null}

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
