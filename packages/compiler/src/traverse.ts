import { TemplateAstNode } from './parse';

type NotReturnFn = () => void;

type NodeTransformExitFn = NotReturnFn | void;

type NodeTransformFn = (node: TemplateAstNode, context: Context) => NodeTransformExitFn;

interface Context {
  currentNode: TemplateAstNode;
  childrenIndex: number;
  parent: TemplateAstNode | null;
  nodeTransforms: Array<NodeTransformFn>;
}

export function traverseNode(ast: TemplateAstNode, context: Context): void { 
  context.currentNode = ast;

  const exitFns: NotReturnFn[] = [];

  const transforms = context.nodeTransforms;

  for (let i = 0; i < transforms.length; i++) { 
    const onExit = transforms[i](ast, context);
    onExit && exitFns.push(onExit);
    if (!context.currentNode) { 
      return;
    }
  }
  
  const children = context.currentNode.children;
  if (children) { 
    for (let i = 0; i < children.length; i++) { 
      context.parent = context.currentNode;
      context.childrenIndex = i;
      traverseNode(children[i], context);
    }
  }

  let i = exitFns.length;
  while (i--) { 
    exitFns[i]();
  }
}