/**
 * Integration tests for TurnEngine timing accuracy.
 * Tests 4-second loop, tick callbacks, pause/resume, and AutoSlack detection.
 *
 * @jest-environment node
 */

import {TurnEngine, TURN_DURATION_MS, WARNING_THRESHOLD_S} from '@/turn/TurnEngine';

describe('TurnEngine Integration Tests', () => {
  let engine: TurnEngine;

  beforeEach(() => {
    engine = new TurnEngine();
    jest.useFakeTimers();
  });

  afterEach(() => {
    engine.destroy();
    jest.useRealTimers();
  });

  describe('Timer Initialization', () => {
    it('should start with idle state', () => {
      expect(engine.getState()).toBe('idle');
      expect(engine.getElapsed()).toBe(0);
    });

    it('should transition to running when started', () => {
      engine.start();
      expect(engine.getState()).toBe('running');
    });
  });

  describe('Timer Accuracy', () => {
    it('should complete 4-second turn accurately', () => {
      const expireCallback = jest.fn();
      engine.onExpire(expireCallback);
      
      engine.start();
      
      // Advance time by 4 seconds
      jest.advanceTimersByTime(TURN_DURATION_MS);
      
      expect(expireCallback).toHaveBeenCalled();
      expect(engine.getState()).toBe('idle');
    });

    it('should emit tick callbacks every 50ms', () => {
      const tickCallback = jest.fn();
      engine.onTick(tickCallback);
      
      engine.start();
      
      // Advance by 200ms (should trigger 4 ticks)
      jest.advanceTimersByTime(200);
      
      expect(tickCallback).toHaveBeenCalledTimes(4);
    });

    it('should report accurate elapsed time', () => {
      engine.start();
      
      jest.advanceTimersByTime(2000); // 2 seconds
      
      const elapsed = engine.getElapsed();
      expect(elapsed).toBeCloseTo(2.0, 1);
    });

    it('should report accurate remaining time', () => {
      engine.start();
      
      jest.advanceTimersByTime(1500); // 1.5 seconds
      
      const remaining = engine.getRemaining();
      expect(remaining).toBeCloseTo(2.5, 1);
    });
  });

  describe('Warning Threshold', () => {
    it('should trigger warning at 3 seconds', () => {
      const tickCallback = jest.fn();
      engine.onTick(tickCallback);
      
      engine.start();
      
      // Advance to just before warning threshold
      jest.advanceTimersByTime(2900);
      expect(tickCallback).toHaveBeenLastCalledWith(
        expect.any(Number),
        false, // Not warning yet
      );
      
      // Advance past warning threshold
      jest.advanceTimersByTime(150);
      expect(tickCallback).toHaveBeenLastCalledWith(
        expect.any(Number),
        true, // Warning active
      );
    });
  });

  describe('Pause and Resume', () => {
    it('should pause timer', () => {
      engine.start();
      jest.advanceTimersByTime(1000);
      
      engine.pause();
      expect(engine.getState()).toBe('paused');
      
      const elapsedAtPause = engine.getElapsed();
      
      // Advance time while paused
      jest.advanceTimersByTime(1000);
      
      // Elapsed should not change
      expect(engine.getElapsed()).toBeCloseTo(elapsedAtPause, 1);
    });

    it('should resume from paused state', () => {
      engine.start();
      jest.advanceTimersByTime(1000);
      
      engine.pause();
      const elapsedAtPause = engine.getElapsed();
      
      engine.resume();
      expect(engine.getState()).toBe('running');
      
      jest.advanceTimersByTime(500);
      
      expect(engine.getElapsed()).toBeCloseTo(elapsedAtPause + 0.5, 1);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset timer to start new turn', () => {
      engine.start();
      jest.advanceTimersByTime(2000);
      
      engine.reset();
      
      expect(engine.getState()).toBe('running');
      expect(engine.getElapsed()).toBeLessThan(0.1);
    });
  });

  describe('AutoSlack Detection', () => {
    it('should expire when turn completes', () => {
      const expireCallback = jest.fn();
      engine.onExpire(expireCallback);
      
      engine.start();
      jest.advanceTimersByTime(TURN_DURATION_MS + 100);
      
      expect(expireCallback).toHaveBeenCalled();
      expect(engine.getState()).toBe('idle');
    });

    it('should not tick after expiration', () => {
      const tickCallback = jest.fn();
      engine.onTick(tickCallback);
      
      engine.start();
      
      const ticksBeforeExpire = tickCallback.mock.calls.length;
      jest.advanceTimersByTime(TURN_DURATION_MS);
      
      const ticksAfterExpire = tickCallback.mock.calls.length;
      
      // Should have stopped ticking
      jest.advanceTimersByTime(1000);
      expect(tickCallback).toHaveBeenCalledTimes(ticksAfterExpire);
    });
  });

  describe('Multiple Turns', () => {
    it('should handle multiple consecutive turns', () => {
      const expireCallback = jest.fn();
      engine.onExpire(expireCallback);
      
      // First turn
      engine.start();
      jest.advanceTimersByTime(TURN_DURATION_MS);
      
      // Second turn
      engine.start();
      jest.advanceTimersByTime(TURN_DURATION_MS);
      
      // Third turn
      engine.start();
      jest.advanceTimersByTime(TURN_DURATION_MS);
      
      expect(expireCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('Resource Cleanup', () => {
    it('should clean up timers on destroy', () => {
      engine.start();
      engine.destroy();
      
      expect(engine.getState()).toBe('idle');
    });
  });
});
