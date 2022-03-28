import { reactive, effect } from '../packages/index';

const a = reactive({
  name: 'hug',
  age: 18,
  display: true
});

(window as any).a = a;

effect(() => {
  console.log('loader');
  document.body.innerText = a.display ? (a.name + a.age) : 'no data';
});
