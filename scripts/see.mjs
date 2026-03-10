import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { accessSync, constants as fsConstants } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'

const HOST = process.env.SEE_HOST ?? '127.0.0.1'
const PORT_START = Number(process.env.SEE_PORT ?? 5173)

const OUT_DIR = process.env.SEE_OUT_DIR ?? 'playwright-artifacts'
const WAIT_SELECTOR = process.env.SEE_WAIT_SELECTOR ?? '#root'
const COLOR_SCHEME = process.env.SEE_COLOR_SCHEME ?? 'light'
const BROWSER = process.env.SEE_BROWSER ?? 'chromium'

const DESKTOP_VIEWPORT = process.env.SEE_DESKTOP_VIEWPORT ?? '1280,720'
const MOBILE_VIEWPORT = process.env.SEE_MOBILE_VIEWPORT ?? '390,844'

const PLAYWRIGHT_BIN = process.env.PLAYWRIGHT_BIN ?? 'playwright'

function npmCmd() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm'
}

function spawnLogged(cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
  return child
}

async function findFreePort(host, startPort, maxTries = 50) {
  for (let i = 0; i < maxTries; i++) {
    const port = startPort + i
    const ok = await new Promise((resolve) => {
      const srv = net.createServer()
      srv.unref()
      srv.on('error', () => resolve(false))
      srv.listen({ host, port }, () => {
        srv.close(() => resolve(true))
      })
    })
    if (ok) return port
  }
  throw new Error(`Could not find a free port starting at ${startPort}`)
}

async function waitForHttp(url, timeoutMs) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
      if (res.ok) return
    } catch {
      // ignore until ready
    }
    await delay(250)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

async function run(cmd, args, opts = {}) {
  await new Promise((resolve, reject) => {
    const child = spawnLogged(cmd, args, opts)
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })
}

let devServer
try {
  await mkdir(OUT_DIR, { recursive: true })

  const port = await findFreePort(HOST, PORT_START)
  const url = process.env.SEE_URL ?? `http://${HOST}:${port}/`

  // When run under `npm run`, PATH prefers ./node_modules/.bin.
  // That is fine, but keep a clear error if PLAYWRIGHT_BIN is mis-set.
  try {
    accessSync(PLAYWRIGHT_BIN, fsConstants.X_OK)
  } catch {
    // Ignore: PLAYWRIGHT_BIN might be resolved via PATH.
  }

  devServer = spawnLogged(npmCmd(), [
    'run',
    'dev',
    '--',
    '--host',
    HOST,
    '--port',
    String(port),
    '--strictPort',
  ], { detached: process.platform !== 'win32' })

  await waitForHttp(url, 30_000)

  const desktopOut = path.join(OUT_DIR, 'desktop.png')
  const mobileOut = path.join(OUT_DIR, 'mobile.png')

  await run(PLAYWRIGHT_BIN, [
    'screenshot',
    '--full-page',
    '--wait-for-selector',
    WAIT_SELECTOR,
    '--color-scheme',
    COLOR_SCHEME,
    '--viewport-size',
    DESKTOP_VIEWPORT,
    '-b',
    BROWSER,
    url,
    desktopOut,
  ])

  await run(PLAYWRIGHT_BIN, [
    'screenshot',
    '--full-page',
    '--wait-for-selector',
    WAIT_SELECTOR,
    '--color-scheme',
    COLOR_SCHEME,
    '--viewport-size',
    MOBILE_VIEWPORT,
    '-b',
    BROWSER,
    url,
    mobileOut,
  ])

  console.log(`Wrote ${desktopOut}`)
  console.log(`Wrote ${mobileOut}`)
} finally {
  if (devServer && !devServer.killed) {
    if (process.platform !== 'win32' && devServer.pid) {
      // Detached => kill the whole process group so Vite doesn't linger.
      try {
        process.kill(-devServer.pid, 'SIGTERM')
      } catch {
        devServer.kill('SIGTERM')
      }
    } else {
      devServer.kill('SIGTERM')
    }
  }
}
