
export interface BannerStatsProvider {
  readonly getNumber: (key: string) => Promise<number | undefined>
  readonly setNumber: (key: string, value: number) => Promise<void>
}

export interface AppStatsProvider {
  readonly getFirstSessionTime?: () => Promise<Date>
  readonly getSessionStartTime?: () => Promise<Date>
}
