import reactive from './reactive';
import { effect  } from './effect';

const a = reactive({ name: 'hug' });

effect(() => { 
  console.log(a.name);
});

(window as any).a = a;

const reactivity = {};


export default reactivity;