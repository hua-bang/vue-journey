import { tokenize } from '../packages/index';

const templateStr = '<p>Vue</p>';
console.log(tokenize(templateStr));

// const obj = reactive({ a: 1, b: 2 });

// const a = computed(() => obj.a + obj.b);

// (window as any).obj = obj;
// (window as any).a = a;

// effect(() => {
//   console.log(a.value);
// });
