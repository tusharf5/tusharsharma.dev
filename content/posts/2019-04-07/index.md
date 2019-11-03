---
title: 'How I added a dark mode to my website 🌚'
category: 'CSS'
uid: 'how-i-added-dark-mode-to-my-website'
draft: true
tags:
  - css variables
  - dark mode
  - dynamic css
excerpt: 'It all began with a MacOS update...'
---

Mac OSX a few months back came with the latest version of OSX called **Mojave**. It came with a few cool
features like _Desktop Stacks_ and _New Screenshot Options_ (Cmd + Shift + 5) and the most taled about addition
was the _Dark Mode_ feature.

Like most of us I was excited about the Dark Mode feature. With it, I could make my vs-code color scheme match the OS theme.
Anyways I didn't like it. I don't like the dull balck color of window borders and menu backgrounds.

But I really liked the idea of it. Around that time I also started exploring Gatsby and later migrated my website from Plain HTML, CSS and JS
to Gatsby (loving it so far). Then one day I saw Dan added a new **Switch Mode** button to his website. It had prefect dark mode colors. I wanted to
add a similar button on my website. I knew that it has to do something with CSS Varibles.

A few months late I was reading an article on CSS Variables and I decided to use them on this website for dark mode.

# Why would you want to use CSS variables ?

Before defining what CSS Variables are let's try to understand why something like that even exists.

```css
body {
  background-color: #fafafa;
  color: #2e2e2e;
  font-size: 16px;
}
a {
  color: #448aff;
  text-decoration: underline;
}
dialog {
  background-color: #fafafa;
  color: #2e2e2e;
}
.title {
  color: #000;
}
.subtitle {
  font-size: 14px;
}
.primary-btn {
  background-color: #448aff;
  color: #fff;
  font-size: 14px;
}
```

```css
$body-bg-color: #fafafa;
$body-color: #2e2e2e;
$body-font-size: 16px;
$primary-color: #448aff;
$title-color: #000;
$subtitle-font-size: 14px;
$button-font-size: 14px;

body {
  background-color: $body-bg-color;
  color: $body-color;
  font-size: $body-font-size;
}
a {
  color: $primary-color;
  text-decoration: underline;
}
dialog {
  background-color: $body-bg-color;
  color: $body-color;
}
.title {
  color: $title-color;
}
.subtitle {
  font-size: $subtitle-font-size;
}
.primary-btn {
  background-color: $primary-color
  color: #fff;
  font-size: $subtitle-font-size;
}
```

# What are CSS variables ?

# How to use CSS Variables ?

# How I am using CSS Variables ?
