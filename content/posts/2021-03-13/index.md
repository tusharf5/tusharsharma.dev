---
uid: "kadane-algorithm-maximum-subarray"
title: "Understanding Kadane's Algorithm"
category: "CS"
draft: false
tags:
  - maximum-subarray
  - maximum-subarray-problem
  - kadane-algorithm
  - maximum-repeating-substring
  - maximum-sum-subarray
excerpt: "Explanation and implementation of Kadane's algorithm which is one of my favorite algorithms."
---

I like learning about and at least try to solve data structures and algorithm problems. One such family of problems that many of us have probably come across is the **maximum subarray** problems.

A problem that belongs to this family is **maximum sum subarray** problem. You have an array of numbers and you have to find a contiguous subarray such that this contiguous subarray has the **largest sum**.

```go
numbers := []int{-1, 2, -3, 4, -25, -29, 31, 33, 44, -44, -44}

// largest sum is 108
// contiguous subarray that results in
// the above sum is [31 33 44]
```

Another one is you have an array of characters (which could be a string) and you have to find a contiguous subarray such that this contiguous subarray has the largest **non-repeating characters**.

```go
random_str := "aabbccccbbddddeeeefnnghmpqswkkkkwookmkskmkqkqwwmkks"

// maximum contiguous subarray that has
// all non-repeating characters is "nghmpqswk"
```

Similar to the previous one is you have an array of characters and you have to find a contiguous subarray such that this contiguous subarray has the largest **repeating characters**.

```go
random_str := "aabbcccccccbbddddeeeefnnghmpqswkkkkwookmkskmkqkqwwmkks"

// maximum contiguous subarray that has
// all repeating characters is "ccccccc"
```

Brute force solutions work great if the input is small but for larger problems, we look for something more efficient.

One such efficient algorithm to solve the maximum subarray problem is called **Kadane's Algorithm** which is a work of [Prof. Joseph Born Kadane.](https://en.wikipedia.org/wiki/Joseph_Born_Kadane)

Let's try to understand Kadane's algorithm for the maximum sum subarray problem.

Let's say we have an array of length `n` and we have the following pieces of information about it.

- The sum of the maximum subarray for this array. (Best sum)
- The sum of the maximum subarray that ends at the last element. (Current Sum. This might be different from the first value since the first array might not end at the last value)

Let's see an example for each of the scenarios above to make it more clear.

```go
// Case 1 - maximum sum subarray lies somwehere before the last element.
arr_of_numbers := []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7}
// Best sum subarray is {2, 4, 5} which does not end at the last element
// Sum subarray that ends at the last element is {7}

// Case 2 - maximum sum subarray ends at the last element.
arr_of_numbers := []int{1, -2, 1, -2, 3, -3, 4, 6, 9}
// Best sum subarray is {4, 6, 9}
// Sum subarray that ends at the last element is also {4, 6, 9}
```

Whenever you add a new element to an array of length `n`. The maximum sum subarray for this array of length `n+1` is the larger of.

- The `n+1`th element added to the sum of the maximum subarray that ends on the last element. (i.e you just take the previous maximum sum and add this new element to it)
- The `n+1` element by itself.
- The sum of the maximum subarray of the previously `n` length array. (The new element has no effect on the largest sum.)

Let's see some examples of that.

```go
arr_of_numbers := []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7}
// Best sum subarray is {2, 4, 5} which does not end at the last element
// Best sum subarray that ends at the last element is {7}

// Add 3 to it
arr_of_numbers = append(arr_of_numbers, 3)
// New array is []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7, 3}
// Best sum subarray is STILL {2, 4, 5} i.e 11 which does not end at the last element
// Best subarray that ends at the last element is {7, 3} i.e 10

// Add 2 to it
arr_of_numbers = append(arr_of_numbers, 2)
// New array is []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7, 3, 2}
// Best sum subarray is CHANGED to {7, 3, 2} i.e 12 which ends at the last element
// Best sum subarray that ends at the last element is {7, 3, 2} i.e 12

// Add -2 to it
arr_of_numbers = append(arr_of_numbers, -2)
// New array is []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7, 3, 2, -2}
// Best sum subarray is STILL {7, 3, 2} i.e 12 which now does not end at the last element
// Best sum subarray that ends at the last element is {7, 3, 2, -2} i.e 10

// Add 5 to it
arr_of_numbers = append(arr_of_numbers, 5)
// New array is []int{1, -2, 4, -4, 2, 4, 5, -3, -7, -10, 7, 3, 2, -2, 5}
// Best sum subarray is CHANGED {7, 3, 2, -2, 5} i.e 15 which now ends at the last element
// Best sum subarray that ends at the last element is {7, 3, 2, -2, 5} i.e 15
```

So when you are solving it for an array. We try to solve it as if we are given an empty array and we are adding elements to it one by one and computing the maximum as you do that.

Here's an implementation of the algorithm. The implementation is so simple that it does not look as if it would work but that's the beauty of it. We could rewrite the loop in just two lines using the `max` function but I've used `if` statements to make it more clear.

```go
func max_subarray_sum(array []int) float64 {

 best_sum_yet := math.Inf(-1)

 sum_that_ends_at_last_elem := 0

 for i := 0; i < len(array); i++ {

  // we add new element to the current last element
  temp_sum := sum_that_ends_at_last_elem + int(array[i])

  // if it is greater than zero we add it to the sum_that_ends_at_last_elem 
  if temp_sum >= 0 {
   sum_that_ends_at_last_elem = temp_sum
  } else {
   sum_that_ends_at_last_elem = 0
  }

  if sum_that_ends_at_last_elem > int(best_sum_yet) {
   best_sum_yet = float64(sum_that_ends_at_last_elem)
  }
 }

 return best_sum_yet
}

arr := []int{-1, 2, -3, -200, 4, -25, -29, 31, 33, 44, -44, -44, 44, 2, 3, 4, -4, 150}
max_subarray_sum(arr)
```

The `sum_that_ends_at_last_elem` keeps a track of the best sum that ends on the last element. When this value is negative it is
set to 0.

This algorithm can be modified for many different problems that belong to the same family of the maximum subarray.

> Thanks to the internet user who took their time to explain Kadane's algorithm [here](https://www.reddit.com/r/learnprogramming/comments/5mgw7v/how_does_kadanes_algorithm_work_for_all_subarrays/dc3i4uk?utm_source=share&utm_medium=web2x&context=3). This blog post is my expanded version of this comment.

Thanks for reading.
