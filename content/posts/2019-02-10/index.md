---
title: 'Javascript Promises are Eager and Not Lazy'
category: 'Javascript'
uid: 'js-promises-eager-not-lazy'
draft: false
excerpt: 'A nice little gotcha related to how promises work in Javascript.'
tags:
  - javascript
  - snippets
  - promises
---

As soon as the javascript Interpreter sees a promise declaration. It immediately executes its implementation synchronously. Even though it will get settled eventually.

See the code below. We didn't have to do a `fetchItem.then()` to execute that promise. It started executing as soon as it was declared.
This is one of the major differences between promises and observables. Observables don't execute their implementation unless they are subscribed.

```js
console.log('Start');
const fetchItem = new Promise(resolve => {
  console.log('Inside Promise');
  resolve();
});
console.log('Finished');

// OUTPUT
// Start
// Inside Promise
// Finished
```

To avoid this you can wrap your promise inside a function declaration and call that function only when it is required.
This works because the javascript Interpreter does not go through a function declaration unless that function is called.

```js
console.log('Start');
function runPromise() {
  const fetchItem = new Promise(resolve => {
    console.log('Inside Promise');
    resolve();
  });
  return fetchItem;
}
console.log('Finished');

// OUTPUT
// Start
// Finished
```
