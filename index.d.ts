interface SetValueFunc {
  (): any;
  (): Promise<any>;
}

interface SetFunc {
  (key: string, value: SetValueFunc): Promise<void>;
  (key: string, value: any, expire?: number, options?: any): Promise<void>;
}

interface GetValueFunc {
  (): any;
}

interface GetFunc {
  (key: string): Promise<any>;
  (key: string, defaultValue: any): Promise<any>;
  (key: string, GetValueFunc, expire?: number, options?: any): Promise<any>;
}

interface Store {
  set: (key: string, value: any) => Promise<any>;
  get: (key: string) => Promise<void>;
  del: (key: string) => Promise<void>;
  has: (key: string) => Promise<boolean>;
}

declare module "egg" {
  export interface Application {
    cache: {
      set: SetFunc;
      get: GetFunc;
      del: (key: string) => Promise<void>;
      has: (key: string) => Promise<boolean>;
      store: (name: string, options?: object) => Store;
      reset: () => Promise<void>;
    };
  }
}
