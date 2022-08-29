---
title: 'MongoDB - Update And Query Operators for Arrays'
category: 'MongoDB'
uid: 'mongo-db-update-and-query-operators-for-arrays'
draft: false
tags:
  - positional operator
  - database
  - MongoDB
  - mongoose
excerpt: 'Querying and updating arrays in mongoDb can be tricky. mongoDB has a rich set of very useful array operators. Since arrays play an important role when designing the database schema, in this post I will explain how to and when to use array operators in mongoDB with examples.'
---

![Querying and Updating Nested Arrays in MongoDB](./mongo.png)

I've worked with mongoDB for 3 years now. Built several monoliths, microservices, serverless applications with different use cases using mongoDB. It is fast, scalable, dynamic and developer friendly. One of my favourite **mongoDB** feature is that it stores data as documents in BSON (JSON in binary) because of which we can store array fields inside a document unlike a SQL based database where we would have to create another table for it.

Let's suppose we have the following data in our MongoDB **posts** collection stored in a very naive way (for simplicity).
Each **post** document has a `title`, `author` and a `comments` array field. Each element of the `comments` array
represents a user with some basic information like `country`, `name`, `isGuest`, and `country`.

```js
[
  {
    _id: ObjectId('1232'),
    title: 'Hello World',
    author: 'John',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2002',
        name: 'Marshall',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'france',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1233'),
    title: 'Secrets of Life',
    author: 'John',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2006',
        name: 'Peter',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1234'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1235'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
    ],
  },
];
```

> The most important concept to remember when dealing with arrays in MongoDB is to know that
> whenever we target a particular array element (a comment in this case), MongoDB is not just going to return
> the targetted array element(s), instead it will return all the array element(s) inside the matched documents.

It will make more sense after we go through a few examples.

## Querying Arrays

```shell
db.posts.find({
  'comments.name' : 'John'
});
```

If we translate this MongoDB query statement to English. It will be
"Retrieve all posts where **at least one** comment is made by a user with name **John**"

This will be the returned result.

```js {9,58,93,100}
[
  {
    _id: ObjectId('1233'),
    title: 'Secrets of Life',
    author: 'John',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2006',
        name: 'Peter',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1234'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1235'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
    ],
  },
];
```

Now if you look at the result you will notice that although we targetted comments where user's name is **John**,
MongoDB returned us all of the comments in the returned documents. The posts array it returned to us has **at least one** comment made by the user **John** and it also contains other comments which are not made by John.

> This has been my greatest gotcha with MongoDB. It was a big **Aha** moment for me
> when I first understood this behaviour. It has helped me a lot in working with arrays and most importantly
> writing big database migration and modification scripts.

Now let's suppose we want to get all the posts where **at least one** comment is from a **guest user from usa**.

```shell
db.posts.find({
  'comments.country': 'usa',
  'comments.isGuest': true
});
```

Looks good but this will return us all of the posts where **at least one** comment in the comments array is from a guest _and_
**at least one** comment in the comments array is from country **usa**.

This is the result of the above query.

```js {11,12,95,96}
[
  {
    _id: ObjectId('1232'),
    title: 'Hello World',
    author: 'John',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2002',
        name: 'Marshall',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'france',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1233'),
    title: 'Secrets of Life',
    author: 'John',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2006',
        name: 'Peter',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1234'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
];
```

The second document looks odd. It does not have a user who is a guest and who is also from usa.
So it turns out that if a post has a comment of a user from **usa** and it also has another comment from a **guest**.
This post will also match our above query which we clearly don't want. We wanted to match the posts where at least
one comment is from a **guest** _and the same comment_ should be also from the country **usa**.

The query searches the comments array for at least one element who is a guest and at least one element who is from usa.
A single element does not need to meet both criteria.

### \$elemMatch

Let's rewrite our query using \$elemMatch

```shell
db.posts.find({
  comments: {
    $elemMatch: {
      country: 'usa',
      isGuest: true
    }
  }
});
```

The result from the above query is.

```js {11,12,53,54}
[
  {
    _id: ObjectId('1232'),
    title: 'Hello World',
    author: 'John',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2002',
        name: 'Marshall',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'france',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1234'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
];
```

This is the correct result. Both the returned documents have a user named **Adam** who is a guest and is also from **usa**.

So the question becomes **when to use \$elemMatch?**

I recommend to use it almost every time when you want to query a nested array element.

> **\$elemMatch** matches documents that contain an array field with at least one element that matches all the
> specified query criteria. It behaves like a normal **'array.field'** when there is just one criterion.

```shell
db.posts.find({
  comments: {
    $elemMatch: {
      country: 'usa',
    }
  }
});
```

