---
uid: 'generator-functions'
title: 'What are Generator Functions, Anyway?'
category: 'Programming'
draft: false
tags:
  - javascript
  - python
excerpt: 'Generators are super cool and super helpful in some cases. But How?.'
---

Generators were introduced in javascript with the ES6 version. But I never really found
a compelling reason to use them.
Generators are basically used for iterating over some type of object on demand (We already have like more than 10 different ways for that).
**But then why use generators ?**. I have never used them directly but some implementations of **async/await** make use of generators.

Recently I was reading a book on python when I was re-introduced to the concept of generator functions.

Python has a `range(max)` function that you can use to **generate** a list of numbers.

```python
# iterate over 0 to 100
for i in range(100):
    print(i)

# iterate over 0 to 1000
for i in range(1000):
    print(i)
```

Now one might think that `range` returns a list( or array) of numbers from 0 to the `max` argument like `[0,1,2,3,4,5.......,100]` here.
That would have been the case if range was implemented like a normal function. **See Below**

In **Python**

```python
def range(max):
    index = 0
    rangeList = []
    while index < max:
        rangeList += [index]
        index += 1
    return rangeList
```

In **Javascript**

```js
function range(max) {
  const arr = [];
  for (let i = 0; i < max; i++) {
    arr.push(i);
  }
  return arr;
}
```

The machine, in this case, would have to allocate memory to store each item of the returned array/list and the array itself. So if it were to iterate till 10000 the machine would have
to allocate memory for storing 10000 values. **Good News** is that in python it isn't implemented like that. It uses something called a generator function.

> A generator function has the ability to evaluate something only when it is required, which is also called **Lazy Evaluation**

So if the loop iterating over a list generated using a generator function were to be interrupted in some fashion, no time will be spent computing the unused values of that range/list.

The actual implementation might look something like this.

In **Python**

```python
def range(max):
    index = 0
    while index < max:
        yield index
        index += 1
```

In **Javascript**

```js
function* range(max) {
  for (let i = 0; i < max; i++) {
    yield i;
  }
}
```

I think this is an important concept to understand in order to efficiently use generators and also to know where and why to use them at all. Memory is cheap but too much memory
can hit the preformance pretty bad. The more memory you use and discard, the more frequently **Garbaje Collector** would run. So use it wisely 😇

## Update 26th Sept 2019

**Use case 1** - I wrote a piece of code to use generators to behave like async/await for a side project.
This is a simplified version of that code.

```js
// Don't use this in production as it lacks some edge case handling
function promise() {
  return new Promise((resolve, reject) => reject(Math.random()));
}

function* gene() {
  try {
    const a = yield promise();
    console.log('sync a', a);
    const b = yield promise();
    console.log('sync b', b);
    const c = yield promise();
    console.log('sync c', c);
  } catch (e) {
    console.log('sync error', e);
  }
}

function runGenerator(gen) {
  const it = gen();
  function resolveNext(iterObject) {
    if (iterObject.done) {
      return;
    }
    iterObject.value
      .then(data => {
        console.log('sync resolved');
        const current = it.next(data);
        resolveNext(current);
      })
      .catch(e => {
        it.throw(e);
      });
  }
  const current = it.next();
  resolveNext(current);
}

runGenerator(gene);
// OUTPUT
// sync resolved
// sync a 0.845...
// sync resolved
// sync b 0.94...
// sync resolved
// sync c 0.8...
```

**Use case 2** - Iterate over a list of items in a cycle FOREVER (I'm using this in production for a data processing workflow)

```js
const fruits = ['mango', 'apple', 'banana', 'pineapple'];
function* nextType(...args) {
  while (true) {
    for (const arg of args) {
      yield arg;
    }
  }
}

const iterator = nextType.apply(nextType, fruits);

function next() {
  return iterator.next().value;
}

console.log(next());
console.log(next());
console.log(next());
console.log(next());
console.log(next());
console.log(next());

// 'mango',
// 'apple',
// 'banana',
// 'pineapple',
// 'mango',
// 'apple',
```
