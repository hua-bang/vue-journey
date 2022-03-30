import { NonReturnFn } from './typings/common';

type EffectFnType = NonReturnFn & {
  deps: Array<Set<EffectFnType>>;
  options?: EffectOptions;
};

interface EffectOptions { 
  scheduler?: (fn: EffectFnType) => void;
  lazy?: boolean;
}

export let activeEffect: EffectFnType | undefined;

const effectStack: EffectFnType[] = [];

function cleanup(effectFn: EffectFnType) { 
  for (let i = 0; i < effectFn.deps.length; i++) { 
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  effectFn.deps.length = 0;
}

export function effect(fn: NonReturnFn, options?: EffectOptions): EffectFnType {
  const effectFn: EffectFnType = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(activeEffect);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  if (!options?.lazy) { 
    effectFn();
  }

  return effectFn;
}

const proxyMap = new WeakMap<object, Map<string, Set<EffectFnType>>>();

const getDepsFromProxyMap = (target: object, key: string) => {
  const depsMap = proxyMap.get(target) || new Map<string, Set<EffectFnType>>();
  proxyMap.set(target, depsMap);        
  
  const deps = depsMap.get(key) || new Set<EffectFnType>();
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
  const effectsToRun = new Set<EffectFnType>();
  deps.forEach(effectFn => {
    if (effectFn !== activeEffect) { 
      effectsToRun.add(effectFn);
    }
  });
  effectsToRun.forEach(effectFn => { 
    if (effectFn.options && effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else { 
      effectFn();
    }
  });
};