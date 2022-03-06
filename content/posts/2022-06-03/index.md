---
uid: "type-safe-retry-function-in-typescript"
title: "Type Safe Retry Function In Typescript"
category: "Typescript"
draft: false
tags:
  - typescript
  - typescript promises
  - retry
  - type safe
  - typescript retry
  - design pattern
excerpt: "Make any functional call retryable using this fully type safe utility retry function."
---

“Everything fails, all the time” - Werner Vogels, Amazon CTO

I love this quote by Vogels because it’s so true. It’s really a nice thought to have in your mind while building any kind of program or architecture. Expecting your program to always follow the [“happy path”](https://en.wikipedia.org/wiki/Happy_path) is really naive.

I am writing this blog while I am working on an integration where we have to make a lot of API calls to fetch data from an external service. The first implementation was quick just to check if the APIs work correctly, response time, any errors, rate limiting, etc.

If you are not interested in the backstory, you can go straight to the part that talks about the retry function implementation [here](#the-implementation).

The function took about 14 minutes to complete and made around 16k API calls. That’s a lot of calls for a single function. I modified the code to make use of concurrent API calls using `Promise.all` which brought the time down to 7 minutes.

One thing that I noticed was that after making around 10k calls the external service API returns a timeout error. This was annoying because one error causes all of the data from previous successful 10k calls to be of no use.

There are certain things you can do to address such issues. Note that this depends heavily on how critical it is for all the calls to be successful. For example, for a finance related app, we can not ignore any error and we must put in all the measures for it to either retry, self-heal or at least log and report the error for human intervention. But for an app that fetches weather reports for all the major cities in the world, while it would be good to at least have some retry/logging mechanism in place, it would not be a big deal if we can’t retrieve weather data for one of the cities.

Though ours was not mission-critical to business so we could have just ignored the failed API call promise. Here’s an easy way to do it, especially when you are using `Promise.all` where one rejected promise will cancel all of the in-progress ones.

```tsx
await Promise.all([functionThatReturnsAPromise().catch((e) => undefined)]);
```

What this does is, add an error handler to the promise returned by `functionThatReturnsAPromise` and the error handler catches the error and returns normally instead of re-throwing the error. So, even if `functionThatReturnsAPromise` returns a rejected promise, it is caught which makes it look like the whole thing `functionThatReturnsAPromise().catch(e => undefined)` returned a resolved promise with the resolved value as `undefined`

This, helped us get rid of one major issue, one API call failure wouldn’t fail all of the functions. We silently ignore it but do log the error for debugging purposes.

We also added a metric reporting call so if more than **10%** of the calls failed we send a metric to CloudWatch which triggers an alarm so we know we must look at the logs as this behavior is not usual.

It seems like we checked all the boxes to make this function more robust. There is error reporting, it knows how to handle and ignore errors, logs, and alarms.

But there was one more thing that I wanted to do before calling it a day. You see someone great once said

> Defeat happens only to those who refuse to try again

I live by this quote, so it naturally comes to my coding style as well. Things fail, but that doesn’t mean we shouldn’t retry. I figured we could retry a failed API call a few times before actually giving up and **voilà!** all of the calls were able to get the data, some had to retry 1 or 2 times but eventually succeeded.

## The Implementation

Let’s talk about the actual retry function implementation. We use Typescript for everything. I am a big Typescript FanBoy. It’s much more than an autocompletion plugin but I still love this meme.

![Type Safe Retry Function In Typescript](./Untitled.png)

This was not the first time we were making an API call that could be retried. After all, most of the backend services are mostly a bunch of API calls with some data transformation. So I wanted to write a function that can automatically wrap a function that makes the API call and retries it on failure. Now I’ve written about such an implementation in JS. You can check that [here](https://tusharsharma.dev/posts/retry-design-pattern-with-js-promises).

Typescript is awesome but what good is a typescript code that doesn’t give you full type safety.

I love this TS meme which is based on that.

![Type Safe Retry Function In Typescript](./Untitled-1.png)

I wrote this function so we could use it anywhere we need to retry a function call on failure and it also gives the type safety of the function it is retrying.

```tsx
/**
 * Retries a function n number of times before giving up
 */
export async function retry<T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  maxTry: number,
  retryCount = 1
): Promise<ReturnType<T>> {
  const currRetry = typeof retryCount === "number" ? retryCount : 1;
  try {
    const result = await fn(...args);
    return result;
  } catch (e) {
    console.log(`Retry ${currRetry} failed.`);
    if (currRetry > maxTry) {
      console.log(`All ${maxTry} retry attempts exhausted`);
      throw e;
    }
    return retry(fn, args, maxTry, currRetry + 1);
  }
}
```

This is how one would use this function.

```tsx
/*
 * Function to retry
 */
async function callAPI(
  arg1: string,
  arg2: number,
  arg3: { id: string }
): Promise<{ data: Array<string> }> {
  return { data: ["array", "of", "strings"] };
}

// This will call the above function at most 5 times if it fails continuously.
const result = await retry(callAPI, ["hello", 2, { id: "world" }], 5);
```

The great thing is that it preserves all the types (parameter and return type) of the called function which means one it gives you autocompletion when writing it and also if you are not calling the function correctly the compiler will not compile your code.

The parameters are typed.

![Type Safe Retry Function In Typescript](./Screenshot_2022-03-06_at_10.53.54_PM.png)

The return type is also of the called function.

![Type Safe Retry Function In Typescript](./Screenshot_2022-03-06_at_10.54.42_PM.png)

The implementation is fairly straightforward, what’s interesting is using the Utility Types from Typescript which is where all the magic happens. Let’s take a closer look at it.

```tsx
export async function retry<T extends (...arg0: any[]) => any>(
  fn: T,
  args: Parameters<T>,
  maxTry: number,
  retryCount = 1
): Promise<ReturnType<T>>;
```

```tsx
function retry<T extends (...arg0: any[]) => any>();
```

This is where we are declaring a type constrained generic variable called **“T”** which can only be a function that’s why the `T extends (...arg0: any[]) => any` .

```tsx
(fn: T, args: Parameters<T>)
```

Two things to note here, We are assigning our generic variable to the first parameter of the function. In plain English this is like saying to Typescript “Hey, there’s going be this variable T which can only be a function and you can assign it to the first parameter of the function”. This basically means whatever is the type of the first parameter will be assigned to the variable T.

This is similar to something like below where typescript is extracting the type of the function and assigning it to the type T. Remember `typeof` is also a typescript construct and is different from Javascript when it is purely used to define the type. It is like a type extractor in Typescript.

```tsx
function hello() {
  return "world";
}

type T = typeof hello;
```

![Type Safe Retry Function In Typescript](./Screenshot_2022-03-06_at_11.08.50_PM.png)

Alright, back to our function.

```tsx
(fn: T, args: Parameters<T>)
```

So, Typescript will be aware of the type of our `fn` parameter. The second parameter is `args: Parameters<T>` where we are using a TS utility type called `Parameters<T>` What this does is it extracts the parameters type of a function. Read more about it [here](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype).

Now since we’ve assigned our T type variable to the first parameter (which is a function), `args: Parameters<T>` basically means whatever the `Parameters` type of the first parameter is, assign that type to this second parameter.

The below example would make it more clear.

```tsx
function hello(a: number, b: string): string {
  return "world";
}

type T = typeof hello;

type Params = Parameters<T>;
```

![Type Safe Retry Function In Typescript](./Screenshot_2022-03-06_at_11.24.34_PM.png)

In a similar way, we define the return type of our retry function.

```tsx
Promise<ReturnType<T>>
```

Let’s focus on the `ReturnType<T>` , This is again one of the utility types provided by Typescript. Read about it [here](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype).

Similar to the `Parameters` utility type, the `ReturnType` extracts the return type from a function type.

```tsx
function hello(a: number, b: string): string {
  return "world";
}

type T = typeof hello;

type Params = Parameters<T>;

type Return = ReturnType<T>;
```

![Type Safe Retry Function In Typescript](./Screenshot_2022-03-06_at_11.29.07_PM.png)

Now since we’ve assigned our T type variable to the first parameter (which is a function), `ReturnType<T>` basically means whatever the `ReturnType` type of the first parameter is, assign that type to the return type of this function.

I am an advocate for using Typescript for any javascript project but I also believe that just using it won’t solve `any` (no pun intended) problem. You can totally write Typescript code in a way that it's not helping you and your team at all. One way is to use `any` everywhere. But that’s like using a samurai sword to spread jam on your bread. It’s not how it’s meant to be used.

Use Typescript everywhere and use it wisely.

Thanks for reading.
