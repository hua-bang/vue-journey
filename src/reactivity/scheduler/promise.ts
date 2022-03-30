import { reactive, effect } from '../../../packages/index';


// const obj = reactive({ a: 1 });

// effect(() => {
//   console.log(obj.a);
// }, {
//   scheduler(fn) { 
//     Promise.resolve().then(() => {
//       fn();
//     });
//   }
// }); 

// obj.a++;

// console.log('end');

const obj = reactive({ a: 1 });

const jobQueue = new Set<() => void>();

const p = Promise.resolve();

let isFlushing = false;

function flushJob() {
  if (isFlushing) { 
    return false;
  }

  isFlushing = true;

  p.then(() => {
    jobQueue.forEach(fn => fn());
  }).finally(() => {
    isFlushing = false;
  });
}


effect(() => {
  console.log(obj.a);
}, {
  scheduler(fn) { 
    jobQueue.add(fn);
    flushJob();
  }
}); 

obj.a++;
obj.a++;