import { reactive, effect } from '../../../packages/index';

const obj = reactive({ a: 1 });

(window as any).obj = obj;

effect(() => {
  // obj.a++;
  console.log(obj.a++);
});