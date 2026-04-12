# Mock Chat UI (React)

Статическое чат-приложение, собранное на React + TypeScript + Vite.

Возможности:
- Адаптивный layout с sidebar и окном чата
- Панель настроек, empty/error состояния
- Рендеринг сообщений с базовой поддержкой Markdown через `react-markdown`
- Светлая и тёмная тема через CSS-переменные
- Стилизация через `styled-components`

## Демо

- Production: https://front3-umber.vercel.app/

## Стек

- React `19.2.0`
- TypeScript `5.9.3`
- Vite `7.3.1`
- React Router DOM `7.13.2`
- Redux Toolkit `2.11.2`
- React Redux `9.2.0`
- Styled Components `6.3.11`
- Vitest `4.1.2`

## Запуск локально

1. Клонируйте репозиторий:

```bash
git clone https://github.com/dmitryrn/front3_hw
cd front3_hw
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте локальный env-файл:

```bash
cp .env.example .env.local
```

4. Заполните `.env.local`:

```bash
OPENAI_API_KEY=your_server_side_key
```

5. Запустите frontend dev server:

```bash
npm run dev
```

6. Для полной локальной работы вместе с Vercel server function запустите:

```bash
npx vercel dev
```

Примечание:
- `npm run dev` запускает только Vite frontend
- `npx vercel dev` нужен, если вы хотите, чтобы локально работал `/api/chat`

## Переменные окружения

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Да | Server-side OpenAI API key, который используется Vercel function в `api/chat.ts` |

## Тесты

Запуск тестов через Vitest:

```bash
npm test
```

Однократный запуск тестов (CI mode):

```bash
npm test -- --run
```

## Аудит bundle

Визуализация bundle из `vite-bundle-visualizer`:

![Bundle visualization](./docs/bundle-stats.png)

## Деплой

Приложение настроено для Vercel и использует server-side proxy function в `api/chat.ts`.

Обязательная env-переменная:

```bash
OPENAI_API_KEY=your_server_side_key
```

Важно:
- не передавайте OpenAI key через `VITE_*` переменные
- браузер вызывает `/api/chat`, а напрямую с OpenAI общается только Vercel function

## Деплой на Vercel

1. При необходимости установите Vercel CLI:

```bash
npm i -g vercel
```

2. Выполните вход и привяжите проект:

```bash
vercel
```

3. Добавьте server-side OpenAI key в Vercel:

```bash
vercel env add OPENAI_API_KEY
```

4. Задеплойте в production:

```bash
vercel --prod
```

Примечания:
- `vercel.json` уже содержит SPA fallback для React Router
- пример локального env описан в `.env.example`
- после деплоя откройте `/chat/<id>` напрямую, чтобы проверить работу router rewrites
- также проверьте приложение в режиме инкогнито, чтобы убедиться в корректном первом запуске

### Покрытие тестами

**InputArea** (`src/components/chat/InputArea/`)
- Отправка сообщений по клику на кнопку и по Enter
- Блокировка отправки на Shift+Enter (перенос строки)
- Отключение submit для пустого текста и текста из пробелов
- Очистка поля после успешной отправки
- Отображение кнопки stop и запрет отправки во время loading

**Message** (`src/components/chat/Message/`)
- Копирование содержимого assistant message в буфер обмена
- Отображение состояния "Copied" после успешного копирования
- Автоматический сброс состояния копирования через 2 секунды
- Отображение typing indicator для pending assistant messages
- Скрытие кнопки копирования для user messages и pending states

**Sidebar** (`src/components/sidebar/Sidebar/`)
- Работа поиска: вызов `onSearchChange` при вводе
- Появление подтверждения удаления по клику на кнопку delete
- Отмена удаления без вызова delete handler
- Подтверждение удаления и вызов `onDeleteChat` с корректным ID

**chatSlice reducer** (`src/store/chatSlice.test.ts`)
- Создание новых чатов с автоматически сгенерированными заголовками
- Удаление чатов и переключение на следующий доступный чат
- Сброс state при удалении последнего чата
- Редактирование заголовков чатов
- Отправка сообщений: добавление user/assistant messages и генерация заголовка для пустого чата
- Обновление assistant message при успешном завершении
- Обработка неуспешной отправки: удаление placeholder и сохранение ошибки

**Persistence** (`src/store/persistence.test.ts`)
- Сохранение chat state в `localStorage`
- Загрузка chat state из `localStorage`
- Корректная обработка невалидного JSON
- Корректная обработка отсутствующих данных в `localStorage`
