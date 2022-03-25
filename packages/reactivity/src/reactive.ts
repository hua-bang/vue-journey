import { NonReturnFn } from './typings/common';
import { activeEffect } from './effect';

const proxyMap = new WeakMap<object, Map<string, Set<NonReturnFn>>>();

const getDepsFromProxyMap = (target: object, key: string) => {
  const depsMap = proxyMap.get(target) || new Map<string, Set<NonReturnFn>>();
  proxyMap.set(target, depsMap);        
  
  const deps = depsMap.get(key) || new Set<NonReturnFn>();
  depsMap.set(key, deps);
  
  return deps;
};

const track = (target: object, key: string, activeEffect: NonReturnFn | undefined) => {
  if (activeEffect) { 
    const deps = getDepsFromProxyMap(target, key);
    deps.add(activeEffect);
  }
};

const trigger = (target: object, key: string) => {
  const deps = getDepsFromProxyMap(target, key);
  deps.forEach(fn => fn());
};

const reactive = <T extends object>(target: T) => { 
  return new Proxy(target, {
    get(target: T, key: string) { 
      track(target, key, activeEffect);
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