```shell
db.posts.find({
  'comments.country': 'usa'
});
```

The above two snippets works exactly the same because there is just one criterion _i.e_ country is 'usa'. If there are more than one conditions then use **\$elemMatch**.

## Updating Arrays

### \$ operator

> \$ operator acts as a placeholder for the index of the first element that matches the query document

So let’s say out of all the comments on a particular post you want to
update the name of the user of a particular comment.

```shell
db.posts.update(
  {
    _id: ObjectId('1232'),
    'comments.id': '2001'
  },
  {
    $set: { 'comments.$.name': 'New Name' }
  }
);
```

MongoDB searches the post collection to find a post document with id **1234** and which also has at least one comment with id **2001**.
Now we aim to target the comment with an id **2001** but the search query will return us all of the comments in the matched post and in
order to update the specific **2001** id comment, we need its _index_. If we know the index we can do `comments.<index>.name: 'New Name'`. So for
instance if the index is **2**. We can do `comments.2.name: 'New Name'`. MongoDB doesn't provide us with an index but it does provide us
with a placeholder or a pointer for the index as **\$**. So we can do `comments.$.name: 'New Name'` and MongoDB will place the correct value
of the index in **\$** and update the comment.

> **Important:** The array field must appear as part of the query document for it to work.

### \$[] operator

Now sometimes we want to update all of the elements in an array. For example, if you want to set a `version` v1 on all of the existing comments.
Or if you want to set a new property to all of the comments.

_\$[]_ is like a placeholder index for all of the elements of an array field.

Let's add a new version property to all of our comments.

```shell
db.posts.updateMany(
  {},
  {
    $set: { 'comments.$[].version': 'v1' }
  }
);
```

Now _all the comments_ on _all of the posts_ will have a `version: 'v1'` property.

If we want to add the version property to a particular post. we'd do.

```shell
db.posts.updateMany(
  {
    _id: ObjectId('1233')
  },
  {
    $set: { 'comments.$[].version': 'v1' }
  }
);
```

Now _all the comments_ on the _post with id '1234'_ will have a `version: 'v1'` property.

> \$[] works correctly only with **updateMany** method or **\{multi: true}** option as it
> tends to update more than one element.

_Things get a little trickier from here._

Let's suppose that John is no longer a guest user. John has registered an account with our blog.
Now we need to update John's `isGuest` field to `false` in all of the post's comments.

Let's write the command for that.

```shell
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[].isGuest': false },
  { multi: true }
);
```

> **\{ multi: true }** applies the action on all of the matched documents. You can also use **updateMany** method instead.

This command looks pretty good. Update the **isGuest** field to false in all the comments where name is John.

**Did you notice the problem with the above command?**

The `isGuest` field of all the _highlighted_ lines in the document below was set to false by the above command.

```js {53,60,67,74,81,95,102,109,116,123,137,144}
[
  {
    _id: ObjectId('1232'),
    title: 'Hello World',
    author: 'John',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: true,
        country: 'usa',
      },
      {
        id: '2002',
        name: 'Marshall',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'I like it!',
        isGuest: true,
        country: 'india',
      },
      {
        id: '2003',
        name: 'Joe',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'france',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: true,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1233'),
    title: 'Secrets of Life',
    author: 'John',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2006',
        name: 'Peter',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: false,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1234'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2001',
        name: 'Adam',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2007',
        name: 'Tushar',
        text: 'I like it!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2008',
        name: 'Sunil',
        text: 'Learned a lot!',
        isGuest: false,
        country: 'india',
      },
      {
        id: '2004',
        name: 'Taylor',
        text: 'Awesome Post!',
        isGuest: false,
        country: 'germany',
      },
    ],
  },
  {
    _id: ObjectId('1235'),
    title: 'Infinity Wars Endgame Review',
    author: 'Peter',
    comments: [
      {
        id: '2005',
        name: 'John',
        text: 'Nice!',
        isGuest: false,
        country: 'usa',
      },
      {
        id: '2005',
        name: 'John',
        text: 'Good!',
        isGuest: false,
        country: 'usa',
      },
    ],
  },
];
```

This command has gone **terribly wrong**. We wanted to update comments from a specific user but it updated
all of the comments by setting `isGuest to false`.

Let's try to understand why it went wrong.

```shell {2}
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[].isGuest': false },
  { multi: true }
);
```

**What we targetted?**

We wanted to target _all posts_ where there is _at least one comment from John_.

**What was targetted?**

This line targets _all posts_ where there is _at least one comment from John_. MongoDB returned us
_all posts_ where there is at least one comment from John.

---

```shell {3}
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[].isGuest': false },
  { multi: true }
);
```

