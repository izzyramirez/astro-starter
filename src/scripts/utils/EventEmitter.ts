type Callback = (...args: unknown[]) => unknown;

interface CallbackStore {
  [namespace: string]: {
    [event: string]: Callback[];
  };
}

interface ResolvedName {
  original: string;
  value: string;
  namespace: string;
}

export default class EventEmitter {
  callbacks: CallbackStore;

  constructor() {
    this.callbacks = { base: {} };
  }

  on(_names: string, callback: Callback): this | false {
    if (!_names) { console.warn('wrong names'); return false; }
    if (!callback) { console.warn('wrong callback'); return false; }

    this.resolveNames(_names).forEach((_name) => {
      const name = this.resolveName(_name);
      if (!(this.callbacks[name.namespace] instanceof Object)) this.callbacks[name.namespace] = {};
      if (!Array.isArray(this.callbacks[name.namespace][name.value])) this.callbacks[name.namespace][name.value] = [];
      this.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string): this | false {
    if (!_names) { console.warn('wrong name'); return false; }

    this.resolveNames(_names).forEach((_name) => {
      const name = this.resolveName(_name);

      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace];
      } else if (name.namespace === 'base') {
        for (const ns in this.callbacks) {
          if (Array.isArray(this.callbacks[ns]?.[name.value])) {
            delete this.callbacks[ns][name.value];
            if (!Object.keys(this.callbacks[ns]).length) delete this.callbacks[ns];
          }
        }
      } else if (Array.isArray(this.callbacks[name.namespace]?.[name.value])) {
        delete this.callbacks[name.namespace][name.value];
        if (!Object.keys(this.callbacks[name.namespace]).length) delete this.callbacks[name.namespace];
      }
    });

    return this;
  }

  trigger(_name: string, _args?: unknown[]): unknown {
    if (!_name) { console.warn('wrong name'); return false; }

    const args = Array.isArray(_args) ? _args : [];
    const name = this.resolveName(this.resolveNames(_name)[0]);
    let finalResult: unknown = null;

    if (name.namespace === 'base') {
      for (const ns in this.callbacks) {
        if (Array.isArray(this.callbacks[ns]?.[name.value])) {
          this.callbacks[ns][name.value].forEach((cb) => {
            const result = cb.apply(this, args);
            if (finalResult === null) finalResult = result;
          });
        }
      }
    } else if (this.callbacks[name.namespace] instanceof Object) {
      if (!name.value) { console.warn('wrong name'); return this; }
      this.callbacks[name.namespace][name.value]?.forEach((cb) => {
        const result = cb.apply(this, args);
        if (finalResult === null) finalResult = result;
      });
    }

    return finalResult;
  }

  private resolveNames(_names: string): string[] {
    return _names
      .replace(/[^a-zA-Z0-9 ,/.]/g, '')
      .replace(/[,/]+/g, ' ')
      .split(' ')
      .filter(Boolean);
  }

  private resolveName(name: string): ResolvedName {
    const parts = name.split('.');
    return {
      original: name,
      value: parts[0],
      namespace: parts[1] ?? 'base',
    };
  }
}
