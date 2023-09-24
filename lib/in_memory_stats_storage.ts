import { BannerStatsProvider, AppStatsProvider } from "./stats_provider"

export class InMemoryBannerStatsStorage implements BannerStatsProvider {
  data = new Map<string, number>();

  getNumber = async (key: string): Promise<number | undefined> => {
    return Promise.resolve(this.data.get(key));
  }

  async setNumber(key: string, value: number): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        this.data.set(key, value);
        resolve();
      });
    });
  }
}
