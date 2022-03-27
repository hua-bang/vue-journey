import { reactive, effect } from '../packages/reactivity/src/index';

const a = reactive({ name: 'hug', age: 18, hobbies: [ { text: '测试' } ] });

(window as any).a = a;

effect(() => {
  document.body.innerText = a.hobbies.map(item => item.text).join(',');
});
