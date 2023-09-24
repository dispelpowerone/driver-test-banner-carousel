import { BannerStatsProvider } from "./stats_provider"

export type StatsNumberInit = () => number;

export class StatsNumber {
  statsProvider: BannerStatsProvider
  name: string
  value: number | undefined

  constructor(statsProvider: BannerStatsProvider, name: string) {
    this.statsProvider = statsProvider;
    this.name = name;
  }

  async initialize(init: StatsNumberInit) {
    this.value = await this.statsProvider.getNumber(this.name);
    if (this.value === undefined) {
      this.value = init();
      await this.statsProvider.setNumber(this.name, this.value);
    }
  }

  get(): number | undefined {
    return this.value;
  }

  set(value: number): void {
    this.value = value;
    this.statsProvider.setNumber(this.name, this.value).catch(() => {});
  }

  tick(value: number = 1): void {
    this.value = this.value! + value;
    this.statsProvider.setNumber(this.name, this.value).catch(() => {});
  }
}
