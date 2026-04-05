import type { ChatSettings, Theme } from '../../../types'
import Button from '../../ui/Button/Button'
import Slider from '../../ui/Slider/Slider'
import Toggle from '../../ui/Toggle/Toggle'
import { FieldLabel, Input, Select, Textarea } from '../../ui/styles'
import { Actions, Body, Head, Overlay, Panel, Row, Title } from '../styles'

type SettingsPanelProps = {
  isOpen: boolean
  settings: ChatSettings
  theme: Theme
  onClose: () => void
  onChangeSettings: (next: ChatSettings) => void
  onChangeTheme: (next: Theme) => void
  onSave: () => void
  onReset: () => void
}

export default function SettingsPanel({
  isOpen,
  settings,
  theme,
  onClose,
  onChangeSettings,
  onChangeTheme,
  onSave,
  onReset,
}: SettingsPanelProps) {
  if (!isOpen) return null

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="Настройки" onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        <Head>
          <Title>Настройки</Title>
          <Button type="button" variant="ghost" iconOnly onClick={onClose} aria-label="Закрыть">
            ✕
          </Button>
        </Head>

        <Body>
          <Row>
            <FieldLabel htmlFor="model">
              Model
            </FieldLabel>
            <Select
              id="model"
              value={settings.model}
              onChange={(e) => onChangeSettings({ ...settings, model: e.target.value as ChatSettings['model'] })}
            >
              <option value="gpt-5-mini">gpt-5-mini</option>
            </Select>
          </Row>

          <Slider
            label="Temperature"
            value={settings.temperature}
            min={0}
            max={2}
            step={0.01}
            onChange={(v) => onChangeSettings({ ...settings, temperature: v })}
          />

          <Slider
            label="Top-P"
            value={settings.topP}
            min={0}
            max={1}
            step={0.01}
            onChange={(v) => onChangeSettings({ ...settings, topP: v })}
          />

          <Row>
            <FieldLabel htmlFor="maxTokens">
              Max Tokens
            </FieldLabel>
            <Input
              id="maxTokens"
              type="number"
              value={settings.maxTokens}
              min={1}
              step={1}
              onChange={(e) => onChangeSettings({ ...settings, maxTokens: Number(e.target.value) })}
            />
          </Row>

          <Row>
            <FieldLabel htmlFor="systemPrompt">
              System Prompt
            </FieldLabel>
            <Textarea
              id="systemPrompt"
              value={settings.systemPrompt}
              onChange={(e) => onChangeSettings({ ...settings, systemPrompt: e.target.value })}
            />
          </Row>

          <Toggle
            checked={theme === 'dark'}
            onChange={(checked) => onChangeTheme(checked ? 'dark' : 'light')}
            label="Тема"
          />
        </Body>

        <Actions>
          <Button type="button" variant="ghost" onClick={onReset}>
            Сбросить
          </Button>
          <Button type="button" variant="primary" onClick={onSave}>
            Сохранить
          </Button>
        </Actions>
      </Panel>
    </Overlay>
  )
}
