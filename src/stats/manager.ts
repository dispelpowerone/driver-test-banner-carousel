import {StatsManager, EngagementStats, ComponentStats} from './types';
import {GenericStatsStorage} from './storage/generic';

class JSONRecordAccessor<Interface> {
  constructor(readonly storage: GenericStatsStorage) {
    this.storage = storage;
  }

  async get(name: string): Promise<Interface> {
    return JSON.parse((await this.storage.get(name)) || '{}');
  }

  async update(name: string, modify: (data: Interface) => void): Promise<void> {
    const data = await this.get(name);
    modify(data);
    return this.storage.set(name, JSON.stringify(data));
  }
}

export class GenericStatsManager implements StatsManager {
  readonly engagementStats: JSONRecordAccessor<EngagementStats>;
  readonly componentStats: JSONRecordAccessor<ComponentStats>;

  constructor(storage: GenericStatsStorage) {
    this.engagementStats = new JSONRecordAccessor<EngagementStats>(storage);
    this.componentStats = new JSONRecordAccessor<ComponentStats>(storage);
  }

  async logSessionStart(): Promise<void> {
    return this.engagementStats.update('engagement', data => {
      data.lastSessionStartTimestamp = data.sessionStartTimestamp;
      data.sessionStartTimestamp = this.getTimestamp();
      if (data.firstSessionStartTimestamp === undefined) {
        data.firstSessionStartTimestamp = data.sessionStartTimestamp;
      }
    });
  }

  async logSessionEnd(): Promise<void> {
    return this.engagementStats.update('engagement', data => {
      data.lastSessionEndTimestamp = this.getTimestamp();
    });
  }

  async logComponentShow(category: string, componentId: string): Promise<void> {
    return this.componentStats.update(`${category}.${componentId}`, data => {
      data.showsCount = (data.showsCount || 0) + 1;
      data.lastShowTimestamp = this.getTimestamp();
    });
  }

  async logComponentClick(
    category: string,
    componentId: string
  ): Promise<void> {
    return this.componentStats.update(`${category}.${componentId}`, data => {
      data.clicksCount = (data.clicksCount || 0) + 1;
      data.lastClickTimestamp = this.getTimestamp();
    });
  }

  async getEngagementStats(): Promise<EngagementStats> {
    return this.engagementStats.get('engagement');
  }

  async getComponentStats(
    category: string,
    componentId: string
  ): Promise<ComponentStats> {
    return this.componentStats.get(`${category}.${componentId}`);
  }

  private getTimestamp(): number {
    return Date.now();
  }
}
