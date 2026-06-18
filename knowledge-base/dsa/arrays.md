# Arrays: DSA Guide

## Overview
Arrays are contiguous blocks of memory holding elements of the same type. They offer O(1) time complexity for random access but O(N) for insertion and deletion (unless at the end).

## Key Concepts
- **Static vs Dynamic**: Static arrays have fixed size. Dynamic arrays (like `std::vector` in C++, `ArrayList` in Java, or JavaScript arrays) resize themselves automatically.
- **Multi-dimensional**: Matrices (2D arrays) are very common in interviews, especially for DP and Graph (Grid) problems.

## Common Patterns
- **Two Pointers**: Used heavily for sorted arrays, finding pairs, or reversing an array.
- **Sliding Window**: Ideal for finding subarrays or substrings with specific properties (e.g., maximum sum subarray of size K).
- **Prefix Sum**: Precomputing the sum of elements from the start to index `i`. Allows O(1) range sum queries.
- **Binary Search**: Finding an element in a sorted array in O(log N) time. Can also be used to find "the answer" in a search space (Binary Search on Answer).
- **Kadane's Algorithm**: Finding the maximum contiguous subarray sum.
- **Dutch National Flag**: Sorting an array of 0s, 1s, and 2s in one pass.
