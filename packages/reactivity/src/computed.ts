import { effect, track, trigger } from './effect';

interface ComputedValue { 
  value: any;
}

export function computed(getter: () => any): ComputedValue { 
  let value: any;

  let dirty: boolean = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true;
      trigger(obj, 'value');
    }
  });

  const obj = {
    get value() {
      if (dirty) { 
        value = effectFn();
        dirty = false;
      }
      track(obj, 'value');
      return value;
    }
  };

  return obj;
}