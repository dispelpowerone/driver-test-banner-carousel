import {GenericStatsManager} from 'stats/manager';
import {GenericStatsStorage} from 'stats/storage/generic';

// Mock the GenericStatsStorage class for testing
class MockStorage implements GenericStatsStorage {
  private data: {[key: string]: string} = {};

  async get(key: string): Promise<string | undefined> {
    return this.data[key];
  }

  async set(key: string, value: string): Promise<void> {
    this.data[key] = value;
  }
}

describe('GenericStatsManager', () => {
  let storage: GenericStatsStorage;
  let statsManager: GenericStatsManager;

  beforeEach(() => {
    storage = new MockStorage();
    statsManager = new GenericStatsManager(storage);
  });

  it('Logs session start when first session date is undefined', async () => {
    const timeBefore = Date.now();

    await statsManager.logSessionStart();

    const timeAfter = Date.now();

    const stats = await statsManager.getEngagementStats();
    expect(stats.firstSessionStartTimestamp).toBeGreaterThanOrEqual(timeBefore);
    expect(stats.firstSessionStartTimestamp).toBeLessThanOrEqual(timeAfter);

    // Second session start
    await statsManager.logSessionStart();

    const statsAfter = await statsManager.getEngagementStats();
    expect(statsAfter.firstSessionStartTimestamp).toEqual(
      stats.firstSessionStartTimestamp
    );
  });

  it('Logs session start and updates last session start date', async () => {
    // Set an initial value for the first session start date
    await storage.set(
      'engagement',
      '{"lastSessionStartTimestamp":123456789,"firstSessionStartTimestamp":1703095601552}'
    );

    const statsBefore = await statsManager.getEngagementStats();
    expect(statsBefore.lastSessionStartTimestamp).toEqual(123456789);

    await statsManager.logSessionStart();

    // Check if the last session start date is updated
    const statsAfter = await statsManager.getEngagementStats();
    expect(statsAfter.lastSessionStartTimestamp).not.toEqual('123456789');
  });

  it('Logs session end and updates last session end date', async () => {
    const timeBefore = Date.now();

    await statsManager.logSessionStart();

    const timeAfter = Date.now();

    const stats = await statsManager.getEngagementStats();
    expect(stats.firstSessionStartTimestamp).toBeGreaterThanOrEqual(timeBefore);
    expect(stats.firstSessionStartTimestamp).toBeLessThanOrEqual(timeAfter);
  });

  it('Logs component show', async () => {
    const timeBeforeShow1 = Date.now();

    await statsManager.logComponentShow('banner', '123');

    const statsShow1 = await statsManager.getComponentStats('banner', '123');
    expect(statsShow1.showsCount).toEqual(1);
    expect(statsShow1.lastShowTimestamp).toBeGreaterThanOrEqual(
      timeBeforeShow1
    );

    await new Promise(r => setTimeout(r, 1000));

    const timeBeforeShow2 = Date.now();

    await statsManager.logComponentShow('banner', '123');

    const statsShow2 = await statsManager.getComponentStats('banner', '123');
    expect(statsShow2.showsCount).toEqual(2);
    expect(statsShow2.lastShowTimestamp).toBeGreaterThan(
      statsShow1.lastShowTimestamp || 0
    );
    expect(statsShow2.lastShowTimestamp).toBeGreaterThanOrEqual(
      timeBeforeShow2
    );
  });

  it('Logs component click', async () => {
    const timeBeforeClick1 = Date.now();

    await statsManager.logComponentClick('banner', '123');

    const statsClick1 = await statsManager.getComponentStats('banner', '123');
    expect(statsClick1.clicksCount).toEqual(1);
    expect(statsClick1.lastClickTimestamp).toBeGreaterThanOrEqual(
      timeBeforeClick1
    );

    await new Promise(r => setTimeout(r, 1000));

    const timeBeforeClick2 = Date.now();

    await statsManager.logComponentClick('banner', '123');

    const statsClick2 = await statsManager.getComponentStats('banner', '123');
    expect(statsClick2.clicksCount).toEqual(2);
    expect(statsClick2.lastClickTimestamp).toBeGreaterThan(
      statsClick1.lastClickTimestamp || 0
    );
    expect(statsClick2.lastClickTimestamp).toBeGreaterThanOrEqual(
      timeBeforeClick2
    );
  });
});
