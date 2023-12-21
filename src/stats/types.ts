export interface EngagementStats {
  firstSessionStartTimestamp?: number;
  lastSessionStartTimestamp?: number;
  lastSessionEndTimestamp?: number;
  sessionStartTimestamp?: number;
  sessionsCount?: number;
}

export interface ComponentStats {
  showsCount?: number;
  clicksCount?: number;
  lastShowTimestamp?: number;
  lastClickTimestamp?: number;
}

export interface StatsManager {
  logSessionStart(): Promise<void>;
  logSessionEnd(): Promise<void>;
  logComponentShow(category: string, componentId: string): Promise<void>;
  logComponentClick(category: string, componentId: string): Promise<void>;
  getEngagementStats(): Promise<EngagementStats>;
  getComponentStats(
    category: string,
    componentId: string
  ): Promise<ComponentStats>;
}
