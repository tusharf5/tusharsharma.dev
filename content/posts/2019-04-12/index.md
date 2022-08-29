---
title: 'XOR - A Powerful Lodash Method'
category: 'Javascript'
uid: 'xor-lodash'
draft: false
tags:
  - xor
  - xorBy
  - javascript arrays
excerpt: "Get toggle functionality out of the box with lodash's xor method."
---

Often times I find myself implementing toggle functionality in applications.

One good example of a toggle method is the DOM API to toggle a class name on a DOM element.

![Toggle](/images/toggle.gif)

```js
element.classList.toggle('dark');
```

Most of the times a toggle function expects two arguments.

One is an array of items and the other one is a single item which we want to toggle and this is how it could be
implemented.

```js
let frameworks = ['express', 'node', 'sails', 'hapi'];

// this is not an efficient implementation but should work
// fine for an array with a few hundred items
function toggleSingleItem(array, item) {
  return array.includes(item) ? array.filter((frmwrk) => frmwrk !== item) : array.concat(item);
}

// prints out - ['node', 'sails', 'hapi'];
frameworks = toggleSingleItem(frameworks, 'express');
console.log(frameworks);

// prints out - ['express', 'node', 'sails', 'hapi'];
frameworks = toggleSingleItem(frameworks, 'express');
console.log(frameworks);
```

Things get tricky when we want to toggle an array of items from an array of items.

```js {12}
let frameworks = ['express', 'node', 'sails', 'hapi'];

function toggleSingleItem(array, item) {
  return array.includes(item) ? array.filter((frmwrk) => frmwrk !== item) : array.concat(item);
}

function toggle(array, items) {
  let arrayClone = [...array];
  items.forEach((item) => {
    arrayClone = toggleSingleItem(arrayClone, item);
  });
  return arrayClone;
}

// prints out - ['node', 'sails'];
frameworks = toggle(frameworks, ['express', 'hapi']);
console.log(frameworks);

// prints out - ['node', express'];
frameworks = toggle(frameworks, ['express', 'sails']);
console.log(frameworks);
```

What we are doing here is cleverly performing a toggle on each of the single item instead of writing a complex program
which does it all in one go.

## Meet xor Ω

> In this context, xor means, whatever is common between the two arguments(array)
> remove those common elements from both the arrays first and then whatever elements are left in both the
> arrays create a new array of those remaining elements WITHOUT REPETITION.

That right there is a complex definition but if I put it in simple words

_If the item does not exist in the original array ADD it, if
it exists REMOVE it._

Let's do the multiple items toggle again this time using lodash `xor` method.

```js
let frameworks = ['express', 'node', 'sails', 'hapi'];

// prints out - ['node', 'sails'];
frameworks = _.xor(frameworks, ['express', 'hapi']);
console.log(frameworks);

// prints out - ['node', express'];
frameworks = _.xor(frameworks, ['express', 'sails']);
console.log(frameworks);
```

That's cool right! No need to write your own implementation.

Now I know most of the times our array elements are not string or number literls they are `\{}` Objects.
If we want to toggle objects there is another method for that which takes a function which tells it how
to determine if an element should be deleted or not.

```js {4}
let frameworks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

// prints out - [{"id":2},{"id":3},{"id":4}]
frameworks = _.xorBy(frameworks, [{ id: 1 }], (item) => item.id);
console.log(frameworks);

// prints out - [{"id":2},{"id":3},{"id":4},{"id":1}]
frameworks = _.xorBy(frameworks, [{ id: 1 }], (item) => item.id);
console.log(frameworks);
```

This line tells `xorBy` method to filter the arrays using the `id` property. So it toggles the object with
the id 1.

> Lodash is known for its higher computational complexity so I always prefer native methods over
> lodash methods but when dealing with a small set of data where complexity doesn't matter much I always go with
> lodash for cleaner code.
