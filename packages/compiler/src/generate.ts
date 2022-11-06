import { JSAstNode } from './transform';

function genNodeList(nodes: JSAstNode[], context: Record<string, any>) { 
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) { 
    const node = nodes[i];
    genNode(node, context);
    if (i < nodes.length - 1) { 
      push(', ');
    }
  }
}

function genFunctionDecl(node: JSAstNode, context: Record<string, any>) { 
  const { push, indent, deIndent } = context;
  push(`function ${node.id.name}`);
  push('(');
  genNodeList(node.params, context);
  push(') ');
  push('{');
  indent();
  node.body?.forEach(n => genNode(n, context));
  deIndent();
  push('}');
}

function genArrayExpression(node: JSAstNode, context: Record<string, any>) { 
  const { push } = context;
  push('[');
  genNodeList(node.elements, context);
  push(']');
}

function genReturnStatement(node: JSAstNode, context: Record<string, any>) { 
  const { push } = context;
  push('return ');
  genNode(node.return, context);
}

function genCallExpression(node: JSAstNode, context: Record<string, any>) { 
  const { push } = context;
  const { callee, arguments: args } = node;
  push(`${callee.name}(`);
  genNodeList(args, context);
  push(')');
}

function genStringLiteral(node: JSAstNode, context: Record<string, any>) { 
  const { push } = context;
  push(`'${node.value}'`);
}

const generateNodeMap = {
  FunctionDecl: genFunctionDecl,
  ReturnStatement: genReturnStatement,
  CallExpression: genCallExpression,
  StringLiteral: genStringLiteral,
  ArrayExpression: genArrayExpression,
};

type GenerateNodeMapKey = keyof typeof generateNodeMap;

function genNode(node: JSAstNode, context: Record<string, any>) { 
  return generateNodeMap[node.type as GenerateNodeMapKey](node, context);
}

export function generate(node: JSAstNode) { 
  const context: Record<string, any> = {
    code: '',
    push(code: string) { 
      context.code += code;
    },
    currentIndent: 0,
    newLine() { 
      context.code += '\n' + '  '.repeat(context.currentIndent);
    },
    indent() { 
      context.currentIndent++;
      context.newLine();
    },
    deIndent() { 
      context.currentIndent--;
      context.newLine();
    }
  };

  genNode(node, context);

  return context.code;
}