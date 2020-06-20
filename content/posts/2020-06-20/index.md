---
uid: 'react-hooks-mental-model'
title: 'Re-visiting React Hooks - useEffect'
category: 'REACT'
draft: false
tags:
  - react
  - hooks
  - react hooks
  - useEffect
excerpt: 'This blog post is almost a year late since react hooks first came out but in this blog post, I would like to revisit the concept of hooks in React components, most importantly on how to think about the useEffect hook.'
---

With the addition of [Hooks](https://reactjs.org/docs/hooks-intro.html) in React, developers could use a lot of react features that were only available through Class components in Function components. React hooks doesn't directly bring anything new to React that didn't already exist. It gives you an API to use features like local state, component lifecycle, etc in function components. So why would someone want to use hooks if they can do the same using class components? Below are a few reasons why you would want to do that.

**1. Less Code**

Class components require more boilerplate than function components. Take a look at this very simple class component.

```jsx
import React, { Component } from 'react';

export class BaseComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div>Hello</div>;
  }
}
```

Compare it with the function component below which requires much less code.

```jsx
import React from 'react';

export function BaseComponent() {
  return <div>Hello</div>;
}
```

This is just one component, imagine having a large number of simple components like this. Not only it will increase the size of the code, but it is also not very productive having to write the boilerplate for a class component for simple components.

**2. Performance Boost**

A lot of people prefer to write function components thinking that it gives or will give a performance boost. This was [promised](https://reactjs.org/blog/2015/10/07/react-v0.14.html#stateless-functional-components) by the React team.

> This pattern is designed to encourage the creation of these simple components that should comprise large portions of your apps. In the future, we’ll also be able to make performance optimizations specific to these components by avoiding unnecessary checks and memory allocations.

Before react hooks function components were also called stateless components. So, it was recommended to write your components as functions to get a performance boost if it didn't require any local state. It was frustrating to refactor your function components to a class whenever you wanted to use local state in it. Good thing this is not a case anymore with hooks 🎉.

**3. Function components capture the rendered values**

This is one of the most compelling reasons for why write React components using functions. You see, state management in class components is done by modifying the value of `this` inside the class. This behavior could introduce inconsistencies in your class methods if they are asynchronous (See below example). The reason for the inconsistencies in most of the cases is that the value of `this` has the latest state but the function was executed for an older state. This is not the case with function components where each render gets its own unique state and props using JS scopes.

```jsx
class MyComponent extends React.Component {

 async onClick() {
   await increaseCountInServer(this.state.count + 1)
   // at this point this.state.count could have a new value
   // different from what it was when this function execution was started
   // if the button was clicked multiple times
   this.setState({ count: this.state.count + 1 })
 }

 render() {
  return <button onClick={this.onClick}>{this.count}</button>;
 }
}
```

This behavior is beautifully explained in this [blog post](https://overreacted.io/how-are-function-components-different-from-classes/) by Dan. I would highly recommend reading this blog post.

**4. Composability**

Hooks enable us to create some really nice abstractions around re-usable functionality. Take a look at [this](https://usehooks.com/) list of custom hooks. This provides a way to re-use common functionality across multiple function components. Something similar can be done using higher-order components when using class-based components. A cool thing with custom hooks is that you can compose new custom hooks using other custom hooks inside of them.

---

Alright, enough of why write function components using hooks. Let's see how to think about hooks. We'll focus on the `useEffect` hook in this post.

When I first started using the `useEffect` hook, I was trying to use the same mental model I had for a class component and applying it to the `useEffect`. The mental model was something like this. A `useEffect` with an empty dependency set `[]` is a replacement for `componentDidMount`. A `useEffect` otherwise is a replacement for `componentDidUpdate`.

A problem with this mental model is that is is very limiting. It limits us from getting creative with hooks and exploring outside of the obvious use case of `componentDidMount` and `componentDidUpdate`.

After using them for a while now, I think of *useEffect as a way to perform side effects in a component*. One really has to unlearn the idea of `componentDidMount` and `componentDidUpdate` to think of it like that.

![React useEffect hooks Mental Model Using Effects](./react-side-effects.png)

Another thing that helps is by thinking of component lifecycle as a timeline of multiple renders i.e A component in its lifetime renders multiple times. Each render gets its own unique copy of the state, props, and hooks.

> Note - Each render doesn't necessarily mean that its corresponding DOM was also updated.

![React Render Lifecyce](./react-render-lifecycle.png)

If you define a regular function inside a function component. Every render will have its own unique copy of that function. Similarly, every render has its own copy of the hooks defined in it. `useEffect` hook in a lot of ways is similar to a regular function. Let's see how.

```jsx {2,3,4,5,6,7,12,13,14}
function MyComponent() {
  async function makeAPICall() {
    await fetch(...);
  }
  // how do we calculate firstRender ???
  if(firstRender) {
    makeAPICall();
  }
  return <div>Text</div>;
}

function MyHooksComponent() {
  useEffect(() => {
    await fetch(...);
  }, [])
  return <div>Text</div>;
}
```

The highlighted function inside the first react component is not a hook but it performing a side effect(API call). The second version is using a `useEffect` hook for the same. So how the hook version is any different from the non-hook component.

The only benefit of using the hook, in this case, is that you would not have to compute the value of `firstRender`(which would require some logic and state), `useEffect` dependency list will take care of that.

I like to think of the dependency list as *properties that trigger a side-effect*. In the above code, there is no property that triggers the side effect (`[]`) it will only get called during the first render.

So why use the `useEffect` hook if we can replicate the same using regular JS functions?

Well, it provides a lot of built-in features that we'll not get when using plain functions for side-effects.

**1. Conditionaly run your side-effects**

The dependency list in the hook lets you define what properties will trigger your side-effect to run. This is super useful as you can define exactly when does your side-effect run. This is not possible to replicate since we would not have access to previous props or state inside a function.

```jsx
function MyHooksComponent({ userId }) {
  useEffect(() => {
    await fetch(...);
  }, [userId])
  return <div>{userId}</div>;
}

function MyComponent({ userId }) {
  async function subsribeToUser() {
    await fetch(...);
  }
  // Can't do this since we don't have prevUserId ???
  if(userId !== prevUserId) {
    subsribeToUser();
  }
  return <div>{userId}</div>;
}
```

Let's consider a more practical example, you have a component that receives a userId prop and it subscribes to a WebSocket channel to get the latest messages from that user in real-time and show it on the UI.

When you select a new user to chat with, you would want to close the WebSocket channel for the previous user and subscribe to the WebSocket channel for the new user.

Let's apply the new mental model of `useEffect` here.

During the lifetime of our ConversationThread component, anytime the `userId` changes we would want to trigger a side-effect to subscribe to the WebSocket channel for that `userId`. Also, anytime we subscribe to a new `userId` we would want to perform cleanup by unsubscribing the previous user from the WebSocket channel.

![useEffect Cleanup](./cleanup.png)

As shown in the above image, although the component renders multiple times, it only executes the side-effect of subscribing/unsubscribing users when the `userId` changes. This is powerful. But wait, what's that cleanup function and where do we define it?

**2. Perform Cleanups**

Side-effects often require us to perform some sort of cleanup. Like for example, listening to a click listener requires us to de-register the listener when we are no longer listening, polling a Rest API will require us to stop polling when we are no longer polling, etc. A consequence of not doing that is having memory leaks in your application.

`useEffect` gives us a neat way to define a way to perform cleanup for our side-effects.

```jsx
function MyHooksComponent({ userId }) {
  useEffect(() => {
    await fetch(...);

    return () => {
      // perform cleanup
    }
  }, [userId])
  return <div>{userId}</div>;
}
```

`useEffect` will only perform cleanup for a previous side-effect before running the side-effect again. In the above image, it unsubscribes to userId `12` before subscribing to userId `20`. Now, how cool is that?. This is not available in class components.

I think `useEffect` API is much more intuitive than options available in a class component. You just have to start thinking in terms of side-effects and when to run these side-effects. Thank you for reading this article. If you want to make any changes please submit a PR [here](https://github.com/tusharf5/tusharsharma.dev).
