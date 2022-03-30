import { reactive, effect } from '../../../packages/index';

const obj = reactive({ foo: true, bar: true });

(window as any).obj = obj;

let temp1, temp2;

effect(() => {
  console.log('effectFn1 执行');

  effect(() => {
    console.log('effectFn2 执行');
    temp2 = obj.bar;
  });

  temp1 = obj.foo;
});