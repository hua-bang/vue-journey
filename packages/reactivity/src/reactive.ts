import { track, trigger } from './effect';

const reactive = <T extends object>(target: T) => { 
  return new Proxy(target, {
    get(target: T, key: string) { 
      track(target, key);
      return Reflect.get(target, key);
    },
    set(target: T, key:  string, val: any) { 
      const value = Reflect.set(target, key, val);
      trigger(target, key);
      return value;
    }
  });
};

export default reactive;