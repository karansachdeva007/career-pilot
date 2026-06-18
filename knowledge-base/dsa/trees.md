# Trees: DSA Guide

## Overview
A Tree is a hierarchical data structure consisting of nodes connected by edges. The topmost node is the root. Trees are fundamental for many advanced data structures like Heaps, Tries, and Graphs.

## Key Types
- **Binary Tree**: Each node has at most two children.
- **Binary Search Tree (BST)**: A binary tree where the left child is smaller than the parent, and the right child is greater.
- **Balanced Trees**: AVL, Red-Black Trees (keeps height to O(log N)).
- **Trie (Prefix Tree)**: Used for efficient string matching and autocomplete.

## Traversals
- **In-order**: Left, Root, Right. In a BST, this prints nodes in sorted order.
- **Pre-order**: Root, Left, Right. Good for copying a tree.
- **Post-order**: Left, Right, Root. Good for deleting a tree.
- **Level-order**: BFS using a queue.

## Common Patterns
- **Recursion**: Almost all tree problems can be solved elegantly with recursion.
- **Lowest Common Ancestor (LCA)**: Finding the shared parent of two nodes.
- **Path Sums**: Finding if a path from root to leaf equals a target.
- **Serialization/Deserialization**: Converting a tree to a string and back.
