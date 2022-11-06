import { generate } from './generate';
import { parse } from './parse';
import { transform } from './transform';

export { parse, tokenize } from './parse';
export { traverseNode } from './traverse';
export { transform } from './transform';
export { generate } from './generate';

export function compile(str: string) { 
  const ast = parse(str);
  transform(ast);
  return generate(ast.jsNode);
}
