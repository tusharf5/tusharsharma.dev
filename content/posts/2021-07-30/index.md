---
uid: 'css-container-queries'
title: 'CSS Container Queries'
category: 'CSS'
draft: false
tags:
  - css
  - container query
  - css container queries
excerpt: "CSS' new container queries will be a game changer for responsive design. Here's a quick summary of what container queries are and how they are different from CSS media queries"
---

Let's say we have a card component as shown in the below image.

![Component](./component.png)

When we want to use it for large screen sizes, it looks exactly the same. The CSS also remains the same.

```css
.cardComponent {
  /* Style attributes */
}
```

![Large Component](./large-screen.png)

When we want to use it for smaller screen size, we change the layout of it a little. We have to write additional
CSS for this change in the layout. The way we target this screen size in the CSS is by using media queries.

```css
.cardComponent {
  /* Style attributes */
}

/* Apply these styles when window size is less than 756px */
@media screen and (max-width: 756px) {
  .cardComponent {
    /* Overwriting Style attributes */
  }
}
```

![Medium Component](./medium-size.png)

Media queries are very commonly used for responsive design. So what's the fuss about **Container Queries?**. Let's try to understand the problem that container queries will help us solve.

A limitation of using media queries is that the width and height in media queries are based on the window size.

In other words whatever additional CSS you've written to make your UI responsive that CSS will only be triggered
when the size of the window changes.

But do we only want responsiveness when the size of the window changes? If we take the above example, to
change the layout of the following card component, the screen size needs to change from 1080px to 756px.

![Responsiveness](./responsive-comps.png)

This was our only shot at making something responsive by targetting different screen sizes. But if we think about it,
there are use cases when the screen size does not change but we still need to change the layout of a component depending on
where it is placed.

To better understand that use case let's keep the screen size constant and see the below layout.

![Same](./same-screen-diff-parent.png)

You see that even though the screen size remains the same but depending on where our card component is placed we need to
change its layout/structure/stylings. We can't use media queries for this. Media queries only work when the screen size changes.

What if we had a way to write media queries that would target our component's container's width instead of the width of the window. Something like if my component is used in a container of size 400px then add this CSS, it is is being used in a container of size 600px then add this CSS.

That's where the container queries would help us.

So let's say we get a requirement from the design team that we have to create an accordion. If it is being used in a modal
then it needs to look different than when it is rendered on the main layout. It also needs to look different

The way we can achieve this is by using container queries. We would write the base styles for our accordion and then specify that
if the container size is 300 px (inside a dropdown) then apply a separate block of CSS, if the container size is 600px (inside a modal) then apply another block of CSS.

```css
@container (min-width: 600px) {
  .accordian {
    /* styles for when container size is at least 600px */
  }
}

@container (max-width: 300px) {
  .accordian {
    /* styles for when container size is less than 300px */
  }
}
```

This gives us a lot of control over how the component is going to be rendered and also enables re-using a single component
at different places. I am really excited for it to gain good browser support so we can start to leverage it.
