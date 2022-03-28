import { NonReturnFn } from './typings/common';

type EffectFnType = NonReturnFn & {
  deps: Array<Set<NonReturnFn>>;
};

export let activeEffect: EffectFnType | undefined;

function cleanup(effectFn: EffectFnType) { 
  for (let i = 0; i < effectFn.deps.length; i++) { 
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

export function effect(fn: NonReturnFn): void {
  const effectFn: EffectFnType = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    fn();
    activeEffect = undefined;
  };
  effectFn.deps = [];
  effectFn();
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
    activeEffect.deps.push(deps);
  }
};

export const trigger = (target: object, key: string) => {
  const deps = getDepsFromProxyMap(target, key);
  const effectsToRun = new Set(deps);
  effectsToRun.forEach(effectFn => effectFn());
};