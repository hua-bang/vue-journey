import { compile } from '../packages/index';

const templateStr = '<div><p>Vue</p><p>Template</p></div>';

const code = compile(templateStr);

console.log(code);

