type TemplateAst = any;
interface Token {
  type: string;
  content?: string;
  name?: string; 
}

export const parse = (template: string): TemplateAst => { 
  
  // 1. tokenize

  // 2. generate ast
  
  return template;
};

enum State { 
  initial = 1,
  tagOpen,
  tagName,
  text,
  tagEnd,
  tagEndName
}

function isAlpha(char: string) { 
  return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z';
}

export function tokenize(str: string): Token[] { 
  let currentState: State = State.initial;
  // in order to cache char
  const chars: string[] = [];
  // collect tokens
  const tokens: Token[] = [];

  while (str) {
    const char = str[0];
    switch (currentState) {
    case State.initial:
      if (char === '<') {
        currentState = State.tagOpen;
        str = str.slice(1);
      } else if (isAlpha(char)) {
        currentState = State.text;
        chars.push(char);
        str = str.slice(1);
      }
      break;
    case State.tagOpen:
      if (isAlpha(char)) {
        currentState = State.tagName;
        chars.push(char);
        str = str.slice(1);
      } else if (char === '/') {
        currentState = State.tagEnd;
        str = str.slice(1);
      }
      break;
    case State.tagName:
      if (isAlpha(char)) {
        chars.push(char);
        str = str.slice(1);
      } else if (char === '>') {
        currentState = State.initial;
        const token: Token = {
          type: 'tag',
          name: chars.join(''),
        };
        tokens.push(token);
        chars.length = 0;
        str = str.slice(1);
      }
      break;
    case State.text:
      if (isAlpha(char)) {
        chars.push(char);
        str = str.slice(1);
      } else if (char === '<') {
        currentState = State.tagOpen;
        tokens.push({
          type: 'text',
          content: chars.join(''),
        });
        chars.length = 0;
        str = str.slice(1);
      }
      break;
    case State.tagEnd:
      if (isAlpha(char)) {
        currentState = State.tagEndName;
        chars.push(char);
        str = str.slice(1);
      }
      break;
    case State.tagEndName:
      if (isAlpha(str)) {
        chars.push(char);
        str = str.slice(1);
      } else if (char === '>') {
        currentState = State.initial;
        tokens.push({
          type: 'tagEnd',
          name: chars.join(''),
        });
        chars.length = 0;
        str = str.slice(1);
      }
      break;
    }
  }

  return tokens;
}