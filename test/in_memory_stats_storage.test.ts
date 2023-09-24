import { InMemoryBannerStatsStorage } from '../lib/in_memory_stats_storage';

describe('InMemoryBannerStatsStorage', () => {
  let storage: InMemoryBannerStatsStorage

  beforeEach(() => {
    storage = new InMemoryBannerStatsStorage();
  });

  afterEach(() => {
    storage = null!;
  });

  it('should return undefined for non-existent keys', async () => {
    expect(await storage.getNumber('nonExistentKey')).toBeUndefined();
  });

  it('should set values asynchronously', async () => {
    await storage.setNumber('key1', 1);
    await storage.setNumber('key2', 2);

    // Ensure the values are eventually set by waiting for the next tick.
    await new Promise(setImmediate);

    expect(await storage.getNumber('key1')).toBe(1);
    expect(await storage.getNumber('key2')).toBe(2);
  });
});
