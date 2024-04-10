import {StatsManager, EngagementStats, ComponentStats} from './types';
import {GenericStatsStorage} from './storage/generic';
import {JSONStorage} from './storage/json';

export class GenericStatsManager implements StatsManager {
  readonly storage: JSONStorage;

  constructor(storage: GenericStatsStorage) {
    this.storage = new JSONStorage(storage);
  }

  async logSessionStart(): Promise<void> {
    return this.storage.update('engagement', (data: EngagementStats) => {
      data.lastSessionStartTimestamp = data.sessionStartTimestamp;
      data.sessionStartTimestamp = this.getTimestamp();
      if (data.firstSessionStartTimestamp === undefined) {
        data.firstSessionStartTimestamp = data.sessionStartTimestamp;
      }
    });
  }

  async logSessionEnd(): Promise<void> {
    return this.storage.update('engagement', (data: EngagementStats) => {
      data.lastSessionEndTimestamp = this.getTimestamp();
    });
  }

  async logComponentShow(category: string, componentId: string): Promise<void> {
    return this.storage.update(
      `${category}.${componentId}`,
      (data: ComponentStats) => {
        data.showsCount = (data.showsCount || 0) + 1;
        data.lastShowTimestamp = this.getTimestamp();
      }
    );
  }

  async logComponentClick(
    category: string,
    componentId: string
  ): Promise<void> {
    return this.storage.update(
      `${category}.${componentId}`,
      (data: ComponentStats) => {
        data.clicksCount = (data.clicksCount || 0) + 1;
        data.lastClickTimestamp = this.getTimestamp();
      }
    );
  }

  async getEngagementStats(): Promise<EngagementStats> {
    return this.storage.get<EngagementStats>('engagement');
  }

  async getComponentStats(
    category: string,
    componentId: string
  ): Promise<ComponentStats> {
    return this.storage.get<ComponentStats>(`${category}.${componentId}`);
  }

  private getTimestamp(): number {
    return Date.now();
  }
}
