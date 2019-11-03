---
uid: 'text-encodings-what-every-software-engineer-should-know'
title: 'Text Encodings - What Every Software Engineer Should Know'
category: 'Programming'
draft: false
tags:
  - encodings
excerpt: 'The bare minimum of Text Encodings and Schemes without going too much into details'
---

![Text Encodings - What Every Software Engineer Should Know](./encoding.jpg)

Computers understand binary which is a language based on 0s and 1s.

If I say **"Hello World 123"** the Computer will say the exact same line as
**"01001000 01100101 01111001 00100000 00110001 00110010 00110011"**

In English, it is **A** and in the computer's language(Binary) it is **"01000001"**

Likewise, **B** is **"01001000"** in binary. The 0s and 1s are called bits. A bit can only be either 0 or 1.

> Definition - **Encoding** means converting data into a coded form.

Suppose we have a string **"hello world"**. Now In order to save/transmit this data it
needs to be **encoded** using some kind of encoding scheme so computers
could receive/send/read/write it. There are many encoding schemes and we will discuss a few important ones
in this blog post.

Back in the day computer software were programmed to only understand English(a to z, A to Z), 0 to 9,
some punctuation marks, and a bunch of other characters like space, return, backspace, etc.
A total of 128 such characters. This was called the **ASCII character set**. They were encoded using the **ASCII Encoding** scheme.

## Character Set

It's basically a list of characters that can be formed using a particular encoding scheme.
For example below is a table of ASCII character set.

| Bits Representation (using ASCII Encoding) | Value |
| ------------------------------------------ | ----- |
| 01000001                                   | A     |
| 01000010                                   | B     |
| 01000011                                   | C     |
| 01000100                                   | D     |
| 01000101                                   | E     |
| 01000110                                   | F     |
| ...122 More                                |       |

Everything was looking good until the **Internationalization** of the Internet happened and it started getting
popularity in other countries besides America. People wanted to use the internet in their native
languages but **ASCII Character Set** doesn't provide characters in other languages.

> If someone had sent you an email at that time in french that says **`C'est génial`** you probably would have received
> **`C'est g�nial`** because ASCII encoding doesn't understand the accent letter `é` as it is not able to encode it.

## But Why ASCII does not understand these other characters?

> If it is a specification, why can we just not extend it?

Although ASCII encoding represents every character in its character set with 8 bits. It only makes use of the **first 7 bits**. [See the table above] The last bit is always 0.

`2^7 = 128` (Total number of supported characters in ASCII)

**And that is it. ASCII cannot support more characters than that.**

`2^8 = 256` (Total number of characters that can be supported by 8 bits)

This gave developers an opportunity to extend the character set and support more
characters from other languages.

One thing was for sure that 8 bits (1 byte) are not sufficient to support all the languages
on the planet. So In the meantime, other encoding schemes also came out using more than
one byte to represent characters from different languages like Chinese, Hindi, Latin, etc.

## Unicode

Then came Unicode which unified all the different character representations. Unicode can represent basically any
character that you could possibly think of.

So first thing comes to the mind is that it might be using maybe like 32 bits (4 bytes) to
represent each of its characters and that might be the reason that it's able to support so many
characters. But that's not true. In fact, it doesn't use bytes to represent characters. **It doesn't have to.**
It uses something known as **code points**.

## Code Points

Code points is basically a mapping of numbers to characters and these numbers are called code points.

| Code Point | Value |
| ---------- | ----- |
| 49         | 1     |
| ...        |       |
| 65         | A     |
| 66         | B     |
| 67         | C     |
| ...        |       |
| 1245       | ӝ     |
| 9731       | ☃     |

Now when I said **Unicode doesn't have to use bytes to represent its characters** what I meant was
that Unicode is actually not an encoding scheme.

> Unicode is just an abstract way of representing characters. It is not an encoding.

There are other different ways to encode these Unicode code points to bits (to save on disk or memory) and **Unicode
doesn't provide a solution to that**. Luckily, we have encoding schemes to encode Unicode character representation.

> Unicode is a large table mapping characters to numbers and the different UTF
> encodings specify how these numbers are encoded as bits.

## But why can't we just use 4 bytes to represent each character?

We'll be able to support 4,294,967,296 characters and that's all we need.

```
4 bytes = 32 bits
2^32 = 4,294,967,296
```

**The problem comes with storage.**

To store a simple character "A" using ASCII (1-byte encoding) encoding we need 8 bits of memory i.e "01000001".
If we want to store this blog using ASCII until at this point we would need approx 30620 bits i.e **3,827 bytes**.

To store a simple character "A" using a 4 bytes encoding we need 32 bits of memory i.e "00000000 00000000 00000000 01000001".
If we want to store this blog using a 4 bytes encoding until at this point we would need approx 161,666 bits i.e **16,166 bytes**.

That's **4 times** the size required for ASCII. That's why we need an efficient way to encode these Unicode points without wasting
memory.

## UTF-8 and UTF-16

There are several ways to encode Unicode code points to bits. **UTF-32** is one such way
which stores each code points using **4 bytes** and we just read why it is not an efficient
way to store these characters. **UTF-8** and **UTF-16** are two other such ways.

But UTF-8 and UTF-16 are special as they are variable-length encodings. If a code point can be stored
using a single byte it will store it using a single byte and if a code point requires 2 bytes then it will
encode it using 2 bytes.

> UTF-8 and UTF-16 uses something called a signal bit to determine if a code point is encoded using more than
> one byte. The last bit (8th bit) of a byte is used as a signal to determine if it is using another byte to encode the same character.

That is an efficient way to encode if we only consider the storage size. But reading and processing signal bits too often can
sometimes affect the performance if the data is large. That's a discussion for another day.

Let's see some of the differences between UTF-8 and UTF-16.

| Encoding | Minimum no. of bytes | Maximum no. of bytes | No. of bytes available to use |
| -------- | -------------------- | -------------------- | ----------------------------- |
| UTF-8    | 1                    | 4                    | 1,2,3 and 4                   |
| UTF-16   | 2                    | 4                    | 2 and 4                       |
| UTF-32   | 4                    | 4                    | 4                             |

Unicode code points are written in hexadecimal preceded by a **"U+"** for example A is written as **"U+0041"** which is the
hexadecimal way of writing **65**.

The first 128 characters in UTF-8 are exactly the same characters that are in ASCII character set. Even their bits
representation is exactly the same which gives UTF-8 backward compatibility with ASCII.

## References

- [Encoding](http://kunststube.net/encoding/)
