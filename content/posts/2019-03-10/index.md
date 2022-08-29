---
title: 'ES10 Flatmap for Mapping and Filtering'
category: 'Javascript'
uid: 'es10-flatmap-for-mapping-and-filtering'
draft: false
excerpt: "That's one ES10 feature which I think I will use frequently moving on."
tags:
  - javascript
  - snippets
  - es
---

## Using old array.map and array.filter 👨🏻‍🦳

Up until now we've been using map and filter together on an
array to modify as well as filter the array elements.

```js
const array = ['good a', 'evil b', 'nice c', 'amazing d', 'bad e'];
const resultArray = array
  .filter((e) => !(e.includes('bad') || e.includes('evil')))
  .map((e, i) => `${i} - ${e}, `)
  .join(' ');
render(<div className="react-live-test">{resultArray}</div>);
```

## Using the latest array.flatmap 💁🏻‍♂️

`array.flat(depth)` flattens the array upto the depth specified.
`array.flatmap(fn)` behaves exactly like array.map, the difference is that if we _return an array_ from
our callback function, it will be flattened.

> If we return a non array value it will behave exactly like the _map_ function

```js
const array = ['good a', 'evil b', 'nice c', 'amazing d', 'bad e'];
const resultArray = array.flatMap((e, i) => {
  if (!(e.includes('bad') || e.includes('evil'))) {
    // returning a non array value simply pushes it to the array.
    // even if we return [`${i} - ${e}, `]; the value will be same because it will be flattened first
    return `${i} - ${e}, `;
  }
  // flattening an empty array will result in nothing so it will skip it
  return [];
});
render(<div className="react-live-test">{resultArray}</div>);
```
