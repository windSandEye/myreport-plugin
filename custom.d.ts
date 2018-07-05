interface FreeObject {
  [propsName: string]: any;
}

interface PromiseState {
  rejected: boolean;
  fulfilled: boolean;
  settled: boolean;
  value: any;
  reason: any;
}

interface SourceState {
  loading: boolean;
  error: any;
  source: any;
}

interface SourceProps {
  promise: PromiseState;
  engine: Engine;
  fetch: (opt: FreeObject, override?: boolean, key?: string) => void;
}

interface Engine {
  deploy: (FreeObject, realtime: boolean) => void;
  initial: FreeObject,
}

interface FieldProps {
  name: string;
  value: any;
  onChange: (e: any) => void;
}
