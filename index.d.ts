interface LruOpts {
  max: number;
  maxAge: number;
  dispose: string;
  length: number;
  stale: string;
}

interface Store {
  set: (key: string, value: any, expire?: number, options?: object) => void;
  get: (key: string) => any;
  del: (key: string) => void;
  has: (key: string) => boolean;
}

declare module "egg" {
  export interface Application {
    cache: {
      set: (
        key: string,
        value: any,
        expire?: number,
        options?: LruOpts
      ) => void;
      get: (key: string) => any;
      del: (key: string) => void;
      has: (key: string) => boolean;
      store: (name: string, options?: object) => Store;
      reset: () => void;
    };
  }
}
