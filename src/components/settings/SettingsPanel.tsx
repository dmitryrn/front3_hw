import type { ChatSettings, Theme } from '../../types'
import Button from '../ui/Button'
import Slider from '../ui/Slider'
import Toggle from '../ui/Toggle'
import ui from '../ui/ui.module.css'
import styles from './SettingsPanel.module.css'

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
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Настройки"
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h3 className={styles.title}>Настройки</h3>
          <Button type="button" variant="ghost" iconOnly onClick={onClose} aria-label="Закрыть">
            ✕
          </Button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            <label className={ui.fieldLabel} htmlFor="model">
              Model
            </label>
            <select
              id="model"
              className={ui.select}
              value={settings.model}
              onChange={(e) => onChangeSettings({ ...settings, model: e.target.value as ChatSettings['model'] })}
            >
              <option value="GigaChat">GigaChat</option>
              <option value="GigaChat-Plus">GigaChat-Plus</option>
              <option value="GigaChat-Pro">GigaChat-Pro</option>
              <option value="GigaChat-Max">GigaChat-Max</option>
            </select>
          </div>

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

          <div className={styles.row}>
            <label className={ui.fieldLabel} htmlFor="maxTokens">
              Max Tokens
            </label>
            <input
              id="maxTokens"
              className={ui.input}
              type="number"
              value={settings.maxTokens}
              min={1}
              step={1}
              onChange={(e) => onChangeSettings({ ...settings, maxTokens: Number(e.target.value) })}
            />
          </div>

          <div className={styles.row}>
            <label className={ui.fieldLabel} htmlFor="systemPrompt">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              className={ui.textarea}
              value={settings.systemPrompt}
              onChange={(e) => onChangeSettings({ ...settings, systemPrompt: e.target.value })}
            />
          </div>

          <Toggle
            checked={theme === 'dark'}
            onChange={(checked) => onChangeTheme(checked ? 'dark' : 'light')}
            label="Тема"
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onReset}>
            Сбросить
          </Button>
          <Button type="button" variant="primary" onClick={onSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  )
}
