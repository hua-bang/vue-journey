import { NonReturnFn } from './typings/common';

export let activeEffect: NonReturnFn | undefined;

export function effect(fn: NonReturnFn): void {
  activeEffect = fn;
  activeEffect();
  activeEffect = undefined;
}

const proxyMap = new WeakMap<object, Map<string, Set<NonReturnFn>>>();

const getDepsFromProxyMap = (target: object, key: string) => {
  const depsMap = proxyMap.get(target) || new Map<string, Set<NonReturnFn>>();
  proxyMap.set(target, depsMap);        
  
  const deps = depsMap.get(key) || new Set<NonReturnFn>();
  depsMap.set(key, deps);
  
  return deps;
};

export const track = (target: object, key: string) => {
  if (activeEffect) { 
    const deps = getDepsFromProxyMap(target, key);
    deps.add(activeEffect);
  }
};

export const trigger = (target: object, key: string) => {
  const deps = getDepsFromProxyMap(target, key);
  deps.forEach(fn => fn());
};