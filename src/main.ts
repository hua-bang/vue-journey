import { parse, tokenize, traverseNode } from '../packages/index';

const templateStr = '<div><p>Vue</p><p>Template</p></div>';

const ast = parse(templateStr);

const transformAFn = ast => { 
  console.log(`${ast.type}, transform A Begin`);
  return () => { 
    console.log(`${ast.type}, transform A End`);
  };
};

const transformBFn = (ast) => { 
  console.log(`${ast.type}, transform B Begin`);
  return () => { 
    console.log(`${ast.type}, transform B End`);
  };
};

const context = {
  currentNode: ast,
  childrenIndex: 0,
  parent: null,
  nodeTransforms: [
    transformAFn,
    transformBFn
  ]
};

traverseNode(ast, context);



// const obj = reactive({ a: 1, b: 2 });

// const a = computed(() => obj.a + obj.b);

// (window as any).obj = obj;
// (window as any).a = a;

// effect(() => {
//   console.log(a.value);
// });
