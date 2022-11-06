import { TemplateAstNode } from './parse';
import { traverseNode } from './traverse';
// Template AST -> JS AST

export interface JSAstNode { 
  type: string;
  body?: JSAstNode[];
  [key: string]: any;
}

interface JSAstTextNode extends JSAstNode { 
  value: string;
}

interface JSAstIdentifierNode extends JSAstNode { 
  name: string;
}

interface JSAstArrayExpressionNode<T = any> extends JSAstNode { 
  elements: Array<T>;
}

interface JSAstCallExpressionNode extends JSAstNode { 
  callee: JSAstIdentifierNode;
  arguments: Array<any>;
}

function createStringLiteral(value: string): JSAstTextNode { 
  // debugger;
  return {
    type: 'StringLiteral',
    value
  };
}

function createIdentifier(name: string): JSAstIdentifierNode { 
  return {
    type: 'Identifier',
    name
  };
}

function createArrayExpression(elements: Array<any>): JSAstArrayExpressionNode { 
  return {
    type: 'ArrayExpression',
    elements
  };
}

function createCallExpression(callee: string, args: Array<any>): JSAstCallExpressionNode { 
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments: args,
  };
}


function transformText(node: TemplateAstNode) { 
  if (node.type !== 'Text') { 
    return;
  }
  node.jsNode = createStringLiteral(node.content);
}

function transformElement(node: TemplateAstNode) { 
  return () => {
    if (node.type !== 'Element') {
      return;
    }

    const callExp = createCallExpression('h', [
      createStringLiteral(node.tag)
    ]);

    node.children?.length === 1
      ? callExp.arguments.push(node.children[0].jsNode)
      : callExp.arguments.push(
        createArrayExpression(node.children?.map(child => child.jsNode) as any[])
      );
  
    node.jsNode = callExp;
  };
}

function transformRoot(node: TemplateAstNode) { 
  return () => {
    if (node.type !== 'Root') {
      return;
    }
    const vnodeJSAst = node.children?.[0]?.jsNode;
    node.jsNode = {
      type: 'FunctionDecl',
      id: {
        type: 'Identifier',
        name: 'render'
      },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAst
        }
      ]
    };
  };
}

export function transform(node: TemplateAstNode) { 
  const context = {
    currentNode: node,
    childrenIndex: 0,
    parent: null,
    nodeTransforms: [
      transformText,
      transformElement,
      transformRoot
    ]
  };
  traverseNode(node, context);
}