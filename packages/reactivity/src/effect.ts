import { NonReturnFn } from './typings/common';

export let activeEffect: NonReturnFn | undefined;

export function effect(fn: NonReturnFn): void {
  activeEffect = fn;
  activeEffect();
  activeEffect = undefined;
}