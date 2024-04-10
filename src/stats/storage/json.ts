import {GenericStatsStorage} from './generic';

export class JSONStorage {
  readonly storage: GenericStatsStorage;

  constructor(storage: GenericStatsStorage) {
    this.storage = storage;
  }

  async get<Data>(recordName: string): Promise<Data> {
    let data = await this.storage.get(recordName);
    if (!data) {
      data = '{}';
    }
    return JSON.parse(data);
  }

  async set<Data>(recordName: string, data: Data): Promise<void> {
    await this.storage.set(recordName, JSON.stringify(data));
  }

  async update<Data>(
    recordName: string,
    updater: (data: Data) => void
  ): Promise<void> {
    const data = await this.get<Data>(recordName);
    updater(data);
    return this.set(recordName, data);
  }
}
