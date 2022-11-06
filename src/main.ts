import { parse, tokenize, transform } from '../packages/index';

const templateStr = '<div><p>Vue</p><p>Template</p></div>';

const ast = parse(templateStr);

// console.log(ast);

transform(ast);

console.log(ast.jsNode);



// const obj = reactive({ a: 1, b: 2 });

// const a = computed(() => obj.a + obj.b);

// (window as any).obj = obj;
// (window as any).a = a;

// effect(() => {
//   console.log(a.value);
// });
