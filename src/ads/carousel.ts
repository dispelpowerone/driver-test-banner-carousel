import {EngagementStats, ComponentStats, StatsManager} from 'stats/types';

export interface BannerPolicy {
  readonly maxShowsCount?: number;
  readonly maxClicksCount?: number;
  readonly minRepeatInterval?: number;
}

export interface Banner {
  readonly id: string;
  readonly policy: BannerPolicy;
}

export class BannersCarousel {
  banners: Banner[] = [];
  statsManager: StatsManager | undefined;
  engagementStats: EngagementStats | undefined;

  async initialize(
    statsManager: StatsManager,
    banners: Banner[]
  ): Promise<void> {
    this.banners = banners;
    this.statsManager = statsManager;
    this.engagementStats = await statsManager.getEngagementStats();
  }

  async getNext(): Promise<Banner | undefined> {
    const bannerStatsPromises = this.banners.map(banner =>
      this.statsManager!.getComponentStats('banner', `${banner.id}`)
    );
    const bannerStats = await Promise.all(bannerStatsPromises);
    const timestamp = Date.now();
    const passedBanners: Banner[] = [];
    bannerStats.forEach((stats, i) => {
      const banner = this.banners[i];
      if (this.checkBanner(banner.policy, stats, timestamp)) {
        passedBanners.push(banner);
      }
    });
    return passedBanners.shift();
  }

  private checkBanner(
    bannerPolicy: BannerPolicy,
    bannerStats: ComponentStats,
    timestamp: number
  ): boolean {
    if (
      this.checkStrictGreater(
        bannerStats.showsCount,
        bannerPolicy.maxShowsCount
      ) ||
      this.checkStrictGreater(
        bannerStats.clicksCount,
        bannerPolicy.maxClicksCount
      ) ||
      this.checkStrictGreater(
        bannerPolicy.minRepeatInterval,
        timestamp - (bannerStats.lastShowTimestamp || 0)
      )
    ) {
      return false;
    }
    return true;
  }

  private checkStrictGreater(a: number | undefined, b: number | undefined) {
    return a !== undefined && b !== undefined && a > b;
  }
}
