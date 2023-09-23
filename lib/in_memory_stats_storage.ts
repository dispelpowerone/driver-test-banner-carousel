import { BannerStatsProvider, AppStatsProvider } from "./stats_provider"

export class InMemoryBannerStatsStorage implements BannerStatsProvider {
  data = new Map<string, string>();

  async get(key: string): Promise<string | undefined> {
    return Promise.resolve(this.data.get(key));
  }

  async set(key: string, value: string): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        this.data.set(key, value);
        resolve();
      });
    });
  }
}
