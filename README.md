# Mock Chat UI (React)

Static UI shell for a future chat application (homework project). Built with React + TypeScript + Vite.

Includes:
- Responsive layout with sidebar + chat window
- Auth screen (mocked), settings drawer, empty/error UI states
- Message rendering with basic Markdown via `react-markdown`
- Light/dark theme via CSS variables
- Styling via `styled-components`

## Dev

```bash
npm install
npm run dev
```

## Tests

Run tests with Vitest:

```bash
npm test
```

Run tests once (CI mode):

```bash
npm test -- --run
```

## Bundle Audit

Bundle visualization from `vite-bundle-visualizer`:

![Bundle visualization](./bundle-stats.png)

### Test Coverage

**InputArea** (`src/components/chat/InputArea/`)
- Sending messages on button click and Enter key
- Preventing send on Shift+Enter (newline)
- Disabling submit for empty/whitespace input
- Clearing input after successful send
- Showing stop button and preventing send while loading

**Message** (`src/components/chat/Message/`)
- Copying assistant message content to clipboard
- Showing "Copied" state after successful copy
- Auto-resetting copied state after 2 seconds
- Showing typing indicator for pending assistant messages
- Hiding copy button for user messages and pending states

**Sidebar** (`src/components/sidebar/Sidebar/`)
- Search functionality - calling onSearchChange when typing
- Delete confirmation dialog appearing on delete button click
- Canceling delete dialog without deleting
- Confirming delete and calling onDeleteChat with correct ID

**chatSlice reducer** (`src/store/chatSlice.test.ts`)
- Creating new chats with auto-generated titles
- Deleting chats and switching to next available chat
- Resetting state when last chat is removed
- Editing chat titles
- Sending messages (adding user/assistant messages, generating titles for empty chats)
- Successful message completion updates
- Handling failed messages (removing placeholder, storing error)

**Persistence** (`src/store/persistence.test.ts`)
- Saving chat state to localStorage
- Loading chat state from localStorage
- Handling invalid JSON gracefully
- Handling missing localStorage data