**What we targetted?**

We wanted to update the `isGuest` field to `false` in _comments only from John_.

**What was targetted?**

Because MongoDB returned us _all posts_ where there was at least one comment from John and
all other comments as well. The `$[]` operator updated the `isGuest` field to `false` in
_all the comments_ of _all the returned posts_ and not specifically on the comments only from John.

That's what **\$[]** is supposed to do.

We need a way through which we can update individual array elements based on some condition.
Like here we only want to update those comments where **name is John** and not all of the returned comments.

It is similar to performing `result.map(e => updateElement(e))` where we are updating all the elements from
the query result.

What we need to do is update based on some condition **i.e**
`result.map(e => \{ if(e.name === 'John') \{ return updateElement(e); } else \{ return e; } })`

### \$[indentifier] operator to the rescue

```shell
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[e].isGuest': false },
  { arrayFilters: [ { 'e.name': 'John' } ], multi: true }
);
```

When updating array elements, MongoDB will check the _\{ 'e.name': 'John' }_ condition for each array element and only update the element
if it is true.

```shell {2}
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[e].isGuest': false },
  { arrayFilters: [ { 'e.name': 'John' } ], multi: true }
);
```

This line tells MongoDB that we want to target posts where there is at least one comment from John.

```shell {3}
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[e].isGuest': false },
  { arrayFilters: [ { 'e.name': 'John' } ], multi: true }
);
```

This letter _e_ is a placeholder index for all the array elements. Presence of it also means that
it is a conditional update which means **only update this element if the criteria mentioned in arrayFilters is matched**.

```shell {4}
db.posts.update(
  { 'comments.name': 'John' },
  { 'comments.$[e].isGuest': false },
  { arrayFilters: [ { 'e.name': 'John' } ], multi: true }
);
```

Here we are specifying the criteria to tell MongoDB when to update an element whose `name` field
is equal to `John` where _e_ represents the element.

### \$all operator

Let's take an example of a customers collection where we can tag each customer. In a typical dashboard we could expect
the filter criterias to be like "Show only important", "Show only business", "Show only repeat and important", etc.

```js
[
  {
    _id: '123456abcd',
    tags: ['important', 'business', 'new'],
  },
  {
    _id: '123457abce',
    tags: ['spam', 'new'],
  },
  {
    _id: '123458abcf',
    tags: ['important', 'repeat', 'normal'],
  },
  {
    _id: '123459abcg',
    tags: ['spam', 'repeat'],
  },
];
```

```shell
# Find customers where each customer has ATLEAST one of the tag as important
db.customers.find({ tags: 'important' })
# Result - ['123456abcd', '123458abcf']

# Find customers where each customer has ATLEAST one of the tag as business
db.customers.find({ tags: 'business' })
# Result - ['123456abcd]

# Find customers where each customer has EXACTLY these two tags i,e business and important
db.customers.find({ tags: ['business', 'important'] })
# Result - []

# Find customers where each customer has EXACTLY these two tags i,e spam and new
db.customers.find({ tags: [ "spam", "new" ] })
# Result - ['123457abce']

# Find customers where each customer has either a business tag OR an important tag
db.customers.find({ tags: { $in: ['business', 'important'] } })
# Result - ['123456abcd', '123458abcf']

# Find customers where each customer has(includes) an important tag AND a repeat tag
db.customers.find({ tags: { $all: ['important', 'repeat'] } })
# Result - ['123458abcf']
```

**\$all** tag is useful where we want to only find documents which includes _all the tags specified in the filter_.
I'll give another example just to make it more clear. Let's say we are building a dashboard where we could search users
based on the the singers they listen to and we could connect with the users who have similar song interests as we do.
We could do a search with the filters applied as "Eminem, Owl City". Now if we use the **\$in** operator we would get a list
of users which either listens to "Eminem" or "Owl City". They wouldn't listen to **BOTH** of the singers in the filter.
But if we use the **\$all** operator, we would get a list of all the users that listens to **BOTH** the singers in the filter.

$all operator is similar to $elemMatch operator but on array of strings or numbers, whereas, \$elemMatch only works on array of sub documents.

```shell
# Find users where each user EITHER listens to eminem OR owl city
db.users.find({ tags: { $in: ['eminem', 'owlCity'] } })

# Find users where each user listens to BOTH eminem AND owl city
db.users.find({ tags: { $all: ['eminem', 'owlCity'] } })
```

> Make sure your array field is indexed, otherwise array operations could take up a lot of time and put load on your Database.

Check [this](https://docs.mongodb.com/manual/reference/operator/query/all/#use-all-with-elemmatch) link for a more complex use of the \$all operator.

Happy Coding 🎉
