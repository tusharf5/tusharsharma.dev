---
uid: 'prototyping-and-inheritance-in-js'
title: 'Prototyping and Inheritance in Javascript'
category: 'Javascript'
draft: true
tags:
  - prototypes
  - functions
  - inheritance
  - new keyword
excerpt: 'How prototyping works in Javascript with the prototype chain?.'
---

Let's try to understand what happens behind the scenes when you create a new function and when you extend one.

This is a Javascript function.

```js
function Enemy() {
  this.life = 10;
  this.power = 'shoot-bullets';
}
```

> When we define a function like this, the code inside the function is not executed unless we invoke the function.

We generally write a function to group a functionality together. But sometimes we write functions
which serves a special purpose and i.e _Inheritance_. We execute these functions to get _Objects_ which are identical.
Their behaviours and properties are all same. So we can say that these special functions behave like an Object _Factory_.
We can also make functions in a way that the objects they create _inherits_ all the properties and behaviours of another function
but they also have additional new properties on them. Let us see all of this in action.

Let's say we are writing a game and in the game we spawn hundreds of enemies to fight our player. There are different types
of enemies but they all have one similarity and i.e they are all enemies. So let's start with creating a **Function** which will help
us spawn the most common enemy in our game. It has a `life` and `ammo` property and a method `shoot` to shoot bullets.

```js
function Enemy() {
  this.life = 10;
  this.ammo = 20;
  this.shoot = function() {
    console.log('Shooting');
    this.ammo--;
  };
}

let enemy1 = new Enemy(); // {life: 10, ammo: 20, shoot: function}
let enemy2 = new Enemy(); // {life: 10, ammo: 20, shoot: function}
let enemy3 = new Enemy(); // {life: 10, ammo: 20, shoot: function}
let enemy4 = new Enemy(); // {life: 10, ammo: 20, shoot: function}
let enemy5 = new Enemy(); // {life: 10, ammo: 20, shoot: function}
```

We have 5 enemies now who will spawn with identical properties and behaviours.

I remember when I was just starting out with Javascript I did not understand why we need a `new` Keyword here and why are we attaching
the properties and behaviours to `this` keyword in the **Enemy** function.

The code below seems totally reasonable to me then which one of the these two is a better approach?

```js
function spawnEnemy() {
  function shoot() {
    console.log('Shooting');
    this.ammo--;
  }
  return {
    life: 10,
    ammo: 20,
    shoot
  };
}

let enemy1 = spawnEnemy(); // {life: 10, ammo: 20, shoot: function}
let enemy2 = spawnEnemy(); // {life: 10, ammo: 20, shoot: function}
let enemy3 = spawnEnemy(); // {life: 10, ammo: 20, shoot: function}
let enemy4 = spawnEnemy(); // {life: 10, ammo: 20, shoot: function}
let enemy5 = spawnEnemy(); // {life: 10, ammo: 20, shoot: function}
```

Calling without the `new` keyword. The context of this is `global` in the `Constructor` function.

So `window.name` will be `"some"` and
`window.color` will be `"blue"`

```js
var cat = new Cat();
```

**The `new` keyword change the context of `this` inside the `Contructor` function to an `Empty Object {}`**

The function then returns it.

That is why it is so important.

```js
var cat = Object.create(Object.prototype,
      {
        name: {
                value: 'Jimmy',
                enumerable: true,
                writable: true,
                configurable: true
              }
      }
    );
```

It is taking an argument which will become the prototype of the new Object and some values and their attributes.

**This is how objects are created by `constructor function` and `object literals`**

_Glad you don't have to do that everytime_

#### Prototypes and Inheritance

So when you create a `constructor function` Javascript creates an empty object of same name for you.

It then points the function's `prototype` property to this new Object.
Also it creates a constructor property to that object which contains your constructor Function.

```js
Cat.prototype.age = 3;
```

It adds this to that new object that it created for us.

Now whenever you make a `new` instance from that contructor function.
`Javascript` creates a new empty object and then it points the `_proto_` property of that object to the new Object it created while making the consctructor function.

```js
function Car() {
  this.name = "mozilla";
}
```

**JS created a new Object**

```js
Car {}
```

Now `fn` Car's `prototype` property points to this new Object.

and when you do

```js
var honda = new Car();
```

**JS creates another Object**

```js
honda {}
```

Then the `_proto_` protery of this new Object points to the Object that it created in the first place for holding the `Car` contructor function.

So the `prototype` of this newly created object is the object that js created for the `Car` Object.

Each property we have in the contructor is copied to the new instance,
The properties attached to the `prototype` are accessed later.

**A function's protptype is an Object which will become the prototype of all the function using this function as a constructor function**

**An object's prototype is an object from which an object is inherited**

#### Changing a Function's prototype

What you do is

`Base.prototype = Object.create(Parent.prototype);`

Notice this will also set the constructor function of Base to Parent.
`Base.prototype.constructor = Base;`

It makes the `prototype of the parent function` the `prototype of an empty object` and then that object is assigned as the `prototype of the base function`.

`Object.create` and not `new Parent()` because we dont want to call parent function we just want to assign the prototype of it.

**But we do need to initialize the Parent's contructor function**

```js
function Base() {
  Parent.call(this);
}
```

This way if any initialization is required in Parent. It will do so.
