export enum TestItemType {
  Home = 0,
  Map = 1,
  Eye = 2,
}

export interface TestItem {
  id: string;
  name: string;
  type: TestItemType;
}

export interface GetTestItemService {
  (): Promise<TestItem []>;
}

export const createGetTestItemService = (): GetTestItemService =>
  async (): Promise<TestItem []> => {
    const response = await fetch('api/v1/testitems');
    const parsed = await response.json();
    return Promise.resolve(parsed as TestItem []);
  };
