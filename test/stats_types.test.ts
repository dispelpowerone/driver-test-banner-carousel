import { StatsNumber } from "../lib/stats_types";
import { InMemoryBannerStatsStorage } from "../lib/in_memory_stats_storage";

describe('StatsNumber', () => {
  let statsProvider: InMemoryBannerStatsStorage;
  let statsNumber: StatsNumber;

  beforeEach(() => {
    statsProvider = new InMemoryBannerStatsStorage();
    statsNumber = new StatsNumber(statsProvider, 'test_stat');
  });

  it('should initialize with initializer result', async () => {
    await statsNumber.initialize(() => 42);
    expect(statsNumber.get()).toBe(42);
    expect(await statsProvider.getNumber('test_stat')).toBe(42);
  });

  it('should set and get a value', async () => {
    await statsNumber.initialize(() => 42);
    statsNumber.set(100);
    expect(statsNumber.get()).toBe(100);

    // Ensure the values are eventually set by waiting for the next tick.
    await new Promise(setImmediate);
    expect(await statsProvider.getNumber('test_stat')).toBe(100);
  });

  it('should tick a value', async () => {
    await statsNumber.initialize(() => 42);
    statsNumber.tick(10);
    expect(statsNumber.get()).toBe(52);

    // Ensure the values are eventually set by waiting for the next tick.
    await new Promise(setImmediate);
    expect(await statsProvider.getNumber('test_stat')).toBe(52);
  });

  it('should handle initialization with an existing value', async () => {
    await statsProvider.setNumber('test_stat', 42);
    await statsNumber.initialize(() => 10);
    expect(statsNumber.get()).toBe(42);
  });
});
