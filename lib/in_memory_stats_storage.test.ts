import { InMemoryBannerStatsStorage } from './in_memory_stats_storage';

describe('InMemoryBannerStatsStorage', () => {
  let storage: InMemoryBannerStatsStorage

  beforeEach(() => {
    storage = new InMemoryBannerStatsStorage();
  });

  afterEach(() => {
    storage = null!;
  });

  it('should set and get values', async () => {
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');

    const value1 = await storage.get('key1');
    const value2 = await storage.get('key2');

    expect(value1).toBe('value1');
    expect(value2).toBe('value2');
  });

  it('should return undefined for non-existent keys', async () => {
    const value = await storage.get('nonExistentKey');
    expect(value).toBeUndefined();
  });

  it('should set values asynchronously', async () => {
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');

    // Ensure the values are eventually set by waiting for the next tick.
    await new Promise((resolve) => setImmediate(resolve));

    const value1 = storage.data.get('key1');
    const value2 = storage.data.get('key2');

    expect(value1).toBe('value1');
    expect(value2).toBe('value2');
  });
});
