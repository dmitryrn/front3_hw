export class StreamControl {
  private abortController: AbortController | null = null

  start(): AbortController {
    this.abortController = new AbortController()
    return this.abortController
  }

  stop(): void {
    this.abortController?.abort()
    this.abortController = null
  }

  clear(): void {
    this.abortController = null
  }
}

export const streamControl = new StreamControl()
