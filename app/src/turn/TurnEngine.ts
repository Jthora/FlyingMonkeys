/**
 * Turn engine: manages 4-second timing loop for Live Stack gameplay.
 * Handles tick callbacks, pause/resume, and AutoSlack detection.
 */

/** Standard turn duration in milliseconds */
export const TURN_DURATION_MS = 4000;

/** Warning threshold in seconds (when to flash "Never say OK") */
export const WARNING_THRESHOLD_S = 3.0;

/** Tick frequency in milliseconds (update UI every 50ms for smooth animation) */
const TICK_INTERVAL_MS = 50;

/**
 * Callback invoked on each tick with elapsed time.
 * @param elapsed - Time elapsed in seconds since turn started
 * @param isWarning - True if past warning threshold
 */
export type TickCallback = (elapsed: number, isWarning: boolean) => void;

/**
 * Callback invoked when turn expires (AutoSlack condition).
 */
export type ExpireCallback = () => void;

/**
 * Turn engine state.
 */
type EngineState = 'idle' | 'running' | 'paused' | 'expired';

/**
 * TurnEngine: precise interval-based timer for 4-second gameplay loop.
 */
export class TurnEngine {
  private state: EngineState = 'idle';
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private pausedElapsed: number = 0;
  private durationMs: number = TURN_DURATION_MS;

  private tickCallback: TickCallback | null = null;
  private expireCallback: ExpireCallback | null = null;

  /**
   * Starts the turn timer.
   * @param durationMs - Optional custom duration (defaults to 4000ms)
   */
  start(durationMs: number = TURN_DURATION_MS): void {
    if (this.state === 'running') {
      return; // Already running
    }

    this.durationMs = durationMs;
    this.startTime = Date.now();
    this.pausedElapsed = 0;
    this.state = 'running';

    this.intervalId = setInterval(() => {
      this.tick();
    }, TICK_INTERVAL_MS);
  }

  /**
   * Pauses the turn timer (only works in practice mode).
   */
  pause(): void {
    if (this.state !== 'running') {
      return;
    }

    this.pausedElapsed = this.getElapsed();
    this.state = 'paused';

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resumes the turn timer from paused state.
   */
  resume(): void {
    if (this.state !== 'paused') {
      return;
    }

    this.startTime = Date.now() - this.pausedElapsed * 1000;
    this.state = 'running';

    this.intervalId = setInterval(() => {
      this.tick();
    }, TICK_INTERVAL_MS);
  }

  /**
   * Resets the turn timer to start a new turn.
   */
  reset(): void {
    this.stop();
    this.start(this.durationMs);
  }

  /**
   * Stops the turn timer completely.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state = 'idle';
    this.pausedElapsed = 0;
  }

  /**
   * Registers a callback invoked on each tick.
   */
  onTick(callback: TickCallback): void {
    this.tickCallback = callback;
  }

  /**
   * Registers a callback invoked when turn expires.
   */
  onExpire(callback: ExpireCallback): void {
    this.expireCallback = callback;
  }

  /**
   * Gets current elapsed time in seconds.
   */
  getElapsed(): number {
    if (this.state === 'idle') {
      return 0;
    }
    if (this.state === 'paused') {
      return this.pausedElapsed;
    }
    if (this.state === 'expired') {
      return this.durationMs / 1000;
    }

    const now = Date.now();
    const elapsedMs = now - this.startTime;
    return Math.min(elapsedMs / 1000, this.durationMs / 1000);
  }

  /**
   * Gets remaining time in seconds.
   */
  getRemaining(): number {
    const duration = this.durationMs / 1000;
    return Math.max(0, duration - this.getElapsed());
  }

  /**
   * Returns current state.
   */
  getState(): EngineState {
    return this.state;
  }

  /**
   * Internal tick handler.
   */
  private tick(): void {
    const elapsed = this.getElapsed();
    const duration = this.durationMs / 1000;

    // Check for expiration
    if (elapsed >= duration) {
      this.state = 'expired';
      this.stop();

      if (this.expireCallback) {
        this.expireCallback();
      }
      return;
    }

    // Check for warning threshold
    const isWarning = elapsed >= WARNING_THRESHOLD_S;

    // Invoke tick callback
    if (this.tickCallback) {
      this.tickCallback(elapsed, isWarning);
    }
  }

  /**
   * Cleans up resources.
   */
  destroy(): void {
    this.stop();
    this.tickCallback = null;
    this.expireCallback = null;
  }
}
